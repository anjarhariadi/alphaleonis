import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Experience } from "@prisma/client";
import React from "react";
import EditExperienceForm from "../form/EditExperienceForm";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useTRPC } from "@/trpc/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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
            <EditExperienceForm id={experience.id} defaultValues={experience} />
            <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
              <AlertDialogTrigger asChild>
                <Button
                  disabled={deleteExperience.isPending}
                  variant="destructive"
                  size="icon"
                >
                  <Trash2 />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>
                    Apakah Kamu Benar-Benar Yakin?
                  </AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Batalkan</AlertDialogCancel>
                  <AlertDialogAction
                    className={buttonVariants({ variant: "destructive" })}
                    onClick={() =>
                      deleteExperience.mutate({ id: experience.id })
                    }
                  >
                    Konfirmasi
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
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
