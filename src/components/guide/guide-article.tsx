import Link from "next/link";
import { ArrowRight, HelpCircle, ListChecks } from "lucide-react";
import type { Guide } from "@/content/guides/schema";
import { GUIDE_CATEGORIES } from "@/content/guides/schema";
import { getGuide } from "@/content/guides";
import { getGlossaryEntry } from "@/content/glossario";
import { FaqList } from "@/components/ui/faq-list";
import { ReviewNotice } from "./review-notice";
import { Breadcrumbs } from "./breadcrumbs";

/** Modello di pagina di una guida: stesse sezioni per tutte, così la lettura è prevedibile. */
export function GuideArticle({ guide }: { guide: Guide }) {
  const cat = GUIDE_CATEGORIES[guide.category];
  const related = guide.relatedGuides.map(getGuide).filter((g): g is Guide => Boolean(g));
  const terms = guide.glossaryTerms.map(getGlossaryEntry).filter((e): e is NonNullable<typeof e> => Boolean(e));
  return (
    <article className="container-rc py-10 sm:py-14">
      <Breadcrumbs items={[{ name: "Guide", path: "/guide" }, { name: cat.title, path: `/guide#${guide.category}` }, { name: guide.examName, path: `/guide/${guide.slug}` }]} />
      <header className="mt-6 max-w-3xl">
        <p className="eyebrow">{cat.title}</p>
        <h1 className="display mt-3 text-[2.25rem] sm:text-[3rem]">{guide.title}</h1>
        <p className="mt-5 text-lg text-ink-soft">{guide.summary}</p>
        {guide.aliases.length ? <p className="mt-3 text-sm text-muted">Altri nomi: {guide.aliases.join(", ")}.</p> : null}
      </header>
      <div className="mt-8 max-w-3xl">
        <ReviewNotice lastUpdated={guide.lastUpdated} />
      </div>

      <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="prose-rc max-w-3xl space-y-12">
          <Block id="cosa-misura" title="Che cosa misura">{guide.sections.whatItMeasures}</Block>
          <Block id="perche" title="Perché viene richiesto">{guide.sections.whyRequested}</Block>
          <Block id="come-leggere" title="Come leggere il risultato">{guide.sections.howToRead}</Block>
          <section aria-labelledby="unita-titolo">
            <h2 id="unita-titolo" className="font-serif text-2xl text-ink sm:text-3xl">Unità e intervalli</h2>
            <p className="mt-3 text-muted">Unità più comuni: {guide.unitsAndRanges.commonUnits.join(", ")}.</p>
            <p className="mt-3 text-ink-soft">{guide.unitsAndRanges.rangeNote}</p>
          </section>
          <section aria-labelledby="fattori-titolo">
            <h2 id="fattori-titolo" className="font-serif text-2xl text-ink sm:text-3xl">Che cosa può influenzare il valore</h2>
            <ul className="mt-4 space-y-2 text-ink-soft">
              {guide.sections.factors.map((f) => (
                <li key={f} className="flex gap-3">
                  <span aria-hidden className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </section>
          <section aria-labelledby="domande-titolo" className="rounded-[var(--radius-lg)] bg-mist p-6 sm:p-8">
            <h2 id="domande-titolo" className="flex items-center gap-2 font-serif text-2xl text-ink sm:text-3xl">
              <ListChecks aria-hidden className="h-6 w-6 text-teal" /> Domande da portare al medico
            </h2>
            <ol className="mt-4 list-decimal space-y-2 pl-6 text-ink-soft">
              {guide.questionsForDoctor.map((q) => (
                <li key={q}>{q}</li>
              ))}
            </ol>
          </section>
          <section aria-labelledby="faq-titolo">
            <h2 id="faq-titolo" className="flex items-center gap-2 font-serif text-2xl text-ink sm:text-3xl">
              <HelpCircle aria-hidden className="h-6 w-6 text-teal" /> Domande frequenti
            </h2>
            <div className="mt-5">
              <FaqList items={guide.faq} />
            </div>
          </section>
          {guide.sources.length ? (
            <section aria-labelledby="fonti-titolo">
              <h2 id="fonti-titolo" className="text-lg font-semibold text-ink">Fonti consultate</h2>
              <ul className="mt-2 space-y-1 text-sm text-muted">
                {guide.sources.map((s) => (
                  <li key={s.url}>
                    <a href={s.url} className="link" rel="noopener noreferrer">
                      {s.title}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>

        <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start" aria-label="Collegamenti">
          <div className="card p-5">
            <p className="text-sm font-semibold text-ink">Vuoi capire il tuo referto?</p>
            <p className="mt-2 text-sm text-muted">Prova la demo su un referto inventato: valori riportati fedelmente, spiegazioni in parole semplici, domande per la visita.</p>
            <Link href="/esempio" className="btn btn-primary mt-4 w-full">
              Prova la demo <ArrowRight aria-hidden className="h-4 w-4" />
            </Link>
          </div>
          {terms.length ? (
            <div className="card p-5">
              <p className="text-sm font-semibold text-ink">Termini del glossario</p>
              <ul className="mt-2 space-y-1 text-[0.9375rem]">
                {terms.map((t) => (
                  <li key={t.slug}>
                    <Link href={`/glossario/${t.slug}`} className="link">
                      {t.term}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {related.length ? (
            <div className="card p-5">
              <p className="text-sm font-semibold text-ink">Guide collegate</p>
              <ul className="mt-2 space-y-1 text-[0.9375rem]">
                {related.map((r) => (
                  <li key={r.slug}>
                    <Link href={`/guide/${r.slug}`} className="link">
                      {r.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </aside>
      </div>
    </article>
  );
}

function Block({ id, title, children }: { id: string; title: string; children: string[] }) {
  return (
    <section aria-labelledby={`${id}-titolo`}>
      <h2 id={`${id}-titolo`} className="font-serif text-2xl text-ink sm:text-3xl">{title}</h2>
      <div className="mt-4 space-y-4 text-[1.0625rem] leading-relaxed text-ink-soft">
        {children.map((p) => (
          <p key={p.slice(0, 40)}>{p}</p>
        ))}
      </div>
    </section>
  );
}
