import { describe, expect, it } from "vitest";
import { GUIDES } from "@/content/guides";
import { FORBIDDEN_PHRASES, GuideSchema, SOURCE_DOMAINS, type Guide } from "@/content/guides/schema";
import { GLOSSARY } from "@/content/glossario";
import { GlossaryEntrySchema, type GlossaryEntry } from "@/content/glossario/schema";

function guideText(g: Guide): string {
  return [
    g.title,
    g.metaDescription,
    g.summary,
    ...g.sections.whatItMeasures,
    ...g.sections.whyRequested,
    ...g.sections.howToRead,
    ...g.sections.factors,
    g.unitsAndRanges?.rangeNote ?? '',
    ...(g.procedure ? [...g.procedure.preparation, ...g.procedure.whatToExpect, g.procedure.duration, ...g.procedure.afterwards, ...g.procedure.reportContains] : []),
    ...g.questionsForDoctor,
    ...g.faq.flatMap((f) => [f.q, f.a]),
  ]
    .join("\n")
    .toLowerCase();
}

function entryText(e: GlossaryEntry): string {
  return [e.term, e.definition, ...e.inDetail].join("\n").toLowerCase();
}

function forbiddenIn(text: string): string[] {
  return FORBIDDEN_PHRASES.filter((p) => text.includes(p));
}

const guideSlugs = new Set(GUIDES.map((g) => g.slug));
const glossarySlugs = new Set(GLOSSARY.map((e) => e.slug));

describe("guide agli esami", () => {
  it("ogni guida rispetta lo schema", () => {
    for (const g of GUIDES) {
      const r = GuideSchema.safeParse(g);
      expect(r.success, `${g.slug}: ${r.success ? "" : JSON.stringify(r.error.issues)}`).toBe(true);
    }
  });

  it("gli slug sono unici e distinti dal glossario", () => {
    expect(guideSlugs.size).toBe(GUIDES.length);
  });

  it("nessuna guida usa linguaggio diagnostico o prescrittivo", () => {
    for (const g of GUIDES) {
      expect(forbiddenIn(guideText(g)), g.slug).toEqual([]);
    }
  });

  it("ogni guida è una bozza datata, con riferimenti risolvibili", () => {
    for (const g of GUIDES) {
      expect(g.reviewStatus).toBe("draft-needs-clinical-review");
      for (const s of g.relatedGuides) expect(guideSlugs.has(s), `${g.slug} → guida ${s}`).toBe(true);
      expect(g.relatedGuides).not.toContain(g.slug);
      for (const t of g.glossaryTerms) expect(glossarySlugs.has(t), `${g.slug} → termine ${t}`).toBe(true);
    }
  });

  it("le fonti sono solo di domini ammessi, in https", () => {
    for (const g of GUIDES) {
      for (const s of g.sources) {
        const u = new URL(s.url);
        expect(u.protocol).toBe("https:");
        expect(SOURCE_DOMAINS.some((d) => u.hostname === d || u.hostname.endsWith(`.${d}`)), `${g.slug}: ${s.url}`).toBe(true);
      }
    }
  });
});

describe("glossario pubblico", () => {
  it("ogni voce rispetta lo schema e gli slug sono unici", () => {
    for (const e of GLOSSARY) {
      const r = GlossaryEntrySchema.safeParse(e);
      expect(r.success, `${e.slug}: ${r.success ? "" : JSON.stringify(r.error.issues)}`).toBe(true);
    }
    expect(glossarySlugs.size).toBe(GLOSSARY.length);
  });

  it("nessuna voce usa linguaggio diagnostico o prescrittivo", () => {
    for (const e of GLOSSARY) expect(forbiddenIn(entryText(e)), e.slug).toEqual([]);
  });

  it("i riferimenti incrociati si risolvono", () => {
    for (const e of GLOSSARY) {
      for (const s of e.relatedGuides) expect(guideSlugs.has(s), `${e.slug} → guida ${s}`).toBe(true);
      for (const t of e.relatedTerms) expect(glossarySlugs.has(t), `${e.slug} → termine ${t}`).toBe(true);
      expect(e.relatedTerms).not.toContain(e.slug);
    }
  });
});
