import { test, expect, type Locator, type Page } from "@playwright/test";
import { gotoReady } from "./_lib/ready";

/** Ciclo 2, fase 4: glossario e guide comodi su telefono, comandi da almeno 44 px. */

async function smallTargets(page: Page, scope: string) {
  return page.evaluate((sel) => {
    const root = document.querySelector(sel);
    if (!root) return ["scope mancante"];
    return [...root.querySelectorAll("a, button")]
      .filter((e) => {
        const r = e.getBoundingClientRect();
        if (!(r.width > 0 && r.height > 0)) return false;
        // Link dentro una frase: la regola dei 44 px non si applica al testo corrente.
        if (getComputedStyle(e).display === "inline" && e.closest("p")) return false;
        if (e.classList.contains("sr-only") || e.textContent?.trim() === "Vai al contenuto") return false;
        return r.height < 43.5 || r.width < 43.5; // mezzo pixel di tolleranza per l'arrotondamento
      })
      .map((e) => `${(e.textContent ?? "").trim().slice(0, 30)} ${Math.round(e.getBoundingClientRect().width)}x${Math.round(e.getBoundingClientRect().height)}`);
  }, scope);
}

test("glossario: filtro e lettere funzionano, definizioni corte su telefono", async ({ page, isMobile }) => {
  await page.goto("/glossario");
  const input = page.getByRole("searchbox", { name: "Cerca un termine" });
  await input.fill("fer");
  await expect(page.getByText(/termin[ei] per «fer»/)).toBeVisible();
  await expect(page.getByRole("link", { name: "Ferritina", exact: true })).toBeVisible();
  await input.fill("");
  await page.getByRole("navigation", { name: "Lettere" }).getByRole("link", { name: "T", exact: true }).click();
  await expect(page).toHaveURL(/#lettera-T$/);
  if (isMobile) {
    const h = await page.evaluate(() => document.documentElement.scrollHeight);
    expect(h, "altezza del glossario su telefono (era 31.944 px)").toBeLessThan(27_000);
  }
});

test("comandi da almeno 44 px: testata, scheda di un termine, guida", async ({ page, isMobile }) => {
  test.skip(!isMobile, "controllo pensato per il tocco");
  for (const path of ["/glossario/acido-folico", "/guide/emocromo", "/guide"]) {
    await page.goto(path);
    expect(await smallTargets(page, "main"), `${path}: main`).toEqual([]);
    const header = await page.evaluate(() =>
      [...document.querySelectorAll("header button")]
        .filter((e) => e.getBoundingClientRect().width > 0)
        .map((e) => Math.min(e.getBoundingClientRect().width, e.getBoundingClientRect().height)),
    );
    expect(Math.min(...header), `${path}: pulsanti della testata`).toBeGreaterThanOrEqual(44);
  }
});

test("a 375 px la testata non fa scorrere la pagina in orizzontale", async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: { width: 375, height: 700 }, isMobile: true, hasTouch: true });
  const page = await ctx.newPage();
  await page.goto("/");
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0);
  await ctx.close();
});

/** Bordi alto e basso di un elemento rispetto allo schermo (arrotondati al pixel). */
async function edges(el: Locator) {
  const b = await el.boundingBox();
  return b ? { top: Math.round(b.y), bottom: Math.round(b.y + b.height) } : null;
}

test("le barre fisse restano attaccate allo schermo: home, guida e area personale", async ({ page, isMobile }) => {
  test.skip(!isMobile, "barre pensate per il telefono");
  const height = page.viewportSize()!.height;

  // Home: la barra d'aiuto compare dopo la prima schermata, sul bordo basso dello schermo (non in fondo alla pagina).
  await gotoReady(page, "/");
  const help = page.locator(".mobile-help-bar");
  await expect(help).toHaveAttribute("data-shown", "false");
  await page.evaluate(() => window.scrollTo(0, Math.round(window.innerHeight * 1.6)));
  await expect(help).toHaveAttribute("data-shown", "true");
  await expect.poll(async () => (await edges(help))?.bottom, { message: "barra d'aiuto sul bordo basso dello schermo" }).toBe(height);
  await expect(help.getByRole("link", { name: /Ho un referto/ })).toBeInViewport();

  // Guida: la barra di lettura resta in cima allo schermo mentre si scorre.
  await gotoReady(page, "/guide/emocromo");
  await page.evaluate(() => window.scrollTo(0, 2400));
  const reading = page.locator(".reading-bar");
  await expect.poll(async () => (await edges(reading))?.top, { message: "barra di lettura in cima allo schermo" }).toBe(0);
  await expect.poll(async () => (await reading.boundingBox())?.width ?? 0, { message: "la barra di lettura avanza" }).toBeGreaterThan(20);

  // Area personale: la barra in basso è sempre sul bordo dello schermo, all'inizio e dopo lo scorrimento; «Torna su» le sta sopra.
  await gotoReady(page, "/accedi?next=/area-personale/impostazioni");
  await page.getByRole("button", { name: "Entra con l'account demo" }).click();
  await page.waitForURL(/\/area-personale\/impostazioni/);
  const bar = page.locator('nav[aria-label="Area personale"]:visible');
  await expect(bar).toHaveCount(1);
  await expect.poll(async () => (await edges(bar))?.bottom, { message: "barra dell'area sul bordo basso, in cima alla pagina" }).toBe(height);
  await page.evaluate(() => window.scrollTo(0, Math.round(window.innerHeight * 1.8)));
  const up = page.getByRole("button", { name: "Torna all'inizio della pagina" });
  await expect(up).toBeVisible();
  await expect.poll(async () => (await edges(bar))?.bottom, { message: "barra dell'area sul bordo basso, dopo lo scorrimento" }).toBe(height);
  const barTop = (await edges(bar))!.top;
  await expect.poll(async () => (await edges(up))?.bottom ?? 9999, { message: "«Torna su» sopra la barra dell'area" }).toBeLessThanOrEqual(barTop);
  // In fondo alla pagina l'ultima riga del piè di pagina si legge: resta sopra la barra.
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  const last = page.getByRole("contentinfo").getByRole("link", { name: "Stato del progetto" });
  await expect.poll(async () => (await edges(last))?.bottom ?? 9999, { message: "ultima riga del piè di pagina sopra la barra" }).toBeLessThanOrEqual(barTop);
});
