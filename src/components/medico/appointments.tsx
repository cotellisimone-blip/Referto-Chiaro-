"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, BadgeCheck, CalendarClock, FileText, Loader2, MessageSquareText, PenLine, Video } from "lucide-react";
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
      <h2 className="area-h2">Videoconsulti</h2>
      <p className="meta mt-1.5">Prenotazioni già pagate: conferma data e collegamento, poi firma il riepilogo.</p>
      {open.length === 0 ? (
        <p className="empty-note mt-4">Nessun videoconsulto da gestire.</p>
      ) : (
        <ul className="mt-5 grid gap-4 md:grid-cols-2">
          {open.map((a) => (
            <li key={a.id} className="card flex flex-col p-5 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-2">
                <div className="min-w-0">
                  <p className="text-lg font-bold leading-snug text-ink">{a.specialty}</p>
                  <p className="meta mt-1">{a.scheduledAt ? formatDateTime(a.scheduledAt) : `Richiesto il ${formatDateTime(a.createdAt)}`}</p>
                </div>
                <AppointmentChip a={a} />
              </div>
              <p className="mt-3 line-clamp-2 text-[1.0625rem] text-ink-soft">{a.reason}</p>
              <Link href={`/medico/appuntamenti/${a.id}`} className="btn btn-secondary btn-sm mt-5 self-start max-sm:w-full">
                Apri il videoconsulto <ArrowRight aria-hidden className="h-4 w-4" />
              </Link>
            </li>
          ))}
        </ul>
      )}
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
  if (error && !data) return <p role="alert" className="field-error">{error}</p>;
  if (!data) return <div className="h-64 animate-pulse rounded-[var(--radius-lg)] bg-mist" aria-busy="true" />;
  const a = data.appointment;
  // I documenti si leggono solo finché il videoconsulto è aperto: dopo, l'accesso si chiude.
  const docsOpen = ["requested", "confirmed"].includes(a.status);
  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/medico" className="back-link">
          <ArrowLeft aria-hidden /> Portale medico
        </Link>
        <AppointmentChip a={a} />
      </div>
      <header>
        <h1 className="area-title">
          <span className="whitespace-nowrap">Videoconsulto ·</span> {a.specialty}
        </h1>
        <p className="area-lead">Richiesto il {formatDateTime(a.createdAt)}. Ogni accesso ai documenti viene registrato.</p>
      </header>
      <div className="grid gap-6 lg:grid-cols-2 lg:items-start lg:gap-x-10">
        <div className="min-w-0 space-y-6">
          <section className="form-card" aria-labelledby="ma-motivo">
            <div className="form-card-head">
              <span aria-hidden className="tile-ico tile-ico-sm">
                <MessageSquareText />
              </span>
              <h2 id="ma-motivo" className="form-card-title">
                Motivo indicato dalla persona
              </h2>
            </div>
            <p className="form-card-body whitespace-pre-wrap text-ink">{a.reason}</p>
            <h3 className="area-h3 mt-6">Fasce preferite</h3>
            <ul className="dot-list mt-2 text-[1.0625rem] text-ink-soft">
              {a.preferredSlots.map((s, i) => (
                <li key={i}>
                  {dayLabel(s.day)}, {WINDOW[s.window]}
                </li>
              ))}
            </ul>
          </section>
          {error ? (
            <p role="alert" className="field-error">
              {error}
            </p>
          ) : null}
          {a.status === "requested" ? (
            <section className="form-card form-card-accent" aria-labelledby="ma-conferma">
              <h2 id="ma-conferma" className="form-card-title">
                Conferma data e collegamento
              </h2>
              <p className="form-card-text">Scegli un orario dentro le fasce indicate. La persona riceve data e collegamento appena confermi.</p>
              <form
                className="mt-5 space-y-5"
                onSubmit={(e) => {
                  e.preventDefault();
                  act({ kind: "confirm", scheduledAt: new Date(when).toISOString(), videoUrl: url });
                }}
              >
                <div>
                  <label htmlFor="ma-when" className="field-label">
                    Data e ora
                  </label>
                  <input id="ma-when" type="datetime-local" required value={when} onChange={(e) => setWhen(e.target.value)} className="field-input" />
                </div>
                <div>
                  <label htmlFor="ma-url" className="field-label">
                    Collegamento video
                    <span className="field-hint block font-normal">Deve iniziare con https://</span>
                  </label>
                  <input id="ma-url" type="url" required value={url} onChange={(e) => setUrl(e.target.value)} className="field-input" />
                </div>
                <button type="submit" disabled={busy} className="btn btn-primary btn-lg w-full sm:w-auto">
                  <CalendarClock aria-hidden className="h-5 w-5" /> Conferma l&apos;appuntamento
                </button>
              </form>
            </section>
          ) : null}
          {a.status === "confirmed" ? (
            <section className="form-card form-card-accent" aria-labelledby="ma-riepilogo">
              <p className="eyebrow eyebrow-plain">Appuntamento confermato</p>
              <h2 id="ma-riepilogo" className="form-card-title mt-2">
                {a.scheduledAt ? formatDateTime(a.scheduledAt) : ""}
              </h2>
              {a.videoUrl ? (
                <a href={a.videoUrl} target="_blank" rel="noopener noreferrer" className="btn btn-secondary mt-4 max-sm:w-full">
                  <Video aria-hidden className="h-5 w-5" /> Apri il collegamento
                </a>
              ) : null}
              <form
                className="mt-6 space-y-4 border-t border-line pt-5"
                onSubmit={(e) => {
                  e.preventDefault();
                  act({ kind: "complete", summary, confirmResponsibility: confirm });
                }}
              >
                <div>
                  <label htmlFor="ma-sum" className="field-label">
                    Riepilogo per la persona
                    <span className="field-hint block font-normal">Almeno 40 caratteri, in parole semplici: che cosa vi siete detti e il prossimo passo.</span>
                  </label>
                  <textarea id="ma-sum" value={summary} onChange={(e) => setSummary(e.target.value)} required minLength={40} maxLength={4000} rows={6} className="field-input" />
                </div>
                <label className="field-check">
                  <input type="checkbox" checked={confirm} onChange={(e) => setConfirm(e.target.checked)} required />
                  <span>Confermo di aver riletto il riepilogo e lo firmo sotto la mia responsabilità.</span>
                </label>
                <button type="submit" disabled={busy} className="btn btn-primary btn-lg w-full sm:w-auto">
                  {busy ? <Loader2 aria-hidden className="h-5 w-5 animate-spin" /> : <PenLine aria-hidden className="h-5 w-5" />} Firma e concludi
                </button>
              </form>
            </section>
          ) : null}
          {["requested", "confirmed"].includes(a.status) ? (
            <form
              className="form-card"
              onSubmit={(e) => {
                e.preventDefault();
                act({ kind: "decline", reason });
              }}
            >
              <h2 className="area-h3">Non adatto a distanza?</h2>
              <label htmlFor="ma-dec" className="field-label mt-3">
                Spiega perché
                <span className="field-hint block font-normal">Almeno 10 caratteri. La persona riceve indietro il pagamento.</span>
              </label>
              <textarea id="ma-dec" value={reason} onChange={(e) => setReason(e.target.value)} minLength={10} maxLength={600} rows={3} className="field-input" />
              <button type="submit" disabled={busy || reason.trim().length < 10} className="btn btn-secondary btn-sm mt-4 max-sm:w-full">
                Non accetto il videoconsulto
              </button>
            </form>
          ) : null}
          {a.status === "completed" && a.summary ? (
            <section className="form-card form-card-accent" aria-labelledby="ma-firmato">
              <div className="form-card-head">
                <span aria-hidden className="tile-ico tile-ico-sm">
                  <BadgeCheck />
                </span>
                <h2 id="ma-firmato" className="form-card-title">
                  Riepilogo firmato
                </h2>
              </div>
              <p className="form-card-body whitespace-pre-wrap text-ink">{a.summary}</p>
              <p className="meta mt-4 border-t border-line pt-4">
                Impronta <span className="tabular font-mono">{a.summaryHash?.slice(0, 12)}</span>
              </p>
            </section>
          ) : null}
        </div>
        <section aria-labelledby="ma-docs" className="min-w-0 space-y-5">
          <h2 id="ma-docs" className="area-h2">
            Documenti condivisi
          </h2>
          {data.documents.length === 0 ? (
            <p className="empty-note">{docsOpen ? "La persona non ha condiviso documenti per questo videoconsulto." : "I documenti non sono più consultabili: l'accesso si chiude quando il videoconsulto è concluso."}</p>
          ) : null}
          {data.documents.map((d) => (
            <div key={d.id}>
              <p className="area-h3 mb-3 flex items-center gap-2">
                <FileText aria-hidden className="h-5 w-5 shrink-0 text-teal" /> {d.title}
              </p>
              <CaseDocument document={d} />
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}
