import Link from "next/link";
import { ArrowRight, Clock3, FileText, Home, Stethoscope, Video } from "lucide-react";
import { clsx } from "clsx";
import { publicPricesEnabled } from "@/domain/offerta";
import { offerItems, type OfferItem } from "@/domain/prestazioni/offerta-completa";
import { prestazionePrice } from "@/domain/prestazioni/listino";
import { PrestazioneAction } from "@/components/prestazioni/public";
import { PriceTag } from "./price-tag";
import { ReportTransform } from "./report-visuals";

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
 * «Capisci il tuo referto» in grande: il servizio da cui si parte, automatico, con il referto che diventa report.
 * Nome, frase, tempi e prezzo arrivano dal listino unico.
 */
export function CapisciFeature({ className }: { className?: string }) {
  const prices = publicPricesEnabled();
  const s = offerItems()[0];
  return (
    <article className={clsx("svc-feature tone-capisci", className)} data-servizio={s.key} aria-labelledby="servizio-capisci">
      <div>
        <p className="eyebrow eyebrow-plain tone-text">In automatico, senza appuntamento</p>
        <h2 id="servizio-capisci" className="svc-feature-title mt-3">
          {s.name}
        </h2>
        <p className="lead mt-3 max-w-[34rem]">{s.oneLiner}</p>
        <p className="svc-meta">
          <Clock3 aria-hidden />
          {s.timing}
        </p>
        <div className="svc-buy">
          {prices ? <OfferPrice item={s} size="lg" /> : null}
          <Link href={s.href} data-track="cta-capisci" className="btn btn-primary btn-lg">
            Scopri il servizio <ArrowRight aria-hidden className="btn-arrow h-5 w-5" />
          </Link>
        </div>
        <p className="mt-3">
          <Link href="/referti/esempio" className="link inline-flex min-h-11 items-center text-lg font-semibold">
            Guarda un report di esempio
          </Link>
        </p>
      </div>
      <div className="svc-feature-art">
        <ReportTransform />
      </div>
    </article>
  );
}

/**
 * Le tre prestazioni con un medico: visita a domicilio, videoconsulto, secondo parere. Ogni scheda mostra la
 * disponibilità reale e si richiede direttamente; il titolo porta alla pagina del servizio.
 */
export function DoctorServices({ headingLevel = 3 }: { headingLevel?: 2 | 3 }) {
  const H = headingLevel === 2 ? "h2" : "h3";
  const prices = publicPricesEnabled();
  return (
    <ul className="svc-cards" aria-label="Servizi con un medico">
      {offerItems()
        .filter((s) => s.kind)
        .map((s) => {
          const Icon = OFFER_ICON[s.icon];
          return (
            <li key={s.key} className={`tone-${s.tone}`}>
              <article className="svc-card" data-servizio={s.key} data-prestazione={s.kind}>
                <div className="svc-card-top">
                  <span aria-hidden className="tile-ico tile-ico-tone">
                    <Icon />
                  </span>
                  {prices ? (
                    <p className="price-tag text-right">
                      <span className="stat-num block text-[2rem] leading-none text-ink">{prestazionePrice(s.kind!)}</span>
                      <span className="mt-1 block text-[0.9375rem] text-muted">prezzo fisso</span>
                    </p>
                  ) : null}
                </div>
                <div className="svc-card-body">
                  <H className="svc-card-title">
                    <Link href={s.href} className="after:absolute after:inset-0 focus-visible:outline-none">
                      {s.name}
                    </Link>
                  </H>
                  <p className="svc-card-text">{s.oneLiner}</p>
                </div>
                <PrestazioneAction kind={s.kind!} />
              </article>
            </li>
          );
        })}
    </ul>
  );
}
