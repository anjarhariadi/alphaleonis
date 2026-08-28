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
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useTRPC } from "@/trpc/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { revalidateLandingPage } from "@/features/landing/actions";

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
        revalidateLandingPage();
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
          sizes="(max-width:768px) 100vw, 384px"
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
        <Button
          disabled={deleteCertificate.isPending}
          variant="destructive"
          size="icon"
          onClick={() => setIsOpen(true)}
        >
          <Trash2 />
        </Button>
        <ConfirmDialog
          open={isOpen}
          onOpenChange={setIsOpen}
          loading={deleteCertificate.isPending}
          onConfirm={() => deleteCertificate.mutate({ id: certificate.id })}
        />
      </CardFooter>
    </Card>
  );
};

export default CertificateCard;
