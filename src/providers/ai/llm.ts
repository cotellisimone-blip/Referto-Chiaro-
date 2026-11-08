import Anthropic from "@anthropic-ai/sdk";
import { betaZodOutputFormat } from "@anthropic-ai/sdk/helpers/beta/zod";
import type { z } from "zod";
import { readAiConfig, type AiConfig } from "./config";

/**
 * Unico punto di contatto con l'API di Claude. Tutto il resto del codice parla con `StructuredLlm`,
 * così i test e la valutazione possono sostituirlo con un modello finto deterministico.
 */
export type LlmContent = Anthropic.Beta.BetaContentBlockParam[];

export interface LlmUsage {
  inputTokens: number;
  outputTokens: number;
}

export type LlmResult<T> =
  | { ok: true; data: T; usage: LlmUsage; model: string }
  | { ok: false; reason: "refusal" | "invalid-output" | "truncated" | "api-error"; detail: string; usage?: LlmUsage };

export interface StructuredLlm {
  readonly model: string;
  generate<S extends z.ZodType>(args: { system: string; content: LlmContent; schema: S; maxTokens?: number }): Promise<LlmResult<z.infer<S>>>;
}

export class ClaudeStructuredLlm implements StructuredLlm {
  readonly model: string;
  constructor(
    private readonly client: Anthropic,
    private readonly config: AiConfig = readAiConfig(),
  ) {
    this.model = config.model;
  }

  async generate<S extends z.ZodType>({ system, content, schema, maxTokens = 16000 }: { system: string; content: LlmContent; schema: S; maxTokens?: number }): Promise<LlmResult<z.infer<S>>> {
    try {
      const response = await this.client.beta.messages.parse({
        model: this.config.model,
        max_tokens: maxTokens,
        // Se il modello principale declina per una regola di sicurezza, l'API riprova sul modello di riserva
        // scelto dal server, nella stessa chiamata.
        betas: ["server-side-fallback-2026-07-01"],
        fallbacks: "default",
        output_config: { effort: this.config.effort, format: betaZodOutputFormat(schema) },
        ...(this.config.inferenceGeo ? { inference_geo: this.config.inferenceGeo } : {}),
        system,
        messages: [{ role: "user", content }],
      });
      const usage = { inputTokens: response.usage.input_tokens, outputTokens: response.usage.output_tokens };
      if (response.stop_reason === "refusal") return { ok: false, reason: "refusal", detail: response.stop_details?.category ?? "refusal", usage };
      if (response.stop_reason === "max_tokens") return { ok: false, reason: "truncated", detail: "Risposta troncata.", usage };
      if (response.parsed_output == null) return { ok: false, reason: "invalid-output", detail: "Output non conforme allo schema.", usage };
      return { ok: true, data: response.parsed_output as z.infer<S>, usage, model: response.model };
    } catch (e) {
      if (e instanceof Anthropic.APIError) return { ok: false, reason: "api-error", detail: `HTTP ${e.status ?? "?"}` };
      return { ok: false, reason: "invalid-output", detail: e instanceof Error ? e.message.slice(0, 200) : "errore" };
    }
  }
}
