import { TRPCReactProvider } from "@/trpc/react";
import { DashboardSidebar } from "@/components/dashboard-sidebar";
import DashboardTopBar from "@/components/dashboard-topbar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TRPCReactProvider>
      <SidebarProvider>
        <DashboardSidebar />
        <SidebarInset>
          <DashboardTopBar />
          <div className="h-full p-4">{children}</div>
        </SidebarInset>
      </SidebarProvider>
    </TRPCReactProvider>
  );
}
