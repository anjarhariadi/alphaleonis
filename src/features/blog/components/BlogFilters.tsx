"use client";

import SectionContainer from "@/components/section-container";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getAllPost, getCategoriesCached } from "@/features/blog/actions";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useQueryState } from "nuqs";
import { toast } from "sonner";

export default function BlogFilters() {
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

  const {
    data,
    isLoading,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["blogs", category],
    queryFn: ({ pageParam }) => getAllPost(true, pageParam, category),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (res) => res.next_cursor ?? undefined,
  });

  const blogs = data?.pages.flatMap((res) => res.blogs ?? []) ?? [];

  return (
    <SectionContainer>
      <div className="items-center space-y-4">
        <h1 className="text-center text-4xl font-bold">Welcome to My Blog</h1>
        <p className="text-center text-lg">Here you can find my blog posts.</p>

        <div className="flex items-center gap-2">
          {isLoadingCategories && "Loading categories..."}
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
                        sizes="(max-width:768px) 100vw, 700px"
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
              onClick={() => fetchNextPage()}
              disabled={isFetchingNextPage || !hasNextPage}
              className="w-full"
            >
              {isFetchingNextPage ? (
                <Loader className="animate-spin" />
              ) : (
                <>Load Older Post</>
              )}
            </Button>
          </div>
        )}
      </div>
    </SectionContainer>
  );
}
