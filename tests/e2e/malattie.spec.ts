import { test, expect } from "@playwright/test";
import { expectAccessible } from "./_lib/a11y";

/** Sezione «Malattie» (22/11/2026): l'indice con dieci aree, la pagina tipo, la ricerca e i collegamenti da guide e diari. */

const senzaScorrimentoLaterale = async (page: import("@playwright/test").Page) =>
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0);

test("indice: dieci aree, la ricerca in cima, le quattro regole", async ({ page }) => {
  await page.goto("/malattie");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Le malattie più comuni");
  await expect(page.locator(".ml-area")).toHaveCount(10);
  await expect(page.locator(".ml-regole li")).toHaveCount(4);
  await senzaScorrimentoLaterale(page);
  await expectAccessible(page);
  await page.getByTestId("area-pressione-alta").click();
  await expect(page).toHaveURL(/\/malattie\/pressione-alta$/);
});

test("pagina tipo: in breve, numeri, quando chiamare, esami, diario, domande, fonti", async ({ page }) => {
  await page.goto("/malattie/pressione-alta");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Pressione alta");
  await expect(page.locator(".ml-breve li")).toHaveCount(3);
  await expect(page.locator("#in-numeri table")).toBeVisible();
  await expect(page.locator('a[href="tel:112"]').first()).toBeVisible();
  await expect(page.locator('#esami a[href^="/guide/"]').first()).toBeVisible();
  await expect(page.locator('a[href="/diari/pressione"]').first()).toBeVisible();
  await expect(page.locator("#fonti a[href^='https://']").first()).toBeVisible();
  await expect(page.getByText("Bozza", { exact: false }).first()).toBeVisible();
  await senzaScorrimentoLaterale(page);
  await expectAccessible(page);
});

test("tutte le dieci pagine si aprono, senza scorrimento laterale, e restano fuori dall'indice di Google", async ({ page }) => {
  for (const slug of ["pressione-alta", "diabete", "mal-di-testa", "sonno", "peso", "asma", "colesterolo-alto", "tiroide", "anemia", "fegato-grasso"]) {
    const r = await page.goto(`/malattie/${slug}`);
    expect(r?.status(), slug).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await senzaScorrimentoLaterale(page);
    const robots = await page.locator('meta[name="robots"]').getAttribute("content");
    expect(robots ?? "", slug).toMatch(/noindex/);
  }
});

test("dal tema scuro la pagina resta leggibile", async ({ page }) => {
  await page.goto("/malattie/diabete");
  await page.evaluate(() => document.documentElement.setAttribute("data-theme", "dark"));
  const bg = await page.evaluate(() => getComputedStyle(document.querySelector(".ml-breve") as Element).backgroundColor);
  expect(bg).not.toBe("rgb(255, 255, 255)");
  await expectAccessible(page);
});

test("guide e diari portano alla malattia", async ({ page }) => {
  await page.goto("/guide/ferritina");
  await expect(page.getByTestId("guida-malattie").locator('a[href="/malattie/anemia"]')).toBeVisible();
  await page.goto("/diari/pressione");
  await expect(page.locator('.dr-malattia a[href="/malattie/pressione-alta"]')).toBeVisible();
});

test("la ricerca trova la malattia prima di tutto il resto", async ({ page }) => {
  await page.goto("/malattie");
  await page.locator(".ml-veloci button", { hasText: "pressione alta" }).click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog.locator('a[href="/malattie/pressione-alta"]')).toBeVisible();
});
