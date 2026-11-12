/**
 * Scene illustrate e animate dei tre servizi (art direction dal pacchetto «Memorabile», immagine 02).
 * Disegnate in SVG: nessun volto, nessun medico finto, nessun testo che serva a capire (le informazioni
 * vere sono nell'HTML accanto). Le animazioni girano solo con prefers-reduced-motion: no-preference.
 */
import { clsx } from "clsx";

type SceneProps = { className?: string; uid?: string };

const frame = "block h-auto w-full";

export function CapisciScene({ className, uid = "" }: SceneProps) {
  const u = uid;
  return (
    <svg aria-hidden viewBox="0 0 400 240" className={clsx(frame, className)}>
      <defs>
        <linearGradient id={`cs-bg${u}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--color-tint-capisci)" />
          <stop offset="1" stopColor="var(--color-paper)" />
        </linearGradient>
        <filter id={`cs-sh${u}`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#0C3340" floodOpacity="0.14" />
        </filter>
      </defs>
      <rect width="400" height="240" fill={`url(#cs-bg${u})`} />
      <circle cx="340" cy="40" r="70" fill="var(--color-marker)" opacity="0.18" className="sc-float-slow" />
      <circle cx="40" cy="220" r="50" fill="var(--color-teal)" opacity="0.08" />
      {/* foglio del referto */}
      <g transform="rotate(-4 170 130)" filter={`url(#cs-sh${u})`}>
        <rect x="80" y="32" width="190" height="200" rx="14" fill="var(--color-paper)" />
        <rect x="80" y="32" width="190" height="34" rx="14" fill="var(--color-tint-capisci)" />
        <path d="M100 41 h10 M103 41 v8 l-6 11 h16 l-6 -11 v-8" stroke="var(--color-teal)" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="124" y="45" width="70" height="7" rx="3.5" fill="var(--color-teal)" opacity="0.55" />
        {[84, 108, 132, 156, 180, 204].map((y, i) => (
          <g key={y}>
            {i === 2 ? <rect x="92" y={y - 7} width="166" height="20" rx="6" fill="var(--color-marker)" opacity="0.55" className="sc-marker" /> : null}
            <rect x="100" y={y - 1} width={i % 2 ? 70 : 88} height="6" rx="3" fill="#9FB3B9" />
            <rect x="214" y={y - 1} width="32" height="6" rx="3" fill={i === 2 ? "var(--color-teal-deep)" : "#C5D3D6"} />
          </g>
        ))}
      </g>
      {/* lente che scorre sulle righe */}
      <g className="sc-lens">
        <circle cx="190" cy="118" r="28" fill="#ffffff" fillOpacity="0.35" stroke="var(--color-strong)" strokeWidth="7" />
        <path d="M210 138 l26 26" stroke="var(--color-strong)" strokeWidth="11" strokeLinecap="round" />
      </g>
      {/* andamento */}
      <g transform="translate(290 150)" filter={`url(#cs-sh${u})`}>
        <rect width="88" height="72" rx="14" fill="var(--color-paper)" />
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x={14 + i * 17} y={18} width="11" height="42" rx="4" fill={i === 3 ? "var(--color-teal)" : "var(--color-marker)"} className="sc-bar" style={{ animationDelay: `${i * 0.18}s`, transformOrigin: `${19 + i * 17}px 60px`, transform: `scaleY(${[0.45, 0.65, 0.55, 0.9][i]})` }} />
        ))}
      </g>
      {/* spunta */}
      <g transform="translate(276 54)">
        <g className="sc-pop">
          <circle r="20" fill="#16A34A" />
          <path d="M-8 0 l5 6 l11 -12" stroke="#fff" strokeWidth="4.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </g>
    </svg>
  );
}

export function ParereScene({ className, uid = "" }: SceneProps) {
  const u = uid;
  return (
    <svg aria-hidden viewBox="0 0 400 240" className={clsx(frame, className)}>
      <defs>
        <linearGradient id={`ps-bg${u}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--color-tint-parere)" />
          <stop offset="1" stopColor="var(--color-paper)" />
        </linearGradient>
        <filter id={`ps-sh${u}`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#0C3340" floodOpacity="0.14" />
        </filter>
      </defs>
      <rect width="400" height="240" fill={`url(#ps-bg${u})`} />
      <circle cx="60" cy="40" r="64" fill="var(--color-accent-parere)" opacity="0.1" className="sc-float-slow" />
      <circle cx="360" cy="210" r="70" fill="var(--color-marker)" opacity="0.16" />
      {/* il tuo caso */}
      <g filter={`url(#ps-sh${u})`} className="sc-drift-r">
        <rect x="34" y="52" width="130" height="150" rx="14" fill="var(--color-paper)" />
        <rect x="50" y="70" width="60" height="8" rx="4" fill="var(--color-accent-parere)" opacity="0.6" />
        {[92, 108, 124, 140, 156].map((y, i) => (
          <rect key={y} x="50" y={y} width={[96, 80, 92, 70, 86][i]} height="6" rx="3" fill="#B8C7CC" />
        ))}
        <rect x="50" y="174" width="44" height="14" rx="7" fill="var(--color-tint-parere)" />
      </g>
      {/* il parere */}
      <g filter={`url(#ps-sh${u})`} className="sc-drift-l">
        <rect x="236" y="38" width="134" height="164" rx="14" fill="var(--color-paper)" />
        <circle cx="262" cy="64" r="12" fill="var(--color-tint-parere)" />
        <path d="M256 60 v5 a6 6 0 0 0 12 0 v-5 M262 71 v4 a6 6 0 0 0 12 0 v-3" stroke="var(--color-accent-parere)" strokeWidth="2.2" fill="none" strokeLinecap="round" />
        <rect x="282" y="58" width="66" height="8" rx="4" fill="var(--color-accent-parere)" opacity="0.6" />
        {[88, 104, 120, 136].map((y, i) => (
          <rect key={y} x="252" y={y} width={[100, 90, 104, 76][i]} height="6" rx="3" fill="#B8C7CC" />
        ))}
        <path className="sc-sign" pathLength={1} d="M254 176 c 10 -18, 18 6, 26 -6 s 12 -10, 18 2 s 14 4, 24 -8" stroke="var(--color-strong)" strokeWidth="3" fill="none" strokeLinecap="round" />
      </g>
      {/* il collegamento */}
      <path id={`ps-link${u}`} d="M166 128 C 196 96, 208 160, 234 120" stroke="var(--color-accent-parere)" strokeWidth="3" strokeDasharray="2 8" strokeLinecap="round" fill="none" />
      <circle r="6" fill="var(--color-accent-parere)" className="sc-travel" style={{ offsetPath: `path("M166 128 C 196 96, 208 160, 234 120")` }} />
      <g transform="translate(200 126)">
        <g className="sc-pop">
          <circle r="24" fill="var(--color-paper)" stroke="var(--color-accent-parere)" strokeWidth="3" />
          <path d="M-10 0 l6 7 l14 -14" stroke="#16A34A" strokeWidth="5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </g>
      </g>
    </svg>
  );
}

export function MedicoScene({ className, uid = "" }: SceneProps) {
  const u = uid;
  return (
    <svg aria-hidden viewBox="0 0 400 240" className={clsx(frame, className)}>
      <defs>
        <linearGradient id={`ms-bg${u}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--color-tint-medico)" />
          <stop offset="1" stopColor="var(--color-paper)" />
        </linearGradient>
        <linearGradient id={`ms-screen${u}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#164C59" />
          <stop offset="1" stopColor="#0C3340" />
        </linearGradient>
        <filter id={`ms-sh${u}`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="10" stdDeviation="12" floodColor="#0C3340" floodOpacity="0.18" />
        </filter>
      </defs>
      <rect width="400" height="240" fill={`url(#ms-bg${u})`} />
      <circle cx="352" cy="44" r="62" fill="var(--color-accent-medico)" opacity="0.12" className="sc-float-slow" />
      {/* portatile */}
      <g filter={`url(#ms-sh${u})`}>
        <rect x="60" y="34" width="236" height="150" rx="12" fill={`url(#ms-screen${u})`} />
        <path d="M40 188 h276 l-14 14 h-248 z" fill="#C9D6DA" />
        {/* figura illustrata, non una persona reale */}
        <circle cx="178" cy="88" r="24" fill="#8FC9C2" />
        <path d="M128 168 c 6 -34, 30 -46, 50 -46 s 44 12, 50 46 z" fill="#E9F4F2" />
        <path d="M162 126 c -6 18, 0 30, 12 30" stroke="var(--color-teal)" strokeWidth="3" fill="none" strokeLinecap="round" />
        <circle cx="175" cy="157" r="5" fill="var(--color-teal)" />
        {/* in diretta */}
        <g transform="translate(78 52)">
          <rect width="58" height="20" rx="10" fill="#ffffff" fillOpacity="0.14" />
          <circle cx="12" cy="10" r="4.5" fill="#F87171" className="sc-pulse" />
          <rect x="22" y="7" width="26" height="6" rx="3" fill="#ffffff" fillOpacity="0.7" />
        </g>
        {/* voce */}
        <g transform="translate(244 54)">
          {[0, 1, 2, 3, 4].map((i) => (
            <rect key={i} x={i * 7} y={0} width="4" height="22" rx="2" fill="var(--color-marker)" className="sc-wave" style={{ animationDelay: `${i * 0.12}s`, transformOrigin: `${i * 7 + 2}px 11px` }} />
          ))}
        </g>
        {/* comandi */}
        <g transform="translate(150 168)">
          <circle cx="0" cy="0" r="9" fill="#ffffff" fillOpacity="0.2" />
          <circle cx="28" cy="0" r="9" fill="#ffffff" fillOpacity="0.2" />
          <circle cx="56" cy="0" r="9" fill="#EF4444" />
        </g>
      </g>
      {/* documenti già condivisi */}
      <g className="sc-slide-in" filter={`url(#ms-sh${u})`}>
        <rect x="282" y="76" width="94" height="44" rx="10" fill="var(--color-paper)" />
        <rect x="294" y="88" width="20" height="22" rx="4" fill="var(--color-tint-medico)" stroke="var(--color-accent-medico)" strokeWidth="2" />
        <rect x="320" y="90" width="44" height="6" rx="3" fill="#B8C7CC" />
        <rect x="320" y="102" width="30" height="6" rx="3" fill="#C5D3D6" />
      </g>
      <g className="sc-slide-in sc-delay" filter={`url(#ms-sh${u})`}>
        <rect x="282" y="128" width="94" height="44" rx="10" fill="var(--color-paper)" />
        <rect x="294" y="140" width="20" height="22" rx="4" fill="var(--color-tint-medico)" stroke="var(--color-accent-medico)" strokeWidth="2" />
        <rect x="320" y="142" width="44" height="6" rx="3" fill="#B8C7CC" />
        <rect x="320" y="154" width="30" height="6" rx="3" fill="#C5D3D6" />
      </g>
    </svg>
  );
}

export const SCENE = { capisci: CapisciScene, "secondo-parere": ParereScene, "parla-con-un-medico": MedicoScene } as const;
