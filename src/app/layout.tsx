import { TrackClicks } from "@/components/site/track";
import type { Metadata, Viewport } from "next";
import { SITE_URL, indexingEnabled, jsonLd, organizationLd } from "@/lib/seo";
import { readTitolare } from "@/domain/titolare";
import localFont from "next/font/local";
import { Suspense } from "react";
import { SiteHeader, SiteHeaderView } from "@/components/site/site-header";
import { SiteFooter } from "@/components/site/site-footer";
import { DemoRibbon } from "@/components/site/demo-ribbon";
import { SiteSearch } from "@/components/search/site-search";
import { BackToTop } from "@/components/site/back-to-top";
import { PREFS_INIT_SCRIPT, THEME_COLOR } from "@/lib/prefs-init";
import { mediciEnabled } from "@/lib/medici";
import "./globals.css";
import "@/components/home/tre-momenti.css";
import "@/components/sezioni/sezioni.css";
import "@/components/wow/wow.css";

const manrope = localFont({
  src: "./fonts/manrope-latin-wght-normal.woff2",
  variable: "--font-manrope",
  weight: "200 800",
  display: "swap",
});

// Fraunces (OFL), per i titoli in veste «Carta».
// 18/11/2026 (secondo giro, punto 20): file alleggeriti senza cambiare il disegno: solo i pesi usati (400–700), solo le
// lettere dell'italiano e dell'Europa occidentale.
// 18/11/2026 (terzo giro, punto 14, approvato da Simone sapendo che si vede): tolta la «dimensione ottica». Il disegno è
// fissato a quello dei 36 punti: nei titoli molto grandi le lettere sono un po' meno sottili, nei titoli piccoli un po' più
// fini. Da 100 a 54 KB. Gli originali con la dimensione ottica sono nella cartella del terzo giro, per tornare indietro.
const fraunces = localFont({
  src: [
    { path: "./fonts/fraunces.woff2", style: "normal", weight: "400 700" },
    { path: "./fonts/fraunces-italic.woff2", style: "italic", weight: "300 700" },
  ],
  variable: "--font-fraunces",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  // 17/11/2026 (20 interventi, punto 10): titolo e descrizione dicono le tre sezioni, come la prima schermata.
  title: { default: "Cura Privata — previeni, capisci i referti, un medico se serve", template: "%s · Cura Privata" },
  description: mediciEnabled()
    ? "Prevenzione: quali esami conoscere, con guide gratuite. Lettura referti: il tuo referto in parole semplici. Medici: in video o a casa. Non è una diagnosi."
    : "Prevenzione: quali esami conoscere, con guide gratuite. Lettura referti: il tuo referto spiegato in parole semplici. Medici: in arrivo. Non è una diagnosi.",
  robots: indexingEnabled() ? { index: true, follow: true } : { index: false, follow: false },
  metadataBase: new URL(SITE_URL),
};

// 19/11/2026: il sito nasce chiaro per tutti (home «chiara e scura», decisione di Simone). La barra del browser prende il
// colore della carta; lo script delle preferenze la fa scura solo se la persona ha scelto la luce scura.
export const viewport: Viewport = {
  themeColor: THEME_COLOR.light,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  const org = organizationLd(readTitolare());
  return (
    <html lang="it" data-theme="light" className={`${manrope.variable} ${fraunces.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: PREFS_INIT_SCRIPT }} />
        {org ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(org) }} /> : null}
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
        <TrackClicks />
      </body>
    </html>
  );
}
