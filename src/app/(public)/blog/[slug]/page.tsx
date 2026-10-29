import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import SectionContainer from "@/components/section-container";
import ShareButton from "@/components/share-button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { BlogMarkdown } from "@/features/blog/components/BlogMarkdown";
import { getAllPosts, getPost } from "@/features/blog/source";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts
    .filter((post) => post.source === "local")
    .map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.title,
    openGraph: post.cover ? { images: [{ url: post.cover }] } : undefined,
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  return (
    <SectionContainer className="max-w-4xl">
      <div className="space-y-3">
        {post.cover && (
          <Image
            src={post.cover}
            alt={post.title}
            width={700}
            height={700}
            sizes="(max-width:768px) 100vw, 700px"
            className="aspect-video w-full rounded-md object-cover"
          />
        )}
        <span className="font-mono text-sm">
          By {post.author} • {post.publishedDate}
        </span>
        <h1 className="text-primary text-2xl font-bold">{post.title}</h1>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {post.categories.map((name) => (
              <Link
                key={name}
                href={`/blog?category=${encodeURIComponent(name)}`}
              >
                <Badge variant="secondary">{name}</Badge>
              </Link>
            ))}
          </div>
          <ShareButton />
        </div>
      </div>

      <Separator className="my-5" />

      <BlogMarkdown content={post.content} slug={post.slug} />
    </SectionContainer>
  );
}
