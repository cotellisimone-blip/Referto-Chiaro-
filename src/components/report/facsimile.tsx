"use client";

import { useEffect, useRef } from "react";
import { clsx } from "clsx";
import { FileText } from "lucide-react";

export interface FacsimileDoc {
  pageCount: number;
  isSynthetic: boolean;
  sourceLines: { page: number; line: number; text: string }[];
}

/** Riproduzione testuale del documento, con riga evidenziata. Scorre solo dentro il riquadro, mai la pagina. */
export function Facsimile({ doc, highlightLine, compact = false }: { doc: FacsimileDoc; highlightLine: number | null; compact?: boolean }) {
  const refs = useRef(new Map<number, HTMLLIElement>());
  const scroller = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (highlightLine == null || !scroller.current) return;
    const el = refs.current.get(highlightLine);
    const box = scroller.current;
    if (!el) return;
    const top = el.offsetTop - box.clientHeight / 2 + el.clientHeight / 2;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    box.scrollTo({ top: Math.max(0, top), behavior: reduce ? "auto" : "smooth" });
  }, [highlightLine]);

  return (
    <figure data-facsimile className="card overflow-hidden" aria-label={doc.isSynthetic ? "Facsimile del referto sintetico" : "Testo del documento"}>
      <figcaption className="flex flex-wrap items-center justify-between gap-2 border-b border-line bg-mist/60 px-5 py-3">
        <span className="inline-flex items-center gap-2 text-sm font-semibold text-ink">
          <FileText aria-hidden className="h-4 w-4 text-teal" /> Pagina 1 di {doc.pageCount}
        </span>
        {doc.isSynthetic ? <span className="chip bg-cream text-ink">Esempio sintetico</span> : null}
      </figcaption>
      <div ref={scroller} tabIndex={0} role="region" aria-label="Testo del documento, scorrevole" className={clsx("doc-paper relative overflow-x-auto", compact ? "max-h-[420px] overflow-y-auto" : "")}>
        <ol className="min-w-[560px] py-3 font-mono text-[0.8125rem] leading-8 text-ink">
          {doc.sourceLines.map((l) => (
            <li
              key={l.line}
              ref={(el) => {
                if (el) refs.current.set(l.line, el);
              }}
              className={clsx("grid grid-cols-[2.5rem_1fr] whitespace-pre px-2 transition-colors duration-200", highlightLine === l.line && "bg-cream outline-2 -outline-offset-2 outline-teal")}
              aria-current={highlightLine === l.line ? "true" : undefined}
            >
              <span className="select-none pr-3 text-right text-muted/70" aria-label={`Riga ${l.line}`}>
                {l.line}
              </span>
              <span>{l.text}</span>
            </li>
          ))}
        </ol>
      </div>
    </figure>
  );
}

/** Evidenzia la riga e, se il documento non è visibile, lo porta in vista (azione esplicita dell'utente). */
export function revealFacsimileLine(setHighlight: (line: number) => void, line: number) {
  setHighlight(line);
  const fig = document.querySelector<HTMLElement>("[data-facsimile]");
  if (!fig) return;
  const r = fig.getBoundingClientRect();
  if (r.top < 80 || r.bottom > window.innerHeight) {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    fig.scrollIntoView({ block: "center", behavior: reduce ? "auto" : "smooth" });
  }
}
