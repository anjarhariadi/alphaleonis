"use server";

import { cache } from "react";
import type { BlogCategory, BlogPost, BlogPostContent } from "./dto";
import { extractPageId, type NotionClientError } from "@notionhq/client";
import { notion } from "@/lib/notion/server";
import { extractNotionPage } from "./utils";
import { env } from "@/env";

export const getCategoriesCached = cache(getCategories);
export const getAllPostCached = cache(getAllPost);
export const getBlogPostCached = cache(getBlogPost);

export async function getCategories() {
  try {
    const db = await notion.dataSources.retrieve({
      data_source_id: env.NOTION_BLOG_DATASOURCE_ID,
    });
    return {
      data: (db.properties.Categories as any).multi_select
        .options as BlogCategory[],
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
      page_size: pagination ? 10 : undefined,
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
    const content = await notion.blocks.children.list({ block_id: pageId });

    return {
      post: extractNotionPage(page),
      content: content.results,
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
