import z from "zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { portfolioSchema } from "@/features/portfolio/schema";
import { Bucket } from "@/lib/supabase/bucket";
import { uploadBase64 } from "@/lib/supabase/upload";

export const portfolioRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.db.portfolio.findMany();
  }),

  get: publicProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .query(({ ctx, input }) => {
      return ctx.db.portfolio.findUnique({
        where: {
          id: input.id,
        },
      });
    }),

  add: protectedProcedure
    .input(portfolioSchema)
    .mutation(async ({ ctx, input }) => {
      let imageUrl: string | undefined = undefined;
      if (input.image) {
        imageUrl = await uploadBase64({
          bucket: Bucket.PORTFOLIO,
          filename: `portfolio-${crypto.randomUUID()}.jpeg`,
          base64: input.image,
          contentType: "image/jpeg",
        });
      }
      const { image, ...rest } = input;
      return ctx.db.portfolio.create({
        data: {
          ...rest,
          ...(imageUrl ? { image: imageUrl } : {}),
        },
      });
    }),

  edit: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        data: portfolioSchema,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      let imageUrl: string | undefined = undefined;
      if (input.data.image) {
        imageUrl = await uploadBase64({
          bucket: Bucket.PORTFOLIO,
          filename: `portfolio-${crypto.randomUUID()}.jpeg`,
          base64: input.data.image,
          contentType: "image/jpeg",
        });
      }
      const { image, ...rest } = input.data;
      return ctx.db.portfolio.update({
        where: { id: input.id },
        data: {
          ...rest,
          ...(imageUrl ? { image: imageUrl } : {}),
        },
      });
    }),

  toggleVisibility: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const portfolio = await ctx.db.portfolio.findUnique({
        where: {
          id: input.id,
        },
      });

      if (!portfolio) return;

      return ctx.db.portfolio.update({
        where: { id: input.id },
        data: {
          visible: !portfolio.visible,
        },
      });
    }),

  delete: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      }),
    )
    .mutation(({ ctx, input }) => {
      return ctx.db.portfolio.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
