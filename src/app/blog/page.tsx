"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  getAllPost,
  getCategories,
  getCategoriesCached,
} from "@/features/blog/actions";
import type { BlogPost } from "@/features/blog/dto";
import { useQuery } from "@tanstack/react-query";
import { error } from "console";
import { Loader } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useQueryState } from "nuqs";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const BlogListPage = () => {
  const [category, setCategory] = useQueryState("category");
  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ["allCategory"],
    queryFn: () =>
      getCategoriesCached().then((res) => {
        if (res.error) {
          toast.error(res.error);
        }
        return res.data;
      }),
  });

  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [nextCursor, setNextCursor] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const fetchInitial = async () => {
      setIsLoading(true);
      await getAllPost(true, undefined, category)
        .then((res) => {
          if (res.blogs) {
            setBlogs(res.blogs);
            setNextCursor(res.next_cursor ?? undefined);
            setHasMore(!!res.next_cursor);
          }
          if (res.error) {
            toast.error(res.error);
          }
        })
        .finally(() => setIsLoading(false));
    };
    setBlogs([]);
    fetchInitial();
  }, [category]);

  const handleLoadMore = async () => {
    if (!nextCursor) return;
    setIsLoading(true);
    await getAllPost(true, nextCursor, category)
      .then((res) => {
        if (res.blogs) {
          setBlogs([...blogs, ...res.blogs]);
          setNextCursor(res.next_cursor ?? undefined);
          setHasMore(!!res.next_cursor);
        }
        if (res.error) {
          toast.error(res.error);
        }
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <>
      <div className="items-center space-y-4">
        <h1 className="text-center text-4xl font-bold">Welcome to My Blog</h1>
        <p className="text-center text-lg">Here you can find my blog posts.</p>

        <div className="flex items-center gap-2">
          {categories?.map((tag) => (
            <Badge
              key={tag.name}
              variant={tag.name === category ? "secondary" : "outline"}
              onClick={() => setCategory(tag.name)}
              className="cursor-pointer"
            >
              {tag.name}
            </Badge>
          ))}
        </div>

        {isLoading && blogs.length === 0 ? (
          <Loader className="mx-auto animate-spin" />
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex-1 space-y-3">
              {blogs?.map((blog) => (
                <Card key={blog.id} className="hover:border-primary">
                  <CardContent className="flex flex-col gap-2 md:flex-row">
                    {blog.cover && (
                      <Image
                        src={blog.cover}
                        alt={blog.slug}
                        width={700}
                        height={700}
                        className="aspect-video rounded-md object-cover md:max-w-1/3"
                      />
                    )}

                    <Link
                      prefetch
                      href={`/blog/${blog.slug}`}
                      className="space-y-2"
                    >
                      <h1 className="text-primary text-xl font-bold">
                        {blog.title}
                      </h1>
                      <div className="flex items-center gap-2">
                        {blog.categories.map((tag) => (
                          <Badge
                            key={tag.name}
                            variant="secondary"
                            style={{
                              backgroundColor: tag.color,
                            }}
                          >
                            {tag.name}
                          </Badge>
                        ))}
                      </div>
                      <p>
                        By {blog.author} • {blog.publishedDate}
                      </p>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Button
              onClick={handleLoadMore}
              disabled={isLoading || !hasMore}
              className="w-full"
            >
              {isLoading ? (
                <Loader className="animate-spin" />
              ) : (
                <>Load Older Post</>
              )}
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default BlogListPage;
