/** Il calendario di «In arrivo» (16/11/2026): un foglio di calendario con un giorno cerchiato. Solo decorazione. */
export function CalendarioArrivo() {
  return (
    <svg aria-hidden className="wow-cal" viewBox="0 0 112 112">
      <rect x="10" y="18" width="92" height="84" rx="14" fill="#FFFDF8" stroke="#16252A" strokeWidth="2.5" />
      <path d="M10 32a14 14 0 0 1 14-14h64a14 14 0 0 1 14 14v8H10Z" fill="#F6B98E" stroke="#16252A" strokeWidth="2.5" />
      <rect x="30" y="8" width="8" height="20" rx="4" fill="#16252A" />
      <rect x="74" y="8" width="8" height="20" rx="4" fill="#16252A" />
      {[0, 1, 2].map((r) =>
        [0, 1, 2, 3].map((c) => <rect key={`${r}${c}`} x={22 + c * 19} y={50 + r * 16} width="11" height="8" rx="3" fill="#E3DDD1" />),
      )}
      <circle cx="65.5" cy="70" r="11" fill="none" stroke="#00756F" strokeWidth="3" />
      <path d="M86 92l10 10" stroke="#00756F" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

/** I quattro passi della visita a casa su una mappa disegnata (non in scala): dal CAP alla porta di casa. */
export function MappaPassi() {
  const pins: [number, number, string][] = [
    [70, 150, "CAP"],
    [250, 70, "Fascia"],
    [440, 140, "Conferma"],
    [630, 78, "A casa tua"],
  ];
  return (
    <svg aria-hidden className="wow-map" viewBox="0 0 720 210" preserveAspectRatio="xMidYMid meet">
      <rect width="720" height="210" fill="#EAF5F1" />
      <path d="M0 176C120 150 210 196 330 170S560 120 720 150V210H0Z" fill="#CFEAE3" />
      <g stroke="#FFFDF8" strokeWidth="10" strokeLinecap="round" fill="none">
        <path d="M0 110H720" />
        <path d="M180 0V210" />
        <path d="M520 0L470 210" />
        <path d="M330 0C350 60 300 120 340 210" />
      </g>
      {[[40, 30], [210, 120], [380, 30], [560, 170], [600, 20], [110, 60]].map(([x, y]) => (
        <rect key={`${x}${y}`} x={x} y={y} width="54" height="34" rx="6" fill="#D9ECE6" />
      ))}
      <path d="M70 150C140 140 180 70 250 70S380 150 440 140 560 80 630 78" fill="none" stroke="#00756F" strokeWidth="4" strokeDasharray="2 12" strokeLinecap="round" />
      {pins.map(([x, y, t], i) => (
        <g key={t} transform={`translate(${x} ${y})`}>
          <path d="M0 0c-14-18-22-28-22-38a22 22 0 0 1 44 0c0 10-8 20-22 38Z" fill={i === 3 ? "#F6B98E" : "#16252A"} />
          <text x="0" y="-31" textAnchor="middle" fontSize="20" fontStyle="italic" fontFamily="Georgia, serif" fill={i === 3 ? "#2B1608" : "#7BE0D2"}>
            {i + 1}
          </text>
          <rect x="-46" y="8" width="92" height="26" rx="13" fill="#FFFDF8" stroke="#16252A" strokeWidth="1.5" />
          <text x="0" y="26" textAnchor="middle" fontSize="14" fontWeight="800" fontFamily="system-ui, sans-serif" fill="#16252A">
            {t}
          </text>
        </g>
      ))}
    </svg>
  );
}
