import NavBar from "@/components/navbar";
import Footer from "@/components/footer";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="flex min-h-dvh w-full flex-col scroll-smooth">
      <NavBar />
      <div className="flex-1">{children}</div>
      <Footer />
    </main>
  );
}
