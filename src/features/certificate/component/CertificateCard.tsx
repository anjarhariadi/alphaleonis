import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Certificate } from "@prisma/client";
import Image from "next/image";
import React from "react";
import EditCertificateForm from "../form/EditCertificateForm";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useTRPC } from "@/trpc/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const CertificateCard = ({ certificate }: { certificate: Certificate }) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = React.useState(false);
  const deleteCertificate = useMutation(
    trpc.certificate.delete.mutationOptions({
      onSuccess: () => {
        queryClient.setQueryData(
          trpc.certificate.get.queryKey(),
          (prev: Certificate[] | undefined) =>
            (prev ?? []).filter((item) => item.id !== certificate.id),
        );
        toast.success("Certificate berhasil dihapus");
      },
      onError: (err) => {
        toast.error(err.message);
      },
    }),
  );
  return (
    <Card>
      <CardHeader>
        <Image
          src={certificate.image}
          alt={certificate.title}
          width={500}
          height={500}
          className="aspect-[1.414/1] w-full rounded-md object-cover"
        />
        <CardTitle>{certificate.title}</CardTitle>
        <CardDescription>By: {certificate.issuer}</CardDescription>
      </CardHeader>
      <CardContent>
        <CardDescription>{certificate.period}</CardDescription>
        {certificate.validation && (
          <a
            href={certificate.validation}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline"
          >
            Lihat Validasi
          </a>
        )}
      </CardContent>
      <CardFooter className="gap-2">
        <EditCertificateForm id={certificate.id} defaultValues={certificate} />
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
          <AlertDialogTrigger asChild>
            <Button
              disabled={deleteCertificate.isPending}
              variant="destructive"
              size="icon"
            >
              <Trash2 />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                Apakah Kamu Benar-Benar Yakin?
              </AlertDialogTitle>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Batalkan</AlertDialogCancel>
              <AlertDialogAction
                className={buttonVariants({ variant: "destructive" })}
                onClick={() => deleteCertificate.mutate({ id: certificate.id })}
              >
                Konfirmasi
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
};

export default CertificateCard;
