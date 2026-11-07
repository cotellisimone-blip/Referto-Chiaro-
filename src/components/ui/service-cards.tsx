import Link from "next/link";
import { Check, Minus } from "lucide-react";
import { clsx } from "clsx";
import { SERVICES } from "@/domain/catalog";

export function ServiceCards({ detailed = false }: { detailed?: boolean }) {
  return (
    <ul className="grid gap-5 md:grid-cols-3">
      {SERVICES.map((s, i) => (
        <li
          key={s.id}
          className={clsx("card flex flex-col p-6 sm:p-7", i === 1 && "md:-translate-y-3 md:border-teal/40 md:shadow-[var(--shadow-lift)]")}
        >
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-serif text-2xl">{s.name}</h3>
            <span className={clsx("chip shrink-0", s.status === "demo-only" ? "bg-mist text-teal-deep" : "bg-cream text-ink")}>{s.statusLabel}</span>
          </div>
          <p className="mt-2 text-muted">{s.tagline}</p>
          <p className="mt-6 flex items-baseline gap-2">
            <span className="tabular font-serif text-[2.5rem] leading-none">{s.priceLabel}</span>
          </p>
          <p className="mt-2 text-sm text-muted">{s.priceNote}</p>
          <ul className="mt-6 space-y-2.5 border-t border-line pt-6">
            {s.includes.map((x) => (
              <li key={x} className="flex gap-2.5 text-[0.9375rem]">
                <Check aria-hidden className="mt-1 h-4 w-4 shrink-0 text-sage-deep" />
                <span>{x}</span>
              </li>
            ))}
          </ul>
          {detailed ? (
            <>
              <p className="mt-6 text-sm font-semibold text-ink">Non include</p>
              <ul className="mt-2 space-y-2">
                {s.excludes.map((x) => (
                  <li key={x} className="flex gap-2.5 text-sm text-muted">
                    <Minus aria-hidden className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>{x}</span>
                  </li>
                ))}
              </ul>
            </>
          ) : null}
          <div className="mt-auto pt-7">
            <Link href={s.exampleHref} className={clsx("btn w-full", s.status === "demo-only" ? "btn-primary" : "btn-secondary")}>
              {s.exampleLabel}
            </Link>
            <p className="mt-3 text-center text-xs text-muted">Nessun acquisto possibile in questa versione.</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
