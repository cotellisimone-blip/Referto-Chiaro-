import { test, expect, type Page } from "@playwright/test";

async function expectNoHorizontalOverflow(page: Page) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  expect(overflow, "scroll orizzontale involontario").toBeLessThanOrEqual(0);
}

test("demo completa: documento → controllo valori → spiegazione → PDF", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(e.message));

  await page.goto("/referti/esempio");
  await expect(page.getByRole("heading", { name: "Questo è il referto di esempio." })).toBeVisible();
  await page.getByRole("button", { name: "Controlla i valori estratti" }).click();

  await expectNoHorizontalOverflow(page);
  const generate = page.getByRole("button", { name: "Genera la spiegazione" });
  await expect(generate).toBeDisabled();
  // Il valore illeggibile non ha una casella di conferma.
  await expect(page.getByRole("checkbox", { name: /Trigliceridi/ })).toHaveCount(0);
  await expect(page.getByText("Valore non leggibile: verifica il documento originale.", { exact: false })).toBeVisible();

  await page.getByRole("button", { name: "Conferma tutti i valori leggibili" }).click();
  await expect(page.getByText("5 di 5 valori leggibili confermati")).toBeVisible();
  await generate.click();

  await expect(page.getByRole("heading", { name: "Il tuo referto, in parole semplici." })).toBeVisible();
  const items = page.getByRole("list", { name: "Spiegazione dei valori" }).getByRole("listitem");
  await expect(items).toHaveCount(5);
  // Numeri identici al documento.
  await expect(items.filter({ hasText: "Emoglobina glicata" })).toContainText("5,1");
  await expect(items.filter({ hasText: "Creatinina" })).toContainText("0,89");
  await expect(page.getByText("Non inclusi nella spiegazione")).toBeVisible();
  await expectNoHorizontalOverflow(page);

  const [download] = await Promise.all([page.waitForEvent("download"), page.getByRole("button", { name: "Scarica il PDF di esempio" }).click()]);
  expect(download.suggestedFilename()).toBe("cura-privata-esempio-DEMO.pdf");
  await expect(page.getByText("Documento scaricato.")).toBeVisible();

  expect(errors).toEqual([]);
});

test("spiega solo i valori confermati", async ({ page }) => {
  await page.goto("/referti/esempio");
  await page.getByRole("button", { name: "Controlla i valori estratti" }).click();
  await page.getByRole("checkbox", { name: /Glicemia/ }).check();
  await page.getByRole("button", { name: "Genera la spiegazione" }).click();
  const items = page.getByRole("list", { name: "Spiegazione dei valori" }).getByRole("listitem");
  await expect(items).toHaveCount(1);
  await expect(items.first()).toContainText("Glicemia");
});
