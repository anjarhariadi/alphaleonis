"use client";

import { ExperienceForm } from "../ExperienceForm";
import type { Experience } from "@prisma/client";

export default function EditExperienceForm({
  id,
  defaultValues,
}: {
  id: number;
  defaultValues: Partial<Experience>;
}) {
  return <ExperienceForm id={id} defaultValues={defaultValues} />;
}
