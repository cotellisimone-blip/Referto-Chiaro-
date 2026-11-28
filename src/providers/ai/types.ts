import type { ExplanationProvider } from "@/providers/explanation/types";

/** Un provider AI è un ExplanationProvider con tracciabilità di modello e prompt. */
export interface AiExplanationProvider extends ExplanationProvider {
  readonly modelId: string;
  readonly promptVersion: string;
}
