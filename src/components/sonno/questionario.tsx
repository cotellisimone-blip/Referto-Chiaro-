"use client";

import { useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Ic } from "@/components/home-b/simboli";
import type { Autovalutazione } from "@/content/sonno/schema";
import { calcolaEsito, salvaRisultato, type Risposte } from "@/domain/sonno/autovalutazione";

/**
 * Il questionario di un'autovalutazione del sonno (22/11/2026). Tutto nel browser: nessuna risposta va al server. Il
 * risultato si salva sul dispositivo solo se la persona tocca «Aggiungi al foglio per il medico».
 */
export function Questionario({ a }: { a: Autovalutazione }) {
  const [r, setR] = useState<Risposte>({});
  const [visto, setVisto] = useState(false);
  const [salvato, setSalvato] = useState<null | "ok" | "no">(null);
  const [manca, setManca] = useState<string | null>(null);
  const esitoRef = useRef<HTMLDivElement>(null);
  const esito = useMemo(() => calcolaEsito(a, r), [a, r]);
  const allarme = esito.avvisi.find((v) => v.tono === "attenzione");
  const risposte = a.domande.filter((d) => r[d.id] !== undefined).length;

  function mostra() {
    const prima = a.domande.find((d) => r[d.id] === undefined);
    if (prima) {
      setManca(prima.id);
      document.getElementById(`sn-q-${prima.id}`)?.scrollIntoView({ block: "center", behavior: "smooth" });
      return;
    }
    setManca(null);
    setVisto(true);
    requestAnimationFrame(() => {
      esitoRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
      esitoRef.current?.focus({ preventScroll: true });
    });
  }

  function salva() {
    const ok = salvaRisultato({
      slug: a.slug,
      porta: a.porta,
      fascia: esito.fascia.titolo,
      punti: esito.punti,
      massimo: esito.massimo,
      data: new Date().toISOString().slice(0, 10),
      avvisi: esito.avvisi.map((v) => v.titolo),
    });
    setSalvato(ok ? "ok" : "no");
  }

  function ricomincia() {
    setR({});
    setVisto(false);
    setSalvato(null);
    setManca(null);
    document.getElementById("sn-domande")?.scrollIntoView({ block: "start" });
  }

  return (
    <div className="sn-q" data-testid="questionario">
      <div className="sn-q-avanz" aria-live="polite">
        <span>
          {risposte} di {a.domande.length} risposte
        </span>
        <span className="sn-q-barra" aria-hidden="true">
          <i style={{ width: `${(risposte / a.domande.length) * 100}%` }} />
        </span>
      </div>
      <ol className="sn-q-lista" id="sn-domande">
        {a.domande.map((d, i) => (
          <li key={d.id} id={`sn-q-${d.id}`} className="sn-q-voce" data-manca={manca === d.id || undefined}>
            <fieldset>
              <legend>
                <span className="sn-q-n" aria-hidden="true">
                  {i + 1}
                </span>
                <span>{d.t}</span>
              </legend>
              {d.aiuto ? <p className="sn-q-aiuto">{d.aiuto}</p> : null}
              <div className="sn-q-scelte" data-n={d.opzioni.length}>
                {d.opzioni.map((o) => (
                  <label key={o.l} className="sn-q-scelta">
                    <input
                      type="radio"
                      name={d.id}
                      value={o.v}
                      checked={r[d.id] === o.v}
                      onChange={() => {
                        setR((x) => ({ ...x, [d.id]: o.v }));
                        setSalvato(null);
                        if (manca === d.id) setManca(null);
                      }}
                    />
                    <span>{o.l}</span>
                  </label>
                ))}
              </div>
              {manca === d.id ? (
                <p className="sn-q-manca" role="alert">
                  Manca questa risposta.
                </p>
              ) : null}
            </fieldset>
          </li>
        ))}
      </ol>

      <div className="sn-q-azioni">
        <button type="button" className="ht-btn" onClick={mostra} data-testid="vedi-risultato">
          Vedi il risultato <Ic id="go" className="ht-ic" />
        </button>
        <p className="sn-q-privacy">Le risposte restano su questo telefono o computer: non le riceviamo.</p>
      </div>

      {visto && esito.completo ? (
        <div className="sn-esito" ref={esitoRef} tabIndex={-1} aria-labelledby="sn-esito-t" data-testid="esito">
          <p className="ht-kicker">Il tuo risultato · non è una diagnosi</p>
          {/* 27/11/2026 (fasi 3 e 5, medici simulati): niente punteggio («14 su 21» sembrava un voto o un test), e se c'è
              un segnale da non trascurare è quello il titolo, prima della fascia. */}
          {allarme ? (
            <div role="alert">
              <h2 id="sn-esito-t" className="sn-esito-t">
                {allarme.titolo}
              </h2>
              <p className="sn-esito-d">{allarme.testo}</p>
            </div>
          ) : (
            <h2 id="sn-esito-t" className="sn-esito-t">
              {esito.fascia.titolo}
            </h2>
          )}
          <p className="sn-esito-d">{allarme ? `Per il resto: ${esito.fascia.titolo.charAt(0).toLowerCase()}${esito.fascia.titolo.slice(1)}. ${esito.fascia.testo}` : esito.fascia.testo}</p>
          {esito.avvisi.filter((v) => v !== allarme).map((v) => (
            <div key={v.titolo} className={`sn-riquadro sn-riquadro-${v.tono}`} role={v.tono === "attenzione" ? "alert" : undefined}>
              <span className="sn-riquadro-ico" aria-hidden="true">
                <Ic id={v.tono === "attenzione" ? "allarme" : "firma"} />
              </span>
              <div>
                <p className="sn-riquadro-t">{v.titolo}</p>
                <p className="sn-riquadro-d">{v.testo}</p>
              </div>
            </div>
          ))}
          <div className="sn-esito-salva">
            <button type="button" className="ht-btn ht-btn-line" onClick={salva} disabled={salvato === "ok"} data-testid="salva-esito">
              {salvato === "ok" ? "Aggiunto al foglio per il medico" : "Aggiungi al foglio per il medico"}
            </button>
            <p className="sn-q-privacy" aria-live="polite">
              {salvato === "ok"
                ? "Salvato solo su questo dispositivo: lo trovi nel diario del sonno, quando prepari il foglio per il medico."
                : salvato === "no"
                  ? "Questo browser non permette di salvare: scrivi il risultato sul foglio a mano."
                  : "Si salvano solo il risultato e la data, su questo dispositivo. Puoi toglierli quando vuoi dal diario."}
            </p>
          </div>
          <div className="sn-esito-poi">
            <p className="sn-esito-poi-t">E adesso</p>
            <ul>
              <li>
                <Link href="/area-personale/diari/sonno" className="sn-vai sn-vai-piccolo" data-testid="esito-diario">
                  <span className="sn-vai-t">Domattina apri il diario del sonno: due minuti, ogni mattina</span>
                  <span className="sn-vai-go" aria-hidden="true">
                    <Ic id="go" />
                  </span>
                </Link>
              </li>
              {a.poi.map((p) => (
                <li key={p.href}>
                  <Link href={p.href} className="sn-vai sn-vai-piccolo">
                    <span className="sn-vai-t">{p.label}</span>
                    <span className="sn-vai-go" aria-hidden="true">
                      <Ic id="go" />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <button type="button" className="sn-ricomincia" onClick={ricomincia}>
            Ricomincia
          </button>
        </div>
      ) : null}
    </div>
  );
}
