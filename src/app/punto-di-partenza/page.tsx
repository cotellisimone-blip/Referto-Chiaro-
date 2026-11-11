import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArrowDown, Ban, Check, ClipboardList, Clock3, Lock, ShieldCheck } from "lucide-react";
import { PuntoDiPartenzaGuide, CategoryChip, type PdpPrices } from "@/components/punto-di-partenza/guide";
import { AREAS, CATEGORY_HINT, CATEGORY_LABEL, NOT_ROUTINE, NOT_ROUTINE_SOURCE, type AreaCategory } from "@/content/punto-di-partenza";
import { coreService, priceDisplay, publicPricesEnabled } from "@/domain/offerta";
import { puntoDiPartenzaEnabled } from "@/lib/feature-flags";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Punto di Partenza — Conosci meglio la tua salute. Gratis.",
  description:
    "Strumento gratuito: un percorso guidato in 10 aree per raccogliere ciò che sai già, capire cosa discutere con il medico e prepararti ai prossimi controlli. Informativo, non diagnostico.",
  alternates: { canonical: absoluteUrl("/punto-di-partenza") },
};

const PASSI = [
  { icon: ClipboardList, title: "Rispondi a poche domande", text: "Obiettivo, che cosa hai già, un po' di contesto. Circa 3–5 minuti." },
  { icon: Check, title: "Guarda le 10 aree", text: "Per ognuna: perché conta, di che cosa parlare, se hai già informazioni." },
  { icon: ShieldCheck, title: "Porta la scheda al medico", text: "Un foglio A4 con aree da discutere e domande pronte. Da scaricare o stampare." },
];

const CATS: AreaCategory[] = ["base", "contextual", "not-routine"];

export default function PuntoDiPartenzaPage() {
  if (!puntoDiPartenzaEnabled()) notFound();
  const showPrices = publicPricesEnabled();
  const capisci = coreService("capisci");
  const medico = coreService("parla-con-un-medico");
  const cp = priceDisplay("capisci");
  const prices: PdpPrices = { capisci: showPrices ? { lead: cp.lead, amount: cp.amount } : null, medico: showPrices ? priceDisplay("parla-con-un-medico").amount : null };

  return (
    <>
      {/* HERO */}
      <section aria-labelledby="pdp-titolo" className="no-print tone-partenza relative overflow-hidden bg-[linear-gradient(180deg,var(--tone-bg),var(--color-canvas))]">
        <div className="container-rc grid items-center gap-10 pb-12 pt-10 sm:pt-16 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <p className="eyebrow">Gratis · Punto di Partenza</p>
            <h1 id="pdp-titolo" className="display-xl mt-5">
              Conosci meglio la tua salute. <span className="marker">Gratis.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-xl text-ink-soft sm:text-[1.375rem] sm:leading-snug">
              Un percorso guidato in 10 aree per raccogliere ciò che sai già, capire cosa discutere con il medico e prepararti ai prossimi controlli.
            </p>
            <a href="#guida" className="btn btn-primary btn-lg mt-8">
              Crea il mio Punto di Partenza — Gratis <ArrowDown aria-hidden className="h-5 w-5" />
            </a>
            <p className="mt-4 text-[1.0625rem] font-semibold text-ink-soft">Informativo, non diagnostico. Nessun esame viene prescritto automaticamente.</p>
            <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[1.0625rem] text-ink-soft">
              <li className="flex items-center gap-2">
                <Clock3 aria-hidden className="h-5 w-5 text-teal" /> Circa 3–5 minuti
              </li>
              <li className="flex items-center gap-2">
                <Lock aria-hidden className="h-5 w-5 text-teal" /> Senza registrazione: le risposte restano sul tuo dispositivo
              </li>
              <li className="flex items-center gap-2">
                <Ban aria-hidden className="h-5 w-5 text-teal" /> Nessuna diagnosi, nessun punteggio
              </li>
            </ul>
          </div>
          {/* Anteprima della scheda, in HTML (niente immagini con testo) */}
          <div aria-hidden className="pdp-hero-sheet mx-auto w-full max-w-[360px]">
            <p className="text-sm font-bold uppercase tracking-wide text-teal">La mia scheda di partenza</p>
            <ul className="mt-4 space-y-2.5">
              {AREAS.slice(0, 5).map((a) => (
                <li key={a.id} className="flex items-center justify-between gap-2 rounded-xl bg-mist px-3 py-2.5 text-[0.9375rem] font-semibold text-ink">
                  {a.title}
                  <CategoryChip category={a.category} />
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-muted">… e altre 5 aree, con le domande per il medico.</p>
          </div>
        </div>
      </section>

      {/* TRE PASSAGGI */}
      <section aria-labelledby="pdp-passi" className="no-print py-12 sm:py-16">
        <div className="container-rc">
          <h2 id="pdp-passi" className="display-lg text-[2rem] sm:text-[2.5rem]">
            Tre passaggi, una scheda.
          </h2>
          <ol className="mt-8 grid gap-5 md:grid-cols-3">
            {PASSI.map(({ icon: Icon, title, text }, i) => (
              <li key={title} className="pdp-panel">
                <span className="flex items-center gap-3">
                  <span aria-hidden className="pdp-qnum">
                    {i + 1}
                  </span>
                  <Icon aria-hidden className="h-6 w-6 text-teal" />
                </span>
                <span className="mt-4 block text-xl font-bold text-ink">{title}</span>
                <span className="mt-2 block text-lg text-ink-soft">{text}</span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* LE TRE NATURE + IL BOX CHE CI DISTINGUE */}
      <section aria-labelledby="pdp-nature" className="no-print bg-mist py-12 sm:py-16">
        <div className="container-rc grid gap-10 lg:grid-cols-[1fr_1fr]">
          <div>
            <h2 id="pdp-nature" className="display-lg text-[2rem] sm:text-[2.5rem]">
              Ogni area ha un&apos;etichetta. Descrive il tema, non te.
            </h2>
            <dl className="mt-7 space-y-5">
              {CATS.map((c) => (
                <div key={c}>
                  <dt>
                    <CategoryChip category={c} />
                  </dt>
                  <dd className="mt-2 text-lg text-ink-soft">{CATEGORY_HINT[c]}</dd>
                </div>
              ))}
            </dl>
          </div>
          <aside aria-labelledby="pdp-non-routine" className="pdp-panel">
            <p className="eyebrow eyebrow-plain">{CATEGORY_LABEL["not-routine"]}</p>
            <h2 id="pdp-non-routine" className="mt-3 text-[1.75rem] font-extrabold leading-tight text-ink">
              Più esami non significa più prevenzione.
            </h2>
            <p className="mt-3 text-lg text-ink-soft">Esempi di controlli che non vanno proposti in modo automatico a chi non ha disturbi:</p>
            <ul className="mt-4 space-y-3">
              {NOT_ROUTINE.map((x) => (
                <li key={x.id} className="text-lg text-ink">
                  <strong>{x.title}.</strong> <span className="text-ink-soft">{x.why}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-[0.9375rem] text-muted">
              Fonte:{" "}
              <a href={NOT_ROUTINE_SOURCE.sourceUrl} className="link" target="_blank" rel="noopener noreferrer">
                {NOT_ROUTINE_SOURCE.sourceLabel}
              </a>
            </p>
          </aside>
        </div>
      </section>

      {/* LA GUIDA */}
      <section id="guida" aria-labelledby="pdp-guida" className="scroll-mt-24 py-12 sm:py-16">
        <div className="container-rc">
          <h2 id="pdp-guida" className="no-print sr-only">
            La guida Punto di Partenza
          </h2>
          <PuntoDiPartenzaGuide prices={prices} capisciHref={capisci.href} medicoHref={medico.href} />
        </div>
      </section>

      <section aria-label="Il passo dopo" className="no-print border-t border-line/70 bg-paper py-12">
        <div className="container-rc">
          <p className="max-w-3xl font-serif text-2xl leading-snug text-ink">
            Prima capisci da dove parti. Poi, quando arrivano i risultati, Cura Privata ti aiuta a leggerli e a scegliere il passo successivo.
          </p>
        </div>
      </section>
    </>
  );
}
