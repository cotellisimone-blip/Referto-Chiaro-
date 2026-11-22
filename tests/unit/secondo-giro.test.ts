import { describe, expect, test } from "vitest";
import { buildSearchIndex, searchSite } from "@/lib/search-index";
import { editDistance, stripQualifiers } from "@/lib/search-core";

/** Secondo giro di 20 interventi (18/11/2026). Un blocco per punto, con il numero dell'elenco approvato. */
describe("punto 1: la ricerca capisce come si scrive davvero", () => {
  const index = buildSearchIndex();
  const first = (q: string) => searchSite(index, q, 6).items[0]?.href;
  const all = (q: string) => searchSite(index, q, 6).items.map((i) => i.href);

  test.each([
    ["glicemia alta", "/guide/glicemia"],
    ["ferro basso", "/guide/sideremia"],
    ["globuli bianchi alti", "/guide/globuli-bianchi-e-formula-leucocitaria"],
    ["colesterolo alto", "/guide/colesterolo-totale"],
    ["valori della tiroide", "/guide/tsh"],
    ["che cosa significa tsh alto", "/guide/tsh"],
    ["emocrmo", "/guide/emocromo"],
    ["colestrolo", "/guide/colesterolo-totale"],
    ["creatinna", "/guide/creatinina"],
    ["transaminsi", "/guide/transaminasi-alt-ast"],
    ["feritina", "/guide/ferritina"],
    ["glicmia", "/guide/glicemia"],
    ["diabete", "/guide/glicemia"],
    ["prezzo", "/prezzi"],
    ["quanto costa", "/prezzi"],
    ["cancellare account", "/sicurezza-e-privacy"],
    ["accedi", "/accedi"],
    ["pdf", "/referti/esempio"],
    ["strumenti", "/strumenti"],
    ["glossario", "/glossario"],
    ["anemia", "/guide/emocromo"],
    ["tiroide", "/guide/tsh"],
    ["vitamina d", "/guide/vitamina-d"],
    ["tsh", "/guide/tsh"],
    ["psa", "/guide/psa"],
    ["ves", "/guide/ves"],
    ["holter", "/guide/holter-ecg"],
    ["medico a casa", "/medici"],
    ["privacy", "/privacy-policy"],
    ["esami del sangue", "/guide/emocromo"],
  ])("«%s» trova %s", (q, href) => {
    expect(all(q), q).toContain(href);
  });

  test("la ricerca esatta non cambia: chi scrive la sigla trova prima la sua guida", () => {
    expect(first("tsh")).toBe("/guide/tsh");
    expect(first("emocromo")).toBe("/guide/emocromo");
    expect(searchSite(index, "tsh").mode).toBe("esatta");
  });

  test("dice quale strada ha preso", () => {
    expect(searchSite(index, "creatinina alta")).toMatchObject({ mode: "senza-aggettivi", used: "creatinina" });
    // 22/11/2026: «glicemia alta» è anche una pagina Malattie: prima la malattia, subito dopo la guida all'esame.
    expect(searchSite(index, "glicemia alta").items.slice(0, 2).map((i) => i.href)).toEqual(["/malattie/diabete", "/guide/glicemia"]);
    expect(searchSite(index, "emocrmo")).toMatchObject({ mode: "simile", used: "emocromo" });
  });

  test("le sigle corte non si «correggono»: una sigla sbagliata non porta a un altro esame", () => {
    expect(searchSite(index, "tsx").items).toEqual([]);
    expect(searchSite(index, "xyzqwk").items).toEqual([]);
  });

  test("distanza di modifica e parole di contorno", () => {
    expect(editDistance("emocrmo", "emocromo")).toBe(1);
    expect(editDistance("emocormo", "emocromo")).toBe(1);
    expect(editDistance("glicemia", "creatinina")).toBeGreaterThan(2);
    expect(stripQualifiers("Che cosa significa la Glicemia alta?")).toBe("glicemia");
    expect(stripQualifiers("alto")).toBe("");
  });
});

describe("punto 1 · niente risultati a caso", () => {
  test("«mal di testa» non diventa «testosterone»: nessun risultato, e la ricerca propone le tre sezioni", () => {
    const index = buildSearchIndex();
    for (const q of ["dolore al ginocchio", "pizza margherita"]) expect(searchSite(index, q, 6).items, q).toEqual([]);
    // 21/11/2026: con i diari della salute «mal di testa» trova il diario, e solo quello (mai «testosterone»).
    // 22/11/2026: prima la pagina «Mal di testa» della sezione Malattie, poi il diario.
    const mdt = searchSite(index, "mal di testa", 6).items.map((i) => i.href);
    expect(mdt[0]).toBe("/malattie/mal-di-testa");
    expect(mdt).toContain("/diari");
    expect(mdt.some((h) => h.includes("testosterone"))).toBe(false);
  });
});

describe("punto 17 · sitemap con date vere", () => {
  test("le pagine fisse non dichiarano «oggi»: stessa data a ogni compilazione", async () => {
    const prev = process.env.ENABLE_INDEXING;
    process.env.ENABLE_INDEXING = "true";
    try {
      const { default: sitemap } = await import("@/app/sitemap");
      const { PAGES_UPDATED } = await import("@/lib/seo");
      const voci = sitemap();
      const home = voci.find((v) => new URL(v.url).pathname === "/");
      expect(new Date(home!.lastModified as Date).toISOString().slice(0, 10)).toBe(PAGES_UPDATED);
      const oggi = new Date().toISOString();
      expect(voci.every((v) => new Date(v.lastModified as Date).toISOString() !== oggi)).toBe(true);
    } finally {
      if (prev === undefined) delete process.env.ENABLE_INDEXING;
      else process.env.ENABLE_INDEXING = prev;
    }
  });
});

describe("punto 18 · guide pratiche", () => {
  test("sono indicizzabili prima della revisione medica, le guide cliniche no", async () => {
    const { GUIDES } = await import("@/content/guides");
    const { guideIndexable, NON_CLINICAL_GUIDES } = await import("@/lib/seo");
    const env = { ENABLE_INDEXING: "true" };
    const ok = GUIDES.filter((g) => guideIndexable(g, env)).map((g) => g.slug);
    expect(ok.sort()).toEqual([...NON_CLINICAL_GUIDES].sort());
    expect(ok).toHaveLength(6);
    for (const g of GUIDES) expect(Boolean(g.practical), g.slug).toBe(NON_CLINICAL_GUIDES.has(g.slug));
  });
});

describe("punto 20 · caratteri", () => {
  test("i file dei caratteri dei titoli restano sotto i 102 KB in tutto", async () => {
    const { statSync } = await import("node:fs");
    const tot = ["fraunces.woff2", "fraunces-italic.woff2"].reduce((a, f) => a + statSync(`src/app/fonts/${f}`).size, 0);
    expect(tot).toBeLessThan(102_000);
  });
});
