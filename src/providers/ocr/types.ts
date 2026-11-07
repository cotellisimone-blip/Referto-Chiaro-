import type { ExtractedDocument } from "@/domain/extraction/schema";

/** Adattatore di lettura (OCR + estrazione strutturata) di un file reale. */
export interface OcrProvider {
  readonly id: string;
  extract(fileId: string): Promise<ExtractedDocument>;
}
