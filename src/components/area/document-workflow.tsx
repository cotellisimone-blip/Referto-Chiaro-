"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Download, FolderPlus, Loader2, RotateCcw, Trash2 } from "lucide-react";
import type { ExtractedDocument } from "@/domain/extraction/schema";
import type { Explanation } from "@/domain/reporting/explanation-schema";
import type { ReportEnrichment } from "@/domain/reporting/enrich";
import { Facsimile, revealFacsimileLine } from "@/components/report/facsimile";
import { VerificationList, isReadableObs } from "@/components/report/verification-list";
import { ExplanationView } from "@/components/report/explanation-view";
import { Stepper } from "@/components/report/stepper";
import { INFORMATIVE_NOTE, coreService } from "@/domain/offerta";
import { api, formatDate } from "./api";
import { StatusChip } from "./status-chip";
import { WORKFLOW_STEPS } from "./new-document";

interface Doc {
  id: string;
  title: string;
  status: string;
  extracted: ExtractedDocument | null;
  verification: { confirmedObservationIds: string[]; verifiedAt: string } | null;
  errorMessage: string | null;
  createdAt: string;
}
interface Rep {
  id: string;
  service: "essenziale" | "completo";
  status: string;
  explanation: Explanation | null;
  errorMessage: string | null;
  generatedAt: string | null;
}

const ACTIVE = new Set(["queued", "extracting", "processing"]);

/**
 * Il percorso di un documento nell'area personale, dallo stato salvato nel database:
 * lettura → controllo valori → scelta del servizio → elaborazione → report.
 * Ricaricando la pagina si riparte esattamente da dove si era.
 */
const CAPISCI = coreService("capisci");

interface Quote {
  amount: string;
  first: boolean;
  standard: string;
  medico: string | null;
  parere: string | null;
}

/**
 * Il prossimo passo dopo il report, senza spinte: parlarne con un medico (Orientati) o, se c'è già una diagnosi,
 * un secondo parere (Approfondisci). Il documento è già qui: non va ricaricato.
 */
function NextStep({ documentId, prices }: { documentId: string; prices: Quote | null }) {
  return (
    <div className="side-card" data-testid="prossimo-passo">
      <h2 className="side-card-title">Vuoi parlarne con un medico?</h2>
      <p className="mt-2 text-[1.0625rem] text-ink-soft">Un medico di medicina generale legge questo referto prima del videoconsulto e ti aiuta a capire il prossimo passo. Non devi ricaricare nulla.</p>
      <Link href={`/area-personale/appuntamenti?documento=${documentId}`} className="btn btn-secondary mt-4 w-full">
        Parla con un medico{prices?.medico ? ` · ${prices.medico}` : ""}
      </Link>
      <p className="mt-4 text-[1.0625rem] text-ink-soft">
        Hai già una diagnosi o una proposta di cura?{" "}
        <Link href={`/area-personale/secondo-parere?documento=${documentId}`} className="link font-semibold">
          Chiedi un secondo parere{prices?.parere ? ` (${prices.parere})` : ""}
        </Link>
      </p>
    </div>
  );
}

export function DocumentWorkflow({ documentId }: { documentId: string }) {
  const router = useRouter();
  const [doc, setDoc] = useState<Doc | null>(null);
  const [reports, setReports] = useState<Rep[]>([]);
  const [enrichment, setEnrichment] = useState<ReportEnrichment | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState<string[]>([]);
  const [highlight, setHighlight] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const chosenService = "essenziale" as const;
  const [quote, setQuote] = useState<Quote | null>(null);
  const [pdfState, setPdfState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [view, setView] = useState<"auto" | "verify">("auto");
  const headingRef = useRef<HTMLHeadingElement>(null);
  const seeded = useRef(false);

  const load = useCallback(async () => {
    try {
      const r = await api<{ document: Doc; reports: Rep[]; enrichment: ReportEnrichment | null }>(`/api/v1/area/documents/${documentId}`);
      setDoc(r.document);
      setReports(r.reports);
      setEnrichment(r.enrichment ?? null);
      if (!seeded.current && r.document.verification) {
        seeded.current = true;
        setConfirmed(r.document.verification.confirmedObservationIds);
      }
      return r;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Errore imprevisto.");
      return null;
    }
  }, [documentId]);

  // Caricamento iniziale e aggiornamento automatico finché c'è un lavoro in corso.
  useEffect(() => {
    let alive = true;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const tick = async () => {
      const r = await load();
      if (!alive || !r) return;
      if (ACTIVE.has(r.document.status) || r.reports.some((x) => ACTIVE.has(x.status))) timer = setTimeout(tick, 1200);
    };
    void tick();
    return () => {
      alive = false;
      if (timer) clearTimeout(timer);
    };
  }, [load]);

  // Prezzo personale di «Capisci» (primo referto o standard), calcolato dal server.
  const docStatus = doc?.status;
  useEffect(() => {
    if (!docStatus || !["verified", "ready"].includes(docStatus) || quote) return;
    api<Quote>("/api/v1/area/orders/preventivo").then(setQuote).catch(() => setQuote(null));
  }, [docStatus, quote]);

  const reveal = (line: number) => revealFacsimileLine(setHighlight, line);
  const focusHeading = () => requestAnimationFrame(() => headingRef.current?.focus({ preventScroll: true }));

  async function saveVerification() {
    setBusy(true);
    setError(null);
    try {
      await api(`/api/v1/area/documents/${documentId}/verification`, { method: "POST", body: { confirmedObservationIds: confirmed } });
      setView("auto");
      await load();
      focusHeading();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Errore imprevisto.");
    } finally {
      setBusy(false);
    }
  }

  async function proceedToPayment() {
    setBusy(true);
    setError(null);
    try {
      const r = await api<{ id: string; checkoutUrl: string; provider: string }>("/api/v1/area/orders", { method: "POST", body: { service: chosenService, documentId } });
      if (r.checkoutUrl.startsWith("/")) router.push(r.checkoutUrl);
      else window.location.assign(r.checkoutUrl);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Errore imprevisto.");
      setBusy(false);
    }
  }

  async function requestReport() {
    setBusy(true);
    setError(null);
    try {
      await api(`/api/v1/area/documents/${documentId}/reports`, { method: "POST", body: { service: chosenService } });
      let r = await load();
      // Lancia il polling: lo stato "in coda" diventa "in elaborazione" e poi "pronto".
      for (let i = 0; i < 20 && r && r.reports.some((x) => ACTIVE.has(x.status)); i++) {
        await new Promise((res) => setTimeout(res, 800));
        r = await load();
      }
      focusHeading();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Errore imprevisto.");
    } finally {
      setBusy(false);
    }
  }

  async function reopenVerification() {
    // Torna al controllo valori: il documento resta "verificato"; un nuovo report sostituirà il precedente nella vista.
    setBusy(false);
    setView("verify");
    focusHeading();
  }

  async function downloadPdf(reportId: string) {
    setPdfState("loading");
    try {
      const res = await fetch(`/api/v1/area/reports/${reportId}/pdf`, { cache: "no-store" });
      if (!res.ok) throw new Error();
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `cura-privata-${doc?.extracted?.isSynthetic ? "DEMO-" : ""}${reportId.slice(0, 8)}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 2000);
      setPdfState("done");
    } catch {
      setPdfState("error");
    }
  }

  async function remove() {
    if (!window.confirm("Eliminare questo referto e i suoi report? L'operazione non si può annullare.")) return;
    await api(`/api/v1/area/documents/${documentId}`, { method: "DELETE" });
    router.push("/area-personale");
    router.refresh();
  }

  if (error && !doc) return <p role="alert" className="text-danger">{error}</p>;
  if (!doc) return <div className="h-64 animate-pulse rounded-2xl bg-mist" aria-busy="true" />;

  const latest = reports[0] ?? null;
  const readyReport = reports.find((r) => r.status === "ready") ?? null;
  const activeReport = reports.find((r) => ACTIVE.has(r.status)) ?? null;

  let phase: "reading" | "verify" | "service" | "processing" | "report" | "error";
  if (doc.status === "error") phase = "error";
  else if (ACTIVE.has(doc.status)) phase = "reading";
  else if (doc.status === "needs-verification" || view === "verify") phase = "verify";
  else if (activeReport) phase = "processing";
  else if (readyReport) phase = "report";
  else if (latest?.status === "error") phase = "error";
  else phase = "service";
  const step = { reading: 0, verify: 1, service: 2, processing: 3, report: 4, error: 3 }[phase];
  const extracted = doc.extracted;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <Link href="/area-personale" className="back-link">
          <ArrowLeft aria-hidden /> Tutti i referti
        </Link>
        <div className="flex items-center gap-3">
          <StatusChip status={activeReport ? activeReport.status : doc.status} />
          <button type="button" onClick={remove} className="danger-link">
            <Trash2 aria-hidden className="h-[1.125rem] w-[1.125rem]" /> Elimina
          </button>
        </div>
      </div>
      <Stepper steps={WORKFLOW_STEPS} step={step} label="Avanzamento del referto" />

      {phase === "reading" ? (
        <section className="mt-10" aria-labelledby="step-titolo" aria-busy="true">
          <h1 id="step-titolo" ref={headingRef} tabIndex={-1} className="area-title outline-none">
            Stiamo leggendo il documento.
          </h1>
          <p className="mt-3 flex items-start gap-2.5 text-lg text-ink-soft" role="status">
            <Loader2 aria-hidden className="mt-1 h-5 w-5 shrink-0 animate-spin text-teal" /> Estraiamo ogni valore con unità, intervallo e riga di provenienza. Non indoviniamo mai un numero.
          </p>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-24 animate-pulse rounded-[var(--radius-lg)] bg-mist" />
            ))}
          </div>
        </section>
      ) : null}

      {phase === "error" ? (
        <section className="mt-10" aria-labelledby="step-titolo">
          <h1 id="step-titolo" ref={headingRef} tabIndex={-1} className="area-title outline-none">
            Qualcosa non è andato.
          </h1>
          <div className="mt-6 rounded-[var(--radius-lg)] border border-danger/30 bg-paper p-6 sm:p-7" role="alert">
            <p className="text-xl font-extrabold text-danger">{doc.status === "error" ? "Il documento non è stato letto." : "Il report non è stato generato."}</p>
            <p className="mt-2 text-[1.0625rem] text-ink-soft">{doc.errorMessage ?? latest?.errorMessage ?? "Errore sconosciuto."}</p>
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              {doc.status !== "error" ? (
                <button type="button" className="btn btn-primary" onClick={requestReport} disabled={busy}>
                  <RotateCcw aria-hidden className="h-5 w-5" /> Riprova
                </button>
              ) : null}
              <Link href="/area-personale/nuovo" className="btn btn-secondary">
                Aggiungi un altro referto
              </Link>
            </div>
          </div>
        </section>
      ) : null}

      {phase === "verify" && extracted ? (
        <section className="mt-10" aria-labelledby="step-titolo">
          <div className="max-w-2xl">
            <h1 id="step-titolo" ref={headingRef} tabIndex={-1} className="area-title outline-none">
              Controlla prima i valori.
            </h1>
            <p className="area-lead mt-4">
              {doc.title} · {extracted.laboratoryName} · {formatDate(extracted.reportDate)}. Conferma le righe corrette: spiegheremo solo quelle.
            </p>
          </div>
          <div className="mt-8 grid gap-8 lg:grid-cols-2 lg:items-start lg:gap-10 [&>*]:min-w-0">
            <VerificationList
              observations={extracted.observations}
              confirmed={confirmed}
              onToggle={(id) => setConfirmed((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id]))}
              onSetAll={setConfirmed}
              onHighlight={setHighlight}
              onReveal={reveal}
            />
            <div className="lg:sticky lg:top-28">
              <Facsimile doc={extracted} highlightLine={highlight} compact />
              <p className="mt-3 hidden text-base text-muted lg:block">Passa sopra una voce, o selezionala, per vedere la riga corrispondente.</p>
            </div>
          </div>
          {error ? (
            <p role="alert" className="field-error mt-4">
              {error}
            </p>
          ) : null}
          <div className="mt-10 flex flex-col-reverse gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-end">
            <div className="flex flex-col items-stretch gap-2 sm:items-end">
              <button type="button" className="btn btn-primary btn-lg" disabled={confirmed.length === 0 || busy} onClick={saveVerification} aria-describedby="hint-conferma">
                {busy ? <Loader2 aria-hidden className="h-5 w-5 animate-spin" /> : null}
                Salva e scegli il servizio <ArrowRight aria-hidden className="btn-arrow h-5 w-5" />
              </button>
              <p id="hint-conferma" className="text-center text-base text-muted sm:text-right">
                {confirmed.length === 0 ? "Conferma almeno un valore per continuare." : `${confirmed.length} di ${extracted.observations.filter(isReadableObs).length} valori leggibili confermati.`}
              </p>
            </div>
          </div>
        </section>
      ) : null}

      {phase === "service" ? (
        <section className="mt-10 tone-capisci" aria-labelledby="step-titolo">
          <div className="max-w-2xl">
            <h1 id="step-titolo" ref={headingRef} tabIndex={-1} className="area-title outline-none">
              Rendi chiaro il tuo referto.
            </h1>
            <p className="area-lead mt-4">Valori confermati. Dopo il pagamento il report è pronto di norma in pochi minuti.</p>
          </div>
          <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,42rem)_minmax(0,1fr)] lg:items-start lg:gap-10">
            <div className="form-card form-card-accent" data-testid="capisci-offerta">
              <p className="form-card-title">{CAPISCI.name}</p>
              <p className="form-card-text">{CAPISCI.oneLiner}</p>
              <p className="mt-5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
                {quote?.first ? <span className="tone-text text-base font-bold">Primo referto</span> : null}
                <span className="stat-num text-[2.5rem] leading-none text-ink" data-testid="prezzo-capisci">{quote ? quote.amount : "…"}</span>
                {quote?.first ? <span className="text-muted">poi {quote.standard} per referto</span> : quote ? <span className="text-muted">per referto</span> : null}
              </p>
              <ul className="check-list mt-5">
                {CAPISCI.includes.map((x) => (
                  <li key={x}>
                    <span aria-hidden className="check-dot">
                      <Check />
                    </span>
                    <span>{x}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-5 border-t border-line pt-4 text-base text-muted">{INFORMATIVE_NOTE} Nessun medico rivede questo report: se vuoi parlarne con un medico, dopo puoi farlo senza ricaricare il documento.</p>
            </div>
            <aside aria-labelledby="dopo-titolo" className="side-card lg:mt-2">
              <h2 id="dopo-titolo" className="side-card-title">
                Dopo il pagamento
              </h2>
              <ol className="num-list num-list-mist mt-4 text-[1.0625rem] leading-snug text-ink-soft">
                <li>Prepariamo il report: questa pagina si aggiorna da sola.</li>
                <li>Lo leggi qui e scarichi il PDF da portare in visita.</li>
                <li>Se vuoi parlarne con un medico, parti dal report: il documento è già caricato.</li>
              </ol>
            </aside>
          </div>
          {error ? (
            <p role="alert" className="field-error mt-4">
              {error}
            </p>
          ) : null}
          <div className="mt-10 flex flex-col-reverse gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
            <button type="button" className="btn btn-ghost" onClick={reopenVerification}>
              <ArrowLeft aria-hidden className="h-5 w-5" /> Torna al controllo valori
            </button>
            <div className="flex flex-col items-stretch gap-2 sm:items-end">
              <button type="button" className="btn btn-primary btn-lg max-sm:px-4" onClick={proceedToPayment} disabled={busy || !quote} aria-describedby="nota-pagamento">
                {busy ? <Loader2 aria-hidden className="h-5 w-5 animate-spin" /> : null}
                Paga {quote?.amount ?? ""} e ricevi il report <ArrowRight aria-hidden className="btn-arrow h-5 w-5" />
              </button>
              <p id="nota-pagamento" className="text-center text-base text-muted sm:text-right">
                Versione di prova: nessun addebito reale.
              </p>
            </div>
          </div>
        </section>
      ) : null}

      {phase === "processing" ? (
        <section className="mt-10" aria-labelledby="step-titolo" aria-busy="true">
          <h1 id="step-titolo" ref={headingRef} tabIndex={-1} className="area-title outline-none">
            Prepariamo il report.
          </h1>
          <p className="mt-3 flex items-start gap-2.5 text-lg text-ink-soft" role="status">
            <Loader2 aria-hidden className="mt-1 h-5 w-5 shrink-0 animate-spin text-teal" /> Stato: {activeReport?.status === "queued" ? "in coda" : "in elaborazione"}. Scriviamo la spiegazione e controlliamo che ogni numero coincida con il documento.
          </p>
          <div className="mt-8 space-y-4">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-28 animate-pulse rounded-[var(--radius-lg)] bg-mist" />
            ))}
          </div>
        </section>
      ) : null}

      {phase === "report" && readyReport?.explanation && extracted ? (
        <section className="mt-10" aria-labelledby="step-titolo">
          <h1 id="step-titolo" ref={headingRef} tabIndex={-1} className="area-title max-w-2xl outline-none">
            Il tuo referto, in parole semplici.
          </h1>
          <p className="meta mt-2">
            {doc.title} · Capisci il tuo referto · generato il {readyReport.generatedAt ? formatDate(readyReport.generatedAt) : ""}
          </p>
          {/* Su schermi larghi il documento resta in vista mentre si legge: è l'ultimo blocco della colonna e si ferma in alto. */}
          <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,34rem)] xl:gap-10 [&>*]:min-w-0">
            <ExplanationView explanation={readyReport.explanation} onReveal={reveal} enrichment={enrichment} />
            <aside className="flex flex-col gap-5" aria-label="Documento e download">
              <div className="form-card form-card-accent">
                <h2 className="form-card-title">Scarica il riepilogo</h2>
                <p className="form-card-text">
                  Un PDF in formato A4 con valori, spiegazioni e domande{extracted.isSynthetic ? ", marcato DEMO – DATI SINTETICI" : ""}.
                </p>
                <button type="button" className="btn btn-primary btn-lg mt-5 w-full max-sm:px-4" onClick={() => downloadPdf(readyReport.id)} disabled={pdfState === "loading"}>
                  {pdfState === "loading" ? <Loader2 aria-hidden className="h-5 w-5 animate-spin" /> : <Download aria-hidden className="h-5 w-5" />}
                  Scarica il PDF
                </button>
                <p className={pdfState === "done" || pdfState === "error" ? "mt-4 text-center text-base font-semibold" : undefined} role="status">
                  {pdfState === "done" ? <span className="text-sage-deep">Documento scaricato.</span> : null}
                  {pdfState === "error" ? <span className="text-danger">Download non riuscito. Riprova.</span> : null}
                </p>
                <Link href="/area-personale/dossier/nuovo" className="btn btn-secondary mt-3 w-full">
                  <FolderPlus aria-hidden className="h-5 w-5" /> Metti in un dossier
                </Link>
              </div>
              <NextStep documentId={documentId} prices={quote} />
              <div className="space-y-3 xl:sticky xl:top-28">
                <Facsimile doc={extracted} highlightLine={highlight} compact />
                <button type="button" className="btn btn-ghost w-full" onClick={reopenVerification}>
                  <RotateCcw aria-hidden className="h-5 w-5" /> Rivedi i valori confermati
                </button>
              </div>
            </aside>
          </div>
        </section>
      ) : null}
    </div>
  );
}
