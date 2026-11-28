import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { PDFDocument } from "pdf-lib";
import { extractText, getDocumentProxy } from "unpdf";
import { buildDemoReport } from "@/domain/reporting/demo-report-service";
import { renderReportPdf } from "@/domain/reporting/pdf";
import { UNCONFIRMED_REASON, UNREADABLE_REASON } from "@/domain/reporting/esclusi";
import { DEMO_DOCUMENT_ID, getSyntheticDocument } from "@/fixtures/synthetic";
import { searchSite } from "@/lib/search-core";
import { buildSearchIndex } from "@/lib/search-index";
import { GUIDES } from "@/content/guides";

const readable = () => getSyntheticDocument(DEMO_DOCUMENT_ID)!.observations.filter((o) => o.valueRaw !== null);

describe("quarto giro · motivo dei valori esclusi (punto 2)", () => {
  it("un valore illeggibile è «non leggibile», non «non confermato», anche dopo «Conferma tutti i valori leggibili»", async () => {
    const r = await buildDemoReport(DEMO_DOCUMENT_ID, readable().map((o) => o.id));
    if (!r.ok) throw new Error(r.message);
    const tri = r.explanation.excludedObservations.find((e) => e.nameExact === "Trigliceridi");
    expect(tri?.reason).toBe(UNREADABLE_REASON);
  });
  it("un valore leggibile lasciato senza conferma resta «non confermato»", async () => {
    const [first, ...rest] = readable();
    const r = await buildDemoReport(DEMO_DOCUMENT_ID, rest.map((o) => o.id));
    if (!r.ok) throw new Error(r.message);
    expect(r.explanation.excludedObservations.find((e) => e.id === first.id)?.reason).toBe(UNCONFIRMED_REASON);
  });
  it("il provider Claude usa gli stessi motivi, nello stesso ordine", () => {
    const src = readFileSync("src/providers/ai/claude-explanation.ts", "utf8");
    expect(src.indexOf("UNREADABLE_REASON }")).toBeGreaterThan(-1);
    expect(src.indexOf("UNREADABLE_REASON }")).toBeLessThan(src.indexOf("UNCONFIRMED_REASON }"));
  });
});

describe("quarto giro · PDF per il medico (punto 5)", () => {
  it("il piè di pagina non mostra la sigla tecnica, che resta nei metadati; il motivo dell'esclusione è quello giusto", async () => {
    const r = await buildDemoReport(DEMO_DOCUMENT_ID, readable().map((o) => o.id));
    if (!r.ok) throw new Error(r.message);
    const bytes = await renderReportPdf(r);
    const { text } = await extractText(await getDocumentProxy(new Uint8Array(bytes)), { mergePages: true });
    expect(text).not.toContain(r.explanation.modelAndPromptVersion);
    expect(text).not.toContain("deterministic-demo");
    expect(text.replace(/\s+/g, " ")).toContain("Trigliceridi (non leggibile sul documento");
    const pdf = await PDFDocument.load(bytes);
    expect(pdf.getPageCount()).toBe(2);
    expect(pdf.getKeywords()).toContain(r.explanation.modelAndPromptVersion);
  });
  it("nessuna scritta sotto i 10,5 punti", () => {
    const src = readFileSync("src/domain/reporting/pdf.ts", "utf8");
    const sizes = [...src.matchAll(/drawText\([^;]*?size: ([\d.]+)/g)].map((m) => Number(m[1]));
    expect(sizes.length).toBeGreaterThan(10);
    expect(sizes.filter((s) => s < 10.5)).toEqual([]);
    expect(src).toMatch(/const size = 10\.5;/); // le etichette a pillola
  });
});

describe("quarto giro · ricerca (punto 3)", () => {
  const index = buildSearchIndex();
  const first = (q: string) => searchSite(index, q).items[0]?.title ?? "";
  const titles = (q: string) => searchSite(index, q).items.map((i) => i.title);
  it("le sigle corte non si trovano dentro altre parole", () => {
    expect(titles("ANA").some((t) => /Emocromo|Referto di laboratorio|urine/.test(t))).toBe(false);
    expect(titles("TAS").some((t) => /Potassio|Fosfatasi/.test(t))).toBe(false);
    expect(titles("AST").some((t) => /Gastroscopia/.test(t))).toBe(false);
    expect(first("MOC")).toMatch(/^MOC/);
  });
  it("se la sigla esiste, non si aggiungono le parole che iniziano allo stesso modo", () => {
    expect(titles("ANA")).not.toContain("Metodo analitico");
    expect(titles("PCR")[0]).toBe("PCR");
    expect(titles("TSH")[0]).toBe("TSH");
    expect(titles("PT")[0]).toBe("PT e INR");
  });
  it("chi sta ancora scrivendo trova lo stesso le voci che iniziano così", () => {
    expect(first("glic")).toMatch(/Glicemia|glicata/);
    expect(titles("emo").length).toBeGreaterThan(2);
    expect(first("ferr")).toMatch(/Ferritina/);
  });
  it("due parole in voci diverse portano all'esame giusto", () => {
    const r = searchSite(index, "leucociti urine");
    expect(r.items[0]?.title).toMatch(/urine/i);
    expect(first("sangue nelle urine")).toMatch(/Esame delle urine/);
  });
  it("le guide nuove si trovano", () => {
    expect(first("ANA")).toMatch(/Fattore reumatoide e ANA/);
    expect(first("fattore reumatoide")).toMatch(/Fattore reumatoide/);
    expect(first("CEA")).toMatch(/Marcatori tumorali/);
    expect(first("CA 125")).toMatch(/Marcatori tumorali/);
    expect(first("Helicobacter")).toMatch(/Helicobacter/);
    expect(first("calprotectina")).toMatch(/Calprotectina/);
    expect(first("rx torace")).toMatch(/Radiografia del torace/);
    expect(first("ecografia tiroide")).toMatch(/Ecografia della tiroide/);
  });
});

describe("quarto giro · guide nuove (punto 4)", () => {
  it("sono sei bozze con fonti", () => {
    const slugs = ["marcatori-tumorali", "fattore-reumatoide-e-ana", "helicobacter-pylori", "calprotectina-fecale", "radiografia-del-torace", "ecografia-della-tiroide"];
    for (const s of slugs) {
      const g = GUIDES.find((x) => x.slug === s);
      expect(g, s).toBeTruthy();
      expect(g!.reviewStatus).toBe("draft-needs-clinical-review");
      expect(g!.sources.length).toBeGreaterThan(0);
    }
  });
});
