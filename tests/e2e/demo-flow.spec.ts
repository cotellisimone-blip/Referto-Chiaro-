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

test("fase 3: su telefono il passo attuale è scritto per intero e il facsimile non scorre in orizzontale", async ({ page }) => {
  await page.goto("/referti/esempio");
  const mobile = (page.viewportSize()?.width ?? 1440) < 640;
  const nav = page.getByRole("navigation", { name: "Avanzamento della demo" });
  await expect(nav.locator('[aria-current="step"]')).toContainText("Documento");
  if (mobile) {
    const current = nav.locator("[data-step-current]");
    await expect(current).toContainText("Passo 1 di 4");
    await expect(current).toBeVisible();
    await expect(current).toContainText("Documento");
    expect(await current.evaluate((el) => el.scrollWidth <= el.clientWidth), "nome del passo non troncato").toBe(true);
  }
  const doc = page.getByRole("region", { name: "Testo del documento, scorrevole" });
  // Nome, risultato, unità e intervallo: tutti visibili, nessuno fuori dal riquadro.
  await doc.scrollIntoViewIfNeeded();
  const width = page.viewportSize()?.width ?? 1440;
  for (const t of ["Emoglobina glicata (HbA1c)", "5,1", "%", "4,0 - 5,6"]) {
    const cell = doc.getByText(t, { exact: true });
    await expect(cell).toBeVisible();
    const box = (await cell.boundingBox())!;
    expect(box.x, t).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width, t).toBeLessThanOrEqual(width);
  }
  if (mobile) expect(await doc.evaluate((el) => el.scrollWidth - el.clientWidth), "scroll orizzontale nel facsimile").toBeLessThanOrEqual(0);
  await page.getByRole("button", { name: "Controlla i valori estratti" }).click();
  if (mobile) await expect(nav.locator("[data-step-current]")).toHaveText(/Passo 2 di 4 · Valori/);
  await expectNoHorizontalOverflow(page);
});

test("«prima e dopo» con il cursore, anche su telefono, da tastiera", async ({ page }) => {
  await page.goto("/referti");
  const slider = page.getByRole("slider", { name: /Sposta per confrontare/ });
  await expect(slider).toBeVisible();
  await expect(page.getByRole("radio", { name: /Prima/ })).toHaveCount(0);
  await slider.focus();
  await page.keyboard.press("Home");
  await expect(slider).toHaveValue("0");
  await page.keyboard.press("End");
  await expect(slider).toHaveValue("100");
  await expectNoHorizontalOverflow(page);
});

test("ciclo 3: alla fine dell'esempio si risponde a «Ti è stato utile?» e si passa al servizio vero", async ({ page }) => {
  await page.goto("/referti/esempio");
  await page.getByRole("button", { name: /Controlla i valori/ }).click();
  await page.getByRole("button", { name: /Conferma tutti/ }).click();
  await page.getByRole("button", { name: /Genera la spiegazione/ }).click();
  const fine = page.getByTestId("esempio-fine");
  await expect(fine).toBeVisible({ timeout: 15_000 });
  await fine.getByRole("button", { name: "Non molto" }).click();
  await expect(fine.getByRole("status").filter({ hasText: /Grazie/ })).toBeVisible();
  await expect(fine.getByRole("link", { name: /Rendi chiaro il mio referto/ })).toHaveAttribute("href", "/area-personale/nuovo");
  // Fuori dalla vetrina niente lista d'attesa: il servizio si prova davvero.
  await expect(page.getByTestId("prova-avvisami")).toHaveCount(0);
});
