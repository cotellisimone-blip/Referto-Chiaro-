import { pageTitle } from "@/lib/seo";
import "@/components/offerta/offerta.css";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Ban, Check, Compass, FlaskConical, HeartPulse, Leaf, LockKeyhole, Stethoscope, X, type LucideIcon } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { OFFER_ICON } from "@/components/offerta/service-triad";
import { offerItems, type OfferKey } from "@/domain/prestazioni/offerta-completa";
import { mediciEnabled } from "@/lib/medici";
import { PERCORSO } from "@/components/site/nav";
import { PageLd } from "@/components/site/page-ld";

/** 14/11/2026: senza medici (src/lib/medici.ts) la pagina racconta il referto, il tempo e la visita dal proprio medico. */
const MEDICI = mediciEnabled();

export const metadata: Metadata = {
  title: pageTitle("Come farsi spiegare un referto, passo per passo"),
  description: MEDICI
    ? "Come funziona Cura Privata: il referto spiegato in automatico e, quando serve, un medico in video o per un secondo parere. Scegli tu fin dove arrivare."
    : "Come funziona Cura Privata: carichi il referto, controlli i valori letti e leggi la spiegazione in parole semplici, con le domande per il tuo medico.",
  alternates: { canonical: "/come-funziona" },
};

/** Una riga per servizio: che cosa fai tu, che cosa ricevi. I dettagli stanno nelle pagine dei servizi. */
const HOW: Record<OfferKey, { you: string; get: string }> = {
  capisci: { you: "Carichi il referto e controlli i valori letti, uno per uno.", get: "Un report chiaro, con ogni valore spiegato e le domande per il medico." },
  domicilio: { you: "Verifichi il CAP, scegli una fascia libera e confermi quando il medico ha accettato.", get: "La visita a casa e un riepilogo scritto, con il prossimo passo." },
  video: { you: "Scegli una fascia e i documenti da condividere.", get: "Un videoconsulto con un medico che li ha già letti, e un riepilogo scritto." },
  parere: { you: "Scegli i documenti e scrivi la domanda che hai.", get: "Un videoconsulto con lo specialista e una sintesi scritta sul tuo quesito." },
};

type HowCard = { key: string; tone: string; href: string; name: string; Icon: LucideIcon; you: string; get: string; go: string };

/**
 * Le schede della pagina: i cinque passi del percorso, come nel menu e nella home.
 * 22/11/2026 (analisi di chiarezza, punto 31, sì di Simone): prima erano i servizi del listino, un ordine diverso dal resto
 * del sito. Il passo 3 e il passo 4 prendono nome e testi dal listino; il medico solo con l'interruttore acceso.
 */
function howCards(): HowCard[] {
  const items = offerItems();
  const capisci = items.find((s) => s.key === "capisci")!;
  const video = items.find((s) => s.key === "video");
  const p = (n: number) => PERCORSO.find((x) => x.n === n)!;
  return [
    { key: "passo-1", tone: "partenza", href: p(1).href, name: `1 · ${p(1).label}`, Icon: Compass, you: "Rispondi a poche domande, senza registrarti e senza sintomi.", get: "La tua mappa: che cosa sai già, che cosa chiedere al medico. Gratis.", go: "Comincia" },
    { key: "passo-2", tone: "partenza", href: p(2).href, name: `2 · ${p(2).label}`, Icon: HeartPulse, you: "Guardi gli esami di base e gli screening per la tua età.", get: "Che cosa misura ogni esame e quali screening sono gratuiti. Gratis.", go: "Apri" },
    { key: "passo-3", tone: capisci.tone, href: capisci.href, name: `3 · ${p(3).label}`, Icon: OFFER_ICON[capisci.icon], ...HOW.capisci, go: "Scopri il servizio" },
    MEDICI && video
      ? { key: "passo-4", tone: video.tone, href: p(4).href, name: `4 · ${p(4).label}`, Icon: OFFER_ICON[video.icon], ...HOW.video, go: "Scopri" }
      : { key: "passo-4", tone: "medico", href: p(4).href, name: `4 · ${p(4).label}`, Icon: Stethoscope, you: "Lasci l'email, se vuoi.", get: "Un medico in video, con i tuoi referti già letti: in arrivo. Ti avvisiamo quando parte.", go: "Scopri" },
    { key: "passo-5", tone: "partenza", href: p(5).href, name: `5 · ${p(5).label}`, Icon: Leaf, you: "Scegli un tema: sonno, alimentazione, intestino, integratori.", get: "Percorsi e schede spiegati, con le domande per il medico. Gratis.", go: "Apri" },
  ];
}

const CAN = ["Riportare valori, unità e intervalli come stampati", "Spiegare che cosa misura un esame", "Suggerire domande per il medico", "Fermarsi se un dato non si legge"];
const CANNOT = ["Fare diagnosi o dire se un valore è un problema per te", "Valutare l'urgenza o sostituire il pronto soccorso", "Consigliare farmaci o terapie", "Firmarsi come parere medico"];

const DATA = [
  { icon: FlaskConical, title: "Oggi, nella demo", text: "Nessun documento reale: solo file inventati, niente viene salvato." },
  { icon: LockKeyhole, title: "Con il servizio attivo", text: MEDICI ? "Uno spazio privato e cifrato, visibile solo a te e al medico che scegli." : "Uno spazio privato e cifrato, visibile solo a te." },
  { icon: Ban, title: "Mai", text: "I referti non finiscono in email, statistiche o pubblicità." },
];

export default function ComeFunzionaPage() {
  return (
    <>
      <PageLd path="/come-funziona" meta={metadata} name="Come funziona" />
      <PageHeader eyebrow="Come funziona" title="Scegli tu fin dove arrivare." lead={MEDICI ? "Cinque passi, dal conoscerti al prenderti cura di te. Molti sono gratis; paghi solo il referto spiegato e il medico. I documenti che carichi restano nel tuo spazio: non li ricarichi." : "Cinque passi, dal conoscerti al prenderti cura di te. Molti sono gratis; paghi solo il referto spiegato. Lo ritrovi nel tuo spazio, in fila con gli altri, e arrivi alla visita con le domande pronte."}>
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
            Cinque passi: che cosa fai tu, che cosa ricevi.
          </h2>
          <ol className="how-grid mt-7 sm:mt-10">
            {howCards().map((s) => {
              const Icon = s.Icon;
              const h = s;
              return (
                <li key={s.key} className={`tone-${s.tone}`}>
                  <article className="how-card">
                    {/* Il titolo tiene accanto all'icona lo spazio di una parola lunga; se non c'è, passa sotto. */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
                      <span aria-hidden className="tile-ico tile-ico-tone">
                        <Icon />
                      </span>
                      <h3 className="svc-card-title min-w-0 flex-[1_1_12.5rem]">
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
                      {s.go} <ArrowRight aria-hidden className="h-5 w-5" />
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
        <p className="mt-6 text-lg text-ink-soft">{MEDICI ? "Ogni valutazione medica la fa un medico abilitato, con nome e firma." : "Ogni valutazione medica spetta al tuo medico: la spiegazione serve a parlargli meglio."}</p>
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
