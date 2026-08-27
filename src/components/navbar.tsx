"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button, buttonVariants } from "./ui/button";
import { ModeToggle } from "./mode-toggle";
import { cn } from "@/lib/utils";
import { menuItems } from "@/features/landing/contents";

const NavBar = ({ className }: { className?: string }) => {
  const [showDrawer, setShowDrawer] = useState(false);
  function drawerButtonClick() {
    setShowDrawer(!showDrawer);
  }

  return (
    <div className="bg-sidebar sticky top-0 z-50 border-b px-5 py-1">
      <div className={cn("flex items-center justify-between gap-4", className)}>
        <Link href={"/"} className="text-primary text-2xl font-bold">
          Anjar.Hariadi
        </Link>
        <div
          className={cn(
            "fixed top-0 right-0 h-screen w-full",
            showDrawer ? "bg-accent/50 visible" : "hidden bg-none",
          )}
          onClick={() => setShowDrawer(false)}
          aria-hidden="true"
        />
        <div
          className={cn(
            "bg-sidebar fixed flex h-screen w-[70%] flex-col items-center justify-center gap-4 p-4 font-mono shadow-md lg:static lg:h-fit lg:w-max lg:flex-row lg:shadow-none",
            showDrawer ? "right-0" : "right-[-100%]",
            "top-0 transition-all",
          )}
        >
          <HamburgerButton open={showDrawer} onClick={drawerButtonClick} />
          <ul className="flex flex-col gap-4 lg:flex-row">
            {menuItems.map((item) => (
              <li key={item.id}>
                <Link
                  href={`${item.route}`}
                  className="hover:text-primary hover:underline"
                >
                  {item.title}
                </Link>
              </li>
            ))}
          </ul>
          <Link href={"#contact"} className={buttonVariants()}>
            Contact Me
          </Link>
          <ModeToggle />
        </div>
        <HamburgerButton open={showDrawer} onClick={drawerButtonClick} />
      </div>
    </div>
  );
};

const HamburgerButton = ({
  open,
  onClick,
}: {
  open: boolean;
  onClick: VoidFunction;
}) => {
  return (
    <Button
      variant="outline"
      size="icon"
      aria-label={open ? "Tutup menu navigasi" : "Buka menu navigasi"}
      className="lg:hidden"
      onClick={onClick}
    >
      {open ? <X /> : <Menu />}
    </Button>
  );
};

export default NavBar;
