import type { PersonaInput } from "./persone";
import type { PromemoriaInput } from "./promemoria";

/**
 * «Carica lo storico di esempio» (solo versione dimostrativa): una famiglia inventata per vedere
 * la salute nel tempo senza dover aggiungere dieci referti a mano.
 * - la persona di esempio (titolare) riceve tre controlli annuali 2023–2025, che si aggiungono ai referti dell'esempio;
 * - «Lucia», familiare di esempio, riceve quattro esami del sangue in diciotto mesi;
 * - due promemoria: una visita per Lucia con le domande pronte, un controllo per il titolare.
 * Nomi, numeri e laboratori sono inventati. Nessuna persona reale.
 */
export const LUCIA: PersonaInput = {
  name: "Lucia (esempio)",
  relation: "genitore",
  birthYear: 1945,
  basis: "consenso",
  declaration: true,
};

function plusDays(today: string, n: number) {
  return new Date(Date.parse(`${today}T00:00:00Z`) + n * 864e5)
    .toISOString()
    .slice(0, 10);
}

export function demoReminders(
  today: string,
  luciaId: string,
): PromemoriaInput[] {
  return [
    {
      profileId: luciaId,
      kind: "visita",
      title: "Visita dal medico di famiglia con la mamma",
      dueDate: plusDays(today, 6),
      note: "Portare gli ultimi esami del sangue.",
      questions: [],
    },
    {
      profileId: null,
      kind: "controllo",
      title: "Ripetere il profilo lipidico (indicato dal medico)",
      dueDate: plusDays(today, 120),
      note: null,
      questions: [],
    },
  ];
}
