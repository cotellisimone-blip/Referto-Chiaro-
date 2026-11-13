"use client";

import Link from "next/link";
import { ChevronDown, History, ScanEye, SlidersHorizontal } from "lucide-react";
import type { Explanation } from "@/domain/reporting/explanation-schema";
import type { ReportEnrichment } from "@/domain/reporting/enrich";

const fmtDate = (d: string) => new Intl.DateTimeFormat("it-IT", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(d + "T00:00:00Z"));

/**
 * Vista del report «Capisci»: prima la sintesi e il colpo d'occhio sui valori, poi i dettagli su richiesta.
 * 1 In una frase · 2 i valori originali (valore, unità, intervallo, provenienza) · 3 cosa significa ·
 * 4 posizione rispetto all'intervallo stampato · 5 cosa può influenzarlo, in generale (dalle guide) ·
 * 6 referti precedenti, solo se confrontabili · 7 domande per il medico.
 */
export function ExplanationView({ explanation, onReveal, enrichment }: { explanation: Explanation; onReveal: (line: number) => void; enrichment?: ReportEnrichment | null }) {
  return (
    <div className="space-y-6">
      <div className="grain relative overflow-hidden rounded-[var(--radius-lg)] bg-mist p-6 sm:p-7">
        <p className="eyebrow">In una frase</p>
        <p className="mt-3 font-serif text-[1.375rem] leading-snug text-ink sm:text-2xl">{explanation.summary}</p>
      </div>

      <div className="card overflow-hidden" data-testid="valori-colpo-occhio">
        <h2 className="px-5 pt-5 text-xl font-bold text-ink sm:px-6">I tuoi valori, come sono scritti nel referto</h2>
        <div className="mt-3">
          <table className="w-full text-left text-[1rem] sm:text-[1.0625rem]">
            <thead className="border-y border-line bg-canvas text-[0.9375rem] text-muted">
              <tr>
                <th scope="col" className="px-4 py-2 font-semibold sm:px-6">Esame</th>
                <th scope="col" className="px-2 py-2 font-semibold sm:px-3">Valore</th>
                <th scope="col" className="hidden px-3 py-2 font-semibold sm:table-cell">Intervallo stampato</th>
                <th scope="col" className="px-3 py-2 font-semibold sm:px-6">Dove</th>
              </tr>
            </thead>
            <tbody>
              {explanation.items.map((it) => (
                <tr key={it.sourceObservationId} className="border-b border-line last:border-0">
                  <th scope="row" className="break-words px-4 py-3 font-semibold text-ink sm:px-6">
                    <a href={`#voce-${it.sourceObservationId}`} className="hover:underline">{it.nameExact}</a>
                  </th>
                  {/* Ciclo 3, fase 2: valore e unità sulla stessa riga anche su telefono, nel carattere del sito. */}
                  <td className="tabular whitespace-nowrap px-2 py-3 font-semibold text-ink sm:px-3">
                    {it.originalValueExact} <span className="font-normal text-muted">{it.originalUnitExact}</span>
                  </td>
                  <td className="tabular hidden px-3 py-3 text-ink-soft sm:table-cell">{it.originalReferenceExact ?? "—"}</td>
                  <td className="px-3 py-3 sm:px-6">
                    <button type="button" className="inline-flex min-h-11 items-center gap-1.5 whitespace-nowrap text-[0.9375rem] font-semibold text-teal-deep hover:underline" onClick={() => onReveal(it.sourceCitation.line)}>
                      <ScanEye aria-hidden className="h-4 w-4 shrink-0" /> p.&nbsp;{it.sourceCitation.page}, r.&nbsp;{it.sourceCitation.line}
                      <span className="sr-only">: mostra {it.nameExact} nel documento</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <h2 className="text-xl font-bold text-ink">Che cosa significa, voce per voce</h2>
      <ol className="space-y-4" aria-label="Spiegazione dei valori">
        {explanation.items.map((it, i) => (
          <li key={it.sourceObservationId} id={`voce-${it.sourceObservationId}`} className="card relative scroll-mt-28 overflow-hidden p-5 pl-6 sm:p-6 sm:pl-7">
            <span aria-hidden className="absolute inset-y-0 left-0 w-1.5 bg-[linear-gradient(180deg,var(--color-teal),var(--color-sage))]" />
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
              <h3 className="flex items-baseline gap-3 text-xl font-semibold text-ink">
                <span className="num text-xl text-sage-deep" aria-hidden>
                  {String(i + 1).padStart(2, "0")}
                </span>
                {it.nameExact}
              </h3>
              <p className="tabular whitespace-nowrap rounded-full bg-canvas px-3.5 py-1.5 text-[1.0625rem]">
                <strong className="text-ink">{it.originalValueExact}</strong> <span className="text-muted">{it.originalUnitExact}</span>
              </p>
            </div>
            <p className="mt-4 text-lg text-ink">{it.plainLanguageDefinition}</p>
            <p className="mt-3 text-[1.0625rem] text-ink-soft">
              Intervallo stampato: <span className="tabular font-semibold text-ink">{it.originalReferenceExact}</span>. {it.printedRangeNote}
            </p>
            {enrichment?.history[it.sourceObservationId] ? (
              <div className="mt-4 rounded-xl bg-canvas px-4 py-3">
                <p className="flex items-center gap-2 font-semibold text-ink">
                  <History aria-hidden className="h-5 w-5 text-teal" /> Nei tuoi referti precedenti
                </p>
                <ul className="mt-1 space-y-0.5 text-[1.0625rem] text-ink-soft">
                  {enrichment.history[it.sourceObservationId].map((p) => (
                    <li key={p.documentId + p.reportDate}>
                      {fmtDate(p.reportDate)}: <span className="tabular font-semibold text-ink">{p.valueExact} {p.unitExact}</span>
                      {p.referenceExact ? <span className="text-muted"> (intervallo {p.referenceExact})</span> : null}
                    </li>
                  ))}
                </ul>
                <p className="mt-1 text-base text-muted">Stesso esame e stessa unità di misura. Che cosa significhi la differenza lo può dire solo il medico.</p>
              </div>
            ) : null}
            {enrichment?.factors[it.sourceObservationId] ? (
              <details className="group mt-4 rounded-xl border border-line px-4 py-2">
                <summary className="flex min-h-11 cursor-pointer list-none items-center gap-2 font-semibold text-ink">
                  <SlidersHorizontal aria-hidden className="h-5 w-5 text-teal" /> Che cosa può influenzarlo, in generale
                  <ChevronDown aria-hidden className="ml-auto h-5 w-5 transition-transform group-open:rotate-180" />
                </summary>
                <ul className="mt-1 list-disc space-y-1 pb-2 pl-5 text-[1.0625rem] text-ink-soft">
                  {enrichment.factors[it.sourceObservationId].factors.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                <p className="pb-2 text-base text-muted">
                  Informazioni generali, non riferite a te. Approfondisci nella guida{" "}
                  <Link href={`/guide/${enrichment.factors[it.sourceObservationId].guideSlug}`} className="link">
                    {enrichment.factors[it.sourceObservationId].guideTitle}
                  </Link>
                  .
                </p>
              </details>
            ) : null}
            <div className="mt-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t border-line pt-3">
              <span className="min-w-0 flex-1 basis-64 text-base text-muted">{it.limits}</span>
              <button
                type="button"
                className="inline-flex min-h-11 items-center gap-1.5 rounded-full bg-mist px-4 text-[0.9375rem] font-semibold text-teal-deep hover:bg-line/60"
                onClick={() => onReveal(it.sourceCitation.line)}
              >
                <ScanEye aria-hidden className="h-4 w-4" /> Pag. {it.sourceCitation.page}, riga {it.sourceCitation.line}
                <span className="sr-only">: mostra {it.nameExact} nel documento</span>
              </button>
            </div>
          </li>
        ))}
      </ol>

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

      <div className="card p-6 sm:p-7">
        <p className="eyebrow">Per la visita</p>
        <h3 className="mt-3 text-2xl font-extrabold tracking-tight text-ink sm:text-[1.75rem]">Domande da portare al medico</h3>
        <ol className="num-list num-list-mist mt-5 text-lg leading-snug text-ink">
          {explanation.questionsForDoctor.map((q) => (
            <li key={q}>{q}</li>
          ))}
        </ol>
      </div>

      <div className="rounded-[var(--radius-lg)] bg-cream/60 p-5 text-[1.0625rem] text-ink sm:p-6">
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
