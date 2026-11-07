import type { ExtractedDocument } from "@/domain/extraction/schema";
import type { CannotProcess, Explanation } from "@/domain/reporting/explanation-schema";

/** Estrazione già verificata dall'utente: solo le righe confermate. */
export interface VerifiedExtraction {
  document: ExtractedDocument;
  confirmedObservationIds: string[];
}

export interface PolicyVersion {
  id: string;
}

/**
 * Adapter del modulo informativo. L'UI non conosce mai il provider concreto.
 * Implementazioni: DeterministicDemoExplanationProvider (nessuna API esterna);
 * in futuro un provider LLM, sempre dietro ENABLE_AI_PROCESSING + approvazione compliance.
 */
export interface ExplanationProvider {
  readonly id: string;
  explain(input: VerifiedExtraction, policy: PolicyVersion): Promise<Explanation | CannotProcess>;
}
