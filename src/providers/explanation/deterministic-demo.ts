import { isReadable } from "@/domain/extraction/schema";
import { parseLocaleNumber } from "@/domain/extraction/numbers";
import { describeRangePosition, parseReferenceRange, positionInPrintedRange } from "@/domain/extraction/reference";
import { findGlossaryEntry } from "@/domain/reporting/glossary";
import type { CannotProcess, Explanation, ExplanationItem } from "@/domain/reporting/explanation-schema";
import type { ExplanationProvider, PolicyVersion, VerifiedExtraction } from "./types";

/**
 * Provider deterministico per la demo: non chiama alcuna API esterna.
 * Usa esclusivamente le osservazioni confermate e il glossario interno.
 */
export class DeterministicDemoExplanationProvider implements ExplanationProvider {
  readonly id = "deterministic-demo-v1";

  async explain(input: VerifiedExtraction, policy: PolicyVersion): Promise<Explanation | CannotProcess> {
    const { document, confirmedObservationIds } = input;
    if (!document.isSynthetic) {
      return { error: "cannot_process", reason: "Il provider demo accetta solo documenti sintetici." };
    }
    const confirmed = new Set(confirmedObservationIds);
    const items: ExplanationItem[] = [];
    const excluded: Explanation["excludedObservations"] = [];

    for (const o of document.observations) {
      if (!confirmed.has(o.id)) {
        excluded.push({ id: o.id, nameExact: o.nameRaw, reason: "Non confermato durante il controllo dei valori." });
        continue;
      }
      if (!isReadable(o) || o.valueRaw === null) {
        excluded.push({ id: o.id, nameExact: o.nameRaw, reason: "Valore non leggibile con sufficiente affidabilità." });
        continue;
      }
      const entry = findGlossaryEntry(o.nameRaw);
      if (!entry) {
        excluded.push({ id: o.id, nameExact: o.nameRaw, reason: "Termine non presente nel glossario revisionabile." });
        continue;
      }
      const num = parseLocaleNumber(o.valueRaw);
      const pos = positionInPrintedRange(num.ok ? num.value : null, parseReferenceRange(o.referenceRaw));
      items.push({
        sourceObservationId: o.id,
        nameExact: o.nameRaw,
        originalValueExact: o.valueRaw,
        originalUnitExact: o.unitRaw,
        originalReferenceExact: o.referenceRaw,
        plainLanguageDefinition: entry.definition,
        printedRangeNote: describeRangePosition(pos),
        sourceCitation: { page: o.sourcePage, line: o.sourceLine, excerpt: o.sourceTextExact },
        interpretationType: "general-term-definition",
        limits: "Il significato per la singola persona va discusso con il medico.",
      });
    }

    if (items.length === 0) {
      return { error: "cannot_process", reason: "Nessun valore confermato e leggibile da spiegare." };
    }

    return {
      schemaVersion: "1.0",
      sourceDocumentId: document.documentId,
      sourceVerified: true,
      summary: `Questo documento riporta ${items.length === 1 ? "un valore" : `${items.length} valori`} di laboratorio che hai confermato. Qui trovi i numeri esattamente come sono stampati e una spiegazione generale dei termini. Il riepilogo non valuta la tua situazione clinica.`,
      items,
      excludedObservations: excluded,
      questionsForDoctor: [
        "Quali informazioni sulla mia storia e sul mio stato di salute servono per leggere correttamente questi risultati?",
        "Ci sono valori che secondo lei è utile approfondire o confrontare con esami precedenti?",
        ...(items.some((i) => !i.printedRangeNote.startsWith("Il numero riportato rientra"))
          ? ["Alcuni numeri sono fuori dall'intervallo stampato: che cosa significa nel mio caso, se significa qualcosa?"]
          : []),
        "C'è qualcosa che dovrei chiarire o portare alla prossima visita?",
      ],
      limitations: [
        "Spiegazione informativa e non clinica: non sostituisce la diagnosi o le indicazioni del medico.",
        "Gli intervalli sono quelli stampati dal laboratorio sul documento e non sono valori universali.",
        "In caso di urgenza non usare questo servizio: in Italia chiama il 112.",
      ],
      modelAndPromptVersion: `${this.id}+${policy.id}`,
    };
  }
}
