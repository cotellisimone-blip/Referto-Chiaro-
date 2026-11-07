import { afterEach, describe, expect, it, vi } from "vitest";
import { indexingEnabled, absoluteUrl, jsonLd, breadcrumbLd } from "@/lib/seo";
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

  it("con indicizzazione accesa: sitemap con guide e glossario, aree riservate escluse", () => {
    vi.stubEnv("ENABLE_INDEXING", "true");
    const urls = sitemap().map((e) => e.url);
    expect(urls).toContain(absoluteUrl("/guide"));
    expect(urls.some((u) => u.includes("/guide/come-leggere-un-referto-di-laboratorio"))).toBe(true);
    expect(urls.some((u) => u.includes("/glossario/"))).toBe(true);
    expect(urls.some((u) => /\/(area|medico|admin|accedi|api)/.test(u))).toBe(false);
    const r = robots();
    expect(r.sitemap).toBe(absoluteUrl("/sitemap.xml"));
    expect((r.rules as { disallow: string[] }).disallow).toEqual(expect.arrayContaining(["/area", "/medico", "/admin", "/api/"]));
  });

  it("jsonLd non permette di chiudere lo script; breadcrumb con URL assoluti", () => {
    expect(jsonLd({ a: "</script>" })).not.toContain("</script>");
    const b = breadcrumbLd([{ name: "Guide", path: "/guide" }]);
    expect(b.itemListElement[0].item).toMatch(/^https:\/\/.+\/guide$/);
  });
});
