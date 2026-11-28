import { test, expect } from "@playwright/test";

/** Miglioramenti del 16/11/2026: fascia «Perché fidarsi», barra 1 → 2 → 3, porte nella prima schermata del telefono. */
test("home: fascia «Perché fidarsi» con segnaposto finché mancano i dati del titolare", async ({ page }) => {
  await page.goto("/");
  // 19/11/2026, home «chiara e scura»: le quattro righe delle immagini approvate, e sotto «Chi c'è dietro» con il segnaposto.
  const trust = page.locator(".hb-sec-trust");
  await expect(trust).toBeVisible();
  for (const t of ["Gratis per capire", "Mai diagnosi", "Prove dichiarate", "I tuoi dati restano tuoi", "Chi c’è dietro"]) await expect(trust).toContainText(t);
  await expect(trust.getByRole("link", { name: "Chi c’è dietro" })).toHaveAttribute("href", "/chi-siamo");
  await expect(trust.locator('[data-segnaposto="titolare"]')).toHaveText("Nome, sede e P.IVA: da completare");
});

test("barra dei cinque passi: indica il passo corrente e porta agli altri", async ({ page }) => {
  // 22/11/2026: il percorso è in cinque passi.
  for (const [path, n] of [["/punto-di-partenza", 1], ["/prevenzione", 2], ["/lettura-referti", 3], ["/medici", 4], ["/prenditi-cura-di-te", 5]] as const) {
    await page.goto(path);
    const bar = page.locator("nav.ds-path:visible");
    await expect(bar).toHaveClass(new RegExp(`ds-path-on-${n}`));
    await expect(bar.locator("a")).toHaveCount(5);
    await expect(bar.locator('[aria-current="page"]')).toHaveCount(1);
  }
});

test("telefono: il percorso in cinque passi e il medico stanno nella prima schermata", async ({ page }) => {
  // 19/11/2026, home «chiara e scura»: al posto delle tre porte, i quattro passi e il riquadro del medico.
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const filo = page.getByRole("navigation", { name: "Il percorso, in cinque passi" });
  await expect(filo.getByRole("link")).toHaveCount(5);
  const medico = await page.locator("main .hb-docq").boundingBox();
  expect(medico && medico.y + medico.height).toBeLessThanOrEqual(844);
});
