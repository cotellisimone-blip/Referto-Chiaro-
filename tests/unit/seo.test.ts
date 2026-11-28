import { afterEach, describe, expect, it, vi } from "vitest";
import { indexingEnabled, absoluteUrl, jsonLd, breadcrumbLd, guideIndexable } from "@/lib/seo";
import sitemap from "@/app/sitemap";
import robots from "@/app/robots";

afterEach(() => vi.unstubAllEnvs());

describe("seo", () => {
  it("l'indicizzazione è spenta salvo ENABLE_INDEXING esattamente \"true\"", () => {
    expect(indexingEnabled({})).toBe(false);
    expect(indexingEnabled({ ENABLE_INDEXING: "1" })).toBe(false);
    expect(indexingEnabled({ ENABLE_INDEXING: "TRUE" })).toBe(false);
    expect(indexingEnabled({ ENABLE_INDEXING: "true" })).toBe(true);
  });

  it("con indicizzazione spenta: sitemap vuota, robots disallow tutto", () => {
    expect(sitemap()).toEqual([]);
    expect(robots()).toEqual({ rules: { userAgent: "*", disallow: "/" } });
  });

  it("con indicizzazione accesa: pagine pubbliche e guide pratiche sì; bozze cliniche, glossario e aree riservate no", () => {
    vi.stubEnv("ENABLE_INDEXING", "true");
    const urls = sitemap().map((e) => e.url);
    expect(urls).toContain(absoluteUrl("/guide"));
    expect(urls).toContain(absoluteUrl("/guide/fascicolo-sanitario-elettronico"));
    // Ciclo 1: contenuti sanitari senza revisione medica fuori dagli indici
    expect(urls.some((u) => u.includes("/guide/come-leggere-un-referto-di-laboratorio"))).toBe(false);
    expect(urls.some((u) => u.includes("/glossario/"))).toBe(false);
    expect(urls).not.toContain(absoluteUrl("/punto-di-partenza"));
    expect(urls.some((u) => /\/(area|medico|admin|accedi|api)/.test(u))).toBe(false);
    const r = robots();
    expect(r.sitemap).toBe(absoluteUrl("/sitemap.xml"));
    expect((r.rules as { disallow: string[] }).disallow).toEqual(expect.arrayContaining(["/area-personale", "/medico", "/admin", "/api/"]));
  });

  it("jsonLd non permette di chiudere lo script; breadcrumb con URL assoluti", () => {
    expect(jsonLd({ a: "</script>" })).not.toContain("</script>");
    const b = breadcrumbLd([{ name: "Guide", path: "/guide" }]);
    expect(b.itemListElement[0].item).toMatch(/^https:\/\/.+\/guide$/);
  });
});

describe("indicizzazione per pagina (ciclo 1)", () => {
  it("una guida clinica in bozza non è indicizzabile neanche con l'indicizzazione accesa; quella pratica sì", () => {
    const on = { ENABLE_INDEXING: "true" };
    expect(guideIndexable({ slug: "emocromo", reviewStatus: "draft-needs-clinical-review" }, on)).toBe(false);
    expect(guideIndexable({ slug: "fascicolo-sanitario-elettronico", reviewStatus: "draft-needs-clinical-review" }, on)).toBe(true);
    expect(guideIndexable({ slug: "fascicolo-sanitario-elettronico", reviewStatus: "draft-needs-clinical-review" }, {})).toBe(false);
  });
});
