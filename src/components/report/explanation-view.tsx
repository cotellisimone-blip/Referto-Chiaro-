"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { clsx } from "clsx";
import { ArrowDown, ArrowRight, ArrowUp, Check, ChevronDown, ChevronsUpDown, FileDown, History, MessageCircleQuestionMark, Minus, ScanEye, SlidersHorizontal } from "lucide-react";
import type { Explanation } from "@/domain/reporting/explanation-schema";
import type { ReportEnrichment } from "@/domain/reporting/enrich";
import { reportGlance, type ItemGlance } from "@/domain/reporting/glance";

const fmtDate = (d: string) => new Intl.DateTimeFormat("it-IT", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(d + "T00:00:00Z"));

const POS_ICON = { inside: Check, "above-range": ArrowUp, "below-range": ArrowDown, "not-comparable": Minus } as const;
const isOut = (g: ItemGlance) => g.position === "above-range" || g.position === "below-range";

/** Barra schematica: la fascia è l'intervallo stampato, il punto è il numero del referto. Il testo accanto dice la stessa cosa a parole. */
export function RangeBar({ glance, className }: { glance: ItemGlance; className?: string }) {
  if (!glance.bar) return null;
  const { bandStart, bandEnd, marker, ticks } = glance.bar;
  return (
    <span aria-hidden className={clsx("range-fig", className)}>
      <span className="range-bar range-bar-lg" style={{ ["--band-start" as string]: `${bandStart}%`, ["--band-end" as string]: `${bandEnd}%` }}>
        <i />
        <b className={isOut(glance) ? "out" : undefined} style={{ left: `${marker}%` }} />
      </span>
      <span className="range-ticks tabular">
        {ticks.map((t) => (
          <span key={t.at} style={{ left: `${t.at}%` }} className={t.at <= 4 ? "is-start" : t.at >= 96 ? "is-end" : undefined}>
            {t.text}
          </span>
        ))}
      </span>
    </span>
  );
}

export function PositionLabel({ glance, className }: { glance: ItemGlance; className?: string }) {
  const Icon = POS_ICON[glance.position];
  return (
    <span className={clsx("pos-label", `pos-${glance.position}`, className)}>
      <span aria-hidden className="pos-ico">
        <Icon strokeWidth={3} />
      </span>
      {glance.label}
    </span>
  );
}

/**
 * Vista del report «Capisci» (ciclo 5): prima il colpo d'occhio, poi una scheda per valore.
 * 1 A colpo d'occhio: quanti numeri sono dentro, sopra o sotto l'intervallo stampato, e quali chiedere al medico ·
 * 2 una scheda per valore, prima quelle fuori dall'intervallo: numero, barra, posizione a parole; la spiegazione si apre al tocco
 *   (già aperta per i valori fuori dall'intervallo) · 3 domande per il medico · 4 limiti.
 * La posizione è un confronto tra numeri fatto dal codice (`glance.ts`), non un giudizio clinico.
 */
export function ExplanationView({ explanation, onReveal, enrichment }: { explanation: Explanation; onReveal: (line: number) => void; enrichment?: ReportEnrichment | null }) {
  const glance = useMemo(() => reportGlance(explanation), [explanation]);
  const watch = glance.ordered.filter((r) => isOut(r.glance));
  const allIds = glance.ordered.map((r) => r.item.sourceObservationId);
  const [open, setOpen] = useState<Set<string>>(() => new Set(glance.total === 1 ? allIds : watch.map((r) => r.item.sourceObservationId)));
  const allOpen = allIds.every((id) => open.has(id));
  const setOne = (id: string, on: boolean) =>
    setOpen((prev) => {
      if (prev.has(id) === on) return prev;
      const next = new Set(prev);
      if (on) next.add(id);
      else next.delete(id);
      return next;
    });
  const jump = (id: string) => {
    setOne(id, true);
    requestAnimationFrame(() => document.getElementById(`voce-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" }));
  };

  return (
    <div className="space-y-6">
      <section className="glance" aria-labelledby="colpo-titolo" data-testid="colpo-occhio">
        <p className="eyebrow">A colpo d&apos;occhio</p>
        <h2 id="colpo-titolo" className="glance-title">
          {glance.total === 1 ? "Un valore letto" : `${glance.total} valori letti`}
          <span className="sr-only">: {glance.sentence}</span>
        </h2>
        <ul className="glance-counts" aria-hidden>
          {glance.inside ? (
            <li className="glance-count">
              <span className="glance-num tabular">{glance.inside}</span>
              <span>
                dentro l&apos;intervallo <span className="whitespace-nowrap">stampato</span>
              </span>
            </li>
          ) : null}
          {glance.above ? (
            <li className="glance-count is-out">
              <span className="glance-num tabular">{glance.above}</span>
              <span>sopra</span>
            </li>
          ) : null}
          {glance.below ? (
            <li className="glance-count is-out">
              <span className="glance-num tabular">{glance.below}</span>
              <span>sotto</span>
            </li>
          ) : null}
          {glance.notComparable ? (
            <li className="glance-count is-nc">
              <span className="glance-num tabular">{glance.notComparable}</span>
              <span>non {glance.notComparable === 1 ? "confrontabile" : "confrontabili"}</span>
            </li>
          ) : null}
        </ul>
        {watch.length ? (
          <div className="glance-watch">
            <p className="glance-watch-title">Da chiedere al medico</p>
            <ul>
              {watch.map(({ item, glance: g }) => (
                <li key={item.sourceObservationId}>
                  <a
                    href={`#voce-${item.sourceObservationId}`}
                    className="glance-watch-row"
                    onClick={(e) => {
                      e.preventDefault();
                      jump(item.sourceObservationId);
                    }}
                  >
                    <span className="min-w-0">
                      <span className="block break-words text-[1.1875rem] font-extrabold leading-snug text-ink">{item.nameExact}</span>
                      <span className="mt-0.5 block text-[1.0625rem] font-semibold text-warn">
                        <span className="tabular">
                          {item.originalValueExact} {item.originalUnitExact}
                        </span>{" "}
                        · {g.short.toLowerCase()} l&apos;intervallo stampato
                      </span>
                    </span>
                    <ArrowRight aria-hidden className="h-5 w-5 shrink-0 text-warn" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ) : glance.notComparable === 0 ? (
          <p className="glance-allin">
            <span aria-hidden className="pos-ico">
              <Check strokeWidth={3} />
            </span>
            Nessun numero è fuori dall&apos;intervallo stampato dal laboratorio.
          </p>
        ) : null}
        <p className="glance-note">È un confronto tra numeri, non un giudizio: il significato per te lo dice il medico.</p>
        <p className="glance-links">
          <a href="#domande-medico">
            <MessageCircleQuestionMark aria-hidden /> Le domande
          </a>
          <a href="#scarica-riepilogo">
            <FileDown aria-hidden /> Il PDF
          </a>
        </p>
      </section>

      <div>
        <div className="flex items-center justify-between gap-3">
          <h2 className="area-h2 min-w-0">I tuoi valori</h2>
          {glance.total > 1 ? (
            <button type="button" className="val-toggle-all" aria-pressed={allOpen} onClick={() => setOpen(new Set(allOpen ? [] : allIds))}>
              <ChevronsUpDown aria-hidden className="h-[1.125rem] w-[1.125rem]" /> {allOpen ? "Chiudi tutte" : "Apri tutte"}
            </button>
          ) : null}
        </div>
        <p className="mt-1.5 text-[1.0625rem] text-ink-soft">{watch.length && watch.length < glance.total ? "Prima quelli fuori dall'intervallo." : "Tocca una voce per aprire la spiegazione."}</p>
        <ol className="mt-4 space-y-3" aria-label="Spiegazione dei valori" data-testid="valori-colpo-occhio">
          {glance.ordered.map(({ item: it, glance: g }) => {
            const id = it.sourceObservationId;
            return (
              <li key={id} id={`voce-${id}`} className={clsx("val-card scroll-mt-28", isOut(g) && "is-out")}>
                <details open={open.has(id)} onToggle={(e) => setOne(id, e.currentTarget.open)}>
                  <summary className="val-head">
                    <span className="val-top">
                      <h3 className="val-name">{it.nameExact}</h3>
                      <span className="val-value tabular">
                        {it.originalValueExact} <span className="val-unit">{it.originalUnitExact}</span>
                      </span>
                    </span>
                    <RangeBar glance={g} className="mt-3.5" />
                    <span className="val-foot">
                      <PositionLabel glance={g} />
                      <span className="val-more">
                        <span className="val-more-text val-more-closed">Che cosa significa</span>
                        <span className="val-more-text val-more-open">Chiudi</span>
                        <span aria-hidden className="val-more-ico">
                          <ChevronDown />
                        </span>
                      </span>
                    </span>
                  </summary>
                  <div className="val-body">
                    <p className="text-lg text-ink">{it.plainLanguageDefinition}</p>
                    <p className="mt-3 text-[1.0625rem] text-ink-soft">
                      Intervallo stampato sul referto: <span className="tabular font-semibold text-ink">{it.originalReferenceExact ?? "non riportato"}</span>. {it.printedRangeNote}
                    </p>
                    {enrichment?.history[id] ? (
                      <div className="mt-4 rounded-xl bg-canvas px-4 py-3">
                        <p className="flex items-center gap-2 font-semibold text-ink">
                          <History aria-hidden className="h-5 w-5 text-teal" /> Nei tuoi referti precedenti
                        </p>
                        <ul className="mt-1 space-y-0.5 text-[1.0625rem] text-ink-soft">
                          {enrichment.history[id].map((p) => (
                            <li key={p.documentId + p.reportDate}>
                              {fmtDate(p.reportDate)}: <span className="tabular font-semibold text-ink">{p.valueExact} {p.unitExact}</span>
                              {p.referenceExact ? <span className="text-muted"> (intervallo {p.referenceExact})</span> : null}
                            </li>
                          ))}
                        </ul>
                        <p className="mt-1 text-base text-muted">Stesso esame e stessa unità di misura. Che cosa significhi la differenza lo può dire solo il medico.</p>
                      </div>
                    ) : null}
                    {enrichment?.factors[id] ? (
                      <details className="group mt-4 rounded-xl border border-line bg-paper px-4 py-2">
                        <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 font-semibold text-ink">
                          <SlidersHorizontal aria-hidden className="h-5 w-5 shrink-0 text-teal" /> Che cosa può influenzarlo, in generale
                          <ChevronDown aria-hidden className="ml-auto h-5 w-5 shrink-0 transition-transform group-open:rotate-180" />
                        </summary>
                        <ul className="mt-1 list-disc space-y-1 pb-2 pl-5 text-[1.0625rem] text-ink-soft">
                          {enrichment.factors[id].factors.map((f) => (
                            <li key={f}>{f}</li>
                          ))}
                        </ul>
                        <p className="pb-2 text-base text-muted">
                          Informazioni generali, non riferite a te. Approfondisci nella guida{" "}
                          <Link href={`/guide/${enrichment.factors[id].guideSlug}`} className="link">
                            {enrichment.factors[id].guideTitle}
                          </Link>
                          .
                        </p>
                      </details>
                    ) : null}
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-line pt-3">
                      <span className="min-w-0 flex-1 basis-64 text-base text-muted">{it.limits}</span>
                      <button type="button" className="val-source" onClick={() => onReveal(it.sourceCitation.line)}>
                        <ScanEye aria-hidden className="h-4 w-4" /> Pag. {it.sourceCitation.page}, riga {it.sourceCitation.line}
                        <span className="sr-only">: mostra {it.nameExact} nel documento</span>
                      </button>
                    </div>
                  </div>
                </details>
              </li>
            );
          })}
        </ol>
      </div>

      {explanation.excludedObservations.length ? (
        <div className="rounded-[var(--radius-lg)] border border-dashed border-muted/40 p-5 sm:p-6">
          <p className="text-lg font-semibold text-ink">Non inclusi nella spiegazione</p>
          <ul className="mt-2 space-y-1 text-[1.0625rem] text-muted">
            {explanation.excludedObservations.map((e) => (
              <li key={e.id}>
                <span className="text-ink">{e.nameExact}</span>: {e.reason}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div id="domande-medico" className="card scroll-mt-28 p-6 sm:p-7">
        <p className="eyebrow">Per la visita</p>
        <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-ink sm:text-[1.75rem]">Domande da portare al medico</h2>
        <ol className="num-list num-list-mist mt-5 text-lg leading-snug text-ink">
          {explanation.questionsForDoctor.map((q) => (
            <li key={q}>{q}</li>
          ))}
        </ol>
      </div>

      <div className="rounded-[var(--radius-lg)] bg-cream/60 p-5 text-base text-ink sm:p-6 sm:text-[1.0625rem]">
        <p className="font-semibold">Limiti di questa spiegazione</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          {explanation.limitations.map((l) => (
            <li key={l}>{l}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
