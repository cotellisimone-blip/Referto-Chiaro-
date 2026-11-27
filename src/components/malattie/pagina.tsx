import Link from "next/link";
import { IndiceAgganciato } from "@/components/malattie/indice-agganciato";
import { HomeSimboli, Ic } from "@/components/home-b/simboli";
import { DiariSimboli } from "@/components/diari/disegni";
import { getGuide } from "@/content/guides";
import { GLOSSARY } from "@/content/glossario";
import { MALATTIE_BOZZA, getMalattia, malattiaHref, type Malattia } from "@/content/malattie";
import { getDiario } from "@/domain/diari/catalogo";
import { MalattieSimboli } from "./simboli";
import { SonnoPorte } from "@/components/sonno/porte";
import "@/components/temi/temi.css";
import "@/components/diari/diari.css";
import "./malattie.css";

/**
 * Una pagina di malattia (22/11/2026): gli stessi blocchi nello stesso ordine per tutte, così si impara a usarla una
 * volta sola. Veste dei temi della home chiara e scura, nel colore dell’area. Il testo è in src/content/malattie.
 */

const MESI = ["gennaio", "febbraio", "marzo", "aprile", "maggio", "giugno", "luglio", "agosto", "settembre", "ottobre", "novembre", "dicembre"];
export const dataIt = (iso: string) => {
  const [a, m, g] = iso.split("-").map(Number);
  return `${g} ${MESI[m - 1]} ${a}`;
};

const termine = (slug: string) => GLOSSARY.find((e) => e.slug === slug)?.term ?? slug;

export function MalattiaPagina({ m }: { m: Malattia }) {
  const diario = m.diario ? getDiario(m.diario.slug) : null;
  const esamiTool = m.esami.length ? `/strumenti/domande-per-il-medico?esami=${m.esami.map((e) => e.guida).join(",")}` : "/strumenti/domande-per-il-medico";
  const indice = [
    // 22/11/2026: l'area sonno ha la sua sezione, con le porte in cima.
    ...(m.slug === "sonno" ? [{ id: "sonno-porte", label: "Da dove parti" }] : []),
    { id: "che-cose", label: "Che cos’è" },
    ...(m.inNumeri ? [{ id: "in-numeri", label: "In numeri" }] : []),
    { id: "come-si-manifesta", label: "Come si manifesta" },
    { id: "quando-chiamare", label: "Quando chiamare" },
    { id: "esami", label: "Esami" },
    { id: "ogni-giorno", label: "Ogni giorno" },
    { id: "domande", label: "Domande per il medico" },
    { id: "faq", label: "Domande frequenti" },
    { id: "fonti", label: "Fonti" },
  ];
  const rivista = m.revisione.stato === "rivista" ? m.revisione : null;
  const s0 = m.quandoChiamare.subito[0].replace(/\.$/, "");
  const primoSubito = s0.charAt(0).toLowerCase() + s0.slice(1);

  return (
    <div className={`ht ht-${m.tono} ml`} data-malattia={m.slug}>
      <HomeSimboli />
      <DiariSimboli />
      <MalattieSimboli />

      <section className="ht-hero ml-hero" aria-labelledby="ht-titolo">
        <Ic id={m.icona} className="ht-art" />
        <div className="ht-wrap">
          <nav aria-label="Sei qui">
            <p className="ht-crumb">
              <Link href="/">Home</Link> <span aria-hidden>/</span> {m.slug === "sonno" ? <Link href="/prenditi-cura-di-te">Prenditi cura di te</Link> : <Link href="/malattie">Malattie</Link>} <span aria-hidden>/</span> <span>{m.area}</span>
            </p>
          </nav>
          <div className="ht-hero-g">
            <span className="ht-ico" aria-hidden="true">
              <Ic id={m.icona} />
            </span>
            <div>
              <p className="ht-kicker">
                {m.area}
                {rivista ? null : <span className="ht-stato">Bozza</span>}
              </p>
              <h1 id="ht-titolo">
                {m.titolo} <em><span>{m.em}</span></em>
              </h1>
              <p className="ml-nomi">
                <span>Il nome medico:</span> <b>{m.nomeMedico}</b>
                {m.altriNomi.length ? <span className="ml-nomi-alt"> · si dice anche {m.altriNomi.slice(0, 3).join(", ")}</span> : null}
              </p>
            </div>
          </div>

          <div className="ml-breve" aria-labelledby="ml-breve-t">
            <p id="ml-breve-t" className="ml-breve-t">
              In breve
            </p>
            <ol>
              {m.inBreve.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ol>
          </div>

          {/* 27/11/2026 (fase 5, medici simulati): su telefono «Quando chiamare» arrivava dopo cinque schermate. In cima
              ora c'è il primo segnale da 112 e il collegamento all'elenco completo. */}
          <p className="ml-subito" data-testid="subito-in-cima">
            <a href="tel:112" className="ml-subito-tel">112</a>
            <span>
              <b>Chiama subito se:</b> {primoSubito}. <a href="#quando-chiamare">Tutti i segnali da non aspettare</a>
            </span>
          </p>

          <div className="ml-fiducia" data-revisione={m.revisione.stato}>
            <span className="ml-fiducia-ico" aria-hidden="true">
              <Ic id="firma" />
            </span>
            <div>
              {rivista ? (
                <p className="ml-fiducia-t">
                  Rivista da {rivista.medico}, {rivista.qualifica}, il {dataIt(rivista.data)}
                </p>
              ) : (
                <p className="ml-fiducia-t" data-bozza="medico">
                  {MALATTIE_BOZZA}
                </p>
              )}
              <p className="ml-fiducia-d">
                Aggiornata il {dataIt(m.aggiornato)}
                {rivista ? ` · prossima revisione: ${dataIt(rivista.prossima)}` : " · Un medico la rileggerà e la firmerà"} · <a href="#fonti">{m.fonti.length} fonti</a>
              </p>
            </div>
          </div>

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

      {m.slug === "sonno" ? <SonnoPorte /> : null}

      <section className="ht-sec ml-sec" id="che-cose" aria-labelledby="che-cose-t">
        <div className="ht-wrap">
          <div className="ml-col">
            <p className="ht-kicker">Per capire</p>
            <h2 id="che-cose-t" className="ml-h2">
              Che cos’è
            </h2>
            {m.cheCose.map((p) => (
              <p key={p.slice(0, 32)} className="ml-p">
                {p}
              </p>
            ))}
          </div>
        </div>
      </section>

      {m.inNumeri ? (
        <section className="ht-sec ml-sec" id="in-numeri" aria-labelledby="in-numeri-t">
          <div className="ht-wrap">
            <div className="ml-col">
              <p className="ht-kicker">In numeri</p>
              <h2 id="in-numeri-t" className="ml-h2">
                {m.inNumeri.titolo}
              </h2>
              <p className="ml-p">{m.inNumeri.intro}</p>
              <div className="ml-numeri">
                <table>
                  <thead>
                    <tr>
                      <th scope="col">{m.inNumeri.colonne[0]}</th>
                      <th scope="col">{m.inNumeri.colonne[1]}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {m.inNumeri.righe.map((r, i) => (
                      <tr key={r.etichetta} style={{ ["--i" as string]: i }}>
                        <th scope="row">
                          <span className="ml-tacca" aria-hidden="true" />
                          {r.etichetta}
                        </th>
                        <td>{r.valore}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="ml-nota-n">{m.inNumeri.nota}</p>
            </div>
          </div>
        </section>
      ) : null}

      <section className="ht-sec ml-sec" id="come-si-manifesta" aria-labelledby="come-si-manifesta-t">
        <div className="ht-wrap">
          <div className="ml-col">
            <p className="ht-kicker">I segni</p>
            <h2 id="come-si-manifesta-t" className="ml-h2">
              Come si manifesta
            </h2>
            {m.comeSiManifesta.testo.map((p) => (
              <p key={p.slice(0, 32)} className="ml-p">
                {p}
              </p>
            ))}
          </div>
          <ul className="ml-segni">
            {m.comeSiManifesta.segni.map((s) => (
              <li key={s}>{s}</li>
            ))}
          </ul>
        </div>
      </section>

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
                {m.quandoChiamare.subito.map((s) => (
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
                <span>Senti il medico in giornata o a breve</span>
              </p>
              <ul>
                {m.quandoChiamare.presto.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
              <p className="ml-guardia">Di notte e nei festivi c’è la guardia medica, gratuita: il 116117 in Lombardia e in molte regioni, altrove il numero della tua ASL.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="ht-sec ml-sec" id="esami" aria-labelledby="esami-t">
        <div className="ht-wrap">
          <div className="ht-sec-h">
            <p className="ht-kicker">Gli esami</p>
            <h2 id="esami-t">Gli esami di cui si parla</h2>
            <p>Ogni esame ha la sua guida: che cosa misura, come si legge nel referto, che cosa chiedere. Quali servono a te lo decide il medico.</p>
          </div>
          {m.esami.length ? (
            <ul className="ht-voci">
              {m.esami.map((e) => {
                const g = getGuide(e.guida);
                return (
                  <li key={e.guida}>
                    <Link href={`/guide/${e.guida}`} className="ht-voce">
                      <span className="ht-voce-t">
                        <b>{g?.examName ?? e.guida}</b>
                      </span>
                      <span className="ht-voce-d">{e.perche}</span>
                      <span className="ht-voce-go">
                        Leggi la guida <Ic id="go" className="ht-ic" />
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          ) : null}
          {m.esamiNota ? <p className="ht-nota ml-esami-nota">{m.esamiNota}</p> : null}
        </div>
      </section>

      <section className="ht-sec ml-sec" id="ogni-giorno" aria-labelledby="ogni-giorno-t">
        <div className="ht-wrap">
          <div className="ml-col">
            <p className="ht-kicker">Nella vita di tutti i giorni</p>
            <h2 id="ogni-giorno-t" className="ml-h2">
              Che cosa fa la differenza
            </h2>
            {m.ogniGiorno.map((p) => (
              <p key={p.slice(0, 32)} className="ml-p">
                {p}
              </p>
            ))}
            <p className="ml-piccolo">Sono informazioni generali delle società scientifiche, non indicazioni per il tuo caso.</p>
          </div>

          {diario ? (
            <div className={`ml-diario ht-${diario.tono}`}>
              <span className="ml-diario-ico" aria-hidden="true">
                <Ic id={diario.icona} />
              </span>
              <div className="ml-diario-txt">
                <p className="ht-kicker">Gratis · Diari della salute</p>
                <p className="ml-diario-t">Il diario: {diario.nome.toLowerCase()}</p>
                <p className="ml-diario-d">{m.diario!.testo}</p>
              </div>
              <div className="ml-diario-azioni">
                <Link href={`/diari/${diario.slug}`} className="ht-btn">
                  Guida e diario da stampare <Ic id="go" className="ht-ic" />
                </Link>
                <Link href={`/area-personale/diari/${diario.slug}`} className="ht-btn ht-btn-line">
                  Compilalo dal telefono
                </Link>
              </div>
            </div>
          ) : null}
        </div>
      </section>

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
              {m.domande.map((d) => (
                <li key={d}>{d}</li>
              ))}
            </ol>
            <div className="ml-domande-azioni">
              <Link href={esamiTool} className="ht-btn">
                Aggiungi le domande sugli esami <Ic id="go" className="ht-ic" />
              </Link>
              <Link href="/strumenti/preparati-alla-visita" className="ht-btn ht-btn-line">
                Preparati alla visita
              </Link>
            </div>
          </div>

          <div className="ml-due">
            <Link href="/lettura-referti" className="ml-referto">
              <span className="ml-referto-ico" aria-hidden="true">
                <Ic id="re" />
              </span>
              <span className="ml-referto-t">Hai già un referto con questi esami?</span>
              <span className="ml-referto-d">Caricalo: ti spieghiamo ogni riga in parole semplici e prepariamo le domande per il medico.</span>
              <span className="ht-voce-go">
                Lettura dei referti <Ic id="go" className="ht-ic" />
              </span>
            </Link>
            <div className="dr-video ml-video" role="note" aria-label="Video in arrivo">
              <span className="dr-video-play" aria-hidden="true">
                <svg viewBox="0 0 24 24">
                  <path d="M8 5.5v13l10.5-6.5z" />
                </svg>
              </span>
              <div>
                <p className="dr-video-t">Il video del medico arriverà</p>
                <p className="dr-video-d">Due minuti per spiegare {m.nome.toLowerCase()} a voce, registrati da un medico che ha rivisto questa pagina.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="ht-sec ml-sec" id="faq" aria-labelledby="faq-t">
        <div className="ht-wrap">
          <div className="ml-col">
            <p className="ht-kicker">Domande frequenti</p>
            <h2 id="faq-t" className="ml-h2">
              Quello che ci si chiede
            </h2>
          </div>
          <div className="dr-faq ml-faq">
            {m.faq.map((f) => (
              <details key={f.d}>
                <summary>{f.d}</summary>
                <p>{f.r}</p>
              </details>
            ))}
          </div>
          {m.glossario.length ? (
            <div className="ml-parole">
              <p className="ml-parole-t">Parole difficili, spiegate nel glossario</p>
              <ul>
                {m.glossario.map((g) => (
                  <li key={g}>
                    <Link href={`/glossario/${g}`}>{termine(g)}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </section>

      <section className="ht-sec ml-sec" aria-labelledby="correlate-t">
        <div className="ht-wrap">
          <div className="ht-sec-h">
            <p className="ht-kicker">Spesso vanno insieme</p>
            <h2 id="correlate-t">Altre pagine da leggere</h2>
          </div>
          <ul className="ml-correlate">
            {m.correlate.map((s) => {
              const c = getMalattia(s)!;
              return (
                <li key={s} className={`ht-${c.tono}`}>
                  <Link href={malattiaHref(c.slug)} className="ml-area">
                    <span className="ml-area-ico" aria-hidden="true">
                      <Ic id={c.icona} />
                    </span>
                    <span className="ml-area-k">{c.area}</span>
                    <span className="ml-area-t">{c.nome}</span>
                    <span className="ml-area-d">{c.riga}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      <section className="ht-sec ml-sec" id="fonti" aria-labelledby="fonti-t">
        <div className="ht-wrap">
          <div className="ht-nota dr-fonti ml-fonti">
            <h2 id="fonti-t" className="dr-h3">
              Le fonti
            </h2>
            <p>Il testo è nostro, scritto per essere chiaro. Segue queste fonti istituzionali e delle società scientifiche, consultate il {dataIt(m.aggiornato)}:</p>
            <ul>
              {m.fonti.map((f) => (
                <li key={f.url}>
                  <b>{f.ente}</b>: <a href={f.url} rel="noopener noreferrer">{f.titolo}</a>
                </li>
              ))}
            </ul>
            <p className="ml-fonti-regole">Questa pagina spiega e non fa diagnosi; non indica cure, dosi né cambiamenti di terapia. <Link href="/malattie#come-sono-fatte">Come sono fatte queste pagine</Link>.</p>
          </div>
        </div>
      </section>

      <section className="ht-sec ht-end" aria-label="Da qui">
        <div className="ht-wrap">
          <div className="ht-azioni">
            <Link href="/malattie" className="ht-btn">
              Tutte le malattie <Ic id="go" className="ht-ic" />
            </Link>
            <Link href="/guide" className="ht-btn ht-btn-line">
              Guide agli esami
            </Link>
            <Link href="/diari" className="ht-btn ht-btn-line">
              Diari della salute
            </Link>
          </div>
          <p className="ht-112">Per un’emergenza chiama il 112. Di notte e nei festivi c’è la guardia medica pubblica, gratuita: il 116117 in Lombardia e in molte regioni, altrove il numero della tua ASL.</p>
        </div>
      </section>
    </div>
  );
}
