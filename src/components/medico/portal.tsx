"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { clsx } from "clsx";
import { ArrowLeft, ArrowRight, BadgeCheck, FileText, Loader2, Lock, MessageSquareText, PenLine } from "lucide-react";
import { api, formatDateTime } from "@/components/area/api";
import { CaseDocument, eventDetail, SimulationNotice, type CaseRow } from "@/components/area/cases";
import type { ExtractedDocument } from "@/domain/extraction/schema";
import { AppointmentList, type PhysicianAppointmentRow } from "./appointments";

type Physician = { id: string; fullName: string; specialty: string; status: string; registrationRef: string | null };

/** Lo stato del caso con le parole del medico: per la persona lo stesso caso è «Inviata», «Parere ricevuto». */
const DOCTOR_STATUS: Record<string, { label: string; cls: string }> = {
  submitted: { label: "Da prendere in carico", cls: "bg-cream text-warn" },
  accepted: { label: "In carico a te", cls: "bg-mist text-teal-deep" },
  declined: { label: "Rifiutato", cls: "bg-mist text-muted" },
  answered: { label: "Parere firmato", cls: "bg-marker-soft text-teal-deep" },
  closed: { label: "Chiuso dalla persona", cls: "bg-mist text-muted" },
};

function DoctorCaseChip({ status }: { status: string }) {
  const s = DOCTOR_STATUS[status] ?? { label: status, cls: "bg-mist text-muted" };
  return <span className={`chip shrink-0 ${s.cls}`}>{s.label}</span>;
}

/** Portale medico: i casi assegnati e il profilo. Tutto è già protetto da ruolo + 2FA nelle API. */
export function PhysicianDashboard() {
  const [data, setData] = useState<{ cases: CaseRow[]; physician: Physician } | null>(null);
  const [appointments, setAppointments] = useState<PhysicianAppointmentRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    api<{ cases: CaseRow[]; physician: Physician }>("/api/v1/medico/casi").then(setData).catch((e) => setError(e.message));
    api<{ appointments: PhysicianAppointmentRow[] }>("/api/v1/medico/appuntamenti").then((r) => setAppointments(r.appointments)).catch(() => {});
  }, []);
  if (error) return <p role="alert" className="field-error">{error}</p>;
  if (!data) return <div className="h-48 animate-pulse rounded-[var(--radius-lg)] bg-mist" aria-busy="true" />;
  const open = data.cases.filter((c) => ["submitted", "accepted"].includes(c.status));
  const done = data.cases.filter((c) => !["submitted", "accepted"].includes(c.status));
  return (
    <div className="space-y-10 sm:space-y-12">
      <header>
        <p className="eyebrow">Portale medico</p>
        <h1 className="area-title mt-3">{data.physician.fullName}</h1>
        <p className="area-lead">
          {data.physician.specialty} · iscrizione all&apos;Ordine: {data.physician.registrationRef ?? "da verificare"}
        </p>
      </header>
      <SimulationNotice />
      <CaseList title="Da gestire" lead="Secondi pareri assegnati a te: leggi il referto, poi prendi in carico o rifiuta." cases={open} empty="Nessun caso in attesa." />
      <AppointmentList appointments={appointments} />
      <CaseList title="Conclusi" cases={done} empty="Nessun caso concluso." />
      <p className="empty-note">
        Visite a domicilio, videoconsulti a fasce e secondi pareri con video e sintesi scritta si provano nel{" "}
        <Link href="/prova/medico" className="link font-bold">
          portale delle prestazioni (prova)
        </Link>
        .
      </p>
    </div>
  );
}

function CaseList({ title, lead, cases, empty }: { title: string; lead?: string; cases: CaseRow[]; empty: string }) {
  return (
    <section aria-label={title}>
      <h2 className="area-h2">{title}</h2>
      {lead ? <p className="meta mt-1.5">{lead}</p> : null}
      {cases.length === 0 ? (
        <p className="empty-note mt-4">{empty}</p>
      ) : (
        <ul className="mt-5 grid gap-4 md:grid-cols-2">
          {cases.map((c) => (
            <li key={c.id} className="card flex flex-col p-5 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-2">
                <div className="min-w-0">
                  <p className="text-lg font-bold leading-snug text-ink">{c.specialty}</p>
                  <p className="meta mt-1">Ricevuto il {formatDateTime(c.createdAt)}</p>
                </div>
                <DoctorCaseChip status={c.status} />
              </div>
              <p className="mt-3 line-clamp-2 text-[1.0625rem] text-ink-soft">{c.question}</p>
              <Link href={`/medico/casi/${c.id}`} className="btn btn-secondary btn-sm mt-5 self-start max-sm:w-full">
                Apri il caso <ArrowRight aria-hidden className="h-4 w-4" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

const EVENT: Record<string, string> = { paid: "Pagamento registrato", submitted: "Richiesta preparata", assigned: "Assegnata", accepted: "Presa in carico", declined: "Rifiutata", answered: "Parere firmato", closed: "Chiusa dalla persona" };

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
  if (error && !data) return <p role="alert" className="field-error">{error}</p>;
  if (!data) return <div className="h-64 animate-pulse rounded-[var(--radius-lg)] bg-mist" aria-busy="true" />;
  const c = data.case;
  // Il referto si legge solo finché il caso è aperto: a caso concluso l'accesso si chiude (e resta nel registro).
  const docOpen = ["submitted", "accepted"].includes(c.status);
  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/medico" className="back-link">
          <ArrowLeft aria-hidden /> Tutti i casi
        </Link>
        <DoctorCaseChip status={c.status} />
      </div>
      <header>
        <h1 className="area-title">
          <span className="whitespace-nowrap">Caso ·</span> {c.specialty}
        </h1>
        <p className="area-lead">Ricevuto il {formatDateTime(c.createdAt)}. Ogni accesso al referto viene registrato.</p>
      </header>
      {c.isSimulated ? <SimulationNotice /> : null}
      {/* Su telefono: domanda, referto, poi che cosa fare. Su computer il referto resta accanto mentre si scrive. */}
      <div className={clsx("grid gap-6", docOpen ? "lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:items-start lg:gap-x-10" : "max-w-[52rem]")}>
        <section className={clsx("form-card", docOpen && "lg:col-start-1 lg:row-start-1")} aria-labelledby="m-domanda">
          <div className="form-card-head">
            <span aria-hidden className="tile-ico tile-ico-sm">
              <MessageSquareText />
            </span>
            <h2 id="m-domanda" className="form-card-title">
              Domanda della persona
            </h2>
          </div>
          <p className="form-card-body whitespace-pre-wrap text-ink">{c.question}</p>
        </section>
        {docOpen ? (
          <aside aria-label="Referto della persona" className="min-w-0 space-y-3 lg:sticky lg:top-28 lg:col-start-2 lg:row-span-2 lg:row-start-1">
            <h2 className="area-h3 flex items-center gap-2">
              <FileText aria-hidden className="h-5 w-5 shrink-0 text-teal" /> {data.document?.title ?? "Referto"}
            </h2>
            <CaseDocument document={data.document} />
          </aside>
        ) : null}
        <div className={clsx("min-w-0 space-y-6", docOpen && "lg:col-start-1 lg:row-start-2")}>
          {error ? (
            <p role="alert" className="field-error">
              {error}
            </p>
          ) : null}
          {c.status === "submitted" ? (
            <section className="form-card form-card-accent" aria-labelledby="m-presa">
              <h2 id="m-presa" className="form-card-title">
                Prendi in carico il caso?
              </h2>
              <p className="form-card-text">Se il caso non è adatto a una consulenza a distanza, rifiutalo e spiega perché: la persona riceve indietro il pagamento.</p>
              <button type="button" disabled={busy} onClick={() => act({ kind: "accept" })} className="btn btn-primary btn-lg mt-5 w-full sm:w-auto">
                <BadgeCheck aria-hidden className="h-5 w-5" /> Prendo in carico
              </button>
              <form
                className="mt-6 border-t border-line pt-5"
                onSubmit={(e) => {
                  e.preventDefault();
                  act({ kind: "decline", reason });
                }}
              >
                <label htmlFor="m-motivo" className="field-label">
                  Motivo del rifiuto
                  <span className="field-hint block font-normal">Almeno 10 caratteri. La persona lo legge così com&apos;è.</span>
                </label>
                <textarea id="m-motivo" value={reason} onChange={(e) => setReason(e.target.value)} minLength={10} maxLength={600} rows={3} required className="field-input" />
                <button type="submit" disabled={busy} className="btn btn-secondary btn-sm mt-4 max-sm:w-full">
                  Rifiuta il caso
                </button>
              </form>
            </section>
          ) : null}
          {c.status === "accepted" ? (
            <form
              className="form-card form-card-accent"
              onSubmit={(e) => {
                e.preventDefault();
                act({ kind: "answer", answer, confirmResponsibility: confirm });
              }}
            >
              <h2 className="form-card-title">Scrivi il parere</h2>
              <p className="form-card-text">Almeno 80 caratteri. Il testo viene firmato con data, ora e impronta: dopo la firma non si può più modificare.</p>
              <label htmlFor="m-parere" className="sr-only">
                Testo del parere
              </label>
              <textarea id="m-parere" value={answer} onChange={(e) => setAnswer(e.target.value)} minLength={80} maxLength={8000} rows={10} required className="field-input mt-4" />
              <label className="field-check mt-4">
                <input type="checkbox" checked={confirm} onChange={(e) => setConfirm(e.target.checked)} required />
                <span>Confermo che questo parere è scritto da me, sulla base dei documenti forniti, sotto la mia responsabilità professionale.</span>
              </label>
              <button type="submit" disabled={busy || !confirm} className="btn btn-primary btn-lg mt-5 w-full sm:w-auto">
                {busy ? <Loader2 aria-hidden className="h-5 w-5 animate-spin" /> : <PenLine aria-hidden className="h-5 w-5" />} Firma e invia il parere
              </button>
            </form>
          ) : null}
          {c.answer ? (
            <section className="form-card form-card-accent" aria-labelledby="m-firmato">
              <div className="form-card-head">
                <span aria-hidden className="tile-ico tile-ico-sm">
                  <BadgeCheck />
                </span>
                <h2 id="m-firmato" className="form-card-title">
                  Parere firmato
                </h2>
              </div>
              <p className="form-card-body whitespace-pre-wrap text-ink">{c.answer}</p>
              <p className="meta mt-4 border-t border-line pt-4">
                {c.answeredAt ? `${formatDateTime(c.answeredAt)} · ` : ""}impronta <span className="tabular font-mono">{c.answerHash?.slice(0, 12)}</span>
              </p>
            </section>
          ) : null}
          {c.declineReason ? (
            <section className="form-card" aria-labelledby="m-rifiutato">
              <h2 id="m-rifiutato" className="form-card-title">
                Caso rifiutato
              </h2>
              <p className="form-card-text">{c.declineReason}</p>
            </section>
          ) : null}
          {!docOpen ? (
            <p className="empty-note flex items-start gap-3">
              <Lock aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-teal" />
              <span>Il referto non è più consultabile: l&apos;accesso si chiude quando il caso è concluso.</span>
            </p>
          ) : null}
        </div>
      </div>
      <section aria-labelledby="m-storico" className="side-card">
        <h2 id="m-storico" className="side-card-title">
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
    </div>
  );
}
