"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { ArrowDown, FileText, ScanEye } from "lucide-react";
import { clsx } from "clsx";
import lab001 from "@/fixtures/synthetic/referto-lab-001.json";
import { findGlossaryEntry } from "@/domain/reporting/glossary";

const rows = lab001.observations.filter((o) => ["obs-01", "obs-02", "obs-04", "obs-06"].includes(o.id));

/** La riga del referto a sinistra, il suo significato comprensibile sotto: prova visiva in homepage. */
export function HeroDocument() {
  const [selected, setSelected] = useState(rows[1].id);
  const panelId = useId();
  const obs = rows.find((r) => r.id === selected)!;
  const entry = findGlossaryEntry(obs.nameRaw);

  return (
    <div className="relative">
      <div aria-hidden className="absolute -inset-6 -z-10 rounded-[40px] bg-[radial-gradient(60%_60%_at_70%_20%,var(--color-cream),transparent_70%)]" />
      <div className="card overflow-hidden shadow-[var(--shadow-lift)]">
        <div className="flex items-center justify-between gap-3 border-b border-line bg-mist/60 px-5 py-3">
          <span className="inline-flex items-center gap-2 whitespace-nowrap text-sm font-semibold text-ink">
            <FileText aria-hidden className="h-4 w-4 text-teal" /> Referto di laboratorio
          </span>
          <span className="chip shrink-0 bg-cream text-ink">Esempio sintetico</span>
        </div>

        <div className="px-3 pb-2 pt-3 sm:px-5">
          <p id={`${panelId}-label`} className="px-2 pb-2 text-sm text-muted">
            Tocca una riga per leggerla in parole semplici
          </p>
          <ul aria-labelledby={`${panelId}-label`} className="space-y-1">
            {rows.map((r) => {
              const active = r.id === selected;
              return (
                <li key={r.id}>
                  <button
                    type="button"
                    aria-pressed={active}
                    aria-controls={panelId}
                    onClick={() => setSelected(r.id)}
                    className={clsx(
                      "grid min-h-12 w-full grid-cols-[1fr_auto] items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors duration-150 sm:grid-cols-[1fr_auto_auto]",
                      active ? "bg-ink text-white" : "hover:bg-mist",
                    )}
                  >
                    <span className="truncate text-[0.9375rem] font-medium">{r.nameRaw}</span>
                    <span className="tabular font-mono text-[0.9375rem] font-semibold">
                      {r.valueRaw} <span className={active ? "text-white/75" : "text-muted"}>{r.unitRaw}</span>
                    </span>
                    <span className={clsx("tabular hidden font-mono text-sm sm:inline", active ? "text-white/75" : "text-muted")}>
                      [{r.referenceRaw}]
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="flex justify-center py-1" aria-hidden>
          <ArrowDown className="h-5 w-5 text-sage" />
        </div>

        <div id={panelId} aria-live="polite" className="mx-3 mb-3 rounded-2xl bg-mist px-5 py-4 sm:mx-5 sm:mb-5">
          <p className="eyebrow">In parole semplici</p>
          <p key={obs.id} className="fade-in mt-2 text-[1.0625rem] leading-relaxed text-ink">
            {entry?.definition}
          </p>
          <p className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted">
            <ScanEye aria-hidden className="h-4 w-4 text-teal" />
            <span>
              Nel documento: <strong className="tabular text-ink">{obs.valueRaw} {obs.unitRaw}</strong> · pagina {obs.sourcePage}, riga {obs.sourceLine}
            </span>
          </p>
        </div>
      </div>
      <p className="mt-3 text-center text-sm text-muted">
        Valori inventati.{" "}
        <Link href="/esempio" className="link">
          Prova il percorso completo
        </Link>
      </p>
    </div>
  );
}
