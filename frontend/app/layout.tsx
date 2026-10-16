import "./globals.css";
import localFont from "next/font/local";
import { Suspense } from "react";
import { SiteAnalytics } from "@/components/site-analytics";

const dosis = localFont({
  src: [
    { path: "../public/fonts/dosis-400-normal.ttf", weight: "400" },
    { path: "../public/fonts/dosis-600-normal.ttf", weight: "600" },
    { path: "../public/fonts/dosis-700-normal.ttf", weight: "700" },
  ], variable: "--font-dosis", display: "swap",
});
const lato = localFont({
  src: [
    { path: "../public/fonts/lato-400-normal.ttf", weight: "400", style: "normal" },
    { path: "../public/fonts/lato-700-normal.ttf", weight: "700", style: "normal" },
    { path: "../public/fonts/lato-400-italic.ttf", weight: "400", style: "italic" },
  ], variable: "--font-lato", display: "swap",
});
import type { Metadata } from "next";
import { siteUrl } from "@/lib/site-url";
import { siteName } from "@/lib/site-name";
import { Toaster } from "@/components/ui/sonner";

const isProduction = process.env.NEXT_PUBLIC_SITE_ENV === "production";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    template: `%s | ${siteName}`,
    default: siteName,
  },
  openGraph: {
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_SITE_URL}/images/og-image.jpg`,
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  robots: !isProduction ? "noindex, nofollow" : "index, follow",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${dosis.variable} ${lato.variable}`}>
      <link rel="icon" href="/favicon.ico" />
      <body>
        {children}
        <Suspense fallback={null}><SiteAnalytics /></Suspense>
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
