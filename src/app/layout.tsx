import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { SiteHeader } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { DemoRibbon } from "@/components/site/demo-ribbon";
import { THEME_INIT_SCRIPT } from "@/components/site/theme-toggle";
import "./globals.css";

const fraunces = localFont({
  src: "./fonts/fraunces-latin-wght-normal.woff2",
  variable: "--font-fraunces",
  weight: "300 700",
  display: "swap",
});

const dmSans = localFont({
  src: "./fonts/dm-sans-latin-wght-normal.woff2",
  variable: "--font-dm-sans",
  weight: "300 700",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "Referto Chiaro — i tuoi referti, finalmente comprensibili", template: "%s · Referto Chiaro" },
  description:
    "Una spiegazione semplice dei referti di laboratorio, un dossier ordinato e le domande giuste per il tuo medico. Uno strumento di comprensione, non una diagnosi.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAFBF9" },
    { media: "(prefers-color-scheme: dark)", color: "#0F1A20" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="it" className={`${fraunces.variable} ${dmSans.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
      </head>
      <body className="flex min-h-full flex-col">
        <a
          href="#contenuto"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-paper focus:px-4 focus:py-3 focus:shadow-lg"
        >
          Vai al contenuto
        </a>
        <DemoRibbon />
        <SiteHeader />
        <main id="contenuto" className="flex-1">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
