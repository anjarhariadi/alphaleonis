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
import { Edit, Plus } from "lucide-react";
import { toast } from "sonner";
import { experienceSchema, type ExperienceSchematype } from "./schema";
import { Textarea } from "@/components/ui/textarea";
import type { Experience } from "@prisma/client";
import { revalidateLandingPage } from "@/features/landing/actions";
import { useTRPC } from "@/trpc/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

type Props =
  | { id?: undefined; defaultValues?: undefined }
  | { id: number; defaultValues: Partial<Experience> };

export function ExperienceForm(props: Props) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const isEdit = typeof props.id === "number";
  const [open, setOpen] = React.useState(false);

  const form = useForm<ExperienceSchematype>({
    resolver: zodResolver(experienceSchema),
    defaultValues: isEdit
      ? {
          index: props.defaultValues?.index ?? 0,
          company: props.defaultValues?.company ?? "",
          title: props.defaultValues?.title ?? "",
          description: props.defaultValues?.description ?? "",
          period: props.defaultValues?.period ?? "",
        }
      : {
          index: 0,
          company: "",
          title: "",
          description: "",
          period: "",
        },
  });

  const addExperience = useMutation(
    trpc.experience.add.mutationOptions({
      onError: (err) => toast.error(err.message),
      onSuccess: (data) => {
        queryClient.setQueryData(
          trpc.experience.get.queryKey(),
          (prev: Experience[] | undefined) => [...(prev ?? []), data],
        );
        setOpen(false);
        form.reset();
        toast.success("Experience berhasil ditambahkan");
        revalidateLandingPage();
      },
    }),
  );

  const editExperience = useMutation(
    trpc.experience.edit.mutationOptions({
      onError: (err) => toast.error(err.message),
      onSuccess: (data) => {
        queryClient.setQueryData(
          trpc.experience.get.queryKey(),
          (prev: Experience[] | undefined) =>
            (prev ?? []).map((item) => (item.id === data.id ? data : item)),
        );
        setOpen(false);
        toast.success("Experience berhasil diperbarui");
        revalidateLandingPage();
      },
    }),
  );

  const onSubmit = (data: ExperienceSchematype) => {
    if (isEdit) editExperience.mutate({ data, id: props.id! });
    else addExperience.mutate(data);
  };

  const isPending = isEdit ? editExperience.isPending : addExperience.isPending;

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o) form.reset();
      }}
    >
      <DialogTrigger asChild>
        {isEdit ? (
          <Button size="icon">
            <Edit />
          </Button>
        ) : (
          <Button>
            Tambahkan Experience <Plus />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-svh w-3xl overflow-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Perbarui Experience" : "Tambahkan Experience"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="index"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Index</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      value={String(field.value ?? 0)}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
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
                    <Textarea {...field} value={field.value ?? ""} />
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

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending
                ? "Loading..."
                : isEdit
                  ? "Perbarui Experience"
                  : "Tambah Experience"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default ExperienceForm;
