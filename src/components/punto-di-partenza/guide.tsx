"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { clsx } from "clsx";
import {
  Apple,
  ArrowLeft,
  ArrowRight,
  Bean,
  CalendarCheck,
  Check,
  CircleCheck,
  Download,
  Droplet,
  Droplets,
  FileText,
  Filter,
  FolderSearch,
  Gauge,
  Gem,
  HeartPulse,
  Info,
  Layers,
  Leaf,
  MessageCircleQuestion,
  Printer,
  ShieldCheck,
  Stethoscope,
  Target,
  TestTube,
  type LucideIcon,
} from "lucide-react";
import {
  AREAS,
  CATEGORY_LABEL,
  COMPLETENESS_NOTE,
  CONTEXT_QUESTIONS,
  GOALS,
  HAVE,
  PDP_DISCLAIMER,
  type AreaCategory,
  type AreaId,
  type ContextAnswers,
  type GoalId,
} from "@/content/punto-di-partenza";
import { EMPTY_ANSWERS, buildMap, completeness, isDocumented, toggleHave, type PdpAnswers } from "@/domain/punto-di-partenza";
import { track } from "@/components/site/track";

/**
 * «Punto di Partenza»: quattro domande brevi → la scheda da portare al medico. Tutto resta nel browser, in memoria:
 * niente account, niente server, niente URL con risposte, niente storage. Al server arrivano solo i nomi
 * dei passi (pdp-start, pdp-complete…) per i contatori anonimi aggregati.
 */

export interface PdpPrices {
  /** null se i prezzi pubblici sono spenti. */
  capisci: { lead: string | null; amount: string } | null;
  medico: string | null;
}

const STEPS = ["Obiettivo", "Cosa hai già", "Contesto", "Le 10 aree", "La tua scheda"] as const;

/** Un'icona per area: solo un segno per riconoscerla, mai un indicatore. */
const AREA_ICON: Record<AreaId, LucideIcon> = {
  pressione: HeartPulse,
  glicemia: Apple,
  lipidi: Droplets,
  ematologia: Droplet,
  rene: Bean,
  fegato: Filter,
  ferro: Gem,
  tiroide: Gauge,
  urine: TestTube,
  screening: ShieldCheck,
};
const GOAL_ICON: Record<GoalId, LucideIcon> = {
  benessere: Leaf,
  organizzare: CalendarCheck,
  documentazione: FolderSearch,
  medico: Stethoscope,
};

export function AreaIcon({ id, category, className }: { id: AreaId; category: AreaCategory; className?: string }) {
  const Icon = AREA_ICON[id];
  return (
    <span aria-hidden className={clsx("pdp-ico", `pdp-cat-${category}`, className)}>
      <Icon strokeWidth={1.8} />
    </span>
  );
}

/** Il foglio della scheda, disegnato in CSS (decorativo). */
export function SheetArt({ className }: { className?: string }) {
  return (
    <span aria-hidden className={clsx("pdp-art", className)}>
      <span className="pdp-art-sheet">
        <i />
        <i />
        <i />
      </span>
      <span className="pdp-art-badge">
        <Check strokeWidth={3} />
      </span>
    </span>
  );
}

export function CategoryChip({ category, className }: { category: AreaCategory; className?: string }) {
  return <span className={clsx("pdp-chip", `pdp-chip-${category}`, className)}>{CATEGORY_LABEL[category]}</span>;
}

export function PuntoDiPartenzaGuide({ prices, capisciHref, medicoHref }: { prices: PdpPrices; capisciHref: string; medicoHref: string }) {
  const [a, setA] = useState<PdpAnswers>(EMPTY_ANSWERS);
  const [step, setStep] = useState(1);
  const [started, setStarted] = useState(false);
  const [busy, setBusy] = useState(false);
  const headRef = useRef<HTMLHeadingElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);
  const map = useMemo(() => buildMap(a), [a]);
  const comp = completeness(a);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    // Il fuoco va al titolo del passo, ma la pagina si ferma sull'avanzamento: così si vede sempre a che punto si è.
    headRef.current?.focus({ preventScroll: true });
    topRef.current?.scrollIntoView({
      block: "start",
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    });
  }, [step]);

  function update(next: Partial<PdpAnswers>) {
    if (!started) {
      setStarted(true);
      track("pdp-start");
    }
    setA((prev) => ({ ...prev, ...next }));
  }
  function go(n: number) {
    if (n === 2 && step === 1) track("pdp-step-2");
    if (n === 5) track("pdp-complete");
    setStep(n);
  }
  const setCtx = (key: keyof ContextAnswers, v: string) => update({ context: { ...a.context, [key]: v } as ContextAnswers });

  async function downloadPdf() {
    setBusy(true);
    track("pdp-download");
    try {
      const { renderPdpPdf } = await import("@/domain/punto-di-partenza-pdf");
      const fonts = await Promise.all(["/fonts/pdf/manrope-400.ttf", "/fonts/pdf/manrope-700.ttf"].map((u) => fetch(u).then((r) => (r.ok ? r.arrayBuffer() : Promise.reject()))))
        .then(([r, b]) => ({
          regular: new Uint8Array(r),
          bold: new Uint8Array(b),
        }))
        .catch(() => null);
      const bytes = await renderPdpPdf(map, { fonts, notes: a.notes });
      const url = URL.createObjectURL(new Blob([bytes as BlobPart], { type: "application/pdf" }));
      const link = document.createElement("a");
      link.href = url;
      link.download = "punto-di-partenza-cura-privata.pdf";
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 10_000);
    } finally {
      setBusy(false);
    }
  }
  function print() {
    track("pdp-download");
    window.print();
  }

  const hasResults = a.have.some((h) => h === "sangue" || h === "urine");
  const documentedCount = map.documented.length;
  const discussCount = map.toDiscussBase.length + map.toDiscussContextual.length;
  const capisciCta = prices.capisci ? `${prices.capisci.lead ? "Rendi chiaro il primo referto" : "Rendi chiaro il tuo referto"} — ${prices.capisci.amount}` : "Rendi chiaro il tuo referto";

  return (
    <div className="pdp-guide">
      {/* Avanzamento: lista ordinata vera, con il passo corrente annunciato */}
      <div ref={topRef} className="pdp-top no-print">
        <p className="sr-only" aria-live="polite">
          Passo {step} di {STEPS.length}: {STEPS[step - 1]}
        </p>
        <ol className="pdp-stepper" aria-label="Avanzamento">
          {STEPS.map((s, i) => {
            const n = i + 1;
            const state = n < step ? "done" : n === step ? "current" : "todo";
            return (
              <li key={s} className={clsx("pdp-step", `pdp-step-${state}`)} aria-current={state === "current" ? "step" : undefined}>
                <span aria-hidden className="pdp-step-dot">
                  {state === "done" ? <Check className="h-4 w-4" /> : n}
                </span>
                <span className="pdp-step-label">
                  <span aria-hidden className="pdp-step-count">
                    Passo {n} di {STEPS.length} ·{" "}
                  </span>
                  <span className="sr-only">{state === "done" ? "Completato: " : state === "todo" ? "Da fare: " : "In corso: "}</span>
                  {s}
                </span>
              </li>
            );
          })}
        </ol>
      </div>

      <div className={clsx("mt-8 grid gap-8", step < 5 && "lg:grid-cols-[minmax(0,1fr)_21.5rem]")}>
        <div className="min-w-0">
          {step === 1 ? (
            <fieldset>
              <legend className="contents">
                <h2 ref={headRef} tabIndex={-1} className="pdp-q">
                  Perché vuoi fare il punto?
                </h2>
              </legend>
              <p className="mt-2 text-lg text-muted">Una sola scelta: serve a dare un ordine alla scheda.</p>
              <div className="mt-5 grid gap-3">
                {GOALS.map((g) => {
                  const Icon = GOAL_ICON[g.id];
                  return (
                    <label key={g.id} className={clsx("pdp-option pdp-option-goal", a.goal === g.id && "is-on")}>
                      <span aria-hidden className="pdp-ico">
                        <Icon strokeWidth={1.8} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-lg font-bold text-ink">{g.label}</span>
                        <span className="block text-[1.0625rem] text-muted">{g.hint}</span>
                      </span>
                      <input type="radio" name="pdp-goal" checked={a.goal === g.id} onChange={() => update({ goal: g.id })} />
                    </label>
                  );
                })}
              </div>
              <Nav next={() => go(2)} disabled={!a.goal} />
            </fieldset>
          ) : null}

          {step === 2 ? (
            <fieldset>
              <legend className="contents">
                <h2 ref={headRef} tabIndex={-1} className="pdp-q">
                  Che cosa hai già?
                </h2>
              </legend>
              <p className="mt-2 text-lg text-muted">Spunta quello che hai, anche se non ricordi i valori. Nessun numero, nessun dettaglio.</p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {HAVE.map((h) => (
                  <label key={h.id} className={clsx("pdp-option", a.have.includes(h.id) && "is-on")}>
                    <input type="checkbox" checked={a.have.includes(h.id)} onChange={() => update({ have: toggleHave(a.have, h.id) })} />
                    <span className="text-lg font-semibold text-ink">{h.label}</span>
                  </label>
                ))}
              </div>
              <Nav back={() => go(1)} next={() => go(3)} />
            </fieldset>
          ) : null}

          {step === 3 ? (
            <div>
              <h2 ref={headRef} tabIndex={-1} className="pdp-q">
                Un po&apos; di contesto
              </h2>
              <p className="mt-2 text-lg text-muted">Cinque domande veloci. Puoi sempre scegliere di non rispondere.</p>
              <div className="mt-6 grid gap-4">
                {CONTEXT_QUESTIONS.map((q) => (
                  <fieldset key={q.key} className="pdp-ctx">
                    <legend className="float-left w-full text-xl font-bold text-ink">{q.label}</legend>
                    <div className="clear-both flex flex-wrap gap-2.5 pt-3">
                      {q.options.map((o) => (
                        <label key={o.v} className={clsx("pdp-pill", a.context[q.key] === o.v && "is-on")}>
                          <input type="radio" name={`pdp-${q.key}`} checked={a.context[q.key] === o.v} onChange={() => setCtx(q.key, o.v)} />
                          {o.label}
                        </label>
                      ))}
                    </div>
                  </fieldset>
                ))}
              </div>
              <Nav back={() => go(2)} next={() => go(4)} />
            </div>
          ) : null}

          {step === 4 ? (
            <div>
              <h2 ref={headRef} tabIndex={-1} className="pdp-q">
                Le 10 aree da conoscere
              </h2>
              <p className="mt-2 max-w-2xl text-lg text-muted">Per ogni area, segna se hai già informazioni recenti. L&apos;etichetta dice di che tipo di tema si tratta, non come stai.</p>
              <ul className="mt-6 grid gap-4 md:grid-cols-2">
                {AREAS.map((ar) => {
                  const on = isDocumented(a, ar.id);
                  return (
                    <li key={ar.id} className={clsx("pdp-area", `pdp-area-${ar.category}`, on && "is-on")}>
                      <div className="flex items-start gap-3.5">
                        <AreaIcon id={ar.id} category={ar.category} />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <CategoryChip category={ar.category} />
                            <span className="pdp-area-n" aria-hidden>
                              {String(ar.n).padStart(2, "0")}
                            </span>
                          </div>
                          <h3 className="mt-1.5 text-xl font-bold leading-tight text-ink">{ar.title}</h3>
                        </div>
                      </div>
                      <p className="mt-3 text-[1.0625rem] text-ink-soft">{ar.short}</p>
                      <details className="pdp-details mt-2">
                        <summary>Perché conta e di che cosa parlare</summary>
                        <p className="mt-2">{ar.whyItMatters}</p>
                        <p className="mt-2">
                          <strong>Da discutere:</strong> {ar.whatToDiscuss}
                        </p>
                        <p className="mt-2">
                          <strong>Esempi di controlli comunemente utilizzati:</strong> {ar.examples.join("; ")}.
                        </p>
                        <p className="mt-2 text-[0.9375rem] text-muted">
                          Fonte:{" "}
                          <a href={ar.sourceUrl} className="link" target="_blank" rel="noopener noreferrer">
                            {ar.sourceLabel}
                          </a>
                        </p>
                      </details>
                      <button
                        type="button"
                        aria-pressed={on}
                        className={clsx("pdp-toggle", on && "is-on")}
                        onClick={() =>
                          update({
                            areaOverrides: { ...a.areaOverrides, [ar.id]: !on },
                          })
                        }
                      >
                        <span aria-hidden className="pdp-toggle-box">
                          {on ? <Check className="h-4 w-4" /> : null}
                        </span>
                        Ho già informazioni recenti
                      </button>
                    </li>
                  );
                })}
              </ul>
              <Nav back={() => go(3)} next={() => go(5)} nextLabel="Crea la mia scheda" />
            </div>
          ) : null}

          {step === 5 ? (
            <div className="pdp-result">
              <div className="flex items-start gap-4 sm:gap-5">
                <span className="hidden sm:block">
                  <span aria-hidden className="pdp-ico pdp-ico-lg">
                    <CircleCheck strokeWidth={1.8} />
                  </span>
                </span>
                <div className="min-w-0">
                  <p className="eyebrow">Gratis · Punto di Partenza</p>
                  <h2 ref={headRef} tabIndex={-1} className="display-lg mt-3 text-[2.125rem] outline-none sm:text-[3rem]">
                    Il tuo Punto di Partenza è pronto.
                  </h2>
                  <p className="mt-3 max-w-2xl text-xl text-ink-soft">
                    Ecco la mappa che hai costruito: che cosa hai già, di che cosa parlare con il medico e che cosa non serve chiedere in automatico.
                  </p>
                </div>
              </div>

              <div className="pdp-summary mt-8">
                <Ring pct={map.completeness} />
                <dl className="pdp-summary-facts">
                  <div>
                    <dt>Aree già documentate</dt>
                    <dd>
                      <span className="stat-num text-[1.75rem] text-ink">{documentedCount}</span> <span className="text-muted">su 10</span>
                      <span aria-hidden className="pdp-pips">
                        {AREAS.map((x, i) => (
                          <i key={x.id} className={i < documentedCount ? "is-on" : undefined} />
                        ))}
                      </span>
                    </dd>
                  </div>
                  {map.goalLabel ? (
                    <div>
                      <dt>Il tuo obiettivo</dt>
                      <dd className="flex items-start gap-2 text-lg font-bold leading-snug text-ink">
                        <Target aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-teal" /> {map.goalLabel}
                      </dd>
                    </div>
                  ) : null}
                </dl>
              </div>

              <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)_minmax(0,1fr)]">
                <ResultCol
                  title="Già documentato"
                  desc="Aree su cui hai già informazioni recenti."
                  tone="done"
                  icon={CircleCheck}
                  count={documentedCount}
                  unit={["area", "aree"]}
                  empty="Nessuna area segnata: va benissimo, si parte da qui."
                >
                  {map.documented.map((x) => (
                    <li key={x.area.id}>{x.area.title}</li>
                  ))}
                </ResultCol>
                <ResultCol title="Da discutere con il medico" desc="Temi da portare alla prossima visita, in ordine." tone="discuss" icon={Stethoscope} count={discussCount} unit={["area", "aree"]}>
                  {map.toDiscussBase.map((x) => (
                    <li key={x.area.id}>
                      <span className="pdp-col-row">
                        {x.area.title} <CategoryChip category="base" />
                      </span>
                      {x.notes.map((n) => (
                        <span key={n} className="mt-1 block text-[0.9375rem] font-normal text-muted">
                          {n}
                        </span>
                      ))}
                    </li>
                  ))}
                  {map.toDiscussContextual.map((x) => (
                    <li key={x.area.id}>
                      <span className="pdp-col-row">
                        {x.area.title} <CategoryChip category="contextual" />
                      </span>
                      <span className="mt-1 block text-[0.9375rem] font-normal text-muted">Se pertinente nel tuo caso.</span>
                    </li>
                  ))}
                </ResultCol>
                <ResultCol title="Non di routine" desc="Controlli che non vanno chiesti in automatico." tone="not" icon={Layers} count={map.notRoutine.length} unit={["tema", "temi"]}>
                  {map.notRoutine.map((x) => (
                    <li key={x.id}>
                      {x.title}
                      <span className="mt-1 block text-[0.9375rem] font-normal text-muted">{x.why}</span>
                    </li>
                  ))}
                </ResultCol>
              </div>
              {map.generalNotes.map((n) => (
                <p key={n} className="pdp-note mt-5 text-lg text-ink">
                  <Info aria-hidden className="mt-1 h-5 w-5 shrink-0 text-teal" /> <span>{n}</span>
                </p>
              ))}

              <div className="mt-5 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
                <section aria-labelledby="pdp-scheda" className="pdp-panel pdp-panel-scheda">
                  <div className="flex items-start gap-5">
                    <span className="no-print hidden shrink-0 sm:block">
                      <SheetArt />
                    </span>
                    <div className="min-w-0">
                      <h3 id="pdp-scheda" className="flex items-center gap-3 text-2xl font-bold leading-tight text-ink">
                        <FileText aria-hidden className="h-7 w-7 shrink-0 text-teal sm:hidden" /> La scheda da portare al medico
                      </h3>
                      <p className="mt-2 text-lg text-ink-soft">Obiettivo, informazioni che hai, aree da discutere e domande pronte, su un foglio A4.</p>
                    </div>
                  </div>
                  <label htmlFor="pdp-note" className="mt-5 block text-lg font-bold text-ink">
                    Note per te <span className="font-normal text-muted">(facoltative, restano su questo dispositivo)</span>
                  </label>
                  <textarea id="pdp-note" rows={3} maxLength={600} value={a.notes} onChange={(e) => setA((p) => ({ ...p, notes: e.target.value }))} className="pdp-notes mt-2" />
                  <div className="no-print mt-5 flex flex-col gap-3 sm:flex-row">
                    <button type="button" className="btn btn-primary btn-lg sm:flex-1" onClick={downloadPdf} disabled={busy} aria-busy={busy}>
                      <Download aria-hidden className="h-5 w-5" /> {busy ? "Preparo il PDF…" : "Scarica la scheda (PDF)"}
                    </button>
                    <button type="button" className="btn btn-secondary btn-lg" onClick={print}>
                      <Printer aria-hidden className="h-5 w-5" /> Stampa
                    </button>
                  </div>
                </section>
                <section aria-labelledby="pdp-domande" className="pdp-panel">
                  <h3 id="pdp-domande" className="flex items-center gap-3 text-2xl font-bold leading-tight text-ink">
                    <MessageCircleQuestion aria-hidden className="h-7 w-7 shrink-0 text-teal" /> Domande per il medico
                  </h3>
                  <p className="mt-2 text-lg text-ink-soft">Già scritte sulla scheda: puoi leggerle così come sono.</p>
                  <ol className="pdp-questions mt-4">
                    {map.questions.map((q, i) => (
                      <li key={q} className="flex gap-3 text-lg leading-snug text-ink">
                        <span aria-hidden className="pdp-qnum">
                          {i + 1}
                        </span>
                        {q}
                      </li>
                    ))}
                  </ol>
                </section>
              </div>

              {/* Ponte verso Cura Privata: una CTA grande, una secondaria */}
              <section aria-labelledby="pdp-ponte" className="no-print pdp-bridge mt-5">
                <div className="min-w-0">
                  <h3 id="pdp-ponte" className="display-lg text-[2rem] sm:text-[2.5rem]">
                    {hasResults ? "Hai già i risultati?" : "Quando arriveranno i risultati"}
                  </h3>
                  <p className="mt-3 max-w-xl text-xl text-ink-soft">
                    {hasResults
                      ? "Carica il referto: diventa un report chiaro e ordinato, con le domande giuste per il medico."
                      : "Salva questa scheda e torna con il referto: lo rendiamo chiaro e lo mettiamo accanto alla tua mappa."}
                  </p>
                  <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                    <Link href={capisciHref} data-track="pdp-to-referto" className="btn btn-primary btn-lg pdp-cta">
                      {capisciCta} <ArrowRight aria-hidden className="btn-arrow h-5 w-5" />
                    </Link>
                    {!hasResults ? (
                      <button type="button" className="btn btn-secondary btn-lg" onClick={downloadPdf} disabled={busy}>
                        <Download aria-hidden className="h-5 w-5" /> Salva la scheda
                      </button>
                    ) : null}
                  </div>
                </div>
                <div className="pdp-bridge-side tone-medico">
                  <p className="flex items-center gap-2 text-lg font-bold text-ink">
                    <Stethoscope aria-hidden className="tone-text h-6 w-6" /> Preferisci parlarne direttamente?
                  </p>
                  <p className="mt-2 text-[1.0625rem] text-ink-soft">Un videoconsulto con un medico di medicina generale o internista, con la tua scheda già letta.</p>
                  <Link href={medicoHref} data-track="pdp-to-medico" className="tone-text mt-4 inline-flex min-h-11 items-center gap-2 text-lg font-bold">
                    Parla con un medico
                    {prices.medico ? ` — ${prices.medico}` : ""} <ArrowRight aria-hidden className="h-5 w-5" />
                  </Link>
                </div>
              </section>

              <p className="pdp-note mt-5 text-[1.0625rem] text-ink-soft">
                <Info aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-teal" /> <span>{PDP_DISCLAIMER}</span>
              </p>
              <div className="no-print mt-6 flex flex-wrap gap-3">
                <button type="button" className="btn btn-ghost" onClick={() => go(4)}>
                  <ArrowLeft aria-hidden className="h-5 w-5" /> Torna alle aree
                </button>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => {
                    setA(EMPTY_ANSWERS);
                    setStarted(false);
                    go(1);
                  }}
                >
                  Ricomincia
                </button>
              </div>
            </div>
          ) : null}
        </div>

        {step < 5 ? (
          <aside aria-label="La tua mappa in breve" className="no-print pdp-aside">
            <p className="text-xl font-bold text-ink">La tua mappa in breve</p>
            <Ring pct={comp.pct} compact />
            <dl className="pdp-aside-stats">
              <div>
                <dt>
                  <span aria-hidden className="pdp-ico pdp-ico-sm">
                    <Check strokeWidth={2.4} />
                  </span>
                  <span>Aree già documentate</span>
                </dt>
                <dd className="stat-num">{documentedCount}/10</dd>
              </div>
              <div>
                <dt>
                  <span aria-hidden className="pdp-ico pdp-ico-sm pdp-cat-contextual">
                    <Stethoscope strokeWidth={2} />
                  </span>
                  <span>Da discutere con il medico</span>
                </dt>
                <dd className="stat-num">{discussCount}/10</dd>
              </div>
              <div>
                <dt>
                  <span aria-hidden className="pdp-ico pdp-ico-sm">
                    <Target strokeWidth={2} />
                  </span>
                  <span>Obiettivo</span>
                </dt>
                <dd className="pdp-aside-goal">{map.goalLabel ?? "Da scegliere"}</dd>
              </div>
            </dl>
            <p className="mt-5 flex items-start gap-2 text-[0.9375rem] text-muted">
              <Info aria-hidden className="mt-0.5 h-4 w-4 shrink-0" />
              La guida non prescrive esami: ti aiuta a raccogliere e ordinare le informazioni per il medico.
            </p>
          </aside>
        ) : null}
      </div>
    </div>
  );
}

function Nav({ back, next, disabled, nextLabel = "Avanti" }: { back?: () => void; next: () => void; disabled?: boolean; nextLabel?: string }) {
  return (
    <div className="pdp-nav no-print mt-8 flex gap-3">
      {back ? (
        <button type="button" className="btn btn-secondary btn-lg pdp-nav-back" onClick={back}>
          <ArrowLeft aria-hidden className="h-5 w-5" /> Indietro
        </button>
      ) : null}
      <button type="button" className="btn btn-primary btn-lg pdp-nav-next" onClick={next} disabled={disabled}>
        {nextLabel} <ArrowRight aria-hidden className="btn-arrow h-5 w-5" />
      </button>
    </div>
  );
}

function Ring({ pct, compact }: { pct: number; compact?: boolean }) {
  const r = 52;
  const c = 2 * Math.PI * r;
  return (
    <div className={clsx("pdp-ring", compact && "pdp-ring-compact")}>
      <div className="relative shrink-0">
        <svg viewBox="0 0 120 120" className="pdp-ring-svg" aria-hidden>
          <circle cx="60" cy="60" r={r} className="pdp-ring-track" />
          {pct > 0 ? <circle cx="60" cy="60" r={r} className="pdp-ring-value" strokeDasharray={c} strokeDashoffset={c * (1 - pct / 100)} transform="rotate(-90 60 60)" /> : null}
        </svg>
        <span aria-hidden className="pdp-ring-num stat-num">
          {pct}%
        </span>
      </div>
      <div className="min-w-0">
        <p className="pdp-ring-title">Completezza delle informazioni: {pct}%</p>
        <p className="pdp-ring-note">{COMPLETENESS_NOTE}</p>
      </div>
    </div>
  );
}

function ResultCol({
  title,
  desc,
  tone,
  icon: Icon,
  count,
  unit,
  empty,
  children,
}: {
  title: string;
  desc: string;
  tone: "done" | "discuss" | "not";
  icon: LucideIcon;
  count: number;
  unit: [string, string];
  empty?: string;
  children: React.ReactNode;
}) {
  return (
    <section aria-label={title} className={clsx("pdp-col", `pdp-col-${tone}`)}>
      <div className="flex items-start gap-3.5">
        <span aria-hidden className="pdp-ico">
          <Icon strokeWidth={1.8} />
        </span>
        <div className="min-w-0">
          <h3 className="text-[1.375rem] font-extrabold leading-tight text-ink">{title}</h3>
          <p className="mt-1 text-[1.0625rem] leading-snug text-ink-soft">{desc}</p>
        </div>
      </div>
      {count ? <ul className="pdp-col-list mt-4">{children}</ul> : <p className="mt-4 text-[1.0625rem] text-muted">{empty}</p>}
      <p className="pdp-col-count">
        {count} {count === 1 ? unit[0] : unit[1]}
      </p>
    </section>
  );
}
