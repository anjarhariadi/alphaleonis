"use client";

import { buttonVariants } from "@/components/ui/button";
import PortfolioCard from "@/features/portfolio/component/PortfolioCard";
import { useTRPC } from "@/trpc/react";
import { useQuery } from "@tanstack/react-query";
import { Loader, Plus } from "lucide-react";
import Link from "next/link";

const PortfolioPage = () => {
  const trpc = useTRPC();
  const { data: portfolios, isLoading } = useQuery(
    trpc.portfolio.getAll.queryOptions(),
  );
  return (
    <div className="space-y-3">
      <div className="flex justify-between">
        <h1 className="text-lg font-bold">Portfolio</h1>
        <Link
          href="/dashboard/portfolio/new"
          className={buttonVariants()}
          prefetch
        >
          Tambah Portfolio Baru <Plus />
        </Link>
      </div>
      {isLoading ? (
        <Loader className="animate-spin" />
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(384px,1fr))] gap-3 py-2">
          {portfolios?.map((portfolio) => (
            <PortfolioCard key={portfolio.id} portfolio={portfolio} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PortfolioPage;
