"use client";
import EditPortfolioForm from "@/features/portfolio/form/EditPortfolioForm";
import { useTRPC } from "@/trpc/react";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "lucide-react";
import { use } from "react";

const EditPortfolioPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);
  const trpc = useTRPC();
  const { data: portfolio, isLoading } = useQuery(
    trpc.portfolio.get.queryOptions({
      id: Number(id),
    }),
  );
  return isLoading ? (
    <Loader className="animate-spin" />
  ) : (
    <div className="space-y-3">
      <EditPortfolioForm id={Number(id)} defaultValues={portfolio ?? {}} />
    </div>
  );
};

export default EditPortfolioPage;
