import type { Metadata } from "next";
import { Suspense } from "react";

/**
 * Prova delle prestazioni con un medico (domicilio, videoconsulto, secondo parere) con tre ruoli.
 * Dati fittizi, stato nel browser, nessuna integrazione reale: mai indicizzata.
 */
export const metadata: Metadata = {
  title: { default: "Prova le prestazioni", template: "%s · Prova · Cura Privata" },
  robots: { index: false, follow: false, nocache: true },
};

export default function ProvaLayout({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={null}>{children}</Suspense>;
}
