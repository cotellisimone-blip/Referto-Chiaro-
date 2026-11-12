import { describe, expect, it } from "vitest";
import { buildSearchIndex, normalizeQuery, searchIndex } from "@/lib/search-index";

const index = buildSearchIndex();

describe("ricerca del sito", () => {
  it("indicizza guide, glossario e pagine senza testi lunghi", () => {
    expect(index.filter((i) => i.kind === "guida").length).toBeGreaterThanOrEqual(85);
    expect(index.filter((i) => i.kind === "termine").length).toBeGreaterThanOrEqual(100);
    expect(index.some((i) => i.href === "/strumenti/domande-per-il-medico")).toBe(true);
    for (const i of index) expect(i.context.length).toBeLessThanOrEqual(120);
    expect(JSON.stringify(index).length).toBeLessThan(80_000);
  });

  it("una sigla trova prima la guida esatta", () => {
    const r = searchIndex(index, "tsh");
    expect(r[0]?.href).toBe("/guide/tsh");
    expect(searchIndex(index, "emocromo")[0]?.href).toBe("/guide/emocromo");
  });

  it("ignora accenti e maiuscole", () => {
    expect(normalizeQuery("  Glicèmia, a Digiuno! ")).toBe("glicemia a digiuno");
    expect(searchIndex(index, "GLICEMIA")[0]?.href).toContain("glicemia");
  });

  it("niente risultati per query vuota o senza senso", () => {
    expect(searchIndex(index, "   ")).toEqual([]);
    expect(searchIndex(index, "zzqqxx")).toEqual([]);
  });
});
