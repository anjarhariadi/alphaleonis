import { experienceSchema } from "@/features/experience/schema";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import z from "zod";

export const experienceRouter = createTRPCRouter({
  get: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.experience.findMany({
      orderBy: {
        index: "asc",
      },
      take: 50,
    });
  }),

  add: protectedProcedure
    .input(experienceSchema)
    .mutation(async ({ ctx, input }) => {
      return ctx.db.experience.create({
        data: input,
      });
    }),

  edit: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        data: experienceSchema,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.experience.update({
        where: { id: input.id },
        data: input.data,
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.experience.delete({
        where: { id: input.id },
      });
    }),
});
