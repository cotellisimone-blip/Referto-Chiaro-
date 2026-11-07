import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/ui/page-header";
import { GLOSSARY, glossaryByLetter } from "@/content/glossario";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Glossario degli esami di laboratorio",
  description: "Termini e sigle dei referti di laboratorio spiegati in italiano comune: che cosa misurano, non che cosa significano per te. Bozze in revisione medica.",
  alternates: { canonical: absoluteUrl("/glossario") },
};

export default function GlossarioPage() {
  const groups = glossaryByLetter();
  return (
    <>
      <PageHeader art="translate" eyebrow="Glossario" title="Le parole dei referti." lead={`${GLOSSARY.length} termini e sigle, spiegati in parole comuni. Definizioni generali: che cosa significhi un valore per te lo dice il medico.`} />
      <div className="container-rc py-6">
        <p role="note" className="max-w-3xl rounded-2xl border border-dashed border-warn/60 bg-cream px-5 py-4 text-sm text-ink-soft">
          Bozze editoriali in attesa di revisione medica. Per le guide complete sugli esami vedi{" "}
          <Link href="/guide" className="link">
            Guide
          </Link>
          .
        </p>
        <nav aria-label="Lettere" className="mt-6">
          <ul className="flex flex-wrap gap-1">
            {groups.map((g) => (
              <li key={g.letter}>
                <a href={`#lettera-${g.letter}`} className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-mist font-semibold text-ink hover:bg-mist/70">
                  {g.letter}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <div className="container-rc space-y-10 py-10 sm:py-14">
        {groups.map((g) => (
          <section key={g.letter} id={`lettera-${g.letter}`} aria-labelledby={`lettera-${g.letter}-titolo`} className="scroll-mt-28">
            <h2 id={`lettera-${g.letter}-titolo`} className="font-serif text-3xl text-ink">{g.letter}</h2>
            <dl className="mt-4 divide-y divide-line rounded-[var(--radius-lg)] border border-line bg-paper">
              {g.entries.map((e) => (
                <div key={e.slug} className="grid gap-1 px-5 py-4 sm:grid-cols-[220px_1fr] sm:gap-6">
                  <dt className="font-semibold text-ink">
                    <Link href={`/glossario/${e.slug}`} className="link">
                      {e.term}
                    </Link>
                  </dt>
                  <dd className="text-[0.9375rem] text-ink-soft">{e.definition}</dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>
    </>
  );
}
