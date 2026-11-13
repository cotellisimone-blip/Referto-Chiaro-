"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, CalendarClock, FileText, Loader2, Plus, Trash2, Video } from "lucide-react";
import { api, formatDateTime } from "./api";
import { goToCheckout, PaymentPending } from "./cases";
import { SimulationCallout } from "./ui";

type Window = "mattina" | "pomeriggio" | "sera";

export interface AppointmentRow {
  id: string;
  specialty: string;
  reason: string;
  preferredSlots: { day: string; window: Window }[];
  documentIds: string[];
  status: "requested" | "confirmed" | "declined" | "completed" | "cancelled";
  awaitingPayment: boolean;
  scheduledAt: string | null;
  videoUrl: string | null;
  summary: string | null;
  summaryHash: string | null;
  declineReason: string | null;
  isSimulated: boolean;
  createdAt: string;
  completedAt: string | null;
}

const STATUS: Record<AppointmentRow["status"], { label: string; cls: string }> = {
  requested: { label: "In attesa di conferma", cls: "bg-mist text-teal-deep" },
  confirmed: { label: "Confermato", cls: "bg-marker-soft text-teal-deep" },
  declined: { label: "Non accettato", cls: "bg-cream text-warn" },
  completed: { label: "Concluso", cls: "bg-mist text-ink" },
  cancelled: { label: "Annullato", cls: "bg-mist text-muted" },
};

const WINDOW_LABEL: Record<Window, string> = { mattina: "mattina (9–13)", pomeriggio: "pomeriggio (14–18)", sera: "sera (18–20)" };

export function AppointmentChip({ a }: { a: Pick<AppointmentRow, "status" | "awaitingPayment"> }) {
  const s = a.awaitingPayment && a.status === "requested" ? { label: "Da pagare", cls: "bg-cream text-warn" } : STATUS[a.status];
  return <span className={`chip ${s.cls}`}>{s.label}</span>;
}

function VideoSimulationNotice() {
  return (
    <SimulationCallout>
      In questa versione nessun medico reale si collega: il «medico dimostrativo» mostra il percorso su documenti inventati e il pagamento è simulato. Il servizio vero partirà solo dopo i requisiti descritti in{" "}
      <Link href="/servizi/parla-con-un-medico" className="link">
        Parla con un medico
      </Link>
      .
    </SimulationCallout>
  );
}

const dayLabel = (d: string) => new Intl.DateTimeFormat("it-IT", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" }).format(new Date(d + "T00:00:00Z"));

function isoDay(offset: number) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toISOString().slice(0, 10);
}

/** «I miei appuntamenti»: elenco e nuova richiesta di videoconsulto. */
export function AppointmentsPage({ price }: { price: string | null }) {
  const router = useRouter();
  const [items, setItems] = useState<AppointmentRow[] | null>(null);
  const [docs, setDocs] = useState<{ id: string; title: string }[]>([]);
  const [reason, setReason] = useState("");
  const [slots, setSlots] = useState<{ day: string; window: Window }[]>([{ day: isoDay(2), window: "mattina" }]);
  const [chosen, setChosen] = useState<string[]>([]);
  const [ack, setAck] = useState(false);
  const [share, setShare] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const min = useMemo(() => isoDay(1), []);
  const max = useMemo(() => isoDay(30), []);

  useEffect(() => {
    api<{ appointments: AppointmentRow[] }>("/api/v1/area/appuntamenti").then((r) => setItems(r.appointments)).catch((e) => setError(e.message));
    api<{ documents: { id: string; title: string; status: string }[] }>("/api/v1/area/documents").then((r) => {
      const ready = r.documents.filter((d) => ["verified", "ready"].includes(d.status));
      setDocs(ready);
      // Arrivi dal report? Quel documento è già scelto: non va ricaricato.
      const pre = new URLSearchParams(window.location.search).get("documento");
      const fromReport = pre && ready.some((d) => d.id === pre) ? pre : null;
      if (fromReport) setChosen([fromReport]);
      else if (ready[0]) setChosen([ready[0].id]);
      if (fromReport) document.getElementById("nuovo-app-titolo")?.scrollIntoView({ block: "start" });
    });
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const r = await api<{ id: string; checkoutUrl: string | null }>("/api/v1/area/appuntamenti", {
        method: "POST",
        body: { reason, slots, documentIds: chosen, acknowledgeSimulation: ack, consentToShare: share },
      });
      if (r.checkoutUrl) goToCheckout(router, r.checkoutUrl);
      else router.push(`/area-personale/appuntamenti/${r.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore");
      setBusy(false);
    }
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="area-title">I miei appuntamenti</h1>
        <p className="area-lead">Videoconsulti di circa 20–25 minuti con un medico di medicina generale o internista, che legge prima i documenti che scegli. Vedi il prezzo prima di confermare.</p>
      </div>
      <VideoSimulationNotice />
      <section aria-labelledby="appuntamenti-titolo">
        <h2 id="appuntamenti-titolo" className="area-h2">
          I tuoi videoconsulti
        </h2>
        {items && items.length === 0 ? <p className="mt-3 text-[1.0625rem] text-muted">Nessun appuntamento finora.</p> : null}
        <ul className="mt-4 grid gap-4 md:grid-cols-2" aria-label="Videoconsulti">
          {(items ?? []).map((a) => (
            <li key={a.id} className="card flex flex-col p-5 sm:p-6">
              <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-2">
                <div>
                  <p className="area-h3">{a.specialty}</p>
                  <p className="meta mt-1">{a.scheduledAt ? `Il ${formatDateTime(a.scheduledAt)}` : `Richiesto il ${formatDateTime(a.createdAt)}`}</p>
                </div>
                <AppointmentChip a={a} />
              </div>
              <p className="mt-3 line-clamp-2 text-[1.0625rem] text-ink-soft">{a.reason}</p>
              <div className="mt-auto pt-4">
                <Link href={`/area-personale/appuntamenti/${a.id}`} className="btn btn-secondary btn-sm">
                  Apri <ArrowRight aria-hidden className="h-4 w-4" />
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="nuovo-app-titolo" className="form-card scroll-mt-28">
        <h2 id="nuovo-app-titolo" className="form-card-title">
          Prenota un videoconsulto
        </h2>
        <form onSubmit={submit} className="mt-5 space-y-7">
          <p className="rounded-2xl bg-mist px-5 py-4 text-[1.0625rem] text-ink">
            Parlerai con un <strong>medico di medicina generale o internista</strong>: non devi sapere quale specialista ti serve. Se serve uno specialista o una visita in presenza, te lo dice lui.
          </p>
          <div>
            <label htmlFor="app-motivo" className="field-label">
              Di che cosa vuoi parlare? (da 10 a 300 caratteri)
            </label>
            <textarea
              id="app-motivo"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              minLength={10}
              maxLength={300}
              rows={3}
              className="field-input"
              placeholder="Esempio: vorrei capire insieme al medico i valori del referto e quali domande fare al mio medico curante."
            />
            <p className="field-hint">Bastano poche parole. Non inserire dati di persone reali: questa è una simulazione.</p>
          </div>
          <fieldset>
            <legend className="field-label">Quando ti farebbe comodo? (da 1 a 3 fasce)</legend>
            <ul className="mt-2 space-y-3">
              {slots.map((sl, i) => (
                <li key={i} className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                  <label className="sr-only" htmlFor={`slot-day-${i}`}>
                    Giorno {i + 1}
                  </label>
                  <input
                    id={`slot-day-${i}`}
                    type="date"
                    min={min}
                    max={max}
                    required
                    value={sl.day}
                    onChange={(e) => setSlots(slots.map((x, j) => (j === i ? { ...x, day: e.target.value } : x)))}
                    className="field-input mt-0 sm:w-auto"
                  />
                  <label className="sr-only" htmlFor={`slot-win-${i}`}>
                    Fascia {i + 1}
                  </label>
                  <select
                    id={`slot-win-${i}`}
                    value={sl.window}
                    onChange={(e) => setSlots(slots.map((x, j) => (j === i ? { ...x, window: e.target.value as Window } : x)))}
                    className="field-input mt-0 sm:w-auto"
                  >
                    {(Object.keys(WINDOW_LABEL) as Window[]).map((w) => (
                      <option key={w} value={w}>
                        {WINDOW_LABEL[w]}
                      </option>
                    ))}
                  </select>
                  {slots.length > 1 ? (
                    <button type="button" className="btn btn-ghost btn-sm" onClick={() => setSlots(slots.filter((_, j) => j !== i))}>
                      <Trash2 aria-hidden className="h-4 w-4" /> Rimuovi
                    </button>
                  ) : null}
                </li>
              ))}
            </ul>
            {slots.length < 3 ? (
              <button type="button" className="btn btn-secondary btn-sm mt-3" onClick={() => setSlots([...slots, { day: isoDay(slots.length + 2), window: "pomeriggio" }])}>
                <Plus aria-hidden className="h-4 w-4" /> Aggiungi un&apos;altra fascia
              </button>
            ) : null}
          </fieldset>
          <fieldset>
            <legend className="field-label">Documenti da far leggere al medico</legend>
            {docs.length === 0 ? (
              <p className="field-hint">
                Nessun documento pronto. Puoi prenotare lo stesso, oppure{" "}
                <Link href="/area-personale/nuovo" className="link">
                  aggiungere un referto di esempio
                </Link>
                .
              </p>
            ) : (
              <ul className="mt-2">
                {docs.map((d) => (
                  <li key={d.id}>
                    <label className="field-check">
                      <input type="checkbox" checked={chosen.includes(d.id)} onChange={(e) => setChosen(e.target.checked ? [...chosen, d.id].slice(0, 5) : chosen.filter((x) => x !== d.id))} />
                      <span className="flex items-start gap-2">
                        <FileText aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-teal" /> {d.title}
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            )}
            <p className="field-hint">Li hai già caricati: non serve rifarlo. Il medico vede solo quelli spuntati.</p>
          </fieldset>
          <div>
            <label className="field-check">
              <input type="checkbox" checked={ack} onChange={(e) => setAck(e.target.checked)} required />
              <span>Ho capito che questa è una simulazione: nessun medico reale si collegherà e il riepilogo non ha valore clinico.</span>
            </label>
            <label className="field-check">
              <input type="checkbox" checked={share} onChange={(e) => setShare(e.target.checked)} required />
              <span>Acconsento a condividere il motivo e i documenti scelti con il medico assegnato, solo per il videoconsulto.</span>
            </label>
          </div>
          {error ? (
            <p role="alert" className="field-error">
              {error}
            </p>
          ) : null}
          <button type="submit" disabled={busy} className="btn btn-primary btn-lg w-full sm:w-auto">
            {busy ? <Loader2 aria-hidden className="h-5 w-5 animate-spin" /> : <CalendarClock aria-hidden className="h-5 w-5" />} Continua al pagamento{price ? ` (${price})` : ""}
          </button>
        </form>
      </section>
    </div>
  );
}

/** Dettaglio di un videoconsulto: stato, data e collegamento, documenti condivisi, riepilogo firmato. */
export function AppointmentDetail({ id }: { id: string }) {
  const [data, setData] = useState<{ appointment: AppointmentRow; physician: { fullName: string; specialty: string } | null; documents: { id: string; title: string }[] } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let alive = true;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const load = async () => {
      try {
        const r = await api<NonNullable<typeof data>>(`/api/v1/area/appuntamenti/${id}`);
        if (!alive) return;
        setData(r);
        if (["requested", "confirmed"].includes(r.appointment.status) && !r.appointment.awaitingPayment) timer = setTimeout(load, 5000);
      } catch (e) {
        if (alive) setError(e instanceof Error ? e.message : "Errore");
      }
    };
    load();
    return () => {
      alive = false;
      if (timer) clearTimeout(timer);
    };
  }, [id]);

  if (error && !data) return <p role="alert" className="text-danger">{error}</p>;
  if (!data) return <div className="h-64 animate-pulse rounded-2xl bg-mist" aria-busy="true" />;
  const a = data.appointment;
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link href="/area-personale/appuntamenti" className="back-link">
          <ArrowLeft aria-hidden /> Tutti gli appuntamenti
        </Link>
        <AppointmentChip a={a} />
      </div>
      <div>
        <h1 className="area-title">Videoconsulto</h1>
        <p className="area-lead">
          {a.specialty} · richiesto il {formatDateTime(a.createdAt)}
          {data.physician ? ` · ${data.physician.fullName}` : ""}
        </p>
      </div>
      {a.isSimulated ? <VideoSimulationNotice /> : null}
      {a.awaitingPayment && a.status === "requested" ? <PaymentPending payPath={`/api/v1/area/appuntamenti/${id}/pagamento`} /> : null}

      {a.status === "confirmed" && a.scheduledAt ? (
        <section className="tone-medico form-card form-card-accent" aria-labelledby="quando-titolo">
          <h2 id="quando-titolo" className="form-card-title flex items-center gap-3">
            <span aria-hidden className="tile-ico tile-ico-sm">
              <CalendarClock />
            </span>
            {formatDateTime(a.scheduledAt)}
          </h2>
          <p className="form-card-text">Il medico ha confermato. Entra qualche minuto prima, da computer o telefono.</p>
          {a.videoUrl ? (
            <a href={a.videoUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-lg mt-5 w-full sm:w-auto">
              <Video aria-hidden className="h-5 w-5" /> Entra nel videoconsulto
            </a>
          ) : null}
        </section>
      ) : null}

      {a.status === "requested" && !a.awaitingPayment ? (
        <p className="text-[1.0625rem] text-ink-soft" aria-live="polite">
          Richiesta inviata al medico: riceverai qui la conferma di data e collegamento. Questa pagina si aggiorna da sola.
        </p>
      ) : null}

      <section className="card p-6 sm:p-7" aria-labelledby="richiesta-titolo">
        <h2 id="richiesta-titolo" className="area-h2">
          La tua richiesta
        </h2>
        <p className="mt-3 whitespace-pre-wrap text-[1.0625rem] text-ink-soft">{a.reason}</p>
        <h3 className="area-h3 mt-6">Fasce indicate</h3>
        <ul className="mt-2 space-y-1 text-[1.0625rem] text-ink-soft">
          {a.preferredSlots.map((s, i) => (
            <li key={i}>
              {dayLabel(s.day)}, {WINDOW_LABEL[s.window]}
            </li>
          ))}
        </ul>
        <h3 className="area-h3 mt-6">Documenti condivisi</h3>
        {data.documents.length ? (
          <ul className="link-list mt-1">
            {data.documents.map((d) => (
              <li key={d.id}>
                <Link href={`/area-personale/documenti/${d.id}`} className="link">
                  {d.title}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-[1.0625rem] text-muted">Nessuno.</p>
        )}
      </section>

      {a.status === "completed" && a.summary ? (
        <section className="card border-sage/40 p-6 sm:p-7" aria-labelledby="riepilogo-titolo">
          <h2 id="riepilogo-titolo" className="area-h2">
            Riepilogo del medico
          </h2>
          <p className="mt-3 whitespace-pre-wrap text-lg text-ink">{a.summary}</p>
          <p className="meta mt-4 border-t border-line pt-4">
            Firmato da {data.physician?.fullName ?? "medico"} il {a.completedAt ? formatDateTime(a.completedAt) : "—"} · impronta <span className="tabular font-mono">{a.summaryHash?.slice(0, 12)}</span>
          </p>
        </section>
      ) : null}

      {a.status === "declined" ? (
        <section className="card border-warn/40 p-6 sm:p-7" aria-labelledby="rifiutato-titolo">
          <h2 id="rifiutato-titolo" className="area-h2">
            Il medico non ha potuto accettare
          </h2>
          <p className="mt-3 text-[1.0625rem] text-ink-soft">{a.declineReason}</p>
          <p className="mt-3 text-[1.0625rem] font-semibold text-ink">Il pagamento ti viene restituito.</p>
        </section>
      ) : null}

      {a.status === "requested" ? (
        <button
          type="button"
          className="btn btn-secondary"
          disabled={busy}
          onClick={async () => {
            setBusy(true);
            try {
              await api(`/api/v1/area/appuntamenti/${id}`, { method: "POST", body: {} });
              setData({ ...data, appointment: { ...a, status: "cancelled" } });
            } catch (e) {
              setError(e instanceof Error ? e.message : "Errore");
            } finally {
              setBusy(false);
            }
          }}
        >
          Annulla la richiesta
        </button>
      ) : null}
    </div>
  );
}
