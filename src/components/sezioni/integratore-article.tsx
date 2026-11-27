import Link from "next/link";
import { PercorsoSezioni } from "@/components/sezioni/parts";
import { Jar } from "@/components/wow/jar";
import { ArrowLeft, ArrowRight, BookOpen, MessageCircleQuestionMark, TriangleAlert } from "lucide-react";
import { INTEGRATORI, INTEGRATORI_COLORS, INTEGRATORI_GROUPS, INTEGRATORI_PRIMA_DI_TUTTO, getIntegratore } from "@/content/integratori";
import { getGuide } from "@/content/guides";

/** Scheda di un integratore: spiega, collega l'esame del referto, mette le domande per il medico accanto. */
export function IntegratoreArticle({ slug }: { slug: string }) {
  const i = getIntegratore(slug);
  if (!i) return null;
  const guide = i.onReport.guide ? getGuide(i.onReport.guide) : null;
  const [c, d] = INTEGRATORI_COLORS[i.slug] ?? ["#F6B98E", "#A4471F"];
  const others = INTEGRATORI.filter((x) => x.slug !== i.slug).slice(0, 4);
  return (
    <div className="tm ds">
      <section className="ds-ph ds-ph-1 ds-ph-short" aria-labelledby="i-titolo">
        <div className="tm-wrap">
          <PercorsoSezioni current={5} />
          <Link prefetch={false} href="/integratori" className="ds-crumb">
            <ArrowLeft aria-hidden className="tm-ic" /> Guide agli integratori
          </Link>
          <p className="ds-int-head">
            <Jar c={c} d={d} />
            <span className="ds-int-g">{INTEGRATORI_GROUPS[i.group]}</span>
          </p>
          <h1 id="i-titolo">{i.name}</h1>
          {i.aka.length ? <p className="ds-aka">Lo trovi anche come: {i.aka.join(", ")}</p> : null}
          <p className="tm-lead ds-ph-lead">{i.summary}</p>
          <p className="ds-draft">Bozza in attesa di revisione medica · aggiornata il {i.lastUpdated.split("-").reverse().join("/")}</p>
        </div>
      </section>
      <section className="ds-sec-light ds-sec-tight">
        <div className="tm-wrap ds-art-g">
          <article className="ds-art-main">
            <section aria-labelledby="i-cos">
              <h2 id="i-cos">Che cos’è</h2>
              {i.whatItIs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </section>
            <section aria-labelledby="i-dove">
              <h2 id="i-dove">Dove si trova, nel cibo</h2>
              <ul className="ds-dots">
                {i.whereFound.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </section>
            <section aria-labelledby="i-perche">
              <h2 id="i-perche">Perché se ne parla</h2>
              {i.whyTalked.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </section>
            <section aria-labelledby="i-ref">
              <h2 id="i-ref">Sul tuo referto</h2>
              <div className="ds-onrep wow-paper">
                <p className="ds-onrep-ex">
                  {i.onReport.exams.map((e) => (
                    <span key={e}>{e}</span>
                  ))}
                </p>
                <p aria-hidden className="wow-mono-row">
                  {i.onReport.exams[0]} · ris. · u.m. · val. rif.
                </p>
                <p>{i.onReport.text}</p>
                {guide ? (
                  <Link prefetch={false} href={`/guide/${guide.slug}`} className="tm-tlink">
                    <BookOpen aria-hidden className="tm-ic" /> Guida all’esame: {guide.examName}
                  </Link>
                ) : null}
              </div>
            </section>
            <section aria-labelledby="i-att">
              <h2 id="i-att">
                <TriangleAlert aria-hidden className="tm-ic ds-warn-ic" /> A che cosa fare attenzione
              </h2>
              <ul className="ds-dots ds-dots-warn">
                {i.careful.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </section>
          </article>
          <aside className="ds-aside" aria-label="Da portare al medico">
            <div className="tm-ask">
              <p className="tm-k">
                <MessageCircleQuestionMark aria-hidden className="tm-ic" />
                Da chiedere al medico
              </p>
              <ul>
                {i.questions.map((q) => (
                  <li key={q}>«{q}»</li>
                ))}
              </ul>
            </div>
            <div className="ds-box">
              <b>Prima di tutto</b>
              <ul className="ds-dots ds-dots-sm">
                {INTEGRATORI_PRIMA_DI_TUTTO.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
            <div className="ds-box">
              <b>Fonti</b>
              <ul className="ds-src">
                {i.sources.map((s) => (
                  <li key={s.url}>
                    <a href={s.url} rel="noopener noreferrer" target="_blank">
                      {s.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
        {/* 27/11/2026 (fase 1): niente prodotti qui. Questa scheda si apre anche dal report, accanto ai propri valori:
            i prodotti restano nello Scaffale, a parte (src/components/scaffale/scaffale-strip.tsx). */}
        <div className="tm-wrap">
          <p className="ds-p mt-8">
            I prodotti in commercio non sono in questa pagina: stanno nello <Link href="/scaffale">Scaffale</Link>, separati dalle spiegazioni.
          </p>
        </div>
      </section>
      <section className="ds-sec-light ds-sec-alt ds-sec-tight" aria-labelledby="i-altri">
        <div className="tm-wrap">
          <h2 id="i-altri" className="ds-h3">
            Altre schede
          </h2>
          <ul className="ds-ints ds-ints-list">
            {others.map((o) => {
              const [oc, od] = INTEGRATORI_COLORS[o.slug] ?? ["#F6B98E", "#A4471F"];
              return (
                <li key={o.slug}>
                  <Link prefetch={false} href={`/integratori/${o.slug}`} className="ds-int">
                    <Jar c={oc} d={od} />
                    <span className="ds-int-t">{o.name}</span>
                    <span className="ds-int-d">{o.oneLine}</span>
                    <span className="ds-int-go">
                      Leggi <ArrowRight aria-hidden className="tm-ic" />
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </div>
  );
}
