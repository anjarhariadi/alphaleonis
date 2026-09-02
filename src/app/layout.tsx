import "@/styles/globals.css";

import { type Metadata } from "next";
import {
  Bricolage_Grotesque,
  Newsreader,
  JetBrains_Mono,
} from "next/font/google";

import { Toaster } from "@/components/ui/sonner";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { ThemeProvider } from "@/components/theme-provider";
import {
  AUTHOR_NAME,
  AUTHOR_NAME_LONG,
  SITE_DESC,
  SITE_URL,
} from "@/features/landing/metadata";

const SITE_TITLE = `${AUTHOR_NAME} – Software Engineer`;
const METADATA_IMAGE = "/opengraph-image.png";

export const metadata: Metadata = {
  title: {
    default: SITE_TITLE,
    template: `%s | ${AUTHOR_NAME}`,
  },
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  description: SITE_DESC,
  keywords: [
    AUTHOR_NAME,
    AUTHOR_NAME_LONG,
    "OpenAI",
    "Ranajaya Citaprasada Thani Indonesia",
    "Google Developer Group",
    "Software Engineer",
    "application security",
    "machine learning",
    "data scientist",
    "software engineer indonesia",
  ],
  authors: [{ name: AUTHOR_NAME }],
  creator: AUTHOR_NAME,
  metadataBase: new URL(SITE_URL),
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESC,
    images: {
      url: METADATA_IMAGE,
      width: 1200,
      height: 630,
      alt: SITE_TITLE,
    },
    siteName: "Anjar Hariadi",
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    images: [METADATA_IMAGE],
    title: SITE_TITLE,
    description: SITE_DESC,
  },
  robots: {
    googleBot: {
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
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
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className="scroll-smooth"
      suppressHydrationWarning
    >
      <body
        className={`${fontSans.variable} ${fontSerif.variable} ${fontMono.variable} antialiased`}
      >
        <a
          href="#main-content"
          className="focus:bg-background focus:text-foreground focus:ring-ring sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:rounded-md focus:px-4 focus:py-2 focus:shadow-md focus:ring-2 focus:outline-none"
        >
          Skip to main content
        </a>
        <NuqsAdapter>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            {brief}
            <Toaster position="top-center" richColors />
          </ThemeProvider>
        </NuqsAdapter>
      </body>
    </html>
  );
}
