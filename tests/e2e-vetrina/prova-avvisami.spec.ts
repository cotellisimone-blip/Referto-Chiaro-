import { test, expect } from "@playwright/test";

/**
 * Ciclo 3, fase 1: ogni prova finisce con «Avvisami quando parte», senza tornare indietro.
 * Esempio di Capisci e account demo (Parla con un medico, Secondo parere) sulla build vetrina.
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
  await expect(card.getByRole("radio", { name: "Capisci il referto" })).toBeChecked();
  await card.getByLabel("Indirizzo email").fill(email("esempio"));
  await card.getByRole("checkbox").check();
  await card.getByRole("button", { name: /Iscrivimi/ }).click();
  await expect(card.getByText("Interesse registrato.")).toBeVisible();
  await expect(card.getByTestId("waitlist-next").getByRole("link", { name: /Punto di Partenza/ })).toBeVisible();
  await expect.poll(events).toEqual(expect.arrayContaining(["esempio-completato", "esempio-utile-si", "avvisami-capisci", "avvisami-da-prova"]));
});

for (const s of [
  { path: "/area-personale/appuntamenti", radio: "Videoconsulto" },
  { path: "/area-personale/secondo-parere", radio: "Secondo parere" },
]) {
  test(`account demo, ${s.path}: «Avvisami» per il servizio provato`, async ({ page }) => {
    await page.goto(`/accedi?next=${s.path}`);
    await page.getByRole("button", { name: "Entra con l'account demo" }).click();
    await expect(page).toHaveURL(new RegExp(`${s.path}$`), { timeout: 15_000 });
    const card = page.getByTestId("prova-avvisami");
    await expect(card).toBeVisible({ timeout: 15_000 });
    await expect(card.getByRole("radio", { name: s.radio })).toBeChecked();
    await card.getByLabel("Indirizzo email").fill(email("demo"));
    await card.getByRole("checkbox").check();
    await card.getByRole("button", { name: /Iscrivimi/ }).click();
    await expect(card.getByText("Interesse registrato.")).toBeVisible();
  });
}

test("si può cambiare servizio prima di iscriversi, da tastiera", async ({ page }) => {
  await page.goto("/accedi?next=/area-personale");
  await page.getByRole("button", { name: "Entra con l'account demo" }).click();
  const card = page.getByTestId("prova-avvisami");
  await expect(card.getByRole("radio", { name: "Capisci il referto" })).toBeChecked({ timeout: 15_000 });
  await card.getByRole("radio", { name: "Capisci il referto" }).focus();
  await page.keyboard.press("ArrowRight");
  await expect(card.getByRole("radio", { name: "Visita a domicilio" })).toBeChecked();
});

test("ciclo 4: in vetrina il domicilio raccoglie email e CAP, sulla pagina del servizio e a fine prova", async ({ page }) => {
  await page.goto("/servizi/visita-a-domicilio");
  const sezione = page.locator("#avvisami");
  await expect(sezione.getByRole("heading", { name: "Avvisami quando parte nella mia zona" })).toBeVisible();
  await sezione.getByLabel("Indirizzo email").fill(`vetrina-zona-${Date.now()}@esempio.test`);
  await sezione.getByLabel("CAP dove vorresti la visita").fill("25122");
  await sezione.getByRole("checkbox").check();
  await sezione.getByRole("button", { name: "Avvisami per la mia zona" }).click();
  await expect(sezione.getByText("Interesse registrato.")).toBeVisible();

  await page.goto("/richiedi/domicilio");
  const card = page.getByTestId("prova-avvisami");
  await expect(card).toBeVisible({ timeout: 15_000 });
  await expect(card.getByRole("radio", { name: "Visita a domicilio" })).toBeChecked();
  await expect(card.getByLabel("CAP dove vorresti la visita")).toBeVisible();
});
