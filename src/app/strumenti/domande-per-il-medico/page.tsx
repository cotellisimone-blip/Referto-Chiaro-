import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { Info, Lock, Printer, Share2 } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { QuestionsBuilder, type ExamOption } from "@/components/tools/questions-builder";
import { GUIDES } from "@/content/guides";
import { GUIDE_CATEGORIES } from "@/content/guides/schema";
import type { GuideCategory } from "@/content/guides/schema";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Domande per il medico",
  description: "Scegli gli esami che hai fatto e ottieni una lista di domande da portare alla visita, da stampare o salvare sul telefono. Nessun dato personale, nessun valore richiesto.",
  alternates: { canonical: absoluteUrl("/strumenti/domande-per-il-medico") },
};

/** Dati compatti per lo strumento: nome, categoria e domande di ciascuna guida (niente testi lunghi). */
function options(): ExamOption[] {
  return GUIDES.map((g) => ({ slug: g.slug, name: g.examName, aliases: g.aliases, category: g.category, questions: g.questionsForDoctor }));
}

const ORDER = Object.keys(GUIDE_CATEGORIES) as GuideCategory[];

export default function DomandePerIlMedicoPage() {
  const categories = ORDER.map((id) => ({ id, title: GUIDE_CATEGORIES[id].title }));
  return (
    <>
      <PageHeader
        art="questions"
        eyebrow="Strumento gratuito"
        title="Le domande giuste, prima di entrare in visita."
        lead="Scegli gli esami che hai fatto: componiamo una lista di domande da fare al medico, presa dalle nostre guide. La stampi o la tieni sul telefono."
      >
        <ul className="pdp-hero-facts mt-7">
          <li>
            <Lock aria-hidden /> Non chiediamo valori né dati personali
          </li>
          <li>
            <Printer aria-hidden /> Pronta da stampare
          </li>
          <li>
            <Share2 aria-hidden /> Il link ricorda solo gli esami scelti
          </li>
        </ul>
      </PageHeader>
      <Suspense
        fallback={
          <div className="container-rc tool-body" aria-busy="true">
            <div className="h-64 animate-pulse rounded-[var(--radius-lg)] bg-mist" />
          </div>
        }
      >
        <QuestionsBuilder options={options()} categories={categories} />
      </Suspense>
      <section aria-labelledby="nota-titolo" className="no-print section pt-0">
        <div className="container-rc">
          <div className="callout max-w-[52rem]">
            <span aria-hidden className="callout-ico">
              <Info />
            </span>
            <div>
              <h2 id="nota-titolo" className="callout-title">
                Che cos&apos;è questa lista, e che cosa non è
              </h2>
              <p className="callout-text">
                Le domande vengono dalle nostre{" "}
                <Link href="/guide" className="link">
                  guide agli esami
                </Link>
                , bozze editoriali in attesa di revisione medica. Servono a non dimenticare niente in visita: non dicono nulla sui tuoi risultati e non sostituiscono il colloquio con il medico, che conosce la tua storia.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
