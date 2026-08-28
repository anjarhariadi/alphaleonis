"use client";

import { CertificateForm } from "../CertificateForm";
import type { Certificate } from "@prisma/client";

export default function EditCertificateForm({
  id,
  defaultValues,
}: {
  id: number;
  defaultValues: Partial<Certificate>;
}) {
  return <CertificateForm id={id} defaultValues={defaultValues} />;
}
