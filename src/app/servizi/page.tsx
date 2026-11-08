import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import Link from "next/link";
import { Section } from "@/components/ui/section";
import { WaitlistForm } from "@/components/site/waitlist-form";
import { ServiceCards } from "@/components/ui/service-cards";
import { EcosystemCards } from "@/components/ui/ecosystem-cards";
import { publicPricesEnabled } from "@/domain/ecosystem";
import { FaqList } from "@/components/ui/faq-list";
import { FAQ } from "@/content/faq";

export const metadata: Metadata = {
  title: "I servizi",
  description: "I servizi di Cura Privata con il loro stato reale: oggi la comprensione dei referti in versione dimostrativa, gli altri in preparazione.",
};

const NOT_DONE = [
  "Diagnosi automatiche",
  "Prescrizioni o consigli terapeutici",
  "Triage d'urgenza",
  "Lettura diagnostica di immagini TAC, RM o ecografie",
  "Valutazioni per minori o condizioni fuori dal perimetro del servizio",
  "Pareri medici senza un professionista realmente coinvolto",
];

export default function ServiziPage() {
  const prices = publicPricesEnabled();
  return (
    <>
      <PageHeader
        art="dossier"
        eyebrow="I servizi di Cura Privata"
        title="Un solo spazio. Un servizio alla volta."
        lead="Si comincia dai referti: capire il linguaggio degli esami e preparare le domande per il medico. Gli altri servizi arriveranno solo quando saranno pronti davvero."
      >
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link href="/referti/esempio" className="btn btn-primary">
            Prova la demo
          </Link>
          <Link href="/referti" className="btn btn-secondary">
            Scopri «Comprendi i tuoi referti»
          </Link>
        </div>
      </PageHeader>
      <div className="container-rc py-14 sm:py-20">
        <EcosystemCards />
      </div>
      <Section
        id="formule"
        tone="paper"
        eyebrow="Comprendi i tuoi referti"
        title="Le formule allo studio."
        lead={prices ? "Prezzi indicativi, in fase di validazione: in questa versione non è possibile acquistare nulla." : "Il listino non è ancora definito: lo pubblicheremo quando il servizio sarà attivo. In questa versione non è possibile acquistare nulla."}
      >
        <ServiceCards detailed />
      </Section>
      <Section id="non-facciamo" eyebrow="Per chiarezza" title="Che cosa non facciamo.">
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
      <Section id="avvisami" tone="mist" eyebrow="Lista d'attesa" title="Vuoi essere avvisato?" lead="La formula Completo non è ancora disponibile. Lascia la tua email per un interesse non vincolante.">
        <div className="max-w-2xl">
          <WaitlistForm interest="completo" />
        </div>
      </Section>
      <Section id="faq-servizi" eyebrow="Domande" title="Prima di scegliere.">
        <FaqList items={FAQ.filter((f) => f.topic === "pagamenti" || f.topic === "servizio").slice(0, 5)} />
      </Section>
    </>
  );
}
