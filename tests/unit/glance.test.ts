import { describe, expect, it } from "vitest";
import { PDFDocument } from "pdf-lib";
import { extractText } from "unpdf";
import { itemGlance, outOfRangeQuestions, reportGlance } from "@/domain/reporting/glance";
import { buildDemoReport } from "@/domain/reporting/demo-report-service";
import { renderReportPdf } from "@/domain/reporting/pdf";
import { checkAiLanguage } from "@/domain/safety/language";
import { DEMO_DOCUMENT_ID, getSyntheticDocument, listSyntheticSamples } from "@/fixtures/synthetic";

const it0 = (value: string, reference: string | null, name = "Esame") => ({ nameExact: name, originalValueExact: value, originalReferenceExact: reference });

describe("colpo d'occhio: posizione rispetto all'intervallo stampato (ciclo 5)", () => {
  it("dentro, sopra, sotto e non confrontabile, con le parole giuste", () => {
    expect(itemGlance(it0("92", "70 - 99")).label).toBe("Dentro l'intervallo stampato");
    expect(itemGlance(it0("134", "< 115")).short).toBe("Sopra");
    expect(itemGlance(it0("3,1", "4,0 - 5,6")).short).toBe("Sotto");
    expect(itemGlance(it0("38", "> 40")).short).toBe("Sotto");
    expect(itemGlance(it0("negativo", "assente")).position).toBe("not-comparable");
    expect(itemGlance(it0("1.234", "70 - 99")).position).toBe("not-comparable"); // numero ambiguo: non si indovina
    expect(itemGlance(it0("92", null)).bar).toBeNull();
  });

  it("la barra mette il punto dal lato giusto del limite e sempre dentro la barra", () => {
    const cases: [string, string][] = [
      ["92", "70 - 99"],
      ["70", "70 - 99"],
      ["99", "70 - 99"],
      ["9999", "70 - 99"],
      ["0", "70 - 99"],
      ["134", "< 115"],
      ["114", "< 115"],
      ["115", "< 115"],
      ["900", "< 115"],
      ["38", "> 40"],
      ["41", "> 40"],
      ["4000", "> 40"],
    ];
    for (const [v, r] of cases) {
      const g = itemGlance(it0(v, r));
      const b = g.bar!;
      expect(b, `${v} / ${r}`).not.toBeNull();
      expect(b.marker).toBeGreaterThanOrEqual(5);
      expect(b.marker).toBeLessThanOrEqual(95);
      if (g.position === "inside") expect(b.marker > b.bandStart && b.marker < b.bandEnd, `${v} / ${r} dentro`).toBe(true);
      if (g.position === "above-range") expect(b.marker, `${v} / ${r} sopra`).toBeGreaterThan(b.bandEnd);
      if (g.position === "below-range") expect(b.marker, `${v} / ${r} sotto`).toBeLessThan(b.bandStart);
    }
  });

  it("le etichette dei limiti sono quelle stampate, non riformattate", () => {
    expect(itemGlance(it0("0,89", "0,70 - 1,20")).bar!.ticks.map((t) => t.text)).toEqual(["0,70", "1,20"]);
    expect(itemGlance(it0("134", "< 115")).bar!.ticks.map((t) => t.text)).toEqual(["115"]);
  });

  it("referto di esempio: 4 dentro e 1 sopra, con il valore fuori intervallo per primo", async () => {
    const ids = getSyntheticDocument(DEMO_DOCUMENT_ID)!.observations.map((o) => o.id);
    const r = await buildDemoReport(DEMO_DOCUMENT_ID, ids);
    if (!r.ok) throw new Error(r.message);
    const g = reportGlance(r.explanation);
    expect([g.total, g.inside, g.above, g.below, g.notComparable]).toEqual([5, 4, 1, 0, 0]);
    expect(g.sentence).toBe("4 dentro l'intervallo stampato, 1 sopra.");
    expect(g.ordered[0].item.nameExact).toBe("Colesterolo LDL");
    // Gli altri restano nell'ordine del referto.
    expect(g.ordered.slice(1).map((x) => x.item.nameExact)).toEqual(r.explanation.items.filter((i) => i.nameExact !== "Colesterolo LDL").map((i) => i.nameExact));
    // La domanda per il medico nomina l'esame ed è la prima.
    expect(r.explanation.questionsForDoctor[0]).toMatch(/^Colesterolo LDL: il numero è sopra l'intervallo stampato dal laboratorio\./);
  });

  it("le domande sui valori fuori intervallo restano domande, senza linguaggio clinico", () => {
    const qs = outOfRangeQuestions([it0("134", "< 115", "Colesterolo LDL"), it0("250", "< 200", "Colesterolo totale"), it0("3,1", "4,0 - 5,6", "Potassio"), it0("92", "70 - 99", "Glicemia")]);
    expect(qs).toHaveLength(2);
    expect(qs[0]).toContain("Colesterolo LDL e Colesterolo totale: i numeri sono sopra");
    expect(qs[1]).toContain("Potassio: il numero è sotto");
    for (const q of qs) {
      expect(q.trim().endsWith("?")).toBe(true);
      expect(checkAiLanguage(q)).toEqual([]);
    }
    expect(outOfRangeQuestions([it0("92", "70 - 99")])).toEqual([]);
    // Con molti valori dallo stesso lato la domanda non diventa un elenco.
    const many = outOfRangeQuestions(["A", "B", "C", "D"].map((n) => it0("300", "< 200", n)));
    expect(many).toEqual(["Più valori sono sopra l'intervallo stampato dal laboratorio: che cosa significa nel mio caso, se significa qualcosa?"]);
  });

  it("i testi del colpo d'occhio passano il controllo del linguaggio per tutti i referti di esempio", async () => {
    for (const s of listSyntheticSamples()) {
      const ids = getSyntheticDocument(s.id)!.observations.map((o) => o.id);
      const r = await buildDemoReport(s.id, ids);
      if (!r.ok) throw new Error(`${s.id}: ${r.message}`);
      const g = reportGlance(r.explanation);
      expect(g.inside + g.above + g.below + g.notComparable).toBe(g.total);
      for (const t of [g.sentence, ...g.ordered.map((x) => x.glance.label), ...r.explanation.questionsForDoctor]) expect(checkAiLanguage(t), t).toEqual([]);
    }
  });
});

describe("PDF: il foglio per il medico (ciclo 5)", () => {
  it("referto di esempio in due pagine: nella prima colpo d'occhio, posizione e domande", async () => {
    const ids = getSyntheticDocument(DEMO_DOCUMENT_ID)!.observations.map((o) => o.id);
    const r = await buildDemoReport(DEMO_DOCUMENT_ID, ids);
    if (!r.ok) throw new Error(r.message);
    const bytes = await renderReportPdf(r);
    expect((await PDFDocument.load(bytes)).getPageCount()).toBe(2);
    const { text } = await extractText(new Uint8Array(bytes), { mergePages: false });
    const p1 = text[0].replace(/\s+/g, " ");
    expect(p1).toContain("5 valori letti: 4 dentro l'intervallo stampato, 1 sopra.");
    expect(p1).toContain("Da chiedere al medico:");
    expect(p1).toContain("Colesterolo LDL (134 mg/dL, sopra l'intervallo stampato)");
    expect(p1).toContain("Posizione");
    expect(p1).toContain("Domande da portare al medico");
    const p2 = text[1].replace(/\s+/g, " ");
    expect(p2).toContain("Che cosa significano i termini");
    expect(p2).toContain("In breve e limiti");
    expect(p2).toContain("chiama il 112");
  });

  it("un referto lungo non perde righe: tutti i valori compaiono", async () => {
    for (const s of listSyntheticSamples()) {
      const d = getSyntheticDocument(s.id)!;
      const r = await buildDemoReport(s.id, d.observations.map((o) => o.id));
      if (!r.ok) throw new Error(r.message);
      const { text } = await extractText(new Uint8Array(await renderReportPdf(r)), { mergePages: true });
      for (const it of r.explanation.items) expect(String(text).replace(/\s+/g, " "), `${s.id}: ${it.nameExact}`).toContain(it.nameExact);
    }
  });
});
