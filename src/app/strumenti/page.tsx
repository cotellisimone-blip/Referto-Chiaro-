import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, ClipboardList, Compass, MessageCircleQuestionMark, SpellCheck, type LucideIcon } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { puntoDiPartenzaEnabled } from "@/lib/feature-flags";
import { GUIDES } from "@/content/guides";
import { GLOSSARY } from "@/content/glossario";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Strumenti gratuiti",
  description: "Preparati alla visita, le domande per il medico, il punto di partenza, le guide agli esami e il glossario: gratis, anche senza registrarti.",
  alternates: { canonical: absoluteUrl("/strumenti") },
};

/**
 * Strumenti gratuiti (15/11/2026): la voce del menu per il secondo momento, «prima di una visita». Raccoglie quello che
 * già c'è, gratis e senza registrazione. Nessun dato personale lascia il browser in questi strumenti.
 */
export default function StrumentiPage() {
  const tools: { href: string; icon: LucideIcon; t: string; d: string }[] = [
    { href: "/strumenti/preparati-alla-visita", icon: ClipboardList, t: "Preparati alla visita", d: "Cosa portare e cosa chiedere, in 2 minuti." },
    { href: "/strumenti/domande-per-il-medico", icon: MessageCircleQuestionMark, t: "Domande per il medico", d: "La tua lista di domande, pronta da stampare." },
    ...(puntoDiPartenzaEnabled()
      ? [{ href: "/punto-di-partenza", icon: Compass, t: "Punto di partenza", d: "Non hai esami? 10 aree da conoscere e una scheda da portare al medico." }]
      : []),
    { href: "/guide", icon: BookOpen, t: "Guide agli esami", d: `${GUIDES.length} esami spiegati in parole semplici, con le fonti dichiarate.` },
    { href: "/glossario", icon: SpellCheck, t: "Glossario", d: `${GLOSSARY.length} parole e sigle dei referti, spiegate.` },
  ];
  return (
    <>
      <PageHeader section={1} art="questions" eyebrow="Gratis, anche senza registrarti" title="Strumenti gratuiti." lead="Per arrivare alla visita preparato: che cosa portare, che cosa chiedere, che cosa vogliono dire le parole del referto." />
      <section className="section-tight">
        <div className="container-rc">
          <ul className="grid grid-cols-[minmax(0,1fr)] gap-4 md:grid-cols-2">
            {tools.map(({ href, icon: Icon, t, d }) => (
              <li key={href}>
                <Link href={href} className="card card-lift flex h-full items-start gap-4 p-6">
                  <span aria-hidden className="tile-ico shrink-0">
                    <Icon />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-xl font-extrabold text-ink">{t}</span>
                    <span className="mt-1 block text-[1.0625rem] text-ink-soft">{d}</span>
                  </span>
                  <ArrowRight aria-hidden className="ml-auto mt-1 h-5 w-5 shrink-0 text-teal" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
