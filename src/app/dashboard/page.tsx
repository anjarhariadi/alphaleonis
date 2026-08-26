"use client";

import UpdateProfileForm from "@/features/profile/form/UpdateProfileForm";
import { useTRPC } from "@/trpc/react";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "lucide-react";

const DashboardHomePage = () => {
  const trpc = useTRPC();
  const { data, isLoading } = useQuery(trpc.profile.get.queryOptions());
  return (
    <div className="space-y-3">
      <h1 className="text-lg font-bold">
        Hello <u className="text-primary">Anjar Dwi Hariadi</u> !
      </h1>
      {isLoading ? (
        <Loader className="animate-spin" />
      ) : (
        <UpdateProfileForm defaultValues={data ?? {}} />
      )}
    </div>
  );
};

export default DashboardHomePage;
