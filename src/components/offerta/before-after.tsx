"use client";

import { useId, useState } from "react";
import { MoveHorizontal } from "lucide-react";

/** Righe del referto di esempio (sintetico, persona inesistente). Le spiegazioni descrivono, non valutano. */
const ROWS = [
  { name: "Glicemia", value: "92", unit: "mg/dL", range: "70 – 99", plain: "Lo zucchero nel sangue al momento del prelievo. Il tuo valore è dentro l'intervallo stampato dal laboratorio." },
  { name: "Emoglobina glicata", value: "5,1", unit: "%", range: "4,0 – 5,6", plain: "La media dello zucchero nel sangue nelle settimane prima del prelievo. Dentro l'intervallo stampato." },
  { name: "Colesterolo LDL", value: "134", unit: "mg/dL", range: "< 115", plain: "Il colesterolo che si deposita nelle arterie. Il laboratorio indica come riferimento un valore più basso: è una domanda da portare al medico.", flag: true },
  { name: "Creatinina", value: "0,89", unit: "mg/dL", range: "0,70 – 1,20", plain: "Una sostanza prodotta dai muscoli ed eliminata dai reni. Il tuo valore è dentro l'intervallo stampato." },
];

/** Su telefono una riga in meno (la stessa nei due fogli): il confronto resta chiaro e la pagina più corta. */
const ONLY_WIDE = "Emoglobina glicata";

function After() {
  return (
    <>
      <ul className="mt-11 space-y-3">
        {ROWS.map((r) => (
          <li key={r.name} className={`rounded-2xl border p-4 ${r.flag ? "border-warn/35 bg-cream" : "border-line bg-canvas"} ${r.name === ONLY_WIDE ? "hidden sm:block" : ""}`}>
            <p className="flex flex-wrap items-baseline justify-between gap-2">
              <span className="text-lg font-extrabold text-ink">{r.name}</span>
              <span className="tabular text-lg font-extrabold text-ink">
                {r.value} <span className="text-[0.9375rem] font-medium text-muted">{r.unit}</span>
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
      <p className="mt-11 text-[0.8125rem] font-bold uppercase tracking-wider text-[#5b6b70] sm:text-sm sm:tracking-widest">Laboratorio Analisi · referto n. 000000</p>
      <div className="mt-3 border-y border-[#d9dfe0] py-2 text-[0.8125rem] text-[#3b4a4f] sm:text-[0.9375rem]">
        <p className={`${COLS} border-b border-dashed border-[#d9dfe0] pb-2 font-bold`}>
          <span>ESAME</span>
          <span>RIS.</span>
          <span>U.M.</span>
          <span>VAL. RIF.</span>
        </p>
        {ROWS.map((r) => (
          <p key={r.name} className={`${COLS} py-3 sm:py-5 ${r.name === ONLY_WIDE ? "max-sm:hidden" : ""}`}>
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
      <div className="ba-frame">
        {/* DOPO (sotto): spiegato */}
        <div className="p-5 sm:p-8" aria-hidden={pos > 95}>
          <After />
        </div>
        {/* PRIMA (sopra, ritagliato dal cursore): il referto com'è. Resta carta chiara anche nel tema scuro. */}
        <div aria-hidden className="absolute inset-0 border-r-2 border-teal bg-[#FBFBF8] p-5 font-mono sm:p-8" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <Before />
        </div>
        {/* Le due etichette restano agli angoli; ognuna sparisce quando il suo foglio è quasi coperto. */}
        <span aria-hidden className="ba-tag left-5 bg-[#e9ecea] text-[#44545a] sm:left-8" data-off={pos < 16 ? "" : undefined}>
          <span className="sm:hidden">Prima</span>
          <span className="hidden sm:inline">Il referto com&apos;è</span>
        </span>
        <span aria-hidden className="ba-tag right-5 bg-marker-soft text-teal-deep sm:right-8" data-off={pos > 84 ? "" : undefined}>
          <span className="sm:hidden">Dopo</span>
          <span className="hidden sm:inline">Spiegato da Cura Privata</span>
        </span>
        {/* maniglia */}
        <span aria-hidden className="pointer-events-none absolute inset-y-0 z-10 flex w-0 items-center justify-center" style={{ left: `${pos}%` }}>
          <span className="ba-handle">
            <MoveHorizontal className="h-6 w-6" strokeWidth={2.2} />
          </span>
        </span>
        <label htmlFor={id} className="sr-only">
          Sposta per confrontare il referto originale e quello spiegato
        </label>
        <input id={id} type="range" min={0} max={100} value={pos} onChange={(e) => setPos(Number(e.target.value))} className="before-after-range absolute inset-0 z-20 h-full w-full cursor-ew-resize opacity-0" />
      </div>
      <figcaption className="mt-4 text-center text-[1rem] text-muted">Referto di esempio, con dati inventati.</figcaption>
    </figure>
  );
}
