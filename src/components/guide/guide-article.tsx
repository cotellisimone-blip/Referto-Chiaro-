import Link from "next/link";
import { ContextualCta } from "@/components/offerta/contextual-cta";
import { ArrowRight, HelpCircle, ListChecks } from "lucide-react";
import { PrintButton, ReadingProgress, TableOfContents } from "@/components/content/reading-tools";
import type { Guide } from "@/content/guides/schema";
import { GUIDE_CATEGORIES } from "@/content/guides/schema";
import { getGuide } from "@/content/guides";
import { getGlossaryEntry } from "@/content/glossario";
import { FaqList } from "@/components/ui/faq-list";
import { ReviewNotice } from "./review-notice";
import { Breadcrumbs } from "./breadcrumbs";

/** Prima frase di un paragrafo, per il riquadro «In breve» (stesso testo già validato, nessuna parola nuova). */
function firstSentence(p: string) {
  const m = p.match(/^(.+?[.!?])(\s|$)/);
  const first = m ? m[1] : p;
  if (first.length <= 130) return first;
  // Frase lunga: ci si ferma alla prima pausa forte (due punti o punto e virgola), senza aggiungere parole.
  const cut = first.search(/[:;]/);
  if (cut > 30 && cut <= 130) return `${first.slice(0, cut)}.`;
  const sp = first.lastIndexOf(" ", 125);
  return `${first.slice(0, sp > 40 ? sp : 125)}…`;
}

/** Modello di pagina di una guida: stesse sezioni per tutte, così la lettura è prevedibile. */
export function GuideArticle({ guide }: { guide: Guide }) {
  const cat = GUIDE_CATEGORIES[guide.category];
  const related = guide.relatedGuides.map(getGuide).filter((g): g is Guide => Boolean(g));
  const terms = guide.glossaryTerms.map(getGlossaryEntry).filter((e): e is NonNullable<typeof e> => Boolean(e));
  const toc = [
    { id: "cosa-misura-titolo", label: guide.procedure ? "Che cosa mostra" : "Che cosa misura" },
    { id: "perche-titolo", label: "Perché viene richiesto" },
    ...(guide.procedure
      ? [
          { id: "preparazione-titolo", label: "Come ci si prepara" },
          { id: "aspettarsi-titolo", label: "Che cosa aspettarsi" },
          { id: "dopo-titolo", label: "E dopo l'esame" },
          { id: "referto-titolo", label: "Che cosa c'è nel referto" },
        ]
      : []),
    { id: "come-leggere-titolo", label: guide.procedure ? "Come leggere il referto" : "Come leggere il risultato" },
    ...(guide.unitsAndRanges ? [{ id: "unita-titolo", label: "Unità e intervalli" }] : []),
    { id: "fattori-titolo", label: "Che cosa può influenzare" },
    { id: "domande-titolo", label: "Domande per il medico" },
    { id: "faq-titolo", label: "Domande frequenti" },
  ];
  return (
    <article className="container-rc py-10 sm:py-14">
      <ReadingProgress />
      <Breadcrumbs items={[{ name: "Guide", path: "/guide" }, { name: cat.title, path: `/guide#${guide.category}` }, { name: guide.examName, path: `/guide/${guide.slug}` }]} />
      <header className="mt-6 max-w-3xl">
        <p className="eyebrow">{cat.title}</p>
        <h1 className="display mt-3 text-[2.25rem] sm:text-[3rem]">{guide.title}</h1>
        <p className="mt-5 text-lg text-ink-soft">{guide.summary}</p>
        {guide.aliases.length ? <p className="mt-3 text-sm text-muted">Altri nomi: {guide.aliases.join(", ")}.</p> : null}
        <div className="mt-6 flex flex-wrap gap-2">
          <Link href={`/strumenti/domande-per-il-medico?esami=${guide.slug}`} className="btn btn-primary btn-sm">
            <ListChecks aria-hidden className="h-4 w-4" /> Prepara le domande per il medico
          </Link>
          <PrintButton label="Stampa la guida" />
        </div>
      </header>
      <section aria-labelledby="in-breve-titolo" className="guide-brief mt-8 max-w-3xl rounded-[var(--radius-lg)] border border-line bg-paper p-6 shadow-[var(--shadow-card)] sm:p-8">
        <h2 id="in-breve-titolo" className="text-[1.5rem] font-bold text-ink">In breve</h2>
        <dl className="mt-4 grid gap-4 text-[1.0625rem] sm:grid-cols-3 sm:gap-6">
          <div>
            <dt className="font-bold text-teal">{guide.procedure ? "Che cosa mostra" : "Che cosa misura"}</dt>
            <dd className="mt-1 text-ink-soft">{firstSentence(guide.sections.whatItMeasures[0])}</dd>
          </div>
          <div>
            <dt className="font-bold text-teal">Quando si fa</dt>
            <dd className="mt-1 text-ink-soft">{firstSentence(guide.sections.whyRequested[0])}</dd>
          </div>
          <div>
            <dt className="font-bold text-teal">Da chiedere al medico</dt>
            <dd className="mt-1 text-ink-soft">{guide.questionsForDoctor[0]}</dd>
          </div>
        </dl>
      </section>
      <div className="mt-6 max-w-3xl">
        <ReviewNotice lastUpdated={guide.lastUpdated} />
      </div>
      <details className="no-print mt-6 max-w-3xl rounded-2xl border border-line bg-paper lg:hidden">
        <summary className="flex min-h-14 cursor-pointer items-center px-5 text-lg font-bold text-ink">Indice della pagina</summary>
        <ul className="space-y-1 px-5 pb-4">
          {toc.map((t) => (
            <li key={t.id}>
              <a href={`#${t.id}`} className="link inline-flex min-h-11 items-center text-lg">
                {t.label}
              </a>
            </li>
          ))}
        </ul>
      </details>

      <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="prose-rc max-w-3xl space-y-12">
          <Block id="cosa-misura" title={guide.procedure ? "Che cosa mostra" : "Che cosa misura"}>{guide.sections.whatItMeasures}</Block>
          <Block id="perche" title="Perché viene richiesto">{guide.sections.whyRequested}</Block>
          {guide.procedure ? (
            <>
              <Block id="preparazione" title="Come ci si prepara">{guide.procedure.preparation}</Block>
              <section aria-labelledby="aspettarsi-titolo" className="rounded-[var(--radius-lg)] bg-cream/60 p-6 sm:p-8">
                <h2 id="aspettarsi-titolo" className="font-serif text-2xl text-ink sm:text-3xl">Che cosa aspettarsi</h2>
                <p className="mt-2 text-[1.0625rem] font-semibold text-ink">Durata indicativa: {guide.procedure.duration}</p>
                <div className="mt-4 space-y-4 text-ink-soft">
                  {guide.procedure.whatToExpect.map((p) => (
                    <p key={p.slice(0, 40)}>{p}</p>
                  ))}
                </div>
              </section>
              <Block id="dopo" title="E dopo l'esame">{guide.procedure.afterwards}</Block>
              <section aria-labelledby="referto-titolo">
                <h2 id="referto-titolo" className="font-serif text-2xl text-ink sm:text-3xl">Che cosa c&apos;è nel referto</h2>
                <ul className="mt-4 list-disc space-y-2 pl-6 text-ink-soft">
                  {guide.procedure.reportContains.map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
              </section>
            </>
          ) : null}
          <Block id="come-leggere" title={guide.procedure ? "Come leggere il referto" : "Come leggere il risultato"}>{guide.sections.howToRead}</Block>
          {guide.unitsAndRanges ? (
            <section aria-labelledby="unita-titolo">
              <h2 id="unita-titolo" className="font-serif text-2xl text-ink sm:text-3xl">Unità e intervalli</h2>
              <p className="mt-3 text-muted">Unità più comuni: {guide.unitsAndRanges.commonUnits.join(", ")}.</p>
              <p className="mt-3 text-ink-soft">{guide.unitsAndRanges.rangeNote}</p>
            </section>
          ) : null}
          <section aria-labelledby="fattori-titolo">
            <h2 id="fattori-titolo" className="font-serif text-2xl text-ink sm:text-3xl">{guide.procedure ? "Che cosa può influenzare l'esame" : "Che cosa può influenzare il valore"}</h2>
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
            <Link href={`/strumenti/domande-per-il-medico?esami=${guide.slug}`} className="link no-print mt-4 inline-flex min-h-11 items-center gap-1 text-[1.0625rem] font-semibold">
              Aggiungi altri esami e stampa la lista <ArrowRight aria-hidden className="h-4 w-4" />
            </Link>
          </section>
          <ContextualCta category={guide.category} />
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
              <ul className="mt-2 text-sm text-muted">
                {guide.sources.map((s) => (
                  <li key={s.url}>
                    <a href={s.url} className="link inline-flex min-h-11 items-center" rel="noopener noreferrer">
                      {s.title}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>

        <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start" aria-label="Collegamenti">
          <div className="hidden lg:block">
            <TableOfContents items={toc} />
          </div>
          <div className="card p-5">
            <p className="text-sm font-semibold text-ink">Hai una visita in programma?</p>
            <p className="mt-2 text-sm text-muted">In 2 minuti: cosa portare e cosa chiedere. Gratis.</p>
            <Link href="/strumenti/preparati-alla-visita" className="btn btn-secondary btn-sm mt-4 w-full">
              Preparati alla visita <ArrowRight aria-hidden className="h-4 w-4" />
            </Link>
          </div>
          {terms.length ? (
            <div className="card p-5">
              <p className="text-sm font-semibold text-ink">Termini del glossario</p>
              <ul className="mt-2 text-[0.9375rem]">
                {terms.map((t) => (
                  <li key={t.slug}>
                    <Link href={`/glossario/${t.slug}`} className="link inline-flex min-h-11 items-center">
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
              <ul className="mt-2 text-[0.9375rem]">
                {related.map((r) => (
                  <li key={r.slug}>
                    <Link href={`/guide/${r.slug}`} className="link inline-flex min-h-11 items-center">
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
