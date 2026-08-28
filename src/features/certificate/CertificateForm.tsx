"use client";

import React, { useEffect } from "react";
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
import {
  addCertificateSchema,
  editCertificateSchema,
  type AddCertificateSchemaType,
  type EditCertificateSchemaType,
} from "./schema";
import type { Certificate } from "@prisma/client";
import { revalidateLandingPage } from "@/features/landing/actions";
import { useTRPC } from "@/trpc/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useBase64Field } from "@/hooks/use-base64-field";
import Image from "next/image";

type Props =
  | { id?: undefined; defaultValues?: undefined }
  | { id: number; defaultValues: Partial<Certificate> };

export function CertificateForm(props: Props) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const isEdit = typeof props.id === "number";
  const [open, setOpen] = React.useState(false);

  const form = useForm<AddCertificateSchemaType | EditCertificateSchemaType>({
    resolver: zodResolver(
      isEdit ? editCertificateSchema : addCertificateSchema,
    ),
    defaultValues: isEdit
      ? {
          title: props.defaultValues?.title ?? "",
          issuer: props.defaultValues?.issuer ?? "",
          image: undefined,
          validation: props.defaultValues?.validation ?? undefined,
          period: props.defaultValues?.period ?? "",
        }
      : {
          title: "",
          issuer: "",
          image: "",
          validation: undefined,
          period: "",
        },
  });

  const { preview, setPreview, handleChange } = useBase64Field(
    form as never,
    "image",
  );

  useEffect(() => {
    if (isEdit && props.defaultValues?.image) {
      setPreview(props.defaultValues.image);
    }
  }, [isEdit, props, setPreview]);

  const addCertificate = useMutation(
    trpc.certificate.add.mutationOptions({
      onError: (err) => toast.error(err.message),
      onSuccess: (data) => {
        queryClient.setQueryData(
          trpc.certificate.get.queryKey(),
          (prev: Certificate[] | undefined) => [...(prev ?? []), data],
        );
        setOpen(false);
        form.reset();
        setPreview(null);
        toast.success("Certificate berhasil ditambahkan");
        revalidateLandingPage();
      },
    }),
  );

  const editCertificate = useMutation(
    trpc.certificate.edit.mutationOptions({
      onError: (err) => toast.error(err.message),
      onSuccess: (data) => {
        queryClient.setQueryData(
          trpc.certificate.get.queryKey(),
          (prev: Certificate[] | undefined) =>
            (prev ?? []).map((item) => (item.id === data.id ? data : item)),
        );
        setOpen(false);
        toast.success("Certificate berhasil diperbarui");
        revalidateLandingPage();
      },
    }),
  );

  const onSubmit = (
    data: AddCertificateSchemaType | EditCertificateSchemaType,
  ) => {
    if (isEdit) {
      editCertificate.mutate({
        data: data as EditCertificateSchemaType,
        id: props.id!,
      });
    } else {
      addCertificate.mutate(data as AddCertificateSchemaType);
    }
  };

  const isPending = isEdit
    ? editCertificate.isPending
    : addCertificate.isPending;

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o) {
          form.reset();
          if (!isEdit) setPreview(null);
          else if (props.defaultValues?.image)
            setPreview(props.defaultValues.image);
        }
      }}
    >
      <DialogTrigger asChild>
        {isEdit ? (
          <Button size="icon">
            <Edit />
          </Button>
        ) : (
          <Button>
            Tambahkan Certificate <Plus />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-h-svh w-3xl overflow-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Certificate" : "Tambahkan Certificate"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ""} />
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
                    <Input {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="image"
              render={() => (
                <FormItem>
                  <FormLabel>Image</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {preview && (
              <Image src={preview} alt="preview" width={100} height={100} />
            )}

            <FormField
              control={form.control}
              name="validation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Validation</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ""} />
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
                    <Input {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending
                ? "Loading..."
                : isEdit
                  ? "Edit Certificate"
                  : "Tambah Certificate"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default CertificateForm;
