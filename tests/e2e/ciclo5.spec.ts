import { test, expect, type Locator, type Page } from "@playwright/test";

/**
 * Ciclo 5: il report fa vedere subito che cosa guardare e il percorso da telefono resta in cinque tocchi,
 * con il comando principale sempre nella prima schermata.
 */

const TABBAR = 66;

/** Il comando è tutto dentro lo schermo, sopra la barra dell'area personale. */
async function expectInFirstScreen(page: Page, loc: Locator) {
  await expect(loc).toBeVisible();
  await expect
    .poll(async () => {
      const bb = await loc.boundingBox();
      const vh = page.viewportSize()!.height;
      return !!bb && bb.y >= 0 && bb.y + bb.height <= vh - TABBAR;
    })
    .toBe(true);
}

test.describe("ciclo 5 · colpo d'occhio e percorso", () => {
  test("dal referto al report in cinque tocchi, con il comando sempre in vista su telefono", async ({ page }, info) => {
    const phone = info.project.name === "mobile";
    await page.goto("/accedi?next=%2Farea-personale%2Fnuovo");
    await page.getByRole("button", { name: "Entra con l'account demo" }).click();
    await expect(page).toHaveURL(/\/area-personale\/nuovo/);
    await expect(page.getByRole("heading", { name: "Scegli un referto di esempio." })).toBeVisible();

    let taps = 0;
    const tap = async (loc: Locator) => {
      if (phone) await expectInFirstScreen(page, loc);
      taps++;
      await loc.click();
    };

    await tap(page.getByRole("button", { name: /Aggiungi e leggi il documento/ }));
    await expect(page.getByRole("heading", { name: "Controlla prima i valori." })).toBeVisible({ timeout: 15_000 });
    await tap(page.getByRole("button", { name: "Conferma tutti i valori leggibili" }));
    await tap(page.getByRole("button", { name: /Salva e scegli il servizio/ }));
    // Il passo si apre dal suo inizio: titolo e prezzo, non il piè di pagina.
    await expect(page.getByRole("heading", { name: "Rendi chiaro il tuo referto." })).toBeInViewport();
    await tap(page.getByRole("button", { name: /Paga .* e ricevi il report/ }));
    await expect(page.getByRole("heading", { name: "Il tuo ordine." })).toBeVisible();
    await tap(page.getByRole("button", { name: "Conferma il pagamento di prova" }));

    // Dopo il pagamento si arriva al report, senza un altro tocco.
    await expect(page).toHaveURL(/\/area-personale\/documenti\/[^/?]+\?pagato=1&prova=1$/, { timeout: 20_000 });
    await expect(page.getByTestId("pagamento-registrato")).toContainText("Pagamento di prova registrato.");
    const glance = page.getByTestId("colpo-occhio");
    await expect(glance).toBeVisible({ timeout: 20_000 });
    expect(taps).toBe(5);

    // Prima schermata: quanti valori, quanti fuori e quale.
    await expect(glance.getByRole("heading", { name: "5 valori letti" })).toBeInViewport();
    await expect(glance).toContainText("dentro l'intervallo stampato");
    await expect(glance).toContainText("sopra");
    await expect(glance.getByText("Colesterolo LDL")).toBeInViewport();
    await expect(glance).toContainText("non un giudizio");
  });

  test("il report mette prima il valore fuori dall'intervallo e la domanda nomina l'esame", async ({ page }) => {
    await page.goto("/accedi?next=%2Farea-personale%2Fnuovo");
    await page.getByRole("button", { name: "Entra con l'account demo" }).click();
    await expect(page.getByRole("heading", { name: "Scegli un referto di esempio." })).toBeVisible();
    await page.getByRole("button", { name: /Aggiungi e leggi il documento/ }).click();
    await page.getByRole("button", { name: "Conferma tutti i valori leggibili" }).click({ timeout: 15_000 });
    await page.getByRole("button", { name: /Salva e scegli il servizio/ }).click();
    await page.getByRole("button", { name: /Paga .* e ricevi il report/ }).click();
    await page.getByRole("button", { name: "Conferma il pagamento di prova" }).click();

    const cards = page.getByTestId("valori-colpo-occhio").getByRole("listitem");
    await expect(cards).toHaveCount(5, { timeout: 20_000 });
    const first = cards.first();
    await expect(first).toContainText("Colesterolo LDL");
    await expect(first).toContainText("Sopra l'intervallo stampato");
    // La voce fuori dall'intervallo è già aperta, le altre sono chiuse.
    await expect(first.locator("details").first()).toHaveAttribute("open", "");
    await expect(cards.nth(1).locator("details").first()).not.toHaveAttribute("open", "");
    await expect(cards.nth(1)).toContainText("Dentro l'intervallo stampato");

    // «Da chiedere al medico» porta alla scheda del valore.
    await page.getByTestId("colpo-occhio").getByRole("link", { name: /Colesterolo LDL/ }).or(page.getByTestId("colpo-occhio").getByRole("button", { name: /Colesterolo LDL/ })).click();
    await expect(first).toBeInViewport();

    const questions = page.locator("#domande-medico");
    await expect(questions.getByRole("listitem").first()).toHaveText(/Colesterolo LDL: il numero è sopra l'intervallo stampato dal laboratorio\. Che cosa significa nel mio caso, se significa qualcosa\?/);

    // Nessun aggettivo clinico nel report.
    const text = (await page.locator("main").innerText()).toLowerCase();
    for (const banned of ["nella norma", "valore alto", "valore basso", "anomal", "patologic", "preoccup"]) expect(text).not.toContain(banned);

    // Pagina mai più larga dello schermo, anche con tutte le schede aperte.
    await page.getByRole("button", { name: "Apri tutte" }).click();
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
  });

  test("su telefono il report sta in meno di sei schermate", async ({ page }, info) => {
    test.skip(info.project.name !== "mobile", "misura solo su telefono");
    await page.goto("/accedi?next=%2Farea-personale%2Fnuovo");
    await page.getByRole("button", { name: "Entra con l'account demo" }).click();
    await page.getByRole("button", { name: /Aggiungi e leggi il documento/ }).click();
    await page.getByRole("button", { name: "Conferma tutti i valori leggibili" }).click({ timeout: 15_000 });
    await page.getByRole("button", { name: /Salva e scegli il servizio/ }).click();
    await page.getByRole("button", { name: /Paga .* e ricevi il report/ }).click();
    await page.getByRole("button", { name: "Conferma il pagamento di prova" }).click();
    await expect(page.getByTestId("colpo-occhio")).toBeVisible({ timeout: 20_000 });
    await page.goto(page.url().split("?")[0]);
    await expect(page.getByTestId("colpo-occhio")).toBeVisible({ timeout: 20_000 });
    const screens = await page.evaluate(() => document.documentElement.scrollHeight / window.innerHeight);
    expect(screens).toBeLessThan(6);
  });
});
