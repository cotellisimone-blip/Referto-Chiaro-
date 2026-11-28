/** Un barattolo disegnato, nel colore dell'integratore (16/11/2026). Solo decorazione, nessun marchio. */
export function Jar({ c, d, size = 54 }: { c: string; d: string; size?: number }) {
  return (
    <svg aria-hidden className="wow-jar" viewBox="0 0 54 64" width={size} height={(size * 64) / 54}>
      <rect x="12" y="4" width="30" height="10" rx="3" fill={d} />
      <rect x="9" y="12" width="36" height="5" rx="2.5" fill={d} opacity=".75" />
      <path d="M10 18h34a4 4 0 0 1 4 4v32a8 8 0 0 1-8 8H14a8 8 0 0 1-8-8V22a4 4 0 0 1 4-4Z" fill="#FFFCF6" stroke={d} strokeWidth="2.2" />
      <rect x="10" y="28" width="34" height="20" rx="3" fill={c} />
      <circle cx="20" cy="38" r="3.2" fill="#FFFCF6" />
      <rect x="26" y="34.5" width="13" height="2.6" rx="1.3" fill="#FFFCF6" />
      <rect x="26" y="39.5" width="9" height="2.6" rx="1.3" fill="#FFFCF6" opacity=".8" />
      <path d="M13 22v26" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" opacity=".7" />
    </svg>
  );
}
