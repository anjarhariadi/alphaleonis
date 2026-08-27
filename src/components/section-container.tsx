import { cn } from "@/lib/utils";
import React from "react";

const SectionContainer = ({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<"section">) => {
  return (
    <section className="bg-background px-5 py-10" {...props}>
      <div className={cn("mx-auto flex max-w-6xl flex-col gap-4", className)}>
        {children}
      </div>
    </section>
  );
};

export default SectionContainer;
