"use client";

import React, { useState, type Key } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { Button, buttonVariants } from "./ui/button";
import { ModeToggle } from "./mode-toggle";
import { cn } from "@/lib/utils";

interface MenuItem {
  id: Key;
  title: String;
  route: String;
}

const menuItems: MenuItem[] = [
  {
    id: 1,
    title: "Home",
    route: "/#home",
  },
  {
    id: 2,
    title: "About Me",
    route: "/#profile",
  },
  {
    id: 3,
    title: "Services",
    route: "/#tools",
  },
  {
    id: 4,
    title: "Portfolio",
    route: "/#portfolio",
  },
  {
    id: 5,
    title: "Post",
    route: "/blog",
  },
];

const NavBar = ({ className }: { className?: string }) => {
  const [showDrawer, setShowDrawer] = useState(false);
  function drawerButtonClick() {
    setShowDrawer(!showDrawer);
  }

  return (
    <div className="bg-sidebar sticky top-0 z-50 border-b px-5 py-2">
      <div
        className={cn(
          "mx-auto flex max-w-5xl items-center justify-between gap-4",
          className,
        )}
      >
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
                <Link href={`${item.route}`} className="hover:text-hprimary">
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
