import Link from "next/link";
import { ArrowRight, Clock3, FileText, Home, Stethoscope, Video } from "lucide-react";
import { clsx } from "clsx";
import { OFFER_SCENE } from "./scenes";
import { publicPricesEnabled, type CoreService } from "@/domain/offerta";
import { offerItems, type OfferItem } from "@/domain/prestazioni/offerta-completa";
import { prestazionePrice } from "@/domain/prestazioni/listino";
import { PrestazioneAction } from "@/components/prestazioni/public";
import { PriceTag } from "./price-tag";

export const SERVICE_ICON: Record<CoreService["icon"], typeof FileText> = { file: FileText, stethoscope: Stethoscope, video: Video };
export const OFFER_ICON: Record<OfferItem["icon"], typeof FileText> = { file: FileText, home: Home, stethoscope: Stethoscope, video: Video };

/** Prezzo di una voce dell'offerta: dal listino unico, con lo stesso aspetto per tutti e quattro i servizi. */
export function OfferPrice({ item, size = "sm", align = "left", className }: { item: OfferItem; size?: "sm" | "lg"; align?: "left" | "right"; className?: string }) {
  if (item.coreId) return <PriceTag id={item.coreId} size={size} align={align} className={className} />;
  return (
    <p className={clsx("price-tag", align === "right" && "text-right", className)}>
      <span className={clsx("stat-num block leading-none text-ink", size === "lg" ? "text-[2.75rem]" : "text-[1.5rem]")}>{prestazionePrice(item.kind!)}</span>
      <span className="mt-1 block text-[0.9375rem] text-muted">prezzo fisso</span>
    </p>
  );
}

/**
 * L'offerta di Cura Privata, una volta sola (ciclo 4): Capisci il tuo referto e le tre prestazioni con un medico.
 * Nome, frase, tempi e prezzo sono HTML vero e arrivano dal listino unico. Le prestazioni con un medico mostrano
 * anche la disponibilità reale e si richiedono direttamente dalla scheda.
 */
export function ServiceTriad({ headingLevel = 3, compact = false }: { headingLevel?: 2 | 3; compact?: boolean }) {
  const H = headingLevel === 2 ? "h2" : "h3";
  const prices = publicPricesEnabled();
  return (
    <ul className="grid gap-5 md:grid-cols-2 xl:grid-cols-4" aria-label="I servizi di Cura Privata">
      {offerItems().map((s) => {
        const Icon = OFFER_ICON[s.icon];
        const Scene = OFFER_SCENE[s.key];
        return (
          <li key={s.key} className={`tone-${s.tone}`}>
            <article className="service-card group" data-servizio={s.key} data-prestazione={s.kind}>
              <div className="scene-frame">
                <Scene className="transition-transform duration-500 group-hover:scale-[1.03]" />
              </div>
              <div className="flex flex-1 flex-col p-6">
                <div className="flex items-center justify-between gap-4">
                  <span className="tone-icon h-14 w-14">
                    <Icon aria-hidden className="h-7 w-7" strokeWidth={1.75} />
                  </span>
                  {prices ? <OfferPrice item={s} align="right" /> : null}
                </div>
                <H className="mt-5 text-[1.5rem] font-bold leading-tight tracking-[-0.015em] text-ink">
                  <Link href={s.href} className="after:absolute after:inset-0 focus-visible:outline-none">
                    {s.name}
                  </Link>
                </H>
                <p className="mt-3 text-[1.0625rem] text-ink-soft">{s.oneLiner}</p>
                {!compact && !s.kind ? (
                  <p className="mt-4 flex items-start gap-2 text-[1.0625rem] text-ink">
                    <Clock3 aria-hidden className="tone-text mt-1 h-5 w-5 shrink-0" />
                    {s.timing}
                  </p>
                ) : null}
                {s.kind ? (
                  <PrestazioneAction kind={s.kind} />
                ) : (
                  <span className="tone-text mt-auto inline-flex min-h-11 items-center gap-2 pt-6 text-lg font-bold">
                    Scopri il servizio <ArrowRight aria-hidden className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </span>
                )}
              </div>
            </article>
          </li>
        );
      })}
    </ul>
  );
}
