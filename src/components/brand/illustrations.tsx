import { clsx } from "clsx";

/**
 * Sistema di illustrazioni originali di Cura Privata.
 * Tutte usano i token di tema (teal, sage, cream, line, paper) così cambiano con il tema scuro.
 * Linguaggio: fogli di referto con righe "tecniche" che diventano bolle di dialogo leggibili.
 * Nessuna icona medica da stock, nessun robot: solo carta, righe, bolle e segni di spunta.
 */

type IllustrationProps = { className?: string; title?: string };

function Svg({ className, title, children, viewBox = "0 0 240 180" }: IllustrationProps & { children: React.ReactNode; viewBox?: string }) {
  return (
    <svg viewBox={viewBox} className={clsx("block h-auto w-full", className)} role={title ? "img" : undefined} aria-hidden={title ? undefined : true} fill="none">
      {title ? <title>{title}</title> : null}
      {children}
    </svg>
  );
}

const paper = "var(--color-paper)";
const line = "var(--color-line)";
const teal = "var(--color-teal)";
const sage = "var(--color-sage)";
const cream = "var(--color-cream)";
const mist = "var(--color-mist)";
const ink = "var(--color-ink)";

/** Un foglio di referto in prospettiva lieve con righe che non si leggono. */
function Sheet({ x, y, w = 110, h = 130, rows = 6, accentRow = 2 }: { x: number; y: number; w?: number; h?: number; rows?: number; accentRow?: number }) {
  const rowEls = [];
  for (let i = 0; i < rows; i++) {
    const yy = y + 28 + i * 15;
    const isAccent = i === accentRow;
    rowEls.push(
      <g key={i}>
        <rect x={x + 14} y={yy} width={isAccent ? 42 : 34 + ((i * 7) % 20)} height={5} rx={2.5} fill={isAccent ? teal : line} />
        <rect x={x + w - 44} y={yy} width={18} height={5} rx={2.5} fill={isAccent ? teal : line} />
        <rect x={x + w - 22} y={yy} width={10} height={5} rx={2.5} fill={line} />
      </g>,
    );
  }
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={10} fill={paper} stroke={line} strokeWidth={2} />
      <path d={`M${x + w - 26} ${y}v18a8 8 0 0 0 8 8h18`} stroke={line} strokeWidth={2} fill={mist} />
      <rect x={x + 14} y={y + 12} width={36} height={6} rx={3} fill={ink} opacity={0.5} />
      {rowEls}
    </g>
  );
}

/** Bolla di dialogo con una frase "leggibile" (righe più lunghe e morbide) e un segno di spunta. */
function Bubble({ x, y, w = 118, h = 70, tail = "left" }: { x: number; y: number; w?: number; h?: number; tail?: "left" | "right" }) {
  const tailPath = tail === "left" ? `M${x + 22} ${y + h}l-8 14 18-14` : `M${x + w - 22} ${y + h}l8 14-18-14`;
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={16} fill={teal} />
      <path d={tailPath} fill={teal} />
      <rect x={x + 16} y={y + 18} width={w - 32} height={6} rx={3} fill="white" opacity={0.92} />
      <rect x={x + 16} y={y + 32} width={w - 52} height={6} rx={3} fill="white" opacity={0.75} />
      <circle cx={x + w - 22} cy={y + h - 18} r={10} fill={sage} />
      <path d={`M${x + w - 27} ${y + h - 18}l4 4 6-7`} stroke="white" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  );
}

/** Home / esempio: il referto che "parla" in modo comprensibile. */
export function IllustrationTranslate(p: IllustrationProps) {
  return (
    <Svg {...p}>
      <ellipse cx="120" cy="160" rx="96" ry="10" fill={mist} />
      <circle cx="56" cy="40" r="26" fill={cream} />
      <Sheet x={36} y={22} />
      <path d="M150 70c14-10 28-10 42 0" stroke={sage} strokeWidth={2.5} strokeLinecap="round" strokeDasharray="4 6" />
      <Bubble x={122} y={78} />
    </Svg>
  );
}

/** Come funziona: lente che isola una riga e la collega alla fonte. */
export function IllustrationMagnify(p: IllustrationProps) {
  return (
    <Svg {...p}>
      <ellipse cx="120" cy="162" rx="96" ry="9" fill={mist} />
      <Sheet x={48} y={18} w={130} h={128} rows={6} accentRow={3} />
      <circle cx="150" cy="96" r="30" fill={cream} opacity={0.9} stroke={teal} strokeWidth={4} />
      <rect x={130} y={92} width={32} height={6} rx={3} fill={teal} />
      <rect x={130} y={102} width={20} height={5} rx={2.5} fill={sage} />
      <path d="M172 118l22 22" stroke={teal} strokeWidth={8} strokeLinecap="round" />
      <path d="M62 66h-24a8 8 0 0 0-8 8v30" stroke={sage} strokeWidth={2.5} strokeLinecap="round" strokeDasharray="4 6" />
      <circle cx="30" cy="110" r="9" fill={sage} />
      <text x="30" y="114" textAnchor="middle" fontSize="10" fontWeight="700" fill="white" fontFamily="ui-sans-serif, system-ui">
        5
      </text>
    </Svg>
  );
}

/** Inizia / dossier: più fogli che diventano un fascicolo ordinato con spunte. */
export function IllustrationDossier(p: IllustrationProps) {
  return (
    <Svg {...p}>
      <ellipse cx="120" cy="164" rx="100" ry="9" fill={mist} />
      <g transform="rotate(-8 90 90)">
        <Sheet x={34} y={30} w={96} h={112} rows={5} accentRow={1} />
      </g>
      <g transform="rotate(5 150 90)">
        <Sheet x={70} y={24} w={96} h={112} rows={5} accentRow={2} />
      </g>
      <rect x={120} y={60} width={96} height={100} rx={12} fill={cream} stroke={line} strokeWidth={2} />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <circle cx={140} cy={84 + i * 24} r={8} fill={i < 2 ? sage : paper} stroke={i < 2 ? sage : line} strokeWidth={2} />
          {i < 2 ? <path d={`M136 ${84 + i * 24}l3 3 5-6`} stroke="white" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" /> : null}
          <rect x={156} y={81 + i * 24} width={44 - i * 8} height={6} rx={3} fill={i < 2 ? ink : line} opacity={i < 2 ? 0.55 : 1} />
        </g>
      ))}
    </Svg>
  );
}

/** Secondo parere / contatti: due bolle, una con domanda, una con risposta e spunta. */
export function IllustrationDialogue(p: IllustrationProps) {
  return (
    <Svg {...p}>
      <ellipse cx="120" cy="162" rx="96" ry="9" fill={mist} />
      <rect x={28} y={40} width={110} height={64} rx={16} fill={paper} stroke={line} strokeWidth={2} />
      <path d="M50 104l-8 14 18-14" fill={paper} stroke={line} strokeWidth={2} strokeLinejoin="round" />
      <rect x={44} y={58} width={70} height={6} rx={3} fill={line} />
      <rect x={44} y={72} width={48} height={6} rx={3} fill={line} />
      <text x="124" y="78" textAnchor="middle" fontSize="22" fontWeight="600" fill={teal} fontFamily="Georgia, serif">
        ?
      </text>
      <Bubble x={104} y={86} w={110} h={64} tail="right" />
      <circle cx="196" cy="34" r="16" fill={cream} />
      <path d="M186 34c0-6 4-10 10-10s10 4 10 10-4 10-10 10" stroke={sage} strokeWidth={2.5} strokeLinecap="round" />
    </Svg>
  );
}

/** Sicurezza / privacy: un foglio dietro una serratura, con righe che restano coperte. */
export function IllustrationShield(p: IllustrationProps) {
  return (
    <Svg {...p}>
      <ellipse cx="120" cy="162" rx="96" ry="9" fill={mist} />
      <Sheet x={44} y={20} w={120} h={126} rows={6} accentRow={-1} />
      <path d="M160 70l44-14 44 14v36c0 30-20 48-44 58-24-10-44-28-44-58z" transform="translate(-44 0)" fill={teal} />
      <rect x={146} y={104} width={28} height={24} rx={6} fill="white" />
      <path d="M152 104v-8a8 8 0 0 1 16 0v8" stroke="white" strokeWidth={4} strokeLinecap="round" />
      <circle cx="160" cy="116" r="3.5" fill={teal} />
    </Svg>
  );
}

/** Pagina non trovata: un foglio con l'angolo piegato e un percorso tratteggiato che torna indietro. */
export function IllustrationLost(p: IllustrationProps) {
  return (
    <Svg {...p}>
      <ellipse cx="120" cy="164" rx="96" ry="9" fill={mist} />
      <g transform="rotate(10 120 90)">
        <rect x={70} y={26} width={100} height={124} rx={10} fill={paper} stroke={line} strokeWidth={2} />
        <path d="M170 26v30a10 10 0 0 1-10 10h-30z" fill={cream} stroke={line} strokeWidth={2} strokeLinejoin="round" />
        <rect x={84} y={70} width={60} height={6} rx={3} fill={line} />
        <rect x={84} y={86} width={44} height={6} rx={3} fill={line} />
        <rect x={84} y={102} width={52} height={6} rx={3} fill={line} />
        <text x="118" y="140" textAnchor="middle" fontSize="20" fontWeight="600" fill={teal} fontFamily="Georgia, serif">
          404
        </text>
      </g>
      <path d="M40 150c0-30 10-50 30-60" stroke={sage} strokeWidth={2.5} strokeLinecap="round" strokeDasharray="4 7" />
      <circle cx="40" cy="150" r="7" fill={sage} />
    </Svg>
  );
}

/** FAQ / accessibilità: una bolla con tre righe e un punto interrogativo gentile. */
export function IllustrationFaq(p: IllustrationProps) {
  return (
    <Svg {...p}>
      <ellipse cx="120" cy="162" rx="96" ry="9" fill={mist} />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x={44} y={34 + i * 38} width={152} height={28} rx={14} fill={i === 1 ? teal : paper} stroke={i === 1 ? teal : line} strokeWidth={2} />
          <circle cx={62} cy={48 + i * 38} r={7} fill={i === 1 ? "white" : cream} />
          <rect x={78} y={45 + i * 38} width={70 - i * 10} height={6} rx={3} fill={i === 1 ? "white" : line} opacity={i === 1 ? 0.9 : 1} />
          {i === 1 ? <path d="M168 44l4 4 8-9" stroke="white" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" transform={`translate(0 ${38})`} /> : null}
        </g>
      ))}
    </Svg>
  );
}

/** Trama di sfondo per la CTA finale: righe di referto che sfumano, sostituisce i "blob" sfocati. */
export function DocumentLinesPattern({ className }: { className?: string }) {
  const rows = [];
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 4; c++) {
      const w = 40 + ((r * 13 + c * 29) % 70);
      rows.push(<rect key={`${r}-${c}`} x={c * 160 + ((r * 17) % 40)} y={r * 26} width={w} height={6} rx={3} />);
    }
  }
  return (
    <svg aria-hidden className={clsx("pointer-events-none absolute inset-0 h-full w-full", className)} viewBox="0 0 640 240" preserveAspectRatio="xMidYMid slice" fill="currentColor">
      {rows}
    </svg>
  );
}

/** Timeline animata del metodo: una linea che si disegna tra i 4 passaggi (solo decorativa). */
export function MethodLine({ className }: { className?: string }) {
  return (
    <svg aria-hidden className={clsx("absolute inset-x-0 top-10 hidden h-4 w-full lg:block", className)} viewBox="0 0 1000 16" preserveAspectRatio="none" fill="none">
      <path d="M0 8H1000" stroke="var(--color-line)" strokeWidth={2} strokeDasharray="6 8" pathLength={1} className="draw-line" />
    </svg>
  );
}
