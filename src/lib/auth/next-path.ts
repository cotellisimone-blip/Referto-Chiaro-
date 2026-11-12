/**
 * Ciclo 3, fase 2: dopo l'accesso si torna dove si voleva andare (per esempio la prenotazione del videoconsulto).
 * Si accettano solo percorsi interni dell'area personale, senza query né caratteri speciali: nessun reindirizzamento
 * verso altri siti è possibile.
 */
const AREA_PATH = /^\/area-personale(?:\/[A-Za-z0-9-]+)*\/?$/;

export function safeAreaNext(raw: string | null | undefined): string {
  if (typeof raw !== "string" || raw.length > 200) return "/area-personale";
  return AREA_PATH.test(raw) ? raw.replace(/\/$/, "") || "/area-personale" : "/area-personale";
}
