/**
 * Il foglio per la visita, disegnato come un vero foglio di carta (16/11/2026). Dati inventati e dichiarati: è un
 * esempio, come il referto di esempio. Nessuna valutazione: solo i numeri stampati e le domande da fare.
 */
export function FoglioMedico() {
  return (
    <figure className="wow-sheet" aria-label="Esempio del foglio per la visita, con dati inventati">
      <span className="wow-sheet-ex">Esempio</span>
      <p className="wow-sheet-k">Per la visita · 1 pagina</p>
      <h3 className="mt-1">Esami del 12/03/2026</h3>
      <ul>
        <li>
          <span>Glicemia</span>
          <b>92 mg/dL</b>
        </li>
        <li className="wow-flag">
          <span>Colesterolo LDL *</span>
          <b>134 mg/dL</b>
        </li>
        <li>
          <span>Creatinina</span>
          <b>0,89 mg/dL</b>
        </li>
      </ul>
      <p className="mt-3 text-[0.8125rem] font-extrabold uppercase tracking-[0.1em] text-[#0b6b63]">Da chiedere al medico</p>
      <ol>
        <li>Il mio LDL va ricontrollato? Quando?</li>
        <li>C&apos;è altro da guardare insieme?</li>
      </ol>
    </figure>
  );
}
