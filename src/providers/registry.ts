import { CapabilityDisabledError, requireCapability, type Flags } from "@/lib/feature-flags";
import type { UploadProvider } from "./upload/types";
import type { OcrProvider } from "./ocr/types";
import type { AiExplanationProvider } from "./ai/types";
import { DeterministicDemoExplanationProvider } from "./explanation/deterministic-demo";
import type { ExplanationProvider } from "./explanation/types";

/**
 * Registro degli adattatori. Ogni adattatore "reale" esiste solo come interfaccia:
 * la funzione che lo restituisce chiama prima `requireCapability`, quindi in demo
 * (e senza approvazione compliance) lancia CapabilityDisabledError. Non c'è modo di
 * ottenere un provider reale aggirando i gate.
 */
export function getUploadProvider(flags?: Flags): UploadProvider {
  requireCapability("realUploads", flags);
  throw new CapabilityDisabledError("realUploads", "feature-disabled"); // nessuna implementazione reale ancora registrata
}

export function getOcrProvider(flags?: Flags): OcrProvider {
  requireCapability("realUploads", flags);
  throw new CapabilityDisabledError("realUploads", "feature-disabled");
}

export function getAiProvider(flags?: Flags): AiExplanationProvider {
  requireCapability("aiProcessing", flags);
  throw new CapabilityDisabledError("aiProcessing", "feature-disabled");
}

/** Il provider usato dalla pipeline: deterministico finché l'AI non è abilitata e approvata. */
export function getExplanationProvider(flags?: Flags): ExplanationProvider {
  try {
    return getAiProvider(flags);
  } catch (e) {
    if (e instanceof CapabilityDisabledError) return new DeterministicDemoExplanationProvider();
    throw e;
  }
}
