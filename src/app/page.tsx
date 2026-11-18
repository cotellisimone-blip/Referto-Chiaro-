import type { Metadata } from "next";
import { HomeDueSezioni } from "@/components/home/home-due-sezioni";
import { PageLd } from "@/components/site/page-ld";

/** 17/11/2026 (20 interventi, punto 13): la home dichiara il suo indirizzo canonico, come tutte le altre pagine. */
export const metadata: Metadata = { alternates: { canonical: "/" } };

/** Home a tre sezioni (15/11/2026 sera): Prevenzione, Lettura referti, Medici. */
export default function Home() {
  return (
    <>
      <PageLd path="/" meta={{ description: "Prevenzione: quali esami conoscere, con guide gratuite. Lettura referti: il tuo referto spiegato in parole semplici. Non è una diagnosi." }} />
      <HomeDueSezioni />
    </>
  );
}
