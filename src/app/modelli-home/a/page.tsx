import type { Metadata } from "next";
import { ModelloA } from "@/components/home-modelli/modello-a";

/** Modello di home da approvare (13/11/2026). Non indicizzato, non nel menu né nella mappa del sito. */
export const metadata: Metadata = { title: "Modello di home A", robots: { index: false, follow: false } };

export default function Page() {
  return <ModelloA />;
}
