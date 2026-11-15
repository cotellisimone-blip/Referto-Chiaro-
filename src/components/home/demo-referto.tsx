"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, Check, MessageCircleQuestionMark, Pointer } from "lucide-react";

/**
 * «Da così a così» (home «I tre momenti», 15/11/2026): a sinistra il foglio del laboratorio, a destra lo stesso valore
 * spiegato. Ogni riga del foglio è un pulsante: toccandola cambia la spiegazione accanto. Dati inventati (referto di
 * esempio, persona inesistente), gli stessi del referto di esempio del prodotto. Le spiegazioni descrivono, non valutano.
 */
type Row = {
  name: string;
  value: string;
  unit: string;
  range: string;
  rangeText: string;
  what: string;
  out: boolean;
  /** Fascia dell'intervallo e posizione del valore sulla barra, in percentuale. */
  b0: number;
  b1: number;
  dot: number;
  ask: string;
  /** Su telefono il foglio ha una riga in meno, per restare corto. */
  wideOnly?: boolean;
};

export const DEMO_ROWS: readonly Row[] = [
  {
    name: "Glicemia",
    value: "92",
    unit: "mg/dL",
    range: "70 – 99",
    rangeText: "da 70 a 99",
    what: "Lo zucchero nel sangue al momento del prelievo.",
    out: false,
    b0: 24,
    b1: 76,
    dot: 62,
    ask: "«Ogni quanto ha senso ripetere la glicemia, nel mio caso?»",
  },
  {
    name: "Emoglobina glicata",
    value: "5,1",
    unit: "%",
    range: "4,0 – 5,6",
    rangeText: "da 4,0 a 5,6",
    what: "La media dello zucchero nel sangue nelle settimane prima del prelievo.",
    out: false,
    b0: 22,
    b1: 78,
    dot: 52,
    ask: "«Serve ripetere questo esame insieme alla glicemia?»",
    wideOnly: true,
  },
  {
    name: "Colesterolo LDL",
    value: "134",
    unit: "mg/dL",
    range: "< 115",
    rangeText: "meno di 115",
    what: "Il colesterolo che si deposita nelle arterie.",
    out: true,
    b0: 0,
    b1: 68,
    dot: 82,
    ask: "«Il colesterolo LDL è sopra l’intervallo stampato: che cosa significa nel mio caso?»",
  },
  {
    name: "Creatinina",
    value: "0,89",
    unit: "mg/dL",
    range: "0,70 – 1,20",
    rangeText: "da 0,70 a 1,20",
    what: "Una sostanza prodotta dai muscoli ed eliminata dai reni.",
    out: false,
    b0: 22,
    b1: 78,
    dot: 40,
    ask: "«Questo valore va letto insieme ad altri esami?»",
  },
];

export function DemoReferto() {
  const [sel, setSel] = useState(2);
  const r = DEMO_ROWS[sel];
  return (
    <div className="tm-demo">
      <div className="tm-sheet">
        <span className="tm-tagp">Il referto com’è</span>
        <p className="tm-sheet-h">
          Laboratorio analisi · Referto n. 000000<small>Prelievo del 12/03/2026 · esempio con dati inventati</small>
        </p>
        <div className="tm-tb" role="group" aria-label="Righe del referto di esempio: tocca una riga per leggerla spiegata">
          <p className="tm-tr tm-th" aria-hidden>
            <span>ESAME</span>
            <span>RIS.</span>
            <span>U.M.</span>
            <span>VAL. RIF.</span>
          </p>
          {DEMO_ROWS.map((row, i) => (
            <button
              key={row.name}
              type="button"
              aria-pressed={i === sel}
              aria-controls="tm-xpl"
              aria-label={`${row.name}: ${row.value} ${row.unit}, riferimento ${row.rangeText}`}
              onClick={() => setSel(i)}
              className={`tm-tr${i === sel ? " tm-on" : ""}${row.wideOnly ? " tm-x" : ""}`}
              data-track="home-riga-referto"
            >
              <span>{row.name.toUpperCase()}</span>
              <b>
                {row.value}
                {row.out ? " *" : ""}
              </b>
              <span>{row.unit}</span>
              <span>{row.range}</span>
              {i === sel ? (
                <span className="tm-tap" aria-hidden>
                  <Pointer className="tm-ic" />
                </span>
              ) : null}
            </button>
          ))}
        </div>
        <p className="tm-sheet-f">* valore fuori dall’intervallo di riferimento</p>
      </div>
      <div className="tm-xpl" id="tm-xpl" aria-live="polite">
        <span className="tm-dn" aria-hidden>
          <ArrowDown className="tm-ic" />
        </span>
        <span className="tm-tagp">Lo stesso valore, spiegato</span>
        <div className="tm-xpl-h">
          <h3>{r.name}</h3>
          <p>
            {r.value} <small>{r.unit}</small>
          </p>
        </div>
        <div className={`tm-bar${r.out ? " tm-bar-out" : ""}`} style={{ "--b0": `${r.b0}%`, "--b1": `${r.b1}%`, "--dot": `${r.dot}%` } as React.CSSProperties}>
          <i />
        </div>
        <p className="tm-bar-l">
          <span>Intervallo stampato: {r.rangeText}</span>
          <b className={r.out ? undefined : "tm-in"}>
            {r.out ? <ArrowUp aria-hidden className="tm-ic" /> : <Check aria-hidden className="tm-ic" />}
            {r.out ? "Sopra l’intervallo stampato" : "Dentro l’intervallo stampato"}
          </b>
        </p>
        <dl>
          <div>
            <dt>Che cosa misura</dt>
            <dd>{r.what}</dd>
          </div>
          <div className="tm-x">
            <dt>Sul tuo referto</dt>
            <dd>Il laboratorio indica come riferimento {r.rangeText.startsWith("meno") ? "un valore più basso di 115" : `un valore ${r.rangeText}`}.</dd>
          </div>
        </dl>
        <div className="tm-ask">
          <p className="tm-k">
            <MessageCircleQuestionMark aria-hidden className="tm-ic" />
            Da chiedere al medico
          </p>
          <p>{r.ask}</p>
        </div>
        <p className="tm-xpl-f">Non è un giudizio sulla tua salute: quello spetta al tuo medico.</p>
      </div>
    </div>
  );
}
