"use client";

import { useId, useState, type ReactNode } from "react";

/**
 * La guida personale dentro il report, su telefono (19/11/2026). Il report da telefono deve restare corto (ciclo 5): la
 * guida vi entra come una scheda sola, con i temi in vista e un pulsante grande per aprirla. Da 900 px in su è sempre
 * aperta e il pulsante non c'è (lo decide il CSS, così la prima pittura è già quella giusta). In stampa è aperta.
 */
export function GuidaApribile({ letture, esempio = false, sommario, children }: { letture: number; esempio?: boolean; sommario: ReactNode; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <div className={open ? "gp-apribile is-open" : "gp-apribile"}>
      {sommario}
      <div id={id} className="gp-corpo">
        {children}
      </div>
      <button type="button" className="gp-apri" aria-expanded={open} aria-controls={id} onClick={() => setOpen((o) => !o)}>
        {open ? (esempio ? "Chiudi l’esempio" : "Chiudi la guida") : `${esempio ? "Apri l’esempio" : "Apri la guida"}: ${letture === 1 ? "una lettura" : `${letture} letture`}`}
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
    </div>
  );
}
