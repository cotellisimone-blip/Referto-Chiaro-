import { z } from "zod";

/** Una riga del referto, estratta fedelmente. Nessuno stato clinico inferito. */
export const ObservationSchema = z.object({
  id: z.string().min(1),
  nameRaw: z.string().min(1),
  /** Valore esattamente come stampato. null = non leggibile. */
  valueRaw: z.string().nullable(),
  unitRaw: z.string().nullable(),
  referenceRaw: z.string().nullable(),
  methodRaw: z.string().nullable().optional(),
  sourcePage: z.number().int().positive(),
  sourceLine: z.number().int().positive(),
  sourceTextExact: z.string().min(1),
  /** Qualità della LETTURA, non probabilità clinica. */
  parseConfidence: z.enum(["high", "medium", "low"]),
  warnings: z.array(z.string()).default([]),
});
export type Observation = z.infer<typeof ObservationSchema>;

export const ExtractedDocumentSchema = z.object({
  schemaVersion: z.literal("1.0"),
  documentId: z.string(),
  documentKind: z.literal("laboratory-text-report"),
  isSynthetic: z.boolean(),
  language: z.literal("it"),
  displayTitle: z.string(),
  laboratoryName: z.string(),
  patientLabel: z.string(),
  reportDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  pageCount: z.number().int().positive(),
  extractionVersion: z.string(),
  /** Righe del documento sorgente (per citazioni e facsimile). */
  sourceLines: z.array(
    z.object({ page: z.number().int().positive(), line: z.number().int().positive(), text: z.string() }),
  ),
  observations: z.array(ObservationSchema).min(1),
  notice: z.string(),
});
export type ExtractedDocument = z.infer<typeof ExtractedDocumentSchema>;

/** Esito della verifica utente: quali righe ha confermato. */
export const VerificationSchema = z.object({
  documentId: z.string(),
  confirmedObservationIds: z.array(z.string()).min(1).max(50),
});
export type Verification = z.infer<typeof VerificationSchema>;

export function isReadable(o: Observation): boolean {
  return o.valueRaw !== null && o.parseConfidence !== "low";
}
