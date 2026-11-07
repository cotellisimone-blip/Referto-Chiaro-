import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const AXE_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

async function expectAccessible(page: import("@playwright/test").Page) {
  const axe = await new AxeBuilder({ page }).withTags(AXE_TAGS).analyze();
  expect(axe.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`)).toEqual([]);
}

test.describe("guide e glossario", () => {
  test("hub delle guide: categorie, elenco, avviso di revisione", async ({ page }) => {
    await page.goto("/guide");
    await expect(page.getByRole("heading", { level: 1, name: "Gli esami di laboratorio, spiegati." })).toBeVisible();
    await expect(page.getByRole("note")).toContainText("revisione medica");
    await expect(page.getByRole("navigation", { name: "Categorie" }).getByRole("link")).not.toHaveCount(0);
    const links = page.locator("a[href^='/guide/']");
    expect(await links.count()).toBeGreaterThanOrEqual(60);
    await expectAccessible(page);
  });

  test("una guida: struttura, bozza dichiarata, JSON-LD, noindex finché la revisione manca", async ({ page }) => {
    const res = await page.goto("/guide/come-leggere-un-referto-di-laboratorio");
    expect(res?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("h1")).toContainText("Come leggere un referto");
    for (const name of [/Che cosa misura/i, /Perché viene richiesto/i, /Come leggere/i, /Domande da portare al medico/i, /Domande frequenti/i]) {
      await expect(page.getByRole("heading", { level: 2, name })).toBeVisible();
    }
    await expect(page.getByText(/bozza/i).first()).toBeVisible();
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/guide\/come-leggere-un-referto-di-laboratorio$/);
    const ld = await page.locator('script[type="application/ld+json"]').first().textContent();
    const parsed = JSON.parse(ld ?? "[]") as { "@type": string }[];
    expect(parsed.map((x) => x["@type"])).toEqual(["Article", "FAQPage", "BreadcrumbList"]);
    await expectAccessible(page);
  });

  test("tutte le guide rispondono 200 con un solo H1", async ({ page, request }) => {
    await page.goto("/guide");
    const hrefs = await page.$$eval("a[href^='/guide/']", (as) => [...new Set(as.map((a) => (a as HTMLAnchorElement).getAttribute("href")!))]);
    for (const href of hrefs) {
      const res = await request.get(href);
      expect(res.status(), href).toBe(200);
      const html = await res.text();
      expect((html.match(/<h1[\s>]/g) ?? []).length, href).toBe(1);
      expect(html.toLowerCase(), href).not.toContain("lorem ipsum");
    }
  });

  test("glossario: lettere, voce singola, termini collegati", async ({ page }) => {
    await page.goto("/glossario");
    await expect(page.getByRole("heading", { level: 1, name: "Le parole dei referti." })).toBeVisible();
    expect(await page.locator("a[href^='/glossario/']").count()).toBeGreaterThanOrEqual(100);
    await expectAccessible(page);
    const res = await page.goto("/glossario/intervallo-di-riferimento");
    expect(res?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.getByText(/bozza/i).first()).toBeVisible();
    const ld = await page.locator('script[type="application/ld+json"]').first().textContent();
    expect((JSON.parse(ld ?? "[]") as { "@type": string }[]).map((x) => x["@type"])).toEqual(["DefinedTerm", "BreadcrumbList"]);
    await expectAccessible(page);
  });

  test("guida o voce inesistente: 404", async ({ request }) => {
    expect((await request.get("/guide/esame-che-non-esiste")).status()).toBe(404);
    expect((await request.get("/glossario/termine-che-non-esiste")).status()).toBe(404);
  });

  test("indicizzazione spenta: sitemap vuota e robots disallow", async ({ request }) => {
    const robots = await request.get("/robots.txt");
    expect(robots.status()).toBe(200);
    expect(await robots.text()).toMatch(/Disallow: \/\s*$/m);
    const sitemap = await request.get("/sitemap.xml");
    expect(sitemap.status()).toBe(200);
    expect(await sitemap.text()).not.toContain("<loc>");
  });

  test("navigazione: Guide nel menu, nessun a capo nel header a 1024px", async ({ page, isMobile }) => {
    test.skip(isMobile, "solo desktop");
    await page.setViewportSize({ width: 1024, height: 800 });
    await page.goto("/");
    const nav = page.getByRole("navigation", { name: /principale/i });
    await expect(nav.getByRole("link", { name: "Guide" })).toBeVisible();
    const box = await page.locator("header").first().boundingBox();
    expect(box?.height ?? 0).toBeLessThan(90);
  });
});
