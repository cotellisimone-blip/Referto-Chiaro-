import { describe, expect, it } from "vitest";
import { cheCose, NOMI_PLURALI } from "@/lib/italiano";
import { GLOSSARY } from "@/content/glossario";
import { INTEGRATORI } from "@/content/integratori";

describe("«che cos'è» e «che cosa sono»", () => {
  it("al plurale usa «che cosa sono»", () => {
    expect(cheCose("Trigliceridi")).toBe("che cosa sono");
    expect(cheCose("Probiotici")).toBe("che cosa sono");
    expect(cheCose("Ferritina")).toBe("che cos'è");
    expect(cheCose("Emolisi")).toBe("che cos'è");
  });
  it("ogni nome dell'elenco esiste nel glossario o tra gli integratori", () => {
    const nomi = new Set([...GLOSSARY.map((e) => e.term), ...INTEGRATORI.map((i) => i.name)]);
    for (const n of NOMI_PLURALI) expect(nomi.has(n), n).toBe(true);
  });
});
