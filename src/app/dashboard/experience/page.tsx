"use client";

import ExperienceCard from "@/features/experience/component/ExperienceCard";
import AddExperienceForm from "@/features/experience/form/AddExperienceForm";
import { useTRPC } from "@/trpc/react";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "lucide-react";

const ExperiencePage = () => {
  const trpc = useTRPC();
  const { data: experiences, isLoading } = useQuery(
    trpc.experience.get.queryOptions(),
  );
  return (
    <div className="space-y-3">
      <div className="flex justify-between">
        <h1 className="text-lg font-bold">Experience</h1>
        <AddExperienceForm />
      </div>
      {isLoading ? (
        <Loader className="animate-spin" />
      ) : (
        <div className="space-y-3">
          {experiences?.map((experience) => (
            <ExperienceCard key={experience.id} experience={experience} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ExperiencePage;
