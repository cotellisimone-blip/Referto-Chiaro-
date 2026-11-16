import { test, expect } from "@playwright/test";

/** Miglioramenti del 16/11/2026: fascia «Perché fidarsi», barra 1 → 2 → 3, porte nella prima schermata del telefono. */
test("home: fascia «Perché fidarsi» con segnaposto finché mancano i dati del titolare", async ({ page }) => {
  await page.goto("/");
  const trust = page.locator(".ds-trust");
  await expect(trust).toBeVisible();
  for (const t of ["Chi c", "Risponde una persona", "Dati mai venduti", "Fonti ufficiali"]) await expect(trust).toContainText(t);
  await expect(trust.locator('[data-segnaposto="titolare"]')).toHaveText("Nome, sede e P.IVA: da completare");
});

test("barra delle sezioni: indica la sezione corrente e porta alle altre", async ({ page }) => {
  for (const [path, n] of [["/prevenzione", 1], ["/lettura-referti", 2], ["/medici", 3]] as const) {
    await page.goto(path);
    const bar = page.locator("nav.ds-path:visible");
    await expect(bar).toHaveClass(new RegExp(`ds-path-on-${n}`));
    await expect(bar.locator("a")).toHaveCount(3);
    await expect(bar.locator('[aria-current="page"]')).toHaveCount(1);
  }
});

test("telefono: le tre porte stanno nella prima schermata", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const doors = page.locator(".ds-hero .ds-door");
  await expect(doors).toHaveCount(3);
  const last = await doors.nth(2).boundingBox();
  expect(last && last.y + last.height).toBeLessThanOrEqual(844);
});
