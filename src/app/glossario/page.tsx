import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { GlossaryFinder } from "@/components/content/glossary-finder";
import { GLOSSARY, glossaryByLetter } from "@/content/glossario";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Glossario degli esami di laboratorio",
  description: "Termini e sigle dei referti di laboratorio spiegati in italiano comune: che cosa misurano, non che cosa significano per te. Bozze in revisione medica.",
  alternates: { canonical: absoluteUrl("/glossario") },
};

export default function GlossarioPage() {
  const groups = glossaryByLetter().map((g) => ({ letter: g.letter, entries: g.entries.map((e) => ({ slug: e.slug, term: e.term, aliases: e.aliases, definition: e.definition })) }));
  return (
    <>
      <PageHeader art="search" eyebrow="Glossario" title="Le parole dei referti." lead={`${GLOSSARY.length} termini e sigle, spiegati in parole comuni. Definizioni generali: che cosa significhi un valore per te lo dice il medico.`} />
      <GlossaryFinder groups={groups} />
    </>
  );
}
