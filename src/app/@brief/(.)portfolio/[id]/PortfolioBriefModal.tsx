"use client";

import { useRouter } from "next/navigation";
import { Github, MoveRight } from "lucide-react";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import PortfolioPopupActions from "./actions";
import type { Portfolio } from "@prisma/client";

type Props = {
  portfolio: Portfolio;
};

const PortfolioBriefModal = ({ portfolio }: Props) => {
  const router = useRouter();

  const handleBackdropClick = () => {
    router.back();
  };

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center"
      onClick={handleBackdropClick}
    >
      <Card
        className="max-h-[85vh] w-full max-w-3xl overflow-hidden rounded-t-xl sm:max-h-[80vh] sm:rounded-xl"
        onClick={handleCardClick}
      >
        <CardHeader>
          <CardTitle className="truncate text-lg">
            {portfolio.title}&apos;s Brief
          </CardTitle>
          <CardAction>
            <PortfolioPopupActions id={portfolio.id} />
          </CardAction>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto">
          <div
            className="prose prose-sm dark:prose-invert tiptap-content max-w-none"
            dangerouslySetInnerHTML={{ __html: portfolio.brief }}
          />
        </CardContent>
        <CardFooter className="flex gap-2">
          {portfolio.url && (
            <a
              href={portfolio.url}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ size: "sm", variant: "outline" }))}
            >
              <MoveRight /> Try It
            </a>
          )}
          {portfolio.githubUrl && (
            <a
              href={portfolio.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ size: "sm", variant: "outline" }))}
            >
              <Github /> Github
            </a>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default PortfolioBriefModal;
