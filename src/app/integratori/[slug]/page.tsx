import { cheCose } from "@/lib/italiano";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { INTEGRATORI, INTEGRATORI_GROUPS, getIntegratore } from "@/content/integratori";
import { IntegratoreArticle } from "@/components/sezioni/integratore-article";
import { NOINDEX_DRAFT, absoluteUrl, breadcrumbLd, indexingEnabled, integratoreIndexable, jsonLd, metaDescription, pageTitle } from "@/lib/seo";
import "@/components/home/tre-momenti.css";
import "@/components/sezioni/sezioni.css";

export function generateStaticParams() {
  return INTEGRATORI.map((i) => ({ slug: i.slug }));
}

const titleOf = (name: string) => `${name}: ${cheCose(name)} e che cosa chiedere`;

export async function generateMetadata({ params }: PageProps<"/integratori/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const i = getIntegratore(slug);
  if (!i) return {};
  const description = metaDescription(i.summary);
  return {
    title: pageTitle(titleOf(i.name)),
    description,
    alternates: { canonical: absoluteUrl(`/integratori/${i.slug}`) },
    openGraph: { title: titleOf(i.name), description, type: "article", locale: "it_IT" },
    ...(indexingEnabled() && !integratoreIndexable(i) ? { robots: NOINDEX_DRAFT } : {}),
  };
}

/**
 * Scheda di un integratore (sezione Prevenzione). Il contenuto è in components/sezioni/integratore-article.tsx.
 * 17/11/2026 (20 interventi, punto 13): gli stessi dati strutturati delle guide agli esami (articolo e percorso).
 */
export default async function IntegratorePage({ params }: PageProps<"/integratori/[slug]">) {
  const { slug } = await params;
  const i = getIntegratore(slug);
  if (!i) notFound();
  const ld = [
    {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: titleOf(i.name),
      description: metaDescription(i.summary),
      inLanguage: "it",
      dateModified: i.lastUpdated,
      about: { "@type": "Thing", name: i.name },
      author: { "@type": "Organization", name: "Cura Privata" },
      publisher: { "@type": "Organization", name: "Cura Privata" },
      mainEntityOfPage: absoluteUrl(`/integratori/${i.slug}`),
    },
    breadcrumbLd([
      { name: "Prevenzione", path: "/prevenzione" },
      { name: "Guide agli integratori", path: "/integratori" },
      { name: `${i.name} (${INTEGRATORI_GROUPS[i.group].toLowerCase()})`, path: `/integratori/${i.slug}` },
    ]),
  ];
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(ld) }} />
      <IntegratoreArticle slug={slug} />
    </>
  );
}
