import type { ReactNode } from "react";

/**
 * Disegni dei cinque passi dei diari (21/11/2026): tratto nel colore della pagina, riempimenti leggerissimi, nessun
 * volto. Sono figure semplici, pensate per essere capite a colpo d'occhio anche su un telefono piccolo.
 */
const F = { fill: "currentColor", fillOpacity: 0.14 } as const;
const S = { fill: "currentColor", fillOpacity: 0.3, stroke: "none" } as const;

/** Persona seduta di profilo, verso destra (testa, busto, gambe, piedi a terra). */
function Seduto({ x = 0, arm = true }: { x?: number; arm?: boolean }) {
  return (
    <g transform={`translate(${x} 0)`}>
      <circle cx="34" cy="20" r="7" {...F} />
      <path d="M34 28v24h18l2 20M52 72h7" />
      {arm ? <path d="M34 34l14 10h16" /> : null}
      <path d="M24 30v42M24 52h12" opacity=".55" />
    </g>
  );
}

const ART: Record<string, ReactNode> = {
  "p-riposo": (
    <>
      <Seduto arm={false} />
      <path d="M34 34l10 12" />
      <circle cx="88" cy="32" r="18" {...F} />
      <path d="M88 22v10l7 5" />
    </>
  ),
  "p-postura": (
    <>
      <Seduto />
      <path d="M62 44h40M96 44v28" />
      <rect x="66" y="36" width="16" height="8" rx="3" {...S} />
      <path d="M44 72h22" strokeDasharray="3 4" opacity=".7" />
      <path d="M14 82h96" opacity=".4" />
    </>
  ),
  "p-bracciale": (
    <>
      <path d="M8 40c20-6 52-6 74-2l26 4M8 58c22 4 52 4 74 0l26-6" />
      <rect x="34" y="34" width="30" height="27" rx="6" {...F} />
      <path d="M64 46h14c6 0 8 10 14 10" />
      <path d="M70 26v6M70 26h12" opacity=".7" />
    </>
  ),
  "p-due": (
    <>
      <rect x="10" y="18" width="40" height="50" rx="8" {...F} />
      <rect x="70" y="18" width="40" height="50" rx="8" {...F} />
      <text x="30" y="50" textAnchor="middle" fontSize="20" fontWeight="800" fill="currentColor" stroke="none">
        1
      </text>
      <text x="90" y="50" textAnchor="middle" fontSize="20" fontWeight="800" fill="currentColor" stroke="none">
        2
      </text>
      <path d="M52 43h14M62 39l4 4-4 4" />
    </>
  ),
  "p-sette": (
    <>
      <rect x="10" y="14" width="100" height="62" rx="10" {...F} />
      <path d="M10 30h100" />
      {Array.from({ length: 7 }, (_, i) => (
        <g key={i}>
          <rect x={16 + i * 13.5} y={38} width={10} height={10} rx={3} />
          <rect x={16 + i * 13.5} y={56} width={10} height={10} rx={3} {...(i ? S : {})} />
          {i ? <path d={`M${18 + i * 13.5} 43l2 2 4-4`} /> : null}
        </g>
      ))}
      <circle cx="20" cy="22" r="3" {...S} />
      <path d="M100 19a4 4 0 1 0 4 6 3 3 0 0 1-4-6z" {...S} />
    </>
  ),
  "g-mani": (
    <>
      <path d="M40 12h30v8H40z" {...F} />
      <path d="M55 24v6M50 34v5M60 36v5" />
      <path d="M22 70c4-14 14-22 26-22h10M98 70c-4-14-14-22-26-22H62" />
      <path d="M30 60h20M70 60h20" opacity=".55" />
      <ellipse cx="60" cy="76" rx="40" ry="6" {...F} />
    </>
  ),
  "g-strisce": (
    <>
      <rect x="20" y="16" width="34" height="60" rx="8" {...F} />
      <rect x="20" y="10" width="34" height="10" rx="4" {...S} />
      <path d="M68 30h40l-6 40H74z" {...F} />
      <path d="M78 44h20M80 54h16" />
      <path d="M29 40h16M29 50h16" opacity=".6" />
    </>
  ),
  "g-dito": (
    <>
      <path d="M30 84V40c0-10 6-16 14-16s14 6 14 16v44" {...F} />
      <path d="M58 44c8 0 12 4 12 4" />
      <path d="M76 38c-6 8-6 14 0 16 6-2 6-8 0-16z" {...S} />
      <path d="M76 38c-6 8-6 14 0 16 6-2 6-8 0-16z" />
      <path d="M86 30l10-6M90 44h12" opacity=".6" />
    </>
  ),
  "g-momento": (
    <>
      <circle cx="40" cy="44" r="26" {...F} />
      <path d="M40 30v14l9 6" />
      <circle cx="90" cy="50" r="16" {...F} />
      <path d="M70 32v36M110 32v36M106 32v12" opacity=".7" />
    </>
  ),
  "g-note": (
    <>
      <rect x="22" y="12" width="56" height="68" rx="8" {...F} />
      <path d="M32 30h36M32 42h36M32 54h22" />
      <path d="M84 70l16-40 8 3-16 40-9 4z" {...S} />
      <path d="M84 70l16-40 8 3-16 40-9 4z" />
    </>
  ),
  "c-subito": (
    <>
      <circle cx="42" cy="44" r="28" {...F} />
      <path d="M42 28v16h12" />
      <path d="M82 76l18-44 8 3-18 44-9 4z" {...S} />
      <path d="M82 76l18-44 8 3-18 44-9 4z" />
    </>
  ),
  "c-intensita": (
    <>
      <rect x="14" y="52" width="24" height="22" rx="6" {...F} />
      <rect x="48" y="36" width="24" height="38" rx="6" {...F} />
      <rect x="82" y="16" width="24" height="58" rx="6" {...S} />
      <rect x="82" y="16" width="24" height="58" rx="6" />
    </>
  ),
  "c-sintomi": (
    <>
      <path d="M10 44c10-14 24-20 36-20s26 6 36 20c-10 14-24 20-36 20S20 58 10 44z" {...F} />
      <circle cx="46" cy="44" r="8" {...S} />
      <path d="M92 32c4 4 4 20 0 24M100 26c7 7 7 29 0 36M108 20c10 10 10 38 0 48" />
    </>
  ),
  "c-farmaco": (
    <>
      <rect x="14" y="34" width="56" height="24" rx="12" transform="rotate(-25 42 46)" {...F} />
      <path d="M30 56l22-14" />
      <circle cx="88" cy="46" r="22" {...F} />
      <path d="M88 34v12h10" />
    </>
  ),
  "c-mese": (
    <>
      <rect x="10" y="12" width="100" height="70" rx="10" {...F} />
      <path d="M10 28h100" />
      {Array.from({ length: 14 }, (_, i) => {
        const x = 18 + (i % 7) * 13.5;
        const y = 36 + Math.floor(i / 7) * 20;
        return <rect key={i} x={x} y={y} width={10} height={12} rx={3} {...(i === 3 || i === 10 ? S : {})} />;
      })}
      <path d="M20 41l2 2 4-4M33 41l2 2 4-4M47 41l2 2 4-4" />
    </>
  ),  // 22/11/2026: sonno, peso, respiro.
  "s-mattino": (
    <>
      <circle cx="34" cy="40" r="16" {...F} />
      <path d="M34 16v6M34 58v6M10 40h6M52 40h6M17 23l4 4M47 53l4 4M51 23l-4 4" />
      <rect x="72" y="18" width="34" height="58" rx="7" {...F} />
      <path d="M80 34h18M80 44h18M80 54h12" />
      <path d="M8 80h104" opacity=".4" />
    </>
  ),
  "s-orari": (
    <>
      <circle cx="32" cy="42" r="22" {...F} />
      <path d="M32 28v14l-8 6" />
      <circle cx="88" cy="42" r="22" {...F} />
      <path d="M88 28v14l10 4" />
      <path d="M22 18a10 10 0 1 0 8-12 8 8 0 0 1-8 12z" {...S} />
    </>
  ),
  "s-addormentarsi": (
    <>
      <path d="M10 66h100M10 66V50h100v16M10 50c0-8 6-12 14-12h20v12" {...F} />
      <path d="M10 66v10M110 66v10" />
      <text x="70" y="30" fontSize="14" fontWeight="800" fill="currentColor" stroke="none">
        z
      </text>
      <text x="82" y="20" fontSize="18" fontWeight="800" fill="currentColor" stroke="none">
        z
      </text>
    </>
  ),
  "s-risvegli": (
    <>
      <path d="M16 18a14 14 0 1 0 12-14 11 11 0 0 1-12 14z" {...S} />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x={50 + i * 22} y={30} width={16} height={16} rx={4} {...(i < 2 ? S : F)} />
          {i < 2 ? <path d={`M${54 + i * 22} 38l3 3 5-6`} /> : null}
        </g>
      ))}
      <rect x="10" y="58" width="30" height="16" rx="6" {...F} />
      <rect x="45" y="58" width="30" height="16" rx="6" {...S} />
      <rect x="80" y="58" width="30" height="16" rx="6" {...F} />
      <rect x="45" y="58" width="30" height="16" rx="6" />
    </>
  ),
  "s-settimane": (
    <>
      <rect x="10" y="12" width="100" height="70" rx="10" {...F} />
      <path d="M10 28h100" />
      {Array.from({ length: 14 }, (_, i) => {
        const x = 18 + (i % 7) * 13.5;
        const y = 36 + Math.floor(i / 7) * 20;
        return <rect key={i} x={x} y={y} width={10} height={12} rx={3} {...(i % 3 === 0 ? S : {})} />;
      })}
      <path d="M96 18a5 5 0 1 0 5 7 4 4 0 0 1-5-7z" {...S} />
    </>
  ),
  "w-mattino": (
    <>
      <circle cx="30" cy="34" r="14" {...F} />
      <path d="M30 12v5M30 51v5M8 34h5M47 34h5" />
      <rect x="64" y="18" width="20" height="40" rx="10" {...F} />
      <path d="M74 58v18M66 76h16" />
      <path d="M96 30c0 8 10 8 10 0s-10-8-10 0z" {...S} />
      <path d="M8 80h104" opacity=".4" />
    </>
  ),
  "w-vestiti": (
    <>
      <path d="M34 22l-16 10 6 12 8-4v36h36V40l8 4 6-12-16-10c-2 6-8 10-16 10s-14-4-16-10z" {...F} />
      <path d="M88 70c6-4 14-4 20 0v6H88z" {...S} />
      <path d="M84 20l26 26M110 20L84 46" opacity=".75" />
    </>
  ),
  "w-bilancia": (
    <>
      <rect x="22" y="42" width="76" height="30" rx="8" {...F} />
      <rect x="46" y="48" width="28" height="12" rx="3" {...S} />
      <path d="M8 76h104" />
      <path d="M12 82h8M28 82h8M44 82h8M60 82h8M76 82h8M92 82h8" opacity=".55" />
      <path d="M40 24l40 0M60 14v20" opacity=".6" />
    </>
  ),
  "w-fermo": (
    <>
      <rect x="20" y="54" width="80" height="22" rx="8" {...F} />
      <path d="M44 54V40c0-4 3-6 6-6s6 2 6 6v14M64 54V40c0-4 3-6 6-6s6 2 6 6v14" />
      <rect x="44" y="10" width="32" height="16" rx="4" {...S} />
    </>
  ),
  "w-scrivi": (
    <>
      <rect x="10" y="14" width="74" height="64" rx="8" {...F} />
      <path d="M18 62l14-8 14 4 14-12 14 4" />
      {[18, 32, 46, 60, 74].map((x, i) => (
        <circle key={x} cx={x} cy={[62, 54, 58, 46, 50][i]} r="3" {...S} />
      ))}
      <path d="M88 74l14-38 8 3-14 38-9 4z" {...S} />
      <path d="M88 74l14-38 8 3-14 38-9 4z" />
    </>
  ),
  "r-piedi": (
    <>
      <rect x="20" y="36" width="70" height="20" rx="10" {...F} />
      <path d="M90 42h18v8H90" />
      <path d="M30 46h40" strokeDasharray="2 5" />
      <path d="M30 36v-8M30 28h8" />
      <text x="34" y="76" textAnchor="middle" fontSize="14" fontWeight="800" fill="currentColor" stroke="none">
        0
      </text>
      <path d="M34 66v-6" opacity=".6" />
    </>
  ),
  "r-inspira": (
    <>
      <path d="M40 18c-14 4-24 22-24 40 0 12 8 16 18 14l8-2V30zM80 18c14 4 24 22 24 40 0 12-8 16-18 14l-8-2V30z" {...F} />
      <path d="M60 8v30M60 38l-14 10M60 38l14 10" />
    </>
  ),
  "r-soffia": (
    <>
      <circle cx="22" cy="44" r="14" {...F} />
      <rect x="36" y="38" width="46" height="14" rx="7" {...F} />
      <path d="M88 34l14-6M90 45h18M88 56l14 6" />
    </>
  ),
  "r-tre": (
    <>
      <rect x="10" y="24" width="28" height="40" rx="7" {...F} />
      <rect x="46" y="24" width="28" height="40" rx="7" {...S} />
      <rect x="82" y="24" width="28" height="40" rx="7" {...F} />
      <rect x="46" y="24" width="28" height="40" rx="7" />
      <text x="24" y="50" textAnchor="middle" fontSize="14" fontWeight="800" fill="currentColor" stroke="none">
        1
      </text>
      <text x="60" y="50" textAnchor="middle" fontSize="14" fontWeight="800" fill="currentColor" stroke="none">
        2
      </text>
      <text x="96" y="50" textAnchor="middle" fontSize="14" fontWeight="800" fill="currentColor" stroke="none">
        3
      </text>
    </>
  ),
  "r-momento": (
    <>
      <circle cx="30" cy="40" r="14" {...F} />
      <path d="M30 18v5M30 57v5M8 40h5M47 40h5" />
      <path d="M84 26a16 16 0 1 0 14 22 13 13 0 0 1-14-22z" {...S} />
      <rect x="50" y="60" width="20" height="22" rx="5" {...F} />
      <path d="M54 60v-6h12v6" />
    </>
  ),
};

/** 27/11/2026 (fase 2): niente più scritte piccole dentro i disegni (8-10 px a schermo): lo dice già il testo accanto. */
export function Disegno({ art, className }: { art: string; className?: string }) {
  return (
    <svg viewBox="0 0 120 90" className={className} aria-hidden="true" focusable="false" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      {ART[art] ?? null}
    </svg>
  );
}

/** Icone dei diari, nello stesso stile a due toni delle icone della home (si usano con <Ic id="cuore" />). */
export function DiariSimboli() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true" focusable="false">
      <symbol id="hb-i-cuore" viewBox="0 0 32 32">
        <path d="M16 27S4.5 20 4.5 11.8A6.3 6.3 0 0 1 16 8.3a6.3 6.3 0 0 1 11.5 3.5C27.5 20 16 27 16 27z" fill="currentColor" fillOpacity=".18" />
        <path d="M7 16h5l2-4 3.5 8 2-4H25" />
      </symbol>
      <symbol id="hb-i-goccia" viewBox="0 0 32 32">
        <path d="M16 4s9 9.5 9 16a9 9 0 0 1-18 0c0-6.5 9-16 9-16z" fill="currentColor" fillOpacity=".18" />
        <path d="M12 21a4 4 0 0 0 4 4" />
      </symbol>
      <symbol id="hb-i-testa" viewBox="0 0 32 32">
        <path d="M18 28v-4h3a2 2 0 0 0 2-2v-3l2.5-1-2.5-4.5A9 9 0 1 0 9 21v7" fill="currentColor" fillOpacity=".16" />
        <path d="M14 9l-2 4h4l-2 4" />
      </symbol>
      <symbol id="hb-i-diario" viewBox="0 0 32 32">
        <rect x="7" y="4" width="19" height="24" rx="3" fill="currentColor" fillOpacity=".16" />
        <path d="M11 4v24M15 11h7M15 16h7M15 21h4" />
      </symbol>
      <symbol id="hb-i-luna" viewBox="0 0 32 32">
        <path d="M20 5a11 11 0 1 0 7 17A9 9 0 0 1 20 5z" fill="currentColor" fillOpacity=".18" />
        <path d="M22 8h4l-4 4h4" />
      </symbol>
      <symbol id="hb-i-bilancia" viewBox="0 0 32 32">
        <rect x="5" y="7" width="22" height="20" rx="5" fill="currentColor" fillOpacity=".16" />
        <path d="M10 14a6 6 0 0 1 12 0M16 14l2-3" />
      </symbol>
      <symbol id="hb-i-respiro" viewBox="0 0 32 32">
        <path d="M13 7c-5 1-8 8-8 14 0 4 3 5 6 4l3-1V9zM19 7c5 1 8 8 8 14 0 4-3 5-6 4l-3-1V9z" fill="currentColor" fillOpacity=".16" />
        <path d="M16 4v10M16 14l-4 3M16 14l4 3" />
      </symbol>
    </svg>
  );
}
