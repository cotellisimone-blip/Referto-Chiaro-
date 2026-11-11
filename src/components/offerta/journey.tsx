import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { clsx } from "clsx";
import { LEVELS, coreService, priceDisplay, publicPricesEnabled } from "@/domain/offerta";

/** Una riga per livello: che cosa succede, detto dal punto di vista di chi lo usa. */
const LINE = {
  capisci: "Il tuo referto, in parole semplici.",
  "parla-con-un-medico": "Un medico ti indica il prossimo passo.",
  "secondo-parere": "Uno specialista valuta il tuo caso.",
} as const;

/**
 * «Cura Privata Journey», versione a tre livelli: CAPISCI → ORIENTATI → APPROFONDISCI.
 * Su desktop è una scala che sale da sinistra a destra; su telefono una colonna. È una lista ordinata vera,
 * e ogni gradino è un link: si può entrare da qualunque livello. Nomi, livelli e prezzi da src/domain/offerta.ts.
 */
export function Journey({ withStart = false }: { withStart?: boolean }) {
  const prices = publicPricesEnabled();
  return (
    <ol className={clsx("levels grid gap-4 lg:items-stretch lg:gap-6", withStart ? "levels-4 sm:grid-cols-2 xl:grid-cols-4" : "lg:grid-cols-3")}>
      {withStart ? (
        // Ingresso gratuito (V3): un passo prima dei tre livelli, non un livello clinico.
        <li className="tone-partenza">
          <Link href="/punto-di-partenza" data-track="cta-pdp" className="level-step group">
            <span className="flex items-start justify-between gap-4">
              <span aria-hidden className="level-num">
                0
              </span>
              {prices ? <span className="stat-num block text-right text-[1.75rem] text-ink">Gratis</span> : null}
            </span>
            <span className="level-verb mt-3 block sm:mt-5 text-[1.75rem] font-extrabold uppercase leading-none tracking-[0.02em] text-ink">Parti</span>
            <span className="mt-3 hidden text-xl leading-snug text-ink-soft sm:block">Una scheda semplice per la prossima visita.</span>
            <span className="tone-text mt-auto inline-flex min-h-11 items-center gap-2 pt-3 text-lg font-bold sm:pt-5">
              Punto di Partenza <ArrowRight aria-hidden className="h-5 w-5 shrink-0 transition-transform group-hover:translate-x-1" />
            </span>
          </Link>
        </li>
      ) : null}
      {LEVELS.map((id) => {
        const s = coreService(id);
        const p = priceDisplay(id);
        return (
          <li key={id} className={`tone-${s.tone}`}>
            <Link href={s.href} className="level-step group">
              <span className="flex items-start justify-between gap-4">
                <span aria-hidden className="level-num">
                  {s.level.n}
                </span>
                {prices ? (
                  <span className="text-right">
                    {p.lead ? <span className="block text-[0.9375rem] font-semibold text-ink-soft">{p.lead}</span> : null}
                    <span className="stat-num block text-[1.75rem] text-ink">{p.amount}</span>
                  </span>
                ) : null}
              </span>
              <span className="level-verb mt-3 block sm:mt-5 text-[1.75rem] font-extrabold uppercase leading-none tracking-[0.02em] text-ink">
                <span className="sr-only">Livello {s.level.n}: </span>
                {s.level.verb}
              </span>
              <span className="mt-3 hidden text-xl leading-snug text-ink-soft sm:block">{LINE[id]}</span>
              <span className="tone-text mt-auto inline-flex min-h-11 items-center gap-2 pt-3 text-lg font-bold sm:pt-5">
                {s.name} <ArrowRight aria-hidden className="h-5 w-5 shrink-0 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </li>
        );
      })}
    </ol>
  );
}

/** La linea del Journey come semplice filo decorativo (separatori, hero, banner). */
export function JourneyThread({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 600 120" fill="none" className={className}>
      <path className="journey-draw" pathLength={1} d="M-10 90 C 90 20, 160 120, 260 70 S 420 10, 520 60 S 600 90, 640 40" stroke="var(--color-marker)" strokeWidth="5" strokeLinecap="round" />
      <circle cx="260" cy="70" r="7" fill="var(--color-teal)" />
      <circle cx="520" cy="60" r="7" fill="var(--color-teal)" />
    </svg>
  );
}
