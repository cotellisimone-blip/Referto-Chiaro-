import { test, expect } from "@playwright/test";
import { gotoReady } from "./_lib/ready";
import { expectAccessible } from "./_lib/a11y";

test.describe("ricerca del sito", () => {
  test("si apre dalla testata, trova una sigla e porta alla guida", async ({ page, isMobile }) => {
    await gotoReady(page, "/");
    await page.getByRole("button", { name: isMobile ? "Cerca nel sito" : "Apri la ricerca" }).first().click();
    const input = page.getByRole("searchbox", { name: /cerca una sigla/i });
    await expect(input).toBeFocused();
    await input.fill("tsh");
    const first = page.getByRole("list", { name: "Guide agli esami" }).getByRole("link").first();
    await expect(first).toContainText("TSH");
    await expectAccessible(page);
    await input.press("ArrowDown");
    await expect(first).toBeFocused();
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/guide\/tsh$/);
  });

  test("Esc chiude; nessun risultato mostra un suggerimento", async ({ page, isMobile }) => {
    test.skip(isMobile, "scorciatoia da tastiera: solo desktop");
    await gotoReady(page, "/guide");
    await page.keyboard.press("Control+k");
    const input = page.getByRole("searchbox", { name: /cerca una sigla/i });
    await expect(input).toBeVisible();
    await input.fill("zzqqxx");
    await expect(page.getByText(/Nessun risultato/)).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(input).toBeHidden();
  });

  test("l'indice pubblico non contiene dati personali e si può mettere in cache", async ({ request }) => {
    const res = await request.get("/api/v1/public/ricerca");
    expect(res.status()).toBe(200);
    expect(res.headers()["cache-control"]).toContain("public");
    const j = (await res.json()) as { items: { kind: string; href: string }[] };
    expect(j.items.length).toBeGreaterThan(200);
    expect(j.items.every((i) => i.href.startsWith("/"))).toBe(true);
  });
});

test.describe("strumento domande per il medico", () => {
  test("scelta degli esami, lista nell'URL, spunte e azioni", async ({ page }) => {
    await page.goto("/strumenti/domande-per-il-medico");
    await expect(page.getByRole("heading", { level: 1 })).toContainText("domande giuste");
    await expect(page.getByText("Scegli almeno un esame.")).toBeVisible();
    await page.getByRole("searchbox", { name: "Cerca un esame" }).fill("tsh");
    await page.getByRole("checkbox", { name: /^TSH/ }).check();
    await expect(page).toHaveURL(/esami=tsh/);
    await expect(page.getByRole("heading", { level: 3, name: /^TSH/ })).toBeVisible();
    await expect(page.getByRole("heading", { level: 3, name: "Da chiedere sempre" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Stampa" })).toBeVisible();
    await expectAccessible(page);
    // Ricaricando con lo stesso link la lista è la stessa.
    await page.goto("/strumenti/domande-per-il-medico?esami=tsh,emocromo");
    await expect(page.getByRole("heading", { level: 3, name: /^TSH/ })).toBeVisible();
    await expect(page.getByRole("heading", { level: 3, name: /^Emocromo/ })).toBeVisible();
    const txt = (await page.locator("body").innerText()).toLowerCase();
    for (const banned of ["nella norma", "in pochi minuti", "medici qualificati", "€"]) expect(txt).not.toContain(banned);
  });

  test("dalla guida si arriva allo strumento con l'esame già scelto", async ({ page }) => {
    await page.goto("/guide/tsh");
    await page.getByRole("link", { name: "Prepara le domande per il medico" }).click();
    await expect(page).toHaveURL(/domande-per-il-medico\?esami=tsh/);
    await expect(page.getByRole("heading", { level: 3, name: /^TSH/ })).toBeVisible();
  });
});

test.describe("guide e glossario con filtro", () => {
  test("hub guide: il filtro restringe e il bottone di categoria funziona", async ({ page }) => {
    await page.goto("/guide");
    await page.getByRole("searchbox", { name: "Cerca una guida" }).fill("ferrit");
    await expect(page.getByText(/guid[ae] per «ferrit»/)).toBeVisible();
    await expect(page.locator("a[href='/guide/ferritina']")).toBeVisible();
    await page.getByRole("button", { name: "Cancella la ricerca" }).click();
    await page.getByRole("button", { name: "Tiroide" }).click();
    await expect(page.locator("a[href='/guide/tsh']")).toBeVisible();
    await expect(page.locator("a[href='/guide/emocromo']")).toHaveCount(0);
    await expectAccessible(page);
  });

  test("glossario: filtro dal vivo", async ({ page }) => {
    await page.goto("/glossario");
    await page.getByRole("searchbox", { name: "Cerca un termine" }).fill("ematocr");
    await expect(page.locator("a[href='/glossario/ematocrito']")).toBeVisible();
    await expect(page.getByRole("navigation", { name: "Lettere" })).toHaveCount(0);
    await expectAccessible(page);
  });

  test("una guida ha l'indice laterale su desktop e la barra di lettura", async ({ page, isMobile }) => {
    await page.goto("/guide/tsh");
    await expect(page.locator(".reading-bar")).toHaveCount(1);
    if (!isMobile) await expect(page.getByRole("navigation", { name: "In questa pagina" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Stampa la guida" })).toBeVisible();
  });
});

test("torna su compare dopo lo scorrimento", async ({ page }) => {
  await page.goto("/");
  const btn = page.locator(".back-to-top");
  await expect(btn).toHaveCount(0);
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await expect(btn).toBeVisible();
  await btn.click();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(10);
});
