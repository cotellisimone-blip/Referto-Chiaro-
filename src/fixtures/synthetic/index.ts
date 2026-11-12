import { ExtractedDocumentSchema, type ExtractedDocument } from "@/domain/extraction/schema";
import lab001 from "./referto-lab-001.json";
import emocromo002 from "./referto-emocromo-002.json";
import tiroide003 from "./referto-tiroide-003.json";
import lipidico004 from "./referto-lipidico-004.json";
import epatico005 from "./referto-epatico-005.json";

/**
 * Unici documenti accettati dalla modalità demo: fixture sintetiche incluse nel codice.
 * Non esiste alcun percorso per caricare un documento reale in demo.
 */
const FIXTURES: Record<string, ExtractedDocument> = Object.fromEntries(
  [lab001, emocromo002, tiroide003, lipidico004, epatico005].map((f) => [f.documentId, ExtractedDocumentSchema.parse(f)]),
);

export const DEMO_DOCUMENT_ID = lab001.documentId;

export interface SyntheticSample {
  id: string;
  title: string;
  description: string;
  reportDate: string;
  observationCount: number;
  hasUnreadable: boolean;
}

/** Catalogo dei referti di esempio, per il flusso "nuovo referto" dell'area personale. */
export function listSyntheticSamples(): SyntheticSample[] {
  const desc: Record<string, string> = {
    [lab001.documentId]: "Glicemia, emoglobina glicata, colesterolo, creatinina. Una riga illeggibile.",
    [emocromo002.documentId]: "Emoglobina, globuli rossi e bianchi, piastrine, ferritina.",
    [tiroide003.documentId]: "TSH, FT4, FT3 e un anticorpo coperto da un timbro.",
    [lipidico004.documentId]: "Colesterolo totale, HDL, LDL, trigliceridi e glicemia di maggio: utile per il confronto.",
    [epatico005.documentId]: "Transaminasi, gamma GT, bilirubina, fosfatasi alcalina, albumina.",
  };
  return Object.values(FIXTURES).map((d) => ({
    id: d.documentId,
    title: d.displayTitle.replace(" — esempio sintetico", ""),
    description: desc[d.documentId] ?? "",
    reportDate: d.reportDate,
    observationCount: d.observations.length,
    hasUnreadable: d.observations.some((o) => o.valueRaw === null),
  }));
}

export function getSyntheticDocument(id: string): ExtractedDocument | null {
  const doc = FIXTURES[id];
  if (!doc || !doc.isSynthetic) return null;
  return doc;
}
