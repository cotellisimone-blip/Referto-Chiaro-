import { test, expect } from "@playwright/test";

/**
 * Ciclo 3, fase 1, con i medici accesi in vetrina: l'account demo fa provare i servizi con un medico e ogni prova finisce
 * con «Avvisami quando parte» per il servizio provato. La prova di «Capisci» sta in tests/e2e-vetrina.
 */

const email = (tag: string) => `${tag}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}@esempio.test`;

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
