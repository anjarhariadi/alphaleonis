"use client";

import ExperienceCard from "@/features/experience/component/ExperienceCard";
import { ExperienceForm } from "@/features/experience/ExperienceForm";
import {
  DashboardGrid,
  DashboardHeader,
} from "@/components/dashboard/dashboard-grid";
import { useTRPC } from "@/trpc/react";
import { useQuery } from "@tanstack/react-query";

const ExperiencePage = () => {
  const trpc = useTRPC();
  const { data: experiences, isLoading } = useQuery(
    trpc.experience.get.queryOptions(),
  );
  return (
    <div className="space-y-3">
      <DashboardHeader title="Experience" action={<ExperienceForm />} />
      <DashboardGrid isLoading={isLoading} data={experiences} variant="list">
        {experiences?.map((experience) => (
          <ExperienceCard key={experience.id} experience={experience} />
        ))}
      </DashboardGrid>
    </div>
  );
};

export default ExperiencePage;
