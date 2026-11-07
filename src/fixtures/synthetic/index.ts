import { ExtractedDocumentSchema, type ExtractedDocument } from "@/domain/extraction/schema";
import lab001 from "./referto-lab-001.json";

/**
 * Unici documenti accettati dalla modalità demo: fixture sintetiche incluse nel codice.
 * Non esiste alcun percorso per caricare un documento reale in demo.
 */
const FIXTURES: Record<string, ExtractedDocument> = {
  [lab001.documentId]: ExtractedDocumentSchema.parse(lab001),
};

export const DEMO_DOCUMENT_ID = lab001.documentId;

export function getSyntheticDocument(id: string): ExtractedDocument | null {
  const doc = FIXTURES[id];
  if (!doc || !doc.isSynthetic) return null;
  return doc;
}
