import { getAllPostCached, getBlogPostCached } from "@/features/blog/actions";
import { notFound } from "next/navigation";
import { renderBlocks } from "@/components/notion/render-blocks";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import type { Metadata, ResolvingMetadata } from "next";
import ShareButton from "@/components/share-button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import SectionContainer from "@/components/section-container";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { slug } = await params;
  const content = await getBlogPostCached(slug);
  // optionally access and extend (rather than replace) parent metadata
  const parentMetadata = await parent;
  const previousImages = parentMetadata.openGraph?.images || [];

  if (!content)
    return {
      title: parentMetadata.title,
      description: parentMetadata.description,
    };
  return {
    title: content.post?.title,
    description: content.post?.title,
    openGraph: {
      images: content.post?.cover
        ? [
            {
              url: content.post?.cover,
            },
          ]
        : previousImages,
    },
  };
}

export const revalidate = 3600;

export async function generateStaticParams() {
  const blogs: { slug: string }[] = [];
  let cursor: string | undefined = undefined;
  do {
    const res = await getAllPostCached(true, cursor);
    if (res.blogs) blogs.push(...res.blogs);
    cursor = res.next_cursor ?? undefined;
    if (res.error) break;
  } while (cursor);
  return blogs.slice(0, 20).map((p) => ({ slug: p.slug }));
}

const BlogPostPage = async ({ params }: Props) => {
  const { slug } = await params;
  const content = await getBlogPostCached(slug);
  if (!content) return notFound();
  if (!content.success)
    return (
      <div>
        <h1 className="text-xl">Ooops!</h1>
        <p>Failed to fetch blog post, try refresh the page!</p>
      </div>
    );
  return (
    <SectionContainer className="max-w-4xl">
      {/* Frontmater */}
      <div className="space-y-3">
        {content.post?.cover && (
          <Image
            src={content.post.cover}
            alt={content.post.slug}
            width={700}
            height={700}
            sizes="(max-width:768px) 100vw, 700px"
            className="aspect-video w-full rounded-md object-cover"
          />
        )}
        <span className="font-mono text-sm">
          By {content.post?.author} • {content.post?.publishedDate}
        </span>
        <h1 className="text-primary text-2xl font-bold">
          {content.post?.title}
        </h1>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {content.post?.categories.map((tag) => (
              <Link key={tag.name} href={`/blog?category=${tag.name}`}>
                <Badge
                  variant="secondary"
                  style={{
                    backgroundColor: tag.color,
                  }}
                >
                  {tag.name}
                </Badge>
              </Link>
            ))}
          </div>

          <ShareButton />
        </div>
      </div>

      <Separator className="my-5" />

      {/* Content */}
      <div className="w-full space-y-4">
        {renderBlocks({ blocks: content.content })}
      </div>
    </SectionContainer>
  );
};

export default BlogPostPage;
