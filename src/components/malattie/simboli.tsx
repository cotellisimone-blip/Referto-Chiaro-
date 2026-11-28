/**
 * Simboli delle aree senza un diario (22/11/2026): colesterolo, tiroide, anemia, fegato. Stesso disegno di quelli della
 * home e dei diari: tratto 2,1 su 32 × 32, una campitura leggera, usati con <Ic id="…" />.
 */
export function MalattieSimboli() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true" focusable="false">
      {/* Un'arteria vista in sezione, con la placca che la restringe. */}
      <symbol id="hb-i-vaso" viewBox="0 0 32 32">
        <path d="M3 10h26M3 22h26" />
        <path d="M11 10c1.5 3.2 5 4.2 9 3.4 2.4-.5 4-1.7 5-3.4z" fill="currentColor" fillOpacity=".22" />
        <circle cx="8" cy="17" r="1.6" fill="currentColor" stroke="none" />
        <circle cx="15" cy="18.5" r="1.6" fill="currentColor" stroke="none" />
        <circle cx="22" cy="17.5" r="1.6" fill="currentColor" stroke="none" />
      </symbol>
      {/* La tiroide: due lobi uniti dall'istmo, davanti alla trachea. */}
      <symbol id="hb-i-tiroide" viewBox="0 0 32 32">
        <path d="M16 3v26" strokeDasharray="2 3" />
        <path d="M14 17c-1 5-4 8-7.5 8S3 21 4 16s3-9 6-9 4.7 5 4 10zM18 17c1 5 4 8 7.5 8s3.5-4 2.5-9-3-9-6-9-4.7 5-4 10z" fill="currentColor" fillOpacity=".18" />
        <path d="M13 18h6" />
      </symbol>
      {/* Un globulo rosso: il disco con l'incavo al centro. */}
      <symbol id="hb-i-sangue" viewBox="0 0 32 32">
        <ellipse cx="16" cy="16" rx="12" ry="9" fill="currentColor" fillOpacity=".18" />
        <ellipse cx="16" cy="16" rx="5.5" ry="3.6" />
        <path d="M24 5l2-2M27 8l2-1" />
      </symbol>
      {/* Il fegato, con la goccia di grasso. */}
      <symbol id="hb-i-fegato" viewBox="0 0 32 32">
        <path d="M4 12c0-3 2.5-5 6-5h15c2.5 0 4 1.8 3.4 4.2C27 17 21 24 14 25.5 8 26.8 4 21 4 12z" fill="currentColor" fillOpacity=".18" />
        <path d="M17 7c-1 5-1 11 1 17" />
        <path d="M10 14.5s2.6 2.7 2.6 4.4a2.6 2.6 0 0 1-5.2 0c0-1.7 2.6-4.4 2.6-4.4z" />
      </symbol>
      {/* Lo scudo con la spunta: la riga della revisione medica. */}
      <symbol id="hb-i-firma" viewBox="0 0 32 32">
        <path d="M16 3l10 4v8c0 7-4.5 11.5-10 14C10.5 26.5 6 22 6 15V7z" fill="currentColor" fillOpacity=".16" />
        <path d="M11.5 16l3 3 6-6.5" />
      </symbol>
      {/* La sirena del 112. */}
      <symbol id="hb-i-allarme" viewBox="0 0 32 32">
        <path d="M9 24v-8a7 7 0 0 1 14 0v8" fill="currentColor" fillOpacity=".18" />
        <path d="M6 24h20v4H6zM16 3v3M5.5 8l2 2M26.5 8l-2 2" />
      </symbol>
      {/* La lista delle domande. */}
      <symbol id="hb-i-domande" viewBox="0 0 32 32">
        <rect x="5" y="4" width="22" height="24" rx="4" fill="currentColor" fillOpacity=".14" />
        <path d="M13 11.5a3 3 0 1 1 4 2.8c-.8.3-1 .9-1 1.7v.5M16 21h.01" />
      </symbol>
    </svg>
  );
}
