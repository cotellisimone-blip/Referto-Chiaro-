"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarClock, Loader2, PenLine, Video } from "lucide-react";
import { api, formatDateTime } from "@/components/area/api";
import { AppointmentChip, type AppointmentRow } from "@/components/area/appointments";
import { CaseDocument } from "@/components/area/cases";
import type { ExtractedDocument } from "@/domain/extraction/schema";

export type PhysicianAppointmentRow = AppointmentRow;

const WINDOW: Record<string, string> = { mattina: "mattina (9–13)", pomeriggio: "pomeriggio (14–18)", sera: "sera (18–20)" };
const dayLabel = (d: string) => new Intl.DateTimeFormat("it-IT", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" }).format(new Date(d + "T00:00:00Z"));

/** Videoconsulti pagati e assegnati al medico. */
export function AppointmentList({ appointments }: { appointments: PhysicianAppointmentRow[] }) {
  const open = appointments.filter((a) => ["requested", "confirmed"].includes(a.status));
  return (
    <section aria-label="Videoconsulti">
      <h2 className="font-serif text-2xl text-ink">Videoconsulti</h2>
      {open.length === 0 ? <p className="mt-3 text-muted">Nessun videoconsulto da gestire.</p> : null}
      <ul className="mt-4 grid gap-3 md:grid-cols-2">
        {open.map((a) => (
          <li key={a.id} className="card p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-ink">{a.specialty}</p>
                <p className="mt-1 text-sm text-muted">{a.scheduledAt ? formatDateTime(a.scheduledAt) : `Richiesto il ${formatDateTime(a.createdAt)}`}</p>
              </div>
              <AppointmentChip a={a} />
            </div>
            <p className="mt-3 line-clamp-2 text-[0.9375rem] text-ink-soft">{a.reason}</p>
            <Link href={`/medico/appuntamenti/${a.id}`} className="btn btn-secondary mt-4 min-h-11 text-sm">
              Apri il videoconsulto
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** Il medico conferma data e collegamento, legge i documenti condivisi, firma il riepilogo. */
export function PhysicianAppointment({ id }: { id: string }) {
  const [data, setData] = useState<{ appointment: AppointmentRow; documents: { id: string; title: string; extracted: ExtractedDocument | null }[] } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [when, setWhen] = useState("");
  const [url, setUrl] = useState("https://");
  const [reason, setReason] = useState("");
  const [summary, setSummary] = useState("");
  const [confirm, setConfirm] = useState(false);
  const load = () => api<NonNullable<typeof data>>(`/api/v1/medico/appuntamenti/${id}`).then(setData).catch((e) => setError(e.message));
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- carica una volta per appuntamento
  }, [id]);
  async function act(body: unknown) {
    setBusy(true);
    setError(null);
    try {
      await api(`/api/v1/medico/appuntamenti/${id}`, { method: "POST", body });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Errore");
    } finally {
      setBusy(false);
    }
  }
  if (error && !data) return <p role="alert" className="text-danger">{error}</p>;
  if (!data) return <div className="h-64 animate-pulse rounded-2xl bg-mist" aria-busy="true" />;
  const a = data.appointment;
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/medico" className="link text-sm">
          ← Portale medico
        </Link>
        <AppointmentChip a={a} />
      </div>
      <div>
        <h1 className="display text-[2rem] sm:text-[2.5rem]">Videoconsulto · {a.specialty}</h1>
        <p className="mt-2 text-muted">Richiesto il {formatDateTime(a.createdAt)} · l&apos;accesso ai documenti viene registrato.</p>
      </div>
      <div className="grid gap-8 lg:grid-cols-2">
        <div className="space-y-6">
          <section className="card p-6" aria-labelledby="ma-motivo">
            <h2 id="ma-motivo" className="text-lg font-semibold text-ink">
              Motivo indicato dalla persona
            </h2>
            <p className="mt-3 whitespace-pre-wrap text-ink-soft">{a.reason}</p>
            <h3 className="mt-5 text-sm font-semibold text-ink">Fasce preferite</h3>
            <ul className="mt-2 space-y-1 text-ink-soft">
              {a.preferredSlots.map((s, i) => (
                <li key={i}>
                  {dayLabel(s.day)}, {WINDOW[s.window]}
                </li>
              ))}
            </ul>
          </section>
          {error ? (
            <p role="alert" className="rounded-xl border border-danger/30 bg-paper px-4 py-3 text-sm text-danger">
              {error}
            </p>
          ) : null}
          {a.status === "requested" ? (
            <section className="card p-6" aria-labelledby="ma-conferma">
              <h2 id="ma-conferma" className="text-lg font-semibold text-ink">
                Conferma data e collegamento
              </h2>
              <form
                className="mt-4 space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  act({ kind: "confirm", scheduledAt: new Date(when).toISOString(), videoUrl: url });
                }}
              >
                <div>
                  <label htmlFor="ma-when" className="text-sm font-semibold text-ink">
                    Data e ora
                  </label>
                  <input id="ma-when" type="datetime-local" required value={when} onChange={(e) => setWhen(e.target.value)} className="mt-2 min-h-12 w-full rounded-xl border border-line bg-paper px-4 text-ink" />
                </div>
                <div>
                  <label htmlFor="ma-url" className="text-sm font-semibold text-ink">
                    Collegamento video (https)
                  </label>
                  <input id="ma-url" type="url" required value={url} onChange={(e) => setUrl(e.target.value)} className="mt-2 min-h-12 w-full rounded-xl border border-line bg-paper px-4 text-ink" />
                </div>
                <button type="submit" disabled={busy} className="btn btn-primary">
                  <CalendarClock aria-hidden className="h-4 w-4" /> Conferma l&apos;appuntamento
                </button>
              </form>
            </section>
          ) : null}
          {a.status === "confirmed" ? (
            <section className="card p-6" aria-labelledby="ma-riepilogo">
              <h2 id="ma-riepilogo" className="text-lg font-semibold text-ink">
                {a.scheduledAt ? formatDateTime(a.scheduledAt) : ""}
              </h2>
              {a.videoUrl ? (
                <a href={a.videoUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary mt-3">
                  <Video aria-hidden className="h-4 w-4" /> Apri il collegamento
                </a>
              ) : null}
              <form
                className="mt-5 space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  act({ kind: "complete", summary, confirmResponsibility: confirm });
                }}
              >
                <label htmlFor="ma-sum" className="text-sm font-semibold text-ink">
                  Riepilogo per la persona (almeno 40 caratteri)
                </label>
                <textarea id="ma-sum" value={summary} onChange={(e) => setSummary(e.target.value)} required minLength={40} maxLength={4000} rows={6} className="w-full rounded-xl border border-line bg-paper px-4 py-3 text-ink" />
                <label className="flex items-start gap-3 text-[0.9375rem] text-ink-soft">
                  <input type="checkbox" checked={confirm} onChange={(e) => setConfirm(e.target.checked)} required className="mt-1 h-5 w-5 rounded border-line" />
                  <span>Confermo di aver riletto il riepilogo e lo firmo sotto la mia responsabilità.</span>
                </label>
                <button type="submit" disabled={busy} className="btn btn-primary">
                  {busy ? <Loader2 aria-hidden className="h-4 w-4 animate-spin" /> : <PenLine aria-hidden className="h-4 w-4" />} Firma e concludi
                </button>
              </form>
            </section>
          ) : null}
          {["requested", "confirmed"].includes(a.status) ? (
            <form
              className="card p-6"
              onSubmit={(e) => {
                e.preventDefault();
                act({ kind: "decline", reason });
              }}
            >
              <label htmlFor="ma-dec" className="text-sm font-semibold text-ink">
                Non adatto a distanza? Spiega perché (il pagamento verrà restituito)
              </label>
              <textarea id="ma-dec" value={reason} onChange={(e) => setReason(e.target.value)} minLength={10} maxLength={600} rows={3} className="mt-2 w-full rounded-xl border border-line bg-paper px-4 py-3 text-ink" />
              <button type="submit" disabled={busy || reason.trim().length < 10} className="btn btn-secondary mt-3">
                Non accetto
              </button>
            </form>
          ) : null}
          {a.status === "completed" && a.summary ? (
            <section className="card p-6">
              <h2 className="text-lg font-semibold text-ink">Riepilogo firmato</h2>
              <p className="mt-3 whitespace-pre-wrap text-ink-soft">{a.summary}</p>
              <p className="mt-3 text-sm text-muted">
                Impronta <span className="font-mono">{a.summaryHash?.slice(0, 12)}</span>
              </p>
            </section>
          ) : null}
        </div>
        <section aria-labelledby="ma-docs" className="space-y-4">
          <h2 id="ma-docs" className="text-lg font-semibold text-ink">
            Documenti condivisi
          </h2>
          {data.documents.length === 0 ? <p className="text-muted">Nessun documento condiviso, o videoconsulto concluso.</p> : null}
          {data.documents.map((d) => (
            <div key={d.id}>
              <p className="mb-2 font-semibold text-ink">{d.title}</p>
              <CaseDocument document={d} />
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
