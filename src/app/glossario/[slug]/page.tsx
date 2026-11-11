import type { Metadata } from "next";
import Link from "next/link";
import { ContextualCta } from "@/components/offerta/contextual-cta";
import { notFound } from "next/navigation";
import { GLOSSARY, getGlossaryEntry } from "@/content/glossario";
import { getGuide } from "@/content/guides";
import { Breadcrumbs } from "@/components/guide/breadcrumbs";
import { ReviewNotice } from "@/components/guide/review-notice";
import { NOINDEX_DRAFT, absoluteUrl, breadcrumbLd, glossaryIndexable, indexingEnabled, jsonLd } from "@/lib/seo";

export function generateStaticParams() {
  return GLOSSARY.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const e = getGlossaryEntry(slug);
  if (!e) return {};
  return { title: `${e.term}: che cos'è`, description: e.definition.slice(0, 158), alternates: { canonical: absoluteUrl(`/glossario/${e.slug}`) }, ...(indexingEnabled() && !glossaryIndexable() ? { robots: NOINDEX_DRAFT } : {}) };
}

export default async function VocePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const e = getGlossaryEntry(slug);
  if (!e) notFound();
  const guides = e.relatedGuides.map(getGuide).filter((g) => g !== null);
  const terms = e.relatedTerms.map(getGlossaryEntry).filter((t) => t !== null);
  const ld = [
    { "@context": "https://schema.org", "@type": "DefinedTerm", name: e.term, description: e.definition, inDefinedTermSet: absoluteUrl("/glossario"), alternateName: e.aliases },
    breadcrumbLd([{ name: "Glossario", path: "/glossario" }, { name: e.term, path: `/glossario/${e.slug}` }]),
  ];
  return (
    <article className="container-rc py-10 sm:py-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(ld) }} />
      <Breadcrumbs items={[{ name: "Glossario", path: "/glossario" }, { name: e.term, path: `/glossario/${e.slug}` }]} />
      <div className="mt-6 max-w-3xl">
        <p className="eyebrow">Glossario</p>
        <h1 className="display mt-3 text-[2.25rem] sm:text-[3rem]">{e.term}</h1>
        {e.aliases.length ? <p className="mt-2 text-sm text-muted">Altri nomi: {e.aliases.join(", ")}.</p> : null}
        <p className="mt-5 text-lg text-ink">{e.definition}</p>
        <div className="mt-6 space-y-4 text-[1.0625rem] leading-relaxed text-ink-soft">
          {e.inDetail.map((p) => (
            <p key={p.slice(0, 40)}>{p}</p>
          ))}
        </div>
        <div className="mt-8">
          <ReviewNotice lastUpdated="2026-11-07" />
        </div>
        <div className="mt-10">
          <ContextualCta category={guides[0]?.category} />
        </div>
        {guides.length ? (
          <section className="mt-10" aria-labelledby="guide-coll">
            <h2 id="guide-coll" className="text-lg font-semibold text-ink">Guide collegate</h2>
            <ul className="mt-2 space-y-1">
              {guides.map((g) => (
                <li key={g.slug}>
                  <Link href={`/guide/${g.slug}`} className="link">
                    {g.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
        {terms.length ? (
          <section className="mt-8" aria-labelledby="termini-coll">
            <h2 id="termini-coll" className="text-lg font-semibold text-ink">Termini collegati</h2>
            <ul className="mt-2 flex flex-wrap gap-2">
              {terms.map((t) => (
                <li key={t.slug}>
                  <Link href={`/glossario/${t.slug}`} className="chip bg-mist text-ink">
                    {t.term}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
    </article>
  );
}
