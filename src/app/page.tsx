import type { Metadata } from "next";
import { HomeB } from "@/components/home-b/home-b";
import { MobileHelpBar } from "@/components/site/mobile-help-bar";
import { PageLd } from "@/components/site/page-ld";
import { mediciEnabled } from "@/lib/medici";

/** 17/11/2026 (20 interventi, punto 13): la home dichiara il suo indirizzo canonico, come tutte le altre pagine. */
export const metadata: Metadata = { alternates: { canonical: "/" } };

/**
 * 19/11/2026: la home «chiara e scura» (Simone: «Sì a questa home»), al posto della home a tre sezioni (tolta il 27/11:
 * resta nella storia di git). Dal 22/11 il percorso in cinque passi, il medico in video, «Prenditi cura di te».
 * 27/11/2026: la descrizione dei dati strutturati è la stessa del sito (layout.tsx): niente più «a casa, a Brescia».
 */
export default function Home() {
  return (
    <>
      <PageLd
        path="/"
        meta={{
          description: mediciEnabled()
            ? "Cinque passi per la tua salute: poche domande su di te, gli esami da conoscere, il referto spiegato, un medico in video, e ogni giorno sonno e alimentazione."
            : "Cinque passi per la tua salute: poche domande su di te, gli esami da conoscere, il referto spiegato in parole semplici, e ogni giorno sonno e alimentazione.",
        }}
      />
      <HomeB />
      <MobileHelpBar />
    </>
  );
}
