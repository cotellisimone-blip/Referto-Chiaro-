import { expect, test, type Page } from "@playwright/test";
import { gotoReady } from "./_lib/ready";
import { expectAccessible } from "./_lib/a11y";

/**
 * Ciclo 4 (12/11/2026): un'offerta sola, la richiesta da paziente senza la barra dei ruoli,
 * «Avvisami nella mia zona» e ciò che resta dopo la visita.
 */
async function fresh(page: Page, url: string) {
  await gotoReady(page, url);
  await page.evaluate(() => {
    localStorage.removeItem("cp-prestazioni-demo");
    localStorage.removeItem("cp-prestazioni-demo-medico");
  });
  await gotoReady(page, url);
}

test("un'offerta sola: ogni servizio compare una volta in Servizi e in Prezzi, nello stesso ordine", async ({ page, isMobile }) => {
  for (const path of ["/servizi", "/prezzi"]) {
    await gotoReady(page, path);
    const keys = await page.locator("main [data-servizio]").evaluateAll((els) => els.map((e) => e.getAttribute("data-servizio")));
    expect(keys, path).toEqual(["capisci", "domicilio", "video", "parere"]);
    const text = await page.locator("main").innerText();
    expect(text, path).not.toMatch(/tre servizi/i);
    for (const name of ["Videoconsulto con medico generalista", "Secondo parere specialistico", "Visita a domicilio con medico generalista"]) {
      expect(text.split(name).length - 1, `${path}: ${name}`).toBe(1);
    }
  }
  if (isMobile) {
    const screens = await page.evaluate(() => document.documentElement.scrollHeight / innerHeight);
    expect(screens, "Prezzi su telefono").toBeLessThan(7);
  }
  // La scelta guidata conosce anche la visita a domicilio.
  await gotoReady(page, "/inizia");
  await page.getByText("Serve una visita a casa, per me o per un familiare").click();
  await expect(page.locator("main")).toContainText("Visita a domicilio con medico generalista");
});

test("dalla home alla visita conclusa da paziente: nessun ruolo, un comando per volta, riepilogo e prossimo passo", async ({ page, isMobile }) => {
  await fresh(page, "/");
  await page.locator("[data-in-evidenza]").getByRole("link", { name: /Richiedi la visita/ }).click();
  await expect(page).toHaveURL(/\/richiedi\/domicilio$/);
  await expect(page.locator("[data-percorso-paziente]")).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Prova come" })).toHaveCount(0);
  const verifica = page.getByRole("button", { name: "Verifica la copertura" });
  if (isMobile) {
    const box = (await verifica.boundingBox())!;
    expect(box.y + box.height, "il comando del primo passo sta nella prima schermata").toBeLessThanOrEqual(844);
  }
  await expectAccessible(page);
  await verifica.click();
  await page.locator(".slot-pill").first().click();
  await page.getByRole("button", { name: "Continua" }).click();
  await page.locator("textarea").first().fill("Controllo a casa per un familiare (testo di prova).");
  await page.getByRole("button", { name: /Rivedi la richiesta/ }).click();
  await page.getByRole("button", { name: /Invia la richiesta/ }).click();
  await expect(page).toHaveURL(/\/richieste\/[^/]+$/);
  await expect(page.getByRole("navigation", { name: "Prova come" })).toHaveCount(0);
  await expect(page.locator("[data-percorso]")).toContainText("Il medico risponde");
  await page.getByRole("button", { name: /Fai rispondere il medico/ }).click();
  // Prima di pagare: prezzo, medico e regola di annullamento scritta.
  await expect(page.locator("[data-percorso]")).toContainText("Confermi e paghi");
  await expect(page.locator("[data-annullamento]")).toContainText("2 ore prima");
  await page.getByRole("button", { name: /Conferma e paga/ }).click();
  await expect(page.locator("[data-stato=\"confermata\"]").first()).toBeVisible();
  await page.getByRole("button", { name: /Fai arrivare il medico/ }).click();
  await page.getByRole("button", { name: /Concludi la visita/ }).click();
  await expect(page.getByRole("heading", { name: "Riepilogo del medico" })).toBeVisible();
  await expect(page.locator("[data-prossimo-passo]")).toContainText("medico di famiglia");
  await expect(page.getByRole("region", { name: "Ricevuta dimostrativa" })).toContainText(/149\s?€/);
  await expect(page.locator("main")).toContainText("Documento dimostrativo");
  await expectAccessible(page);
  // La stessa richiesta resta nell'elenco del paziente, anche dopo il ricaricamento.
  await gotoReady(page, "/richieste");
  await expect(page.locator("main")).toContainText("Conclusa");
});

test("fuori zona non è un vicolo cieco: «Avvisami» con il CAP già scritto registra l'interesse", async ({ page }) => {
  await fresh(page, "/richiedi/domicilio");
  await page.getByRole("textbox", { name: "Comune" }).fill("Milano");
  await page.getByRole("textbox", { name: "CAP", exact: true }).fill("20121");
  await page.getByRole("button", { name: "Verifica la copertura" }).click();
  const zona = page.locator("[data-avvisami-zona=\"20121\"]");
  await expect(zona).toContainText("Avvisami quando arrivate al 20121");
  await expect(zona.getByLabel("CAP dove vorresti la visita")).toHaveValue("20121");
  await zona.getByLabel("Indirizzo email").fill(`zona-${Date.now()}@esempio.test`);
  // Senza consenso non si iscrive.
  await zona.getByRole("button", { name: "Avvisami per la mia zona" }).click();
  await expect(zona.getByRole("alert")).toContainText("informativa privacy");
  await zona.getByRole("checkbox").check();
  await zona.getByRole("button", { name: "Avvisami per la mia zona" }).click();
  await expect(zona.getByRole("status")).toContainText("Interesse registrato");
});

test("pagina del domicilio: che cosa resta, prescrizione a giudizio del medico e annullamento scritto", async ({ page }) => {
  await gotoReady(page, "/servizi/visita-a-domicilio");
  const main = page.locator("main");
  await expect(main.getByRole("heading", { name: "Che cosa ti resta dopo la visita" })).toBeVisible();
  await expect(main).toContainText("ricetta bianca");
  await expect(main).toContainText("se la ritiene necessaria");
  await page.getByText("Posso annullare?").click();
  await expect(main).toContainText("2 ore prima");
  await expectAccessible(page);
});

test("le pagine del paziente non sono indicizzabili", async ({ page, request }) => {
  for (const path of ["/richiedi/domicilio", "/richieste"]) {
    await gotoReady(page, path);
    await expect(page.locator("meta[name=robots]")).toHaveAttribute("content", /noindex/);
  }
  // Finché l'indicizzazione è spenta tutto il sito è escluso; quando si accende, le pagine personali restano fuori.
  const robots = await (await request.get("/robots.txt")).text();
  expect(robots).toMatch(/Disallow: \/(\n|$|richiedi)/);
});
