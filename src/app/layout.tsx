import type { Metadata, Viewport } from "next";
import { SITE_URL, indexingEnabled } from "@/lib/seo";
import localFont from "next/font/local";
import { Suspense } from "react";
import { SiteHeader, SiteHeaderView } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { DemoRibbon } from "@/components/site/demo-ribbon";
import { SiteSearch } from "@/components/search/site-search";
import { BackToTop } from "@/components/site/back-to-top";
import { PREFS_INIT_SCRIPT } from "@/lib/prefs-init";
import "./globals.css";

const manrope = localFont({
  src: "./fonts/manrope-latin-wght-normal.woff2",
  variable: "--font-manrope",
  weight: "200 800",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "Cura Privata — i tuoi referti, finalmente comprensibili", template: "%s · Cura Privata" },
  description:
    "Una spiegazione semplice dei referti di laboratorio, un dossier ordinato e le domande giuste per il tuo medico. Uno strumento di comprensione, non una diagnosi.",
  robots: indexingEnabled() ? { index: true, follow: true } : { index: false, follow: false },
  metadataBase: new URL(SITE_URL),
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F5FAF8" },
    { media: "(prefers-color-scheme: dark)", color: "#0B1E26" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="it" className={`${manrope.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: PREFS_INIT_SCRIPT }} />
      </head>
      <body className="flex min-h-full flex-col">
        <a
          href="#contenuto"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-paper focus:px-4 focus:py-3 focus:shadow-lg"
        >
          Vai al contenuto
        </a>
        <DemoRibbon />
        <Suspense fallback={<SiteHeaderView pathname={null} />}>
          <SiteHeader />
        </Suspense>
        <main id="contenuto" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        <SiteSearch />
        <BackToTop />
      </body>
    </html>
  );
}
