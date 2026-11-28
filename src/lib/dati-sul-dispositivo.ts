/**
 * 27/11/2026 (fase 1, privacy): tutto ciò che il sito lascia nel browser del telefono o del computer. Un solo elenco,
 * usato dalle Impostazioni («Cancella da questo dispositivo») e citato dalla pagina sui cookie. Nessuno di questi dati
 * viene inviato al server.
 */
export const DATI_SUL_DISPOSITIVO: { key: string; cosa: string; sanitario: boolean }[] = [
  { key: "cp-sonno-autovalutazioni", cosa: "Le risposte e il risultato delle autovalutazioni del sonno", sanitario: true },
  { key: "cp-prestazioni-demo", cosa: "Le richieste al medico fatte nella prova (nome, telefono, motivo)", sanitario: true },
  { key: "cp-prestazioni-demo-medico", cosa: "Il medico scelto nella prova", sanitario: false },
  { key: "cp-search-recent", cosa: "Le ultime ricerche fatte con la lente", sanitario: false },
  { key: "rc-theme", cosa: "La luce scelta (chiara o scura)", sanitario: false },
  { key: "rc-theme-vista", cosa: "Se hai già visto il pulsante della luce", sanitario: false },
  { key: "rc-size", cosa: "La dimensione del testo («Aa»)", sanitario: false },
];

/** Cancella dal browser tutto ciò che il sito vi ha salvato. Restituisce quante voci c'erano. */
export function cancellaDatiSulDispositivo(): number {
  let n = 0;
  try {
    for (const { key } of DATI_SUL_DISPOSITIVO) {
      if (localStorage.getItem(key) !== null) n++;
      localStorage.removeItem(key);
    }
    sessionStorage.removeItem("rc-demo-v1");
  } catch {
    // Archiviazione del browser bloccata: non c'è niente da cancellare.
  }
  return n;
}

/** All'uscita dall'area personale: via le voci con dati sanitari (telefoni condivisi). Tema e testo restano. */
export function cancellaDatiSanitariSulDispositivo(): void {
  try {
    for (const { key, sanitario } of DATI_SUL_DISPOSITIVO) if (sanitario) localStorage.removeItem(key);
  } catch {
    // Archiviazione del browser bloccata.
  }
}
