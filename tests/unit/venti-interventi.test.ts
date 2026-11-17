import { afterEach, describe, expect, it, vi } from "vitest";
import { GUIDES } from "@/content/guides";
import { INTEGRATORI, integratoriForGuide } from "@/content/integratori";
import { buildSearchIndex, searchIndex } from "@/lib/search-index";
import { DESCRIPTION_MAX, TITLE_MAX, TITLE_SUFFIX, absoluteUrl, metaDescription, pageTitle } from "@/lib/seo";
import sitemap from "@/app/sitemap";
import { PAYOFF_LINES } from "@/domain/offerta";
import { CARICA_HREF, HEADER_CTA } from "@/components/site/nav";

/** 17/11/2026, «20 interventi prima del lancio»: le regole nuove che non hanno bisogno del browser. */

afterEach(() => vi.unstubAllEnvs());

describe("punto 12 · titoli e descrizioni della giusta lunghezza", () => {
  it("un titolo corto prende il nome del sito, uno lungo no, e nessuno supera il limite", () => {
    expect(pageTitle("Emocromo")).toBe("Emocromo");
    const lungo = "x".repeat(TITLE_MAX - TITLE_SUFFIX.length + 1);
    expect(pageTitle(lungo)).toEqual({ absolute: lungo });
    for (const g of GUIDES) {
      const t = pageTitle(g.title);
      const finale = typeof t === "string" ? t + TITLE_SUFFIX : t.absolute;
      expect(finale.length, g.slug).toBeLessThanOrEqual(TITLE_MAX);
    }
  });

  it("una descrizione lunga si ferma a fine parola, entro il limite", () => {
    expect(metaDescription("Breve.")).toBe("Breve.");
    const d = metaDescription("parola ".repeat(60));
    expect(d.length).toBeLessThanOrEqual(DESCRIPTION_MAX);
    expect(d.endsWith("…")).toBe(true);
    expect(d).not.toMatch(/\s…$/);
    for (const g of GUIDES) expect(metaDescription(g.summary).length, g.slug).toBeLessThanOrEqual(DESCRIPTION_MAX);
    for (const i of INTEGRATORI) expect(metaDescription(i.summary).length, i.slug).toBeLessThanOrEqual(DESCRIPTION_MAX);
  });
});

describe("punto 13 · sitemap", () => {
  it("con l'indicizzazione accesa: le tre sezioni, Strumenti e Integratori sì; le pagine unite e le schede non revisionate no", () => {
    vi.stubEnv("ENABLE_INDEXING", "true");
    const urls = sitemap().map((e) => e.url);
    for (const p of ["/", "/prevenzione", "/lettura-referti", "/medici", "/strumenti", "/integratori"]) expect(urls, p).toContain(absoluteUrl(p));
    for (const p of ["/referti", "/servizi/prevenzione", "/con-un-medico"]) expect(urls, p).not.toContain(absoluteUrl(p));
    // Stessa regola delle guide: una scheda entra solo dopo la revisione.
    for (const i of INTEGRATORI.filter((x) => x.reviewStatus === "draft-needs-clinical-review")) expect(urls, i.slug).not.toContain(absoluteUrl(`/integratori/${i.slug}`));
    expect(new Set(urls).size).toBe(urls.length);
  });
});

describe("punto 8 · ricerca", () => {
  const index = buildSearchIndex();
  it("trova tutte le schede degli integratori", () => {
    for (const i of INTEGRATORI) expect(index.some((x) => x.href === `/integratori/${i.slug}` && x.kind === "integratore"), i.slug).toBe(true);
    expect(searchIndex(index, "vitamina d").some((r) => r.href === "/integratori/vitamina-d")).toBe(true);
  });
  it("non porta più alle pagine unite nelle tre sezioni", () => {
    for (const vecchia of ["/referti", "/servizi/prevenzione", "/con-un-medico", "/servizi"]) expect(index.some((x) => x.href === vecchia), vecchia).toBe(false);
    expect(searchIndex(index, "prevenzione")[0]?.href).toBe("/prevenzione");
    expect(searchIndex(index, "medico").some((r) => r.href === "/medici")).toBe(true);
  });
});

describe("punto 15 · guide e integratori collegati nei due sensi", () => {
  it("ogni guida citata da una scheda rimanda a quella scheda", () => {
    const slugs = new Set(GUIDES.map((g) => g.slug));
    let legami = 0;
    for (const i of INTEGRATORI) {
      const g = i.onReport.guide;
      if (!g) continue;
      expect(slugs.has(g), `${i.slug} cita una guida che non esiste: ${g}`).toBe(true);
      expect(integratoriForGuide(g).map((x) => x.slug), `${g} → ${i.slug}`).toContain(i.slug);
      legami++;
    }
    expect(legami).toBeGreaterThan(0);
    expect(integratoriForGuide("guida-che-non-esiste")).toEqual([]);
  });
});

describe("punti 2 e 10 · un'azione e un messaggio soli", () => {
  it("«Carica un referto» porta al primo passo del caricamento, dalla testata come dalle sezioni", () => {
    expect(CARICA_HREF).toBe("/area-personale/nuovo");
    expect(HEADER_CTA.href).toBe(CARICA_HREF);
  });
  it("il messaggio è uno: Previeni. Capisci. Un medico, se serve.", () => {
    expect(PAYOFF_LINES.join(" ")).toBe("Previeni. Capisci. Un medico, se serve.");
  });
});
