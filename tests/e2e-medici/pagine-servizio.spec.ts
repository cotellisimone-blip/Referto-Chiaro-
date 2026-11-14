import { test, expect } from "@playwright/test";

/** Ciclo 3, fase 3, con i medici accesi: le pagine dei servizi con un medico restano corte su telefono e hanno la loro immagine di condivisione. */

for (const path of ["/servizi/parla-con-un-medico", "/servizi/secondo-parere"]) {
  test(`${path}: al massimo 7,3 schermate su telefono e azione principale nella prima`, async ({ page }, info) => {
    test.skip(info.project.name !== "mobile", "misura su telefono");
    await page.goto(path);
    const h = await page.evaluate(() => document.documentElement.scrollHeight / window.innerHeight);
    // Erano 7,6 (Parla con un medico) e 7,2 (Secondo parere) schermate da 844 px.
    expect(h, "schermate").toBeLessThan(7.3);
    const cta = page.locator("#servizio-titolo").locator("xpath=ancestor::section[1]").locator("a.btn").first();
    const box = (await cta.boundingBox())!;
    expect(box.y + box.height).toBeLessThan(844);
  });
}

for (const path of ["/servizi/parla-con-un-medico", "/servizi/secondo-parere"]) {
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
