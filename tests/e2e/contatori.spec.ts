import { test, expect } from "@playwright/test";

/** Ciclo 3, fase 4: una visita conta una volta per scheda; ricaricare o tornare sulla pagina non la ripete. */

test("ricarica e ritorno sulla stessa pagina non contano una seconda visita", async ({ page }, info) => {
  test.skip(info.project.name !== "desktop", "una sola esecuzione");
  let beacons = 0;
  page.on("request", (r) => {
    if (r.url().endsWith("/api/v1/public/evento")) beacons++;
  });
  await page.goto("/servizi/secondo-parere");
  await expect.poll(() => beacons).toBe(1);
  await page.reload();
  await page.waitForLoadState("networkidle");
  // Navigazione interna verso un'altra pagina e ritorno: solo la nuova pagina conta.
  await page.getByRole("link", { name: /Videoconsulto/ }).first().click();
  await expect(page).toHaveURL(/parla-con-un-medico/);
  await expect.poll(() => beacons).toBe(2);
  await page.goBack();
  await expect(page).toHaveURL(/secondo-parere/);
  await page.waitForLoadState("networkidle");
  expect(beacons).toBe(2);
});

test("un robot non entra nei contatori ma riceve la stessa risposta", async ({ request }) => {
  const r = await request.post("/api/v1/public/evento", {
    headers: { "user-agent": "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)" },
    data: { event: "visita-home" },
  });
  expect(r.status()).toBe(204);
});
