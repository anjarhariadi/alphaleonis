import { ArrowLeft, Github, MoveRight } from "lucide-react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getPortfolioByIdCached } from "@/features/landing/actions";
import { buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Metadata, ResolvingMetadata } from "next";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { id } = await params;
  const portfolio = await getPortfolioByIdCached(parseInt(id));
  const parentMetadata = await parent;
  const previousImages = parentMetadata.openGraph?.images || [];

  if (!portfolio) {
    return {
      title: parentMetadata.title,
      description: parentMetadata.description,
    };
  }

  return {
    title: portfolio.title,
    description: portfolio.description,
    openGraph: {
      images: portfolio.image ? [{ url: portfolio.image }] : previousImages,
    },
  };
}

export default async function PortfolioBriefPage({ params }: Props) {
  const { id } = await params;
  const portfolio = await getPortfolioByIdCached(parseInt(id));

  if (!portfolio) {
    return notFound();
  }

  return (
    <div className="container mx-auto max-w-4xl space-y-6 p-3">
      <Link href="/" className={buttonVariants({ variant: "link" })}>
        <ArrowLeft /> Back to Home
      </Link>

      {/* Hero image */}
      {portfolio.image && (
        <div className="relative aspect-video w-full overflow-hidden rounded-xl">
          <Image
            src={portfolio.image}
            alt={portfolio.title}
            fill
            className="object-cover"
          />
        </div>
      )}

      {/* Title and tags */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">{portfolio.title}&apos;s Brief</h1>
        <div className="flex flex-wrap gap-2">
          {portfolio.tag.map((tag: string) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      {/* Brief content */}
      <div
        className="prose prose-lg dark:prose-invert tiptap-content max-w-none rounded-xl border p-3"
        dangerouslySetInnerHTML={{ __html: portfolio.brief }}
      />

      {/* Action buttons */}
      <div className="flex gap-4 border-t pt-6">
        {portfolio.url && (
          <a
            href={portfolio.url}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ size: "lg", variant: "outline" }))}
          >
            <MoveRight /> Try It
          </a>
        )}
        {portfolio.githubUrl && (
          <a
            href={portfolio.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(buttonVariants({ size: "lg", variant: "outline" }))}
          >
            <Github /> View on Github
          </a>
        )}
      </div>
    </div>
  );
}
