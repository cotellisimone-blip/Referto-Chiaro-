import Link from "next/link";
import { ArrowRight, Clock3, FileText, Stethoscope, Video } from "lucide-react";
import { clsx } from "clsx";
import { SCENE } from "./scenes";
import { CORE_SERVICES, priceLabel, publicPricesEnabled, type CoreService } from "@/domain/offerta";

export const SERVICE_ICON: Record<CoreService["icon"], typeof FileText> = { file: FileText, stethoscope: Stethoscope, video: Video };

/**
 * Le tre porte d'ingresso di Cura Privata. Nome, frase, tempi e prezzo sono HTML vero (mai dentro un'immagine)
 * e arrivano da src/domain/offerta.ts. Su mobile si impilano; su tablet 2+1; su desktop 3 colonne.
 */
export function ServiceTriad({ headingLevel = 3, compact = false }: { headingLevel?: 2 | 3; compact?: boolean }) {
  const H = headingLevel === 2 ? "h2" : "h3";
  const prices = publicPricesEnabled();
  return (
    <ul className="grid gap-5 md:grid-cols-2 lg:grid-cols-3" aria-label="I tre servizi di Cura Privata">
      {CORE_SERVICES.map((s, i) => {
        const Icon = SERVICE_ICON[s.icon];
        return (
          <li key={s.id} className={clsx(`tone-${s.tone}`, i === 2 && "md:col-span-2 lg:col-span-1")}>
            <article className="service-card group">
              {(() => {
                const Scene = SCENE[s.id];
                return (
                  <div className="scene-frame">
                    <Scene className="transition-transform duration-500 group-hover:scale-[1.03]" />
                  </div>
                );
              })()}
              <div className="flex flex-1 flex-col p-6 sm:p-7">
              <div className="flex items-center justify-between gap-4">
                <span className="tone-icon h-14 w-14">
                  <Icon aria-hidden className="h-7 w-7" strokeWidth={1.75} />
                </span>
                {prices ? (
                  <p className="text-right">
                    <span className="block text-[0.9375rem] text-muted">a partire da</span>
                    <span className="stat-num block text-[1.75rem] leading-none text-ink">{priceLabel(s.id).replace("da ", "")}</span>
                  </p>
                ) : null}
              </div>
              <H className="mt-5 text-[1.625rem] font-bold leading-tight tracking-[-0.015em] text-ink">
                <Link href={s.href} className="after:absolute after:inset-0 focus-visible:outline-none">
                  {s.name}
                </Link>
              </H>
              <p className="mt-3 text-lg text-ink-soft">{s.oneLiner}</p>
              {!compact ? (
                <p className="mt-4 flex items-start gap-2 text-[1.0625rem] text-ink">
                  <Clock3 aria-hidden className="tone-text mt-1 h-5 w-5 shrink-0" />
                  {s.timing}
                </p>
              ) : null}
              <span className="tone-text mt-auto inline-flex min-h-11 items-center gap-2 pt-6 text-lg font-bold">
                Scopri il servizio <ArrowRight aria-hidden className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </span>
              </div>
            </article>
          </li>
        );
      })}
    </ul>
  );
}
