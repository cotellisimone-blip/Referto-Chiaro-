import type { Metadata } from "next";
import { Suspense } from "react";

/** Percorso del paziente per le prestazioni con un medico: pagine personali, mai indicizzate. */
export const metadata: Metadata = {
  title: { default: "Nuova richiesta", template: "%s · Cura Privata" },
  robots: { index: false, follow: false, nocache: true },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={null}>{children}</Suspense>;
}
