import Link from "next/link";
import { ArrowRight, Check, Minus } from "lucide-react";
import { clsx } from "clsx";
import { SERVICES } from "@/domain/catalog";

/**
 * Card dei servizi. Lo stato va sopra il titolo (non accanto) così i nomi lunghi non vanno a capo
 * schiacciati; la nota "nessun acquisto" compare una sola volta sotto la griglia.
 * La card centrale ha un bordo sfumato (teal → sage → evidenziatore) e il prezzo in Fraunces grande.
 */
export function ServiceCards({ detailed = false }: { detailed?: boolean }) {
  return (
    <div>
      <ul className="grid gap-5 md:grid-cols-3 md:items-stretch">
        {SERVICES.map((s, i) => {
          const featured = i === 1;
          const [amount, ...rest] = s.priceLabel.split(" ");
          const fromPrefix = amount === "da";
          return (
            <li
              key={s.id}
              className={clsx(
                "card card-lift relative flex flex-col p-6 sm:p-7",
                featured && "card-featured md:-translate-y-3 md:hover:-translate-y-4",
              )}
            >
              <span className={clsx("chip self-start", s.status === "demo-only" ? "bg-mist text-teal-deep" : "bg-cream text-ink")}>{s.statusLabel}</span>
              <h3 className="mt-5 font-serif text-[1.875rem] leading-tight">{s.name}</h3>
              <p className="mt-2 text-lg text-ink-soft">{s.tagline}</p>
              <p className="mt-7 flex items-baseline gap-2">
                {fromPrefix ? <span className="text-lg text-muted">da</span> : null}
                <span className="stat-num text-[3rem]">{fromPrefix ? rest.join(" ") : `${amount} ${rest.join(" ")}`.trim()}</span>
              </p>
              <p className="mt-2 text-sm text-muted">{s.priceNote}</p>
              <ul className="mt-6 space-y-3 border-t border-line pt-6">
                {s.includes.map((x) => (
                  <li key={x} className="flex gap-3 text-[1.0625rem]">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-mist">
                      <Check aria-hidden className="h-3.5 w-3.5 text-sage-deep" />
                    </span>
                    <span>{x}</span>
                  </li>
                ))}
              </ul>
              {detailed ? (
                <>
                  <p className="mt-6 text-sm font-semibold uppercase tracking-wide text-muted">Non include</p>
                  <ul className="mt-2 space-y-2">
                    {s.excludes.map((x) => (
                      <li key={x} className="flex gap-3 text-[0.9375rem] text-muted">
                        <Minus aria-hidden className="mt-1 h-4 w-4 shrink-0" />
                        <span>{x}</span>
                      </li>
                    ))}
                  </ul>
                </>
              ) : null}
              <div className="mt-auto pt-8">
                <Link href={s.exampleHref} className={clsx("btn w-full", s.status === "demo-only" ? "btn-primary" : "btn-secondary")}>
                  {s.exampleLabel}
                  {s.status === "demo-only" ? <ArrowRight aria-hidden className="btn-arrow h-4 w-4" /> : null}
                </Link>
              </div>
            </li>
          );
        })}
      </ul>
      <p className="mt-6 text-center text-[0.9375rem] text-muted">Prezzi indicativi in fase di validazione. Nessun acquisto è possibile in questa versione.</p>
    </div>
  );
}
