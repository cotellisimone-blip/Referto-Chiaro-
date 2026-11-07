import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import Link from "next/link";
import { Section } from "@/components/ui/section";
import { WaitlistForm } from "@/components/site/waitlist-form";
import { ServiceCards } from "@/components/ui/service-cards";
import { FaqList } from "@/components/ui/faq-list";
import { FAQ } from "@/content/faq";

export const metadata: Metadata = { title: "Servizi & Prezzi" };

const NOT_DONE = [
  "Diagnosi automatiche",
  "Prescrizioni o consigli terapeutici",
  "Triage d'urgenza",
  "Lettura diagnostica di immagini TAC, RM o ecografie",
  "Valutazioni per minori o condizioni fuori dal perimetro del servizio",
  "Pareri medici senza un professionista realmente coinvolto",
];

export default function ServiziPrezziPage() {
  return (
    <>
      <PageHeader
        art="dossier"
        eyebrow="Servizi & Prezzi"
        title="Scegli quanta chiarezza ti serve."
        lead="Da un singolo referto a un dossier per la prossima visita. Ogni servizio ha uno scopo preciso e limiti dichiarati prima, non dopo."
      >
        <p className="mt-6 inline-flex rounded-xl bg-cream/80 px-4 py-3 text-[0.9375rem] text-ink">
          Prezzi indicativi, in fase di validazione: in questa versione non è possibile acquistare nulla.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link href="/esempio" className="btn btn-primary">
            Prova la demo
          </Link>
          <Link href="/accedi" className="btn btn-secondary">
            Crea il tuo archivio gratuito
          </Link>
        </div>
      </PageHeader>
      <div className="container-rc py-14 sm:py-20">
        <ServiceCards detailed />
      </div>
      <Section id="non-facciamo" tone="paper" eyebrow="Per chiarezza" title="Che cosa non facciamo.">
        <ul className="grid gap-3 sm:grid-cols-2">
          {NOT_DONE.map((x) => (
            <li key={x} className="rounded-xl border border-line bg-canvas px-5 py-4 text-ink">
              {x}
            </li>
          ))}
        </ul>
        <p className="mt-6 max-w-3xl text-muted">
          Condizioni di pagamento, IVA, diritto di recesso e rimborsi saranno definiti e pubblicati prima dell&apos;apertura. Se un documento non potrà essere elaborato in modo affidabile, non verrà addebitato nulla.
        </p>
      </Section>
      <Section id="avvisami" tone="mist" eyebrow="Lista d'attesa" title="Vuoi essere avvisato?" lead="Il servizio Completo non è ancora acquistabile. Lascia la tua email per un interesse non vincolante.">
        <div className="max-w-2xl">
          <WaitlistForm interest="completo" />
        </div>
      </Section>
      <Section id="faq-prezzi" eyebrow="Domande" title="Prima di scegliere.">
        <FaqList items={FAQ.filter((f) => f.topic === "pagamenti" || f.topic === "servizio").slice(0, 5)} />
      </Section>
    </>
  );
}
