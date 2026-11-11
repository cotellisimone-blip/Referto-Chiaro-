import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowDown, Ban, ClipboardList, Clock3, FileCheck2, Layers, LayoutGrid, Lock, ScanSearch, ShieldCheck } from "lucide-react";
import { AreaIcon, CategoryChip, PuntoDiPartenzaGuide, type PdpPrices } from "@/components/punto-di-partenza/guide";
import { Reveal } from "@/components/ui/reveal";
import { ILLUSTRATIVE_PHOTOS, SHOW_ILLUSTRATIVE_PHOTOS } from "@/content/media";
import { AREAS, CATEGORY_HINT, NOT_ROUTINE, NOT_ROUTINE_SOURCE, type AreaCategory } from "@/content/punto-di-partenza";
import { coreService, priceDisplay, publicPricesEnabled } from "@/domain/offerta";
import { puntoDiPartenzaEnabled } from "@/lib/feature-flags";
import { absoluteUrl, indexingEnabled, NOINDEX_DRAFT } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Punto di Partenza — Conosci meglio la tua salute. Gratis.",
  description:
    "Strumento gratuito: un percorso guidato in 10 aree per raccogliere ciò che sai già, capire cosa discutere con il medico e prepararti ai prossimi controlli. Informativo, non diagnostico.",
  alternates: { canonical: absoluteUrl("/punto-di-partenza") },
  // Finché le 10 aree non hanno la revisione medica, la pagina resta fuori dai motori anche con l'indicizzazione accesa.
  ...(indexingEnabled() && !AREAS.every((a) => a.reviewStatus === "revisionato") ? { robots: NOINDEX_DRAFT } : {}),
};

const PASSI = [
  {
    icon: ClipboardList,
    title: "Rispondi a poche domande",
    text: "Obiettivo, che cosa hai già, un po' di contesto. Circa 3–5 minuti.",
  },
  {
    icon: LayoutGrid,
    title: "Guarda le 10 aree",
    text: "Per ognuna: perché conta, di che cosa parlare, se hai già informazioni.",
  },
  {
    icon: FileCheck2,
    title: "Porta la scheda al medico",
    text: "Un foglio A4 con aree da discutere e domande pronte. Da scaricare o stampare.",
  },
];

/** Tre aree dai nomi brevi per l'anteprima della scheda nell'hero. */
const HERO_AREAS: string[] = ["pressione", "ematologia", "rene"];
const CATS: AreaCategory[] = ["base", "contextual", "not-routine"];
const CAT_ICON = {
  base: ShieldCheck,
  contextual: ScanSearch,
  "not-routine": Layers,
} as const;

export default function PuntoDiPartenzaPage() {
  if (!puntoDiPartenzaEnabled()) notFound();
  const showPrices = publicPricesEnabled();
  const capisci = coreService("capisci");
  const medico = coreService("parla-con-un-medico");
  const cp = priceDisplay("capisci");
  // Fase 3: non la stessa paziente di «Parla con un medico» e delle sezioni della home.
  const photo = ILLUSTRATIVE_PHOTOS.heroSquare;
  const prices: PdpPrices = {
    capisci: showPrices ? { lead: cp.lead, amount: cp.amount } : null,
    medico: showPrices ? priceDisplay("parla-con-un-medico").amount : null,
  };

  return (
    <>
      {/* HERO */}
      <section aria-labelledby="pdp-titolo" className="no-print tone-partenza pdp-hero">
        <div className="container-rc grid items-center gap-10 pb-8 pt-10 sm:pb-12 sm:pt-16 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:pb-16">
          <div>
            <p className="eyebrow">Gratis · Punto di Partenza</p>
            <h1 id="pdp-titolo" className="display-xl mt-5">
              Conosci meglio la tua salute. <span className="marker">Gratis.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-xl text-ink-soft sm:text-[1.375rem] sm:leading-snug">
              Un percorso guidato in 10 aree per raccogliere ciò che sai già, capire cosa discutere con il medico e prepararti ai prossimi controlli.
            </p>
            <a href="#guida" className="btn btn-primary btn-lg mt-8 w-full sm:w-auto">
              Crea il mio Punto di Partenza — Gratis <ArrowDown aria-hidden className="h-5 w-5 shrink-0" />
            </a>
            <p className="mt-4 text-[1.0625rem] font-semibold text-ink-soft">Informativo, non diagnostico. Nessun esame viene prescritto automaticamente.</p>
            <ul className="pdp-hero-facts mt-7">
              <li>
                <Clock3 aria-hidden /> Circa 3–5 minuti
              </li>
              <li>
                <Lock aria-hidden /> Senza registrazione: le risposte restano sul tuo dispositivo
              </li>
              <li>
                <Ban aria-hidden /> Nessuna diagnosi, nessun punteggio
              </li>
            </ul>
          </div>
          {/* Fotografia di una paziente + anteprima della scheda in HTML (niente immagini con testo) */}
          <div className="pdp-hero-visual">
            {SHOW_ILLUSTRATIVE_PHOTOS ? (
              <figure className="pdp-hero-photo">
                <img src={photo.src} width={photo.width} height={photo.height} alt={photo.alt} decoding="async" style={{ objectPosition: "38% 0%" }} />
                <figcaption className="caption-illus right-4 top-4">Immagine illustrativa</figcaption>
              </figure>
            ) : null}
            <div aria-hidden className="pdp-hero-sheet">
              <p className="flex items-center justify-between gap-3">
                <span className="text-lg font-extrabold leading-tight text-ink">La mia scheda</span>
                <span className="pdp-chip pdp-chip-base">Esempio</span>
              </p>
              <ul className="mt-3.5 grid grid-cols-[minmax(0,1fr)] gap-2">
                {AREAS.filter((x) => HERO_AREAS.includes(x.id)).map((a) => (
                  <li key={a.id} className="pdp-hero-row">
                    <AreaIcon id={a.id} category={a.category} className="pdp-ico-sm" />
                    <span className="min-w-0 flex-1 truncate">{a.title}</span>
                    <CategoryChip category={a.category} />
                  </li>
                ))}
              </ul>
              <p className="mt-3.5 text-[0.9375rem] font-semibold text-muted">… altre 7 aree e le domande per il medico.</p>
            </div>
          </div>
        </div>
      </section>

      {/* LA GUIDA: subito sotto la hero (Fase 3). Le spiegazioni vengono dopo. */}
      <section id="guida" aria-labelledby="pdp-guida" className="pdp-guide-section scroll-mt-24 pb-12 pt-8 sm:pb-16 sm:pt-12">
        <div className="container-rc">
          <div className="no-print mb-7 max-w-3xl">
            <p className="eyebrow">Guida interattiva</p>
            <h2 id="pdp-guida" className="display-lg mt-3 text-[2rem] sm:text-[2.5rem]">
              Costruiamo il tuo Punto di Partenza.
            </h2>
          </div>
          <PuntoDiPartenzaGuide prices={prices} capisciHref={capisci.href} medicoHref={medico.href} />
        </div>
      </section>

      {/* TRE PASSAGGI */}
      <section aria-labelledby="pdp-passi" className="no-print py-12 sm:py-16">
        <div className="container-rc">
          <p className="eyebrow">Come funziona</p>
          <h2 id="pdp-passi" className="display-lg mt-3 text-[2rem] sm:text-[2.5rem]">
            Tre passaggi, una scheda.
          </h2>
          <ol className="pdp-passi mt-8">
            {PASSI.map(({ icon: Icon, title, text }, i) => (
              <Reveal as="li" key={title} delay={i * 90} className="pdp-passo">
                <span className="flex items-center justify-between gap-3">
                  <span aria-hidden className="pdp-ico pdp-ico-lg">
                    <Icon strokeWidth={1.8} />
                  </span>
                  <span aria-hidden className="pdp-passo-n">
                    {i + 1}
                  </span>
                </span>
                <span className="mt-5 block text-[1.375rem] font-extrabold leading-tight text-ink">{title}</span>
                <span className="mt-2 block text-lg text-ink-soft">{text}</span>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      {/* LE 10 AREE, IN ANTEPRIMA */}
      <section aria-labelledby="pdp-aree" className="no-print pdp-areas-wrap pdp-areas-below">
        <div className="container-rc">
          <Reveal className="pdp-areas-panel">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                <p className="eyebrow">Le 10 aree del percorso</p>
                <h2 id="pdp-aree" className="display-lg mt-3 text-[2rem] sm:text-[2.5rem]">
                  Dieci aree, una sola scheda.
                </h2>
                <p className="mt-3 text-lg text-ink-soft sm:text-xl">Per ognuna: perché conta, di che cosa parlare con il medico e se hai già informazioni recenti.</p>
              </div>
              <p className="flex flex-wrap items-center gap-2 text-[1.0625rem] text-ink-soft">
                <CategoryChip category="base" /> <CategoryChip category="contextual" />
                <span className="w-full sm:w-auto">L&apos;etichetta descrive il tema, non te.</span>
              </p>
            </div>
            <details className="pdp-details pdp-details-block mt-4">
              <summary>Vedi le 10 aree</summary>
              <ul className="pdp-tiles mt-4">
              {AREAS.map((a) => (
                <li key={a.id} className="pdp-tile">
                  <AreaIcon id={a.id} category={a.category} />
                  <span className="pdp-tile-title">{a.title}</span>
                  <CategoryChip category={a.category} />
                </li>
              ))}
            </ul>
            </details>
          </Reveal>
        </div>
      </section>

      {/* LE TRE NATURE + IL BOX CHE CI DISTINGUE */}
      <section aria-labelledby="pdp-nature" className="no-print bg-mist py-12 sm:py-16">
        <div className="container-rc grid gap-8 lg:grid-cols-[1fr_1fr] lg:gap-10">
          <div>
            <p className="eyebrow">Tre etichette</p>
            <h2 id="pdp-nature" className="display-lg mt-3 text-[2rem] sm:text-[2.5rem]">
              Ogni area ha un&apos;etichetta. Descrive il tema, non te.
            </h2>
            <ul className="mt-7 grid gap-3">
              {CATS.map((c) => {
                const Icon = CAT_ICON[c];
                return (
                  <li key={c} className="pdp-nature">
                    <span aria-hidden className={`pdp-ico pdp-cat-${c}`}>
                      <Icon strokeWidth={1.8} />
                    </span>
                    <div className="min-w-0">
                      <p>
                        <CategoryChip category={c} />
                      </p>
                      <p className="mt-1.5 text-lg leading-snug text-ink-soft">{CATEGORY_HINT[c]}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
          <aside aria-labelledby="pdp-non-routine" className="pdp-panel pdp-panel-not lg:self-start">
            <p>
              <CategoryChip category="not-routine" />
            </p>
            <h2 id="pdp-non-routine" className="mt-3 text-[1.75rem] font-extrabold leading-tight text-ink">
              Più esami non significa più prevenzione.
            </h2>
            <p className="mt-3 text-lg text-ink-soft">Esempi di controlli che non vanno proposti in modo automatico a chi non ha disturbi:</p>
            <details className="pdp-details pdp-details-block mt-2">
              <summary>Vedi gli esempi e la fonte</summary>
            <ul className="pdp-not-list mt-3">
              {NOT_ROUTINE.map((x) => (
                <li key={x.id} className="text-lg leading-snug text-ink">
                  <strong>{x.title}.</strong> <span className="text-ink-soft">{x.why}</span>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-[0.9375rem] text-muted">
              Fonte:{" "}
              <a href={NOT_ROUTINE_SOURCE.sourceUrl} className="link" target="_blank" rel="noopener noreferrer">
                {NOT_ROUTINE_SOURCE.sourceLabel}
              </a>
            </p>
            </details>
          </aside>
        </div>
      </section>

      <section aria-label="Il passo dopo" className="no-print border-t border-line/70 bg-paper py-12">
        <div className="container-rc">
          <p className="max-w-3xl font-serif text-2xl font-semibold leading-snug text-ink">
            Prima capisci da dove parti. Poi, quando arrivano i risultati, Cura Privata ti aiuta a leggerli e a scegliere il passo successivo.
          </p>
        </div>
      </section>
    </>
  );
}
