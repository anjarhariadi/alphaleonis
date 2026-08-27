import { Suspense } from "react";

export default function BlogLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <Suspense fallback={"Loading..."}>{children}</Suspense>;
}
