import "@/styles/globals.css";

import { type Metadata } from "next";
import {
  Bricolage_Grotesque,
  Newsreader,
  JetBrains_Mono,
} from "next/font/google";

import { TRPCReactProvider } from "@/trpc/react";
import { Toaster } from "@/components/ui/sonner";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { ThemeProvider } from "@/components/theme-provider";
import { env } from "@/env";

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

const fontSans = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fontSerif = Newsreader({
  subsets: ["latin"],
  variable: "--font-serif",
});

const fontMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export default function RootLayout({
  children,
  brief,
}: Readonly<{ children: React.ReactNode; brief: React.ReactNode }>) {
  const supabaseOrigin = (() => {
    try {
      return new URL(env.NEXT_PUBLIC_SUPABASE_URL).origin;
    } catch {
      return undefined;
    }
  })();
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className="scroll-smooth"
      suppressHydrationWarning
    >
      <head>
        {supabaseOrigin ? (
          <>
            <link
              rel="preconnect"
              href={supabaseOrigin}
              crossOrigin="anonymous"
            />
            <link rel="dns-prefetch" href={supabaseOrigin} />
          </>
        ) : null}
      </head>
      <body
        className={`${fontSans.variable} ${fontSerif.variable} ${fontMono.variable} antialiased`}
      >
        <NuqsAdapter>
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
        </NuqsAdapter>
      </body>
    </html>
  );
}
