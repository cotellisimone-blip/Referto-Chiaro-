import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { GuideFinder } from "@/components/content/guide-finder";
import { EXAM_GUIDE_COUNT, GUIDE_CATEGORIES, GUIDES } from "@/content/guides";
import type { GuideCategory } from "@/content/guides";
import { absoluteUrl } from "@/lib/seo";
import { PageLd } from "@/components/site/page-ld";

export const metadata: Metadata = {
  title: "Guide agli esami di laboratorio",
  description: "Che cosa misura ogni esame, come leggere il referto e che cosa chiedere al medico: guide in parole semplici, senza diagnosi. Bozze in revisione medica.",
  alternates: { canonical: absoluteUrl("/guide") },
};

export default function GuideHubPage() {
  const cats = (Object.keys(GUIDE_CATEGORIES) as GuideCategory[]).map((id) => ({ id, ...GUIDE_CATEGORIES[id] }));
  const guides = GUIDES.map((g) => ({ slug: g.slug, examName: g.examName, metaDescription: g.metaDescription, aliases: g.aliases, category: g.category }));
  return (
    <>
      <PageLd path="/guide" meta={metadata} name="Guide agli esami" trail={[{ name: "Prevenzione", path: "/prevenzione" }]} />
      <PageHeader section={2}
        art="magnify"
        eyebrow="Guide"
        title="Gli esami, spiegati uno per uno."
        lead={`${EXAM_GUIDE_COUNT} esami spiegati in parole semplici: che cosa misurano e che cosa chiedere al medico.`}
      />
      <GuideFinder guides={guides} categories={cats} />
    </>
  );
}
