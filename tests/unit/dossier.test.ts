import { describe, expect, it } from "vitest";
import { buildDossier, normalizeName } from "@/domain/dossier/build-dossier";
import { buildDemoReport } from "@/domain/reporting/demo-report-service";
import { getSyntheticDocument } from "@/fixtures/synthetic";

async function item(id: string) {
  const doc = getSyntheticDocument(id)!;
  const r = await buildDemoReport(id, doc.observations.map((o) => o.id));
  if (!r.ok) throw new Error(r.message);
  return { document: doc, explanation: r.explanation };
}

describe("dossier Completo", () => {
  it("confronta solo esami con stesso nome e stessa unità, in ordine di data", async () => {
    const d = buildDossier({ title: "Test", items: [await item("demo-referto-lab-001"), await item("demo-referto-lipidico-004")], generatedAt: "2026-11-07T00:00:00Z" });
    expect(d.entries.map((e) => e.reportDate)).toEqual(["2026-05-20", "2026-11-04"]);
    const names = d.comparisons.map((c) => c.nameExact).sort();
    expect(names).toEqual(["Colesterolo LDL", "Colesterolo totale", "Glicemia"]);
    const ldl = d.comparisons.find((c) => c.nameExact === "Colesterolo LDL")!;
    expect(ldl.points.map((p) => p.valueExact)).toEqual(["118", "134"]);
    expect(ldl.deltaText).toContain("+16 mg/dL");
    expect(ldl.deltaText).not.toMatch(/alto|basso|peggior|miglior|normale/i);
    // Trigliceridi: illeggibile in lab-001 → non confrontabile
    expect(d.notComparable.map((n) => n.nameExact)).toContain("Trigliceridi");
  });

  it("non confronta esami presenti in un solo referto", async () => {
    const d = buildDossier({ title: "Test", items: [await item("demo-referto-emocromo-002"), await item("demo-referto-tiroide-003")], generatedAt: "2026-11-07T00:00:00Z" });
    expect(d.comparisons).toEqual([]);
  });

  it("normalizza i nomi ignorando parentesi e maiuscole", () => {
    expect(normalizeName("Emoglobina glicata (HbA1c)")).toBe("emoglobina glicata");
    expect(normalizeName("COLESTEROLO LDL")).toBe("colesterolo ldl");
  });
});
