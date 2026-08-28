import z from "zod";

export const addCertificateSchema = z.object({
  title: z.string().min(1),
  issuer: z.string().min(1),
  image: z.string().min(1),
  validation: z.string().optional(),
  period: z.string().min(1),
});

export const editCertificateSchema = addCertificateSchema.partial();

export type AddCertificateSchemaType = z.infer<typeof addCertificateSchema>;
export type EditCertificateSchemaType = z.infer<typeof editCertificateSchema>;
