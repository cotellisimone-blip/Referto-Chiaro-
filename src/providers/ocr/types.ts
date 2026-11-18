import type { ExtractedDocument } from "@/domain/extraction/schema";
import type { AllowedMime } from "@/providers/upload/validate";
import type { LlmUsage } from "@/providers/ai/llm";

export interface OcrInput {
  documentId: string;
  bytes: Uint8Array;
  mimeType: AllowedMime;
  title: string;
}

export interface OcrTrace {
  method: "pdf-text" | "vision";
  structuring: "ai" | "heuristic";
  usage: LlmUsage;
  droppedObservations: number;
  /** false quando sul documento non c'era una data leggibile e reportDate è il giorno del caricamento. */
  reportDateFound?: boolean;
  model?: string;
}

export type OcrOutcome = { ok: true; document: ExtractedDocument; trace: OcrTrace } | { ok: false; reason: string; trace?: Partial<OcrTrace> };

/** Adattatore di lettura (testo/OCR + estrazione strutturata) di un file reale. */
export interface OcrProvider {
  readonly id: string;
  extract(input: OcrInput): Promise<OcrOutcome>;
}
