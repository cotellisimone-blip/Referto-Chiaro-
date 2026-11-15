import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { INTEGRATORI, getIntegratore } from "@/content/integratori";
import { IntegratoreArticle } from "@/components/sezioni/integratore-article";
import { NOINDEX_DRAFT, indexingEnabled } from "@/lib/seo";
import "@/components/home/tre-momenti.css";
import "@/components/sezioni/sezioni.css";

export function generateStaticParams() {
  return INTEGRATORI.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: PageProps<"/integratori/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const i = getIntegratore(slug);
  if (!i) return {};
  return { title: `${i.name}: che cos'è e che cosa chiedere`, description: i.summary.slice(0, 158), alternates: { canonical: `/integratori/${i.slug}` }, ...(indexingEnabled() ? { robots: NOINDEX_DRAFT } : {}) };
}

/** Scheda di un integratore (sezione Online). Il contenuto è in components/sezioni/integratore-article.tsx. */
export default async function IntegratorePage({ params }: PageProps<"/integratori/[slug]">) {
  const { slug } = await params;
  if (!getIntegratore(slug)) notFound();
  return <IntegratoreArticle slug={slug} />;
}
