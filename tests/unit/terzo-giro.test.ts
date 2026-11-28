import { describe, expect, it } from "vitest";
import { autoTitle, cleanTitle, dropTwins, findOlderTwin, fingerprint, longDate, uploadedTitle } from "@/domain/pipeline/titolo";
import { EXAM_GUIDE_COUNT, GUIDES, PRACTICAL_GUIDE_COUNT } from "@/content/guides";
import { GLOSSARY } from "@/content/glossario";

const doc = (id: string, createdAt: string, date: string, rows: [string, string, string][]) => ({
  id,
  createdAt,
  profileId: null,
  verification: null,
  extracted: { reportDate: date, observations: rows.map(([nameRaw, valueRaw, unitRaw]) => ({ nameRaw, valueRaw, unitRaw })) } as unknown as Parameters<typeof fingerprint>[0],
});

describe("terzo giro · nome dei referti (punto 3)", () => {
  it("scrive la data per esteso", () => {
    expect(longDate("2026-11-04")).toBe("4 novembre 2026");
    expect(longDate("non una data")).toBe("");
  });
  it("il nome viene dal tipo e dalla data, mai dal file", () => {
    expect(autoTitle("Referto di laboratorio", "2026-11-04")).toBe("Referto di laboratorio del 4 novembre 2026");
    expect(autoTitle("", "2026-09-12")).toBe("Esami del 12 settembre 2026");
    expect(autoTitle("Esami", "")).toBe("Esami");
  });
  it("senza una data sul documento non ne inventa una", () => {
    expect(uploadedTitle("2026-11-18")).toBe("Esami caricati il 18 novembre 2026");
  });
  it("pulisce il nome scelto dalla persona", () => {
    expect(cleanTitle("  Esami   della mamma \n")).toBe("Esami della mamma");
    expect(cleanTitle("")).toBeNull();
    expect((cleanTitle("x".repeat(200)) ?? "").length).toBeLessThanOrEqual(80);
  });
});

describe("terzo giro · stesso referto due volte (punto 4)", () => {
  const a = doc("a", "2026-11-10T10:00:00Z", "2026-11-04", [["Colesterolo LDL", "134", "mg/dL"], ["Glicemia", "92", "mg/dL"]]);
  const b = doc("b", "2026-11-12T10:00:00Z", "2026-11-04", [["Glicemia", "92", "mg/dL"], ["colesterolo ldl", "134", "mg/dL"]]);
  const c = doc("c", "2026-11-13T10:00:00Z", "2026-11-04", [["Colesterolo LDL", "128", "mg/dL"], ["Glicemia", "92", "mg/dL"]]);
  it("riconosce lo stesso referto anche con le righe in un altro ordine", () => {
    expect(fingerprint(a.extracted)).toBe(fingerprint(b.extracted));
    expect(fingerprint(a.extracted)).not.toBe(fingerprint(c.extracted));
  });
  it("indica il più vecchio come originale e non conta due volte", () => {
    expect(findOlderTwin(b, [a, b, c])?.id).toBe("a");
    expect(findOlderTwin(a, [a, b, c])).toBeNull();
    expect(dropTwins([a, b, c]).map((d) => d.id)).toEqual(["a", "c"]);
  });
});

describe("terzo giro · numeri e unità (punto 8)", () => {
  it("«N esami» non conta le guide pratiche", () => {
    expect(EXAM_GUIDE_COUNT + PRACTICAL_GUIDE_COUNT).toBe(GUIDES.length);
    expect(PRACTICAL_GUIDE_COUNT).toBe(GUIDES.filter((g) => g.practical).length);
  });
  it("nessuna unità scritta con l'accento circonflesso, tranne dove lo si spiega", () => {
    const testo = JSON.stringify(GUIDES) + JSON.stringify(GLOSSARY.filter((e) => e.slug !== "cellule-per-microlitro"));
    expect(testo.includes("10^")).toBe(false);
  });
});
