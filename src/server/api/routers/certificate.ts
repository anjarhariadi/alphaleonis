import {
  addCertificateSchema,
  editCertificateSchema,
} from "@/features/certificate/schema";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { Bucket } from "@/lib/supabase/bucket";
import { deleteStoredFile, uploadBase64 } from "@/lib/supabase/upload";
import { supabaseAdminClient } from "@/lib/supabase/server";
import z from "zod";

export const certificateRouter = createTRPCRouter({
  get: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.certificate.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
    });
  }),

  add: protectedProcedure
    .input(addCertificateSchema)
    .mutation(async ({ ctx, input }) => {
      const filename = `certification-${crypto.randomUUID()}.jpeg`;
      const imageUrl = await uploadBase64({
        bucket: Bucket.CERTIFICATE,
        filename,
        base64: input.image,
        contentType: "image/jpeg",
      });
      const { image, ...rest } = input;
      try {
        return await ctx.db.certificate.create({
          data: {
            ...rest,
            image: imageUrl,
          },
        });
      } catch (e) {
        await supabaseAdminClient.storage
          .from(Bucket.CERTIFICATE)
          .remove([filename])
          .catch(() => {});
        throw e;
      }
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
      let filename: string | undefined = undefined;
      if (input.data.image) {
        filename = `certification-${crypto.randomUUID()}.jpeg`;
        imageUrl = await uploadBase64({
          bucket: Bucket.CERTIFICATE,
          filename,
          base64: input.data.image,
          contentType: "image/jpeg",
        });
      }

      const { image, ...rest } = input.data;
      const existing = await ctx.db.certificate.findUnique({
        where: { id: input.id },
        select: { image: true },
      });
      try {
        const updated = await ctx.db.certificate.update({
          where: { id: input.id },
          data: {
            ...rest,
            ...(imageUrl ? { image: imageUrl } : {}),
          },
        });
        if (imageUrl && existing?.image) {
          await deleteStoredFile(Bucket.CERTIFICATE, existing.image).catch(
            () => {},
          );
        }
        return updated;
      } catch (e) {
        if (filename) {
          await supabaseAdminClient.storage
            .from(Bucket.CERTIFICATE)
            .remove([filename])
            .catch(() => {});
        }
        throw e;
      }
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const existing = await ctx.db.certificate.findUnique({
        where: { id: input.id },
        select: { image: true },
      });
      if (existing?.image) {
        await deleteStoredFile(Bucket.CERTIFICATE, existing.image).catch(
          () => {},
        );
      }
      return ctx.db.certificate.delete({ where: { id: input.id } });
    }),
});
