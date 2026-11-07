"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, PenLine } from "lucide-react";
import { api, formatDateTime } from "@/components/area/api";
import { CaseChip, CaseDocument, SimulationNotice, type CaseRow } from "@/components/area/cases";
import type { ExtractedDocument } from "@/domain/extraction/schema";

type Physician = { id: string; fullName: string; specialty: string; status: string; registrationRef: string | null };

/** Portale medico: i casi assegnati e il profilo. Tutto è già protetto da ruolo + 2FA nelle API. */
export function PhysicianDashboard() {
  const [data, setData] = useState<{ cases: CaseRow[]; physician: Physician } | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    api<{ cases: CaseRow[]; physician: Physician }>("/api/v1/medico/casi").then(setData).catch((e) => setError(e.message));
  }, []);
  if (error) return <p role="alert" className="text-danger">{error}</p>;
  if (!data) return <div className="h-48 animate-pulse rounded-2xl bg-mist" aria-busy="true" />;
  const open = data.cases.filter((c) => ["submitted", "accepted"].includes(c.status));
  const done = data.cases.filter((c) => !["submitted", "accepted"].includes(c.status));
  return (
    <div className="space-y-8">
      <div>
        <p className="eyebrow">Portale medico</p>
        <h1 className="display mt-2 text-[2rem] sm:text-[2.5rem]">{data.physician.fullName}</h1>
        <p className="mt-2 text-muted">{data.physician.specialty} · iscrizione: {data.physician.registrationRef ?? "da verificare"}</p>
      </div>
      <SimulationNotice />
      <CaseList title="Da gestire" cases={open} empty="Nessun caso in attesa." />
      <CaseList title="Conclusi" cases={done} empty="Nessun caso concluso." />
    </div>
  );
}

function CaseList({ title, cases, empty }: { title: string; cases: CaseRow[]; empty: string }) {
  return (
    <section aria-label={title}>
      <h2 className="font-serif text-2xl text-ink">{title}</h2>
      {cases.length === 0 ? <p className="mt-3 text-muted">{empty}</p> : null}
      <ul className="mt-4 grid gap-3 md:grid-cols-2">
        {cases.map((c) => (
          <li key={c.id} className="card p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-ink">{c.specialty}</p>
                <p className="mt-1 text-sm text-muted">{formatDateTime(c.createdAt)}</p>
              </div>
              <CaseChip status={c.status} />
            </div>
            <p className="mt-3 line-clamp-2 text-[0.9375rem] text-ink-soft">{c.question}</p>
            <Link href={`/medico/casi/${c.id}`} className="btn btn-secondary mt-4 min-h-11 text-sm">Apri il caso</Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

const EVENT: Record<string, string> = { submitted: "Richiesta inviata", assigned: "Assegnata", accepted: "Presa in carico", declined: "Rifiutata", answered: "Parere firmato", closed: "Chiusa dalla persona" };

export function PhysicianCase({ caseId }: { caseId: string }) {
  const [data, setData] = useState<{ case: CaseRow; events: { id: string; kind: string; detail: string | null; createdAt: string }[]; document: { title: string; extracted: ExtractedDocument | null } | null } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [answer, setAnswer] = useState("");
  const [reason, setReason] = useState("");
  const [confirm, setConfirm] = useState(false);
  const [busy, setBusy] = useState(false);
  const load = () => api<typeof data>(`/api/v1/medico/casi/${caseId}`).then(setData).catch((e) => setError(e.message));
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- carica una volta per caso
  }, [caseId]);
  async function act(body: unknown) {
    setBusy(true);
    setError(null);
    try {
      await api(`/api/v1/medico/casi/${caseId}`, { method: "POST", body });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Errore");
    } finally {
      setBusy(false);
    }
  }
  if (error && !data) return <p role="alert" className="text-danger">{error}</p>;
  if (!data) return <div className="h-64 animate-pulse rounded-2xl bg-mist" aria-busy="true" />;
  const c = data.case;
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/medico" className="link text-sm">← Tutti i casi</Link>
        <CaseChip status={c.status} />
      </div>
      <div>
        <h1 className="display text-[2rem] sm:text-[2.5rem]">Caso · {c.specialty}</h1>
        <p className="mt-2 text-muted">Ricevuto il {formatDateTime(c.createdAt)} · l&apos;accesso al referto viene registrato.</p>
      </div>
      {c.isSimulated ? <SimulationNotice /> : null}
      <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
        <div className="space-y-6">
          <section className="card p-6" aria-labelledby="m-domanda">
            <h2 id="m-domanda" className="text-lg font-semibold text-ink">Domanda della persona</h2>
            <p className="mt-3 whitespace-pre-wrap text-ink-soft">{c.question}</p>
          </section>
          {error ? <p role="alert" className="rounded-xl border border-danger/30 bg-paper px-4 py-3 text-sm text-danger">{error}</p> : null}
          {c.status === "submitted" ? (
            <section className="card p-6" aria-labelledby="m-presa">
              <h2 id="m-presa" className="text-lg font-semibold text-ink">Prendere in carico?</h2>
              <p className="mt-2 text-sm text-muted">Se il caso non è adatto a una consulenza a distanza, rifiuta e spiega perché: la persona non pagherà nulla.</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <button type="button" disabled={busy} onClick={() => act({ kind: "accept" })} className="btn btn-primary">Prendo in carico</button>
              </div>
              <form
                className="mt-5"
                onSubmit={(e) => {
                  e.preventDefault();
                  act({ kind: "decline", reason });
                }}
              >
                <label htmlFor="m-motivo" className="text-sm font-semibold text-ink">Motivo del rifiuto (min 10 caratteri)</label>
                <textarea id="m-motivo" value={reason} onChange={(e) => setReason(e.target.value)} minLength={10} maxLength={600} rows={3} required className="mt-2 w-full rounded-xl border border-line bg-paper px-4 py-3 text-ink" />
                <button type="submit" disabled={busy} className="btn btn-secondary mt-3">Rifiuta il caso</button>
              </form>
            </section>
          ) : null}
          {c.status === "accepted" ? (
            <form
              className="card p-6"
              onSubmit={(e) => {
                e.preventDefault();
                act({ kind: "answer", answer, confirmResponsibility: confirm });
              }}
            >
              <h2 className="text-lg font-semibold text-ink">Scrivi il parere</h2>
              <p className="mt-2 text-sm text-muted">Minimo 80 caratteri. Il testo viene firmato con data, ora e impronta: dopo la firma non è modificabile.</p>
              <label htmlFor="m-parere" className="sr-only">Testo del parere</label>
              <textarea id="m-parere" value={answer} onChange={(e) => setAnswer(e.target.value)} minLength={80} maxLength={8000} rows={10} required className="mt-3 w-full rounded-xl border border-line bg-paper px-4 py-3 text-ink" />
              <label className="mt-4 flex items-start gap-3 text-[0.9375rem] text-ink-soft">
                <input type="checkbox" checked={confirm} onChange={(e) => setConfirm(e.target.checked)} required className="mt-1 h-5 w-5 rounded border-line" />
                <span>Confermo che questo parere è scritto da me, sulla base dei documenti forniti, sotto la mia responsabilità professionale.</span>
              </label>
              <button type="submit" disabled={busy || !confirm} className="btn btn-primary mt-5">
                {busy ? <Loader2 aria-hidden className="h-4 w-4 animate-spin" /> : <PenLine aria-hidden className="h-4 w-4" />} Firma e invia il parere
              </button>
            </form>
          ) : null}
          {c.answer ? (
            <section className="card border-sage/40 p-6" aria-labelledby="m-firmato">
              <h2 id="m-firmato" className="text-lg font-semibold text-ink">Parere firmato</h2>
              <p className="mt-3 whitespace-pre-wrap text-ink">{c.answer}</p>
              <p className="mt-3 text-sm text-muted">{c.answeredAt ? formatDateTime(c.answeredAt) : ""} · impronta <span className="tabular font-mono">{c.answerHash?.slice(0, 12)}</span></p>
            </section>
          ) : null}
          {c.declineReason ? <p className="text-muted">Rifiutato: {c.declineReason}</p> : null}
        </div>
        <aside aria-label="Referto della persona" className="space-y-3">
          <h2 className="text-lg font-semibold text-ink">{data.document?.title ?? "Referto"}</h2>
          <CaseDocument document={data.document} />
        </aside>
      </div>
      <section aria-labelledby="m-storico">
        <h2 id="m-storico" className="text-lg font-semibold text-ink">Storico</h2>
        <ol className="mt-3 space-y-2 text-sm text-muted">
          {data.events.map((e) => (
            <li key={e.id}><span className="tabular">{formatDateTime(e.createdAt)}</span> · <span className="text-ink">{EVENT[e.kind] ?? e.kind}</span>{e.detail ? ` — ${e.detail}` : ""}</li>
          ))}
        </ol>
      </section>
    </div>
  );
}
