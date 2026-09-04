"use client";

import CertificateCard from "@/features/certificate/component/CertificateCard";
import { CertificateForm } from "@/features/certificate/CertificateForm";
import {
  DashboardGrid,
  DashboardHeader,
} from "@/components/dashboard/dashboard-grid";
import { useTRPC } from "@/trpc/react";
import { useQuery } from "@tanstack/react-query";

const CertificatePage = () => {
  const trpc = useTRPC();
  const { data: certificates, isLoading } = useQuery(
    trpc.certificate.get.queryOptions(),
  );
  return (
    <div className="space-y-3">
      <DashboardHeader title="Certificate" action={<CertificateForm />} />
      <DashboardGrid isLoading={isLoading} data={certificates}>
        {certificates?.map((certificate) => (
          <CertificateCard key={certificate.id} certificate={certificate} />
        ))}
      </DashboardGrid>
    </div>
  );
};

export default CertificatePage;
