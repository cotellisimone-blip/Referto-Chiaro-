"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, CreditCard, Loader2, MessageSquareText, Stethoscope } from "lucide-react";
import { api, formatDateTime } from "./api";
import { SimulationCallout } from "./ui";
import { Facsimile } from "@/components/report/facsimile";
import type { ExtractedDocument } from "@/domain/extraction/schema";

export const CASE_STATUS: Record<string, { label: string; tone: "muted" | "teal" | "sage" | "warn" | "danger" }> = {
  submitted: { label: "Inviata", tone: "teal" },
  accepted: { label: "Presa in carico", tone: "teal" },
  declined: { label: "Non accettata", tone: "warn" },
  answered: { label: "Parere ricevuto", tone: "sage" },
  closed: { label: "Chiusa", tone: "muted" },
};

export interface CaseRow {
  id: string;
  documentId: string | null;
  specialty: string;
  question: string;
  status: string;
  answer: string | null;
  answerHash: string | null;
  declineReason: string | null;
  isSimulated: boolean;
  awaitingPayment: boolean;
  createdAt: string;
  answeredAt: string | null;
}

/** Va al checkout: interno (simulato) con il router, esterno (Stripe) con una navigazione piena. */
export function goToCheckout(router: ReturnType<typeof useRouter>, url: string) {
  if (url.startsWith("/")) router.push(url);
  else window.location.assign(url);
}

export function PaymentPending({ payPath, label = "Completa il pagamento" }: { payPath: string; label?: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  return (
    <section role="status" className="callout callout-warn">
      <span aria-hidden className="callout-ico">
        <CreditCard />
      </span>
      <div className="min-w-0">
        <p className="callout-title">Pagamento in sospeso</p>
        <p className="callout-text">La richiesta è pronta ma non è ancora stata inviata al medico: lo sarà appena il pagamento risulta registrato.</p>
        {error ? (
          <p role="alert" className="field-error mt-3">
            {error}
          </p>
        ) : null}
        <button
          type="button"
          className="btn btn-primary mt-4 max-sm:w-full"
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            setError(null);
            try {
              const r = await api<{ checkoutUrl: string }>(payPath, { method: "POST", body: {} });
              goToCheckout(router, r.checkoutUrl);
            } catch (e) {
              setError(e instanceof Error ? e.message : "Errore");
              setBusy(false);
            }
          }}
        >
          {busy ? <Loader2 aria-hidden className="h-5 w-5 animate-spin" /> : null} {label}
        </button>
      </div>
    </section>
  );
}

export function CaseChip({ status, awaitingPayment = false }: { status: string; awaitingPayment?: boolean }) {
  const s = awaitingPayment && status === "submitted" ? { label: "Da pagare", tone: "warn" as const } : CASE_STATUS[status] ?? { label: status, tone: "muted" as const };
  const tone = { muted: "bg-mist text-muted", teal: "bg-mist text-teal-deep", sage: "bg-marker-soft text-teal-deep", warn: "bg-cream text-warn", danger: "bg-danger/10 text-danger" }[s.tone];
  return <span className={`chip ${tone}`}>{s.label}</span>;
}

export function SimulationNotice() {
  return (
    <SimulationCallout>
      In questa versione nessun medico reale risponde: il «medico dimostrativo» serve a mostrare il percorso su referti inventati. Il servizio vero partirà solo dopo i requisiti descritti in <Link href="/servizi/secondo-parere" className="link">Secondo parere</Link>.
    </SimulationCallout>
  );
}

/** Elenco delle richieste di secondo parere e modulo per una nuova richiesta. */
export function CasesPage({ price }: { price?: string | null }) {
  const router = useRouter();
  const [cases, setCases] = useState<CaseRow[] | null>(null);
  const [docs, setDocs] = useState<{ id: string; title: string; status: string }[]>([]);
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [documentId, setDocumentId] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [question, setQuestion] = useState("");
  const [ack, setAck] = useState(false);
  const [share, setShare] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api<{ cases: CaseRow[] }>("/api/v1/area/casi").then((r) => setCases(r.cases)).catch((e) => setError(e.message));
    api<{ documents: { id: string; title: string; status: string }[] }>("/api/v1/area/documents").then((r) => {
      const ready = r.documents.filter((d) => ["verified", "ready"].includes(d.status));
      setDocs(ready);
      // Arrivi dal report? Quel documento è già scelto: non va ricaricato.
      const pre = new URLSearchParams(window.location.search).get("documento");
      const fromReport = pre && ready.some((d) => d.id === pre) ? pre : null;
      if (fromReport ?? ready[0]) setDocumentId((fromReport ?? ready[0].id) as string);
      if (fromReport) document.getElementById("nuova-titolo")?.scrollIntoView({ block: "start" });
    });
    api<{ specialties: string[] }>("/api/v1/area/medici").then((r) => {
      setSpecialties(r.specialties);
      if (r.specialties[0]) setSpecialty(r.specialties[0]);
    });
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const r = await api<{ id: string; checkoutUrl: string | null }>("/api/v1/area/casi", { method: "POST", body: { documentId, specialty, question, acknowledgeSimulation: ack, consentToShare: share } });
      if (r.checkoutUrl) goToCheckout(router, r.checkoutUrl);
      else router.push(`/area-personale/secondo-parere/${r.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore");
      setBusy(false);
    }
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="area-title">I miei pareri</h1>
        <p className="area-lead">Una domanda precisa sui tuoi documenti, a uno specialista della disciplina appropriata, che può chiederti altri documenti o dirti che serve una visita. Vedi il prezzo prima di confermare; in questa versione il pagamento è simulato e non c&apos;è alcun addebito.</p>
      </div>
      <SimulationNotice />
      <section aria-labelledby="richieste-titolo">
        <h2 id="richieste-titolo" className="area-h2">Le tue richieste</h2>
        {error ? <p role="alert" className="field-error mt-3">{error}</p> : null}
        {cases && cases.length === 0 ? <p className="mt-3 text-[1.0625rem] text-muted">Nessuna richiesta finora.</p> : null}
        <ul className="mt-4 grid gap-4 md:grid-cols-2" aria-label="Richieste di secondo parere">
          {(cases ?? []).map((c) => (
            <li key={c.id} className="card flex flex-col p-5 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-2">
                <div>
                  <p className="area-h3">{c.specialty}</p>
                  <p className="meta mt-1">{formatDateTime(c.createdAt)}</p>
                </div>
                <CaseChip status={c.status} awaitingPayment={c.awaitingPayment} />
              </div>
              <p className="mt-3 line-clamp-2 text-[1.0625rem] text-ink-soft">{c.question}</p>
              <div className="mt-auto pt-4">
                <Link href={`/area-personale/secondo-parere/${c.id}`} className="btn btn-secondary btn-sm">
                  Apri <ArrowRight aria-hidden className="h-4 w-4" />
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </section>
      <section aria-labelledby="nuova-titolo" className="form-card scroll-mt-28">
        <h2 id="nuova-titolo" className="form-card-title">Nuova richiesta</h2>
        {docs.length === 0 ? (
          <p className="form-card-text">
            Serve un referto con i valori confermati. <Link href="/area-personale/nuovo" className="link">Aggiungi un referto di esempio</Link>.
          </p>
        ) : (
          <form onSubmit={submit} className="mt-6 space-y-6">
            <div>
              <label htmlFor="caso-doc" className="field-label">Referto</label>
              <select id="caso-doc" value={documentId} onChange={(e) => setDocumentId(e.target.value)} className="field-input">
                {docs.map((d) => (
                  <option key={d.id} value={d.id}>{d.title}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="caso-spec" className="field-label">Specialità</label>
              <p id="caso-spec-aiuto" className="field-hint">
                Non sai quale specialista ti serve? <Link href="/area-personale/appuntamenti" className="link">Parti da un medico di medicina generale</Link>.
              </p>
              <select id="caso-spec" aria-describedby="caso-spec-aiuto" value={specialty} onChange={(e) => setSpecialty(e.target.value)} className="field-input">
                {specialties.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="caso-q" className="field-label">La tua domanda (da 20 a 500 caratteri)</label>
              <textarea id="caso-q" value={question} onChange={(e) => setQuestion(e.target.value)} required minLength={20} maxLength={500} rows={5} className="field-input" placeholder="Esempio: alcuni valori sono fuori dall'intervallo stampato; vorrei capire quali approfondimenti chiedere al mio medico." />
              <p className="field-hint">Non inserire dati di persone reali: questa è una simulazione. Con l&apos;account demo condiviso la domanda è visibile a chiunque usi il medico dimostrativo.</p>
            </div>
            <div>
              <label className="field-check">
                <input type="checkbox" checked={ack} onChange={(e) => setAck(e.target.checked)} required />
                <span>Ho capito che questa è una simulazione: nessun medico reale leggerà la richiesta e la risposta non ha valore clinico.</span>
              </label>
              <label className="field-check">
                <input type="checkbox" checked={share} onChange={(e) => setShare(e.target.checked)} required />
                <span>Acconsento a condividere questo referto e la mia domanda con il medico assegnato, solo per rispondere alla richiesta.</span>
              </label>
            </div>
            {error ? <p role="alert" className="field-error">{error}</p> : null}
            <button type="submit" disabled={busy} className="btn btn-primary btn-lg w-full sm:w-auto">
              {busy ? <Loader2 aria-hidden className="h-5 w-5 animate-spin" /> : <Stethoscope aria-hidden className="h-5 w-5" />} Continua al pagamento{price ? ` (${price})` : ""}
            </button>
          </form>
        )}
      </section>
    </div>
  );
}

/** Dettaglio di una richiesta: domanda, storico, parere firmato. */
export function CaseDetail({ caseId }: { caseId: string }) {
  const router = useRouter();
  const [data, setData] = useState<{ case: CaseRow; events: { id: string; kind: string; detail: string | null; createdAt: string }[]; physician: { fullName: string; specialty: string } | null } | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    let alive = true;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const load = async () => {
      try {
        const r = await api<typeof data>(`/api/v1/area/casi/${caseId}`);
        if (!alive) return;
        setData(r);
        if (r && ["submitted", "accepted"].includes(r.case.status) && !r.case.awaitingPayment) timer = setTimeout(load, 5000);
      } catch (e) {
        if (alive) setError(e instanceof Error ? e.message : "Errore");
      }
    };
    load();
    return () => {
      alive = false;
      if (timer) clearTimeout(timer);
    };
  }, [caseId]);
  if (error && !data) return <p role="alert" className="text-danger">{error}</p>;
  if (!data) return <div className="h-64 animate-pulse rounded-2xl bg-mist" aria-busy="true" />;
  const c = data.case;
  const EVENT: Record<string, string> = { paid: "Pagamento registrato", submitted: "Richiesta preparata", assigned: "Assegnata a un medico", accepted: "Presa in carico", declined: "Non accettata", answered: "Parere firmato", closed: "Chiusa" };
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/area-personale/secondo-parere" className="back-link">
          <ArrowLeft aria-hidden /> Tutte le richieste
        </Link>
        <CaseChip status={c.status} awaitingPayment={c.awaitingPayment} />
      </div>
      <div>
        <h1 className="area-title">Richiesta di secondo parere</h1>
        <p className="area-lead">{c.specialty} · inviata il {formatDateTime(c.createdAt)}{data.physician ? ` · ${data.physician.fullName}` : ""}</p>
      </div>
      {c.isSimulated ? <SimulationNotice /> : null}
      {c.awaitingPayment && c.status === "submitted" ? <PaymentPending payPath={`/api/v1/area/casi/${caseId}/pagamento`} /> : null}
      <section className="card p-6 sm:p-7" aria-labelledby="domanda-titolo">
        <h2 id="domanda-titolo" className="area-h2 flex items-center gap-2.5"><MessageSquareText aria-hidden className="h-6 w-6 shrink-0 text-teal" /> La tua domanda</h2>
        <p className="mt-3 whitespace-pre-wrap text-[1.0625rem] text-ink-soft">{c.question}</p>
        {c.documentId ? <Link href={`/area-personale/documenti/${c.documentId}`} className="link mt-2 inline-flex min-h-11 items-center text-[1.0625rem] font-semibold">Apri il referto allegato</Link> : null}
      </section>
      {c.status === "answered" || c.status === "closed" ? (
        c.answer ? (
          <section className="card border-sage/40 p-6 sm:p-7" aria-labelledby="parere-titolo">
            <h2 id="parere-titolo" className="area-h2">Parere</h2>
            <p className="mt-3 whitespace-pre-wrap text-lg text-ink">{c.answer}</p>
            <p className="meta mt-4 border-t border-line pt-4">
              Firmato da {data.physician?.fullName ?? "medico"} il {c.answeredAt ? formatDateTime(c.answeredAt) : "—"} · impronta <span className="tabular font-mono">{c.answerHash?.slice(0, 12)}</span>
            </p>
          </section>
        ) : null
      ) : null}
      {c.status === "declined" ? (
        <section className="card border-warn/40 p-6 sm:p-7" aria-labelledby="rifiuto-titolo">
          <h2 id="rifiuto-titolo" className="area-h2">Il medico non ha accettato la richiesta</h2>
          <p className="mt-3 text-[1.0625rem] text-ink-soft">{c.declineReason}</p>
          <p className="mt-3 text-[1.0625rem] font-semibold text-ink">Il pagamento ti viene restituito. Puoi inviare una nuova richiesta, se ha senso, con una domanda diversa.</p>
        </section>
      ) : null}
      {["submitted", "accepted"].includes(c.status) && !c.awaitingPayment ? <p className="text-[1.0625rem] text-ink-soft" aria-live="polite">In attesa del medico. Questa pagina si aggiorna da sola.</p> : null}
      <section aria-labelledby="storico-titolo" className="side-card">
        <h2 id="storico-titolo" className="side-card-title">
          Storico
        </h2>
        <ol className="timeline mt-4">
          {data.events.map((e) => {
            const label = EVENT[e.kind] ?? e.kind;
            const detail = eventDetail(label, e.detail);
            return (
              <li key={e.id}>
                <span className="timeline-when">{label}</span>
                {formatDateTime(e.createdAt)}
                {detail ? ` · ${detail}` : ""}
              </li>
            );
          })}
        </ol>
      </section>
      {["answered", "declined"].includes(c.status) ? (
        <button
          type="button"
          className="btn btn-secondary"
          onClick={async () => {
            await api(`/api/v1/area/casi/${caseId}`, { method: "POST", body: {} });
            router.refresh();
            setData({ ...data, case: { ...c, status: "closed" } });
          }}
        >
          Chiudi la richiesta
        </button>
      ) : null}
    </div>
  );
}

/** Il dettaglio di un passo ripete spesso il nome del passo («Pagamento registrato: …»): si mostra senza il doppione. */
export function eventDetail(label: string, detail: string | null): string {
  if (!detail) return "";
  const rest = detail.startsWith(`${label}: `) ? detail.slice(label.length + 2) : detail;
  return rest.charAt(0).toUpperCase() + rest.slice(1);
}

/** Facsimile del referto per il medico (lettura sola). */
export function CaseDocument({ document }: { document: { title: string; extracted: ExtractedDocument | null } | null }) {
  if (!document?.extracted) return <p className="text-muted">Referto non disponibile.</p>;
  return <Facsimile doc={document.extracted} highlightLine={null} compact />;
}
