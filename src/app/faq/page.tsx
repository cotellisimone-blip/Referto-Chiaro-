import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { FaqList } from "@/components/ui/faq-list";
import { FAQ } from "@/content/faq";

export const metadata: Metadata = { title: "Domande frequenti" };

const GROUPS = [
  { key: "servizio", title: "Il servizio" },
  { key: "dati", title: "Documenti e dati" },
  { key: "medico", title: "Secondo parere medico" },
  { key: "pagamenti", title: "Prezzi" },
] as const;

export default function FaqPage() {
  return (
    <>
      <PageHeader art="faq" eyebrow="FAQ" title="Domande frequenti." lead="Risposte dirette, anche quando la risposta è «non ancora»." />
      <div className="container-rc space-y-12 py-14 sm:py-20">
        {GROUPS.map((g) => (
          <section key={g.key} aria-labelledby={`faq-${g.key}`}>
            <h2 id={`faq-${g.key}`} className="mb-5 font-serif text-2xl sm:text-3xl">
              {g.title}
            </h2>
            <FaqList items={FAQ.filter((f) => f.topic === g.key)} />
          </section>
        ))}
      </div>
    </>
  );
}
