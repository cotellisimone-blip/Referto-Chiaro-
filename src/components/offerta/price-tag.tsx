import { clsx } from "clsx";
import { priceDisplay, type CoreServiceId } from "@/domain/offerta";

/**
 * Il prezzo di un servizio, sempre HTML vero e sempre dalla stessa fonte (src/domain/offerta.ts).
 * «Capisci»: «Primo referto» + importo + «poi … per referto». Medico: prezzo fisso. Secondo parere: «da …».
 */
export function PriceTag({ id, size = "md", className, align = "left" }: { id: CoreServiceId; size?: "sm" | "md" | "lg"; className?: string; align?: "left" | "right" }) {
  const p = priceDisplay(id);
  const amountSize = { sm: "text-[1.5rem]", md: "text-[2rem]", lg: "text-[2.75rem]" }[size];
  return (
    <p className={clsx("price-tag", align === "right" && "text-right", className)} aria-label={p.label}>
      {p.lead ? <span aria-hidden className="tone-text block text-[0.9375rem] font-bold uppercase tracking-[0.06em]">{p.lead}</span> : null}
      <span aria-hidden className={clsx("stat-num block leading-none text-ink", amountSize)}>{p.amount}</span>
      {p.note ? <span aria-hidden className="mt-1 block text-[0.9375rem] text-muted">{p.note}</span> : null}
    </p>
  );
}
