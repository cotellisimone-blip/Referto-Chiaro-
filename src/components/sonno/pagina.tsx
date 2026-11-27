import Link from "next/link";
import { IndiceAgganciato } from "@/components/malattie/indice-agganciato";
import { HomeSimboli, Ic } from "@/components/home-b/simboli";
import { DiariSimboli } from "@/components/diari/disegni";
import { MalattieSimboli } from "@/components/malattie/simboli";
import { dataIt } from "@/components/malattie/pagina";
import { SONNO_BOZZA, getAutovalutazione, getSonnoPagina, sonnoHref, type Blocco, type SonnoPagina } from "@/content/sonno";
import { SonnoSimboli } from "./simboli";
import { DueProcessi, Ipnogramma } from "./disegni";
import "@/components/temi/temi.css";
import "@/components/diari/diari.css";
import "@/components/malattie/malattie.css";
import "./sonno.css";

/**
 * Una pagina della sezione sonno (22/11/2026): stessa veste delle pagine di malattia (colore viola dell'area sonno),
 * blocchi liberi dentro le sezioni. Il testo è in src/content/sonno.
 */

const TIPO: Record<SonnoPagina["tipo"], string> = { problema: "Da dove parti", spiegazione: "Per capire", percorso: "Il percorso" };

export function Briciole({ ultima }: { ultima: string }) {
  return (
    <nav aria-label="Sei qui">
      <p className="ht-crumb">
        <Link href="/">Home</Link> <span aria-hidden>/</span> <Link href="/prenditi-cura-di-te">Prenditi cura di te</Link> <span aria-hidden>/</span> <Link href="/prenditi-cura-di-te/sonno">Sonno</Link> <span aria-hidden>/</span>{" "}
        <span>{ultima}</span>
      </p>
    </nav>
  );
}

export function Fiducia({ aggiornato, fonti }: { aggiornato: string; fonti: number }) {
  return (
    <div className="ml-fiducia" data-revisione="bozza">
      <span className="ml-fiducia-ico" aria-hidden="true">
        <Ic id="firma" />
      </span>
      <div>
        <p className="ml-fiducia-t" data-bozza="medico">
          {SONNO_BOZZA}
        </p>
        <p className="ml-fiducia-d">
          Aggiornata il {dataIt(aggiornato)} · Un medico la rileggerà e la firmerà · <a href="#fonti">{fonti} fonti</a>
        </p>
      </div>
    </div>
  );
}

export function Fonti({ fonti, aggiornato, regole }: { fonti: { ente: string; titolo: string; url: string }[]; aggiornato: string; regole: string }) {
  return (
    <section className="ht-sec ml-sec" id="fonti" aria-labelledby="fonti-t">
      <div className="ht-wrap">
        <div className="ht-nota dr-fonti ml-fonti">
          <h2 id="fonti-t" className="dr-h3">
            Le fonti
          </h2>
          <p>Il testo è nostro, scritto per essere chiaro. Segue queste fonti istituzionali e delle società scientifiche, consultate il {dataIt(aggiornato)}:</p>
          <ul>
            {fonti.map((f) => (
              <li key={f.url + f.titolo}>
                <b>{f.ente}</b>: <a href={f.url} rel="noopener noreferrer">{f.titolo}</a>
              </li>
            ))}
          </ul>
          <p className="ml-fonti-regole">{regole}</p>
        </div>
      </div>
    </section>
  );
}

export function FineSonno() {
  return (
    <section className="ht-sec ht-end" aria-label="Da qui">
      <div className="ht-wrap">
        <div className="ht-azioni">
          <Link href="/prenditi-cura-di-te/sonno#sonno-porte" className="ht-btn">
            Tutta la sezione sonno <Ic id="go" className="ht-ic" />
          </Link>
          <Link href="/prenditi-cura-di-te/sonno/percorso-due-settimane" className="ht-btn ht-btn-line">
            Il percorso di due settimane
          </Link>
          <Link href="/area-personale/diari/sonno" className="ht-btn ht-btn-line">
            Diario del sonno
          </Link>
        </div>
        <p className="ht-112">Per un’emergenza chiama il 112. Di notte e nei festivi c’è la guardia medica pubblica, gratuita: il 116117 in Lombardia e in molte regioni, altrove il numero della tua ASL.</p>
      </div>
    </section>
  );
}

function BloccoView({ b }: { b: Blocco }) {
  if ("p" in b) return <p className="ml-p">{b.p}</p>;
  if ("punti" in b)
    return b.stile === "numeri" ? (
      <ol className="sn-passi">
        {b.punti.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ol>
    ) : (
      <ul className="ml-segni sn-segni">
        {b.punti.map((p) => (
          <li key={p}>{p}</li>
        ))}
      </ul>
    );
  if ("tabella" in b)
    return (
      <div className="sn-tab-w">
        <div className="ml-numeri sn-tab" data-colonne={b.tabella.colonne.length}>
          <table>
            <thead>
              <tr>
                {b.tabella.colonne.map((c) => (
                  <th key={c} scope="col">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {b.tabella.righe.map((r) => (
                <tr key={r.join("|")}>
                  {r.map((c, i) =>
                    i === 0 ? (
                      <th key={i} scope="row" data-label={b.tabella.colonne[0]}>
                        {c}
                      </th>
                    ) : (
                      <td key={i} data-label={b.tabella.colonne[i]}>
                        {c}
                      </td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {b.nota ? <p className="ml-nota-n">{b.nota}</p> : null}
      </div>
    );
  if ("riquadro" in b)
    return (
      <div className={`sn-riquadro sn-riquadro-${b.riquadro.tono}`} role={b.riquadro.tono === "attenzione" ? "note" : undefined}>
        <span className="sn-riquadro-ico" aria-hidden="true">
          <Ic id={b.riquadro.tono === "attenzione" ? "allarme" : "firma"} />
        </span>
        <div>
          <p className="sn-riquadro-t">{b.riquadro.titolo}</p>
          <p className="sn-riquadro-d">{b.riquadro.testo}</p>
        </div>
      </div>
    );
  if ("vai" in b)
    return (
      <Link href={b.vai.href} className="sn-vai">
        <span className="sn-vai-t">{b.vai.titolo}</span>
        <span className="sn-vai-d">{b.vai.testo}</span>
        <span className="sn-vai-go" aria-hidden="true">
          <Ic id="go" />
        </span>
      </Link>
    );
  return b.disegno === "ipnogramma" ? <Ipnogramma /> : <DueProcessi />;
}

export function SonnoPaginaView({ p }: { p: SonnoPagina }) {
  const av = p.autovalutazione ? getAutovalutazione(p.autovalutazione) : null;
  const indice = [
    ...p.sezioni.map((s) => ({ id: s.id, label: s.titolo.length > 34 ? s.kicker : s.titolo })),
    ...(p.quandoChiamare ? [{ id: "quando-chiamare", label: "Quando chiamare" }] : []),
    { id: "domande", label: "Domande per il medico" },
    { id: "fonti", label: "Fonti" },
  ];
  return (
    <div className="ht ht-sc ml sn" data-sonno={p.slug}>
      <HomeSimboli />
      <DiariSimboli />
      <MalattieSimboli />
      <SonnoSimboli />

      <section className="ht-hero ml-hero" aria-labelledby="ht-titolo">
        <Ic id={p.icona} className="ht-art" />
        <div className="ht-wrap">
          <Briciole ultima={p.porta} />
          <div className="ht-hero-g">
            <span className="ht-ico" aria-hidden="true">
              <Ic id={p.icona} />
            </span>
            <div>
              <p className="ht-kicker">
                Sonno · {TIPO[p.tipo]}
                <span className="ht-stato">Bozza</span>
              </p>
              <h1 id="ht-titolo">
                {p.titolo} <em><span>{p.em}</span></em>
              </h1>
            </div>
          </div>

          <div className="ml-breve" aria-labelledby="ml-breve-t">
            <p id="ml-breve-t" className="ml-breve-t">
              In breve
            </p>
            <ol>
              {p.inBreve.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ol>
          </div>
          <Fiducia aggiornato={p.aggiornato} fonti={p.fonti.length} />

          <nav className="ml-indice" id="indice-pagina" aria-label="In questa pagina">
            <p className="ml-indice-t">In questa pagina</p>
            <ul>
              {indice.map((i) => (
                <li key={i.id}>
                  <a href={`#${i.id}`}>{i.label}</a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>
      <IndiceAgganciato voci={indice} ancora="indice-pagina" />

      {p.sezioni.map((s, i) => (
        <section key={s.id} className="ht-sec ml-sec" id={s.id} aria-labelledby={`${s.id}-t`}>
          <div className="ht-wrap">
            <div className="ml-col sn-col">
              <p className="ht-kicker">{s.kicker}</p>
              <h2 id={`${s.id}-t`} className="ml-h2">
                {s.titolo}
              </h2>
              {s.blocchi.map((b, j) => (
                <BloccoView key={j} b={b} />
              ))}
            </div>
            {i === 0 && av ? (
              <Link href={`${sonnoHref(av.slug)}#domande`} className="sn-av-invito" data-testid="invito-autovalutazione">
                <span className="sn-av-invito-ico" aria-hidden="true">
                  <Ic id="s-test" />
                </span>
                <span className="sn-av-invito-txt">
                  <span className="ht-kicker">Due minuti · Gratis · Resta sul tuo telefono</span>
                  <span className="sn-av-invito-t">Autovalutazione: {av.porta.toLowerCase()}</span>
                  <span className="sn-av-invito-d">{av.domande.length} domande scritte da noi, con le fonti. Non è una diagnosi: ti aiuta a raccontarlo al medico.</span>
                </span>
                <span className="ht-btn sn-av-invito-btn">
                  Comincia <Ic id="go" className="ht-ic" />
                </span>
              </Link>
            ) : null}
          </div>
        </section>
      ))}

      {p.quandoChiamare ? (
        <section className="ht-sec ml-sec" id="quando-chiamare" aria-labelledby="quando-chiamare-t">
          <div className="ht-wrap">
            <div className="ml-col">
              <p className="ht-kicker">Da non aspettare</p>
              <h2 id="quando-chiamare-t" className="ml-h2">
                Quando chiamare
              </h2>
            </div>
            <div className="ml-allarme">
              <div className="ml-allarme-c ml-sos">
                <p className="ml-allarme-h">
                  <span className="ml-allarme-ico" aria-hidden="true">
                    <Ic id="allarme" />
                  </span>
                  <span>
                    Chiama subito il <b>112</b>
                  </span>
                </p>
                <ul>
                  {p.quandoChiamare.subito.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
                <a className="ml-chiama" href="tel:112">
                  Chiama il 112
                </a>
              </div>
              <div className="ml-allarme-c ml-presto">
                <p className="ml-allarme-h">
                  <span className="ml-allarme-ico" aria-hidden="true">
                    <Ic id="me" />
                  </span>
                  <span>Senti il medico a breve</span>
                </p>
                <ul>
                  {p.quandoChiamare.presto.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
                <p className="ml-guardia">Di notte e nei festivi c’è la guardia medica, gratuita: il 116117 in Lombardia e in molte regioni, altrove il numero della tua ASL.</p>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <section className="ht-sec ml-sec" id="domande" aria-labelledby="domande-t">
        <div className="ht-wrap">
          <div className="ml-domande">
            <div className="ml-domande-h">
              <span className="ml-domande-ico" aria-hidden="true">
                <Ic id="domande" />
              </span>
              <div>
                <p className="ht-kicker">Da portare alla visita</p>
                <h2 id="domande-t" className="ml-h2">
                  Domande per il medico
                </h2>
              </div>
            </div>
            <ol className="ml-domande-l">
              {p.domande.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ol>
            <div className="ml-domande-azioni">
              <Link href="/prenditi-cura-di-te/sonno/percorso-due-settimane" className="ht-btn">
                Porta anche il diario di due settimane <Ic id="go" className="ht-ic" />
              </Link>
              <Link href="/strumenti/preparati-alla-visita" className="ht-btn ht-btn-line">
                Preparati alla visita
              </Link>
            </div>
          </div>
        </div>
      </section>

      {p.faq.length ? (
        <section className="ht-sec ml-sec" id="faq" aria-labelledby="faq-t">
          <div className="ht-wrap">
            <div className="ml-col">
              <p className="ht-kicker">Domande frequenti</p>
              <h2 id="faq-t" className="ml-h2">
                Quello che ci si chiede
              </h2>
            </div>
            <div className="dr-faq ml-faq">
              {p.faq.map((f) => (
                <details key={f.d}>
                  <summary>{f.d}</summary>
                  <p>{f.r}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="ht-sec ml-sec" aria-labelledby="correlate-t">
        <div className="ht-wrap">
          <div className="ht-sec-h">
            <p className="ht-kicker">Nella sezione sonno</p>
            <h2 id="correlate-t">Da leggere dopo</h2>
          </div>
          <ul className="ml-correlate">
            {p.correlate.map((s) => {
              const c = getSonnoPagina(s)!;
              return (
                <li key={s} className="ht-sc">
                  <Link href={sonnoHref(c.slug)} className="ml-area">
                    <span className="ml-area-ico" aria-hidden="true">
                      <Ic id={c.icona} />
                    </span>
                    <span className="ml-area-k">{TIPO[c.tipo]}</span>
                    <span className="ml-area-t">{c.porta}</span>
                    <span className="ml-area-d">{c.riga}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <Fonti
        fonti={p.fonti}
        aggiornato={p.aggiornato}
        regole="Questa pagina spiega e non fa diagnosi; non indica cure, farmaci, dosi né orari di sonno su misura. Le decisioni sulla cura restano al tuo medico."
      />
      <FineSonno />
    </div>
  );
}
