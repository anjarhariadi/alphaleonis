"use client";

import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { revalidateLandingPage } from "@/features/landing/actions";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/react";
import { useMutation } from "@tanstack/react-query";
import React, { startTransition, useOptimistic } from "react";
import { toast } from "sonner";

const TogglePortfolioVisibility = ({
  currentVisible,
  id,
}: {
  currentVisible: boolean;
  id: number;
}) => {
  const trpc = useTRPC();
  const [isVisible, setOptimisticVisible] = useOptimistic(
    currentVisible,
    (_state, next: boolean) => next,
  );

  const togglePortfolioStatus = useMutation(
    trpc.portfolio.toggleVisibility.mutationOptions({
      onSuccess: () => {
        toast.success("Visibility Updated");
        revalidateLandingPage();
      },
      onError: (err) => {
        toast.error(err.message);
        setOptimisticVisible(currentVisible);
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
      <Label htmlFor={`portfolio-visibility-${id}`}>
        {isVisible ? "Visible" : "Hidden"}
      </Label>
      <Switch
        id={`portfolio-visibility-${id}`}
        checked={isVisible}
        disabled={togglePortfolioStatus.isPending}
        onCheckedChange={(checked) => {
          startTransition(async () => {
            setOptimisticVisible(checked);
            try {
              await togglePortfolioStatus.mutateAsync({ id });
            } catch {
              setOptimisticVisible(!checked);
            }
          });
        }}
      />
    </div>
  );
};

export default TogglePortfolioVisibility;
