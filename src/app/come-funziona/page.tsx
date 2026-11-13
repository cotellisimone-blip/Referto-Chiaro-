import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Ban, Check, FlaskConical, LockKeyhole, X } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { OFFER_ICON } from "@/components/offerta/service-triad";
import { offerItems, type OfferKey } from "@/domain/prestazioni/offerta-completa";

export const metadata: Metadata = {
  title: "Come funziona",
  description: "Come funziona Cura Privata: il referto spiegato in automatico e, quando serve, un medico a casa, in video o per un secondo parere. Scegli tu fin dove arrivare.",
  alternates: { canonical: "/come-funziona" },
};

/** Una riga per servizio: che cosa fai tu, che cosa ricevi. I dettagli stanno nelle pagine dei servizi. */
const HOW: Record<OfferKey, { you: string; get: string }> = {
  capisci: { you: "Carichi il referto e controlli i valori letti, uno per uno.", get: "Un report chiaro, con ogni valore spiegato e le domande per il medico." },
  domicilio: { you: "Verifichi il CAP, scegli una fascia libera e confermi quando il medico ha accettato.", get: "La visita a casa e un riepilogo scritto, con il prossimo passo." },
  video: { you: "Scegli una fascia e i documenti da condividere.", get: "Un videoconsulto con un medico che li ha già letti, e un riepilogo scritto." },
  parere: { you: "Scegli i documenti e scrivi la domanda che hai.", get: "Un videoconsulto con lo specialista e una sintesi scritta sul tuo quesito." },
};

const CAN = ["Riportare valori, unità e intervalli come stampati", "Spiegare che cosa misura un esame", "Suggerire domande per il medico", "Fermarsi se un dato non si legge"];
const CANNOT = ["Fare diagnosi o dire se un valore è un problema per te", "Valutare l'urgenza o sostituire il pronto soccorso", "Consigliare farmaci o terapie", "Firmarsi come parere medico"];

const DATA = [
  { icon: FlaskConical, title: "Oggi, nella demo", text: "Nessun documento reale: solo file inventati, niente viene salvato." },
  { icon: LockKeyhole, title: "Con il servizio attivo", text: "Uno spazio privato e cifrato, visibile solo a te e al medico che scegli." },
  { icon: Ban, title: "Mai", text: "I referti non finiscono in email, statistiche o pubblicità." },
];

export default function ComeFunzionaPage() {
  return (
    <>
      <PageHeader eyebrow="Come funziona" title="Scegli tu fin dove arrivare." lead="Puoi fermarti al referto spiegato, o andare avanti con un medico. I documenti che carichi restano nella tua area: non li ricarichi.">
        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
          <Link href="/referti/esempio" className="btn btn-primary btn-lg sm:shrink-0">
            Prova con un referto di esempio <ArrowRight aria-hidden className="btn-arrow h-5 w-5" />
          </Link>
          <span className="text-[1.0625rem] text-muted">Senza registrazione, con dati inventati.</span>
        </div>
      </PageHeader>

      <section aria-labelledby="percorso-titolo" className="section">
        <div className="container-rc">
          <h2 id="percorso-titolo" className="display-lg max-w-3xl">
            Che cosa fai tu, che cosa ricevi.
          </h2>
          <ol className="how-grid mt-7 sm:mt-10">
            {offerItems().map((s) => {
              const Icon = OFFER_ICON[s.icon];
              const h = HOW[s.key];
              return (
                <li key={s.key} className={`tone-${s.tone}`}>
                  <article className="how-card">
                    <div className="flex items-center gap-4">
                      <span aria-hidden className="tile-ico tile-ico-tone">
                        <Icon />
                      </span>
                      <h3 className="svc-card-title">
                        <Link href={s.href} className="after:absolute after:inset-0 focus-visible:outline-none">
                          {s.name}
                        </Link>
                      </h3>
                    </div>
                    <dl className="how-pair">
                      <div>
                        <dt>Tu</dt>
                        <dd>{h.you}</dd>
                      </div>
                      <div>
                        <dt>Ricevi</dt>
                        <dd>{h.get}</dd>
                      </div>
                    </dl>
                    <p className="how-go">
                      Scopri il servizio <ArrowRight aria-hidden className="h-5 w-5" />
                    </p>
                  </article>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      <Section id="limiti" tone="mist" eyebrow="Trasparenza" title="La spiegazione automatica: che cosa fa, e che cosa no.">
        <div className="grid grid-cols-[minmax(0,1fr)] gap-4 md:grid-cols-2 lg:gap-6">
          <div className="incl-card tone-capisci">
            <h3 className="box-title">Fa</h3>
            <ul className="check-list">
              {CAN.map((c) => (
                <li key={c}>
                  <span aria-hidden className="check-dot">
                    <Check />
                  </span>
                  {c}
                </li>
              ))}
            </ul>
          </div>
          <div className="excl-card">
            <h3 className="box-title">Non fa, per scelta</h3>
            <ul className="check-list text-ink-soft">
              {CANNOT.map((c) => (
                <li key={c}>
                  <span aria-hidden className="cross-dot">
                    <X />
                  </span>
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <p className="mt-6 text-lg text-ink-soft">Ogni valutazione medica la fa un medico abilitato, con nome e firma.</p>
      </Section>

      <Section id="dati" eyebrow="I tuoi dati" title="Che cosa succede ai documenti.">
        <ul className="grid grid-cols-[minmax(0,1fr)] gap-3 sm:gap-5 lg:grid-cols-3">
          {DATA.map(({ icon: Icon, title, text }) => (
            <li key={title} className="tile-card">
              <span aria-hidden className="tile-ico">
                <Icon />
              </span>
              <div>
                <h3 className="tile-card-title">{title}</h3>
                <p className="tile-card-text">{text}</p>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-6">
          <Link href="/sicurezza-e-privacy" className="link inline-flex min-h-11 items-center text-lg font-semibold">
            Sicurezza e privacy, per esteso
          </Link>
        </p>
      </Section>
    </>
  );
}
