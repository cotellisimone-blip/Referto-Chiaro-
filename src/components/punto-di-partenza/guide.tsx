"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { clsx } from "clsx";
import { ArrowLeft, ArrowRight, Check, Download, FileText, Info, MessageCircleQuestion, Printer, Stethoscope } from "lucide-react";
import { AREAS, CATEGORY_LABEL, COMPLETENESS_NOTE, CONTEXT_QUESTIONS, GOALS, HAVE, PDP_DISCLAIMER, type AreaCategory, type ContextAnswers } from "@/content/punto-di-partenza";
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

export function CategoryChip({ category, className }: { category: AreaCategory; className?: string }) {
  return <span className={clsx("pdp-chip", `pdp-chip-${category}`, className)}>{CATEGORY_LABEL[category]}</span>;
}

export function PuntoDiPartenzaGuide({ prices, capisciHref, medicoHref }: { prices: PdpPrices; capisciHref: string; medicoHref: string }) {
  const [a, setA] = useState<PdpAnswers>(EMPTY_ANSWERS);
  const [step, setStep] = useState(1);
  const [started, setStarted] = useState(false);
  const [busy, setBusy] = useState(false);
  const headRef = useRef<HTMLHeadingElement>(null);
  const firstRender = useRef(true);
  const map = useMemo(() => buildMap(a), [a]);
  const comp = completeness(a);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    headRef.current?.focus();
    headRef.current?.scrollIntoView({ block: "start", behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
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
        .then(([r, b]) => ({ regular: new Uint8Array(r), bold: new Uint8Array(b) }))
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
  const capisciCta = prices.capisci ? `${prices.capisci.lead ? "Rendi chiaro il primo referto" : "Rendi chiaro il tuo referto"} — ${prices.capisci.amount}` : "Rendi chiaro il tuo referto";

  return (
    <div className="pdp-guide">
      {/* Avanzamento: lista ordinata vera, con il passo corrente annunciato */}
      <div className="no-print">
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
                  <span className="sr-only">{state === "done" ? "Completato: " : state === "todo" ? "Da fare: " : "In corso: "}</span>
                  {s}
                </span>
              </li>
            );
          })}
        </ol>
      </div>

      <div className={clsx("mt-8 grid gap-8", step < 5 && "lg:grid-cols-[minmax(0,1fr)_20rem]")}>
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
                {GOALS.map((g) => (
                  <label key={g.id} className={clsx("pdp-option", a.goal === g.id && "is-on")}>
                    <input type="radio" name="pdp-goal" checked={a.goal === g.id} onChange={() => update({ goal: g.id })} />
                    <span>
                      <span className="block text-lg font-bold text-ink">{g.label}</span>
                      <span className="block text-[1.0625rem] text-muted">{g.hint}</span>
                    </span>
                  </label>
                ))}
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
              <div className="mt-6 space-y-7">
                {CONTEXT_QUESTIONS.map((q) => (
                  <fieldset key={q.key}>
                    <legend className="text-xl font-bold text-ink">{q.label}</legend>
                    <div className="mt-3 flex flex-wrap gap-2.5">
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
              <p className="mt-2 max-w-2xl text-lg text-muted">
                Per ogni area, segna se hai già informazioni recenti. L&apos;etichetta dice di che tipo di tema si tratta, non come stai.
              </p>
              <ul className="mt-6 grid gap-4 md:grid-cols-2">
                {AREAS.map((ar) => {
                  const on = isDocumented(a, ar.id);
                  return (
                    <li key={ar.id} className={clsx("pdp-area", `pdp-area-${ar.category}`, on && "is-on")}>
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-xl font-bold leading-tight text-ink">
                          <span className="pdp-area-n" aria-hidden>
                            {String(ar.n).padStart(2, "0")}
                          </span>
                          {ar.title}
                        </h3>
                        <CategoryChip category={ar.category} />
                      </div>
                      <p className="mt-2 text-[1.0625rem] text-ink-soft">{ar.short}</p>
                      <details className="pdp-details mt-3">
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
                        className={clsx("pdp-toggle mt-4", on && "is-on")}
                        onClick={() => update({ areaOverrides: { ...a.areaOverrides, [ar.id]: !on } })}
                      >
                        <span aria-hidden className="pdp-toggle-box">{on ? <Check className="h-4 w-4" /> : null}</span>
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
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="eyebrow">Gratis · Punto di Partenza</p>
                  <h2 ref={headRef} tabIndex={-1} className="display-lg mt-3 text-[2.25rem] outline-none sm:text-[3rem]">
                    Il tuo Punto di Partenza è pronto.
                  </h2>
                  {map.goalLabel ? <p className="mt-3 text-xl text-ink-soft">Obiettivo: {map.goalLabel}</p> : null}
                </div>
              </div>

              <div className="mt-8 grid gap-5 lg:grid-cols-[18rem_repeat(3,minmax(0,1fr))]">
                <Ring pct={map.completeness} />
                <ResultCol title="Già documentato" tone="done" count={map.documented.length} empty="Nessuna area segnata: va benissimo, si parte da qui.">
                  {map.documented.map((x) => (
                    <li key={x.area.id}>{x.area.title}</li>
                  ))}
                </ResultCol>
                <ResultCol title="Da discutere con il medico" tone="discuss" count={map.toDiscussBase.length + map.toDiscussContextual.length}>
                  {map.toDiscussBase.map((x) => (
                    <li key={x.area.id}>
                      {x.area.title} <CategoryChip category="base" className="ml-1" />
                      {x.notes.map((n) => (
                        <span key={n} className="mt-1 block text-[0.9375rem] font-normal text-muted">
                          {n}
                        </span>
                      ))}
                    </li>
                  ))}
                  {map.toDiscussContextual.map((x) => (
                    <li key={x.area.id}>
                      {x.area.title} <CategoryChip category="contextual" className="ml-1" />
                      <span className="mt-1 block text-[0.9375rem] font-normal text-muted">Se pertinente nel tuo caso.</span>
                    </li>
                  ))}
                </ResultCol>
                <ResultCol title="Non di routine" tone="not" count={map.notRoutine.length}>
                  {map.notRoutine.map((x) => (
                    <li key={x.id}>
                      {x.title}
                      <span className="mt-1 block text-[0.9375rem] font-normal text-muted">{x.why}</span>
                    </li>
                  ))}
                </ResultCol>
              </div>
              {map.generalNotes.map((n) => (
                <p key={n} className="mt-5 flex items-start gap-3 rounded-2xl border border-line bg-paper p-4 text-lg text-ink">
                  <Info aria-hidden className="mt-1 h-5 w-5 shrink-0 text-teal" /> {n}
                </p>
              ))}

              <div className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
                <section aria-labelledby="pdp-scheda" className="pdp-panel">
                  <h3 id="pdp-scheda" className="flex items-center gap-3 text-2xl font-bold text-ink">
                    <FileText aria-hidden className="h-7 w-7 text-teal" /> La scheda da portare al medico
                  </h3>
                  <p className="mt-2 text-lg text-ink-soft">Obiettivo, informazioni che hai, aree da discutere e domande pronte, su un foglio A4.</p>
                  <label htmlFor="pdp-note" className="mt-5 block text-lg font-bold text-ink">
                    Note per te <span className="font-normal text-muted">(facoltative, restano su questo dispositivo)</span>
                  </label>
                  <textarea id="pdp-note" rows={3} maxLength={600} value={a.notes} onChange={(e) => setA((p) => ({ ...p, notes: e.target.value }))} className="pdp-notes mt-2" />
                  <div className="no-print mt-5 flex flex-col gap-3 sm:flex-row">
                    <button type="button" className="btn btn-primary btn-lg" onClick={downloadPdf} disabled={busy} aria-busy={busy}>
                      <Download aria-hidden className="h-5 w-5" /> {busy ? "Preparo il PDF…" : "Scarica la scheda (PDF)"}
                    </button>
                    <button type="button" className="btn btn-secondary btn-lg" onClick={print}>
                      <Printer aria-hidden className="h-5 w-5" /> Stampa
                    </button>
                  </div>
                </section>
                <section aria-labelledby="pdp-domande" className="pdp-panel">
                  <h3 id="pdp-domande" className="flex items-center gap-3 text-2xl font-bold text-ink">
                    <MessageCircleQuestion aria-hidden className="h-7 w-7 text-teal" /> Domande per il medico
                  </h3>
                  <ol className="mt-4 space-y-3">
                    {map.questions.map((q, i) => (
                      <li key={q} className="flex gap-3 text-lg text-ink">
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
              <section aria-labelledby="pdp-ponte" className="no-print pdp-bridge mt-8">
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
                    <Link href={capisciHref} data-track="pdp-to-referto" className="btn btn-primary btn-lg">
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
                    Parla con un medico{prices.medico ? ` — ${prices.medico}` : ""} <ArrowRight aria-hidden className="h-5 w-5" />
                  </Link>
                </div>
              </section>

              <p className="mt-8 max-w-3xl text-[1.0625rem] text-muted">{PDP_DISCLAIMER}</p>
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
            <dl className="mt-4 space-y-3 text-[1.0625rem]">
              <div className="flex justify-between gap-3">
                <dt className="text-ink-soft">Aree già documentate</dt>
                <dd className="font-bold text-ink">{AREAS.filter((x) => isDocumented(a, x.id)).length}/10</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-ink-soft">Obiettivo</dt>
                <dd className="text-right font-bold text-ink">{map.goalLabel ?? "—"}</dd>
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
    <div className="pdp-nav no-print mt-8 flex flex-col-reverse gap-3 sm:flex-row">
      {back ? (
        <button type="button" className="btn btn-ghost btn-lg" onClick={back}>
          <ArrowLeft aria-hidden className="h-5 w-5" /> Indietro
        </button>
      ) : null}
      <button type="button" className="btn btn-primary btn-lg" onClick={next} disabled={disabled}>
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
          <circle cx="60" cy="60" r={r} className="pdp-ring-value" strokeDasharray={c} strokeDashoffset={c * (1 - pct / 100)} transform="rotate(-90 60 60)" />
        </svg>
        <span className="pdp-ring-num stat-num">{pct}%</span>
      </div>
      <div>
        <p className="font-bold text-ink">Completezza delle informazioni: {pct}%</p>
        <p className="mt-1 text-[0.9375rem] text-muted">{COMPLETENESS_NOTE}</p>
      </div>
    </div>
  );
}

function ResultCol({ title, tone, count, empty, children }: { title: string; tone: "done" | "discuss" | "not"; count: number; empty?: string; children: React.ReactNode }) {
  return (
    <section aria-label={title} className={clsx("pdp-col", `pdp-col-${tone}`)}>
      <h3 className="text-xl font-bold leading-tight text-ink">{title}</h3>
      {count ? <ul className="pdp-col-list mt-3">{children}</ul> : <p className="mt-3 text-[1.0625rem] text-muted">{empty}</p>}
      <p className="pdp-col-count mt-4">{count}</p>
    </section>
  );
}
