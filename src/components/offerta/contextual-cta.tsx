import Link from "next/link";
import { ArrowRight, FileText, ListChecks, Stethoscope } from "lucide-react";
import { coreService, formatEuro, priceCents, priceLabel, publicPricesEnabled, type CoreServiceId } from "@/domain/offerta";
import { mediciEnabled } from "@/lib/medici";

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

/**
 * Senza medici (src/lib/medici.ts): per gli esami di laboratorio resta «Capisci il tuo referto», senza l'alternativa
 * del videoconsulto; per esami per immagini ed endoscopie (che «Capisci» non legge) la proposta è lo strumento gratuito
 * con le domande da portare al proprio medico, già aperto sull'esame della guida.
 */
function QuestionsCta({ slug }: { slug?: string | null }) {
  return (
    <aside aria-label="Se ti serve un passo in più" className="tone-partenza next-card no-print">
      <span aria-hidden className="tile-ico tile-ico-tone">
        <ListChecks />
      </span>
      <div className="min-w-0">
        <p className="next-card-title">Hai fatto questo esame? Prepara le domande per il tuo medico.</p>
        <p className="next-card-text">Una lista di domande da portare in visita, da stampare o tenere sul telefono. Gratis, senza registrarti.</p>
        <div className="next-card-actions">
          <Link href={slug ? `/strumenti/domande-per-il-medico?esami=${slug}` : "/strumenti/domande-per-il-medico"} className="btn btn-primary w-full sm:w-auto">
            Domande per il medico <ArrowRight aria-hidden className="btn-arrow h-5 w-5" />
          </Link>
        </div>
      </div>
    </aside>
  );
}

export function ContextualCta({ category, slug }: { category?: string | null; slug?: string | null }) {
  const medici = mediciEnabled();
  const id = ctaForCategory(category) as "capisci" | "secondo-parere";
  if (!medici && id !== "capisci") return <QuestionsCta slug={slug} />;
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
          {medici ? (
            <Link href={video.href} className="next-card-alt">
              <span>Preferisci parlarne? Un medico di medicina generale{prices ? `, ${priceLabel("parla-con-un-medico")}` : ""}</span>
              <ArrowRight aria-hidden className="h-4 w-4 shrink-0" />
            </Link>
          ) : null}
        </div>
      </div>
    </aside>
  );
}
