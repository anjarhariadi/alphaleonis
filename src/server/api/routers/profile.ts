import { profileSchema } from "@/features/profile/schema";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { Bucket, MAX_FILE_SIZE_FILE } from "@/lib/supabase/bucket";
import { uploadBase64 } from "@/lib/supabase/upload";

export const profileRouter = createTRPCRouter({
  get: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.profile.findFirst();
  }),

  update: protectedProcedure
    .input(profileSchema)
    .mutation(async ({ input, ctx }) => {
      let imageUrl: string | undefined = undefined;
      if (input.image) {
        imageUrl = await uploadBase64({
          bucket: Bucket.PROFILE,
          filename: "my-image.jpeg",
          base64: input.image,
          contentType: "image/jpeg",
        });
      }

      let resumeUrl: string | undefined = undefined;
      if (input.resume) {
        resumeUrl = await uploadBase64({
          bucket: Bucket.PROFILE,
          filename: "my-resume.pdf",
          base64: input.resume,
          contentType: "application/pdf",
          maxBytes: MAX_FILE_SIZE_FILE,
        });
      }

      const { image, resume, ...rest } = input;

      //   Check if there is any existing profile
      const existingProfile = await ctx.db.profile.findFirst();

      if (existingProfile) {
        return ctx.db.profile.update({
          where: { id: existingProfile.id },
          data: {
            ...rest,
            ...(imageUrl ? { image: imageUrl } : {}),
            ...(resumeUrl ? { resume: resumeUrl } : {}),
          },
        });
      }

      // ponytail: create requires image/resume; undefined will error intentionally — make optional in schema if nullable needed
      return ctx.db.profile.create({
        data: {
          ...rest,
          image: imageUrl as unknown as string,
          resume: resumeUrl as unknown as string,
        },
        select: {
          id: true,
        },
      });
    }),
});
