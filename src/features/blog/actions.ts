"use server";

import type { BlogCategory, BlogPost, BlogPostContent } from "./dto";
import { extractPageId, type NotionClientError } from "@notionhq/client";
import { notion } from "@/lib/notion/server";
import { extractNotionPage } from "./utils";
import { env } from "@/env";
import { cached } from "@/lib/cache";

export const getCategoriesCached = cached(getCategories, "blog-categories", {
  tags: ["blog"],
  revalidate: 3600,
});
export const getAllPostCached = cached(getAllPost, "blog-posts", {
  tags: ["blog"],
  revalidate: 3600,
});
export const getBlogPostCached = cached(getBlogPost, "blog-post", {
  tags: ["blog"],
  revalidate: 3600,
});

export async function getCategories() {
  try {
    const db = await notion.dataSources.retrieve({
      data_source_id: env.NOTION_BLOG_DATASOURCE_ID,
    });
    return {
      data: (
        db.properties.Categories as unknown as {
          multi_select: { options: BlogCategory[] };
        }
      ).multi_select.options as BlogCategory[],
    };
  } catch (error) {
    return {
      error: (error as NotionClientError).message,
    };
  }
}

export async function getAllPost(
  pagination: boolean,
  start_cursor: string | undefined,
  category?: string | null,
) {
  try {
    const response = await notion.dataSources.query({
      data_source_id: env.NOTION_BLOG_DATASOURCE_ID,
      filter: category
        ? {
            and: [
              {
                property: "Published",
                checkbox: {
                  equals: true,
                },
              },
              {
                property: "Categories",
                multi_select: {
                  contains: category,
                },
              },
            ],
          }
        : {
            property: "Published",
            checkbox: {
              equals: true,
            },
          },
      page_size: 10,
      start_cursor: start_cursor,
      sorts: [
        {
          property: "Published Date",
          direction: "descending",
        },
      ],
    });

    const blogs = response.results.map((page): BlogPost => {
      return extractNotionPage(page);
    });

    return {
      blogs,
      next_cursor: response.next_cursor,
    };
  } catch (error) {
    return {
      error: (error as NotionClientError).message,
    };
  }
}

export async function getBlogPost(
  slug: string,
): Promise<BlogPostContent | null> {
  const pageId = extractPageId(slug);

  if (!pageId) return null;

  try {
    const page = await notion.pages.retrieve({ page_id: pageId });
    // paginate blocks — Notion returns max 100 per request
    const blocks: BlogPostContent["content"] = [];
    let cursor: string | undefined = undefined;
    let hasMore = true;
    while (hasMore) {
      const res = (await notion.blocks.children.list({
        block_id: pageId,
        start_cursor: cursor,
        page_size: 100,
      })) as unknown as {
        results: BlogPostContent["content"];
        has_more: boolean;
        next_cursor: string | null;
      };
      blocks.push(...res.results);
      hasMore = res.has_more;
      cursor = res.next_cursor ?? undefined;
    }

    return {
      post: extractNotionPage(page),
      content: blocks,
      success: true,
    };
  } catch (error) {
    return {
      post: null,
      content: [],
      success: false,
    };
  }
}
