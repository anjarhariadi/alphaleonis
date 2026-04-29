import type { BlogPost } from "./dto";

export function extractNotionPage(page: any): BlogPost {
  const properties = page.properties;
  return {
    id: page.id,
    title: properties.Title?.title[0]?.plain_text || "",
    slug: page.url.split("/").pop() || "",
    categories: properties["Categories"]?.multi_select || [],
    published: properties["Published"]?.checkbox || false,
    publishedDate: properties["Published Date"]?.date?.start || "",
    author: properties.Author.people[0]?.name || "",
    cover: page.cover?.file?.url || null,
  };
}
