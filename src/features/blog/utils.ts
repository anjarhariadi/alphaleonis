import type { BlogPost, BlogCategory } from "./dto";

type NotionProperty = Partial<{
  title: { plain_text?: string }[];
  multi_select: { name?: string }[];
  checkbox: boolean;
  date: { start?: string };
  people: { name?: string }[];
}>;

type NotionPage = {
  id: string;
  url: string;
  properties: Record<string, NotionProperty | undefined>;
  cover?: { file?: { url?: string } } | null;
};

export function extractNotionPage(page: unknown): BlogPost {
  const p = page as NotionPage;
  const properties = p.properties;
  return {
    id: p.id,
    title: properties.Title?.title?.[0]?.plain_text || "",
    slug: p.url.split("/").pop() || "",
    categories: (properties["Categories"]?.multi_select ||
      []) as BlogCategory[],
    published: properties["Published"]?.checkbox || false,
    publishedDate: properties["Published Date"]?.date?.start || "",
    author: properties.Author?.people?.[0]?.name || "",
    cover: p.cover?.file?.url || null,
  };
}
