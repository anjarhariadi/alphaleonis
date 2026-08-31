import NavBar from "@/components/navbar";
import Footer from "@/components/footer";
import { QueryProvider } from "@/trpc/query-provider";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <QueryProvider>
      <main
        id="main-content"
        tabIndex={-1}
        className="flex min-h-dvh w-full flex-col scroll-smooth focus:outline-none"
      >
        <NavBar />
        <div className="flex-1">{children}</div>
        <Footer />
      </main>
    </QueryProvider>
  );
}
