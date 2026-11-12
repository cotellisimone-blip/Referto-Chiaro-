import { describe, expect, it } from "vitest";
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { extractText } from "unpdf";
import { AREAS, CONTEXT_QUESTIONS, GOALS, HAVE, NOT_ROUTINE } from "@/content/punto-di-partenza";
import * as CONTENT from "@/content/punto-di-partenza";
import { EMPTY_ANSWERS, buildMap, completeness, isDocumented, mapToText, toggleHave, type PdpAnswers } from "@/domain/punto-di-partenza";
import { renderPdpPdf } from "@/domain/punto-di-partenza-pdf";
import { PDP_EVENTS, isPublicEvent } from "@/domain/metrics/funnel";
import { readFlags, requireCapability } from "@/lib/feature-flags";

/** Frasi vietate dal pacchetto V3 (ACCEPTANCE_TESTS.md, «Copy safety») e dai guardrail clinici. */
const BANNED = [
  /devi fare/i,
  /sei a rischio/i,
  /rischio (alto|elevato)/i,
  /probabilmente hai/i,
  /\b(assumi|prendi)\b/i,
  /ripet[ei]\w* (fra|tra) \d+ (mesi|anni)/i,
  /punteggio (di |della )?salute/i,
  /et[àa] biologica/i,
  /sei sano/i,
  /esami che devi/i,
  /health score/i,
  /screening totale/i,
  /check-up completo/i,
];

const PDP_SOURCES = [
  "src/content/punto-di-partenza.ts",
  "src/domain/punto-di-partenza.ts",
  "src/domain/punto-di-partenza-pdf.ts",
  "src/app/punto-di-partenza/page.tsx",
  ...readdirSync("src/components/punto-di-partenza").map((f) => path.join("src/components/punto-di-partenza", f)),
];

/** Generatore pseudo-casuale con seme fisso: test ripetibili. */
function rng(seed: number) {
  let s = seed;
  return () => ((s = (s * 1103515245 + 12345) % 2 ** 31) / 2 ** 31);
}
function randomAnswers(r: () => number): PdpAnswers {
  const pick = <T,>(xs: readonly T[]) => xs[Math.floor(r() * xs.length)];
  const have = HAVE.filter(() => r() < 0.4).map((h) => h.id);
  const context = Object.fromEntries(CONTEXT_QUESTIONS.map((q) => [q.key, r() < 0.15 ? null : pick(q.options as readonly { v: string }[]).v])) as unknown as PdpAnswers["context"];
  const areaOverrides = Object.fromEntries(AREAS.filter(() => r() < 0.3).map((a) => [a.id, r() < 0.5]));
  return { goal: r() < 0.1 ? null : pick(GOALS).id, have, context, areaOverrides, notes: "" };
}

describe("Punto di Partenza — contenuti curati", () => {
  it("10 aree, ciascuna con categoria, fonte e stato di revisione", () => {
    expect(AREAS).toHaveLength(10);
    expect(new Set(AREAS.map((a) => a.id)).size).toBe(10);
    for (const a of AREAS) {
      expect(["base", "contextual"]).toContain(a.category);
      expect(a.whyItMatters.length).toBeGreaterThan(20);
      expect(a.whatToDiscuss.length).toBeGreaterThan(20);
      expect(a.examples.length).toBeGreaterThan(0);
      expect(a.sourceUrl).toMatch(/^https:\/\//);
      expect(a.sourceLabel.length).toBeGreaterThan(5);
      expect(a.reviewStatus).toBe("bozza-in-attesa-di-revisione");
    }
    expect(AREAS.filter((a) => a.category === "base").map((a) => a.id)).toEqual(["pressione", "glicemia", "lipidi", "screening"]);
    expect(NOT_ROUTINE.map((x) => x.id)).toEqual(["marcatori", "vitamina-d", "tiroide-estesa", "cortisolo", "autoimmuni"]);
  });

  it("nessuna frase vietata nei sorgenti di Punto di Partenza", () => {
    const offenders = PDP_SOURCES.flatMap((f) => BANNED.filter((b) => b.test(readFileSync(f, "utf8"))).map((b) => `${f}: ${b}`));
    expect(offenders).toEqual([]);
    const all = JSON.stringify(CONTENT);
    expect(BANNED.filter((b) => b.test(all))).toEqual([]);
  });

  it("niente esami «obbligatori»: HbA1c e TSH solo come esempi legati al contesto", () => {
    const g = AREAS.find((a) => a.id === "glicemia")!;
    expect(g.examples.join(" ")).toMatch(/HbA1c\), quando indicata/);
    expect(AREAS.find((a) => a.id === "tiroide")!.examples.join(" ")).toMatch(/se clinicamente indicato/);
    expect(JSON.stringify(CONTENT)).not.toMatch(/obbligatori/i);
  });
});

describe("Punto di Partenza — regole deterministiche", () => {
  it("«Nessuno / non ricordo» esclude le altre voci", () => {
    expect(toggleHave(["pressione", "sangue"], "nessuno")).toEqual(["nessuno"]);
    expect(toggleHave(["nessuno"], "urine")).toEqual(["urine"]);
    expect(toggleHave(["urine"], "urine")).toEqual([]);
  });

  it("«Cosa hai già» propone le aree documentate; la scelta esplicita vince", () => {
    const a: PdpAnswers = { ...EMPTY_ANSWERS, have: ["pressione", "urine"] };
    expect(isDocumented(a, "pressione")).toBe(true);
    expect(isDocumented(a, "urine")).toBe(true);
    expect(isDocumented(a, "lipidi")).toBe(false);
    expect(isDocumented({ ...a, areaOverrides: { pressione: false, lipidi: true } }, "pressione")).toBe(false);
    expect(isDocumented({ ...a, areaOverrides: { lipidi: true } }, "lipidi")).toBe(true);
  });

  it("completezza = informazioni fornite (5 di contesto + 10 aree), «preferisco non indicare» non conta", () => {
    expect(completeness(EMPTY_ANSWERS)).toEqual({ pct: 0, given: 0, total: 15 });
    const a: PdpAnswers = {
      ...EMPTY_ANSWERS,
      context: { age: "30-49", smoke: "no", activity: "non-indicato", familiarity: "non-so", conditions: "no" },
      areaOverrides: { pressione: true, lipidi: true, glicemia: true, screening: true, ematologia: true, rene: true },
    };
    expect(completeness(a)).toEqual({ pct: 60, given: 9, total: 15 });
  });

  it("stesse risposte, stessa scheda; sempre 4–6 domande, tutte le aree in una sola colonna", () => {
    const r = rng(42);
    for (let i = 0; i < 400; i++) {
      const a = randomAnswers(r);
      const m = buildMap(a);
      expect(buildMap(a)).toEqual(m);
      expect(m.questions.length).toBeGreaterThanOrEqual(4);
      expect(m.questions.length).toBeLessThanOrEqual(6);
      expect(new Set(m.questions).size).toBe(m.questions.length);
      const ids = [...m.documented, ...m.toDiscussBase, ...m.toDiscussContextual].map((x) => x.area.id).sort();
      expect(ids).toEqual(AREAS.map((x) => x.id).sort());
      expect(m.completeness).toBeGreaterThanOrEqual(0);
      expect(m.completeness).toBeLessThanOrEqual(100);
      const text = mapToText(m);
      expect(BANNED.filter((b) => b.test(text))).toEqual([]);
      expect(text).toContain("non la salute");
    }
  });

  it("le note di contesto citano l'informazione, non giudicano la persona", () => {
    const m = buildMap({ ...EMPTY_ANSWERS, context: { age: "50-64", smoke: "si", activity: "raramente", familiarity: "si", conditions: "si" } });
    const press = m.toDiscussBase.find((x) => x.area.id === "pressione")!;
    expect(press.notes.length).toBe(3);
    expect(m.generalNotes).toHaveLength(1);
    expect(m.questions).toContain("Su quali abitudini, come fumo o attività fisica, conviene lavorare per prime?");
    expect(m.questions.at(-1)).toMatch(/Quando ritiene utile/);
  });
});

describe("Punto di Partenza — scheda PDF", () => {
  it("genera un A4 leggibile, con fonts del sito, senza diagnosi né frasi vietate", async () => {
    const fonts = { regular: new Uint8Array(readFileSync("public/fonts/pdf/manrope-400.ttf")), bold: new Uint8Array(readFileSync("public/fonts/pdf/manrope-700.ttf")) };
    const m = buildMap({ ...EMPTY_ANSWERS, goal: "medico", have: ["pressione"], context: { age: "50-64", smoke: "si", activity: "regolare", familiarity: "si", conditions: "no" } });
    const bytes = await renderPdpPdf(m, { fonts, notes: "Chiedere dei controlli fatti nel 2024", date: new Date("2026-11-11T10:00:00Z") });
    expect(new TextDecoder().decode(bytes.slice(0, 5))).toBe("%PDF-");
    const { text } = await extractText(bytes, { mergePages: true });
    for (const s of ["Punto di Partenza", "Prepararmi a parlarne con il medico", "Completezza delle informazioni", "Domande per il medico", "Più esami non significa più prevenzione", "Chiedere dei controlli fatti nel 2024", "non diagnostico"]) {
      expect(text.replace(/\s+/g, " ")).toContain(s);
    }
    expect(BANNED.filter((b) => b.test(text))).toEqual([]);
    // Anche senza font del sito (rete assente) la scheda si genera.
    const fallback = await renderPdpPdf(m);
    expect(fallback.length).toBeGreaterThan(1000);
  });
});

describe("Punto di Partenza — privacy e funnel", () => {
  it("la guida non manda risposte al server e non le scrive nell'URL o nello storage", () => {
    const src = readFileSync("src/components/punto-di-partenza/guide.tsx", "utf8");
    expect(src).not.toMatch(/localStorage|sessionStorage|indexedDB|document\.cookie/);
    expect(src).not.toMatch(/history\.(replace|push)State|URLSearchParams|router\.(push|replace)/);
    // Unico fetch: i font pubblici per il PDF.
    expect(src.match(/fetch\(/g)).toHaveLength(1);
    expect(src).toMatch(/\/fonts\/pdf\/manrope-400\.ttf/);
    // track() riceve solo nomi fissi di passi.
    for (const m of src.matchAll(/track\(([^)]*)\)/g)) expect(m[1]).toMatch(/^"pdp-[a-z0-9-]+"$/);
    for (const m of src.matchAll(/data-track="([^"]+)"/g)) expect(PDP_EVENTS as readonly string[]).toContain(m[1]);
  });

  it("gli eventi del funnel sono nomi fissi accettati dal contatore anonimo", () => {
    for (const e of ["cta-pdp", "pdp-start", "pdp-step-2", "pdp-complete", "pdp-download", "pdp-to-referto", "pdp-to-medico"]) expect(isPublicEvent(e)).toBe(true);
    expect(isPublicEvent("pdp-risposta-fumo")).toBe(false);
  });

  it('feature gate: acceso di base, ENABLE_PUNTO_DI_PARTENZA="false" lo spegne; il salvataggio resta dietro il gate privacy', () => {
    expect(readFlags({ NODE_ENV: "production" }).puntoDiPartenza).toBe(true);
    expect(readFlags({ NODE_ENV: "production", ENABLE_PUNTO_DI_PARTENZA: "false" }).puntoDiPartenza).toBe(false);
    expect(readFlags({ NODE_ENV: "production" }).puntoDiPartenzaSave).toBe(false);
    expect(() => requireCapability("puntoDiPartenzaSave", readFlags({ NODE_ENV: "production", ENABLE_PUNTO_DI_PARTENZA_SAVE: "true" }))).toThrow(/compliance-not-approved/);
  });
});
