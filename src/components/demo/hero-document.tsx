"use client";

import { useEffect, useId, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { ArrowDown, FileText, Pause, Play, ScanEye } from "lucide-react";
import { clsx } from "clsx";
import lab001 from "@/fixtures/synthetic/referto-lab-001.json";
import { findGlossaryEntry } from "@/domain/reporting/glossary";

const rows = lab001.observations.filter((o) => ["obs-01", "obs-02", "obs-04", "obs-06"].includes(o.id));
const CYCLE_MS = 4200;

const MQ = "(prefers-reduced-motion: reduce)";
function subscribeMotion(cb: () => void) {
  const mq = window.matchMedia(MQ);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}
const reducedMotion = () => window.matchMedia(MQ).matches;

/**
 * Il "momento memorabile" della home: una riga tecnica del referto viene evidenziata e,
 * sotto, appare la sua traduzione in parole semplici. Scorre da sola ogni pochi secondi
 * (mai con prefers-reduced-motion) e si ferma appena la persona tocca una riga.
 */
export function HeroDocument() {
  const [selected, setSelected] = useState(rows[1].id);
  // Avvio automatico solo se il movimento è gradito (mai sul server, mai con reduced-motion).
  const reduced = useSyncExternalStore(subscribeMotion, reducedMotion, () => true);
  const [manual, setManual] = useState<"auto" | "on" | "off">("auto");
  const playing = manual === "on" || (manual === "auto" && !reduced);
  const [progress, setProgress] = useState(0);
  const panelId = useId();
  const obs = rows.find((r) => r.id === selected)!;
  const entry = findGlossaryEntry(obs.nameRaw);

  useEffect(() => {
    if (!playing) return;
    let start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = (now - start) / CYCLE_MS;
      if (t >= 1) {
        start = now;
        setSelected((cur) => rows[(rows.findIndex((r) => r.id === cur) + 1) % rows.length].id);
        setProgress(0);
      } else setProgress(t);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing]);

  function choose(id: string) {
    setManual("off");
    setSelected(id);
  }

  const R = 9;
  const circ = 2 * Math.PI * R;

  return (
    <div className="relative">
      <div aria-hidden className="absolute -inset-6 -z-10 rounded-[40px] bg-[radial-gradient(60%_60%_at_70%_20%,var(--color-cream),transparent_70%)]" />
      <div aria-hidden className="absolute -right-3 top-10 -z-10 h-[88%] w-[92%] rotate-3 rounded-[24px] border border-line bg-paper/70 shadow-[var(--shadow-card)]" />
      <div className="card overflow-hidden shadow-[var(--shadow-float)]">
        <div className="flex items-center justify-between gap-2 border-b border-line bg-mist/60 px-4 py-3 sm:px-5">
          <span className="inline-flex min-w-0 items-center gap-2 whitespace-nowrap text-sm font-semibold text-ink">
            <FileText aria-hidden className="h-4 w-4 shrink-0 text-teal" /> <span className="truncate">Referto<span className="hidden sm:inline"> di laboratorio</span></span>
          </span>
          <span className="flex items-center gap-2">
            <span className="chip shrink-0 bg-cream text-ink">Esempio sintetico</span>
            <button
              type="button"
              onClick={() => {
                setManual(playing ? "off" : "on");
              }}
              aria-pressed={playing}
              className="relative inline-flex h-9 w-9 items-center justify-center rounded-full border border-line bg-paper text-ink hover:bg-mist"
            >
              <svg aria-hidden className="absolute inset-0 h-full w-full -rotate-90" viewBox="0 0 24 24" fill="none">
                <circle
                  cx="12"
                  cy="12"
                  r={R}
                  stroke="var(--color-teal)"
                  strokeWidth="2"
                  strokeDasharray={circ}
                  strokeDashoffset={circ * (1 - (playing ? progress : 0))}
                  strokeLinecap="round"
                  className="progress-ring"
                />
              </svg>
              {playing ? <Pause aria-hidden className="h-3.5 w-3.5" /> : <Play aria-hidden className="ml-0.5 h-3.5 w-3.5" />}
              <span className="sr-only">{playing ? "Ferma lo scorrimento automatico" : "Avvia lo scorrimento automatico"}</span>
            </button>
          </span>
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
                    onClick={() => choose(r.id)}
                    className={clsx(
                      "grid min-h-12 w-full grid-cols-[1fr_auto] items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors duration-300 sm:grid-cols-[1fr_auto_auto]",
                      active ? "translate-sweep bg-strong text-on-strong shadow-[0_8px_20px_-10px_rgb(22_45_57_/_0.6)]" : "hover:bg-mist",
                    )}
                  >
                    <span className="truncate text-[0.9375rem] font-medium">{r.nameRaw}</span>
                    <span className="tabular font-mono text-[0.9375rem] font-semibold">
                      {r.valueRaw} <span className={active ? "text-on-strong-soft" : "text-muted"}>{r.unitRaw}</span>
                    </span>
                    <span className={clsx("tabular hidden font-mono text-sm sm:inline", active ? "text-on-strong-soft" : "text-muted")}>
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
          <p key={obs.id} className="fade-in mt-2 min-h-[4.5rem] font-serif text-[1.25rem] leading-snug text-ink">
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
        <Link href="/referti/esempio" className="link">
          Prova il percorso completo
        </Link>
      </p>
    </div>
  );
}
