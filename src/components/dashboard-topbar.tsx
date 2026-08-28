import { SidebarTrigger } from "./ui/sidebar";
import UserButton from "@/features/auth/component/UserButton";
import { ModeToggle } from "./mode-toggle";

const DashboardTopBar = () => {
  return (
    <header className="bg-sidebar sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
      <SidebarTrigger />
      <div className="flex items-center gap-2">
        <ModeToggle />
        <UserButton />
      </div>
    </header>
  );
};

export default DashboardTopBar;
