import {
  addCertificateSchema,
  editCertificateSchema,
} from "@/features/certificate/schema";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { Bucket } from "@/lib/supabase/bucket";
import { uploadBase64 } from "@/lib/supabase/upload";
import z from "zod";

export const certificateRouter = createTRPCRouter({
  get: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.certificate.findMany();
  }),

  add: protectedProcedure
    .input(addCertificateSchema)
    .mutation(async ({ ctx, input }) => {
      const imageUrl = await uploadBase64({
        bucket: Bucket.CERTIFICATE,
        filename: `certification-${crypto.randomUUID()}.jpeg`,
        base64: input.image,
        contentType: "image/jpeg",
      });
      const { image, ...rest } = input;
      return ctx.db.certificate.create({
        data: {
          ...rest,
          image: imageUrl,
        },
      });
    }),

  edit: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        data: editCertificateSchema,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      let imageUrl: string | undefined = undefined;
      if (input.data.image) {
        imageUrl = await uploadBase64({
          bucket: Bucket.CERTIFICATE,
          filename: `certification-${crypto.randomUUID()}.jpeg`,
          base64: input.data.image,
          contentType: "image/jpeg",
        });
      }

      const { image, ...rest } = input.data;
      return ctx.db.certificate.update({
        where: { id: input.id },
        data: {
          ...rest,
          ...(imageUrl ? { image: imageUrl } : {}),
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.certificate.delete({ where: { id: input.id } });
    }),
});
