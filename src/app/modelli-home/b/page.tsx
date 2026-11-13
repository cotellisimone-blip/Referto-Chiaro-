import type { Metadata } from "next";
import { ModelloB } from "@/components/home-modelli/modello-b";

/** Modello di home da approvare (13/11/2026). Non indicizzato, non nel menu né nella mappa del sito. */
export const metadata: Metadata = { title: "Modello di home B", robots: { index: false, follow: false } };

export default function Page() {
  return <ModelloB />;
}
