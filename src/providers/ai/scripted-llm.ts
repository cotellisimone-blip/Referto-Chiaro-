import type { z } from "zod";
import type { LlmContent, LlmResult, StructuredLlm } from "./llm";

/**
 * Modello finto per test e valutazione: risponde con una funzione scritta a mano.
 * Valida comunque l'output contro lo schema, come farebbe l'API con gli output strutturati.
 */
export type ScriptedReply = unknown | { __fail: "refusal" | "invalid-output" | "truncated" | "api-error" };

export class ScriptedLlm implements StructuredLlm {
  readonly calls: { system: string; text: string }[] = [];
  constructor(
    private readonly reply: (args: { system: string; text: string; call: number }) => ScriptedReply,
    readonly model = "scripted-test-model",
  ) {}

  async generate<S extends z.ZodType>({ system, content, schema }: { system: string; content: LlmContent; schema: S }): Promise<LlmResult<z.infer<S>>> {
    const text = content.map((b) => (b.type === "text" ? b.text : `[${b.type}]`)).join("\n");
    this.calls.push({ system, text });
    const out = this.reply({ system, text, call: this.calls.length });
    const usage = { inputTokens: Math.ceil((system.length + text.length) / 4), outputTokens: Math.ceil(JSON.stringify(out ?? "").length / 4) };
    if (out && typeof out === "object" && "__fail" in out) return { ok: false, reason: (out as { __fail: "refusal" }).__fail, detail: "scripted", usage };
    const parsed = schema.safeParse(out);
    if (!parsed.success) return { ok: false, reason: "invalid-output", detail: parsed.error.message.slice(0, 200), usage };
    return { ok: true, data: parsed.data, usage, model: this.model };
  }
}
