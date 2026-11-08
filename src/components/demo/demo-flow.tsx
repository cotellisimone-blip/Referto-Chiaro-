"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Download, Loader2, RotateCcw } from "lucide-react";
import lab001 from "@/fixtures/synthetic/referto-lab-001.json";
import type { Explanation } from "@/domain/reporting/explanation-schema";
import { Facsimile as FacsimileBase, revealFacsimileLine } from "@/components/report/facsimile";
import { VerificationList, isReadableObs, type VerifiableObservation } from "@/components/report/verification-list";
import { ExplanationView } from "@/components/report/explanation-view";
import { Stepper as StepperBase } from "@/components/report/stepper";

const DOC = lab001 as Omit<typeof lab001, "observations"> & { observations: VerifiableObservation[] };
const readable = isReadableObs;

const STEPS = ["Documento", "Valori", "Spiegazione", "PDF"] as const;
type Step = 0 | 1 | 2 | 3;

const STORAGE_KEY = "rc-demo-v1";

function formatDate(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

function Facsimile(props: { highlightLine: number | null; compact?: boolean }) {
  return <FacsimileBase doc={DOC} {...props} />;
}

function Stepper({ step }: { step: Step }) {
  return <StepperBase steps={STEPS} step={step} label="Avanzamento della demo" />;
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


  /** Azione esplicita dell'utente: evidenzia la riga e, se il documento non è visibile, lo porta in vista. */
  const reveal = (line: number) => revealFacsimileLine(setHighlight, line);

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
      a.download = "cura-privata-esempio-DEMO.pdf";
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
            <VerificationList observations={DOC.observations} confirmed={confirmed} onToggle={toggle} onSetAll={setConfirmed} onHighlight={setHighlight} onReveal={reveal} />

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
              <ExplanationView explanation={report.explanation} onReveal={reveal} />

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
                <Link href="/servizi" className="btn btn-secondary">
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
