import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GUIDES, getGuide } from "@/content/guides";
import { GUIDE_CATEGORIES } from "@/content/guides/schema";
import { GuideArticle } from "@/components/guide/guide-article";
import { NOINDEX_DRAFT, absoluteUrl, breadcrumbLd, guideIndexable, indexingEnabled, jsonLd } from "@/lib/seo";

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const g = getGuide(slug);
  if (!g) return {};
  return {
    title: g.title,
    description: g.metaDescription,
    alternates: { canonical: absoluteUrl(`/guide/${g.slug}`) },
    openGraph: { title: g.title, description: g.metaDescription, type: "article", locale: "it_IT" },
    ...(indexingEnabled() && !guideIndexable(g) ? { robots: NOINDEX_DRAFT } : {}),
  };
}

export default async function GuidaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const g = getGuide(slug);
  if (!g) notFound();
  const ld = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: g.title,
      description: g.metaDescription,
      inLanguage: "it",
      dateModified: g.lastUpdated,
      about: { "@type": "Thing", name: g.examName },
      author: { "@type": "Organization", name: "Cura Privata" },
      publisher: { "@type": "Organization", name: "Cura Privata" },
      mainEntityOfPage: absoluteUrl(`/guide/${g.slug}`),
    },
    { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: g.faq.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) },
    breadcrumbLd([{ name: "Guide", path: "/guide" }, { name: GUIDE_CATEGORIES[g.category].title, path: `/guide#${g.category}` }, { name: g.examName, path: `/guide/${g.slug}` }]),
  ];
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(ld) }} />
      <GuideArticle guide={g} />
    </>
  );
}
