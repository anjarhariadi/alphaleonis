"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { profileSchema, type ProfileSchemaType } from "../schema";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Profile } from "@prisma/client";
import { fileToBase64 } from "@/lib/form-util";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Image from "next/image";
import { revalidateLandingPage } from "@/features/landing/actions";
import { useTRPC } from "@/trpc/react";
import { useMutation } from "@tanstack/react-query";

const UpdateProfileForm = ({
  defaultValues,
}: {
  defaultValues: Partial<Profile>;
}) => {
  const trpc = useTRPC();
  const form = useForm<ProfileSchemaType>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      greeting: defaultValues.greeting || "",
      descTitle: defaultValues.descTitle || "",
      descContent: defaultValues.descContent || "",
      email: defaultValues.email || "",
      image: undefined,
      resume: undefined,
      mood: defaultValues.mood || "",
    },
  });

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64 = await fileToBase64(file);
      form.setValue("image", base64);
    }
  };

  const handleResumeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64 = await fileToBase64(file);
      form.setValue("resume", base64);
    }
  };

  const updateProfile = useMutation(
    trpc.profile.update.mutationOptions({
      onSuccess: () => {
        toast.success("Profile updated");
        revalidateLandingPage();
      },
      onError: (err) => {
        toast.error(err.message);
      },
    }),
  );

  const onSubmit = async (values: ProfileSchemaType) => {
    updateProfile.mutate(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="greeting"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Greeting</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="descTitle"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Desc Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="descContent"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Desc Content</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="mood"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mood</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {defaultValues.image && defaultValues.image !== "#" && (
          <Image
            src={defaultValues.image}
            alt="Profile Image"
            width={200}
            height={200}
          />
        )}

        <FormField
          control={form.control}
          name="resume"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Resume</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="application/pdf"
                  onChange={handleResumeChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {defaultValues.resume && (
          <div>
            <a
              className="text-primary underline"
              href={defaultValues.resume}
              target="_blank"
              rel="noopener noreferrer"
            >
              View Resume
            </a>
          </div>
        )}

        <Button type="submit" disabled={updateProfile.isPending}>
          Update <Check />
        </Button>
      </form>
    </Form>
  );
};

export default UpdateProfileForm;
