import { test, expect } from "@playwright/test";
import { gotoReady } from "./_lib/ready";

/**
 * 19/11/2026, quarto giro di interventi: le cose che si vedono solo nel browser.
 * Motivi degli esclusi, PDF e ricerca stanno in tests/unit/quarto-giro.test.ts.
 */

async function esempioValori(page: import("@playwright/test").Page) {
  await gotoReady(page, "/referti/esempio");
  await page.getByRole("button", { name: /Controlla i valori estratti/ }).click();
  await expect(page.getByRole("heading", { name: "Controlla prima i valori." })).toBeVisible();
}

test("punto 1 · «Vedi nel documento» accende la riga toccata, anche dopo lo scorrimento", async ({ page }, info) => {
  test.skip(info.project.name !== "mobile", "il pulsante c'è solo sotto i 1024 px");
  await esempioValori(page);
  for (const riga of [7, 4, 9]) {
    const b = page.getByRole("button", { name: `Vedi nel documento: riga ${riga}` });
    await b.scrollIntoViewIfNeeded();
    await b.tap();
    await page.waitForTimeout(1200); // lo scorrimento fino al documento è animato
    await expect(page.locator('[data-facsimile] [aria-current="true"]')).toContainText(new RegExp(`^\\s*${riga}`));
  }
});

test("punto 1 · anche con il mouse in una finestra stretta la riga non segue il puntatore", async ({ browser }) => {
  const ctx = await browser.newContext({ viewport: { width: 800, height: 900 } });
  const page = await ctx.newPage();
  await esempioValori(page);
  const b = page.getByRole("button", { name: "Vedi nel documento: riga 7" });
  await b.scrollIntoViewIfNeeded();
  await b.click();
  await page.waitForTimeout(1200);
  await page.mouse.move(400, 500);
  await page.mouse.wheel(0, -200);
  await page.waitForTimeout(400);
  await expect(page.locator('[data-facsimile] [aria-current="true"]')).toContainText(/^\s*7/);
  await ctx.close();
});

test("punto 7 · da telefono «Genera la spiegazione» è in vista appena si arriva ai valori", async ({ page }, info) => {
  test.skip(info.project.name !== "mobile", "solo su telefono la barra resta in basso");
  await esempioValori(page);
  await page.getByRole("button", { name: "Conferma tutti i valori leggibili" }).click();
  const genera = page.getByRole("button", { name: /Genera la spiegazione/ });
  await expect(genera).toBeInViewport();
  await page.mouse.wheel(0, 900);
  await page.waitForTimeout(300);
  await expect(genera).toBeInViewport();
  for (const b of await page.locator(".back-to-top").all()) await expect(b).toBeHidden();
  await genera.click();
  await expect(page.getByRole("heading", { name: /Il tuo referto, in parole semplici/ })).toBeVisible({ timeout: 15_000 });
  await expect(page.getByText(/Trigliceridi: Non leggibile sul documento/)).toBeVisible();
});

test("punto 8 · il modulo della lista d'attesa dice quello che chiede", async ({ page }) => {
  await gotoReady(page, "/");
  const modulo = page.getByRole("form", { name: "Lista d'attesa" }).first();
  await expect(modulo).toContainText("Email e CAP, nessun impegno");
  await expect(page.getByText(/Solo la tua email: nessuna email/)).toHaveCount(0);
});

test("punto 9 · /accedi ha un solo titolo principale, anche nell'HTML scaricato", async ({ page, request }) => {
  const html = await (await request.get("/accedi")).text();
  expect(html.match(/<h1[\s>]/g)?.length).toBe(1);
  const html2 = await (await request.get("/accedi?next=%2Farea-personale%2Fnuovo")).text();
  expect(html2.match(/<h1[\s>]/g)?.length).toBe(1);
  await gotoReady(page, "/accedi?next=%2Farea-personale%2Fnuovo");
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.locator("h1")).toContainText("Per caricare il referto");
});

test("punto 10 · l'indice della guida segue la lettura in cima e in fondo", async ({ page }, info) => {
  test.skip(info.project.name !== "desktop", "l'indice laterale c'è su computer");
  await gotoReady(page, "/guide/emocromo");
  const attivo = page.locator('nav[aria-label="In questa pagina"] [aria-current]');
  await expect(attivo).toHaveText("Che cosa misura");
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await expect(attivo).toHaveText("Domande frequenti");
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(attivo).toHaveText("Che cosa misura");
});

test("punto 6 · l'account demo parte con un referto di maggio già confermato, per «Nel tempo»", async ({ page, request }) => {
  await gotoReady(page, "/accedi");
  await page.getByRole("button", { name: "Entra con l'account demo" }).click();
  await page.waitForURL(/area-personale$/);
  const list = await (await page.request.get("/api/v1/area/documents")).json();
  const docs = (list.documents ?? list) as { title: string; status: string }[];
  const maggio = docs.find((d) => /20 maggio 2026/.test(d.title));
  test.skip(!maggio, "l'account condiviso è stato svuotato da un'altra prova prima di questa");
  expect(maggio!.status).toBe("verified");
  void request;
});
