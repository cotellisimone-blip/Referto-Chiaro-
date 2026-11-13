"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Download, FileText, FolderPlus, Loader2, RotateCcw, Trash2 } from "lucide-react";
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
import { ConfirmButton } from "@/components/ui/confirm-button";

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
      <p className="mt-2 text-[1.0625rem] text-ink-soft">Un medico di medicina generale legge questo referto prima del videoconsulto. Non devi ricaricare nulla.</p>
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

/** `paidNote`: ciclo 5, fase 2. Dopo il pagamento si arriva qui direttamente; una riga conferma che è stato registrato. */
export function DocumentWorkflow({ documentId, paidNote = "none" }: { documentId: string; paidNote?: "none" | "reale" | "prova" }) {
  const router = useRouter();
  const [doc, setDoc] = useState<Doc | null>(null);
  const [reports, setReports] = useState<Rep[]>([]);
  const [enrichment, setEnrichment] = useState<ReportEnrichment | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [removeError, setRemoveError] = useState(false);
  const [confirmed, setConfirmed] = useState<string[]>([]);
  const [highlight, setHighlight] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);
  const chosenService = "essenziale" as const;
  const [quote, setQuote] = useState<Quote | null>(null);
  const [pdfState, setPdfState] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [view, setView] = useState<"auto" | "verify">("auto");
  const headingRef = useRef<HTMLHeadingElement>(null);
  const topRef = useRef<HTMLDivElement>(null);
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

  const [docOpen, setDocOpen] = useState(false);
  // «Pag., riga» apre il documento originale (se era chiuso) e porta alla riga.
  const reveal = (line: number) => {
    setDocOpen(true);
    requestAnimationFrame(() => revealFacsimileLine(setHighlight, line));
  };
  // Ogni passo si apre dal suo inizio: si riporta in vista la cima del percorso e si sposta il fuoco sul titolo.
  // (Prima il fuoco si spostava senza scorrere: su telefono, dopo «Salva», restava in vista il piè di pagina.)
  const focusHeading = () =>
    requestAnimationFrame(() => {
      topRef.current?.scrollIntoView({ block: "start" });
      headingRef.current?.focus({ preventScroll: true });
    });

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
    setRemoveError(false);
    try {
      await api(`/api/v1/area/documents/${documentId}`, { method: "DELETE" });
    } catch {
      setRemoveError(true);
      return;
    }
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
        <div className="flex min-w-0 flex-wrap items-center justify-end gap-3">
          <StatusChip status={activeReport ? activeReport.status : doc.status} />
          <ConfirmButton className="danger-link" question="Eliminare il referto e i suoi report? Non si può annullare." yes="Sì, elimina" onConfirm={() => void remove()}>
            <Trash2 aria-hidden className="h-[1.125rem] w-[1.125rem]" /> Elimina
          </ConfirmButton>
        </div>
      </div>
      {removeError ? (
        <p role="alert" className="field-error mb-6">
          Non siamo riusciti a eliminare il referto. Riprova tra poco.
        </p>
      ) : null}
      {/* A report pronto il percorso è finito: l'indicatore lascia il posto al colpo d'occhio, che così sta nella prima schermata. */}
      {/* Punto di arrivo dello scorrimento a ogni passo: indicatore e titolo, senza la riga «Tutti i referti». */}
      <div ref={topRef} className="scroll-mt-24" />
      {phase !== "report" ? <Stepper steps={WORKFLOW_STEPS} step={step} label="Avanzamento del referto" /> : null}

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
        <section className="mt-7 sm:mt-10" aria-labelledby="step-titolo">
          <div className="max-w-2xl">
            <h1 id="step-titolo" ref={headingRef} tabIndex={-1} className="area-title outline-none">
              Controlla prima i valori.
            </h1>
            <p className="area-lead mt-3 sm:mt-4">Conferma le righe corrette: spiegheremo solo quelle.</p>
            <p className="meta mt-1.5">
              {doc.title} · {extracted.laboratoryName} · {formatDate(extracted.reportDate)}
            </p>
          </div>
          <div className="mt-6 grid sm:mt-8 gap-8 lg:grid-cols-2 lg:items-start lg:gap-10 [&>*]:min-w-0">
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
          {/* Su telefono e tablet il comando resta attaccato al fondo dello schermo, sopra la barra dell'area: non serve scorrere tutta la lista per trovarlo. */}
          <div className="step-bar mt-8 lg:mt-10 lg:flex lg:flex-col lg:items-end lg:gap-2 lg:border-t lg:border-line lg:pt-6">
            <button type="button" className="btn btn-primary btn-lg max-lg:w-full max-sm:px-4" disabled={confirmed.length === 0 || busy} onClick={saveVerification} aria-describedby="hint-conferma">
              {busy ? <Loader2 aria-hidden className="h-5 w-5 animate-spin" /> : null}
              Salva e scegli il servizio <ArrowRight aria-hidden className="btn-arrow h-5 w-5" />
            </button>
            <p id="hint-conferma" className="text-center text-base text-muted max-lg:mt-1.5 lg:text-right">
              {confirmed.length === 0 ? "Conferma almeno un valore per continuare." : `${confirmed.length} di ${extracted.observations.filter(isReadableObs).length} valori leggibili confermati.`}
            </p>
          </div>
        </section>
      ) : null}

      {phase === "service" ? (
        <section className="mt-7 tone-capisci sm:mt-10" aria-labelledby="step-titolo">
          <h1 id="step-titolo" ref={headingRef} tabIndex={-1} className="area-title max-w-2xl outline-none">
            Rendi chiaro il tuo referto.
          </h1>
          <div className="mt-5 grid gap-6 sm:mt-8 lg:grid-cols-[minmax(0,42rem)_minmax(0,1fr)] lg:items-start lg:gap-10">
            {/* Prezzo e comando per primi: su telefono stanno nella prima schermata. Il dettaglio di che cosa si riceve viene dopo. */}
            <div className="form-card form-card-accent" data-testid="capisci-offerta">
              <p className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <span className="form-card-title">{CAPISCI.name}</span>
                <span className="flex items-baseline gap-2">
                  {quote?.first ? <span className="tone-text text-base font-bold">Primo referto</span> : null}
                  <span className="stat-num text-[2.25rem] leading-none text-ink" data-testid="prezzo-capisci">{quote ? quote.amount : "…"}</span>
                </span>
              </p>
              <button type="button" className="btn btn-primary btn-lg mt-4 w-full max-sm:px-4" onClick={proceedToPayment} disabled={busy || !quote} aria-describedby="nota-pagamento">
                {busy ? <Loader2 aria-hidden className="h-5 w-5 animate-spin" /> : null}
                Paga {quote?.amount ?? ""} e ricevi il report <ArrowRight aria-hidden className="btn-arrow h-5 w-5" />
              </button>
              <p id="nota-pagamento" className="mt-3 text-center text-base text-muted">
                Versione di prova: nessun addebito reale.{quote?.first ? ` Dal secondo referto ${quote.standard}.` : ""}
              </p>
              {error ? (
                <p role="alert" className="field-error mt-4">
                  {error}
                </p>
              ) : null}
              <p className="mt-5 border-t border-line pt-4 text-[1.0625rem] text-ink-soft">Valori confermati. Dopo il pagamento il report è pronto di norma in pochi minuti.</p>
              <p className="mt-4 font-bold text-ink">Che cosa ricevi</p>
              <ul className="check-list mt-3">
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
                <li>Arrivi subito al report: la pagina si aggiorna da sola.</li>
                <li>Lo leggi qui e scarichi il PDF da portare in visita.</li>
                <li>Se vuoi parlarne con un medico, parti dal report: il documento è già caricato.</li>
              </ol>
            </aside>
          </div>
          <div className="mt-8 border-t border-line pt-5">
            <button type="button" className="btn btn-ghost max-sm:w-full" onClick={reopenVerification}>
              <ArrowLeft aria-hidden className="h-5 w-5" /> Torna al controllo valori
            </button>
          </div>
        </section>
      ) : null}

      {phase === "processing" ? (
        <section className="mt-10" aria-labelledby="step-titolo" aria-busy="true">
          <h1 id="step-titolo" ref={headingRef} tabIndex={-1} className="area-title outline-none">
            Prepariamo il report.
          </h1>
          {paidNote !== "none" ? (
            <p className="paid-note" role="status" data-testid="pagamento-registrato">
              <CheckCircle2 aria-hidden className="h-5 w-5 shrink-0" /> {paidNote === "prova" ? "Pagamento di prova registrato." : "Pagamento registrato."}
            </p>
          ) : null}
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
        <section className="flex flex-col" aria-labelledby="step-titolo">
          <h1 id="step-titolo" ref={headingRef} tabIndex={-1} className="area-title max-w-2xl outline-none">
            Il tuo referto, in parole semplici.
          </h1>
          {paidNote !== "none" ? (
            <p className="paid-note" role="status" data-testid="pagamento-registrato">
              <CheckCircle2 aria-hidden className="h-5 w-5 shrink-0" /> {paidNote === "prova" ? "Pagamento di prova registrato." : "Pagamento registrato."}
            </p>
          ) : null}
          {/* Su telefono la riga dei dati del documento va in fondo: prima il colpo d'occhio. */}
          <p className="meta mt-2 max-sm:order-last max-sm:mt-6">
            {doc.title} · Capisci il tuo referto · generato il {readyReport.generatedAt ? formatDate(readyReport.generatedAt) : ""}
          </p>
          {/* Su schermi larghi il documento resta in vista mentre si legge: è l'ultimo blocco della colonna e si ferma in alto. */}
          <div className="mt-5 grid gap-8 sm:mt-8 xl:grid-cols-[minmax(0,1fr)_minmax(0,34rem)] xl:gap-10 [&>*]:min-w-0">
            <ExplanationView explanation={readyReport.explanation} onReveal={reveal} enrichment={enrichment} />
            <aside className="flex flex-col gap-5" aria-label="Documento e download">
              <div id="scarica-riepilogo" className="form-card form-card-accent scroll-mt-28">
                <h2 className="form-card-title">Il foglio per il medico</h2>
                <p className="form-card-text">
                  Da stampare: valori, posizione e domande in prima pagina{extracted.isSynthetic ? ". Marcato DEMO" : ""}.
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
                {/* Sotto i 1280 px il documento originale si apre a richiesta (o toccando «Pag., riga» in una voce): la pagina resta corta. */}
                <button type="button" className="btn btn-secondary w-full xl:hidden" aria-expanded={docOpen} aria-controls="documento-originale" onClick={() => setDocOpen((v) => !v)}>
                  <FileText aria-hidden className="h-5 w-5" /> {docOpen ? "Nascondi il documento originale" : "Mostra il documento originale"}
                </button>
                <div id="documento-originale" className={docOpen ? undefined : "max-xl:hidden"}>
                  <Facsimile doc={extracted} highlightLine={highlight} compact />
                </div>
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
