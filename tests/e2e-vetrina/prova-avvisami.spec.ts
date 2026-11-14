import { test, expect } from "@playwright/test";

/**
 * Ciclo 3, fase 1: ogni prova finisce con «Avvisami quando parte», senza tornare indietro.
 * 14/11/2026: il sito parte senza medici (src/lib/medici.ts), anche in vetrina. Qui la prova è una sola, «Capisci»;
 * le prove dei servizi con un medico stanno in tests/e2e-vetrina-medici, sulla build con i medici accesi.
 */

const email = (tag: string) => `${tag}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}@esempio.test`;

test("alla fine dell'esempio: «Ti è stato utile?» risponde e ci si iscrive a Capisci", async ({ page }) => {
  // I contatori viaggiano con sendBeacon: li registriamo nella pagina per leggerli.
  await page.addInitScript(() => {
    const w = window as unknown as { __ev: string[] };
    w.__ev = [];
    const orig = navigator.sendBeacon.bind(navigator);
    navigator.sendBeacon = (url, data) => {
      if (String(url).endsWith("/api/v1/public/evento") && data instanceof Blob) void data.text().then((t) => w.__ev.push(JSON.parse(t).event));
      return orig(url, data);
    };
  });
  const events = () => page.evaluate(() => (window as unknown as { __ev: string[] }).__ev);
  await page.goto("/referti/esempio");
  await page.getByRole("button", { name: /Controlla i valori/ }).click();
  await page.getByRole("button", { name: /Conferma tutti/ }).click();
  await page.getByRole("button", { name: /Genera la spiegazione/ }).click();
  const fine = page.getByTestId("esempio-fine");
  await expect(fine).toBeVisible({ timeout: 15_000 });
  // In vetrina nessun link verso l'area personale alla fine della prova.
  await expect(fine.getByRole("link", { name: /Rendi chiaro il mio referto/ })).toHaveCount(0);
  await fine.getByRole("button", { name: "Sì, è chiaro" }).click();
  await expect(fine.getByText(/Grazie/)).toBeVisible();

  const card = page.getByTestId("prova-avvisami");
  // Senza medici il servizio è uno solo: nessuna scelta da fare.
  await expect(card.getByRole("radio")).toHaveCount(0);
  await card.getByLabel("Indirizzo email").fill(email("esempio"));
  await card.getByRole("checkbox").check();
  await card.getByRole("button", { name: /Iscrivimi/ }).click();
  await expect(card.getByText("Interesse registrato.")).toBeVisible();
  await expect(card.getByTestId("waitlist-next").getByRole("link", { name: /Punto di Partenza/ })).toBeVisible();
  await expect.poll(events).toEqual(expect.arrayContaining(["esempio-completato", "esempio-utile-si", "avvisami-capisci", "avvisami-da-prova"]));
});

test("account demo: «Avvisami» a fine prova, per l'unico servizio aperto, senza servizi con un medico", async ({ page }) => {
  await page.goto("/accedi?next=/area-personale");
  await page.getByRole("button", { name: "Entra con l'account demo" }).click();
  await expect(page).toHaveURL(/\/area-personale$/, { timeout: 15_000 });
  const card = page.getByTestId("prova-avvisami");
  await expect(card).toBeVisible({ timeout: 15_000 });
  await expect(card.getByRole("radio")).toHaveCount(0);
  await expect(card).not.toContainText(/domicilio|Videoconsulto|Secondo parere/i);
  await card.getByLabel("Indirizzo email").fill(email("demo"));
  await card.getByRole("checkbox").check();
  await card.getByRole("button", { name: /Iscrivimi/ }).click();
  await expect(card.getByText("Interesse registrato.")).toBeVisible();
});

test("account demo: le pagine dei servizi con un medico portano a «Presto anche con un medico»", async ({ page }) => {
  await page.goto("/accedi?next=/area-personale");
  await page.getByRole("button", { name: "Entra con l'account demo" }).click();
  await expect(page).toHaveURL(/\/area-personale$/, { timeout: 15_000 });
  for (const path of ["/area-personale/appuntamenti", "/area-personale/secondo-parere", "/richiedi/domicilio"]) {
    await page.goto(path);
    await expect(page, path).toHaveURL(/\/con-un-medico$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Presto anche con un medico.");
  }
});
