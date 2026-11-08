import { isCapabilityEnabled, requireCapability, readFlags, type Flags } from "@/lib/feature-flags";
import { fileKey } from "@/lib/crypto/file-box";
import { ClaudeExplanationProvider } from "./ai/claude-explanation";
import { createAnthropicClient, readAiConfig } from "./ai/config";
import { ClaudeStructuredLlm, type StructuredLlm } from "./ai/llm";
import { DeterministicDemoExplanationProvider } from "./explanation/deterministic-demo";
import type { ExplanationProvider } from "./explanation/types";
import { DocumentReader } from "./ocr/reader";
import type { OcrProvider } from "./ocr/types";

type Env = Record<string, string | undefined>;

/**
 * Registro degli adattatori. Ogni adattatore «reale» passa da `requireCapability`: in demo, senza
 * approvazione compliance o con il gate spento lancia CapabilityDisabledError. Non c'è modo di ottenere
 * un provider reale aggirando i gate.
 *
 * - Caricamento file: gate realUploads + FILE_ENCRYPTION_KEY valida (nessun file in chiaro, mai).
 * - Lettura: PDF digitali senza AI sempre (con realUploads); foto/scansioni e strutturazione AI solo con aiProcessing.
 * - Spiegazione: Claude con aiProcessing + ANTHROPIC_API_KEY; altrimenti glossario deterministico.
 */
export function assertUploadsReady(flags: Flags = readFlags(), env: Env = process.env): void {
  requireCapability("realUploads", flags);
  fileKey(env); // lancia FileKeyMissingError
}

/** Modello linguistico, solo se il gate AI è aperto. Le chiamate di test possono iniettarne uno finto. */
export function getLlm(flags: Flags = readFlags(), env: Env = process.env): StructuredLlm | null {
  if (!isCapabilityEnabled("aiProcessing", flags)) return null;
  return new ClaudeStructuredLlm(createAnthropicClient(env), readAiConfig(env));
}

export function getOcrProvider(flags: Flags = readFlags(), env: Env = process.env): OcrProvider {
  requireCapability("realUploads", flags);
  return new DocumentReader({ llm: getLlm(flags, env) });
}

/** Il provider usato dalla pipeline per un documento. */
export function getExplanationProvider(opts: { realDocument?: boolean } = {}, flags: Flags = readFlags(), env: Env = process.env): ExplanationProvider {
  const llm = getLlm(flags, env);
  if (llm) return new ClaudeExplanationProvider(llm);
  return new DeterministicDemoExplanationProvider({ allowRealDocuments: Boolean(opts.realDocument) && isCapabilityEnabled("realUploads", flags) });
}
