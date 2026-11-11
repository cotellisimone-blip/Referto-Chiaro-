import { test, expect, type Page } from "@playwright/test";

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
        return r.height < 44 || r.width < 44;
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
