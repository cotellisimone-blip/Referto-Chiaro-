import { expect, test } from "@playwright/test";

/** Con i medici accesi: alla fine di Punto di Partenza la seconda proposta è il videoconsulto, con il suo prezzo. */
test("percorso fino alla scheda: accanto a «Capisci» c'è «Parla con un medico» con il prezzo", async ({ page }) => {
  await page.goto("/punto-di-partenza");
  await page.getByLabel("Prepararmi a parlarne con il medico").check();
  await page.getByRole("button", { name: "Avanti" }).click();
  await page.getByLabel("Esami del sangue recenti").check();
  await page.getByRole("button", { name: "Avanti" }).click();
  await page.getByRole("group", { name: "Fascia d'età" }).getByLabel("50–64").check();
  await page.getByRole("group", { name: "Fumi?" }).getByLabel("Sì", { exact: true }).check();
  await page.getByRole("button", { name: "Avanti" }).click();
  await expect(page.getByRole("heading", { name: "Le 10 aree da conoscere" })).toBeVisible();
  await page.getByRole("button", { name: "Crea la mia scheda" }).click();
  await expect(page.getByRole("heading", { name: "Il tuo Punto di Partenza è pronto." })).toBeVisible();
  await expect(page.getByRole("link", { name: /Rendi chiaro il primo referto — 2,90/ })).toBeVisible();
  await expect(page.getByRole("link", { name: /Parla con un medico — 69/ })).toBeVisible();
});
