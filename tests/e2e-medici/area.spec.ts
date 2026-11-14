import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/** Con i medici accesi: dal report si arriva al medico senza ricaricare il documento. Il resto dell'area sta in tests/e2e. */
test.describe("area personale con i medici accesi", () => {
  test("percorso completo con l'account demo, fino alla continuità verso il medico", async ({ page }) => {
    await page.goto("/accedi");
    await page.getByRole("button", { name: "Entra con l'account demo" }).click();
    await expect(page).toHaveURL(/\/area-personale$/);
    await page.getByRole("link", { name: "Nuovo referto" }).first().click();
    await expect(page.getByRole("heading", { name: "Scegli un referto di esempio." })).toBeVisible();
    await page.getByLabel(/Funzionalità tiroidea/).check();
    await page.getByRole("button", { name: /Aggiungi e leggi il documento/ }).click();
    await expect(page.getByRole("heading", { name: "Controlla prima i valori." })).toBeVisible({ timeout: 15_000 });
    await page.getByRole("button", { name: "Conferma tutti i valori leggibili" }).click();
    await page.getByRole("button", { name: /Salva e scegli il servizio/ }).click();
    await expect(page.getByRole("heading", { name: "Rendi chiaro il tuo referto." })).toBeVisible();
    await page.getByRole("button", { name: /e ricevi il report/ }).click();
    await expect(page.getByText("Pagamento simulato — nessun addebito")).toBeVisible();
    await page.getByRole("button", { name: "Conferma il pagamento di prova" }).click();
    // Ciclo 5: dopo il pagamento si arriva direttamente al report, con la conferma scritta in pagina.
    await expect(page.getByRole("heading", { name: "Il tuo referto, in parole semplici." })).toBeVisible({ timeout: 20_000 });
    await expect(page.getByTestId("pagamento-registrato")).toContainText("Pagamento di prova registrato");
    await expect(page.getByRole("list", { name: "Spiegazione dei valori" })).toBeVisible();
    await expect(page.getByText("Anticorpi anti-TPO", { exact: false }).first()).toBeVisible();
    const axe = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
    expect(axe.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`)).toEqual([]);
    const [download] = await Promise.all([page.waitForEvent("download"), page.getByRole("button", { name: "Scarica il PDF" }).click()]);
    expect(download.suggestedFilename()).toMatch(/^cura-privata-DEMO-.*\.pdf$/);
    // Ricaricando, si riparte dal report (stato nel database, non nel browser)
    await page.reload();
    await expect(page.getByRole("heading", { name: "Il tuo referto, in parole semplici." })).toBeVisible({ timeout: 15_000 });
    // Report strutturato: valori a colpo d'occhio e, dove c'è una guida, i fattori generali.
    await expect(page.getByTestId("valori-colpo-occhio")).toBeVisible();
    await expect(page.getByTestId("colpo-occhio")).toBeVisible();
    await page.getByRole("button", { name: "Apri tutte" }).click();
    await expect(page.getByText("Che cosa può influenzarlo, in generale").first()).toBeVisible();
    // Continuità: dal report al medico senza ricaricare il documento.
    const docUrl = page.url();
    const docId = docUrl.split("?")[0].split("/").pop()!;
    await page.getByTestId("prossimo-passo").getByRole("link", { name: /Parla con un medico/ }).click();
    await expect(page).toHaveURL(new RegExp(`/area-personale/appuntamenti\\?documento=${docId}`));
    await expect(page.getByText("medico di medicina generale o internista").first()).toBeVisible();
    await expect(page.getByLabel("Specialità")).toHaveCount(0);
    await expect(page.getByRole("group", { name: "Documenti da far leggere al medico" }).getByRole("checkbox", { checked: true })).toHaveCount(1);
  });

});
