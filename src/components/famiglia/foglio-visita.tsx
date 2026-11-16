"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { clsx } from "clsx";
import {
  ArrowLeft,
  CalendarPlus,
  LineChart,
  Loader2,
  Phone,
  Plus,
  Printer,
  X,
} from "lucide-react";
import { api } from "@/components/area/api";
import {
  fmtDate,
  positionText,
  type Timeline,
} from "@/domain/famiglia/nel-tempo";
import { SELF_ID } from "@/domain/famiglia/persone";
import { TIPI, whenLabel, type Promemoria } from "@/domain/famiglia/promemoria";
import { DateBlock } from "./promemoria";
import { personaName, usePersone } from "./shared";

/**
 * Il foglio per la visita: le domande scelte e gli ultimi numeri della persona, esame per esame, con la volta prima.
 * Si stampa o si mostra dal telefono. Nessuna interpretazione: numeri, date, intervallo stampato, domande.
 */
export function FoglioVisita({ id }: { id: string }) {
  const { persone } = usePersone();
  const [r, setR] = useState<Promemoria | null>(null);
  const [t, setT] = useState<Timeline | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [own, setOwn] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let alive = true;
    api<{ promemoria: Promemoria }>(`/api/v1/area/promemoria/${id}`)
      .then(async (x) => {
        if (!alive) return;
        setR(x.promemoria);
        const tl = await api<{ timeline: Timeline }>(
          `/api/v1/area/nel-tempo?persona=${x.promemoria.profileId ?? SELF_ID}`,
        );
        if (alive) setT(tl.timeline);
      })
      .catch(
        (e) => alive && setError(e instanceof Error ? e.message : "Errore"),
      );
    return () => {
      alive = false;
    };
  }, [id]);

  async function patch(body: unknown) {
    setBusy(true);
    try {
      await api(`/api/v1/area/promemoria/${id}`, { method: "PATCH", body });
      const x = await api<{ promemoria: Promemoria }>(
        `/api/v1/area/promemoria/${id}`,
      );
      setR(x.promemoria);
    } finally {
      setBusy(false);
    }
  }

  if (error)
    return (
      <p role="alert" className="field-error">
        {error}
      </p>
    );
  if (!r)
    return (
      <div
        className="h-64 animate-pulse rounded-2xl bg-mist"
        aria-busy="true"
      />
    );

  const who = personaName(persone, r.profileId);
  const rows = [...(t?.series ?? []), ...(t?.single ?? [])];

  return (
    <div className="print-sheet">
      <Link href="/area-personale/promemoria" className="back-link no-print">
        <ArrowLeft aria-hidden className="h-4 w-4" /> Tutti i promemoria
      </Link>
      <div className="mt-5 flex flex-wrap items-start gap-5">
        <DateBlock iso={r.dueDate} />
        <div className="min-w-0 flex-1">
          <p className="eyebrow">
            {TIPI[r.kind]} · {whenLabel(r.dueDate)}
          </p>
          <h1 className="area-title mt-2">{r.title}</h1>
          <p className="area-lead">
            Per {who === "Tu" ? "te" : who}, il {fmtDate(r.dueDate)}.
            {r.note ? ` ${r.note}` : ""}
          </p>
        </div>
      </div>
      <div className="no-print mt-6 flex flex-wrap gap-2">
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => window.print()}
        >
          <Printer aria-hidden className="h-5 w-5" /> Stampa il foglio
        </button>
        <a
          href={`/api/v1/area/promemoria/${r.id}/calendario`}
          className="btn btn-secondary"
          download
        >
          <CalendarPlus aria-hidden className="h-5 w-5" /> Aggiungi al
          calendario
        </a>
        <Link
          href={
            r.profileId
              ? `/area-personale/nel-tempo?persona=${r.profileId}`
              : "/area-personale/nel-tempo"
          }
          className="btn btn-ghost"
        >
          <LineChart aria-hidden className="h-5 w-5" /> Numeri nel tempo
        </Link>
      </div>

      <section className="form-card mt-8" aria-labelledby="foglio-domande">
        <h2 id="foglio-domande" className="form-card-title">
          Domande per il medico
        </h2>
        {r.questions.length ? (
          <ol className="mt-4 space-y-3" data-testid="foglio-domande">
            {r.questions.map((q, i) => (
              <li
                key={q}
                className="flex items-start gap-3 rounded-2xl bg-mist px-4 py-3 text-[1.0625rem] leading-relaxed text-ink"
              >
                <span className="tabular mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-strong text-[0.9375rem] font-extrabold text-on-strong">
                  {i + 1}
                </span>
                <span className="min-w-0 flex-1">{q}</span>
                <button
                  type="button"
                  className="icon-btn no-print shrink-0"
                  aria-label={`Togli la domanda ${i + 1}`}
                  disabled={busy}
                  onClick={() => patch({ removeQuestion: i })}
                >
                  <X aria-hidden className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ol>
        ) : (
          <p className="form-card-text">
            Ancora nessuna domanda. Scrivine una qui sotto, oppure aggiungile
            dalla pagina dei numeri nel tempo.
          </p>
        )}
        <form
          className="no-print mt-5 flex flex-col gap-3 sm:flex-row sm:items-end"
          onSubmit={(e) => {
            e.preventDefault();
            if (!own.trim()) return;
            void patch({ addQuestions: [own.trim()] }).then(() => setOwn(""));
          }}
        >
          <label className="block flex-1">
            <span className="field-label">Aggiungi una tua domanda</span>
            <input
              className="field-input"
              value={own}
              onChange={(e) => setOwn(e.target.value)}
              maxLength={400}
              placeholder="Per esempio: devo ripetere questi esami? Quando?"
            />
          </label>
          <button
            type="submit"
            className="btn btn-secondary"
            disabled={busy || !own.trim()}
          >
            {busy ? (
              <Loader2 aria-hidden className="h-5 w-5 animate-spin" />
            ) : (
              <Plus aria-hidden className="h-5 w-5" />
            )}{" "}
            Aggiungi
          </button>
        </form>
      </section>

      <section className="mt-8" aria-labelledby="foglio-numeri">
        <h2 id="foglio-numeri" className="area-h2">
          Gli ultimi numeri
        </h2>
        <p className="mt-2 text-[1.0625rem] text-ink-soft">
          Dai referti confermati, con la volta precedente quando c&apos;è. Gli
          intervalli sono quelli stampati dal laboratorio.
        </p>
        {rows.length ? (
          <>
            {/* Su telefono una scheda per esame, da leggere in verticale; da 640 px la tabella. */}
            <ul
              className="mt-4 space-y-3 sm:hidden"
              data-testid="foglio-numeri-lista"
            >
              {rows.map((s) => {
                const last = s.points[s.points.length - 1];
                const prev =
                  s.points.length > 1 ? s.points[s.points.length - 2] : null;
                const out =
                  last.position === "above-range" ||
                  last.position === "below-range";
                return (
                  <li
                    key={s.key}
                    className="rounded-2xl border border-line bg-paper px-4 py-3"
                  >
                    <p className="text-[1.0625rem] font-extrabold text-ink">
                      {s.name}
                    </p>
                    <p className="tabular mt-1 text-[1.0625rem]">
                      <strong className={clsx(out ? "text-warn" : "text-ink")}>
                        {last.valueRaw} {s.unit}
                      </strong>{" "}
                      <span className="text-muted">
                        il {fmtDate(last.date)}
                      </span>
                    </p>
                    <p
                      className={clsx(
                        "text-[0.9375rem]",
                        out ? "text-warn" : "text-muted",
                      )}
                    >
                      {positionText(last.position)}
                      {last.referenceRaw ? ` (${last.referenceRaw})` : ""}
                    </p>
                    {prev ? (
                      <p className="tabular mt-1 text-[0.9375rem] text-ink-soft">
                        Volta prima: {prev.valueRaw} {s.unit}, il{" "}
                        {fmtDate(prev.date)}
                      </p>
                    ) : null}
                  </li>
                );
              })}
            </ul>
            <div className="data-table-wrap mt-4 hidden sm:block">
              <table className="data-table" data-testid="foglio-numeri">
                <thead>
                  <tr>
                    <th scope="col">Esame</th>
                    <th scope="col">Ultimo</th>
                    <th scope="col">Volta prima</th>
                    <th scope="col">Intervallo stampato</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((s) => {
                    const last = s.points[s.points.length - 1];
                    const prev =
                      s.points.length > 1
                        ? s.points[s.points.length - 2]
                        : null;
                    const out =
                      last.position === "above-range" ||
                      last.position === "below-range";
                    return (
                      <tr key={s.key}>
                        <th scope="row" className="font-bold">
                          {s.name}
                        </th>
                        <td className="tabular">
                          <strong className={clsx(out && "text-warn")}>
                            {last.valueRaw} {s.unit}
                          </strong>
                          <span className="block text-[0.9375rem] text-muted">
                            {fmtDate(last.date)} · {positionText(last.position)}
                          </span>
                        </td>
                        <td className="tabular">
                          {prev ? (
                            <>
                              {prev.valueRaw} {s.unit}
                              <span className="block text-[0.9375rem] text-muted">
                                {fmtDate(prev.date)}
                              </span>
                            </>
                          ) : (
                            <span className="text-muted">—</span>
                          )}
                        </td>
                        <td className="tabular">{last.referenceRaw ?? "—"}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <p className="empty-note mt-4">
            Nessun referto confermato per questa persona.
          </p>
        )}
      </section>

      <p className="emergency-note mt-10">
        <span aria-hidden>
          <Phone className="h-4 w-4" />
        </span>
        <span>
          <strong>Il foglio non è una valutazione clinica.</strong> Mette in
          ordine numeri e domande. In caso di urgenza chiama il{" "}
          <strong>112</strong>.
        </span>
      </p>
    </div>
  );
}
