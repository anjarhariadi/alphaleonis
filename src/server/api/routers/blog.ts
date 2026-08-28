import { notion } from "@/lib/notion/server";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { env } from "@/env";
import type { BlogPost } from "@/features/blog/dto";
import { extractNotionPage } from "@/features/blog/utils";
import z from "zod";

export const blogRouter = createTRPCRouter({
  getPublished: publicProcedure
    .input(
      z.object({
        start_cursor: z.string().optional(),
      }),
    )
    .query(async ({ input }) => {
      // const response = await notion.databases.retrieve({
      //   database_id: env.NOTION_BLOG_DATABASE_ID,
      // });
      const response = await notion.dataSources.query({
        data_source_id: env.NOTION_BLOG_DATASOURCE_ID,
        filter: {
          property: "Published",
          checkbox: {
            equals: true,
          },
        },
        page_size: 10,
        start_cursor: input.start_cursor,
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
    }),
});
