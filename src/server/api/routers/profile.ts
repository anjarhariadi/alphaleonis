import { profileSchema } from "@/features/profile/schema";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import {
  Bucket,
  MAX_FILE_SIZE_FILE,
  MAX_FILE_SIZE_IMAGE,
} from "@/lib/supabase/bucket";
import { supabaseAdminClient } from "@/lib/supabase/server";

export const profileRouter = createTRPCRouter({
  get: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.profile.findFirst();
  }),

  update: protectedProcedure
    .input(profileSchema)
    .mutation(async ({ input, ctx }) => {
      const tmp = new Date().getTime().toString();

      // if there are input.image and input.resume, upload to supabase storage
      let imageUrl: string | undefined = undefined;
      if (input.image) {
        const fileName = `my-image.jpeg`;
        const buffer = Buffer.from(input.image, "base64");

        if (buffer.byteLength > MAX_FILE_SIZE_IMAGE) {
          throw new Error("Ukuran gambar tidak boleh lebih dari 5MB");
        }

        const { data, error } = await supabaseAdminClient.storage
          .from(Bucket.PROFILE)
          .upload(fileName, buffer, {
            contentType: "image/jpeg",
            cacheControl: "3600",
            upsert: true,
          });
        if (error) throw new Error(error.message);
        imageUrl = supabaseAdminClient.storage
          .from(Bucket.PROFILE)
          .getPublicUrl(data.path).data.publicUrl;
      }

      let resumeUrl: string | undefined = undefined;
      if (input.resume) {
        const fileName = `my-resume.pdf`;
        const buffer = Buffer.from(input.resume, "base64");

        if (buffer.byteLength > MAX_FILE_SIZE_FILE) {
          throw new Error("Ukuran file tidak boleh lebih dari 10MB");
        }

        const { data, error } = await supabaseAdminClient.storage
          .from(Bucket.PROFILE)
          .upload(fileName, buffer, {
            contentType: "application/pdf",
            cacheControl: "3600",
            upsert: true,
          });
        if (error) throw new Error(error.message);
        resumeUrl = supabaseAdminClient.storage
          .from(Bucket.PROFILE)
          .getPublicUrl(data.path).data.publicUrl;
      }

      //   Check if there is any existing profile
      const existingProfile = await ctx.db.profile.findFirst();

      if (existingProfile) {
        return ctx.db.profile.update({
          where: { id: existingProfile.id },
          data: {
            ...input,
            image: imageUrl ? `${imageUrl}?t=${tmp}` : undefined,
            resume: resumeUrl ? `${resumeUrl}?t=${tmp}` : undefined,
          },
        });
      }

      // ponytail: create requires image/resume; undefined will error intentionally — make optional in schema if nullable needed
      return ctx.db.profile.create({
        data: {
          ...input,
          image: imageUrl
            ? `${imageUrl}?t=${tmp}`
            : (undefined as unknown as string),
          resume: resumeUrl
            ? `${resumeUrl}?t=${tmp}`
            : (undefined as unknown as string),
        },
        select: {
          id: true,
        },
      });
    }),
});
