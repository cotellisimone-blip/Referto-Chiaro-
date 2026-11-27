import Link from "next/link";
import { HomeSimboli, Ic } from "@/components/home-b/simboli";
import { DiariSimboli } from "@/components/diari/disegni";
import { SearchTrigger } from "@/components/search/site-search";
import { MALATTIE, malattiaHref } from "@/content/malattie";
import { MalattieSimboli } from "./simboli";
import { RicercheVeloci } from "./ricerche-veloci";
import "@/components/temi/temi.css";
import "@/components/diari/diari.css";
import "./malattie.css";

/**
 * La sezione «Malattie» (22/11/2026): dieci aree, la ricerca del sito in cima (la stessa di tutto il sito, non una
 * seconda), e il modo in cui sono scritte le pagine. Le prime sei aree hanno un diario.
 */
export function MalattieIndice() {
  return (
    <div className="ht ht-es ml ml-indice-pagina">
      <HomeSimboli />
      <DiariSimboli />
      <MalattieSimboli />

      <section className="ht-hero ml-hero" aria-labelledby="ht-titolo">
        <Ic id="me" className="ht-art" />
        <div className="ht-wrap">
          <nav aria-label="Sei qui">
            <p className="ht-crumb">
              <Link href="/">Home</Link> <span aria-hidden>/</span> <span>Malattie</span>
            </p>
          </nav>
          <div className="ht-hero-g">
            <span className="ht-ico" aria-hidden="true">
              <Ic id="me" />
            </span>
            <div>
              <p className="ht-kicker">
                Malattie <span className="ht-stato">Gratis</span>
              </p>
              <h1 id="ht-titolo">
                Le malattie più comuni, <em><span>spiegate bene.</span></em>
              </h1>
              <p className="ht-lead">
                Dieci aree, scritte in parole semplici e con le fonti. Ogni pagina porta agli esami di cui si parla, al diario per misurare a casa e alle domande da fare al medico.
              </p>
            </div>
          </div>

          <div className="ml-cerca">
            <SearchTrigger variant="field" className="ml-cerca-campo" placeholder="Cerca una malattia, un esame, una parola…" />
            <RicercheVeloci voci={["pressione alta", "glicemia 110", "tsh alto", "fegato grasso", "mal di testa"]} />
          </div>
        </div>
      </section>

      <section className="ht-sec" aria-labelledby="ml-aree-t">
        <div className="ht-wrap">
          <div className="ht-sec-h">
            <p className="ht-kicker">Scegli l’area</p>
            <h2 id="ml-aree-t">Dieci aree, per cominciare</h2>
          </div>
          <ul className="ml-aree">
            {MALATTIE.map((m) => (
              <li key={m.slug} className={`ht-${m.tono}`}>
                <Link href={malattiaHref(m.slug)} className="ml-area" data-testid={`area-${m.slug}`}>
                  <span className="ml-area-ico" aria-hidden="true">
                    <Ic id={m.icona} />
                  </span>
                  <span className="ml-area-k">{m.area}</span>
                  <span className="ml-area-t">{m.nome}</span>
                  <span className="ml-area-d">{m.riga}</span>
                  <span className="ml-area-piede">
                    <span className="ml-pill">{m.esami.length ? `${m.esami.length} esami spiegati` : "Senza esami del sangue"}</span>
                    {m.diario ? <span className="ml-pill">Con diario</span> : null}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="ht-sec" id="come-sono-fatte" aria-labelledby="ml-come-t">
        <div className="ht-wrap">
          <div className="ht-sec-h">
            <p className="ht-kicker">Come sono fatte queste pagine</p>
            <h2 id="ml-come-t">Quattro regole che non cambiano</h2>
          </div>
          <ol className="dr-tre ml-regole">
            <li>
              <b>Le rilegge un medico</b>
              <span>Prima di andare su Google ogni pagina viene rivista e firmata da un medico, con il nome e la data in cima. Finché non succede, la pagina lo dice.</span>
            </li>
            <li>
              <b>Le fonti sono in vista</b>
              <span>Istituto superiore di sanità, Ministero della salute, società scientifiche. In fondo a ogni pagina, con il collegamento.</span>
            </li>
            <li>
              <b>Spiegano, non visitano</b>
              <span>Niente diagnosi, niente cure né dosi, mai il consiglio di cambiare una terapia. Per il tuo caso c’è il tuo medico.</span>
            </li>
            <li>
              <b>Si ripassano ogni anno</b>
              <span>Ogni pagina ha la data dell’ultimo aggiornamento e torna in revisione dopo 12 mesi, o prima se cambiano le linee guida.</span>
            </li>
          </ol>
        </div>
      </section>

      <section className="ht-sec ht-end" aria-label="Da qui">
        <div className="ht-wrap">
          <div className="ht-azioni">
            <Link href="/diari" className="ht-btn">
              Diari della salute <Ic id="go" className="ht-ic" />
            </Link>
            <Link href="/guide" className="ht-btn ht-btn-line">
              Guide agli esami
            </Link>
            <Link href="/glossario" className="ht-btn ht-btn-line">
              Glossario
            </Link>
          </div>
          <p className="ht-112">Per un’emergenza chiama il 112. Di notte e nei festivi c’è la guardia medica pubblica, gratuita: il 116117 in Lombardia e in molte regioni, altrove il numero della tua ASL.</p>
        </div>
      </section>
    </div>
  );
}
