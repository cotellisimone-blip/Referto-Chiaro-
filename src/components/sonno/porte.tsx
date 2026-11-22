import Link from "next/link";
import { Ic } from "@/components/home-b/simboli";
import { AUTOVALUTAZIONI, SONNO_PERCORSO, SONNO_PROBLEMI, SONNO_SPIEGAZIONI, sonnoHref } from "@/content/sonno";
import { SonnoSimboli } from "./simboli";
import "./sonno.css";

/**
 * Le porte della sezione sonno (22/11/2026), in cima alla pagina «Insonnia» (/prenditi-cura-di-te/sonno): si entra da quello che
 * si vive, poi il percorso di due settimane, poi le pagine per capire e le autovalutazioni.
 */
export function SonnoPorte() {
  return (
    <section className="ht-sec ml-sec sn sn-porte" id="sonno-porte" aria-labelledby="sonno-porte-t">
      <SonnoSimboli />
      <div className="ht-wrap">
        <div className="ht-sec-h">
          <p className="ht-kicker">La sezione sonno</p>
          <h2 id="sonno-porte-t" className="ml-h2">
            Da dove parti?
          </h2>
          <p className="ml-p">Scegli quello che somiglia di più alle tue notti. Ogni pagina spiega che cosa succede, che cosa aiuta e quando parlarne con il medico.</p>
        </div>
        <ul className="sn-porte-l">
          {SONNO_PROBLEMI.map((p) => (
            <li key={p.slug}>
              <Link href={sonnoHref(p.slug)} className="sn-porta" data-testid={`porta-${p.slug}`}>
                <span className="sn-porta-ico" aria-hidden="true">
                  <Ic id={p.icona} />
                </span>
                <span className="sn-porta-t">«{p.porta}»</span>
                <span className="sn-porta-go" aria-hidden="true">
                  <Ic id="go" />
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <Link href={sonnoHref(SONNO_PERCORSO.slug)} className="sn-percorso" data-testid="porta-percorso">
          <span className="sn-percorso-k ht-kicker">Gratis · Due settimane</span>
          <span className="sn-percorso-t">{SONNO_PERCORSO.porta}</span>
          <span className="sn-percorso-passi" aria-hidden="true">
            <span>
              <b>1</b> Autovalutazione
            </span>
            <span>
              <b>2</b> Diario ogni mattina
            </span>
            <span>
              <b>3</b> Foglio per il medico
            </span>
          </span>
          <span className="sn-percorso-d">{SONNO_PERCORSO.riga}</span>
          <span className="ht-voce-go">
            Comincia <Ic id="go" className="ht-ic" />
          </span>
        </Link>

        <div className="sn-porte-due">
          <div>
            <p className="sn-porte-sub">Per capire</p>
            <ul className="sn-capire">
              {SONNO_SPIEGAZIONI.map((p) => (
                <li key={p.slug}>
                  <Link href={sonnoHref(p.slug)} className="sn-capire-a">
                    <span className="sn-capire-ico" aria-hidden="true">
                      <Ic id={p.icona} />
                    </span>
                    <span>
                      <span className="sn-capire-t">{p.porta}</span>
                      <span className="sn-capire-d">{p.riga}</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="sn-porte-sub">Autovalutazioni · due minuti</p>
            <ul className="sn-capire">
              {AUTOVALUTAZIONI.map((a) => (
                <li key={a.slug}>
                  <Link href={sonnoHref(a.slug)} className="sn-capire-a">
                    <span className="sn-capire-ico" aria-hidden="true">
                      <Ic id="s-test" />
                    </span>
                    <span>
                      <span className="sn-capire-t">{a.porta}</span>
                      <span className="sn-capire-d">{a.domande.length} domande scritte da noi, con le fonti. Le risposte restano sul tuo telefono.</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
