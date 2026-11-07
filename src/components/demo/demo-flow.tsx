"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { clsx } from "clsx";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCheck,
  Download,
  FileText,
  Loader2,
  RotateCcw,
  ScanEye,
} from "lucide-react";
import lab001 from "@/fixtures/synthetic/referto-lab-001.json";
import type { Explanation } from "@/domain/reporting/explanation-schema";

type Obs = (typeof lab001.observations)[number];
const DOC = lab001;
const readable = (o: Obs) => o.valueRaw !== null && o.parseConfidence !== "low";

const STEPS = ["Documento", "Valori", "Spiegazione", "PDF"] as const;
type Step = 0 | 1 | 2 | 3;

const STORAGE_KEY = "rc-demo-v1";

function formatDate(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

/* ---------- Facsimile del documento ---------- */

function Facsimile({ highlightLine, compact = false }: { highlightLine: number | null; compact?: boolean }) {
  const refs = useRef(new Map<number, HTMLLIElement>());
  const scroller = useRef<HTMLDivElement>(null);
  // Scorre SOLO dentro il riquadro del documento, mai la pagina (evita salti su mobile).
  useEffect(() => {
    if (highlightLine == null || !scroller.current) return;
    const el = refs.current.get(highlightLine);
    const box = scroller.current;
    if (!el) return;
    const top = el.offsetTop - box.clientHeight / 2 + el.clientHeight / 2;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    box.scrollTo({ top: Math.max(0, top), behavior: reduce ? "auto" : "smooth" });
  }, [highlightLine]);

  return (
    <figure data-facsimile className="card overflow-hidden" aria-label="Facsimile del referto sintetico">
      <figcaption className="flex flex-wrap items-center justify-between gap-2 border-b border-line bg-mist/60 px-5 py-3">
        <span className="inline-flex items-center gap-2 text-sm font-semibold text-ink">
          <FileText aria-hidden className="h-4 w-4 text-teal" /> Pagina 1 di {DOC.pageCount}
        </span>
        <span className="chip bg-cream text-ink">Esempio sintetico</span>
      </figcaption>
      <div
        ref={scroller}
        tabIndex={0}
        role="region"
        aria-label="Testo del documento, scorrevole"
        className={clsx("doc-paper relative overflow-x-auto", compact ? "max-h-[420px] overflow-y-auto" : "")}
      >
        <ol className="min-w-[560px] py-3 font-mono text-[0.8125rem] leading-8 text-ink">
          {DOC.sourceLines.map((l) => (
            <li
              key={l.line}
              ref={(el) => {
                if (el) refs.current.set(l.line, el);
              }}
              className={clsx(
                "grid grid-cols-[2.5rem_1fr] whitespace-pre px-2 transition-colors duration-200",
                highlightLine === l.line && "bg-cream outline-2 -outline-offset-2 outline-teal",
              )}
              aria-current={highlightLine === l.line ? "true" : undefined}
            >
              <span className="select-none pr-3 text-right text-muted/70" aria-label={`Riga ${l.line}`}>
                {l.line}
              </span>
              <span>{l.text}</span>
            </li>
          ))}
        </ol>
      </div>
    </figure>
  );
}

/* ---------- Stepper ---------- */

function Stepper({ step }: { step: Step }) {
  return (
    <nav aria-label="Avanzamento della demo" className="no-print">
      <ol className="grid grid-cols-4 gap-2">
        {STEPS.map((label, i) => {
          const state = i < step ? "done" : i === step ? "current" : "todo";
          return (
            <li key={label} aria-current={state === "current" ? "step" : undefined} className="min-w-0">
              <div className={clsx("h-1.5 rounded-full transition-colors duration-200", state === "todo" ? "bg-line" : "bg-teal")} />
              <p className={clsx("mt-2 flex items-center gap-1.5 truncate text-xs font-semibold sm:text-sm", state === "todo" ? "text-muted" : "text-ink")}>
                {state === "done" ? <Check aria-hidden className="h-3.5 w-3.5 shrink-0 text-sage-deep" /> : <span className="tabular hidden text-muted sm:inline">{i + 1}.</span>}
                <span className="truncate">{label}</span>
                <span className="sr-only">{state === "done" ? " (completato)" : state === "current" ? " (passaggio attuale)" : ""}</span>
              </p>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/* ---------- Componente principale ---------- */

type ReportState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ready"; explanation: Explanation; generatedAt: string }
  | { status: "error"; message: string };

export function DemoFlow() {
  const [step, setStep] = useState<Step>(0);
  const [confirmed, setConfirmed] = useState<string[]>([]);
  const [highlight, setHighlight] = useState<number | null>(null);
  const [report, setReport] = useState<ReportState>({ status: "idle" });
  const [pdfState, setPdfState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const headingRef = useRef<HTMLHeadingElement>(null);
  const restored = useRef(false);

  // Ripristino della bozza (solo dati sintetici, solo in questa scheda).
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) {
        const s = JSON.parse(raw) as { step?: number; confirmed?: string[] };
        const valid = (s.confirmed ?? []).filter((id) => DOC.observations.some((o) => o.id === id && readable(o)));
        // eslint-disable-next-line react-hooks/set-state-in-effect -- ripristino una tantum da sessionStorage
        setConfirmed(valid);
        if (s.step === 1) setStep(1);
      }
    } catch {
      /* storage non disponibile: si riparte da capo */
    }
    restored.current = true;
  }, []);

  useEffect(() => {
    if (!restored.current) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ step: Math.min(step, 1), confirmed }));
    } catch {
      /* ignorato */
    }
  }, [step, confirmed]);

  const goTo = useCallback((s: Step) => {
    setStep(s);
    setHighlight(null);
    requestAnimationFrame(() => {
      headingRef.current?.focus({ preventScroll: true });
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      document.getElementById("demo")?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    });
  }, []);

  const readableIds = DOC.observations.filter(readable).map((o) => o.id);
  const allConfirmed = readableIds.every((id) => confirmed.includes(id));

  /** Azione esplicita dell'utente: evidenzia la riga e, se il documento non è visibile, lo porta in vista. */
  const reveal = (line: number) => {
    setHighlight(line);
    const fig = document.querySelector<HTMLElement>("[data-facsimile]");
    if (!fig) return;
    const r = fig.getBoundingClientRect();
    if (r.top < 80 || r.bottom > window.innerHeight) {
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      fig.scrollIntoView({ block: "center", behavior: reduce ? "auto" : "smooth" });
    }
  };

  const toggle = (id: string) => setConfirmed((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id]));

  const generate = useCallback(async () => {
    goTo(2);
    setReport({ status: "loading" });
    setPdfState("idle");
    try {
      const res = await fetch("/api/v1/demo/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentId: DOC.documentId, confirmedObservationIds: confirmed }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message ?? "Non è stato possibile generare la spiegazione.");
      setReport({ status: "ready", explanation: data.explanation, generatedAt: data.generatedAt });
    } catch (e) {
      setReport({ status: "error", message: e instanceof Error ? e.message : "Errore imprevisto." });
    }
  }, [confirmed, goTo]);

  const downloadPdf = useCallback(async () => {
    setPdfState("loading");
    try {
      const res = await fetch("/api/v1/demo/report/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentId: DOC.documentId, confirmedObservationIds: confirmed }),
      });
      if (!res.ok) throw new Error();
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "referto-chiaro-esempio-DEMO.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
      setPdfState("done");
    } catch {
      setPdfState("error");
    }
  }, [confirmed]);

  const restart = () => {
    setConfirmed([]);
    setReport({ status: "idle" });
    setPdfState("idle");
    goTo(0);
  };

  return (
    <div id="demo" className="scroll-mt-28">
      <Stepper step={step} />

      {/* STEP 0 — DOCUMENTO */}
      {step === 0 ? (
        <section className="fade-in mt-10 grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-12 [&>*]:min-w-0" aria-labelledby="step-titolo">
          <div>
            <h2 id="step-titolo" ref={headingRef} tabIndex={-1} className="display text-[1.75rem] outline-none sm:text-[2.25rem]">
              Questo è il referto di esempio.
            </h2>
            <p className="mt-4 text-lg text-muted">
              Un esame del sangue inventato, di una persona che non esiste. Nella versione reale qui vedresti il tuo documento, conservato in modo privato.
            </p>
            <dl className="mt-6 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 text-[0.9375rem]">
              <dt className="text-muted">Laboratorio</dt>
              <dd className="text-ink">{DOC.laboratoryName}</dd>
              <dt className="text-muted">Data</dt>
              <dd className="tabular text-ink">{formatDate(DOC.reportDate)}</dd>
              <dt className="text-muted">Persona</dt>
              <dd className="text-ink">{DOC.patientLabel}</dd>
              <dt className="text-muted">Voci lette</dt>
              <dd className="text-ink">{DOC.observations.length}, di cui una non leggibile</dd>
            </dl>
            <p className="mt-6 rounded-xl bg-cream/70 px-4 py-3 text-[0.9375rem] text-ink">
              Abbiamo inserito di proposito una cifra rovinata alla riga 8: vedrai che il sistema non prova a indovinarla.
            </p>
            <button type="button" className="btn btn-primary mt-8 w-full sm:w-auto" onClick={() => goTo(1)}>
              Controlla i valori estratti <ArrowRight aria-hidden className="h-4 w-4" />
            </button>
          </div>
          <Facsimile highlightLine={null} />
        </section>
      ) : null}

      {/* STEP 1 — CONTROLLO VALORI */}
      {step === 1 ? (
        <section className="fade-in mt-10" aria-labelledby="step-titolo">
          <div className="max-w-2xl">
            <h2 id="step-titolo" ref={headingRef} tabIndex={-1} className="display text-[1.75rem] outline-none sm:text-[2.25rem]">
              Controlla prima i valori.
            </h2>
            <p className="mt-4 text-lg text-muted">
              Confronta ogni riga con il documento e conferma quelle corrette. Spiegheremo solo i valori che hai confermato.
            </p>
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start [&>*]:min-w-0">
            <fieldset>
              <legend className="sr-only">Valori estratti dal documento</legend>
              <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-muted" aria-live="polite">
                  <span className="tabular font-semibold text-ink">{confirmed.length}</span> di {readableIds.length} valori leggibili confermati
                </p>
                <button
                  type="button"
                  className="btn btn-ghost min-h-11 text-sm"
                  onClick={() => setConfirmed(allConfirmed ? [] : readableIds)}
                >
                  <CheckCheck aria-hidden className="h-4 w-4" />
                  {allConfirmed ? "Togli tutte le conferme" : "Conferma tutti i valori leggibili"}
                </button>
              </div>
              <ul className="space-y-3">
                {DOC.observations.map((o) => {
                  const ok = readable(o);
                  const checked = confirmed.includes(o.id);
                  const inputId = `conf-${o.id}`;
                  return (
                    <li
                      key={o.id}
                      onMouseEnter={() => setHighlight(o.sourceLine)}
                      onFocus={() => setHighlight(o.sourceLine)}
                      className={clsx(
                        "rounded-2xl border bg-paper p-4 transition-colors duration-150 sm:p-5",
                        !ok ? "border-dashed border-muted/40 bg-canvas" : checked ? "border-teal/60 shadow-[var(--shadow-card)]" : "border-line",
                      )}
                    >
                      <div className="flex items-start gap-4">
                        {ok ? (
                          <input
                            id={inputId}
                            type="checkbox"
                            checked={checked}
                            onChange={() => toggle(o.id)}
                            className="mt-1 h-6 w-6 shrink-0 cursor-pointer rounded-md accent-[var(--color-teal)]"
                            aria-describedby={`${inputId}-src`}
                          />
                        ) : (
                          <AlertTriangle aria-hidden className="mt-1 h-6 w-6 shrink-0 text-warn" />
                        )}
                        <div className="min-w-0 flex-1">
                          <label htmlFor={ok ? inputId : undefined} className={clsx("block", ok && "cursor-pointer")}>
                            <span className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                              <span className="font-semibold text-ink">{o.nameRaw}</span>
                              <span className="tabular font-mono text-[0.9375rem]">
                                {ok ? (
                                  <>
                                    <strong className="text-ink">{o.valueRaw}</strong> <span className="text-muted">{o.unitRaw}</span>
                                  </>
                                ) : (
                                  <span className="text-warn">non leggibile</span>
                                )}
                              </span>
                            </span>
                            <span className="mt-1 block text-sm text-muted">
                              Intervallo stampato: <span className="tabular">{o.referenceRaw ?? "non riportato"}</span>
                            </span>
                          </label>
                          <p id={`${inputId}-src`} className="mt-2 flex items-center gap-1.5 text-xs text-muted">
                            <ScanEye aria-hidden className="h-3.5 w-3.5" /> Pagina {o.sourcePage}, riga {o.sourceLine}
                            <button type="button" className="ml-1 underline underline-offset-2 hover:text-teal lg:hidden" onClick={() => reveal(o.sourceLine)}>
                              mostra
                            </button>
                          </p>
                          {!ok ? (
                            <p className="mt-3 rounded-lg bg-cream/70 px-3 py-2 text-sm text-ink">
                              Valore non leggibile: verifica il documento originale. Non lo includeremo nella spiegazione.
                            </p>
                          ) : null}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </fieldset>

            <div className="lg:sticky lg:top-28">
              <Facsimile highlightLine={highlight} compact />
              <p className="mt-3 text-sm text-muted">Passa sopra o seleziona una voce per vedere la riga corrispondente.</p>
            </div>
          </div>

          <div className="mt-10 flex flex-col-reverse gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
            <button type="button" className="btn btn-ghost" onClick={() => goTo(0)}>
              <ArrowLeft aria-hidden className="h-4 w-4" /> Torna al documento
            </button>
            <div className="flex flex-col items-stretch gap-2 sm:items-end">
              <button type="button" className="btn btn-primary" disabled={confirmed.length === 0} onClick={generate} aria-describedby="hint-genera">
                Genera la spiegazione <ArrowRight aria-hidden className="h-4 w-4" />
              </button>
              <p id="hint-genera" className="text-center text-sm text-muted sm:text-right">
                {confirmed.length === 0 ? "Conferma almeno un valore per continuare." : "Nessun dato lascia questa demo: è tutto inventato."}
              </p>
            </div>
          </div>
        </section>
      ) : null}

      {/* STEP 2/3 — SPIEGAZIONE + PDF */}
      {step >= 2 ? (
        <section className="fade-in mt-10" aria-labelledby="step-titolo" aria-busy={report.status === "loading"}>
          <h2 id="step-titolo" ref={headingRef} tabIndex={-1} className="display max-w-2xl text-[1.75rem] outline-none sm:text-[2.25rem]">
            Il tuo referto, in parole semplici.
          </h2>

          {report.status === "loading" ? (
            <div className="mt-8 space-y-4" role="status">
              <p className="flex items-center gap-2 text-muted">
                <Loader2 aria-hidden className="h-4 w-4 animate-spin" /> Prepariamo la spiegazione e controlliamo che i numeri coincidano…
              </p>
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-28 animate-pulse rounded-2xl bg-mist" />
              ))}
            </div>
          ) : null}

          {report.status === "error" ? (
            <div className="mt-8 rounded-2xl border border-danger/30 bg-paper p-6" role="alert">
              <p className="font-semibold text-danger">Non è stato possibile generare la spiegazione.</p>
              <p className="mt-2 text-muted">{report.message}</p>
              <div className="mt-5 flex flex-wrap gap-3">
                <button type="button" className="btn btn-primary" onClick={generate}>
                  <RotateCcw aria-hidden className="h-4 w-4" /> Riprova
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => goTo(1)}>
                  Torna al controllo valori
                </button>
              </div>
            </div>
          ) : null}

          {report.status === "ready" ? (
            <div className="mt-8 grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start [&>*]:min-w-0">
              <div className="space-y-6">
                <div className="rounded-2xl bg-mist p-5 sm:p-6">
                  <p className="eyebrow">In breve</p>
                  <p className="mt-2 text-lg text-ink">{report.explanation.summary}</p>
                </div>

                <ol className="space-y-4" aria-label="Spiegazione dei valori">
                  {report.explanation.items.map((it) => (
                    <li key={it.sourceObservationId} className="card p-5 sm:p-6">
                      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                        <h3 className="text-lg font-semibold text-ink">{it.nameExact}</h3>
                        <p className="tabular font-mono">
                          <strong>{it.originalValueExact}</strong> <span className="text-muted">{it.originalUnitExact}</span>
                        </p>
                      </div>
                      <p className="mt-3 text-ink">{it.plainLanguageDefinition}</p>
                      <p className="mt-3 text-[0.9375rem] text-muted">
                        Intervallo stampato: <span className="tabular font-semibold text-ink">{it.originalReferenceExact}</span>. {it.printedRangeNote}
                      </p>
                      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-3">
                        <span className="text-xs text-muted">{it.limits}</span>
                        <button
                          type="button"
                          className="inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 text-sm font-semibold text-teal hover:bg-mist"
                          onClick={() => reveal(it.sourceCitation.line)}
                          aria-label={`Mostra ${it.nameExact} nel documento, pagina ${it.sourceCitation.page}, riga ${it.sourceCitation.line}`}
                        >
                          <ScanEye aria-hidden className="h-4 w-4" /> Pag. {it.sourceCitation.page}, riga {it.sourceCitation.line}
                        </button>
                      </div>
                    </li>
                  ))}
                </ol>

                {report.explanation.excludedObservations.length ? (
                  <div className="rounded-2xl border border-dashed border-muted/40 p-5">
                    <p className="font-semibold text-ink">Non inclusi nella spiegazione</p>
                    <ul className="mt-2 space-y-1 text-[0.9375rem] text-muted">
                      {report.explanation.excludedObservations.map((e) => (
                        <li key={e.id}>
                          <span className="text-ink">{e.nameExact}</span>: {e.reason}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}

                <div className="card p-5 sm:p-6">
                  <h3 className="font-serif text-2xl">Domande da portare al medico</h3>
                  <ul className="mt-4 space-y-3">
                    {report.explanation.questionsForDoctor.map((q) => (
                      <li key={q} className="flex gap-3">
                        <span aria-hidden className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sage" />
                        <span>{q}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-2xl bg-cream/60 p-5 text-[0.9375rem] text-ink">
                  <p className="font-semibold">Limiti di questa spiegazione</p>
                  <ul className="mt-2 list-disc space-y-1 pl-5">
                    {report.explanation.limitations.map((l) => (
                      <li key={l}>{l}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <aside className="space-y-5 lg:sticky lg:top-28" aria-label="Documento e download">
                <div className="card p-5 sm:p-6">
                  <h3 className="font-serif text-xl">Scarica il riepilogo</h3>
                  <p className="mt-2 text-[0.9375rem] text-muted">
                    Un PDF A4 con valori, spiegazioni e domande, marcato <strong className="text-ink">DEMO – DATI SINTETICI</strong>.
                  </p>
                  <button
                    type="button"
                    className="btn btn-primary mt-5 w-full"
                    onClick={() => {
                      setStep(3);
                      void downloadPdf();
                    }}
                    disabled={pdfState === "loading"}
                  >
                    {pdfState === "loading" ? <Loader2 aria-hidden className="h-4 w-4 animate-spin" /> : <Download aria-hidden className="h-4 w-4" />}
                    Scarica il PDF di esempio
                  </button>
                  <p className="mt-3 min-h-5 text-center text-sm" role="status">
                    {pdfState === "done" ? <span className="text-sage-deep">Documento scaricato.</span> : null}
                    {pdfState === "error" ? <span className="text-danger">Download non riuscito. Riprova.</span> : null}
                  </p>
                </div>
                <Facsimile highlightLine={highlight} compact />
                <button type="button" className="btn btn-ghost w-full" onClick={restart}>
                  <RotateCcw aria-hidden className="h-4 w-4" /> Ricomincia l&apos;esempio
                </button>
              </aside>
            </div>
          ) : null}

          {report.status === "ready" ? (
            <div className="mt-12 rounded-[var(--radius-lg)] border border-line bg-paper p-6 sm:p-8">
              <p className="font-serif text-2xl">Ti è stato utile?</p>
              <p className="mt-2 max-w-2xl text-muted">
                Il servizio per i referti reali non è ancora attivo: stiamo completando le verifiche cliniche, legali e di sicurezza.
              </p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <Link href="/servizi-prezzi" className="btn btn-secondary">
                  Vedi servizi e prezzi
                </Link>
                <Link href="/come-funziona" className="btn btn-ghost">
                  Come funziona nel dettaglio
                </Link>
              </div>
            </div>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}
