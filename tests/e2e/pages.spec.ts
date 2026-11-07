import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const PAGES = ["/", "/esempio", "/come-funziona", "/servizi-prezzi", "/faq", "/secondo-parere", "/per-le-strutture", "/inizia", "/chi-siamo", "/contatti", "/sicurezza", "/accessibilita", "/privacy", "/termini", "/cookie"];

for (const path of PAGES) {
  test(`pagina ${path}: nessun errore, nessun overflow, accessibilità`, async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
    page.on("pageerror", (e) => errors.push(e.message));
    const res = await page.goto(path);
    expect(res?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, "scroll orizzontale involontario").toBeLessThanOrEqual(0);
    const axe = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
    expect(axe.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`)).toEqual([]);
    expect(errors).toEqual([]);
  });
}

test("nessun link interno rotto", async ({ page, request }) => {
  const seen = new Set<string>();
  for (const path of PAGES) {
    await page.goto(path);
    const hrefs = await page.$$eval("a[href^='/']", (as) => as.map((a) => (a as HTMLAnchorElement).getAttribute("href")!.split("#")[0]));
    hrefs.forEach((h) => seen.add(h || "/"));
  }
  for (const href of seen) {
    const res = await request.get(href);
    expect(res.status(), href).toBe(200);
  }
});

test("pagina inesistente mostra un 404 curato", async ({ page }) => {
  const res = await page.goto("/pagina-che-non-esiste");
  expect(res?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "Questa pagina non esiste." })).toBeVisible();
});

test("nessun testo vietato o promessa non verificabile", async ({ page }) => {
  for (const path of PAGES) {
    await page.goto(path);
    const text = (await page.locator("body").innerText()).toLowerCase();
    for (const banned of ["lorem ipsum", "certificato gdpr", "conforme mdr", "24/7", "approvato da medici", "100%", "garantit"]) {
      expect(text, `${path} contiene "${banned}"`).not.toContain(banned);
    }
  }
});

test.describe("tema scuro", () => {
  test.use({ colorScheme: "dark" });
  for (const path of ["/", "/servizi-prezzi", "/esempio"]) {
    test(`pagina ${path} in tema scuro: accessibilità`, async ({ page }) => {
      await page.goto(path);
      const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
      expect(bg).toBe("rgb(15, 26, 32)");
      const axe = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
      expect(axe.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`)).toEqual([]);
    });
  }
});

test("il selettore del tema forza il tema scuro e lo ricorda", async ({ page }) => {
  await page.goto("/");
  const toggle = page.getByRole("button", { name: /cambia tema/ }).first();
  await toggle.click(); // auto -> chiaro
  await toggle.click(); // chiaro -> scuro
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});

test("menu mobile: si apre, intrappola il fuoco e si chiude con Esc", async ({ page, isMobile }) => {
  test.skip(!isMobile, "solo mobile");
  await page.goto("/");
  await page.getByRole("button", { name: "Apri il menu" }).click();
  const menu = page.locator("#menu-mobile");
  await expect(menu).toBeVisible();
  await expect(menu.getByRole("link", { name: "Inizia ora" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(menu).toBeHidden();
});
