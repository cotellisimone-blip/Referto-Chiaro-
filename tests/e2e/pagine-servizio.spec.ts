import { test, expect } from "@playwright/test";

/**
 * Ciclo 3, fase 3: pagine dei servizi più corte su telefono, numeri uguali ovunque, un'immagine di condivisione per pagina.
 * Stato di lancio, senza medici: le pagine dei servizi con un medico sono provate in tests/e2e-medici.
 */

for (const path of ["/referti"]) {
  test(`${path}: al massimo 7,3 schermate su telefono e azione principale nella prima`, async ({ page }, info) => {
    test.skip(info.project.name !== "mobile", "misura su telefono");
    await page.goto(path);
    const h = await page.evaluate(() => document.documentElement.scrollHeight / window.innerHeight);
    // Erano 9,9 schermate da 844 px.
    expect(h, "schermate").toBeLessThan(7.3);
    const cta = page.locator("#servizio-titolo").locator("xpath=ancestor::section[1]").locator("a.btn").first();
    const box = (await cta.boundingBox())!;
    expect(box.y + box.height).toBeLessThan(844);
  });
}

test("la scheda in home, il «prima e dopo» e l'esempio usano gli stessi valori", async ({ page }) => {
  await page.goto("/referti");
  const slider = page.locator("#differenza-titolo").locator("xpath=ancestor::section[1]");
  await expect(slider.getByText("Colesterolo LDL").first()).toBeAttached();
  await expect(slider.getByText("134").first()).toBeAttached();
  await page.goto("/");
  const html = await page.content();
  expect(html).not.toContain(">104<");
  await page.goto("/referti/esempio");
  await expect(page.getByText("134").first()).toBeAttached();
});

for (const path of ["/referti", "/referti/esempio", "/punto-di-partenza"]) {
  test(`${path}: immagine di condivisione propria`, async ({ page, request }, info) => {
    test.skip(info.project.name !== "desktop", "una sola esecuzione");
    await page.goto(path);
    const og = await page.locator('meta[property="og:image"]').getAttribute("content");
    expect(og).toContain(`${path}/opengraph-image`);
    const r = await request.get(new URL(og!).pathname + new URL(og!).search);
    expect(r.status()).toBe(200);
    expect(r.headers()["content-type"]).toContain("image/png");
  });
}
