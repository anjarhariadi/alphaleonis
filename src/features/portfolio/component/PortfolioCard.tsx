import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Portfolio } from "@prisma/client";
import Image from "next/image";
import React from "react";
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
import Link from "next/link";
import TogglePortfolioVisibility from "../form/TogglePortfolioVisibility";
import { useTRPC } from "@/trpc/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const PortfolioCard = ({ portfolio }: { portfolio: Portfolio }) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = React.useState(false);
  const deletePortfolio = useMutation(
    trpc.portfolio.delete.mutationOptions({
      onSuccess: () => {
        queryClient.setQueryData(
          trpc.portfolio.getAll.queryKey(),
          (prev: Portfolio[] | undefined) =>
            (prev ?? []).filter((item) => item.id !== portfolio.id),
        );
        toast.success("Portfolio berhasil dihapus");
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
          src={portfolio.image ?? "/no-image.webp"}
          alt={portfolio.title}
          width={500}
          height={500}
          className="aspect-video w-full rounded-md object-cover"
        />
        <CardTitle>
          <Link href={`/dashboard/portfolio/edit/${portfolio.id}`} prefetch>
            {portfolio.title}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{portfolio.description}</CardDescription>
      </CardContent>
      <CardFooter className="gap-2">
        <TogglePortfolioVisibility
          currentVisible={portfolio.visible}
          id={portfolio.id}
        />
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
          <AlertDialogTrigger asChild>
            <Button
              disabled={deletePortfolio.isPending}
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
                onClick={() => deletePortfolio.mutate({ id: portfolio.id })}
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

export default PortfolioCard;
