"use client";

import { useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { clsx } from "clsx";
import { ArrowLeft, ArrowRight, Check, ClipboardList, Copy, ListChecks, Printer, RotateCcw } from "lucide-react";
import { HAVE, TOPICS, VISIT_TYPES, buildVisitPlan, parseVisitParams, type HaveId, type TopicId, type VisitType } from "@/content/preparati-visita";

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

  const STEPS = ["Che visita è", "Che cosa hai", "Di che cosa parlare"];

  return (
    <div className="container-rc py-10 sm:py-14">
      <div ref={topRef} tabIndex={-1} className="outline-none" aria-live="polite">
        {step <= 3 ? (
          <ol className="no-print flex flex-wrap gap-2" aria-label="Avanzamento">
            {STEPS.map((s, i) => (
              <li key={s} aria-current={step === i + 1 ? "step" : undefined} className={clsx("chip", step === i + 1 ? "bg-strong text-on-strong" : step > i + 1 ? "bg-marker-soft text-teal-deep" : "bg-mist text-muted")}>
                {step > i + 1 ? <Check aria-hidden className="h-4 w-4" /> : null}
                {i + 1}. {s}
              </li>
            ))}
          </ol>
        ) : null}
      </div>

      {step === 1 ? (
        <fieldset className="mt-8 max-w-2xl">
          <legend className="text-[1.75rem] font-bold leading-tight text-ink">Che visita hai in programma?</legend>
          <div className="mt-5 grid gap-3">
            {VISIT_TYPES.map((v) => (
              <label key={v.id} className={clsx("flex min-h-14 cursor-pointer items-center gap-4 rounded-2xl border bg-paper px-5 py-3 text-lg font-semibold text-ink", type === v.id ? "border-teal bg-mist" : "border-line hover:border-teal/50")}>
                <input
                  type="radio"
                  name="tipo"
                  checked={type === v.id}
                  onChange={() => {
                    setType(v.id);
                    sync({ type: v.id });
                  }}
                  className="h-5 w-5 accent-[var(--color-teal)]"
                />
                {v.label}
              </label>
            ))}
          </div>
          <button type="button" className="btn btn-primary btn-lg mt-8" disabled={!type} onClick={() => go(2)}>
            Avanti <ArrowRight aria-hidden className="btn-arrow h-5 w-5" />
          </button>
        </fieldset>
      ) : null}

      {step === 2 ? (
        <fieldset className="mt-8 max-w-2xl">
          <legend className="text-[1.75rem] font-bold leading-tight text-ink">Che cosa hai già, o prendi?</legend>
          <p className="mt-2 text-lg text-muted">Spunta quello che vale per te. Puoi anche non spuntare nulla.</p>
          <div className="mt-5 grid gap-3">
            {HAVE.map((h) => (
              <label key={h.id} className={clsx("flex min-h-14 cursor-pointer items-center gap-4 rounded-2xl border bg-paper px-5 py-3 text-lg font-semibold text-ink", have.includes(h.id) ? "border-teal bg-mist" : "border-line hover:border-teal/50")}>
                <input
                  type="checkbox"
                  checked={have.includes(h.id)}
                  onChange={() => {
                    const n = toggle(have, h.id);
                    setHave(n);
                    sync({ have: n });
                  }}
                  className="h-5 w-5 accent-[var(--color-teal)]"
                />
                {h.label}
              </label>
            ))}
          </div>
          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row">
            <button type="button" className="btn btn-ghost btn-lg" onClick={() => go(1)}>
              <ArrowLeft aria-hidden className="h-5 w-5" /> Indietro
            </button>
            <button type="button" className="btn btn-primary btn-lg" onClick={() => go(3)}>
              Avanti <ArrowRight aria-hidden className="btn-arrow h-5 w-5" />
            </button>
          </div>
        </fieldset>
      ) : null}

      {step === 3 ? (
        <fieldset className="mt-8 max-w-2xl">
          <legend className="text-[1.75rem] font-bold leading-tight text-ink">Di che cosa vuoi parlare?</legend>
          <p className="mt-2 text-lg text-muted">Scegli uno o più argomenti: ti suggeriamo le domande da fare.</p>
          <div className="mt-5 grid gap-3">
            {TOPICS.map((t) => (
              <label key={t.id} className={clsx("flex min-h-14 cursor-pointer items-center gap-4 rounded-2xl border bg-paper px-5 py-3 text-lg font-semibold text-ink", topics.includes(t.id) ? "border-teal bg-mist" : "border-line hover:border-teal/50")}>
                <input
                  type="checkbox"
                  checked={topics.includes(t.id)}
                  onChange={() => {
                    const n = toggle(topics, t.id);
                    setTopics(n);
                    sync({ topics: n });
                  }}
                  className="h-5 w-5 accent-[var(--color-teal)]"
                />
                {t.label}
              </label>
            ))}
          </div>
          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row">
            <button type="button" className="btn btn-ghost btn-lg" onClick={() => go(2)}>
              <ArrowLeft aria-hidden className="h-5 w-5" /> Indietro
            </button>
            <button type="button" className="btn btn-primary btn-lg" onClick={() => go(4)}>
              <ListChecks aria-hidden className="h-5 w-5" /> Crea la mia lista
            </button>
          </div>
        </fieldset>
      ) : null}

      {step === 4 ? (
        <div className="mt-2">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow">La tua lista</p>
              <h2 className="display-lg mt-3 text-[2rem] sm:text-[2.5rem]">Pronto per la visita.</h2>
            </div>
            <div className="no-print flex flex-wrap gap-2">
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
          <div className="mt-8 grid gap-5 lg:grid-cols-3">
            {[
              { title: "Da portare", items: plan.bring, check: true },
              { title: "Da preparare prima", items: plan.prepare, check: true },
              { title: "Da chiedere al medico", items: plan.ask, check: false },
            ].map((col) => (
              <section key={col.title} aria-labelledby={`col-${col.title}`} className="card p-6">
                <h3 id={`col-${col.title}`} className="flex items-center gap-2 text-xl font-bold text-ink">
                  <ClipboardList aria-hidden className="h-5 w-5 text-teal" /> {col.title}
                </h3>
                {col.check ? (
                  <ul className="mt-4 space-y-3">
                    {col.items.map((x) => (
                      <li key={x}>
                        <label className="flex items-start gap-3 text-lg text-ink">
                          <input type="checkbox" className="mt-1.5 h-5 w-5 shrink-0 accent-[var(--color-teal)]" />
                          {x}
                        </label>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <ol className="mt-4 list-decimal space-y-3 pl-6 text-lg text-ink">
                    {col.items.map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ol>
                )}
              </section>
            ))}
          </div>
          <p className="mt-6 text-[1.0625rem] text-ink-soft">
            Hai fatto degli esami?{" "}
            <Link href="/strumenti/domande-per-il-medico" className="link font-semibold">
              Aggiungi le domande specifiche per ogni esame
            </Link>
            .
          </p>
          <p className="mt-2 text-[0.9375rem] text-muted">Questa lista non dice nulla sulla tua salute e non sostituisce il colloquio con il medico. In caso di emergenza chiama il 112.</p>
        </div>
      ) : null}
    </div>
  );
}
