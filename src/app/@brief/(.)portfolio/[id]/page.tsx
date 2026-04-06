import { notFound } from "next/navigation";
import { getPortfolioByIdCached } from "@/features/landing/actions";
import PortfolioBriefModal from "./PortfolioBriefModal";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function PortfolioBriefModalPage({ params }: Props) {
  const { id } = await params;
  const portfolio = await getPortfolioByIdCached(parseInt(id));

  if (!portfolio) {
    return notFound();
  }

  return <PortfolioBriefModal portfolio={portfolio} />;
}
