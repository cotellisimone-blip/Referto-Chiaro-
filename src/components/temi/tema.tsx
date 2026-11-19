import type { ReactNode } from "react";
import Link from "next/link";
import { HomeSimboli, Ic } from "@/components/home-b/simboli";
import { puntoDiPartenzaEnabled } from "@/lib/feature-flags";
import "./temi.css";

/**
 * Le pagine a cui portano le tessere della home «chiara e scura» (19/11/2026): esami di base, intestino e microbiota,
 * alimentazione, screening, vicino a te, lo Scaffale. Stessa veste della home (titoli in Fraunces, il colore della
 * tessera), nelle due luci. Sono informazioni generali: niente consigli su misura, niente dosi, niente diagnosi.
 * I testi sulla salute sono bozze da far rivedere al medico, e lo dicono.
 */
export type TemaTono = "es" | "mi" | "al" | "sc" | "vi" | "sh" | "in" | "gu";

export interface TemaVoce {
  titolo: string;
  testo: string;
  href?: string;
  /** Etichetta breve accanto al titolo (es. «Ogni 2 anni»). */
  tag?: string;
  /** Testo del rimando, se non è una guida (predefinito «Leggi la guida»). */
  go?: string;
}

export interface TemaSezione {
  id: string;
  kicker?: string;
  titolo: string;
  testo?: string;
  voci: TemaVoce[];
}

export function TemaPage({
  tono,
  icona,
  kicker,
  titolo,
  em,
  lead,
  bozza = true,
  bozzaTesto = "Bozza: questi testi li rivede un medico prima della pubblicazione. Sono informazioni generali, non indicazioni per il tuo caso.",
  stato,
  sezioni,
  dopo,
  azioni,
}: {
  tono: TemaTono;
  icona: string;
  kicker: string;
  titolo: string;
  em: string;
  lead: string;
  /** Testo sulla salute in bozza: lo dice in cima alla pagina. */
  bozza?: boolean;
  bozzaTesto?: string;
  /** «In arrivo», «In preparazione»: una sola parola di stato accanto al sopratitolo. */
  stato?: string;
  sezioni: TemaSezione[];
  dopo?: ReactNode;
  azioni: { href: string; label: string; primary?: boolean }[];
}) {
  // Il Punto di Partenza si può spegnere: allora i rimandi a lui spariscono, invece di portare a una pagina che non c'è.
  const pdp = puntoDiPartenzaEnabled();
  const ok = (href?: string) => pdp || !href?.startsWith("/punto-di-partenza");
  return (
    <div className={`ht ht-${tono}`}>
      <HomeSimboli />
      <section className="ht-hero" aria-labelledby="ht-titolo">
        <Ic id={icona} className="ht-art" />
        <div className="ht-wrap">
          <p className="ht-crumb">
            <Link href="/">Home</Link> <span aria-hidden>/</span> <span>{kicker}</span>
          </p>
          <div className="ht-hero-g">
            <span className="ht-ico" aria-hidden="true">
              <Ic id={icona} />
            </span>
            <div>
              <p className="ht-kicker">
                {kicker}
                {stato ? <span className="ht-stato">{stato}</span> : null}
              </p>
              <h1 id="ht-titolo">
                {titolo} <em><span>{em}</span></em>
              </h1>
              <p className="ht-lead">{lead}</p>
              {bozza ? (
                <p className="ht-bozza" data-bozza="medico">
                  {bozzaTesto}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {sezioni.map((s) => (
        <section key={s.id} id={s.id} className="ht-sec" aria-labelledby={`${s.id}-titolo`}>
          <div className="ht-wrap">
            <div className="ht-sec-h">
              {s.kicker ? <p className="ht-kicker">{s.kicker}</p> : null}
              <h2 id={`${s.id}-titolo`}>{s.titolo}</h2>
              {s.testo ? <p>{s.testo}</p> : null}
            </div>
            <ul className="ht-voci">
              {s.voci.filter((v) => ok(v.href)).map((v) => (
                <li key={v.titolo}>
                  {v.href ? (
                    <Link href={v.href} className="ht-voce">
                      <VoceBody v={v} go />
                    </Link>
                  ) : (
                    <div className="ht-voce">
                      <VoceBody v={v} />
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </section>
      ))}

      {dopo}

      <section className="ht-sec ht-end" aria-label="Da qui">
        <div className="ht-wrap">
          <div className="ht-azioni">
            {azioni.filter((a) => ok(a.href)).map((a) => (
              <Link key={a.href} href={a.href} className={a.primary ? "ht-btn" : "ht-btn ht-btn-line"}>
                {a.label} <Ic id="go" className="ht-ic" />
              </Link>
            ))}
          </div>
          <p className="ht-112">Per un’emergenza chiama il 112. Di notte e nei festivi c’è la guardia medica pubblica, gratuita: 116117.</p>
        </div>
      </section>
    </div>
  );
}

function VoceBody({ v, go = false }: { v: TemaVoce; go?: boolean }) {
  return (
    <>
      <span className="ht-voce-t">
        <b>{v.titolo}</b>
        {v.tag ? <span className="ht-tag">{v.tag}</span> : null}
      </span>
      <span className="ht-voce-d">{v.testo}</span>
      {go ? (
        <span className="ht-voce-go">
          {v.go ?? "Leggi la guida"} <Ic id="go" className="ht-ic" />
        </span>
      ) : null}
    </>
  );
}
