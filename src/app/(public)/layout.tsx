import NavBar from "@/components/navbar";
import Footer from "@/components/footer";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="flex min-h-dvh w-full flex-col scroll-smooth focus:outline-none"
    >
      <NavBar />
      <div className="flex-1">{children}</div>
      <Footer />
    </main>
  );
}
