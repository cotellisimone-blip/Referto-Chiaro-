"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowRight,
  CalendarPlus,
  Check,
  FilePlus2,
  History,
  ListChecks,
  Loader2,
  MessageCircleQuestion,
  Phone,
  Sparkles,
} from "lucide-react";
import { api } from "@/components/area/api";
import { fmtDate, type Timeline } from "@/domain/famiglia/nel-tempo";
import { SELF_ID } from "@/domain/famiglia/persone";
import { todayIso, type Promemoria } from "@/domain/famiglia/promemoria";
import { TrendCard } from "./trend-chart";
import { PersonaSwitcher, useIsDemo, usePersone } from "./shared";
import { DemoHistoryButton } from "./demo-history";

interface Data {
  persona?: string;
  timeline: Timeline;
  pending: number;
  limits: string[];
}

/**
 * «Nel tempo»: per ogni persona della famiglia, gli stessi esami messi in fila referto dopo referto.
 * Le domande per il medico nate dall'andamento si possono aggiungere alla prossima visita (promemoria).
 */
export function NelTempo() {
  const params = useSearchParams();
  const router = useRouter();
  const { persone, reload } = usePersone();
  const demo = useIsDemo();
  const [persona, setPersona] = useState(params.get("persona") ?? SELF_ID);
  const [data, setData] = useState<Data | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    let alive = true;
    api<Data>(`/api/v1/area/nel-tempo?persona=${encodeURIComponent(persona)}`)
      .then((d) => alive && setData({ ...d, persona }))
      .catch(
        (e) => alive && setError(e instanceof Error ? e.message : "Errore"),
      );
    return () => {
      alive = false;
    };
  }, [persona, tick]);

  const current = persone?.find((p) => p.id === persona) ?? null;
  const who = !current || current.relation === "io" ? null : current.name;
  const fresh = data && data.persona === persona ? data : null;
  const t = fresh?.timeline;
  const outsideLast = useMemo(
    () =>
      t?.series.filter((s) =>
        ["above-range", "below-range"].includes(
          s.points[s.points.length - 1].position,
        ),
      ).length ?? 0,
    [t],
  );

  function choose(id: string) {
    setPersona(id);
    router.replace(
      id === SELF_ID
        ? "/area-personale/nel-tempo"
        : `/area-personale/nel-tempo?persona=${id}`,
    );
  }

  if (error)
    return (
      <p role="alert" className="field-error">
        {error}
      </p>
    );

  return (
    <div>
      <p className="eyebrow">La salute nel tempo</p>
      <h1 className="area-title mt-3">
        {who ? `I numeri di ${who}, nel tempo.` : "I tuoi numeri, nel tempo."}
      </h1>
      <p className="area-lead">
        Ogni referto confermato si aggiunge ai precedenti. Qui vedi come si
        muove ogni esame, anno dopo anno. Non diciamo se va bene o male: ti
        aiutiamo a chiederlo al medico.
      </p>

      {persone ? (
        <div className="mt-6">
          <PersonaSwitcher
            persone={persone}
            current={persona}
            onChange={choose}
          />
        </div>
      ) : null}

      {!fresh || !t ? (
        <div
          className="mt-8 h-64 animate-pulse rounded-2xl bg-mist"
          aria-busy="true"
        />
      ) : t.series.length === 0 ? (
        <section
          className="empty-state mt-8 card grain overflow-hidden p-6 sm:p-10"
          aria-labelledby="vuoto-titolo"
          data-testid="nel-tempo-vuoto"
        >
          <span aria-hidden className="tile-ico">
            <History />
          </span>
          <h2 id="vuoto-titolo" className="form-card-title mt-4">
            Servono almeno due referti con lo stesso esame.
          </h2>
          <p className="form-card-text max-w-2xl">
            {t.documentCount === 0
              ? "Per questa persona non ci sono ancora referti confermati."
              : `Per ora c'è ${t.documentCount === 1 ? "un referto confermato" : `${t.documentCount} referti confermati`}, ma nessun esame compare due volte con la stessa unità di misura.`}{" "}
            Aggiungi un referto più vecchio o il prossimo che arriva: da lì in
            poi vedi la linea.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href={
                persona === SELF_ID
                  ? "/area-personale/nuovo"
                  : `/area-personale/nuovo?persona=${persona}`
              }
              className="btn btn-primary"
            >
              <FilePlus2 aria-hidden className="h-5 w-5" /> Aggiungi un referto
            </Link>
            {demo ? (
              <DemoHistoryButton
                onDone={() => {
                  void reload();
                  setTick((x) => x + 1);
                }}
              />
            ) : null}
          </div>
        </section>
      ) : (
        <>
          {/* A colpo d'occhio, per la persona scelta */}
          <section
            className="glance mt-8"
            aria-labelledby="sintesi-titolo"
            data-testid="nel-tempo-sintesi"
          >
            <p className="eyebrow">A colpo d&apos;occhio</p>
            <h2 id="sintesi-titolo" className="glance-title">
              {t.series.length} {t.series.length === 1 ? "esame" : "esami"} in
              fila, da {t.documentCount} referti.
            </h2>
            {t.span ? (
              <p className="mt-2 text-[1.0625rem] text-ink-soft">
                Dal {fmtDate(t.span.from)} al {fmtDate(t.span.to)}.
              </p>
            ) : null}
            <div className="glance-counts">
              <span className="glance-count">
                <span className="glance-num">
                  {t.series.length - outsideLast}
                </span>{" "}
                con l&apos;ultimo numero dentro l&apos;intervallo stampato
              </span>
              {outsideLast ? (
                <span className="glance-count is-out">
                  <span className="glance-num">{outsideLast}</span> fuori
                </span>
              ) : null}
            </div>
          </section>

          {fresh.pending ? (
            <p className="callout callout-warn mt-5" role="note">
              <span aria-hidden className="callout-ico">
                <ListChecks />
              </span>
              <span>
                <span className="callout-title">
                  {fresh.pending === 1
                    ? "Un referto aspetta"
                    : `${fresh.pending} referti aspettano`}{" "}
                  la tua conferma
                </span>
                <span className="callout-text block">
                  Entrano nel grafico dopo che hai controllato i valori letti.{" "}
                  <Link href="/area-personale" className="link font-semibold">
                    Vai ai referti
                  </Link>
                </span>
              </span>
            </p>
          ) : null}

          {t.questions.length ? (
            <Questions
              key={persona}
              questions={t.questions}
              persona={persona}
              who={who}
            />
          ) : null}

          <h2 className="area-h2 mt-12">Esame per esame</h2>
          <p className="mt-2 text-[1.0625rem] text-ink-soft">
            Prima gli esami in cui l&apos;ultimo numero è fuori
            dall&apos;intervallo stampato. Tocca un esame per vedere tutti i
            numeri.
          </p>
          <div
            className="mt-5 grid gap-5 lg:grid-cols-2"
            data-testid="serie-elenco"
          >
            {t.series.map((s) => (
              <TrendCard key={s.key} series={s} />
            ))}
          </div>

          {t.single.length ? (
            <section className="mt-10" aria-labelledby="una-volta-titolo">
              <h2 id="una-volta-titolo" className="area-h3">
                Misurati una volta sola
              </h2>
              <p className="mt-1 text-[1rem] text-muted">
                Compariranno nel grafico quando arriva un altro referto con lo
                stesso esame.
              </p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {t.single.map((s) => (
                  <li key={s.key} className="fam-fact">
                    {s.name}: {s.points[0].valueRaw} {s.unit}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {t.notes.length ? (
            <ul className="mt-8 space-y-2 text-[1rem] text-muted">
              {t.notes.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          ) : null}
        </>
      )}

      <section
        className="mt-12 rounded-[var(--radius-lg)] border border-line bg-canvas p-5 sm:p-6"
        aria-labelledby="limiti-titolo"
      >
        <h2
          id="limiti-titolo"
          className="text-[1.125rem] font-extrabold text-ink"
        >
          Che cosa questa pagina non fa
        </h2>
        <ul className="mt-3 space-y-2 text-[1rem] text-ink-soft">
          {(data?.limits ?? []).map((l) => (
            <li key={l} className="flex gap-2">
              {l.includes("112") ? (
                <Phone
                  aria-hidden
                  className="mt-1 h-4 w-4 shrink-0 text-danger"
                />
              ) : (
                <Sparkles
                  aria-hidden
                  className="mt-1 h-4 w-4 shrink-0 text-teal"
                />
              )}
              <span>{l}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

/** Domande nate dall'andamento: si scelgono e si portano alla prossima visita (un promemoria con le domande dentro). */
function Questions({
  questions,
  persona,
  who,
}: {
  questions: string[];
  persona: string;
  who: string | null;
}) {
  const [picked, setPicked] = useState<boolean[]>(() =>
    questions.map(() => true),
  );
  const [visit, setVisit] = useState<Promemoria | null | undefined>(undefined);
  const [date, setDate] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<{ id: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const pid = persona === SELF_ID ? null : persona;

  useEffect(() => {
    api<{ promemoria: Promemoria[] }>("/api/v1/area/promemoria")
      .then((r) =>
        setVisit(
          r.promemoria.find(
            (x) =>
              x.kind === "visita" &&
              !x.doneAt &&
              x.profileId === pid &&
              x.dueDate >= todayIso(),
          ) ?? null,
        ),
      )
      .catch(() => setVisit(null));
  }, [pid]);

  const chosen = questions.filter((_, i) => picked[i]);

  async function add() {
    setBusy(true);
    setError(null);
    try {
      if (visit) {
        await api(`/api/v1/area/promemoria/${visit.id}`, {
          method: "PATCH",
          body: { addQuestions: chosen },
        });
        setDone({ id: visit.id });
      } else {
        const r = await api<{ id: string }>("/api/v1/area/promemoria", {
          method: "POST",
          body: {
            profileId: pid,
            kind: "visita",
            title: who ? `Visita dal medico con ${who}` : "Visita dal medico",
            dueDate: date,
            questions: chosen,
          },
        });
        setDone({ id: r.id });
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Errore");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section
      className="form-card form-card-accent mt-6"
      aria-labelledby="domande-titolo"
      data-testid="domande-nel-tempo"
    >
      <div className="flex items-center gap-3">
        <span aria-hidden className="tile-ico tile-ico-sm">
          <MessageCircleQuestion />
        </span>
        <h2 id="domande-titolo" className="form-card-title">
          Da chiedere al medico
        </h2>
      </div>
      <p className="form-card-text">
        Nate dall&apos;andamento dei numeri. Sono domande: la risposta può darla
        solo chi conosce {who ? `${who}` : "te"} e la sua storia.
      </p>
      <ul className="mt-4 space-y-1">
        {questions.map((q, i) => (
          <li key={q}>
            <label className="field-check">
              <input
                type="checkbox"
                checked={picked[i]}
                onChange={(e) =>
                  setPicked((p) =>
                    p.map((v, j) => (j === i ? e.target.checked : v)),
                  )
                }
              />
              <span>{q}</span>
            </label>
          </li>
        ))}
      </ul>
      {done ? (
        <div className="field-ok mt-4" role="status">
          <p className="field-ok-title flex items-center gap-2 font-extrabold text-ink">
            <Check aria-hidden className="h-5 w-5 text-teal" /> Domande aggiunte
            alla visita.
          </p>
          <Link
            href={`/area-personale/promemoria/${done.id}`}
            className="link mt-1 inline-flex min-h-11 items-center font-semibold"
          >
            Apri il foglio per la visita{" "}
            <ArrowRight aria-hidden className="ml-1 h-4 w-4" />
          </Link>
        </div>
      ) : visit === undefined ? null : (
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-end">
          {visit ? (
            <p className="text-[1.0625rem] text-ink-soft sm:flex-1">
              Prossima visita:{" "}
              <strong className="text-ink">{visit.title}</strong>, il{" "}
              {fmtDate(visit.dueDate)}.
            </p>
          ) : (
            <label className="block sm:flex-1">
              <span className="field-label">Quando è la visita?</span>
              <input
                type="date"
                className="field-input"
                value={date}
                min={todayIso()}
                onChange={(e) => setDate(e.target.value)}
              />
            </label>
          )}
          <button
            type="button"
            className="btn btn-primary"
            disabled={busy || chosen.length === 0 || (!visit && !date)}
            onClick={add}
          >
            {busy ? (
              <Loader2 aria-hidden className="h-5 w-5 animate-spin" />
            ) : (
              <CalendarPlus aria-hidden className="h-5 w-5" />
            )}
            {visit
              ? "Aggiungi alla visita"
              : "Crea la visita con queste domande"}
          </button>
        </div>
      )}
      {error ? (
        <p role="alert" className="field-error mt-3">
          {error}
        </p>
      ) : null}
    </section>
  );
}
