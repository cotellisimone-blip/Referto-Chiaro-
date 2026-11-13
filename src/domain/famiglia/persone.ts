import { z } from "zod";

/**
 * Famiglia (13/11/2026): chi segue un genitore, un figlio o il partner tiene i suoi referti nello stesso account.
 *
 * Ogni familiare è una «persona» dell'account. Il titolare è sempre la persona «io» (nessuna riga in tabella).
 * Per aggiungere un familiare serve una dichiarazione esplicita della base su cui si gestiscono i suoi dati.
 * La base giuridica (consenso dell'interessato, responsabilità genitoriale, tutela o amministrazione di sostegno)
 * è un punto aperto per il legale: qui raccogliamo la dichiarazione e la registriamo, non la verifichiamo.
 */

export const SELF_ID = "io";
export const MAX_FAMILIARI = 5;

export const RELAZIONI = {
  genitore: "Mamma o papà",
  figlio: "Figlia o figlio",
  partner: "Partner",
  nonno: "Nonna o nonno",
  altro: "Altro familiare",
} as const;
export type Relazione = keyof typeof RELAZIONI;

export const BASI = {
  consenso: "Me l'ha chiesto e mi ha dato il suo consenso",
  "genitore-minore": "È mia figlia o mio figlio e ha meno di 18 anni",
  tutela: "Sono tutore, curatore o amministratore di sostegno",
} as const;
export type Base = keyof typeof BASI;

export interface Persona {
  id: string;
  name: string;
  relation: Relazione | "io";
  birthYear: number | null;
  basis: Base | null;
  basisDeclaredAt: string | null;
  createdAt: string | null;
}

export const PersonaInputSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(1, "Scrivi un nome.")
      .max(40, "Al massimo 40 caratteri."),
    relation: z.enum(Object.keys(RELAZIONI) as [Relazione, ...Relazione[]]),
    birthYear: z
      .number()
      .int()
      .min(1900)
      .max(new Date().getFullYear())
      .nullable()
      .optional(),
    basis: z.enum(Object.keys(BASI) as [Base, ...Base[]]),
    declaration: z.literal(true),
  })
  .strict();
export type PersonaInput = z.infer<typeof PersonaInputSchema>;

/** La dichiarazione che la persona conferma, parola per parola: la stessa frase finisce nel registro. */
export const DICHIARAZIONE =
  "Dichiaro di poter gestire i dati sanitari di questa persona per la ragione indicata e di poterlo dimostrare se mi viene chiesto. Se la ragione viene meno, elimino la sua scheda e i suoi documenti.";

export const DELEGA_VERSION = "bozza-2026-11";

export function selfPersona(displayName: string | null): Persona {
  return {
    id: SELF_ID,
    name: displayName?.trim() || "Tu",
    relation: "io",
    birthYear: null,
    basis: null,
    basisDeclaredAt: null,
    createdAt: null,
  };
}

/** «Mamma o papà · 81 anni» oppure «Tu». */
export function personaSubtitle(
  p: Persona,
  year = new Date().getFullYear(),
): string {
  if (p.relation === "io") return "Il tuo profilo";
  const rel = RELAZIONI[p.relation];
  return p.birthYear ? `${rel} · ${year - p.birthYear} anni` : rel;
}

/** Iniziali per il cerchio della persona (massimo due lettere). */
export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  return (
    parts.length === 1
      ? parts[0].slice(0, 2)
      : parts[0][0] + parts[parts.length - 1][0]
  ).toUpperCase();
}

/** Converte l'identificativo dell'interfaccia («io» o un uuid) in quello del database (null per il titolare). */
export function profileIdForDb(id: string | null | undefined): string | null {
  return !id || id === SELF_ID ? null : id;
}
export const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
