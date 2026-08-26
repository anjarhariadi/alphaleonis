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
import { Edit } from "lucide-react";
import { toast } from "sonner";
import {
  editCertificateSchema,
  type EditCertificateSchemaType,
} from "../schema";
import type { Certificate } from "@prisma/client";
import { fileToBase64 } from "@/lib/form-util";
import { revalidateLandingPage } from "@/features/landing/actions";
import { useTRPC } from "@/trpc/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const EditCertificateForm = ({
  id,
  defaultValues,
}: {
  id: number;
  defaultValues: Partial<Certificate>;
}) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [open, setOpen] = React.useState(false);

  const form = useForm<EditCertificateSchemaType>({
    resolver: zodResolver(editCertificateSchema),
    defaultValues: {
      title: defaultValues.title,
      issuer: defaultValues.issuer,
      image: undefined,
      validation: defaultValues.validation ?? undefined,
      period: defaultValues.period,
    },
  });

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64 = await fileToBase64(file);
      form.setValue("image", base64);
    }
  };

  const editCertificate = useMutation(
    trpc.certificate.edit.mutationOptions({
      onError: (err) => {
        toast.error(err.message);
      },
      onSuccess: (data) => {
        queryClient.setQueryData(
          trpc.certificate.get.queryKey(),
          (prev: Certificate[] | undefined) => [
            ...(prev ?? []).map((item) => (item.id === data.id ? data : item)),
          ],
        );
        setOpen(false);
        toast.success("Certificate berhasil ditambahkan");

        revalidateLandingPage();
      },
    }),
  );

  const handleSubmit = (data: EditCertificateSchemaType) => {
    editCertificate.mutate({ data, id });
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
        <Button onClick={() => setOpen(true)} size="icon">
          <Edit />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-svh w-3xl overflow-auto">
        <DialogHeader>
          <DialogTitle>Edit Certificate</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
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
              name="issuer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Issuer</FormLabel>
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

            <FormField
              control={form.control}
              name="validation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Validation</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
              disabled={editCertificate.isPending}
            >
              {editCertificate.isPending ? "Loading..." : "Edit Certificate"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditCertificateForm;
