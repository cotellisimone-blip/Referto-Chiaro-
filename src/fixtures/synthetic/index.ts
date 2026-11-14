import { ExtractedDocumentSchema, type ExtractedDocument } from "@/domain/extraction/schema";
import lab001 from "./referto-lab-001.json";
import emocromo002 from "./referto-emocromo-002.json";
import tiroide003 from "./referto-tiroide-003.json";
import lipidico004 from "./referto-lipidico-004.json";
import epatico005 from "./referto-epatico-005.json";
import storicoIo2023 from "./storico/storico-io-2023.json";
import storicoIo2024 from "./storico/storico-io-2024.json";
import storicoIo2025 from "./storico/storico-io-2025.json";
import storicoLucia202503 from "./storico/storico-lucia-2025-03.json";
import storicoLucia202509 from "./storico/storico-lucia-2025-09.json";
import storicoLucia202603 from "./storico/storico-lucia-2026-03.json";
import storicoLucia202609 from "./storico/storico-lucia-2026-09.json";

/**
 * Unici documenti accettati dalla modalità demo: fixture sintetiche incluse nel codice.
 * Non esiste alcun percorso per caricare un documento reale in demo.
 */
const FIXTURES: Record<string, ExtractedDocument> = Object.fromEntries(
  [lab001, emocromo002, tiroide003, lipidico004, epatico005].map((f) => [f.documentId, ExtractedDocumentSchema.parse(f)]),
);

/**
 * «Storico di esempio» (salute nel tempo e famiglia, 13/11/2026): referti inventati di anni precedenti,
 * per la persona di esempio e per un familiare di esempio («Lucia»). Non compaiono nel catalogo dei referti
 * da scegliere: entrano solo con «Carica lo storico di esempio», già nell'area giusta della famiglia.
 */
const HISTORY: Record<string, ExtractedDocument> = Object.fromEntries(
  [storicoIo2023, storicoIo2024, storicoIo2025, storicoLucia202503, storicoLucia202509, storicoLucia202603, storicoLucia202609].map((f) => [f.documentId, ExtractedDocumentSchema.parse(f)]),
);

/** Lo storico di esempio: per ogni referto, a chi appartiene («io» = titolare dell'account, «lucia» = familiare di esempio). */
export const DEMO_HISTORY: { sampleId: string; owner: "io" | "lucia"; title: string }[] = Object.values(HISTORY).map((d) => ({
  sampleId: d.documentId,
  owner: d.documentId.includes("-lucia-") ? "lucia" : "io",
  title: d.displayTitle.replace(" — esempio sintetico", ""),
}));

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
  const doc = FIXTURES[id] ?? HISTORY[id];
  if (!doc || !doc.isSynthetic) return null;
  return doc;
}
