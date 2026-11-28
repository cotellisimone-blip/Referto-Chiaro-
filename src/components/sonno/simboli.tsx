/**
 * Simboli della sezione sonno (22/11/2026). Stesso disegno di quelli della home, dei diari e delle malattie: tratto
 * 2,1 su 32 × 32, una campitura leggera, usati con <Ic id="s-…" />.
 */
export function SonnoSimboli() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden="true" focusable="false">
      {/* Letto con la persona sveglia e i pensieri che girano. */}
      <symbol id="hb-i-s-letto" viewBox="0 0 32 32">
        <path d="M3 25V12M3 20h26v5M29 20v-3a3 3 0 0 0-3-3H14v6" />
        <circle cx="8.5" cy="16.5" r="2.5" fill="currentColor" fillOpacity=".22" />
        <path d="M20 5.5a3 3 0 1 1 3 3M24 3.5l1.6-1.2M26.5 7.5h2" />
      </symbol>
      {/* Luna con tre tacche: i risvegli. */}
      <symbol id="hb-i-s-risvegli" viewBox="0 0 32 32">
        <path d="M20 4.5A11 11 0 1 0 27.5 22 9 9 0 0 1 20 4.5z" fill="currentColor" fillOpacity=".18" />
        <path d="M24 8v3M27.5 11h-3M28 4.5l-1.6 1.6" />
      </symbol>
      {/* Bocca addormentata e onde del russare. */}
      <symbol id="hb-i-s-russare" viewBox="0 0 32 32">
        <circle cx="12" cy="17" r="9" fill="currentColor" fillOpacity=".16" />
        <path d="M8 14.5h2.5M13.5 14.5H16M9.5 20.5c1.5 1.2 3.5 1.2 5 0" />
        <path d="M23 10c1.6 1.4 1.6 3.6 0 5M26 7.5c3 2.8 3 7.2 0 10" />
      </symbol>
      {/* Mezzo sole e mezza luna: i turni. */}
      <symbol id="hb-i-s-turni" viewBox="0 0 32 32">
        <path d="M16 6a10 10 0 0 0 0 20z" fill="currentColor" fillOpacity=".2" />
        <path d="M16 6a10 10 0 0 1 0 20" />
        <path d="M16 2v4M16 26v4M4.5 16H2M7.5 7.5 5.7 5.7M7.5 24.5l-1.8 1.8" />
        <path d="M21 12.5a4.5 4.5 0 0 0 3.5 7 5 5 0 0 1-3.5-7z" />
      </symbol>
      {/* Due gambe in movimento. */}
      <symbol id="hb-i-s-gambe" viewBox="0 0 32 32">
        <path d="M11 3v11l-3 13h4.5M19 3v10l5 11-3.5 2" />
        <path d="M11 14c2.5 1.2 5.5 1.2 8-1" fill="none" />
        <path d="M26 6.5c1.4 1 1.4 3 0 4M5 9.5c-1.4 1-1.4 3 0 4" />
      </symbol>
      {/* Onde del sonno. */}
      <symbol id="hb-i-s-onde" viewBox="0 0 32 32">
        <path d="M3 9c2 0 2-3 4-3s2 3 4 3 2-3 4-3 2 3 4 3" />
        <path d="M3 18c3 0 3-5 6.5-5S13 18 16 18s3-5 6.5-5 3.5 5 6.5 5" fill="none" />
        <path d="M3 27c4 0 4-6 9-6s5 6 9 6 4-3 8-3" />
      </symbol>
      {/* Un foglio di appunti con il letto: la terapia cognitivo-comportamentale. */}
      <symbol id="hb-i-s-cbti" viewBox="0 0 32 32">
        <rect x="6" y="3.5" width="20" height="25" rx="3" fill="currentColor" fillOpacity=".14" />
        <path d="M11 10h10M11 15h10M11 20h5" />
        <path d="M19.5 22.5l2 2 4-4.5" />
      </symbol>
      {/* Una capsula e una luna: farmaci per dormire. */}
      <symbol id="hb-i-s-farmaci" viewBox="0 0 32 32">
        <rect x="3.5" y="13" width="17" height="8" rx="4" transform="rotate(-35 12 17)" fill="currentColor" fillOpacity=".18" />
        <path d="M9.3 13.3l5 7.2" />
        <path d="M24 5.5a5 5 0 1 0 4.5 7.5 4 4 0 0 1-4.5-7.5z" />
      </symbol>
      {/* Il tracciato di un esame del sonno. */}
      <symbol id="hb-i-s-esame" viewBox="0 0 32 32">
        <rect x="3" y="5" width="26" height="20" rx="3" fill="currentColor" fillOpacity=".12" />
        <path d="M6 12h3l2-3 2.5 6 2-3H19M6 19h4l1.5-2 1.5 2h3l1.5-3 1.5 3H26" />
        <path d="M11 29h10" />
      </symbol>
      {/* Due settimane: quattordici quadretti. */}
      <symbol id="hb-i-s-settimane" viewBox="0 0 32 32">
        <rect x="3" y="5" width="26" height="23" rx="3" fill="currentColor" fillOpacity=".12" />
        <path d="M3 11h26M10 3v4M22 3v4" />
        <path d="M8 16h2M13 16h2M18 16h2M23 16h1M8 21h2M13 21h2M18 21h2" />
        <path d="M22.5 22l1.5 1.5 3-3.5" />
      </symbol>
      {/* Una domanda con la spunta: le autovalutazioni. */}
      <symbol id="hb-i-s-test" viewBox="0 0 32 32">
        <rect x="4" y="4" width="24" height="24" rx="5" fill="currentColor" fillOpacity=".13" />
        <path d="M9 11l2 2 3.5-4M9 20.5l2 2 3.5-4M18 11h6M18 20.5h6" />
      </symbol>
    </svg>
  );
}
