import { clsx } from "clsx";

/**
 * Onda di raccordo fra due sezioni (il motivo del pacchetto «Memorabile»). È decorativa e prende il colore della
 * sezione che segue dalla classe di testo (text-canvas, text-mist, text-strong…): così segue anche il tema scuro.
 * `double` aggiunge dietro una seconda onda di menta, come nell'apertura della home.
 */
export function Wave({ className, position = "bottom", double = false }: { className?: string; position?: "top" | "bottom"; double?: boolean }) {
  return (
    <svg aria-hidden viewBox="0 0 1440 96" preserveAspectRatio="none" className={clsx("wave", position === "bottom" ? "wave-bottom" : "wave-top", className)}>
      {double ? <path d="M0 62 C 210 20, 430 6, 680 38 S 1130 98, 1440 26 V96 H0 Z" fill="var(--color-marker)" opacity="0.4" /> : null}
      <path d="M0 72 C 240 26, 480 100, 760 62 S 1240 18, 1440 56 V96 H0 Z" fill="currentColor" />
    </svg>
  );
}
