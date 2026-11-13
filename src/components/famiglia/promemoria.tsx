"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { clsx } from "clsx";
import {
  ArrowRight,
  BellPlus,
  CalendarDays,
  CalendarPlus,
  Check,
  ClipboardList,
  FlaskConical,
  Loader2,
  Mail,
  RotateCcw,
  Stethoscope,
  Trash2,
} from "lucide-react";
import { api } from "@/components/area/api";
import { ConfirmButton } from "@/components/ui/confirm-button";
import { SELF_ID } from "@/domain/famiglia/persone";
import {
  TIPI,
  daysBetween,
  todayIso,
  whenLabel,
  type Promemoria,
  type TipoPromemoria,
} from "@/domain/famiglia/promemoria";
import {
  PersonaAvatar,
  personaName,
  usePersone,
  type PersonaView,
} from "./shared";

const MESI = [
  "gen",
  "feb",
  "mar",
  "apr",
  "mag",
  "giu",
  "lug",
  "ago",
  "set",
  "ott",
  "nov",
  "dic",
];
const ICONS: Record<TipoPromemoria, typeof Stethoscope> = {
  visita: Stethoscope,
  controllo: FlaskConical,
  altro: CalendarDays,
};

/** Foglietto di calendario: mese, giorno, anno. */
export function DateBlock({ iso }: { iso: string }) {
  const [y, m, d] = iso.split("-");
  return (
    <span className="rem-date" aria-hidden>
      <span className="rem-date-month">{MESI[Number(m) - 1]}</span>
      <span className="rem-date-day">{Number(d)}</span>
      <span className="rem-date-year">{y}</span>
    </span>
  );
}

/**
 * Promemoria: visite con le domande da portare, controlli da ripetere, altro. Le date le mette la persona:
 * non suggeriamo mai quando ripetere un esame. Ognuno si aggiunge al calendario del telefono.
 */
export function PromemoriaPage() {
  const params = useSearchParams();
  const { persone } = usePersone();
  const [list, setList] = useState<Promemoria[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [open, setOpen] = useState(params.get("nuovo") !== null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    api<{ promemoria: Promemoria[] }>("/api/v1/area/promemoria")
      .then((r) => setList(r.promemoria))
      .catch((e) => setError(e instanceof Error ? e.message : "Errore"));
  }, [tick]);

  const today = todayIso();
  const openList = useMemo(() => list?.filter((r) => !r.doneAt) ?? [], [list]);
  const doneList = useMemo(() => list?.filter((r) => r.doneAt) ?? [], [list]);
  const reload = () => setTick((x) => x + 1);

  async function patch(id: string, body: unknown) {
    await api(`/api/v1/area/promemoria/${id}`, { method: "PATCH", body });
    reload();
  }
  async function remove(id: string) {
    await api(`/api/v1/area/promemoria/${id}`, { method: "DELETE" });
    reload();
  }

  if (error)
    return (
      <p role="alert" className="field-error">
        {error}
      </p>
    );

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <p className="eyebrow">Promemoria</p>
          <h1 className="area-title mt-3">
            Le prossime cose da fare, per tutta la famiglia.
          </h1>
          <p className="area-lead">
            Una visita con le domande già pronte, un esame da ripetere quando te
            l&apos;ha detto il medico. Le date le scegli tu: noi te le
            ricordiamo.
          </p>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setOpen(true)}
          aria-expanded={open}
          aria-controls="nuovo-promemoria"
        >
          <BellPlus aria-hidden className="h-5 w-5" /> Nuovo promemoria
        </button>
      </div>

      {open && persone ? (
        <NuovoPromemoria
          persone={persone}
          initialPersona={params.get("persona") ?? SELF_ID}
          initialKind={
            (params.get("nuovo") as TipoPromemoria) in TIPI
              ? (params.get("nuovo") as TipoPromemoria)
              : "visita"
          }
          onClose={() => setOpen(false)}
          onCreated={() => {
            setOpen(false);
            reload();
          }}
        />
      ) : null}

      {!list ? (
        <div
          className="mt-8 h-48 animate-pulse rounded-2xl bg-mist"
          aria-busy="true"
        />
      ) : (
        <>
          <h2 className="area-h2 mt-10">In arrivo</h2>
          {openList.length ? (
            <ul
              className="mt-4 space-y-4"
              aria-label="Promemoria in arrivo"
              data-testid="promemoria-elenco"
            >
              {openList.map((r) => (
                <ReminderRow
                  key={r.id}
                  r={r}
                  persone={persone}
                  today={today}
                  onDone={() => patch(r.id, { done: true })}
                  onRemove={() => remove(r.id)}
                />
              ))}
            </ul>
          ) : (
            <p className="empty-note mt-4">
              Nessun promemoria in arrivo. Aggiungine uno quando fissi una
              visita o il medico ti dice di ripetere un esame.
            </p>
          )}
          {doneList.length ? (
            <details className="mt-10">
              <summary className="inline-flex min-h-11 cursor-pointer items-center text-[1.0625rem] font-bold text-teal-deep">
                Fatti ({doneList.length})
              </summary>
              <ul className="mt-4 space-y-3" aria-label="Promemoria fatti">
                {doneList.map((r) => (
                  <ReminderRow
                    key={r.id}
                    r={r}
                    persone={persone}
                    today={today}
                    onDone={() => patch(r.id, { done: false })}
                    onRemove={() => remove(r.id)}
                  />
                ))}
              </ul>
            </details>
          ) : null}
        </>
      )}

      <section
        className="mt-12 grid gap-5 lg:grid-cols-2"
        aria-label="Come funzionano i promemoria"
      >
        <div className="rounded-[var(--radius-lg)] border border-line bg-canvas p-5 sm:p-6">
          <h2 className="flex items-center gap-2 text-[1.125rem] font-extrabold text-ink">
            <Mail aria-hidden className="h-5 w-5 text-teal" /> Un&apos;email tre
            giorni prima
          </h2>
          <p className="mt-2 text-[1.0625rem] text-ink-soft">
            Ti scriviamo che c&apos;è un promemoria e quando. Nell&apos;email
            non mettiamo il titolo né altri dettagli: li vedi solo entrando nel
            tuo spazio.
          </p>
        </div>
        <div className="rounded-[var(--radius-lg)] border border-line bg-canvas p-5 sm:p-6">
          <h2 className="flex items-center gap-2 text-[1.125rem] font-extrabold text-ink">
            <ClipboardList aria-hidden className="h-5 w-5 text-teal" /> Il
            foglio per la visita
          </h2>
          <p className="mt-2 text-[1.0625rem] text-ink-soft">
            Ogni visita ha il suo foglio: le domande scelte da te e gli ultimi
            numeri della persona, da stampare o mostrare dal telefono.
          </p>
        </div>
      </section>
    </div>
  );
}

function ReminderRow({
  r,
  persone,
  today,
  onDone,
  onRemove,
}: {
  r: Promemoria;
  persone: PersonaView[] | null;
  today: string;
  onDone: () => void;
  onRemove: () => void;
}) {
  const Icon = ICONS[r.kind];
  const days = daysBetween(today, r.dueDate);
  const idx = persone?.findIndex((p) => p.id === r.profileId) ?? -1;
  const p = r.profileId ? persone?.[idx] : persone?.[0];
  return (
    <li
      className={clsx(
        "rem-card",
        r.doneAt && "is-done",
        !r.doneAt && days >= 0 && days <= 7 && "is-soon",
      )}
      data-testid="promemoria"
    >
      <DateBlock iso={r.dueDate} />
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={clsx("rem-when", (days < 0 || r.doneAt) && "is-past")}
          >
            {r.doneAt ? "Fatto" : whenLabel(r.dueDate, today)}
          </span>
          <span className="inline-flex items-center gap-1.5 text-[0.9375rem] font-bold text-muted">
            <Icon aria-hidden className="h-4 w-4" /> {TIPI[r.kind]}
          </span>
        </div>
        <h3 className="mt-2 text-[1.25rem] font-extrabold leading-snug text-ink">
          {r.title}
        </h3>
        <p className="mt-1 flex items-center gap-2 text-[1rem] text-ink-soft">
          {p ? (
            <PersonaAvatar persona={p} index={Math.max(0, idx - 1)} size="sm" />
          ) : null}
          <span>
            Per{" "}
            {personaName(persone, r.profileId) === "Tu"
              ? "te"
              : personaName(persone, r.profileId)}
            {r.kind === "visita"
              ? ` · ${r.questions.length} ${r.questions.length === 1 ? "domanda pronta" : "domande pronte"}`
              : ""}
          </span>
        </p>
        {r.note ? (
          <p className="mt-1 text-[1rem] text-muted">{r.note}</p>
        ) : null}
        <div className="mt-4 flex flex-wrap gap-2">
          {r.kind === "visita" ? (
            <Link
              href={`/area-personale/promemoria/${r.id}`}
              className="btn btn-primary btn-sm"
            >
              Apri il foglio per la visita{" "}
              <ArrowRight aria-hidden className="h-4 w-4" />
            </Link>
          ) : null}
          {!r.doneAt ? (
            <a
              href={`/api/v1/area/promemoria/${r.id}/calendario`}
              className="btn btn-secondary btn-sm"
              download
            >
              <CalendarPlus aria-hidden className="h-4 w-4" /> Aggiungi al
              calendario
            </a>
          ) : null}
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={onDone}
          >
            {r.doneAt ? (
              <RotateCcw aria-hidden className="h-4 w-4" />
            ) : (
              <Check aria-hidden className="h-4 w-4" />
            )}{" "}
            {r.doneAt ? "Rimetti da fare" : "Fatto"}
          </button>
          <ConfirmButton
            className="btn btn-ghost btn-sm text-danger"
            question="Eliminare questo promemoria?"
            yes="Sì, elimina"
            onConfirm={onRemove}
          >
            <Trash2 aria-hidden className="h-4 w-4" /> Elimina
          </ConfirmButton>
        </div>
      </div>
    </li>
  );
}

function NuovoPromemoria({
  persone,
  initialPersona,
  initialKind,
  onClose,
  onCreated,
}: {
  persone: PersonaView[];
  initialPersona: string;
  initialKind: TipoPromemoria;
  onClose: () => void;
  onCreated: () => void;
}) {
  const [kind, setKind] = useState<TipoPromemoria>(initialKind);
  const [persona, setPersona] = useState(
    persone.some((p) => p.id === initialPersona) ? initialPersona : SELF_ID,
  );
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const placeholder =
    kind === "visita"
      ? "Per esempio: Visita dal medico di famiglia"
      : kind === "controllo"
        ? "Per esempio: Ripetere gli esami del sangue"
        : "Per esempio: Ritirare il referto";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await api("/api/v1/area/promemoria", {
        method: "POST",
        body: {
          kind,
          profileId: persona === SELF_ID ? null : persona,
          title: title.trim(),
          dueDate: date,
          note: note.trim() || null,
          questions: [],
        },
      });
      onCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore");
      setBusy(false);
    }
  }

  return (
    <form
      id="nuovo-promemoria"
      onSubmit={submit}
      className="form-card mt-8"
      aria-labelledby="nuovo-promemoria-titolo"
      data-testid="nuovo-promemoria"
    >
      <h2 id="nuovo-promemoria-titolo" className="form-card-title">
        Nuovo promemoria
      </h2>
      <fieldset className="mt-5">
        <legend className="field-label">Che cosa</legend>
        <div className="choice-pills mt-3">
          {(Object.keys(TIPI) as TipoPromemoria[]).map((k) => (
            <label key={k} className="choice-pill">
              <input
                type="radio"
                name="tipo"
                value={k}
                checked={kind === k}
                onChange={() => setKind(k)}
              />
              {TIPI[k]}
            </label>
          ))}
        </div>
      </fieldset>
      {persone.length > 1 ? (
        <fieldset className="mt-5">
          <legend className="field-label">Per chi</legend>
          <div className="choice-pills mt-3">
            {persone.map((p) => (
              <label key={p.id} className="choice-pill">
                <input
                  type="radio"
                  name="persona"
                  value={p.id}
                  checked={persona === p.id}
                  onChange={() => setPersona(p.id)}
                />
                {p.relation === "io" ? "Per me" : p.name}
              </label>
            ))}
          </div>
        </fieldset>
      ) : null}
      <div className="mt-5 grid gap-5 sm:grid-cols-[minmax(0,1fr)_14rem]">
        <label className="block">
          <span className="field-label">Titolo</span>
          <input
            className="field-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={80}
            placeholder={placeholder}
            required
          />
        </label>
        <label className="block">
          <span className="field-label">Quando</span>
          <input
            type="date"
            className="field-input"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </label>
      </div>
      <p className="field-hint">
        Il titolo finisce anche nel calendario del telefono, se ce lo aggiungi:
        scrivilo come preferisci.
      </p>
      {kind === "controllo" ? (
        <p className="field-hint">
          Metti la data che ti ha indicato il medico. Noi non suggeriamo quando
          ripetere un esame.
        </p>
      ) : null}
      <label className="mt-5 block">
        <span className="field-label">Nota (facoltativa)</span>
        <textarea
          className="field-input"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          maxLength={300}
          placeholder="Per esempio: portare gli ultimi esami"
        />
      </label>
      {error ? (
        <p role="alert" className="field-error mt-4">
          {error}
        </p>
      ) : null}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          type="submit"
          className="btn btn-primary"
          disabled={busy || !title.trim() || !date}
        >
          {busy ? (
            <Loader2 aria-hidden className="h-5 w-5 animate-spin" />
          ) : (
            <BellPlus aria-hidden className="h-5 w-5" />
          )}{" "}
          Salva il promemoria
        </button>
        <button type="button" className="btn btn-ghost" onClick={onClose}>
          Annulla
        </button>
      </div>
    </form>
  );
}
