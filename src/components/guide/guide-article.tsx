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
    <div className="article-shell">
      <article className="container-rc article-body">
        <ReadingProgress />
        <Breadcrumbs items={[{ name: "Guide", path: "/guide" }, { name: cat.title, path: `/guide#${guide.category}` }, { name: guide.examName, path: `/guide/${guide.slug}` }]} />
        <header className="mt-6 max-w-3xl">
          <p className="eyebrow">{cat.title}</p>
          <h1 className="page-title page-title-sm mt-4">{guide.title}</h1>
          <p className="lead mt-5">{guide.summary}</p>
          {guide.aliases.length ? <p className="mt-3 text-base text-muted">Altri nomi: {guide.aliases.join(", ")}.</p> : null}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link href={`/strumenti/domande-per-il-medico?esami=${guide.slug}`} className="btn btn-primary">
              <ListChecks aria-hidden className="h-5 w-5" /> Prepara le domande per il medico
            </Link>
            <PrintButton label="Stampa la guida" />
          </div>
        </header>
        <section aria-labelledby="in-breve-titolo" className="guide-brief mt-8 max-w-3xl rounded-[var(--radius-xl)] border border-line bg-paper p-6 shadow-[var(--shadow-lift)] sm:p-8">
          <h2 id="in-breve-titolo" className="eyebrow">
            In breve
          </h2>
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
          <div className="guide-prose max-w-3xl">
            <Block id="cosa-misura" title={guide.procedure ? "Che cosa mostra" : "Che cosa misura"}>{guide.sections.whatItMeasures}</Block>
            <Block id="perche" title="Perché viene richiesto">{guide.sections.whyRequested}</Block>
            {guide.procedure ? (
              <>
                <Block id="preparazione" title="Come ci si prepara">{guide.procedure.preparation}</Block>
                <section aria-labelledby="aspettarsi-titolo" className="guide-box guide-box-warm">
                  <h2 id="aspettarsi-titolo" className="guide-h2">Che cosa aspettarsi</h2>
                  <p className="mt-2 text-[1.0625rem] font-semibold text-ink">Durata indicativa: {guide.procedure.duration}</p>
                  <div className="mt-4 space-y-4">
                    {guide.procedure.whatToExpect.map((p) => (
                      <p key={p.slice(0, 40)}>{p}</p>
                    ))}
                  </div>
                </section>
                <Block id="dopo" title="E dopo l'esame">{guide.procedure.afterwards}</Block>
                <section aria-labelledby="referto-titolo">
                  <h2 id="referto-titolo" className="guide-h2">Che cosa c&apos;è nel referto</h2>
                  <ul className="dot-list mt-4">
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
                <h2 id="unita-titolo" className="guide-h2">Unità e intervalli</h2>
                <p className="mt-4 font-semibold text-ink">Unità più comuni: {guide.unitsAndRanges.commonUnits.join(", ")}.</p>
                <p className="mt-3">{guide.unitsAndRanges.rangeNote}</p>
              </section>
            ) : null}
            <section aria-labelledby="fattori-titolo">
              <h2 id="fattori-titolo" className="guide-h2">{guide.procedure ? "Che cosa può influenzare l'esame" : "Che cosa può influenzare il valore"}</h2>
              <ul className="dot-list mt-4">
                {guide.sections.factors.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </section>
            <section aria-labelledby="domande-titolo" className="guide-box">
              <h2 id="domande-titolo" className="guide-h2 flex items-center gap-2.5">
                <ListChecks aria-hidden /> Domande da portare al medico
              </h2>
              <ol className="num-list mt-5">
                {guide.questionsForDoctor.map((q) => (
                  <li key={q}>{q}</li>
                ))}
              </ol>
              <Link href={`/strumenti/domande-per-il-medico?esami=${guide.slug}`} className="link no-print mt-5 inline-flex min-h-11 items-center gap-1.5 font-semibold">
                Aggiungi altri esami e stampa la lista <ArrowRight aria-hidden className="h-4 w-4" />
              </Link>
            </section>
            <ContextualCta category={guide.category} slug={guide.slug} />
            <section aria-labelledby="faq-titolo">
              <h2 id="faq-titolo" className="guide-h2 flex items-center gap-2.5">
                <HelpCircle aria-hidden /> Domande frequenti
              </h2>
              <div className="mt-5">
                <FaqList items={guide.faq} />
              </div>
            </section>
            {guide.sources.length ? (
              <section aria-labelledby="fonti-titolo">
                <h2 id="fonti-titolo" className="text-xl font-extrabold text-ink">Fonti consultate</h2>
                <ul className="link-list mt-2">
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
            <div className="hidden lg:block">
              <TableOfContents items={toc} />
            </div>
            <div className="side-card">
              <p className="side-card-title">Hai una visita in programma?</p>
              <p className="mt-1.5 text-base text-ink-soft">In 2 minuti: cosa portare e cosa chiedere. Gratis.</p>
              <Link href="/strumenti/preparati-alla-visita" className="btn btn-secondary btn-sm mt-4 w-full">
                Preparati alla visita <ArrowRight aria-hidden className="h-4 w-4" />
              </Link>
            </div>
            {terms.length ? (
              <div className="side-card">
                <p className="side-card-title">Termini del glossario</p>
                <ul className="link-list mt-1">
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
              <div className="side-card">
                <p className="side-card-title">Guide collegate</p>
                <ul className="link-list mt-1">
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
    </div>
  );
}

function Block({ id, title, children }: { id: string; title: string; children: string[] }) {
  return (
    <section aria-labelledby={`${id}-titolo`}>
      <h2 id={`${id}-titolo`} className="guide-h2">{title}</h2>
      <div className="mt-4 space-y-4">
        {children.map((p) => (
          <p key={p.slice(0, 40)}>{p}</p>
        ))}
      </div>
    </section>
  );
}
