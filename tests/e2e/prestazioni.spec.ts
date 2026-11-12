import { expect, test, type Page } from "@playwright/test";
import { gotoReady } from "./_lib/ready";
import { expectAccessible as checkA11y } from "./_lib/a11y";

/**
 * Prestazioni con un medico (12/11/2026): domicilio 149 €, videoconsulto 69 €, secondo parere 149 €.
 * Le prove seguono la stessa richiesta come paziente, medico e amministrazione, dai normali punti di accesso.
 * Lo stato vive nel browser (localStorage): ogni test parte da una prova ripristinata.
 */
const eur = (n: number) => new RegExp(`${n}\\s?€`);

async function fresh(page: Page, url = "/prova") {
  await gotoReady(page, url);
  await page.evaluate(() => {
    localStorage.removeItem("cp-prestazioni-demo");
    localStorage.removeItem("cp-prestazioni-demo-medico");
  });
  await gotoReady(page, url);
}

async function asDoctor(page: Page, requestId: string, name: RegExp) {
  await gotoReady(page, `/prova/medico/richieste/${requestId}`);
  // Si aspetta che la prova sia caricata: o la richiesta, o il blocco «non puoi vederla» (medico diverso).
  await page.locator(`[data-richiesta="${requestId}"], [data-accesso-negato]`).first().waitFor();
  const enter = page.getByRole("button", { name: /Entra come il medico assegnato/ });
  if (await enter.isVisible()) await enter.click();
  await expect(page.locator("main")).toContainText(name);
}

async function patientRequestId(page: Page) {
  await page.waitForURL(/\/prova\/paziente\/richieste\//);
  return page.url().split("/").pop()!;
}

async function pickFirstSlot(page: Page) {
  await page.locator(".slot-pill").first().click();
}

test("listino e accessi dalla home: domicilio in evidenza, prezzi coerenti su schede, pagine e riepilogo", async ({ page }) => {
  await fresh(page, "/");
  const featured = page.locator("[data-in-evidenza]");
  await expect(featured).toHaveAttribute("data-in-evidenza", "domicilio");
  await expect(featured).toContainText(eur(149));
  await featured.getByRole("link", { name: "Come funziona" }).click();
  await expect(page).toHaveURL(/\/servizi\/visita-a-domicilio$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Il medico a casa tua");
  await gotoReady(page, "/servizi");
  const cards = page.locator("#con-un-medico [data-prestazione]");
  await expect(cards).toHaveCount(3);
  await expect(cards.nth(0)).toContainText("Visita a domicilio con medico generalista");
  await expect(cards.nth(0)).toContainText(eur(149));
  await expect(cards.nth(1)).toContainText("Videoconsulto con medico generalista");
  await expect(cards.nth(1)).toContainText(eur(69));
  await expect(cards.nth(2)).toContainText("Secondo parere specialistico");
  await expect(cards.nth(2)).toContainText(eur(149));
  // Ognuna raggiungibile direttamente dalla pagina servizi.
  await cards.nth(2).getByRole("link").click();
  await expect(page).toHaveURL(/\/prova\/paziente\/secondo-parere$/);
  for (const path of ["/servizi/parla-con-un-medico", "/prezzi"]) {
    await gotoReady(page, path);
    const txt = (await page.locator("main").innerText()).replace(/\s/g, " ");
    expect(txt, path).toMatch(/69 €/);
    expect(txt, path).not.toMatch(/\b(79|89) €/);
    expect(txt, path).not.toMatch(/da 149 €/);
  }
});

test("avvio con un solo servizio: una specialità aperta, domicilio e video sospesi con lo stato corretto", async ({ page }) => {
  await fresh(page, "/prova/amministrazione");
  await page.getByRole("button", { name: /Avvio con un solo servizio/ }).click();
  await gotoReady(page, "/prova/paziente");
  await expect(page.locator('[data-prestazione="domicilio"]')).toHaveAttribute("data-disponibilita", "sospeso");
  await expect(page.locator('[data-prestazione="video"]')).toHaveAttribute("data-disponibilita", "sospeso");
  await expect(page.locator('[data-prestazione="parere"]')).toHaveAttribute("data-disponibilita", "aperto");
  await gotoReady(page, "/prova/paziente/domicilio");
  await expect(page.locator("main")).toContainText("Nuove richieste sospese");
  // In home la prestazione in evidenza diventa quella davvero disponibile.
  await gotoReady(page, "/");
  await expect(page.locator("[data-in-evidenza]")).toHaveAttribute("data-in-evidenza", "parere");
});

test("candidatura: il medico è assegnabile solo dopo verifica e abilitazione", async ({ page }) => {
  await fresh(page, "/prova/medico/candidatura");
  await page.getByLabel("Nome e cognome").fill("Dott.ssa Prova Nuova");
  await page.getByLabel("Email professionale").fill("prova@esempio.invalid");
  await page.getByLabel(/Iscrizione all'Ordine/).fill("OMCeO Brescia n. DEMO-0100");
  await page.getByRole("button", { name: "Invia la candidatura" }).click();
  await expect(page.getByRole("status")).toContainText("Candidatura inviata");
  await gotoReady(page, "/prova/medico");
  await expect(page.locator("main")).toContainText("Candidatura in verifica");
  await gotoReady(page, "/prova/amministrazione");
  await page.getByRole("tab", { name: /Medici/ }).click();
  const card = page.locator("article", { hasText: "Dott.ssa Prova Nuova" });
  await expect(card).toContainText("Da verificare");
  await card.getByRole("button", { name: /Segna come verificato/ }).click();
  await expect(card).toContainText("Verificato");
  await expect(card.getByRole("switch", { name: /Visita a domicilio: no/ })).toBeVisible();
  await card.getByRole("switch", { name: /Videoconsulto: no/ }).click();
  await expect(card.getByRole("switch", { name: /Videoconsulto: sì/ })).toBeVisible();
});

test("domicilio: fuori zona, richiesta, accettazione del medico, conferma a 149 €, annullamento che libera la fascia", async ({ page }) => {
  await fresh(page, "/prova/paziente/domicilio");
  await page.getByLabel("CAP").fill("20121");
  await page.getByLabel("Comune").fill("Milano");
  await page.getByRole("button", { name: "Verifica la copertura" }).click();
  await expect(page.locator("main").getByRole("alert")).toContainText("Brescia città");
  await page.getByLabel("Comune").fill("Brescia");
  await page.getByLabel("CAP").fill("25122");
  await page.getByRole("button", { name: "Verifica la copertura" }).click();
  await pickFirstSlot(page);
  await page.getByRole("button", { name: "Continua" }).click();
  await page.getByLabel("Per un familiare").check();
  await page.getByLabel(/Nome e cognome/).fill("Anna Demo");
  await page.getByLabel(/Di che cosa si tratta/).fill("Febbre da tre giorni, non urgente");
  await expect(page.locator("main")).toContainText("112");
  await expect(page.locator("main")).toContainText("116117");
  await page.getByRole("button", { name: "Rivedi la richiesta" }).click();
  await expect(page.locator("main")).toContainText(eur(149));
  await page.getByRole("button", { name: "Invia la richiesta" }).click();
  const id = await patientRequestId(page);
  await expect(page.locator("[data-stato]").first()).toHaveAttribute("data-stato", "ricevuta");

  await asDoctor(page, id, /Bianchi/);
  await expect(page.locator("main")).toContainText("via visibile dopo la conferma");
  await page.getByRole("button", { name: /^Accetta/ }).click();

  await gotoReady(page, `/prova/paziente/richieste/${id}`);
  const panel = page.getByRole("region", { name: "Il medico ha risposto" });
  await expect(panel).toContainText("Bianchi");
  await expect(panel).toContainText("Via di Prova");
  await expect(panel).toContainText(eur(149));
  await page.getByRole("button", { name: /Conferma e paga/ }).click();
  await expect(page.locator(`[data-richiesta="${id}"]`)).toHaveAttribute("data-stato", "confermata");

  await gotoReady(page, "/prova/amministrazione");
  await page.getByRole("tab", { name: "Richieste" }).click();
  const row = page.locator(`[data-richiesta="${id}"]`);
  await expect(row).toContainText("Appuntamento confermato");
  await expect(row).not.toContainText("Febbre");
  await expect(row).not.toContainText("Via di Prova");

  await gotoReady(page, `/prova/paziente/richieste/${id}`);
  await page.getByRole("button", { name: "Annulla", exact: true }).click();
  await page.getByRole("button", { name: "Sì, annulla" }).click();
  await expect(page.locator(`[data-richiesta="${id}"]`)).toHaveAttribute("data-stato", "annullata");
  await expect(page.locator("main")).toContainText("rimborsato");
});

test("videoconsulto: 69 €, sala d'attesa, problema di connessione, riconnessione e conclusione", async ({ page }) => {
  await fresh(page, "/prova/paziente/videoconsulto");
  await pickFirstSlot(page);
  await page.getByRole("button", { name: "Continua" }).click();
  await page.getByLabel(/Di che cosa si tratta/).fill("Dubbi sugli esami del sangue");
  await page.getByRole("button", { name: "Rivedi la richiesta" }).click();
  await expect(page.locator("main")).toContainText(eur(69));
  await page.getByRole("button", { name: "Invia la richiesta" }).click();
  const id = await patientRequestId(page);
  await asDoctor(page, id, /Dott/);
  await page.getByRole("button", { name: /^Accetta/ }).click();
  await gotoReady(page, `/prova/paziente/richieste/${id}`);
  await expect(page.getByRole("region", { name: "Il medico ha risposto" })).toContainText(eur(69));
  await page.getByRole("button", { name: /Conferma e paga/ }).click();
  await page.getByRole("button", { name: /Entra nella sala d'attesa/ }).click();
  await expect(page.locator("main")).toContainText("Sala d'attesa (simulata)");
  await page.getByRole("link", { name: "Apri come medico" }).click();
  await expect(page.locator("main")).toContainText("Il paziente è in sala d'attesa");
  await page.getByRole("button", { name: "Avvia il videoconsulto" }).click();
  await gotoReady(page, `/prova/paziente/richieste/${id}`);
  await page.getByRole("button", { name: /Simula un problema di connessione/ }).click();
  await expect(page.locator("main")).toContainText("Connessione interrotta");
  await page.getByRole("button", { name: "Riprova a collegarti" }).click();
  await expect(page.getByRole("region", { name: "Videoconsulto simulato" })).toBeVisible();
  await gotoReady(page, `/prova/medico/richieste/${id}`);
  await page.getByRole("button", { name: "Concludi la prestazione" }).click();
  await gotoReady(page, `/prova/paziente/richieste/${id}`);
  await expect(page.locator(`[data-richiesta="${id}"]`)).toHaveAttribute("data-stato", "conclusa");
  await expect(page.locator("main")).toContainText("Documento dimostrativo");
});

test("secondo parere: integrazione documenti sulla stessa richiesta, accettazione, video e sintesi; il rifiuto chiude senza addebito", async ({ page }) => {
  await fresh(page, "/prova/paziente/secondo-parere");
  await page.getByLabel(/Il tuo quesito/).fill("Mi è stata proposta una procedura: è indicata nel mio caso?");
  await page.getByLabel(/Ecocardiogramma/).check();
  await page.getByRole("button", { name: "Rivedi la richiesta" }).click();
  await expect(page.locator("main")).toContainText(eur(149));
  await page.getByRole("button", { name: "Invia la richiesta" }).click();
  const id = await patientRequestId(page);

  await asDoctor(page, id, /Conti/);
  await expect(page.locator("main")).toContainText("Ecocardiogramma");
  await page.getByRole("button", { name: "Chiedi documenti" }).click();
  await page.getByLabel("Quali documenti ti servono").fill("Mi serve anche l'Holter.");
  await page.getByRole("button", { name: "Chiedi i documenti" }).click();

  await gotoReady(page, `/prova/paziente/richieste/${id}`);
  await expect(page.locator("main")).toContainText("Mi serve anche l'Holter.");
  await page.getByLabel(/Holter ECG/).check();
  await page.getByRole("button", { name: "Invia i documenti" }).click();
  await expect(page.locator(`[data-richiesta="${id}"]`)).toHaveAttribute("data-stato", "ricevuta");

  await gotoReady(page, `/prova/medico/richieste/${id}`);
  await expect(page.locator("main")).toContainText("Holter ECG");
  await pickFirstSlot(page);
  await page.getByRole("button", { name: "Accetta il caso" }).click();

  await gotoReady(page, `/prova/paziente/richieste/${id}`);
  const offer = page.getByRole("region", { name: "Lo specialista ha accettato il caso" });
  await expect(offer).toContainText("Cardiologia");
  await expect(offer).toContainText(eur(149));
  await expect(offer).toContainText("giorni lavorativi");
  await page.getByRole("button", { name: /Conferma e paga/ }).click();
  await gotoReady(page, `/prova/medico/richieste/${id}`);
  await page.getByRole("button", { name: "Avvia il videoconsulto" }).click();
  await page.getByRole("button", { name: "Concludi il videoconsulto" }).click();
  await page.getByRole("button", { name: "Consegna la sintesi" }).click();
  await gotoReady(page, `/prova/paziente/richieste/${id}`);
  await expect(page.getByRole("article", { name: "Sintesi scritta dello specialista" })).toContainText("DOCUMENTO DIMOSTRATIVO");

  // Un altro caso, non accettato: si chiude senza addebito.
  await gotoReady(page, "/prova/paziente/secondo-parere");
  await page.getByLabel(/Il tuo quesito/).fill("Secondo quesito di prova, non adatto a distanza.");
  await page.getByRole("button", { name: "Rivedi la richiesta" }).click();
  await page.getByRole("button", { name: "Invia la richiesta" }).click();
  const id2 = await patientRequestId(page);
  await gotoReady(page, `/prova/medico/richieste/${id2}`);
  await page.getByRole("button", { name: "Non adatto a distanza" }).click();
  await page.getByLabel("Esito per il paziente").fill("Serve una visita in presenza.");
  await page.getByRole("button", { name: "Chiudi senza addebito" }).click();
  await gotoReady(page, `/prova/paziente/richieste/${id2}`);
  await expect(page.locator(`[data-richiesta="${id2}"]`)).toHaveAttribute("data-stato", "non_accettata");
  await expect(page.locator("main")).toContainText("Nessun addebito");
});

test("conflitti: fascia occupata nel frattempo, pagamento fallito e doppia conferma senza doppia prenotazione; accesso negato all'altro medico", async ({ page }) => {
  await fresh(page, "/prova/paziente/videoconsulto");
  await pickFirstSlot(page);
  await page.getByRole("button", { name: "Continua" }).click();
  await page.getByLabel(/Di che cosa si tratta/).fill("Prova dei conflitti");
  await page.getByRole("button", { name: "Rivedi la richiesta" }).click();
  await page.getByRole("button", { name: "Invia la richiesta" }).click();
  const id = await patientRequestId(page);
  await asDoctor(page, id, /Dott/);
  await page.getByRole("button", { name: /^Accetta/ }).click();

  // Un medico diverso non vede la richiesta.
  await page.evaluate(() => localStorage.setItem("cp-prestazioni-demo-medico", "md-conti"));
  await gotoReady(page, `/prova/medico/richieste/${id}`);
  await expect(page.locator("main")).toContainText("Non puoi vedere questa richiesta");
  await expect(page.locator("main")).not.toContainText("Prova dei conflitti");

  // Pagamento fallito: errore, nessun appuntamento; poi il nuovo tentativo riesce una volta sola.
  await gotoReady(page, "/prova/amministrazione");
  await page.getByRole("tab", { name: "Strumenti di prova" }).click();
  await page.getByLabel(/Fai fallire il prossimo pagamento/).check();
  await gotoReady(page, `/prova/paziente/richieste/${id}`);
  await page.getByRole("button", { name: /Conferma e paga/ }).click();
  await expect(page.locator("main").getByRole("alert")).toContainText("non è riuscito");
  await expect(page.locator(`[data-richiesta="${id}"]`)).toHaveAttribute("data-stato", "proposta");
  const confirm = page.getByRole("button", { name: /Conferma e paga/ });
  await confirm.dblclick();
  await expect(page.locator(`[data-richiesta="${id}"]`)).toHaveAttribute("data-stato", "confermata");
  const attempts = await page.evaluate((rid) => JSON.parse(localStorage.getItem("cp-prestazioni-demo")!).requests.find((r: { id: string }) => r.id === rid).payment.attempts, id);
  expect(attempts).toBe(2);

  // Seconda richiesta: la fascia proposta viene occupata nel frattempo → nessun addebito e alternative.
  await gotoReady(page, "/prova/paziente/videoconsulto");
  await pickFirstSlot(page);
  await page.getByRole("button", { name: "Continua" }).click();
  await page.getByLabel(/Di che cosa si tratta/).fill("Fascia occupata nel frattempo");
  await page.getByRole("button", { name: "Rivedi la richiesta" }).click();
  await page.getByRole("button", { name: "Invia la richiesta" }).click();
  const id2 = await patientRequestId(page);
  await asDoctor(page, id2, /Dott/);
  await page.getByRole("button", { name: /^Accetta/ }).click();
  await gotoReady(page, "/prova/amministrazione");
  await page.getByRole("tab", { name: "Richieste" }).click();
  await page.locator(`[data-richiesta="${id2}"]`).getByRole("button", { name: /fascia occupata nel frattempo/ }).click();
  await gotoReady(page, `/prova/paziente/richieste/${id2}`);
  await page.getByRole("button", { name: /Conferma e paga/ }).click();
  await expect(page.locator("main").getByRole("alert")).toContainText("Nessun addebito");
  await expect(page.locator(`[data-richiesta="${id2}"]`)).toHaveAttribute("data-stato", "indisponibile");
  await expect(page.getByRole("group", { name: "Alternative libere" })).toBeVisible();
});

test("le pagine della prova non sono indicizzabili e sono accessibili", async ({ page }) => {
  await fresh(page, "/prova");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  await checkA11y(page);
  await gotoReady(page, "/prova/paziente/domicilio");
  await checkA11y(page);
  await gotoReady(page, "/servizi/visita-a-domicilio");
  await checkA11y(page);
});
