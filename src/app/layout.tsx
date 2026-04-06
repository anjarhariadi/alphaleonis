import "@/styles/globals.css";

import { type Metadata } from "next";
import { Sora } from "next/font/google";

import { TRPCReactProvider } from "@/trpc/react";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: {
    default: "Anjar Hariadi – Software Engineer",
    template: "%s | Anjar Hariadi",
  },
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  description: "Personal website for my portfolios and blog.",
  openGraph: {
    title: "Anjar Hariadi – Software Engineer",
    description: "Personal website for my portfolios and blog.",
    images: "/opengraph-image.png",
    siteName: "Anjar Hariadi",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Anjar Hariadi – Software Engineer",
    description: "Personal website for my portfolios and blog.",
  },
};

const sora = Sora({ subsets: ["latin"] });

export default function RootLayout({
  children,
  brief,
}: Readonly<{ children: React.ReactNode; brief: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${sora.className} scroll-smooth`}
      suppressHydrationWarning
    >
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <TRPCReactProvider>
            {children}
            {brief}
            <Toaster position="top-center" richColors />
          </TRPCReactProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
