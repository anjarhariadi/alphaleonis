"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Expand, X } from "lucide-react";

type Props = {
  id: number;
};

const PortfolioPopupActions = ({ id }: Props) => {
  const router = useRouter();

  return (
    <div className="space-x-2">
      <Button
        size="sm"
        variant="outline"
        onClick={() => {
          window.location.href = `/portfolio/${id}`;
        }}
      >
        <Expand />
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={() => {
          router.back();
        }}
      >
        <X />
      </Button>
    </div>
  );
};

export default PortfolioPopupActions;
