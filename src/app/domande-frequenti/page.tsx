import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { FaqFinder } from "@/components/ui/faq-finder";
import { FAQ } from "@/content/faq";

export const metadata: Metadata = { title: "Domande frequenti", description: "Domande frequenti su Cura Privata: come funziona la spiegazione dei referti, prezzi, privacy, quando interviene un medico e che cosa non facciamo." };

const GROUPS = [
  { key: "servizio", title: "Il servizio" },
  { key: "dati", title: "Documenti e dati" },
  { key: "medico", title: "Secondo parere medico" },
  { key: "pagamenti", title: "Prezzi" },
] as const;

export default function FaqPage() {
  return (
    <>
      <PageHeader compact eyebrow="FAQ" title="Domande frequenti." lead="Risposte dirette, anche quando la risposta è «non ancora»." />
      <FaqFinder items={FAQ.map((f) => ({ q: f.q, a: f.a, topic: f.topic }))} groups={GROUPS} />
    </>
  );
}
