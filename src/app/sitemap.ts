import { env } from "@/env";
import { getAllPostCached } from "@/features/blog/actions";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const allBlogs: { slug: string }[] = [];
  let cursor: string | undefined = undefined;

  do {
    const res = await getAllPostCached(true, cursor);
    if (res.blogs) allBlogs.push(...res.blogs);
    cursor = res.next_cursor ?? undefined;
    if (res.error) break;
  } while (cursor);

  const generatedUrls: MetadataRoute.Sitemap = allBlogs.map((post) => ({
    url: `${env.NEXT_PUBLIC_BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(),
  }));

  return [
    {
      url: env.NEXT_PUBLIC_BASE_URL,
      lastModified: new Date(),
    },
    {
      url: `${env.NEXT_PUBLIC_BASE_URL}/blog`,
      lastModified: new Date(),
    },
    ...generatedUrls,
  ];
}
