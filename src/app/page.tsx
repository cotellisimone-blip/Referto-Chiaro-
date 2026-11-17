import type { Metadata } from "next";
import { HomeDueSezioni } from "@/components/home/home-due-sezioni";

/** 17/11/2026 (20 interventi, punto 13): la home dichiara il suo indirizzo canonico, come tutte le altre pagine. */
export const metadata: Metadata = { alternates: { canonical: "/" } };

/** Home a tre sezioni (15/11/2026 sera): Prevenzione, Lettura referti, Medici. */
export default function Home() {
  return <HomeDueSezioni />;
}
