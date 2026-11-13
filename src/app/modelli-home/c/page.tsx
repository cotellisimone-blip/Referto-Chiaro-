import type { Metadata } from "next";
import { ModelloC } from "@/components/home-modelli/modello-c";

/** Modello di home da approvare (13/11/2026). Non indicizzato, non nel menu né nella mappa del sito. */
export const metadata: Metadata = { title: "Modello di home C", robots: { index: false, follow: false } };

export default function Page() {
  return <ModelloC />;
}
