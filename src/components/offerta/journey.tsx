import Link from "next/link";
import { ArrowRight, ClipboardList, FileSearch, LineChart, Stethoscope, Video, type LucideIcon } from "lucide-react";
import { mediciEnabled } from "@/lib/medici";
import { LEVELS, coreService, priceDisplay, publicPricesEnabled, type CoreServiceId } from "@/domain/offerta";

/** Una riga per tappa: che cosa succede, detto dal punto di vista di chi lo usa. */
const LINE: Record<CoreServiceId, string> = {
  capisci: "Ogni valore del referto, in parole semplici.",
  "parla-con-un-medico": "Chiarisci i dubbi e capisci il prossimo passo.",
  "secondo-parere": "Uno specialista valuta il tuo caso.",
};
const ICON: Record<CoreServiceId, LucideIcon> = { capisci: FileSearch, "parla-con-un-medico": Video, "secondo-parere": Stethoscope };

/**
 * «Cura Privata Journey»: le tappe come tessere di vetro sul filo del percorso (il motivo del pacchetto «Memorabile»).
 * PARTI (gratis) → CAPISCI → ORIENTATI → APPROFONDISCI. Su desktop il filo ondeggia da sinistra a destra, su telefono
 * scende dritto. È una lista ordinata vera e ogni tappa è un link: si può entrare da qualunque punto.
 * Nomi, livelli e prezzi da src/domain/offerta.ts.
 */
export function Journey({ withStart = false }: { withStart?: boolean }) {
  const prices = publicPricesEnabled();
  // 13/11/2026: senza medici il percorso finisce con «Segui nel tempo» (numeri, famiglia, promemoria).
  const tempo = !mediciEnabled();
  const count = LEVELS.length + (withStart ? 1 : 0) + (tempo ? 1 : 0);
  return (
    <div className="levels-wrap">
      <JourneyThread className="levels-thread" steps={count} />
      <ol className="levels" style={{ "--levels": count } as React.CSSProperties}>
      {withStart ? (
        // Ingresso gratuito (V3): un passo prima dei tre livelli, non un livello clinico.
        <li>
          <Link href="/punto-di-partenza" data-track="cta-pdp" className="level-step group">
            <span aria-hidden className="tile-ico">
              <ClipboardList />
            </span>
            <span className="min-w-0">
              <span className="level-verb">Parti</span>
              <span className="level-name">Punto di Partenza</span>
              <span className="level-line">Una scheda ordinata per la prossima visita.</span>
              <span className="level-foot">
                {prices ? (
                  <span className="level-price">
                    <span className="stat-num">Gratis</span>
                  </span>
                ) : null}
                <span className="level-go">
                  Inizia <ArrowRight aria-hidden className="h-5 w-5 shrink-0 transition-transform group-hover:translate-x-1" />
                </span>
              </span>
            </span>
          </Link>
        </li>
      ) : null}
      {LEVELS.map((id) => {
        const s = coreService(id);
        const p = priceDisplay(id);
        const Icon = ICON[id];
        return (
          <li key={id}>
            <Link href={s.href} className="level-step group">
              <span aria-hidden className="tile-ico">
                <Icon />
              </span>
              <span className="min-w-0">
                <span className="level-verb">{s.level.verb}</span>
                <span className="level-name">{s.name}</span>
                <span className="level-line">{LINE[id]}</span>
                <span className="level-foot">
                  {prices ? (
                    <span className="level-price">
                      {p.lead ? <span className="text-[1rem] font-semibold text-ink-soft">{p.lead}</span> : null}
                      <span className="stat-num">{p.amount}</span>
                    </span>
                  ) : null}
                  <span className="level-go">
                    Scopri <ArrowRight aria-hidden className="h-5 w-5 shrink-0 transition-transform group-hover:translate-x-1" />
                  </span>
                </span>
              </span>
            </Link>
          </li>
        );
      })}
      {tempo ? (
        <li>
          <Link href="/famiglia" data-track="cta-famiglia" className="level-step group">
            <span aria-hidden className="tile-ico">
              <LineChart />
            </span>
            <span className="min-w-0">
              <span className="level-verb">Segui</span>
              <span className="level-name">Nel tempo, per tutta la famiglia</span>
              <span className="level-line">Ogni referto si aggiunge ai precedenti. Prima della visita, le domande sono pronte.</span>
              <span className="level-foot">
                {prices ? (
                  <span className="level-price">
                    <span className="text-[1rem] font-semibold text-ink-soft">Nel tuo spazio</span>
                  </span>
                ) : null}
                <span className="level-go">
                  Scopri <ArrowRight aria-hidden className="h-5 w-5 shrink-0 transition-transform group-hover:translate-x-1" />
                </span>
              </span>
            </span>
          </Link>
        </li>
      ) : null}
      </ol>
    </div>
  );
}

/**
 * Il filo del percorso: un'onda morbida che passa per il centro di ogni tessera (una su, una giù).
 * Disegnato per `steps` colonne uguali; l'altezza è fissa, la larghezza si adatta.
 */
export function JourneyThread({ className = "", steps = 4 }: { className?: string; steps?: number }) {
  const W = 1000;
  const col = W / steps;
  // Centro verticale delle tessere: 40 (colonne dispari) e 64 (colonne pari), in px reali: l'SVG è alto 104 px.
  const ys = Array.from({ length: steps }, (_, i) => (i % 2 === 0 ? 40 : 64));
  const xs = Array.from({ length: steps }, (_, i) => col * (i + 0.5));
  let d = `M0 ${(ys[0] + ys[1]) / 2} C ${xs[0] * 0.45} ${(ys[0] + ys[1]) / 2}, ${xs[0] * 0.6} ${ys[0]}, ${xs[0]} ${ys[0]}`;
  for (let i = 1; i < steps; i++) {
    const mid = (xs[i - 1] + xs[i]) / 2;
    d += ` C ${mid} ${ys[i - 1]}, ${mid} ${ys[i]}, ${xs[i]} ${ys[i]}`;
  }
  const last = steps - 1;
  d += ` C ${xs[last] + col * 0.2} ${ys[last]}, ${W - col * 0.2} ${(ys[0] + ys[1]) / 2}, ${W} ${(ys[0] + ys[1]) / 2}`;
  return (
    <svg aria-hidden viewBox={`0 0 ${W} 104`} preserveAspectRatio="none" fill="none" className={className}>
      <path className="journey-draw" pathLength={1} d={d} stroke="var(--marker-line, var(--color-marker))" strokeWidth="3" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
