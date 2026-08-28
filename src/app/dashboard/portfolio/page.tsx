"use client";

import { buttonVariants } from "@/components/ui/button";
import {
  DashboardGrid,
  DashboardHeader,
} from "@/components/dashboard/dashboard-grid";
import PortfolioCard from "@/features/portfolio/component/PortfolioCard";
import { useTRPC } from "@/trpc/react";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import Link from "next/link";

const PortfolioPage = () => {
  const trpc = useTRPC();
  const { data: portfolios, isLoading } = useQuery(
    trpc.portfolio.getAll.queryOptions(),
  );
  return (
    <div className="space-y-3">
      <DashboardHeader
        title="Portfolio"
        action={
          <Link
            href="/dashboard/portfolio/new"
            className={buttonVariants()}
            prefetch
          >
            Tambah Portfolio Baru <Plus />
          </Link>
        }
      />
      <DashboardGrid isLoading={isLoading} data={portfolios}>
        {portfolios?.map((portfolio) => (
          <PortfolioCard key={portfolio.id} portfolio={portfolio} />
        ))}
      </DashboardGrid>
    </div>
  );
};

export default PortfolioPage;
