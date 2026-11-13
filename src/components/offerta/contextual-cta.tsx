import Link from "next/link";
import { ArrowRight, FileText, Stethoscope } from "lucide-react";
import { coreService, formatEuro, priceCents, priceLabel, publicPricesEnabled, type CoreServiceId } from "@/domain/offerta";

/**
 * CTA contestuale nelle guide e nel glossario: prima la risposta utile, poi UNA proposta pertinente, senza fretta.
 * Esami di laboratorio → «Capisci il tuo referto». Esami per immagini ed endoscopie (spesso con una diagnosi
 * o un'indicazione già ricevuta) → «Secondo parere». Sempre l'alternativa di parlarne con un medico.
 */
const PROCEDURAL = new Set(["immagini", "endoscopie"]);

export function ctaForCategory(category: string | null | undefined): CoreServiceId {
  return category && PROCEDURAL.has(category) ? "secondo-parere" : "capisci";
}

function copy(id: "capisci" | "secondo-parere", prices: boolean): { title: string; text: string; icon: typeof FileText } {
  if (id === "capisci")
    return {
      title: prices ? `Hai già il tuo referto? Rendilo chiaro per ${formatEuro(priceCents("capisci"))}.` : "Hai già il tuo referto? Rendilo chiaro.",
      text: "Tutti i valori del tuo documento in ordine, spiegati in parole semplici, con le domande da portare al medico. Di norma in pochi minuti.",
      icon: FileText,
    };
  return {
    title: "Hai già ricevuto una diagnosi o un'indicazione? Puoi chiedere un secondo parere.",
    text: "Uno specialista esamina i documenti che scegli, ne parla con te in video e ti lascia una sintesi scritta.",
    icon: Stethoscope,
  };
}

export function ContextualCta({ category }: { category?: string | null }) {
  const id = ctaForCategory(category) as "capisci" | "secondo-parere";
  const s = coreService(id);
  const prices = publicPricesEnabled();
  const c = copy(id, prices);
  const Icon = c.icon;
  const video = coreService("parla-con-un-medico");
  return (
    <aside aria-label="Se ti serve un passo in più" className={`tone-${s.tone} next-card no-print`}>
      <span aria-hidden className="tile-ico tile-ico-tone">
        <Icon />
      </span>
      <div className="min-w-0">
        <p className="next-card-title">{c.title}</p>
        <p className="next-card-text">{c.text}</p>
        <div className="next-card-actions">
          <Link href={s.href} className="btn btn-primary w-full sm:w-auto">
            {s.name} <ArrowRight aria-hidden className="btn-arrow h-5 w-5" />
          </Link>
          <Link href={video.href} className="next-card-alt">
            <span>Preferisci parlarne? Un medico di medicina generale{prices ? `, ${priceLabel("parla-con-un-medico")}` : ""}</span>
            <ArrowRight aria-hidden className="h-4 w-4 shrink-0" />
          </Link>
        </div>
      </div>
    </aside>
  );
}
