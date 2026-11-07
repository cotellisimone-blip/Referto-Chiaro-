import type { Metadata } from "next";
import Link from "next/link";
import { Clock3, FileSearch, ShieldCheck, UserRoundCheck } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";

export const metadata: Metadata = { title: "Secondo parere medico" };

const TRANSPARENCY = [
  { icon: UserRoundCheck, title: "Non è una risposta dell'intelligenza artificiale", text: "Il parere è scritto e firmato da un medico abilitato, identificabile, sotto la sua responsabilità." },
  { icon: FileSearch, title: "Il medico valuta gli originali", text: "Lavora sui documenti che fornisci e può chiederti integrazioni prima di rispondere." },
  { icon: Clock3, title: "Specialità, prezzo e tempi prima di pagare", text: "Saprai chi è disponibile, quanto costa e in quanto tempo, prima di qualsiasi addebito." },
  { icon: ShieldCheck, title: "Il medico può non accettare", text: "Se il caso richiede una visita in presenza o non è adatto a una consulenza a distanza, te lo dirà e non pagherai." },
];

export default function SecondoParerePage() {
  return (
    <>
      <PageHeader
        eyebrow="Secondo parere medico"
        title="Un altro punto di vista, da un medico vero."
        lead="Quando hai già un quesito clinico e documenti pertinenti, un professionista abilitato può offrirti una valutazione indipendente, nei limiti di una consulenza a distanza."
      >
        <div role="status" className="mt-8 rounded-2xl border border-line bg-paper p-5 sm:p-6">
          <p className="chip bg-cream text-ink">Servizio in preparazione</p>
          <p className="mt-3 text-ink">
            Stiamo definendo il servizio e i requisiti professionali. Non accettiamo ancora richieste cliniche né documenti sanitari per questo servizio, e non c&apos;è ancora alcun medico disponibile.
          </p>
        </div>
      </PageHeader>
      <Section id="come-sara" eyebrow="Come funzionerà" title="Trasparenza prima di tutto.">
        <ul className="grid gap-5 sm:grid-cols-2">
          {TRANSPARENCY.map(({ icon: Icon, title, text }) => (
            <li key={title} className="card p-6 sm:p-7">
              <Icon aria-hidden className="h-6 w-6 text-teal" />
              <h3 className="mt-4 text-lg font-semibold text-ink">{title}</h3>
              <p className="mt-2 text-muted">{text}</p>
            </li>
          ))}
        </ul>
      </Section>
      <Section id="non-idonei" tone="paper" eyebrow="Limiti" title="Quando non è la strada giusta.">
        <ul className="max-w-3xl space-y-3 text-lg text-ink-soft">
          <li>• Emergenze e sintomi in corso: chiama il 112.</li>
          <li>• Situazioni che richiedono una visita in presenza o esami aggiuntivi.</li>
          <li>• Richieste di prescrizione o di modifica di una terapia.</li>
          <li>• Minori, nella prima versione del servizio.</li>
        </ul>
        <p className="mt-8 text-muted">
          Prezzo indicativo: da 99 €, variabile per specialità e complessità.{" "}
          <Link href="/servizi-prezzi" className="link">
            Confronta i servizi
          </Link>
        </p>
      </Section>
    </>
  );
}
