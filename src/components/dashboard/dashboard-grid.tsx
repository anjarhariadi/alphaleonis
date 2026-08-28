"use client";

import { Loader } from "lucide-react";
import type { ReactNode } from "react";

export function DashboardHeader({
  title,
  action,
}: {
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex justify-between">
      <h1 className="text-lg font-bold">{title}</h1>
      {action}
    </div>
  );
}

type GridProps = {
  isLoading: boolean;
  data?: unknown[];
  empty?: ReactNode;
  children: ReactNode;
  variant?: "grid" | "list";
};

export function DashboardGrid({
  isLoading,
  data,
  empty = <p>Belum ada data</p>,
  children,
  variant = "grid",
}: GridProps) {
  if (isLoading) return <Loader className="animate-spin" />;
  if (!data?.length) return <>{empty}</>;
  if (variant === "list") return <div className="space-y-3">{children}</div>;
  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(384px,1fr))] gap-3 py-2">
      {children}
    </div>
  );
}
