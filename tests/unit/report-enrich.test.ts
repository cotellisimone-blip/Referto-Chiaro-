import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import { enrichReport, guideForExam } from "@/domain/reporting/enrich";
import type { ExtractedDocument } from "@/domain/extraction/schema";
import type { Explanation } from "@/domain/reporting/explanation-schema";

const names = readdirSync("src/fixtures/synthetic")
  .filter((f) => f.endsWith(".json"))
  .flatMap((f) => (JSON.parse(readFileSync(`src/fixtures/synthetic/${f}`, "utf8")) as ExtractedDocument).observations.map((o) => o.nameRaw));

describe("report Capisci: arricchimenti senza testo nuovo", () => {
  it("riconosce la guida giusta per gli esami dei referti di esempio", () => {
    expect(guideForExam("TSH")?.slug).toBeTruthy();
    expect(guideForExam("Emoglobina glicata (HbA1c)")?.examName).toMatch(/glicata/i);
    expect(guideForExam("Ferritina")?.examName).toBe("Ferritina");
    const matched = names.filter((n) => guideForExam(n));
    expect(matched.length / names.length).toBeGreaterThan(0.75);
  });

  it("nessuna guida inventata per un nome sconosciuto", () => {
    expect(guideForExam("Parametro inesistente XYZ")).toBeNull();
  });

  const doc = (id: string, date: string, value: string, unit: string): ExtractedDocument =>
    ({ documentId: id, reportDate: date, observations: [{ id: `${id}-o1`, nameRaw: "Ferritina", valueRaw: value, unitRaw: unit, referenceRaw: "30 - 400", parseConfidence: "high" }] }) as unknown as ExtractedDocument;
  const expl = (id: string, value: string, unit: string): Explanation =>
    ({ items: [{ sourceObservationId: `${id}-o1`, nameExact: "Ferritina", originalValueExact: value, originalUnitExact: unit }] }) as unknown as Explanation;

  it("confronto storico solo con stessa unità, valore confermato e referto precedente", () => {
    const cur = doc("c", "2026-10-01", "45", "ng/mL");
    const prev = [
      { document: doc("a", "2026-03-01", "38", "ng/mL"), confirmedObservationIds: ["a-o1"] },
      { document: doc("b", "2026-05-01", "40", "µg/L"), confirmedObservationIds: ["b-o1"] }, // unità diversa
      { document: doc("d", "2026-06-01", "41", "ng/mL"), confirmedObservationIds: [] }, // non confermato
      { document: doc("e", "2026-12-01", "50", "ng/mL"), confirmedObservationIds: ["e-o1"] }, // successivo
    ];
    const r = enrichReport({ current: cur, explanation: expl("c", "45", "ng/mL"), previous: prev });
    expect(r.history["c-o1"]).toEqual([{ documentId: "a", reportDate: "2026-03-01", valueExact: "38", unitExact: "ng/mL", referenceExact: "30 - 400" }]);
    expect(r.factors["c-o1"].factors.length).toBeGreaterThanOrEqual(3);
  });
});
