"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { revalidateLandingPage } from "@/features/landing/actions";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/react";
import { useMutation } from "@tanstack/react-query";
import React, { startTransition } from "react";
import { toast } from "sonner";

const TogglePortfolioVisibility = ({
  currentVisible,
  id,
}: {
  currentVisible: boolean;
  id: number;
}) => {
  const trpc = useTRPC();
  const [s, setS] = React.useState(currentVisible);
  const [isVisible, setOptimisticVisibility] = React.useOptimistic(
    s,
    (_, newStatus: boolean) => newStatus,
  );

  const togglePortfolioStatus = useMutation(
    trpc.portfolio.toggleVisibility.mutationOptions({
      onSuccess: () => {
        toast.success("Visibility Updated");
        setS(!isVisible);
        revalidateLandingPage();
      },
      onError: (err) => {
        toast.error(err.message);
        setS(s);
      },
    }),
  );

  return (
    <div
      className={cn(
        "flex items-center space-x-2 rounded-full px-3 py-2",
        isVisible ? "bg-primary-foreground" : "bg-muted",
      )}
    >
      <Label htmlFor="portfolio-visibility">
        {isVisible ? "Visible" : "Hidden"}
      </Label>
      <Switch
        id="portfolio-visibility"
        checked={isVisible}
        disabled={togglePortfolioStatus.isPending}
        onCheckedChange={() => {
          startTransition(() => {
            setOptimisticVisibility(!s);
            togglePortfolioStatus.mutateAsync({ id });
          });
        }}
      />
    </div>
  );
};

export default TogglePortfolioVisibility;
