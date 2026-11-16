/** Tre piccole scene disegnate per i tre passi della lettura del referto (16/11/2026). Solo decorazione. */
export function StepScene({ n }: { n: 1 | 2 | 3 }) {
  const ink = "#16252A";
  if (n === 1)
    return (
      <svg aria-hidden className="wow-scene" viewBox="0 0 180 96">
        <rect x="8" y="10" width="64" height="80" rx="5" fill="#FFFDF8" stroke={ink} strokeWidth="2" transform="rotate(-6 40 50)" />
        <g transform="rotate(-6 40 50)" stroke="#C9C1B3" strokeWidth="3" strokeLinecap="round">
          <path d="M18 28h40M18 40h32M18 52h40M18 64h26" />
        </g>
        <rect x="96" y="6" width="54" height="86" rx="10" fill={ink} />
        <rect x="101" y="14" width="44" height="64" rx="4" fill="#7BE0D2" />
        <rect x="110" y="24" width="26" height="34" rx="2" fill="#FFFDF8" />
        <path d="M114 32h18M114 39h14M114 46h18" stroke="#C9C1B3" strokeWidth="2" strokeLinecap="round" />
        <circle cx="123" cy="85" r="3" fill="#F6B98E" />
        <path d="M78 50h12m-5-5 5 5-5 5" stroke="#00756F" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  if (n === 2)
    return (
      <svg aria-hidden className="wow-scene" viewBox="0 0 180 96">
        <rect x="20" y="8" width="140" height="80" rx="12" fill="#FFFDF8" stroke={ink} strokeWidth="2" />
        {[0, 1, 2].map((i) => (
          <g key={i} transform={`translate(34 ${22 + i * 22})`}>
            <rect width="16" height="16" rx="4" fill={i < 2 ? "#00756F" : "#FFFDF8"} stroke="#00756F" strokeWidth="2" />
            {i < 2 ? <path d="M4 8.5l3 3 5-6" stroke="#fff" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" /> : null}
            <rect x="26" y="4" width={i === 1 ? 54 : 70} height="8" rx="4" fill="#E3DDD1" />
            <rect x="96" y="2" width="16" height="12" rx="3" fill={i === 1 ? "#F6B98E" : "#DDF2EC"} />
          </g>
        ))}
      </svg>
    );
  return (
    <svg aria-hidden className="wow-scene" viewBox="0 0 180 96">
      <rect x="24" y="6" width="132" height="84" rx="12" fill="#FFFDF8" stroke={ink} strokeWidth="2" />
      <rect x="38" y="18" width="60" height="9" rx="4.5" fill={ink} />
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(38 ${38 + i * 16})`}>
          <rect width="104" height="7" rx="3.5" fill="#E3DDD1" />
          <rect width={[70, 84, 52][i]} height="7" rx="3.5" fill="#00756F" opacity={0.85} />
          <circle cx={[66, 92, 48][i]} cy="3.5" r="6" fill={i === 1 ? "#F6B98E" : "#7BE0D2"} stroke={ink} strokeWidth="1.5" />
        </g>
      ))}
    </svg>
  );
}
