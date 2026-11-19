import type { Metadata } from "next";
import { HomeB } from "@/components/home-b/home-b";
import { MobileHelpBar } from "@/components/site/mobile-help-bar";
import { PageLd } from "@/components/site/page-ld";
import { mediciEnabled } from "@/lib/medici";

/** 17/11/2026 (20 interventi, punto 13): la home dichiara il suo indirizzo canonico, come tutte le altre pagine. */
export const metadata: Metadata = { alternates: { canonical: "/" } };

/**
 * 19/11/2026: la home «chiara e scura» (Simone: «Sì a questa home»), al posto della home a tre sezioni (che resta in
 * src/components/home/home-due-sezioni.tsx, per tornare indietro). Il percorso in quattro passi, il medico, i mondi da
 * esplorare, vicino a casa e nel tempo.
 */
export default function Home() {
  return (
    <>
      <PageLd
        path="/"
        meta={{
          description: mediciEnabled()
            ? "Prevenzione e stato di salute: fai gli esami di base, carica il referto e ricevi la tua guida personale. Un medico in video o a casa, a Brescia. Non è una diagnosi."
            : "Prevenzione e stato di salute: fai gli esami di base, carica il referto e ricevi la tua guida personale. Presto anche un medico, in video o a casa. Non è una diagnosi.",
        }}
      />
      <HomeB />
      <MobileHelpBar />
    </>
  );
}
