"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Download, Loader2, RotateCcw, ScanEye } from "lucide-react";
import lab001 from "@/fixtures/synthetic/referto-lab-001.json";
import type { Explanation } from "@/domain/reporting/explanation-schema";
import { Facsimile as FacsimileBase, revealFacsimileLine } from "@/components/report/facsimile";
import { VerificationList, isReadableObs, type VerifiableObservation } from "@/components/report/verification-list";
import { ExplanationView } from "@/components/report/explanation-view";
import { Stepper as StepperBase } from "@/components/report/stepper";
import { track } from "@/components/site/track";
import { ProvaAvvisami } from "@/components/site/prova-avvisami";

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

/**
 * `vetrina`: nel profilo vetrina la prova finisce con «Avvisami quando parte» (ciclo 3, fase 1);
 * `startHref`: nel profilo standard, dove inizia il servizio vero.
 */
export function DemoFlow({ vetrina = false, startHref = "/area-personale/nuovo" }: { vetrina?: boolean; startHref?: string } = {}) {
  const [utile, setUtile] = useState<"si" | "no" | null>(null);
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
      track("esempio-completato");
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
      track("esempio-pdf");
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
        <section className="fade-in mt-8 grid gap-8 sm:mt-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-12 [&>*]:min-w-0" aria-labelledby="step-titolo">
          <div>
            <h2 id="step-titolo" ref={headingRef} tabIndex={-1} className="display text-[1.75rem] outline-none sm:text-[2.25rem]">
              Questo è il referto di esempio.
            </h2>
            <p className="mt-4 text-lg text-muted">
              Un esame del sangue inventato, di una persona che non esiste. Nella versione reale qui vedresti il tuo documento, conservato in modo privato.
            </p>
            <dl className="mt-6 grid grid-cols-[auto_1fr] gap-x-6 gap-y-2.5 text-[1.0625rem] leading-snug">
              <dt className="text-muted">Laboratorio</dt>
              <dd className="text-ink">{DOC.laboratoryName}</dd>
              <dt className="text-muted">Data</dt>
              <dd className="tabular text-ink">{formatDate(DOC.reportDate)}</dd>
              <dt className="text-muted">Persona</dt>
              <dd className="text-ink">{DOC.patientLabel}</dd>
              <dt className="text-muted">Voci lette</dt>
              <dd className="text-ink">{DOC.observations.length}, di cui una non leggibile</dd>
            </dl>
            <div className="callout callout-warn mt-6">
              <span aria-hidden className="callout-ico">
                <ScanEye />
              </span>
              <p className="callout-text mt-0 self-center text-ink">Abbiamo inserito di proposito una cifra rovinata alla riga 8: vedrai che il sistema non prova a indovinarla.</p>
            </div>
            <button type="button" className="btn btn-primary btn-lg mt-8 w-full sm:w-auto" onClick={() => goTo(1)}>
              Controlla i valori estratti <ArrowRight aria-hidden className="btn-arrow h-5 w-5" />
            </button>
          </div>
          <Facsimile highlightLine={null} />
        </section>
      ) : null}

      {/* STEP 1 — CONTROLLO VALORI */}
      {step === 1 ? (
        <section className="fade-in mt-8 sm:mt-10" aria-labelledby="step-titolo">
          <div className="max-w-2xl">
            <h2 id="step-titolo" ref={headingRef} tabIndex={-1} className="display text-[1.75rem] outline-none sm:text-[2.25rem]">
              Controlla prima i valori.
            </h2>
            <p className="mt-4 text-lg text-muted">
              Confronta ogni riga con il documento e conferma quelle corrette. Spiegheremo solo i valori che hai confermato.
            </p>
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-2 lg:items-start lg:gap-10 [&>*]:min-w-0">
            <VerificationList observations={DOC.observations} confirmed={confirmed} onToggle={toggle} onSetAll={setConfirmed} onHighlight={setHighlight} onReveal={reveal} />

            <div className="lg:sticky lg:top-28">
              <Facsimile highlightLine={highlight} compact />
              <p className="mt-3 hidden text-base text-muted lg:block">Passa sopra una voce, o selezionala, per vedere la riga corrispondente.</p>
            </div>
          </div>

          <div className="mt-10 flex flex-col-reverse gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
            <button type="button" className="btn btn-ghost" onClick={() => goTo(0)}>
              <ArrowLeft aria-hidden className="h-5 w-5" /> Torna al documento
            </button>
            <div className="flex flex-col items-stretch gap-2.5 sm:items-end">
              <button type="button" className="btn btn-primary btn-lg" disabled={confirmed.length === 0} onClick={generate} aria-describedby="hint-genera">
                Genera la spiegazione <ArrowRight aria-hidden className="btn-arrow h-5 w-5" />
              </button>
              <p id="hint-genera" className="text-center text-base text-muted sm:text-right">
                {confirmed.length === 0 ? "Conferma almeno un valore per continuare." : "Nessun dato lascia questa demo: è tutto inventato."}
              </p>
            </div>
          </div>
        </section>
      ) : null}

      {/* STEP 2/3 — SPIEGAZIONE + PDF */}
      {step >= 2 ? (
        <section className="fade-in mt-8 sm:mt-10" aria-labelledby="step-titolo" aria-busy={report.status === "loading"}>
          <h2 id="step-titolo" ref={headingRef} tabIndex={-1} className="display max-w-2xl text-[1.75rem] outline-none sm:text-[2.25rem]">
            Il tuo referto, in parole semplici.
          </h2>

          {report.status === "loading" ? (
            <div className="mt-8 space-y-4" role="status">
              <p className="flex items-center gap-2.5 text-lg text-ink-soft">
                <Loader2 aria-hidden className="h-5 w-5 shrink-0 animate-spin text-teal" /> Prepariamo la spiegazione e controlliamo che i numeri coincidano…
              </p>
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-28 animate-pulse rounded-[var(--radius-lg)] bg-mist" />
              ))}
            </div>
          ) : null}

          {report.status === "error" ? (
            <div className="mt-8 rounded-[var(--radius-lg)] border border-danger/30 bg-paper p-6 sm:p-7" role="alert">
              <p className="text-xl font-extrabold text-danger">Non è stato possibile generare la spiegazione.</p>
              <p className="mt-2 text-[1.0625rem] text-ink-soft">{report.message}</p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <button type="button" className="btn btn-primary" onClick={generate}>
                  <RotateCcw aria-hidden className="h-5 w-5" /> Riprova
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => goTo(1)}>
                  Torna al controllo valori
                </button>
              </div>
            </div>
          ) : null}

          {report.status === "ready" ? (
            <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,34rem)] lg:items-start lg:gap-10 [&>*]:min-w-0">
              <ExplanationView explanation={report.explanation} onReveal={reveal} />

              <aside className="space-y-5 lg:sticky lg:top-28" aria-label="Documento e download">
                <div className="form-card form-card-accent">
                  <h3 className="form-card-title">Scarica il riepilogo</h3>
                  <p className="form-card-text">
                    Un PDF in formato A4 con valori, spiegazioni e domande, marcato <strong className="text-ink">DEMO – DATI SINTETICI</strong>.
                  </p>
                  <button
                    type="button"
                    className="btn btn-primary btn-lg mt-5 w-full max-sm:px-4"
                    onClick={() => {
                      setStep(3);
                      void downloadPdf();
                    }}
                    disabled={pdfState === "loading"}
                  >
                    {pdfState === "loading" ? <Loader2 aria-hidden className="h-5 w-5 animate-spin" /> : <Download aria-hidden className="h-5 w-5" />}
                    Scarica il PDF di esempio
                  </button>
                  <p className={pdfState === "done" || pdfState === "error" ? "mt-4 text-center text-base font-semibold" : undefined} role="status">
                    {pdfState === "done" ? <span className="text-sage-deep">Documento scaricato.</span> : null}
                    {pdfState === "error" ? <span className="text-danger">Download non riuscito. Riprova.</span> : null}
                  </p>
                </div>
                <Facsimile highlightLine={highlight} compact />
                <button type="button" className="btn btn-ghost w-full" onClick={restart}>
                  <RotateCcw aria-hidden className="h-5 w-5" /> Ricomincia l&apos;esempio
                </button>
              </aside>
            </div>
          ) : null}

          {report.status === "ready" ? (
            <div className="mt-12" data-testid="esempio-fine">
              <div className="cta-card">
                <div>
                  <p className="form-card-title" id="esempio-utile">
                    Ti è stato utile?
                  </p>
                  {utile === null ? (
                    <div className="mt-5 flex flex-wrap gap-3" role="group" aria-labelledby="esempio-utile">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => {
                          setUtile("si");
                          track("esempio-utile-si");
                        }}
                      >
                        Sì, è chiaro
                      </button>
                      <button
                        type="button"
                        className="btn btn-ghost"
                        onClick={() => {
                          setUtile("no");
                          track("esempio-utile-no");
                        }}
                      >
                        Non molto
                      </button>
                    </div>
                  ) : (
                    <p role="status" className="mt-4 max-w-md text-lg font-semibold text-ink">
                      {utile === "si" ? "Grazie. Lo contiamo, senza sapere chi sei." : "Grazie: ce lo segniamo, senza sapere chi sei, per migliorare le spiegazioni."}
                    </p>
                  )}
                </div>
                <div className="lg:max-w-[24rem] xl:max-w-[36rem]">
                  <p className="text-[1.0625rem] text-ink-soft">Il servizio per i referti reali non è ancora attivo: stiamo completando le verifiche cliniche, legali e di sicurezza.</p>
                  {vetrina ? null : (
                    <div className="mt-5 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
                      <Link href={startHref} className="btn btn-primary btn-lg max-sm:px-4 sm:whitespace-nowrap">
                        Rendi chiaro il mio referto <ArrowRight aria-hidden className="btn-arrow h-5 w-5" />
                      </Link>
                      <Link href="/servizi" className="btn btn-ghost">
                        Vedi servizi e prezzi
                      </Link>
                    </div>
                  )}
                </div>
              </div>
              {vetrina ? <ProvaAvvisami servizio="capisci" titolo="Vuoi la stessa spiegazione per il tuo referto?" /> : null}
            </div>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}
