import Link from "next/link";
import { ContextualCta } from "@/components/offerta/contextual-cta";
import { absoluteUrl } from "@/lib/seo";
import { ArrowRight, HelpCircle, ListChecks } from "lucide-react";
import { PrintButton, ReadingProgress, TableOfContents } from "@/components/content/reading-tools";
import type { Guide } from "@/content/guides/schema";
import { GUIDE_CATEGORIES } from "@/content/guides/schema";
import { getGuide } from "@/content/guides";
import { getGlossaryEntry } from "@/content/glossario";
import { integratoriForGuide } from "@/content/integratori";
import { FaqList } from "@/components/ui/faq-list";
import { ReviewNotice } from "./review-notice";
import { Breadcrumbs } from "./breadcrumbs";
import { CategoryBadge } from "@/components/wow/category-art";
import { enfasi } from "@/components/ui/titolo";
import { PercorsoSezioni } from "@/components/sezioni/parts";

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
  // 18/11/2026 (secondo giro, punto 18): le guide pratiche (carte, copie, ricette) hanno titoli di sezione loro.
  const pr = guide.practical === true;
  const T = pr
    ? { what: "Di che cosa si tratta", why: "Quando serve", prep: "Che cosa ti serve", expect: "Come si fa", after: "E dopo", contains: "Che cosa controllare", read: "Come orientarsi", factors: "A che cosa fare attenzione" }
    : {
        what: guide.procedure ? "Che cosa mostra" : "Che cosa misura",
        why: "Perché viene richiesto",
        prep: "Come ci si prepara",
        expect: "Che cosa aspettarsi",
        after: "E dopo l'esame",
        contains: "Che cosa c'è nel referto",
        read: guide.procedure ? "Come leggere il referto" : "Come leggere il risultato",
        factors: guide.procedure ? "Che cosa può influenzare l'esame" : "Che cosa può influenzare il valore",
      };
  const toc = [
    { id: "cosa-misura-titolo", label: T.what },
    { id: "perche-titolo", label: T.why },
    ...(guide.procedure
      ? [
          { id: "preparazione-titolo", label: T.prep },
          { id: "aspettarsi-titolo", label: T.expect },
          { id: "dopo-titolo", label: T.after },
          { id: "referto-titolo", label: T.contains },
        ]
      : []),
    { id: "come-leggere-titolo", label: T.read },
    ...(guide.unitsAndRanges ? [{ id: "unita-titolo", label: "Unità e intervalli" }] : []),
    { id: "fattori-titolo", label: pr ? T.factors : "Che cosa può influenzare" },
    { id: "domande-titolo", label: "Domande per il medico" },
    { id: "faq-titolo", label: "Domande frequenti" },
  ];
  const supplements = integratoriForGuide(guide.slug);
  // Il percorso non ripete due volte la stessa parola («Emocromo › Emocromo completo»): se l'esame porta già il nome
  // del suo argomento, l'argomento non compare.
  const sameWord = guide.examName.toLowerCase().startsWith(cat.title.toLowerCase());
  const crumbs = [
    { name: "Guide", path: "/guide" },
    ...(sameWord ? [] : [{ name: cat.title, path: `/guide#${guide.category}` }]),
    { name: guide.examName, path: `/guide/${guide.slug}` },
  ];
  return (
    <div className="article-shell">
      <article className="container-rc article-body">
        <ReadingProgress />
        {/* 17/11/2026 (20 interventi, punti 7 e 11): la barra delle sezioni è larga quanto la pagina; su computer «In breve»
            sta accanto al titolo (prima la metà destra della prima schermata era vuota). */}
        <div className="tm ds ds-bare no-print">
          <PercorsoSezioni current={1} />
        </div>
        <Breadcrumbs items={crumbs} />
        <div className="guide-top">
        <header className="wow-guide-head mt-9 max-w-3xl lg:mt-6">
          <CategoryBadge id={guide.category} size={80} />
          <p className="eyebrow">{cat.title}</p>
          <h1 className="page-title page-title-sm mt-4">{enfasi(guide.title)}</h1>
          <p className="lead mt-5">{guide.summary}</p>
          {guide.aliases.length ? <p className="mt-3 text-base text-muted">Altri nomi: {guide.aliases.join(", ")}.</p> : null}
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link href={`/strumenti/domande-per-il-medico?esami=${guide.slug}`} className="btn btn-primary no-print">
              <ListChecks aria-hidden className="h-5 w-5" /> Prepara le domande per il medico
            </Link>
            <PrintButton label="Stampa la guida" />
          </div>
        </header>
        <section aria-labelledby="in-breve-titolo" className="guide-brief mt-8 max-w-3xl rounded-[var(--radius-xl)] border border-line bg-paper p-6 shadow-[var(--shadow-lift)] sm:p-8 lg:mt-6 lg:max-w-none lg:p-7">
          <h2 id="in-breve-titolo" className="eyebrow">
            In breve
          </h2>
          <dl className="mt-4 grid gap-4 text-[1.0625rem] sm:grid-cols-3 sm:gap-6 lg:grid-cols-1 lg:gap-4">
            <div>
              <dt className="font-bold text-teal">{T.what}</dt>
              <dd className="mt-1 text-ink-soft">{firstSentence(guide.sections.whatItMeasures[0])}</dd>
            </div>
            <div>
              <dt className="font-bold text-teal">{pr ? "Quando serve" : "Quando si fa"}</dt>
              <dd className="mt-1 text-ink-soft">{firstSentence(guide.sections.whyRequested[0])}</dd>
            </div>
            <div>
              <dt className="font-bold text-teal">Da chiedere al medico</dt>
              <dd className="mt-1 text-ink-soft">{guide.questionsForDoctor[0]}</dd>
            </div>
          </dl>
        </section>
        </div>
        <div className="mt-6 max-w-3xl">
          <ReviewNotice lastUpdated={guide.lastUpdated} practical={pr} />
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
            <Block id="cosa-misura" title={T.what}>{guide.sections.whatItMeasures}</Block>
            <Block id="perche" title={T.why}>{guide.sections.whyRequested}</Block>
            {guide.procedure ? (
              <>
                <Block id="preparazione" title={T.prep}>{guide.procedure.preparation}</Block>
                <section aria-labelledby="aspettarsi-titolo" className="guide-box guide-box-warm">
                  <h2 id="aspettarsi-titolo" className="guide-h2">{T.expect}</h2>
                  <p className="mt-2 text-[1.0625rem] font-semibold text-ink">Durata indicativa: {guide.procedure.duration}</p>
                  <div className="mt-4 space-y-4">
                    {guide.procedure.whatToExpect.map((p) => (
                      <p key={p.slice(0, 40)}>{p}</p>
                    ))}
                  </div>
                </section>
                <Block id="dopo" title={T.after}>{guide.procedure.afterwards}</Block>
                <section aria-labelledby="referto-titolo">
                  <h2 id="referto-titolo" className="guide-h2">{T.contains}</h2>
                  <ul className="dot-list mt-4">
                    {guide.procedure.reportContains.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                </section>
              </>
            ) : null}
            <Block id="come-leggere" title={T.read}>{guide.sections.howToRead}</Block>
            {guide.unitsAndRanges ? (
              <section aria-labelledby="unita-titolo" className="wow-paper p-5 sm:p-7">
                <h2 id="unita-titolo" className="guide-h2">Unità e intervalli</h2>
                <p className="mt-3 text-[1.0625rem] text-ink-soft">Sul referto lo trovi in una riga come questa:</p>
                <p aria-hidden className="wow-mono-row">
                  {guide.examName} · ris. · {guide.unitsAndRanges.commonUnits[0]} · val. rif.
                </p>
                <p className="mt-4 font-semibold text-ink">Unità più comuni: {guide.unitsAndRanges.commonUnits.join(", ")}.</p>
                <p className="mt-3">{guide.unitsAndRanges.rangeNote}</p>
              </section>
            ) : null}
            <section aria-labelledby="fattori-titolo">
              <h2 id="fattori-titolo" className="guide-h2">{T.factors}</h2>
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

          <aside className="no-print space-y-6 lg:sticky lg:top-28 lg:self-start" aria-label="Collegamenti">
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
            {supplements.length ? (
              <div className="side-card" data-testid="guida-integratori">
                <p className="side-card-title">Tra gli integratori</p>
                <p className="mt-1.5 text-base text-ink-soft">Che cosa sono e che cosa chiedere al medico. Nessun consiglio su che cosa prendere.</p>
                <ul className="link-list mt-1">
                  {supplements.map((i) => (
                    <li key={i.slug}>
                      <Link href={`/integratori/${i.slug}`} className="link">
                        {i.name}
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
        {/* 18/11/2026 (secondo giro, punto 14): in fondo al foglio stampato, da dove viene e che cosa non è. */}
        <p className="print-only print-foot">
          Stampato da Cura Privata · guida «{guide.examName}», {absoluteUrl(`/guide/${guide.slug}`).replace(/^https?:\/\//, "")} · aggiornata il {new Date(guide.lastUpdated).toLocaleDateString("it-IT")}. Informazioni generali: che cosa significa un valore per te lo dice il tuo medico. Per un&apos;urgenza chiama il 112.
        </p>
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
