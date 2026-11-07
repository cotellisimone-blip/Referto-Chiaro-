import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { GUIDE_CATEGORIES, guidesByCategory, GUIDES } from "@/content/guides";
import type { GuideCategory } from "@/content/guides";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Guide agli esami di laboratorio",
  description: "Che cosa misura ogni esame, come leggere il referto e che cosa chiedere al medico: guide in parole semplici, senza diagnosi. Bozze in revisione medica.",
  alternates: { canonical: absoluteUrl("/guide") },
};

export default function GuideHubPage() {
  const cats = Object.keys(GUIDE_CATEGORIES) as GuideCategory[];
  return (
    <>
      <PageHeader
        art="magnify"
        eyebrow="Guide"
        title="Gli esami, spiegati."
        lead={`${GUIDES.length} guide su esami di laboratorio, immagini, cuore ed endoscopie: che cosa misura un esame, che cosa aspettarsi e che cosa chiedere al medico. Spiegazioni, non diagnosi.`}
      />
      <div className="container-rc py-6">
        <p role="note" className="max-w-3xl rounded-2xl border border-dashed border-warn/60 bg-cream px-5 py-4 text-sm text-ink-soft">
          Le guide sono bozze editoriali in attesa di revisione medica. Sono informative: non sostituiscono il parere del tuo medico.
        </p>
        <nav aria-label="Categorie" className="mt-6">
          <ul className="flex flex-wrap gap-2">
            {cats.map((c) => (
              <li key={c}>
                <a href={`#${c}`} className="chip bg-mist text-ink hover:bg-mist/70">
                  {GUIDE_CATEGORIES[c].title}
                </a>
              </li>
            ))}
            <li>
              <Link href="/glossario" className="chip bg-cream text-ink">
                Glossario
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <div className="container-rc space-y-14 py-10 sm:py-14">
        {cats.map((c) => {
          const list = guidesByCategory(c);
          if (!list.length) return null;
          return (
            <section key={c} id={c} aria-labelledby={`${c}-titolo`} className="scroll-mt-28">
              <h2 id={`${c}-titolo`} className="font-serif text-2xl text-ink sm:text-3xl">{GUIDE_CATEGORIES[c].title}</h2>
              <p className="mt-1 text-muted">{GUIDE_CATEGORIES[c].lead}</p>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {list.map((g) => (
                  <li key={g.slug}>
                    <Link href={`/guide/${g.slug}`} className="card flex h-full flex-col p-5 transition-shadow hover:shadow-[var(--shadow-lift)]">
                      <span className="font-semibold text-ink">{g.examName}</span>
                      <span className="mt-1 line-clamp-3 text-sm text-muted">{g.metaDescription}</span>
                      <span className="link mt-3 inline-flex items-center gap-1 text-sm">
                        Leggi la guida <ArrowRight aria-hidden className="h-3.5 w-3.5" />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </>
  );
}
