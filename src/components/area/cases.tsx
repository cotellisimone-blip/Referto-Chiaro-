"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2, MessageSquareText, Stethoscope } from "lucide-react";
import { api, formatDateTime } from "./api";
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
  createdAt: string;
  answeredAt: string | null;
}

export function CaseChip({ status }: { status: string }) {
  const s = CASE_STATUS[status] ?? { label: status, tone: "muted" as const };
  const tone = { muted: "bg-mist text-muted", teal: "bg-mist text-teal-deep", sage: "bg-marker-soft text-teal-deep", warn: "bg-cream text-warn", danger: "bg-danger/10 text-danger" }[s.tone];
  return <span className={`chip ${tone}`}>{s.label}</span>;
}

export function SimulationNotice() {
  return (
    <div role="note" className="rounded-2xl border border-dashed border-warn/60 bg-cream p-5">
      <p className="text-sm font-semibold text-ink">Simulazione, non un servizio medico</p>
      <p className="mt-1 text-sm text-ink-soft">
        In questa versione nessun medico reale risponde: il «medico dimostrativo» serve a mostrare il percorso su referti inventati. Il servizio vero partirà solo dopo i requisiti descritti in <Link href="/servizi/secondo-parere" className="link">Secondo parere</Link>.
      </p>
    </div>
  );
}

/** Elenco delle richieste di secondo parere e modulo per una nuova richiesta. */
export function CasesPage() {
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
      if (ready[0]) setDocumentId(ready[0].id);
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
      const r = await api<{ id: string }>("/api/v1/area/casi", { method: "POST", body: { documentId, specialty, question, acknowledgeSimulation: ack, consentToShare: share } });
      router.push(`/area-personale/secondo-parere/${r.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore");
      setBusy(false);
    }
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="display text-[2rem] sm:text-[2.5rem]">Secondo parere</h1>
        <p className="mt-2 text-muted">Una domanda specifica su un referto, a un medico della specialità indicata. Il prezzo reale sarà sempre comunicato prima; in questa versione non c&apos;è alcun addebito.</p>
      </div>
      <SimulationNotice />
      <section aria-labelledby="richieste-titolo">
        <h2 id="richieste-titolo" className="font-serif text-2xl text-ink">Le tue richieste</h2>
        {error ? <p role="alert" className="mt-3 text-danger">{error}</p> : null}
        {cases && cases.length === 0 ? <p className="mt-3 text-muted">Nessuna richiesta finora.</p> : null}
        <ul className="mt-4 grid gap-3 md:grid-cols-2" aria-label="Richieste di secondo parere">
          {(cases ?? []).map((c) => (
            <li key={c.id} className="card p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-ink">{c.specialty}</p>
                  <p className="mt-1 text-sm text-muted">{formatDateTime(c.createdAt)}</p>
                </div>
                <CaseChip status={c.status} />
              </div>
              <p className="mt-3 line-clamp-2 text-[0.9375rem] text-ink-soft">{c.question}</p>
              <Link href={`/area-personale/secondo-parere/${c.id}`} className="btn btn-secondary mt-4 min-h-11 text-sm">
                Apri <ArrowRight aria-hidden className="h-4 w-4" />
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <section aria-labelledby="nuova-titolo" className="card p-6 sm:p-8">
        <h2 id="nuova-titolo" className="font-serif text-2xl text-ink">Nuova richiesta</h2>
        {docs.length === 0 ? (
          <p className="mt-3 text-muted">
            Serve un referto con i valori confermati. <Link href="/area-personale/nuovo" className="link">Aggiungi un referto di esempio</Link>.
          </p>
        ) : (
          <form onSubmit={submit} className="mt-5 space-y-5">
            <div>
              <label htmlFor="caso-doc" className="text-sm font-semibold text-ink">Referto</label>
              <select id="caso-doc" value={documentId} onChange={(e) => setDocumentId(e.target.value)} className="mt-2 min-h-12 w-full rounded-xl border border-line bg-paper px-4 text-ink">
                {docs.map((d) => (
                  <option key={d.id} value={d.id}>{d.title}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="caso-spec" className="text-sm font-semibold text-ink">Specialità</label>
              <select id="caso-spec" value={specialty} onChange={(e) => setSpecialty(e.target.value)} className="mt-2 min-h-12 w-full rounded-xl border border-line bg-paper px-4 text-ink">
                {specialties.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="caso-q" className="text-sm font-semibold text-ink">La tua domanda (da 20 a 500 caratteri)</label>
              <textarea id="caso-q" value={question} onChange={(e) => setQuestion(e.target.value)} required minLength={20} maxLength={500} rows={5} className="mt-2 w-full rounded-xl border border-line bg-paper px-4 py-3 text-ink" placeholder="Esempio: alcuni valori sono fuori dall'intervallo stampato; vorrei capire quali approfondimenti chiedere al mio medico." />
              <p className="mt-1 text-xs text-muted">Non inserire dati di persone reali: questa è una simulazione. Con l&apos;account demo condiviso la domanda è visibile a chiunque usi il medico dimostrativo.</p>
            </div>
            <label className="flex items-start gap-3 text-[0.9375rem] text-ink-soft">
              <input type="checkbox" checked={ack} onChange={(e) => setAck(e.target.checked)} required className="mt-1 h-5 w-5 rounded border-line" />
              <span>Ho capito che questa è una simulazione: nessun medico reale leggerà la richiesta e la risposta non ha valore clinico.</span>
            </label>
            <label className="flex items-start gap-3 text-[0.9375rem] text-ink-soft">
              <input type="checkbox" checked={share} onChange={(e) => setShare(e.target.checked)} required className="mt-1 h-5 w-5 rounded border-line" />
              <span>Acconsento a condividere questo referto e la mia domanda con il medico assegnato, solo per rispondere alla richiesta.</span>
            </label>
            {error ? <p role="alert" className="rounded-xl border border-danger/30 bg-paper px-4 py-3 text-sm text-danger">{error}</p> : null}
            <button type="submit" disabled={busy} className="btn btn-primary">
              {busy ? <Loader2 aria-hidden className="h-4 w-4 animate-spin" /> : <Stethoscope aria-hidden className="h-4 w-4" />} Invia la richiesta
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
        if (r && ["submitted", "accepted"].includes(r.case.status)) timer = setTimeout(load, 5000);
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
  const EVENT: Record<string, string> = { submitted: "Richiesta inviata", assigned: "Assegnata a un medico", accepted: "Presa in carico", declined: "Non accettata", answered: "Parere firmato", closed: "Chiusa" };
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/area-personale/secondo-parere" className="link text-sm">← Tutte le richieste</Link>
        <CaseChip status={c.status} />
      </div>
      <div>
        <h1 className="display text-[2rem] sm:text-[2.5rem]">Richiesta di secondo parere</h1>
        <p className="mt-2 text-muted">{c.specialty} · inviata il {formatDateTime(c.createdAt)}{data.physician ? ` · ${data.physician.fullName}` : ""}</p>
      </div>
      {c.isSimulated ? <SimulationNotice /> : null}
      <section className="card p-6" aria-labelledby="domanda-titolo">
        <h2 id="domanda-titolo" className="flex items-center gap-2 text-lg font-semibold text-ink"><MessageSquareText aria-hidden className="h-5 w-5 text-teal" /> La tua domanda</h2>
        <p className="mt-3 whitespace-pre-wrap text-ink-soft">{c.question}</p>
        {c.documentId ? <Link href={`/area-personale/documenti/${c.documentId}`} className="link mt-3 inline-block text-sm">Apri il referto allegato</Link> : null}
      </section>
      {c.status === "answered" || c.status === "closed" ? (
        c.answer ? (
          <section className="card border-sage/40 p-6" aria-labelledby="parere-titolo">
            <h2 id="parere-titolo" className="text-lg font-semibold text-ink">Parere</h2>
            <p className="mt-3 whitespace-pre-wrap text-ink">{c.answer}</p>
            <p className="mt-4 text-sm text-muted">
              Firmato da {data.physician?.fullName ?? "medico"} il {c.answeredAt ? formatDateTime(c.answeredAt) : "—"} · impronta <span className="tabular font-mono">{c.answerHash?.slice(0, 12)}</span>
            </p>
          </section>
        ) : null
      ) : null}
      {c.status === "declined" ? (
        <section className="card border-warn/40 p-6" aria-labelledby="rifiuto-titolo">
          <h2 id="rifiuto-titolo" className="text-lg font-semibold text-ink">Il medico non ha accettato la richiesta</h2>
          <p className="mt-3 text-ink-soft">{c.declineReason}</p>
          <p className="mt-3 text-sm text-muted">Nessun addebito. Puoi inviare una nuova richiesta, se ha senso, con una domanda diversa.</p>
        </section>
      ) : null}
      {["submitted", "accepted"].includes(c.status) ? <p className="text-muted" aria-live="polite">In attesa del medico. Questa pagina si aggiorna da sola.</p> : null}
      <section aria-labelledby="storico-titolo">
        <h2 id="storico-titolo" className="text-lg font-semibold text-ink">Storico</h2>
        <ol className="mt-3 space-y-2 text-sm text-muted">
          {data.events.map((e) => (
            <li key={e.id}>
              <span className="tabular">{formatDateTime(e.createdAt)}</span> · <span className="text-ink">{EVENT[e.kind] ?? e.kind}</span>{e.detail ? ` — ${e.detail}` : ""}
            </li>
          ))}
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

/** Facsimile del referto per il medico (lettura sola). */
export function CaseDocument({ document }: { document: { title: string; extracted: ExtractedDocument | null } | null }) {
  if (!document?.extracted) return <p className="text-muted">Referto non disponibile.</p>;
  return <Facsimile doc={document.extracted} highlightLine={null} compact />;
}
