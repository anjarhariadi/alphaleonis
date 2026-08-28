import z from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { portfolioSchema } from "@/features/portfolio/schema";
import { Bucket } from "@/lib/supabase/bucket";
import { deleteStoredFile, uploadBase64 } from "@/lib/supabase/upload";
import { supabaseAdminClient } from "@/lib/supabase/server";

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
      let filename: string | undefined = undefined;
      if (input.image) {
        filename = `portfolio-${crypto.randomUUID()}.jpeg`;
        try {
          imageUrl = await uploadBase64({
            bucket: Bucket.PORTFOLIO,
            filename,
            base64: input.image,
            contentType: "image/jpeg",
          });
        } catch (e) {
          throw e;
        }
      }
      const { image, ...rest } = input;
      try {
        return await ctx.db.portfolio.create({
          data: {
            ...rest,
            ...(imageUrl ? { image: imageUrl } : {}),
          },
        });
      } catch (e) {
        if (filename) {
          await supabaseAdminClient.storage
            .from(Bucket.PORTFOLIO)
            .remove([filename])
            .catch(() => {});
        }
        throw e;
      }
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
      let filename: string | undefined = undefined;
      if (input.data.image) {
        filename = `portfolio-${crypto.randomUUID()}.jpeg`;
        imageUrl = await uploadBase64({
          bucket: Bucket.PORTFOLIO,
          filename,
          base64: input.data.image,
          contentType: "image/jpeg",
        });
      }
      const { image, ...rest } = input.data;
      const existing = await ctx.db.portfolio.findUnique({
        where: { id: input.id },
        select: { image: true },
      });
      try {
        const updated = await ctx.db.portfolio.update({
          where: { id: input.id },
          data: {
            ...rest,
            ...(imageUrl ? { image: imageUrl } : {}),
          },
        });
        if (imageUrl && existing?.image) {
          await deleteStoredFile(Bucket.PORTFOLIO, existing.image).catch(
            () => {},
          );
        }
        return updated;
      } catch (e) {
        if (filename) {
          await supabaseAdminClient.storage
            .from(Bucket.PORTFOLIO)
            .remove([filename])
            .catch(() => {});
        }
        throw e;
      }
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

      if (!portfolio)
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Portfolio not found",
        });

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
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.portfolio.findUnique({
        where: { id: input.id },
        select: { image: true },
      });
      if (existing?.image) {
        await deleteStoredFile(Bucket.PORTFOLIO, existing.image).catch(
          () => {},
        );
      }
      return ctx.db.portfolio.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
