"use client";

import CertificateCard from "@/features/certificate/component/CertificateCard";
import AddCertificateForm from "@/features/certificate/form/AddCertificateForm";
import { useTRPC } from "@/trpc/react";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "lucide-react";

const CertificatePage = () => {
  const trpc = useTRPC();
  const { data: certificates, isLoading } = useQuery(
    trpc.certificate.get.queryOptions(),
  );
  return (
    <div className="space-y-3">
      <div className="flex justify-between">
        <h1 className="text-lg font-bold">Certificate</h1>
        <AddCertificateForm />
      </div>
      {isLoading ? (
        <Loader className="animate-spin" />
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(384px,1fr))] gap-3 py-2">
          {certificates?.map((certificate) => (
            <CertificateCard key={certificate.id} certificate={certificate} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CertificatePage;
