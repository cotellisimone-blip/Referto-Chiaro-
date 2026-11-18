import { pageTitle } from "@/lib/seo";
import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { FaqFinder } from "@/components/ui/faq-finder";
import { FAQ } from "@/content/faq";
import { mediciEnabled } from "@/lib/medici";
import { PageLd } from "@/components/site/page-ld";

export const metadata: Metadata = {
  title: pageTitle("Referto spiegato online: le domande frequenti"),
  description: `Domande frequenti su Cura Privata: come funziona la spiegazione dei referti, ${mediciEnabled() ? "i medici, " : ""}i prezzi, i tuoi dati e che cosa non facciamo.`,
  alternates: { canonical: "/domande-frequenti" },
};

const GROUPS = [
  { key: "servizio", title: "Il referto spiegato" },
  { key: "medico", title: "Con un medico" },
  { key: "dati", title: "Documenti e dati" },
  { key: "pagamenti", title: "Prezzi e pagamenti" },
] as const;

export default function FaqPage() {
  return (
    <>
      <PageLd path="/domande-frequenti" meta={metadata} name="Domande frequenti" faq={FAQ} />
      <PageHeader art="faq" eyebrow="Aiuto" title="Domande frequenti." lead="Risposte dirette, anche quando la risposta è «non ancora»." />
      <FaqFinder items={FAQ.map((f) => ({ q: f.q, a: f.a, topic: f.topic }))} groups={GROUPS} />
    </>
  );
}
