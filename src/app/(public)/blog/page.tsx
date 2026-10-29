import type { Metadata } from "next";
import Link from "next/link";
import SectionContainer from "@/components/section-container";
import { getAllPosts } from "@/features/blog/source";
import type { BlogPost } from "@/features/blog/dto";
import { formatDate } from "@/lib/format-date";
import { cn } from "@/lib/utils";
import { Badge, badgeVariants } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "Blog",
  description: "Articles on software engineering and things I am exploring.",
};

type Props = {
  searchParams: Promise<{ category?: string }>;
};

function Entry({ post }: { post: BlogPost }) {
  const external = post.source === "external";
  const body = (
    <>
      <div className="text-muted-foreground flex items-baseline gap-3 font-mono text-[11px] tracking-wide uppercase sm:block sm:pt-[0.4em]">
        <time dateTime={post.publishedDate} className="tabular-nums">
          {formatDate(post.publishedDate)}
        </time>
        {external && post.platform && (
          <span className="sm:mt-1 sm:block">
            {post.platform} <span aria-hidden="true">↗</span>
          </span>
        )}
      </div>

      <div className="min-w-0 space-y-2">
        <h3 className="group-hover:text-primary group-focus-visible:text-primary font-sans text-lg leading-tight font-bold tracking-[-0.015em] transition-colors">
          {post.title}
        </h3>
        <div className="flex flex-wrap gap-2">
          {post.categories.map((tag) => (
            <Badge key={tag} variant="outline">
              {tag}
            </Badge>
          ))}
        </div>

        {external && <span className="sr-only"> (opens in a new tab)</span>}
      </div>
    </>
  );

  const className =
    "group grid grid-cols-1 gap-y-2 border-b border-border py-6 transition-colors first:border-t hover:bg-foreground/[0.03] focus-visible:bg-foreground/[0.03] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-x-8 sm:gap-y-0";

  if (external && post.externalUrl) {
    return (
      <a
        href={post.externalUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {body}
      </a>
    );
  }

  return (
    <Link prefetch href={`/blog/${post.slug}`} className={className}>
      {body}
    </Link>
  );
}

function Group({ title, posts }: { title: string; posts: BlogPost[] }) {
  if (posts.length === 0) return null;
  return (
    <section>
      <h2 className="text-muted-foreground pb-3 font-mono text-[13px] font-medium tracking-[0.14em] uppercase">
        {title}
      </h2>
      <div>
        {posts.map((post) => (
          <Entry key={`${post.source}-${post.slug}`} post={post} />
        ))}
      </div>
    </section>
  );
}

export default async function BlogListPage({ searchParams }: Props) {
  const { category } = await searchParams;
  const allPosts = await getAllPosts();
  const categories = [
    ...new Set(allPosts.flatMap((post) => post.categories)),
  ].sort((a, b) => a.localeCompare(b));
  const posts = category
    ? allPosts.filter((post) => post.categories.includes(category))
    : allPosts;

  return (
    <SectionContainer className="mb-20 max-w-4xl">
      <article className="w-full">
        <header className="mb-6">
          <h1 className="font-sans text-3xl font-extrabold tracking-tight">
            Welcome to My Blog
          </h1>
        </header>

        <nav
          aria-label="Filter by category"
          className="mb-8 flex flex-wrap items-baseline gap-x-4 gap-y-2 font-mono text-xs tracking-[0.14em] uppercase"
        >
          <Link
            href="/blog"
            className={cn(
              "hover:text-foreground transition-colors",
              category ? "text-muted-foreground" : "text-primary",
            )}
          >
            All
          </Link>
          {categories.map((tag) => (
            <Link
              key={tag}
              href={`/blog?category=${encodeURIComponent(tag)}`}
              className={cn(
                badgeVariants({
                  variant: tag === category ? "secondary" : "outline",
                }),
                "cursor-pointer",
              )}
            >
              {tag}
            </Link>
          ))}
        </nav>

        {posts.length === 0 ? (
          <p className="text-muted-foreground py-10">
            {category ? "No posts in this category." : "No posts yet."}
          </p>
        ) : (
          <div className="space-y-11">
            <Group
              title="On this site"
              posts={posts.filter((post) => post.source === "local")}
            />
            <Group
              title="Elsewhere"
              posts={posts.filter((post) => post.source === "external")}
            />
          </div>
        )}
      </article>
    </SectionContainer>
  );
}
