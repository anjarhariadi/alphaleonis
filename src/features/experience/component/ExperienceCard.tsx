import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Experience } from "@prisma/client";
import React from "react";
import { ExperienceForm } from "../ExperienceForm";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useTRPC } from "@/trpc/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { revalidateLandingPage } from "@/features/landing/actions";

const ExperienceCard = ({ experience }: { experience: Experience }) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = React.useState(false);
  const deleteExperience = useMutation(
    trpc.experience.delete.mutationOptions({
      onSuccess: () => {
        queryClient.setQueryData(
          trpc.experience.get.queryKey(),
          (prev: Experience[] | undefined) =>
            (prev ?? []).filter((item) => item.id !== experience.id),
        );
        toast.success("Experience berhasil dihapus");
        revalidateLandingPage();
      },
      onError: (err) => {
        toast.error(err.message);
      },
    }),
  );
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between">
          <div className="text-nowrap">
            <CardTitle>{experience.title}</CardTitle>
            <CardDescription>{experience.company}</CardDescription>
          </div>
          <div className="flex gap-2">
            <ExperienceForm id={experience.id} defaultValues={experience} />
            <Button
              disabled={deleteExperience.isPending}
              variant="destructive"
              size="icon"
              onClick={() => setIsOpen(true)}
            >
              <Trash2 />
            </Button>
            <ConfirmDialog
              open={isOpen}
              onOpenChange={setIsOpen}
              loading={deleteExperience.isPending}
              onConfirm={() => deleteExperience.mutate({ id: experience.id })}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p>{experience.description}</p>
        <span className="bg-accent rounded-md p-2">{experience.period}</span>
      </CardContent>
    </Card>
  );
};

export default ExperienceCard;
