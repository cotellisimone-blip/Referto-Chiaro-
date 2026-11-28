/**
 * I due disegni della sezione sonno (22/11/2026): l'ipnogramma di una notte tipo di un adulto (illustrativo, non i dati
 * di una persona) e le due forze che regolano il sonno. SVG in linea con i colori del tema; le scritte importanti sono
 * nella legenda HTML sotto il disegno, così restano leggibili anche a 360 px e con il testo grande.
 */

const FASI = ["Veglia", "REM", "N1", "N2", "N3"] as const;
type Fase = (typeof FASI)[number];
const Y: Record<Fase, number> = { Veglia: 28, REM: 66, N1: 102, N2: 138, N3: 174 };
// [minuto di inizio, fase]: una notte di 8 ore, dalle 23 alle 7.
const NOTTE: [number, Fase][] = [
  [0, "Veglia"], [12, "N1"], [18, "N2"], [32, "N3"], [72, "N2"], [86, "REM"], [100, "N2"], [112, "N3"], [150, "N2"], [168, "REM"],
  [194, "Veglia"], [198, "N2"], [232, "N3"], [246, "N2"], [276, "REM"], [306, "N2"], [344, "Veglia"], [347, "N2"], [380, "REM"],
  [418, "N1"], [424, "N2"], [450, "REM"], [474, "Veglia"],
];
const X0 = 74;
const X1 = 628;
const x = (min: number) => X0 + (min / 480) * (X1 - X0);

export function Ipnogramma() {
  let d = "";
  NOTTE.forEach(([m, f], i) => {
    const fine = NOTTE[i + 1]?.[0] ?? 480;
    d += `${i ? "L" : "M"}${x(m).toFixed(1)} ${Y[f]} L${x(fine).toFixed(1)} ${Y[f]} `;
  });
  const rem = NOTTE.map(([m, f], i) => ({ m, f, fine: NOTTE[i + 1]?.[0] ?? 480 })).filter((s) => s.f === "REM");
  return (
    <figure className="sn-disegno" data-disegno="ipnogramma">
      <svg viewBox="0 0 640 214" role="img" aria-labelledby="sn-ipno-t">
        <title id="sn-ipno-t">Ipnogramma di una notte tipo: quattro o cinque cicli, sonno profondo all&apos;inizio, REM più lungo verso il mattino, brevi risvegli tra un ciclo e l&apos;altro.</title>
        {FASI.map((f) => (
          <g key={f}>
            <line x1={X0} x2={X1} y1={Y[f]} y2={Y[f]} className="sn-griglia" />
            <text x={X0 - 10} y={Y[f] + 7} textAnchor="end" className="sn-etichetta">
              {f}
            </text>
          </g>
        ))}
        {rem.map((s) => (
          <rect key={s.m} x={x(s.m)} y={Y.REM - 9} width={x(s.fine) - x(s.m)} height={18} rx={5} className="sn-rem" />
        ))}
        <path d={d} className="sn-linea" />
        {[0, 2, 4, 6, 8].map((h) => (
          <text key={h} x={x(h * 60)} y={208} textAnchor={h === 0 ? "start" : h === 8 ? "end" : "middle"} className="sn-etichetta">
            {String((23 + h) % 24).padStart(2, "0")}:00
          </text>
        ))}
      </svg>
      <figcaption>
        <b>Una notte tipo, dalle 23 alle 7.</b> In alto la veglia, in basso il sonno profondo (N3). Le barre colorate sono il sonno REM. Disegno illustrativo, non i dati di una persona.
      </figcaption>
    </figure>
  );
}

/** Le due forze in 24 ore, dalle 7 alle 7: pressione del sonno (sale da svegli, scende dormendo) e orologio interno. */
export function DueProcessi() {
  const W0 = 40;
  const W1 = 620;
  const px = (h: number) => W0 + (h / 24) * (W1 - W0); // h = ore dalle 7:00
  const sonno = 16; // dalle 23
  let s = "";
  for (let h = 0; h <= 24; h += 0.25) {
    const v = h <= sonno ? 0.18 + 0.72 * (1 - Math.exp(-h / 9)) / (1 - Math.exp(-sonno / 9)) : 0.18 + 0.72 * Math.exp(-(h - sonno) / 2.6);
    s += `${h ? "L" : "M"}${px(h).toFixed(1)} ${(170 - v * 140).toFixed(1)} `;
  }
  let c = "";
  for (let h = 0; h <= 24; h += 0.25) {
    // massimo della spinta a restare svegli verso le 19 (h = 12), minimo verso le 5 (h = 22)
    const v = 0.5 + 0.38 * Math.cos(((h - 12) / 24) * 2 * Math.PI);
    c += `${h ? "L" : "M"}${px(h).toFixed(1)} ${(170 - v * 140).toFixed(1)} `;
  }
  return (
    <figure className="sn-disegno" data-disegno="due-processi">
      <svg viewBox="0 0 640 214" role="img" aria-labelledby="sn-due-t">
        <title id="sn-due-t">Le due forze del sonno in 24 ore: la pressione del sonno cresce durante il giorno e scende di notte; l&apos;orologio interno spinge a restare svegli fino alla sera e cala nella notte.</title>
        <rect x={px(sonno)} y={14} width={px(24) - px(sonno)} height={162} rx={10} className="sn-notte" />
        <line x1={W0} x2={W1} y1={176} y2={176} className="sn-griglia" />
        <path d={s} className="sn-linea" />
        <path d={c} className="sn-linea sn-linea-2" />
        {[0, 6, 12, 16, 24].map((h) => (
          <text key={h} x={px(h)} y={206} textAnchor={h === 0 ? "start" : h === 24 ? "end" : "middle"} className="sn-etichetta">
            {String((7 + h) % 24).padStart(2, "0")}:00
          </text>
        ))}
      </svg>
      <figcaption>
        <span className="sn-leg">
          <i className="sn-leg-1" aria-hidden="true" /> Pressione del sonno: sale da svegli, scende dormendo.
        </span>
        <span className="sn-leg">
          <i className="sn-leg-2" aria-hidden="true" /> Orologio interno: spinge a restare svegli fino a sera, poi cala.
        </span>
        <span className="sn-leg">
          <i className="sn-leg-n" aria-hidden="true" /> La notte, dalle 23 alle 7. Disegno illustrativo.
        </span>
      </figcaption>
    </figure>
  );
}
