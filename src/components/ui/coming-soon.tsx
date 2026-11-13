import Link from "next/link";
import { CircleDashed } from "lucide-react";
import { PageHeader, type HeaderArt } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { WaitlistForm } from "@/components/site/waitlist-form";

/**
 * Pagina di un servizio Cura Privata «In preparazione», grafica «Luce».
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
        <p className="mt-6 flex max-w-[38rem] items-start gap-2.5 text-[1.0625rem] font-semibold leading-snug text-ink">
          <CircleDashed aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-warn" />
          Servizio in preparazione: oggi non è attivo e non raccoglie documenti.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <a href="#avvisami" className="btn btn-primary btn-lg">
            Avvisami quando parte
          </a>
          <Link href="/servizi" className="btn btn-secondary btn-lg">
            Che cosa puoi fare oggi
          </Link>
        </div>
      </PageHeader>

      <section aria-labelledby="come-sara-titolo" id="come-sara" className="section scroll-mt-24">
        <div className="container-rc">
          <div className="max-w-3xl">
            <p className="eyebrow">Come lo stiamo pensando</p>
            <h2 id="come-sara-titolo" className="display-lg mt-3">
              Un&apos;idea chiara, prima ancora del servizio.
            </h2>
          </div>
          <ol className="steps mt-7 sm:mt-12">
            {plan.map((p, i) => (
              <li key={p.title} className="step">
                <span aria-hidden className="step-num">
                  {i + 1}
                </span>
                <div>
                  <h3 className="step-title">{p.title}</h3>
                  <p className="step-text">{p.text}</p>
                </div>
              </li>
            ))}
          </ol>
          {notes ? <div className="mt-8 max-w-3xl text-lg text-ink-soft">{notes}</div> : null}
        </div>
      </section>

      <Section id="prima-di-aprire" eyebrow="Prima di aprirlo" title="Che cosa deve essere pronto." size="md">
        <ul className="status-list status-list-grid">
          {prerequisites.map((x) => (
            <li key={x}>
              <CircleDashed aria-hidden />
              {x}
            </li>
          ))}
        </ul>
        <p className="mt-6 max-w-3xl text-lg text-ink-soft">Finché questi punti non sono chiusi e documentati, il servizio resta spento. Non c&apos;è una data promessa.</p>
      </Section>

      <Section id="avvisami" tone="mist" eyebrow="Lista d'attesa" title="Avvisami quando parte." lead="Solo la tua email, per un interesse non vincolante. Non scrivere informazioni sulla tua salute.">
        <div className="max-w-2xl">
          <WaitlistForm interest={interest} />
        </div>
        <p className="mt-6">
          <Link href="/servizi" className="link inline-flex min-h-11 items-center text-lg font-semibold">
            Tutti i servizi di Cura Privata
          </Link>
        </p>
      </Section>
    </>
  );
}
