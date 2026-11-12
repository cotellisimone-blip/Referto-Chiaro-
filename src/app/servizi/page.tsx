import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpenText, ClipboardList, ListChecks, Search } from "lucide-react";
import { Section } from "@/components/ui/section";
import { ServiceTriad } from "@/components/offerta/service-triad";
import { FaqList } from "@/components/ui/faq-list";
import { FAQ } from "@/content/faq";

export const metadata: Metadata = {
  title: "I servizi",
  description: "Capisci il tuo referto, chiedi un secondo parere, parla con un medico: i servizi di Cura Privata, e gli strumenti gratuiti.",
  alternates: { canonical: "/servizi" },
};

const NOT_DONE = [
  "Diagnosi automatiche",
  "Prescrizioni o consigli terapeutici",
  "Triage d'urgenza",
  "Lettura diagnostica di immagini TAC, RM o ecografie",
  "Pareri medici senza un professionista realmente coinvolto",
  "Vendita o uso pubblicitario dei tuoi dati",
];

const FREE = [
  { icon: ClipboardList, title: "Preparati alla visita in 2 minuti", href: "/strumenti/preparati-alla-visita", text: "Cosa portare e cosa chiedere, in una lista da stampare." },
  { icon: ListChecks, title: "Domande per il medico", href: "/strumenti/domande-per-il-medico", text: "Le domande giuste per gli esami che hai fatto." },
  { icon: BookOpenText, title: "Guide agli esami", href: "/guide", text: "Che cosa misura un esame e come si legge, con le fonti." },
  { icon: Search, title: "Glossario", href: "/glossario", text: "Le sigle del referto spiegate in una riga." },
];

export default function ServiziPage() {
  return (
    <>
      <section aria-labelledby="servizi-titolo" className="bg-ivory-wash">
        <div className="container-rc pb-12 pt-12 sm:pt-16">
          <p className="eyebrow">I servizi di Cura Privata</p>
          <h1 id="servizi-titolo" className="display-xl mt-5 max-w-4xl">
            Dal referto al medico, <span className="marker">un passo alla volta.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-xl text-ink-soft">Tre servizi in un unico spazio. Non sai quale ti serve? Rispondi a una domanda e te lo diciamo noi.</p>
          <Link href="/inizia" className="btn btn-secondary btn-lg mt-8">
            Ti aiutiamo a scegliere <ArrowRight aria-hidden className="btn-arrow h-5 w-5" />
          </Link>
        </div>
      </section>
      <div className="container-rc py-12 sm:py-16">
        <ServiceTriad headingLevel={2} />
        <p className="mt-6 text-[1.0625rem] text-muted">
          <Link href="/prezzi" className="link font-semibold">
            Confronta prezzi e tempi
          </Link>
          <span aria-hidden> · </span>
          <Link href="/stato-del-progetto" className="link">
            Stato del progetto
          </Link>
        </p>
      </div>
      <Section id="gratis" tone="paper" eyebrow="Gratis, per tutti" title="Strumenti e guide, senza registrarti.">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {FREE.map(({ icon: Icon, title, href, text }) => (
            <li key={href}>
              <Link href={href} className="card card-lift flex h-full flex-col p-6">
                <Icon aria-hidden className="h-7 w-7 text-teal" />
                <span className="mt-4 text-xl font-bold leading-snug text-ink">{title}</span>
                <span className="mt-1 text-[1.0625rem] text-ink-soft">{text}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>
      <Section id="non-facciamo" tone="paper" eyebrow="Per chiarezza" title="Che cosa non facciamo.">
        <ul className="grid gap-3 sm:grid-cols-2">
          {NOT_DONE.map((x) => (
            <li key={x} className="rounded-xl border border-line bg-canvas px-5 py-4 text-ink">
              {x}
            </li>
          ))}
        </ul>
      </Section>
      <Section id="faq-servizi" eyebrow="Domande" title="Prima di scegliere.">
        <FaqList items={FAQ.filter((f) => f.topic === "pagamenti" || f.topic === "servizio").slice(0, 5)} />
      </Section>
    </>
  );
}
