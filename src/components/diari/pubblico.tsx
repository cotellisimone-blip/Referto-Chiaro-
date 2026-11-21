import Link from "next/link";
import { HomeSimboli, Ic } from "@/components/home-b/simboli";
import { DIARI, DIARI_BOZZA, DIARI_LIMITI, getDiario, type DiarioSlug } from "@/domain/diari/catalogo";
import { DiariSimboli, Disegno } from "./disegni";
import { ScaricaVuoto } from "./scarica-vuoto";
import "@/components/temi/temi.css";
import "./diari.css";

/**
 * Sezione pubblica «Diari della salute» (21/11/2026), gratis: una pagina per diario con la guida in cinque passi,
 * il posto del video, il diario da stampare e il pulsante per compilarlo dal telefono. Stessa veste delle pagine
 * delle tessere della home chiara e scura (temi.css), nelle due luci.
 */

const area = (slug?: DiarioSlug) => (slug ? `/area-personale/diari/${slug}` : "/area-personale/diari");

export function DiariIndice() {
  return (
    <div className="ht ht-gu">
      <HomeSimboli />
      <DiariSimboli />
      <section className="ht-hero" aria-labelledby="ht-titolo">
        <Ic id="diario" className="ht-art" />
        <div className="ht-wrap">
          <p className="ht-crumb">
            <Link href="/">Home</Link> <span aria-hidden>/</span> <Link href="/strumenti">Strumenti gratuiti</Link> <span aria-hidden>/</span> <span>Diari</span>
          </p>
          <div className="ht-hero-g">
            <span className="ht-ico" aria-hidden="true">
              <Ic id="diario" />
            </span>
            <div>
              <p className="ht-kicker">
                Diari della salute <span className="ht-stato">Gratis</span>
              </p>
              <h1 id="ht-titolo">
                Misura bene a casa. <em><span>Il medico legge tutto in un minuto.</span></em>
              </h1>
              <p className="ht-lead">
                Pressione, glicemia, mal di testa, sonno, peso e respiro: per ognuno una guida in cinque passi per misurare bene, un diario da stampare e uno da compilare dal telefono. Le medie le
                facciamo noi, il foglio per la visita anche.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="ht-sec" aria-labelledby="dr-scegli">
        <div className="ht-wrap">
          <div className="ht-sec-h">
            <p className="ht-kicker">Scegli il diario</p>
            <h2 id="dr-scegli">Sei diari, per cominciare</h2>
          </div>
          <ul className="dr-diari">
            {DIARI.map((d) => (
              <li key={d.slug} className={`ht-${d.tono}`}>
                <Link href={`/diari/${d.slug}`} className="dr-diario" data-testid={`diario-${d.slug}`}>
                  <span className="dr-diario-ico" aria-hidden="true">
                    <Ic id={d.icona} />
                  </span>
                  <span className="dr-diario-t">{d.nome}</span>
                  <span className="dr-diario-d">{d.perChi}</span>
                  <span className="dr-diario-q">{d.quando.split(":")[0].split(". ")[0]}.</span>
                  <span className="ht-voce-go">
                    Guida e diario <Ic id="go" className="ht-ic" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="ht-sec" aria-labelledby="dr-come">
        <div className="ht-wrap">
          <div className="ht-sec-h">
            <p className="ht-kicker">Come funziona</p>
            <h2 id="dr-come">Dalla misura al medico, in tre mosse</h2>
          </div>
          <ol className="dr-tre">
            <li>
              <b>Impara a misurare bene</b>
              <span>Cinque passi illustrati, presi dalle indicazioni delle società scientifiche. Il video breve arriverà.</span>
            </li>
            <li>
              <b>Scrivi, su carta o dal telefono</b>
              <span>Il diario da stampare è gratis. Online una misura si scrive in 20 secondi, anche per un familiare.</span>
            </li>
            <li>
              <b>Porta il foglio alla visita</b>
              <span>Una pagina con le medie già calcolate e le misure in ordine. Da stampare o da mostrare dal telefono.</span>
            </li>
          </ol>
          <div className="ht-nota dr-nota">
            {DIARI_LIMITI.map((l) => (
              <p key={l}>{l}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="ht-sec ht-end" aria-label="Da qui">
        <div className="ht-wrap">
          <div className="ht-azioni">
            <Link href={area()} className="ht-btn">
              Apri i tuoi diari <Ic id="go" className="ht-ic" />
            </Link>
            <Link href="/strumenti" className="ht-btn ht-btn-line">
              Tutti gli strumenti gratuiti <Ic id="go" className="ht-ic" />
            </Link>
          </div>
          <p className="ht-112">Per un’emergenza chiama il 112. Di notte e nei festivi c’è la guardia medica pubblica, gratuita: 116117.</p>
        </div>
      </section>
    </div>
  );
}

export function DiarioPubblico({ slug }: { slug: DiarioSlug }) {
  const d = getDiario(slug)!;
  const altri = DIARI.filter((x) => x.slug !== slug);
  return (
    <div className={`ht ht-${d.tono}`}>
      <HomeSimboli />
      <DiariSimboli />
      <section className="ht-hero" aria-labelledby="ht-titolo">
        <Ic id={d.icona} className="ht-art" />
        <div className="ht-wrap">
          <p className="ht-crumb">
            <Link href="/">Home</Link> <span aria-hidden>/</span> <Link href="/diari">Diari</Link> <span aria-hidden>/</span> <span>{d.nome}</span>
          </p>
          <div className="ht-hero-g">
            <span className="ht-ico" aria-hidden="true">
              <Ic id={d.icona} />
            </span>
            <div>
              <p className="ht-kicker">
                Diari della salute <span className="ht-stato">Gratis</span>
              </p>
              <h1 id="ht-titolo">
                {d.titolo} <em><span>{d.em}</span></em>
              </h1>
              <p className="ht-lead">{d.lead}</p>
              <div className="dr-cta">
                <Link href={area(slug)} className="ht-btn" data-testid="compila-online">
                  Compilalo dal telefono <Ic id="go" className="ht-ic" />
                </Link>
                <ScaricaVuoto slug={slug} className="ht-btn ht-btn-line" />
              </div>
              <dl className="dr-fatti">
                <div>
                  <dt>Per chi</dt>
                  <dd>{d.perChi}</dd>
                </div>
                <div>
                  <dt>Quando</dt>
                  <dd>{d.quando}</dd>
                </div>
              </dl>
              <p className="ht-bozza" data-bozza="medico">
                {DIARI_BOZZA}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="ht-sec" id="come-misurare" aria-labelledby="dr-passi">
        <div className="ht-wrap">
          <div className="ht-sec-h">
            <p className="ht-kicker">Guida illustrata</p>
            <h2 id="dr-passi">Come misurare bene, in cinque passi</h2>
          </div>
          <ol className="dr-passi">
            {d.passi.map((p, i) => (
              <li key={p.art} className="dr-passo">
                <Disegno art={p.art} className="dr-passo-art" />
                <div className="dr-passo-txt">
                  <span className="dr-passo-n" aria-hidden="true">
                    {i + 1}
                  </span>
                  <h3>{p.titolo}</h3>
                  <p>{p.testo}</p>
                </div>
              </li>
            ))}
          </ol>
          <div className="dr-video" role="note" aria-label="Video in arrivo">
            <span className="dr-video-play" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="M8 5.5v13l10.5-6.5z" />
              </svg>
            </span>
            <div>
              <p className="dr-video-t">Il video di 90 secondi arriverà</p>
              <p className="dr-video-d">Lo registra un medico, con le stesse indicazioni dei cinque passi. Intanto la guida illustrata dice tutto quello che serve.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="ht-sec" aria-labelledby="dr-dentro">
        <div className="ht-wrap">
          <div className="dr-due">
            <div>
              <h2 id="dr-dentro" className="dr-h2">
                Che cosa c’è nel diario
              </h2>
              <ul className="dr-lista">
                {d.colonne.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="dr-h2">Che cosa calcola il sito</h2>
              <ul className="dr-lista">
                {d.calcoli.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
              <p className="dr-piccolo">Solo conti: il sito non giudica i numeri e non suggerisce di cambiare la cura.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="ht-sec" aria-labelledby="dr-faq">
        <div className="ht-wrap">
          <div className="ht-sec-h">
            <p className="ht-kicker">Domande frequenti</p>
            <h2 id="dr-faq">Quello che ci chiedono</h2>
          </div>
          <div className="dr-faq">
            {d.faq.map((f) => (
              <details key={f.d}>
                <summary>{f.d}</summary>
                <p>{f.r}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="ht-sec" aria-labelledby="dr-fonti">
        <div className="ht-wrap">
          <div className="ht-nota dr-fonti">
            <h2 id="dr-fonti" className="dr-h3">
              Le fonti
            </h2>
            <p>Il diario e la guida sono nostri. Seguono le indicazioni di queste società scientifiche, senza copiare i loro moduli:</p>
            <ul>
              {d.fonti.map((f) => (
                <li key={f.titolo}>
                  <b>{f.ente}</b>: <a href={f.url} rel="noopener noreferrer">{f.titolo}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="ht-sec ht-end" aria-label="Da qui">
        <div className="ht-wrap">
          <div className="ht-azioni">
            <Link href={area(slug)} className="ht-btn">
              Compilalo dal telefono <Ic id="go" className="ht-ic" />
            </Link>
            {altri.map((a) => (
              <Link key={a.slug} href={`/diari/${a.slug}`} className="ht-btn ht-btn-line">
                Diario: {a.nome.toLowerCase()} <Ic id="go" className="ht-ic" />
              </Link>
            ))}
          </div>
          <p className="ht-112">Se stai male non aspettare il diario: chiama il tuo medico. Per un’emergenza chiama il 112; di notte e nei festivi c’è la guardia medica, gratuita: 116117.</p>
        </div>
      </section>
    </div>
  );
}
