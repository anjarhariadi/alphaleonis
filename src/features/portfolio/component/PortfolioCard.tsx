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
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import Link from "next/link";
import TogglePortfolioVisibility from "../form/TogglePortfolioVisibility";
import { useTRPC } from "@/trpc/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { revalidateLandingPage } from "@/features/landing/actions";

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
          src={portfolio.image ?? "/no-image.webp"}
          alt={portfolio.title}
          width={500}
          height={500}
          sizes="(max-width:768px) 100vw, 384px"
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
        <Button
          disabled={deletePortfolio.isPending}
          variant="destructive"
          size="icon"
          onClick={() => setIsOpen(true)}
        >
          <Trash2 />
        </Button>
        <ConfirmDialog
          open={isOpen}
          onOpenChange={setIsOpen}
          loading={deletePortfolio.isPending}
          onConfirm={() => deletePortfolio.mutate({ id: portfolio.id })}
        />
      </CardFooter>
    </Card>
  );
};

export default PortfolioCard;
