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
    <div className="article-shell">
      <article className="container-rc article-body">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd(ld) }} />
        <Breadcrumbs items={[{ name: "Glossario", path: "/glossario" }, { name: e.term, path: `/glossario/${e.slug}` }]} />
        <div className="mt-6 grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-12">
          <div className="max-w-3xl">
            <p className="eyebrow">Glossario</p>
            <h1 className="page-title page-title-sm mt-4">{e.term}</h1>
            {e.aliases.length ? <p className="mt-3 text-base text-muted">Altri nomi: {e.aliases.join(", ")}.</p> : null}
            <p className="lead mt-5 text-ink">{e.definition}</p>
            <div className="mt-6 space-y-4 text-[1.0625rem] leading-relaxed text-ink-soft">
              {e.inDetail.map((p) => (
                <p key={p.slice(0, 40)}>{p}</p>
              ))}
            </div>
            <div className="mt-8">
              <ReviewNotice lastUpdated="2026-11-07" subject="il termine" />
            </div>
            <div className="mt-10">
              <ContextualCta category={guides[0]?.category} slug={guides[0]?.slug} />
            </div>
          </div>
          {guides.length || terms.length ? (
            <aside className="space-y-6 lg:mt-12" aria-label="Collegamenti">
              {guides.length ? (
                <section className="side-card" aria-labelledby="guide-coll">
                  <h2 id="guide-coll" className="side-card-title">
                    Guide collegate
                  </h2>
                  <ul className="link-list mt-1">
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
                <section className="side-card" aria-labelledby="termini-coll">
                  <h2 id="termini-coll" className="side-card-title">
                    Termini collegati
                  </h2>
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {terms.map((t) => (
                      <li key={t.slug}>
                        <Link href={`/glossario/${t.slug}`} className="chip min-h-11 bg-mist text-ink">
                          {t.term}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}
            </aside>
          ) : null}
        </div>
      </article>
    </div>
  );
}
