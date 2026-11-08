import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/page-header";
import { GuideFinder } from "@/components/content/guide-finder";
import { GUIDE_CATEGORIES, GUIDES } from "@/content/guides";
import type { GuideCategory } from "@/content/guides";
import { absoluteUrl } from "@/lib/seo";

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
      <PageHeader
        art="magnify"
        eyebrow="Guide"
        title="Gli esami, spiegati uno per uno."
        lead={`${GUIDES.length} guide su esami di laboratorio, immagini, cuore ed endoscopie: che cosa misura un esame, che cosa aspettarsi e che cosa chiedere al medico. Spiegazioni, non diagnosi.`}
      />
      <GuideFinder guides={guides} categories={cats} />
    </>
  );
}
