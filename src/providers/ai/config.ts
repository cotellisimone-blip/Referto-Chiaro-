import Anthropic from "@anthropic-ai/sdk";

type Env = Record<string, string | undefined>;
export type Effort = "low" | "medium" | "high" | "xhigh" | "max";

export interface AiConfig {
  model: string;
  effort: Effort;
  /** Regione di inferenza (es. "eu" se disponibile per l'account); vuoto = default dell'area di lavoro. */
  inferenceGeo?: string;
}

/**
 * Configurazione del modello. Default: Claude Opus 5.5 (qualità massima sul linguaggio prudente).
 * Per contenere i costi si può impostare AI_MODEL=claude-sonnet-5-5 dopo aver ripetuto la valutazione
 * (npm run eval:ai) e verificato che le metriche restino sopra le soglie.
 */
export function readAiConfig(env: Env = process.env): AiConfig {
  const effort = (env.AI_EFFORT?.trim() as Effort) || "medium";
  return {
    model: env.AI_MODEL?.trim() || "claude-opus-5-5",
    effort: ["low", "medium", "high", "xhigh", "max"].includes(effort) ? effort : "medium",
    inferenceGeo: env.AI_INFERENCE_GEO?.trim() || undefined,
  };
}

export class AiNotConfiguredError extends Error {
  constructor() {
    super("ANTHROPIC_API_KEY non configurata.");
  }
}

export function createAnthropicClient(env: Env = process.env): Anthropic {
  const apiKey = env.ANTHROPIC_API_KEY?.trim();
  if (!apiKey) throw new AiNotConfiguredError();
  return new Anthropic({ apiKey, timeout: 120_000, maxRetries: 2 });
}
