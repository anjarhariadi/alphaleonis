import { Github, MoveRight } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Portfolio } from "@prisma/client";
import { ScrollArea } from "./ui/scroll-area";

interface PortfolioBriefSheetProps {
  portfolio: Portfolio;
  children: React.ReactNode;
}

export function PortfolioBriefSheet({
  portfolio,
  children,
}: PortfolioBriefSheetProps) {
  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="bottom" className="!max-h-[100vh]">
        <SheetHeader className="text-center">
          <SheetTitle>{portfolio.title}&apos;s Brief</SheetTitle>
        </SheetHeader>
        <ScrollArea className="mx-auto h-[calc(100vh-12rem)] max-w-7xl px-4">
          <div
            className="prose prose-sm dark:prose-invert tiptap-content max-w-none"
            dangerouslySetInnerHTML={{ __html: portfolio.brief }}
          />
        </ScrollArea>
        <SheetFooter className="flex flex-row justify-center gap-2 border-t">
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
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
