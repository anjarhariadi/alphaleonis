"use client";

import { PortfolioForm } from "../PortfolioForm";
import type { Portfolio } from "@prisma/client";

export default function EditPortfolioForm({
  id,
  defaultValues,
}: {
  id: number;
  defaultValues: Partial<Portfolio>;
}) {
  return <PortfolioForm id={id} defaultValues={defaultValues} />;
}
