"use client";

import { useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { clsx } from "clsx";
import { Stepper } from "@/components/report/stepper";
import { ArrowLeft, ArrowRight, Briefcase, Copy, Info, ListChecks, MessageCircleQuestionMark, PencilLine, Printer, RotateCcw, type LucideIcon } from "lucide-react";
import { HAVE, TOPICS, VISIT_TYPES, buildVisitPlan, parseVisitParams, type HaveId, type TopicId, type VisitType } from "@/content/preparati-visita";

const STEPS = ["Che visita è", "Che cosa hai", "Di che cosa parlare"];

/**
 * «Preparati alla visita in 2 minuti». Tre domande pratiche (che visita, che cosa hai, di che cosa vuoi parlare)
 * → una lista da portare. Nessun sintomo, nessun valore, nessun dato personale: lo stato sta solo nell'URL
 * (identificatori fissi) e nel browser.
 */
export function VisitPrep() {
  const params = useSearchParams();
  const initial = useMemo(() => parseVisitParams(params), [params]);
  const [type, setType] = useState<VisitType | null>(initial.type);
  const [have, setHave] = useState<HaveId[]>(initial.have);
  const [topics, setTopics] = useState<TopicId[]>(initial.topics);
  const [step, setStep] = useState(initial.type ? 4 : 1);
  const [copied, setCopied] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);
  const plan = buildVisitPlan({ type, have, topics });

  function sync(next: { type?: VisitType | null; have?: HaveId[]; topics?: TopicId[] }) {
    const t = next.type !== undefined ? next.type : type;
    const h = next.have ?? have;
    const tp = next.topics ?? topics;
    const sp = new URLSearchParams();
    if (t) sp.set("tipo", t);
    if (h.length) sp.set("ho", h.join(","));
    if (tp.length) sp.set("temi", tp.join(","));
    window.history.replaceState(null, "", `${window.location.pathname}${sp.size ? `?${sp}` : ""}`);
  }
  const go = (n: number) => {
    setStep(n);
    requestAnimationFrame(() => topRef.current?.focus());
  };
  const toggle = <T extends string>(list: T[], id: T) => (list.includes(id) ? list.filter((x) => x !== id) : [...list, id]);

  const text = [
    "PREPARATI ALLA VISITA — Cura Privata",
    "",
    "Da portare:",
    ...plan.bring.map((x) => `[ ] ${x}`),
    "",
    "Da preparare prima:",
    ...plan.prepare.map((x) => `[ ] ${x}`),
    "",
    "Da chiedere al medico:",
    ...plan.ask.map((x, i) => `${i + 1}. ${x}`),
  ].join("\n");

  const COLS: { title: string; short: string; icon: LucideIcon; items: string[]; check: boolean }[] = [
    { title: "Da portare", short: "Da portare", icon: Briefcase, items: plan.bring, check: true },
    { title: "Da preparare prima", short: "Da preparare", icon: PencilLine, items: plan.prepare, check: true },
    { title: "Da chiedere al medico", short: "Da chiedere", icon: MessageCircleQuestionMark, items: plan.ask, check: false },
  ];

  return (
    <div className="container-rc tool-body">
      {step <= 3 ? (
        <div className="grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[minmax(0,46rem)_minmax(0,21rem)] lg:justify-between lg:gap-14">
          <div ref={topRef} tabIndex={-1} className="pdp-top min-w-0 outline-none">
            <p className="sr-only" aria-live="polite">
              Passo {step} di {STEPS.length}: {STEPS[step - 1]}
            </p>
            <Stepper steps={STEPS} step={step - 1} label="Avanzamento" className="mb-8" />
            {step === 1 ? (
              <fieldset>
                <legend className="pdp-q">Che visita hai in programma?</legend>
                <p className="mt-2 text-lg text-muted">Una sola scelta: la lista cambia in base alla visita.</p>
                <div className="mt-5 grid gap-3">
                  {VISIT_TYPES.map((v) => (
                    <label key={v.id} className={clsx("pdp-option", type === v.id && "is-on")}>
                      <input
                        type="radio"
                        name="tipo"
                        checked={type === v.id}
                        onChange={() => {
                          setType(v.id);
                          sync({ type: v.id });
                        }}
                      />
                      <span className="text-lg font-semibold text-ink">{v.label}</span>
                    </label>
                  ))}
                </div>
                <div className="no-print mt-8 flex gap-3">
                  <button type="button" className="btn btn-primary btn-lg w-full sm:w-auto sm:min-w-48" disabled={!type} onClick={() => go(2)}>
                    Avanti <ArrowRight aria-hidden className="btn-arrow h-5 w-5" />
                  </button>
                </div>
              </fieldset>
            ) : null}

            {step === 2 ? (
              <fieldset>
                <legend className="pdp-q">Che cosa hai già, o prendi?</legend>
                <p className="mt-2 text-lg text-muted">Spunta quello che vale per te. Puoi anche non spuntare nulla.</p>
                <div className="mt-5 grid gap-3">
                  {HAVE.map((h) => (
                    <label key={h.id} className={clsx("pdp-option", have.includes(h.id) && "is-on")}>
                      <input
                        type="checkbox"
                        checked={have.includes(h.id)}
                        onChange={() => {
                          const n = toggle(have, h.id);
                          setHave(n);
                          sync({ have: n });
                        }}
                      />
                      <span className="text-lg font-semibold text-ink">{h.label}</span>
                    </label>
                  ))}
                </div>
                <div className="no-print mt-8 flex flex-col-reverse gap-3 sm:flex-row">
                  <button type="button" className="btn btn-secondary btn-lg" onClick={() => go(1)}>
                    <ArrowLeft aria-hidden className="h-5 w-5" /> Indietro
                  </button>
                  <button type="button" className="btn btn-primary btn-lg sm:min-w-48" onClick={() => go(3)}>
                    Avanti <ArrowRight aria-hidden className="btn-arrow h-5 w-5" />
                  </button>
                </div>
              </fieldset>
            ) : null}

            {step === 3 ? (
              <fieldset>
                <legend className="pdp-q">Di che cosa vuoi parlare?</legend>
                <p className="mt-2 text-lg text-muted">Scegli uno o più argomenti: ti suggeriamo le domande da fare.</p>
                <div className="mt-5 grid gap-3">
                  {TOPICS.map((t) => (
                    <label key={t.id} className={clsx("pdp-option", topics.includes(t.id) && "is-on")}>
                      <input
                        type="checkbox"
                        checked={topics.includes(t.id)}
                        onChange={() => {
                          const n = toggle(topics, t.id);
                          setTopics(n);
                          sync({ topics: n });
                        }}
                      />
                      <span className="text-lg font-semibold text-ink">{t.label}</span>
                    </label>
                  ))}
                </div>
                <div className="no-print mt-8 flex flex-col-reverse gap-3 sm:flex-row">
                  <button type="button" className="btn btn-secondary btn-lg" onClick={() => go(2)}>
                    <ArrowLeft aria-hidden className="h-5 w-5" /> Indietro
                  </button>
                  <button type="button" className="btn btn-primary btn-lg" onClick={() => go(4)}>
                    <ListChecks aria-hidden className="h-5 w-5" /> Crea la mia lista
                  </button>
                </div>
              </fieldset>
            ) : null}
          </div>

          <aside aria-label="La tua lista, finora" className="pdp-aside no-print hidden lg:block">
            <p className="text-xl font-extrabold text-ink">La tua lista, finora</p>
            <dl className="pdp-aside-stats">
              {COLS.map(({ short, icon: Icon, items }) => (
                <div key={short}>
                  <dt>
                    <span aria-hidden className="pdp-ico pdp-ico-sm">
                      <Icon strokeWidth={2} />
                    </span>
                    <span>{short}</span>
                  </dt>
                  <dd className="stat-num">
                    {items.length} <span className="text-[0.75em] font-semibold">{items.length === 1 ? "voce" : "voci"}</span>
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-5 flex items-start gap-2 text-[0.9375rem] text-muted">
              <Info aria-hidden className="mt-0.5 h-4 w-4 shrink-0" />
              Si aggiorna a ogni risposta. Non chiediamo sintomi, valori o dati personali.
            </p>
          </aside>
        </div>
      ) : null}

      {step === 4 ? (
        <div ref={topRef} tabIndex={-1} className="pdp-top outline-none">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="eyebrow">La tua lista</p>
              <h2 className="display-lg mt-3">Pronto per la visita.</h2>
            </div>
            <div className="no-print flex flex-col gap-2.5 sm:flex-row sm:flex-wrap">
              <button type="button" className="btn btn-primary" onClick={() => window.print()}>
                <Printer aria-hidden className="h-5 w-5" /> Stampa
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(text);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2500);
                  } catch {
                    setCopied(false);
                  }
                }}
              >
                <Copy aria-hidden className="h-5 w-5" /> {copied ? "Copiata" : "Copia il testo"}
              </button>
              <button type="button" className="btn btn-ghost" onClick={() => go(1)}>
                <RotateCcw aria-hidden className="h-5 w-5" /> Modifica
              </button>
            </div>
          </div>
          <div className="mt-8 grid grid-cols-[minmax(0,1fr)] gap-4 sm:gap-5 lg:grid-cols-3">
            {COLS.map(({ title, icon: Icon, items, check }) => (
              <section key={title} aria-labelledby={`col-${title}`} className="list-col">
                <h3 id={`col-${title}`} className="list-col-head">
                  <span aria-hidden className="tile-ico tile-ico-sm">
                    <Icon />
                  </span>
                  {title}
                  <span aria-hidden className="list-col-count">
                    {items.length}
                  </span>
                </h3>
                {check ? (
                  <ul className="tick-list">
                    {items.map((x) => (
                      <li key={x}>
                        <label>
                          <input type="checkbox" />
                          <span>{x}</span>
                        </label>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <ol className="num-list num-list-mist mt-5 text-[1.0625rem] leading-snug text-ink">
                    {items.map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ol>
                )}
              </section>
            ))}
          </div>
          <p className="mt-7 text-lg text-ink-soft">
            Hai fatto degli esami?{" "}
            <Link href="/strumenti/domande-per-il-medico" className="link font-semibold">
              Aggiungi le domande specifiche per ogni esame
            </Link>
            .
          </p>
          <p className="mt-2 text-base text-muted">Questa lista non dice nulla sulla tua salute e non sostituisce il colloquio con il medico. In caso di emergenza chiama il 112.</p>
        </div>
      ) : null}
    </div>
  );
}
