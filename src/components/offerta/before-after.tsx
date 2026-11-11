"use client";

import { useId, useState } from "react";

/** Righe del referto di esempio (sintetico, persona inesistente). Le spiegazioni descrivono, non valutano. */
const ROWS = [
  { name: "Emoglobina", value: "13,9", unit: "g/dL", range: "12,0 – 16,0", plain: "La proteina che porta l'ossigeno nel sangue. Il tuo valore è dentro l'intervallo stampato dal laboratorio." },
  { name: "Glicemia", value: "104", unit: "mg/dL", range: "70 – 99", plain: "Lo zucchero nel sangue a digiuno. È sopra l'intervallo del laboratorio: è una domanda da portare al medico.", flag: true },
  { name: "Colesterolo LDL", value: "128", unit: "mg/dL", range: "< 115", plain: "Il colesterolo che si deposita nelle arterie. Il laboratorio indica come riferimento un valore più basso.", flag: true },
  { name: "TSH", value: "1,8", unit: "mUI/L", range: "0,4 – 4,0", plain: "L'ormone che regola la tiroide. Il tuo valore è dentro l'intervallo stampato." },
];

function After() {
  return (
    <>
      <p className="eyebrow">Spiegato da Cura Privata</p>
      <ul className="mt-4 space-y-3">
        {ROWS.map((r) => (
          <li key={r.name} className={`rounded-2xl border p-4 ${r.flag ? "border-warn/40 bg-cream" : "border-line bg-mist/60"}`}>
            <p className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="text-lg font-bold text-ink">{r.name}</span>
              <span className="tabular text-lg font-bold text-ink">
                {r.value} <span className="text-[0.9375rem] font-normal text-muted">{r.unit}</span>
              </span>
            </p>
            <p className="mt-1 text-[1.0625rem] leading-snug text-ink-soft">{r.plain}</p>
          </li>
        ))}
      </ul>
    </>
  );
}

const COLS = "grid grid-cols-[1.3fr_0.6fr_0.7fr_1fr] gap-2 sm:grid-cols-[1.4fr_0.6fr_0.6fr_0.9fr]";

function Before() {
  return (
    <>
      <p className="text-[0.8125rem] font-bold uppercase tracking-wider text-[#5b6b70] sm:text-sm sm:tracking-widest">Laboratorio Analisi · referto n. 000000</p>
      <div className="mt-4 border-y border-[#d9dfe0] py-2 text-[0.8125rem] text-[#3b4a4f] sm:text-[0.9375rem]">
        <p className={`${COLS} border-b border-dashed border-[#d9dfe0] pb-2 font-bold`}>
          <span>ESAME</span>
          <span>RIS.</span>
          <span>U.M.</span>
          <span>VAL. RIF.</span>
        </p>
        {ROWS.map((r) => (
          <p key={r.name} className={`${COLS} py-3 sm:py-5`}>
            <span className="uppercase">{r.name}</span>
            <span className="font-bold">
              {r.value}
              {r.flag ? " *" : ""}
            </span>
            <span>{r.unit}</span>
            <span>{r.range}</span>
          </p>
        ))}
      </div>
      <p className="mt-3 text-sm text-[#5b6b70]">* valore fuori dall&apos;intervallo di riferimento</p>
    </>
  );
}

/**
 * «Prima e dopo»: a sinistra il referto com'è, a destra lo stesso referto spiegato, con un cursore che è un vero
 * input range (dito, mouse, tastiera, lettori di schermo). Anche su telefono, su richiesta del titolare (11/11/2026):
 * il gesto di trascinare è proprio quello che fa capire la differenza. Dati sintetici: nessuna persona reale.
 */
export function BeforeAfter() {
  const [pos, setPos] = useState(52);
  const id = useId();
  return (
    <figure className="mx-auto max-w-5xl">
      {/* Il cursore, a ogni larghezza */}
      <div className="relative overflow-hidden rounded-[1.75rem] border border-line bg-paper shadow-[var(--shadow-float)] sm:rounded-[2rem]">
        {/* DOPO (sotto): spiegato */}
        <div className="p-5 sm:p-8" aria-hidden={pos > 95}>
          <After />
        </div>
        {/* PRIMA (sopra, ritagliato dal cursore): il referto com'è */}
        <div aria-hidden className="absolute inset-0 border-r-2 border-teal bg-[#FBFBF8] p-5 font-mono sm:p-8" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <Before />
        </div>
        {/* maniglia */}
        <span aria-hidden className="pointer-events-none absolute inset-y-0 z-10 flex w-0 items-center justify-center" style={{ left: `${pos}%` }}>
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-teal text-xl font-bold text-white shadow-[var(--shadow-lift)]">↔</span>
        </span>
        <label htmlFor={id} className="sr-only">
          Sposta per confrontare il referto originale e quello spiegato
        </label>
        <input id={id} type="range" min={0} max={100} value={pos} onChange={(e) => setPos(Number(e.target.value))} className="before-after-range absolute inset-0 z-20 h-full w-full cursor-ew-resize opacity-0" />
      </div>
      <figcaption className="mt-4 flex flex-wrap justify-between gap-x-2 gap-y-1 text-[1.0625rem] text-muted">
        <span>← Il referto com&apos;è</span>
        <span className="order-last w-full text-center sm:order-none sm:w-auto">Referto di esempio, dati inventati</span>
        <span>Lo stesso, spiegato →</span>
      </figcaption>
    </figure>
  );
}
