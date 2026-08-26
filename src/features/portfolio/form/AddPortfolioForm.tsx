"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { toast } from "sonner";
import { portfolioSchema, TAGS, type PortfolioType } from "../schema";
import type { Portfolio } from "@prisma/client";
import { fileToBase64 } from "@/lib/form-util";
import TiptapInput from "@/components/tiptap-editor";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Check, X } from "lucide-react";
import Image from "next/image";
import { revalidateLandingPage } from "@/features/landing/actions";
import { useTRPC } from "@/trpc/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const AddPortfolioForm = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const form = useForm<PortfolioType>({
    resolver: zodResolver(portfolioSchema),
    defaultValues: {
      title: "",
      description: "",
      brief: "",
      url: "#",
      githubUrl: "#",
      visible: true,
      tag: [],
    },
  });

  const [preview, setPreview] = React.useState<string>();
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const base64 = await fileToBase64(file);
      form.setValue("image", base64);
      setPreview(URL.createObjectURL(file));
    }
  };

  const addPortfolio = useMutation(
    trpc.portfolio.add.mutationOptions({
      onError: (err) => {
        toast.error(err.message);
      },
      onSuccess: (data) => {
        queryClient.setQueryData(
          trpc.portfolio.getAll.queryKey(),
          (prev: Portfolio[] | undefined) => [...(prev ?? []), data],
        );
        form.reset();

        toast.success("Portfolio berhasil ditambahkan");

        revalidateLandingPage();
      },
    }),
  );

  const handleSubmit = (data: PortfolioType) => {
    addPortfolio.mutate(data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex w-full flex-col gap-4 md:flex-row"
      >
        <div className="flex-1">
          <FormField
            control={form.control}
            name="brief"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Write your brief about this portfolio</FormLabel>
                <FormControl>
                  <div className="tiptap-content">
                    <TiptapInput
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex-1 space-y-4">
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
            name="visible"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Visible?</FormLabel>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
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
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Url</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="githubUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Github Url</FormLabel>
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

          {preview && (
            <Image src={preview} alt="preview" width={100} height={100} />
          )}

          <FormField
            control={form.control}
            name="tag"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tag</FormLabel>
                <div className="border-input flex min-h-9 w-full flex-wrap items-center gap-2 rounded-md border px-2 py-1">
                  {field.value.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      onClick={() => {
                        field.onChange(
                          field.value.filter((item) => item !== tag),
                        );
                      }}
                    >
                      {tag}
                      <X />
                    </Badge>
                  ))}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {TAGS.map((tag, index) => (
                    <Badge
                      key={index}
                      className="cursor-pointer"
                      variant="outline"
                      onClick={() => {
                        field.onChange(
                          Array.from(new Set([...field.value, tag])),
                        );
                      }}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full"
            disabled={addPortfolio.isPending}
          >
            {addPortfolio.isPending ? "Loading..." : "Tambah Portfolio"}
            <Check />
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default AddPortfolioForm;
