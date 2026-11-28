import { z } from "zod";

/** Contratto di output del modulo informativo (AI reale o mock deterministico). */
export const ExplanationItemSchema = z.object({
  sourceObservationId: z.string(),
  nameExact: z.string(),
  originalValueExact: z.string(),
  originalUnitExact: z.string().nullable(),
  originalReferenceExact: z.string().nullable(),
  plainLanguageDefinition: z.string().min(1),
  /** Frase neutra sulla posizione rispetto all'intervallo stampato. Mai un giudizio clinico. */
  printedRangeNote: z.string(),
  sourceCitation: z.object({ page: z.number().int().positive(), line: z.number().int().positive(), excerpt: z.string() }),
  interpretationType: z.literal("general-term-definition"),
  limits: z.string(),
});
export type ExplanationItem = z.infer<typeof ExplanationItemSchema>;

export const ExplanationSchema = z.object({
  schemaVersion: z.literal("1.0"),
  sourceDocumentId: z.string(),
  sourceVerified: z.literal(true),
  summary: z.string(),
  items: z.array(ExplanationItemSchema).min(1),
  excludedObservations: z.array(z.object({ id: z.string(), nameExact: z.string(), reason: z.string() })),
  questionsForDoctor: z.array(z.string()).min(1),
  limitations: z.array(z.string()).min(1),
  modelAndPromptVersion: z.string(),
});
export type Explanation = z.infer<typeof ExplanationSchema>;

export type CannotProcess = { error: "cannot_process"; reason: string };
