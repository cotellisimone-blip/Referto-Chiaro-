/**
 * Il grafico «Creatinina nel tempo» della fascia scura: quattro referti di esempio (inventati), la fascia
 * dell'intervallo stampato e i punti fuori fascia in argilla. Due disegni: largo per computer e tablet, stretto per
 * telefono. I colori passano dalle classi, così seguono anche il tema scuro.
 */
const PTS = [
  { v: "0,84", d: "mar 2025", out: false },
  { v: "0,88", d: "set 2025", out: false },
  { v: "0,93", d: "mar 2026", out: true },
  { v: "0,97", d: "set 2026", out: true },
];

type Geo = { w: number; h: number; band: [number, number]; xs: number[]; ys: number[]; labelY: number[]; axis: number; dateY: number; r: number[]; fs: [number, number, number]; sw: number; lowY: number; highY: number; lx: number };

const WIDE: Geo = { w: 520, h: 206, band: [52, 92], xs: [72, 200, 328, 456], ys: [65.8, 56.6, 45.1, 35.9], labelY: [92, 83, 27, 17], axis: 168, dateY: 192, r: [7.5, 7.5, 8, 9], fs: [12.5, 14.5, 13.5], sw: 3, lowY: 136, highY: 72, lx: 10 };
const NARROW: Geo = { w: 314, h: 156, band: [44, 68], xs: [56, 132, 208, 284], ys: [54.2, 47.4, 38.9, 32.1], labelY: [77, 70, 24, 17], axis: 126, dateY: 147, r: [6.5, 6.5, 7, 7.5], fs: [11.5, 13.5, 12.5], sw: 2.5, lowY: 105, highY: 60, lx: 8 };

function Chart({ g, className }: { g: Geo; className: string }) {
  return (
    <svg className={`tm-chart ${className}`} viewBox={`0 0 ${g.w} ${g.h}`} aria-hidden>
      <rect x="0" y={g.band[0]} width={g.w} height={g.band[1]} rx="6" className="c-band" />
      <line x1="0" y1={g.band[0]} x2={g.w} y2={g.band[0]} className="c-edge" strokeWidth="1.5" strokeDasharray="5 5" />
      <g fontSize={g.fs[0]} fontWeight="700" className="c-lim">
        <text x={g.lx} y={g.lowY}>0,50</text>
        <text x={g.lx} y={g.highY}>0,90</text>
      </g>
      <polyline points={g.xs.map((x, i) => `${x},${g.ys[i]}`).join(" ")} fill="none" className="c-line" strokeWidth={g.sw} strokeLinejoin="round" strokeLinecap="round" />
      <g strokeWidth={g.sw} className="c-ring">
        {PTS.map((p, i) => (
          <circle key={p.d} cx={g.xs[i]} cy={g.ys[i]} r={g.r[i]} className={p.out ? "c-out" : "c-in"} />
        ))}
      </g>
      <g fontSize={g.fs[1]} fontWeight="800" textAnchor="middle" className="c-val">
        {PTS.map((p, i) => (
          <text key={p.d} x={g.xs[i]} y={g.labelY[i]}>
            {p.v}
          </text>
        ))}
      </g>
      <line x1="0" y1={g.axis} x2={g.w} y2={g.axis} className="c-axis" />
      <g fontSize={g.fs[2]} fontWeight="600" textAnchor="middle" className="c-date">
        {PTS.map((p, i) => (
          <text key={p.d} x={g.xs[i]} y={g.dateY}>
            {p.d}
          </text>
        ))}
      </g>
    </svg>
  );
}

export function TrendEsempio() {
  return (
    <>
      <Chart g={WIDE} className="tm-d-only" />
      <Chart g={NARROW} className="tm-m-only" />
    </>
  );
}
