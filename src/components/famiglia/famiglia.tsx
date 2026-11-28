"use client";

import { useState } from "react";
import Link from "next/link";
import { clsx } from "clsx";
import {
  BellRing,
  FilePlus2,
  FileText,
  LineChart,
  Loader2,
  Lock,
  ShieldCheck,
  Trash2,
  UserPlus,
} from "lucide-react";
import { api } from "@/components/area/api";
import { ConfirmButton } from "@/components/ui/confirm-button";
import { mediciEnabled } from "@/lib/medici";
import {
  BASI,
  DICHIARAZIONE,
  MAX_FAMILIARI,
  RELAZIONI,
  personaSubtitle,
  type Base,
  type Relazione,
} from "@/domain/famiglia/persone";
import { whenLabel } from "@/domain/famiglia/promemoria";
import { PersonaAvatar, useIsDemo, usePersone } from "./shared";
import { DemoHistoryButton } from "./demo-history";

/**
 * «La tua famiglia»: le persone di cui segui i referti, una scheda ciascuna, e il modulo per aggiungerne una
 * con la dichiarazione della base (consenso, genitore di minore, tutela). Eliminare una persona elimina i suoi dati.
 */
export function Famiglia() {
  const { persone, error, reload } = usePersone();
  const demo = useIsDemo();
  const [open, setOpen] = useState(false);
  const familiari = persone?.filter((p) => p.relation !== "io") ?? [];

  async function remove(id: string) {
    await api(`/api/v1/area/famiglia/${id}`, { method: "DELETE" });
    await reload();
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
          <p className="eyebrow">La tua famiglia</p>
          <h1 className="area-title mt-3">
            Tutta la famiglia, in un posto solo.
          </h1>
          <p className="area-lead">
            Segui i referti, i numeri nel tempo e le visite di chi ti sta a
            cuore: un genitore, un figlio, il partner. Ogni persona ha la sua
            scheda, e i suoi dati restano separati dai tuoi.
          </p>
        </div>
        {familiari.length < MAX_FAMILIARI ? (
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-controls="nuovo-familiare"
          >
            <UserPlus aria-hidden className="h-5 w-5" /> Aggiungi un familiare
          </button>
        ) : null}
      </div>

      {!persone ? (
        <div
          className="mt-8 h-48 animate-pulse rounded-2xl bg-mist"
          aria-busy="true"
        />
      ) : (
        <ul
          className="mt-8 grid gap-5 md:grid-cols-2"
          aria-label="Persone della famiglia"
          data-testid="famiglia-elenco"
        >
          {persone.map((p, i) => (
            <li
              key={p.id}
              className={clsx(
                "fam-card",
                p.relation === "io" && "fam-card-self",
              )}
              data-testid="famiglia-persona"
            >
              <div className="flex items-center gap-4">
                <PersonaAvatar persona={p} index={i - 1} size="lg" />
                <div className="min-w-0">
                  <h2 className="truncate text-[1.375rem] font-extrabold leading-tight text-ink">
                    {p.relation === "io" ? "Tu" : p.name}
                  </h2>
                  <p className="text-[1rem] font-semibold text-muted">
                    {personaSubtitle(p)}
                  </p>
                </div>
              </div>
              <div className="fam-facts">
                <span className="fam-fact">
                  <FileText aria-hidden className="h-4 w-4 text-teal" />{" "}
                  {p.documentCount}{" "}
                  {p.documentCount === 1 ? "referto" : "referti"}
                </span>
                {p.nextReminder ? (
                  <Link
                    href={`/area-personale/promemoria/${p.nextReminder.id}`}
                    className="fam-fact hover:text-teal-deep"
                  >
                    <BellRing aria-hidden className="h-4 w-4 text-teal" />{" "}
                    {whenLabel(p.nextReminder.dueDate)}: {p.nextReminder.title}
                  </Link>
                ) : (
                  <span className="fam-fact">
                    <BellRing aria-hidden className="h-4 w-4 text-muted" />{" "}
                    Nessun promemoria
                  </span>
                )}
              </div>
              <div className="mt-auto flex flex-wrap gap-2">
                <Link
                  href={
                    p.relation === "io"
                      ? "/area-personale/nel-tempo"
                      : `/area-personale/nel-tempo?persona=${p.id}`
                  }
                  className="btn btn-secondary btn-sm"
                >
                  <LineChart aria-hidden className="h-4 w-4" /> Nel tempo
                </Link>
                <Link
                  href={
                    p.relation === "io"
                      ? "/area-personale/nuovo"
                      : `/area-personale/nuovo?persona=${p.id}`
                  }
                  className="btn btn-ghost btn-sm"
                >
                  <FilePlus2 aria-hidden className="h-4 w-4" /> Aggiungi un
                  referto
                </Link>
                {p.relation !== "io" ? (
                  <ConfirmButton
                    className="btn btn-ghost btn-sm text-danger"
                    question={`Eliminare la scheda di ${p.name} con tutti i suoi referti e promemoria?`}
                    yes="Sì, elimina tutto"
                    onConfirm={() => void remove(p.id)}
                  >
                    <Trash2 aria-hidden className="h-4 w-4" /> Elimina
                  </ConfirmButton>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
      )}

      {persone && familiari.length === 0 && !open ? (
        <div className="empty-note mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p>
            Non segui ancora nessun familiare. Chi si occupa di un genitore
            anziano di solito parte da qui.
          </p>
          {demo ? (
            <DemoHistoryButton
              onDone={() => void reload()}
              className="btn btn-secondary shrink-0"
            />
          ) : null}
        </div>
      ) : null}

      {open ? (
        <NuovoFamiliare
          onClose={() => setOpen(false)}
          onCreated={() => void reload().then(() => setOpen(false))}
        />
      ) : null}

      <section
        className="mt-12 grid gap-5 lg:grid-cols-2"
        aria-label="Come funziona"
      >
        <div className="rounded-[var(--radius-lg)] border border-line bg-canvas p-5 sm:p-6">
          <h2 className="flex items-center gap-2 text-[1.125rem] font-extrabold text-ink">
            <Lock aria-hidden className="h-5 w-5 text-teal" /> I dati restano
            nel tuo account
          </h2>
          <p className="mt-2 text-[1.0625rem] text-ink-soft">
            Il familiare non riceve email e non ha un accesso suo.{" "}
            {mediciEnabled()
              ? "Nessun medico vede i suoi documenti se non li condividi tu, per una richiesta precisa."
              : "I suoi documenti li vedi solo tu."}{" "}
            Puoi eliminare la scheda quando vuoi: con lei spariscono referti,
            numeri e promemoria.
          </p>
        </div>
        <div className="rounded-[var(--radius-lg)] border border-line bg-canvas p-5 sm:p-6">
          <h2 className="flex items-center gap-2 text-[1.125rem] font-extrabold text-ink">
            <ShieldCheck aria-hidden className="h-5 w-5 text-teal" /> Perché ti
            chiediamo una dichiarazione
          </h2>
          <p className="mt-2 text-[1.0625rem] text-ink-soft">
            I referti di un&apos;altra persona sono dati sanitari suoi. Puoi
            gestirli se te lo ha chiesto, se è tua figlia o tuo figlio
            minorenne, o se sei il suo tutore o amministratore di sostegno.
            Registriamo la tua dichiarazione con data e versione.
          </p>
        </div>
      </section>
    </div>
  );
}

function NuovoFamiliare({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: () => void;
}) {
  const [name, setName] = useState("");
  const [relation, setRelation] = useState<Relazione>("genitore");
  const [birthYear, setBirthYear] = useState("");
  const [basis, setBasis] = useState<Base | "">("");
  const [declared, setDeclared] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const year = birthYear.trim() ? Number(birthYear) : null;
  const yearOk =
    year === null ||
    (Number.isInteger(year) &&
      year >= 1900 &&
      year <= new Date().getFullYear());

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!basis || !declared || !name.trim() || !yearOk) return;
    setBusy(true);
    setError(null);
    try {
      await api("/api/v1/area/famiglia", {
        method: "POST",
        body: {
          name: name.trim(),
          relation,
          birthYear: year,
          basis,
          declaration: true,
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
      id="nuovo-familiare"
      onSubmit={submit}
      className="form-card mt-8"
      aria-labelledby="nuovo-familiare-titolo"
      data-testid="nuovo-familiare"
    >
      <h2 id="nuovo-familiare-titolo" className="form-card-title">
        Aggiungi un familiare
      </h2>
      <p className="form-card-text">
        Ti chiediamo solo il necessario: un nome per riconoscerlo e, se vuoi,
        l&apos;anno di nascita.
      </p>
      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <label className="block">
          <span className="field-label">Come lo chiami</span>
          <input
            className="field-input"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={40}
            placeholder="Per esempio: Mamma"
            required
            autoComplete="off"
          />
        </label>
        <label className="block">
          <span className="field-label">Anno di nascita (facoltativo)</span>
          <input
            className="field-input"
            inputMode="numeric"
            value={birthYear}
            onChange={(e) =>
              setBirthYear(e.target.value.replace(/\D/g, "").slice(0, 4))
            }
            placeholder="Per esempio: 1948"
            aria-invalid={!yearOk}
          />
        </label>
      </div>
      <fieldset className="mt-6">
        <legend className="field-label">Chi è per te</legend>
        <div className="choice-pills mt-3">
          {(Object.keys(RELAZIONI) as Relazione[]).map((r) => (
            <label key={r} className="choice-pill">
              <input
                type="radio"
                name="relazione"
                value={r}
                checked={relation === r}
                onChange={() => setRelation(r)}
              />
              {RELAZIONI[r]}
            </label>
          ))}
        </div>
      </fieldset>
      <fieldset className="mt-6">
        <legend className="field-label">
          Perché puoi gestire i suoi referti
        </legend>
        <div className="mt-2 space-y-1">
          {(Object.keys(BASI) as Base[]).map((b) => (
            <label key={b} className="field-check">
              <input
                type="radio"
                name="base"
                value={b}
                checked={basis === b}
                onChange={() => setBasis(b)}
                required
              />
              <span>{BASI[b]}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <label className="field-check mt-4 rounded-2xl bg-mist px-4">
        <input
          type="checkbox"
          checked={declared}
          onChange={(e) => setDeclared(e.target.checked)}
          required
        />
        <span>{DICHIARAZIONE}</span>
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
          disabled={busy || !basis || !declared || !name.trim() || !yearOk}
        >
          {busy ? (
            <Loader2 aria-hidden className="h-5 w-5 animate-spin" />
          ) : (
            <UserPlus aria-hidden className="h-5 w-5" />
          )}
          Aggiungi
        </button>
        <button type="button" className="btn btn-ghost" onClick={onClose}>
          Annulla
        </button>
      </div>
    </form>
  );
}
