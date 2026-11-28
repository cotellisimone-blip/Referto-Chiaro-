import { z } from "zod";

/**
 * Glossario pubblico: definizioni GENERALI di termini di laboratorio, in italiano comune.
 * Distinto dal glossario interno usato per le spiegazioni dei report (src/domain/reporting/glossary.ts),
 * che resta la fonte per i testi generati. Bozze da revisione medica.
 */
export const GLOSSARY_LETTERS = ["a-c", "d-g", "h-m", "n-r", "s-z"] as const;

export const GlossaryEntrySchema = z
  .object({
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    term: z.string().min(2).max(60),
    aliases: z.array(z.string().min(1).max(60)).max(8),
    definition: z.string().min(60).max(420),
    inDetail: z.array(z.string().min(40).max(700)).max(3),
    relatedGuides: z.array(z.string()).max(4),
    relatedTerms: z.array(z.string()).max(6),
  })
  .strict();

export type GlossaryEntry = z.infer<typeof GlossaryEntrySchema>;
