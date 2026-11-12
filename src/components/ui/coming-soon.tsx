import Link from "next/link";
import { ArrowRight, CircleDashed, ShieldCheck } from "lucide-react";
import { PageHeader, type HeaderArt } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { WaitlistForm } from "@/components/site/waitlist-form";

/**
 * Pagina di un servizio Cura Privata «In preparazione».
 * Descrive com'è pensato, che cosa serve prima di aprirlo e offre solo una lista d'attesa (email, nessun dato sanitario).
 * Nessun pulsante di prenotazione, caricamento o pagamento: il kit lo vieta finché il servizio non esiste davvero.
 */
export function ComingSoonPage({
  eyebrow,
  title,
  lead,
  art,
  plan,
  prerequisites,
  notes,
  interest,
}: {
  eyebrow: string;
  title: string;
  lead: string;
  art: HeaderArt;
  plan: { title: string; text: string }[];
  prerequisites: string[];
  notes?: React.ReactNode;
  interest: "archivio" | "visite" | "prevenzione" | "secondo-parere";
}) {
  return (
    <>
      <PageHeader art={art} eyebrow={eyebrow} title={title} lead={lead}>
        <p className="mt-7 inline-flex items-center gap-2.5 rounded-xl border border-line bg-paper px-4 py-3 text-[1.0625rem] font-semibold text-ink">
          <CircleDashed aria-hidden className="h-5 w-5 text-teal" />
          Servizio in preparazione: oggi non è attivo e non raccoglie documenti.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <a href="#avvisami" className="btn btn-primary">
            Avvisami quando parte
          </a>
          <Link href="/referti" className="btn btn-secondary">
            Che cosa puoi fare oggi
          </Link>
        </div>
      </PageHeader>
      <Section id="come-sara" eyebrow="Come lo stiamo pensando" title="Un'idea chiara, prima ancora del servizio.">
        <ol className="grid gap-5 md:grid-cols-3">
          {plan.map((p, i) => (
            <li key={p.title} className="card p-6 sm:p-7">
              <span aria-hidden className="num text-[2.75rem] text-sage">
                0{i + 1}
              </span>
              <h3 className="mt-3 text-xl font-bold text-ink">{p.title}</h3>
              <p className="mt-2 text-lg text-ink-soft">{p.text}</p>
            </li>
          ))}
        </ol>
        {notes ? <div className="mt-8 max-w-3xl text-lg text-muted">{notes}</div> : null}
      </Section>
      <Section id="prima-di-aprire" tone="paper" eyebrow="Prima di aprirlo" title="Che cosa deve essere pronto.">
        <ul className="grid gap-3 sm:grid-cols-2">
          {prerequisites.map((x) => (
            <li key={x} className="flex gap-3 rounded-xl border border-line bg-canvas px-5 py-4 text-ink">
              <ShieldCheck aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-teal" />
              {x}
            </li>
          ))}
        </ul>
        <p className="mt-6 max-w-3xl text-muted">Finché questi punti non sono chiusi e documentati, il servizio resta spento. Non c&apos;è una data promessa.</p>
      </Section>
      <Section id="avvisami" tone="mist" eyebrow="Lista d'attesa" title="Avvisami quando parte." lead="Solo la tua email, per un interesse non vincolante. Non scrivere informazioni sulla tua salute.">
        <div className="max-w-2xl">
          <WaitlistForm interest={interest} />
        </div>
        <p className="mt-8">
          <Link href="/servizi" className="inline-flex items-center gap-2 font-semibold text-teal hover:underline">
            Tutti i servizi di Cura Privata <ArrowRight aria-hidden className="h-4 w-4" />
          </Link>
        </p>
      </Section>
    </>
  );
}
