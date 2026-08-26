"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { experienceSchema, type ExperienceSchematype } from "../schema";
import { Textarea } from "@/components/ui/textarea";
import type { Experience } from "@prisma/client";
import { revalidateLandingPage } from "@/features/landing/actions";
import { useTRPC } from "@/trpc/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const AddExperienceForm = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [open, setOpen] = React.useState(false);

  const form = useForm<ExperienceSchematype>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      index: 0,
      company: "",
      title: "",
      description: "",
      period: "",
    },
  });

  const addExperience = useMutation(
    trpc.experience.add.mutationOptions({
      onError: (err) => {
        toast.error(err.message);
      },
      onSuccess: (data) => {
        queryClient.setQueryData(
          trpc.experience.get.queryKey(),
          (prev: Experience[] | undefined) => [...(prev ?? []), data],
        );
        setOpen(false);
        toast.success("Experience berhasil ditambahkan");

        revalidateLandingPage();
      },
    }),
  );

  const handleSubmit = (data: ExperienceSchematype) => {
    addExperience.mutate(data);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        form.reset();
      }}
    >
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)}>
          Tambahkan Experience <Plus />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-svh w-3xl overflow-auto">
        <DialogHeader>
          <DialogTitle>Tambahkan Experience</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="index"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Index</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="period"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Period</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={addExperience.isPending}
            >
              {addExperience.isPending ? "Loading..." : "Tambah Experience"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddExperienceForm;
