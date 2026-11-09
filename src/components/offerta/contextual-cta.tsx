import Link from "next/link";
import { ArrowRight, FileText, Stethoscope, Video } from "lucide-react";
import { coreService, priceLabel, publicPricesEnabled, type CoreServiceId } from "@/domain/offerta";

/**
 * CTA contestuale nelle guide e nel glossario: prima la risposta utile, poi UNA proposta pertinente, senza fretta.
 * Esami di laboratorio → «Capisci il tuo referto». Esami per immagini ed endoscopie (spesso con una diagnosi
 * o un'indicazione già ricevuta) → «Secondo parere». Sempre l'alternativa di parlarne con un medico.
 */
const PROCEDURAL = new Set(["immagini", "endoscopie"]);

export function ctaForCategory(category: string | null | undefined): CoreServiceId {
  return category && PROCEDURAL.has(category) ? "secondo-parere" : "capisci";
}

const COPY: Record<"capisci" | "secondo-parere", { title: string; text: string; icon: typeof FileText }> = {
  capisci: { title: "Hai già il tuo referto? Capiscilo nel suo insieme.", text: "Tutti i valori del tuo documento spiegati in parole semplici, con le domande da fare al medico.", icon: FileText },
  "secondo-parere": { title: "Hai già ricevuto una diagnosi o un'indicazione? Puoi chiedere un secondo parere.", text: "Un medico della specialità giusta legge i tuoi documenti e risponde per iscritto.", icon: Stethoscope },
};

export function ContextualCta({ category, variant = "inline" }: { category?: string | null; variant?: "inline" | "aside" }) {
  const id = ctaForCategory(category) as "capisci" | "secondo-parere";
  const s = coreService(id);
  const c = COPY[id];
  const Icon = c.icon;
  const prices = publicPricesEnabled();
  const video = coreService("parla-con-un-medico");
  if (variant === "aside") {
    return (
      <div className={`tone-${s.tone} service-card no-print p-5`}>
        <span className="tone-icon h-11 w-11">
          <Icon aria-hidden className="h-5 w-5" />
        </span>
        <p className="mt-3 font-semibold leading-snug text-ink">{c.title}</p>
        <p className="mt-2 text-sm text-ink-soft">{c.text}</p>
        <Link href={s.href} className="btn btn-primary btn-sm mt-4 w-full">
          {s.name} <ArrowRight aria-hidden className="h-4 w-4" />
        </Link>
        {prices ? <p className="mt-2 text-center text-sm text-muted">{priceLabel(s.id)}</p> : null}
      </div>
    );
  }
  return (
    <aside aria-label="Se ti serve un passo in più" className={`tone-${s.tone} service-card no-print p-6 sm:p-8`}>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
        <span className="tone-icon h-14 w-14 shrink-0">
          <Icon aria-hidden className="h-7 w-7" />
        </span>
        <div className="min-w-0">
          <p className="text-[1.375rem] font-bold leading-snug text-ink">{c.title}</p>
          <p className="mt-2 text-lg text-ink-soft">{c.text}</p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link href={s.href} className="btn btn-primary">
              {s.name} <ArrowRight aria-hidden className="btn-arrow h-5 w-5" />
            </Link>
            <Link href={video.href} className="inline-flex min-h-11 items-center gap-2 font-semibold text-teal hover:underline">
              <Video aria-hidden className="h-5 w-5" /> Preferisci parlarne? Prenota un videoconsulto
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
