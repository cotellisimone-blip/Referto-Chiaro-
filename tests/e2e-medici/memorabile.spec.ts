import { test, expect, type APIRequestContext, type BrowserContext } from "@playwright/test";
import { totpCode } from "../../src/lib/auth/totp";
import { expectAccessible } from "../e2e/_lib/a11y";

/**
 * Pacchetto «Memorabile» con i medici accesi: le pagine dei servizi con un medico, il selettore completo, le CTA
 * contestuali verso il medico, i percorsi C e D. Le parti che valgono anche senza medici stanno in tests/e2e.
 */

async function signup(request: APIRequestContext, email: string) {
  const r = await (await request.post("/api/v1/auth/magic-link", { data: { email, consents: ["terms", "privacy", "health-data"] } })).json();
  expect((await request.get(r.link, { maxRedirects: 0 })).status()).toBe(303);
}

async function verifiedDocument(request: APIRequestContext) {
  const { id } = await (await request.post("/api/v1/area/documents", { data: { sampleId: "demo-referto-lab-001" } })).json();
  const d = await (await request.get(`/api/v1/area/documents/${id}`)).json();
  const ids = d.document.extracted.observations.filter((o: { valueRaw: string | null }) => o.valueRaw !== null).map((o: { id: string }) => o.id);
  await request.post(`/api/v1/area/documents/${id}/verification`, { data: { confirmedObservationIds: ids } });
  return id as string;
}

async function loginPhysician(ctx: BrowserContext) {
  const r = await (await ctx.request.post("/api/v1/auth/demo-ruolo", { data: { role: "physician" } })).json();
  expect(r.ok).toBe(true);
  if (!r.mfaEnabled) {
    const s = await (await ctx.request.post("/api/v1/auth/mfa/setup", { data: {} })).json();
    expect((await ctx.request.post("/api/v1/auth/mfa/conferma", { data: { code: totpCode(s.secret) } })).status()).toBe(200);
  } else {
    const s = await (await ctx.request.get("/api/v1/auth/mfa/verifica")).json();
    expect((await ctx.request.post("/api/v1/auth/mfa/verifica", { data: { code: totpCode(s.secret) } })).status()).toBe(200);
  }
}

test.describe("i tre servizi e i percorsi pubblici", () => {
  test("le pagine dei servizi con un medico: una frase, tempi, prezzo, un'azione principale; 0 violazioni axe", async ({ page }) => {
    for (const [path, name, cta] of [
      ["/servizi/secondo-parere", "Quando vuoi un'altra valutazione, da uno specialista.", "Richiedi un secondo parere"],
      ["/servizi/parla-con-un-medico", "Non sai quale specialista ti serve? Parti da un medico.", "Prenota il videoconsulto"],
    ] as const) {
      await page.goto(path);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(name);
      await expect(page.getByText("Tempi", { exact: true })).toBeVisible();
      await expect(page.getByRole("note").filter({ hasText: "Versione dimostrativa" }).first()).toBeVisible();
      await expect(page.getByRole("link", { name: "Che cosa manca per il servizio reale" })).toHaveAttribute("href", "/stato-del-progetto");
      await expect(page.getByRole("link", { name: cta })).toBeVisible();
      await expectAccessible(page);
    }
  });

  test("Ti aiutiamo a scegliere: dal bisogno al servizio, senza domande cliniche", async ({ page }) => {
    await page.goto("/inizia");
    await expect(page.getByText("Non ti chiediamo sintomi né dati sanitari", { exact: false })).toBeVisible();
    await page.getByLabel("Ho già una diagnosi o una proposta e voglio un'altra valutazione").check();
    await expect(page.getByText("Secondo parere specialistico", { exact: true }).first()).toBeVisible();
    await page.getByLabel("Ho dei dubbi e non so quale specialista mi serve").check();
    await expect(page.getByRole("link", { name: "Scopri il servizio" })).toHaveAttribute("href", "/servizi/parla-con-un-medico");
    await page.getByLabel("Ho una visita e voglio arrivare preparato").check();
    await expect(page.getByRole("link", { name: /Inizia, è gratis/ })).toHaveAttribute("href", "/strumenti/preparati-alla-visita");
    await expect(page.locator("main textarea, main input[type=text]")).toHaveCount(0);
    await expectAccessible(page);
  });

  test("guide e glossario: risposta, poi una CTA pertinente e non invadente", async ({ page }) => {
    await page.goto("/guide/tsh");
    await expect(page.getByText(/Hai già il tuo referto\? Rendilo chiaro: il primo 2,90\s€, poi 7,90\s€\./)).toBeVisible();
    await page.goto("/guide/risonanza-magnetica");
    await expect(page.getByText(/Hai già ricevuto una diagnosi o un'indicazione\? Puoi chiedere un secondo parere\./)).toBeVisible();
    await expect(page.getByRole("link", { name: /Preferisci parlarne\? Un medico di medicina generale/ })).toBeVisible();
  });

  test("mobile: nessuno scorrimento orizzontale sulle pagine nuove (320–430 px)", async ({ page, isMobile }) => {
    test.skip(!isMobile, "solo mobile");
    for (const width of [320, 375, 390, 430]) {
      await page.setViewportSize({ width, height: 800 });
      for (const path of ["/", "/prezzi", "/servizi", "/servizi/parla-con-un-medico", "/servizi/secondo-parere", "/servizi/visita-a-domicilio", "/inizia"]) {
        await page.goto(path);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
        expect(overflow, `${path} @${width}`).toBeLessThanOrEqual(0);
      }
    }
  });
});

/**
 * 19/11/2026: la home «chiara e scura» con i medici accesi. I medici sono veri (Sara, Elena e Riccardo, medici di
 * medicina generale a Brescia): niente più «versione di prova» né persone inventate; i dati che mancano restano «da
 * completare» nella pagina dei medici. Le fotografie sono di pazienti, sempre «Immagine illustrativa», mai di medici.
 */
test.describe("home chiara e scura, con i medici accesi", () => {
  test("il percorso in cinque passi, il medico a Brescia con i prezzi, chi sono i medici; corta e onesta", async ({ page, isMobile }) => {
    await page.goto("/");
    const main = page.locator("main");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(/La tua salute,\s*tutta in una pagina\./);
    await expect(main.locator(".hb-docq")).toContainText("69 €");
    const medico = main.locator("#medico");
    await expect(medico).toContainText("Medici a Brescia");
    await expect(medico).not.toContainText(/versione di prova|profilo di prova|persona inventata/i);
    await expect(medico).toContainText("69 €");
    await expect(medico).toContainText("149 €");
    await expect(medico.getByRole("link", { name: "Prenota il videoconsulto" })).toHaveAttribute("href", "/richiedi/videoconsulto");
    // 22/11/2026: in home il passo 4 è il medico in video o il secondo parere; la visita a domicilio non c'è più.
    await expect(medico.getByRole("link", { name: "Richiedi il secondo parere" })).toHaveAttribute("href", "/richiedi/secondo-parere");
    await expect(medico).not.toContainText("A casa tua");
    await expect(medico.getByRole("link", { name: /Chi sono i medici: Sara, Elena e Riccardo/ })).toHaveAttribute("href", "/medici#i-medici");
    // Le fotografie del riquadro sono di pazienti, dichiarate: nessuna fotografia di medici.
    for (const f of await medico.locator("figure:has(img)").all()) await expect(f).toContainText("Immagine illustrativa");
    const text = (await main.innerText()).toLowerCase();
    for (const bad of ["rivisto da un medico", "revisione medica", "solo oggi", "ultimi posti", "scade tra", "nella norma", "dott. ", "dott.ssa "]) expect(text).not.toContain(bad);
    if (isMobile) {
      const bar = page.getByRole("navigation", { name: "Azioni rapide" });
      await page.evaluate(() => window.scrollTo(0, 0));
      await expect(bar).toBeHidden();
      await page.evaluate(() => window.scrollTo(0, window.innerHeight * 2));
      await expect(bar).toBeVisible();
    }
    const h = await page.evaluate(() => document.documentElement.scrollHeight / window.innerHeight);
    expect(h, "schermate").toBeLessThan(isMobile ? 9 : 6);
    await expectAccessible(page);
  });

  test("cinque compiti dalla home, in pochi clic", async ({ page }) => {
    await page.goto("/");
    // 1. Quanto costa il videoconsulto? Visibile nel primo schermo.
    await expect(page.locator("main .hb-docq")).toContainText("69 €");
    // 2. Capire un referto: la tessera 3 porta al caricamento (senza sessione, prima all'accesso)
    await page.locator("main #passo-3 a").first().click();
    await expect(page).toHaveURL(/\/accedi\?next=%2Farea-personale%2Fnuovo$/);
    // 3. Emergenza: il 112 è in home
    await page.goto("/");
    await expect(page.locator("main")).toContainText("112");
    // 4. Un medico in video: dal primo schermo al riquadro del medico, poi «Prenota»
    await page.locator("main .hb-docq").click();
    await expect(page).toHaveURL(/#medico$/);
    await page.locator("#medico").getByRole("link", { name: "Prenota il videoconsulto" }).click();
    await expect(page).toHaveURL(/\/richiedi\/videoconsulto$/);
    // 5. Chi sono i medici: la pagina dei medici con le tre schede vere
    await page.goto("/medici#i-medici");
    const schede = page.locator("#i-medici > li");
    await expect(schede).toHaveCount(3);
    for (const [i, nome] of ["Sara", "Elena", "Riccardo"].entries()) {
      await expect(schede.nth(i)).toContainText(nome);
      await expect(schede.nth(i)).toContainText("Medico di medicina generale");
      await expect(schede.nth(i)).toContainText("Brescia");
    }
    // I dati non ancora dati da Simone restano dichiarati «da completare», mai inventati.
    for (const scheda of await schede.all()) await expect(scheda.locator('[data-segnaposto="medico"]').first()).toBeVisible();
    await expect(page.locator("#i-medici img")).toHaveCount(0);
  });
});

test.describe("percorsi A, C, D", () => {
  test("C: visitatore → Parla con un medico → prenotazione → pagamento → conferma del medico → riepilogo", async ({ browser }) => {
    const patient = await browser.newContext();
    await signup(patient.request, `c-${Date.now()}@test.invalid`);
    await verifiedDocument(patient.request);
    const doctor = await browser.newContext();
    await loginPhysician(doctor);

    const page = await patient.newPage();
    // 12/11/2026: il pulsante della pagina porta alla prova a fasce (tests/e2e/prestazioni.spec.ts); qui resta provato
    // il percorso server dell'area personale, che si apre direttamente.
    await page.goto("/servizi/parla-con-un-medico");
    await expect(page.getByRole("link", { name: "Prenota il videoconsulto" }).first()).toHaveAttribute("href", "/richiedi/videoconsulto");
    await page.goto("/area-personale/appuntamenti");
    await expect(page.getByRole("heading", { name: "I miei appuntamenti" })).toBeVisible({ timeout: 15_000 });
    await expectAccessible(page);
    await page.getByLabel(/Di che cosa vuoi parlare/).fill("Vorrei capire con un medico i valori del referto di esempio.");
    await page.getByLabel(/Ho capito che questa è una simulazione/).check();
    await page.getByLabel(/Acconsento a condividere/).check();
    await page.getByRole("button", { name: /Continua al pagamento/ }).click();
    await expect(page.getByRole("heading", { name: "Il tuo ordine." })).toBeVisible({ timeout: 15_000 });
    await expect(page.getByRole("main").getByText("Videoconsulto con medico generalista", { exact: true }).first()).toBeVisible();
    await page.getByRole("button", { name: "Conferma il pagamento di prova" }).click();
    await page.getByRole("link", { name: "Vai all'appuntamento" }).click();
    await expect(page.getByRole("heading", { name: "Videoconsulto" })).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText("In attesa di conferma").first()).toBeVisible();
    const id = page.url().split("/").pop()!;
    await expectAccessible(page);

    // Il medico conferma con un collegamento https; un link non sicuro viene rifiutato
    const when = new Date(Date.now() + 2 * 86_400_000).toISOString();
    expect((await doctor.request.post(`/api/v1/medico/appuntamenti/${id}`, { data: { kind: "confirm", scheduledAt: when, videoUrl: "javascript:alert(1)" } })).status()).toBe(400);
    const dp = await doctor.newPage();
    await dp.goto(`/medico/appuntamenti/${id}`);
    await expect(dp.getByRole("heading", { name: /^Videoconsulto ·/ })).toBeVisible({ timeout: 15_000 });
    await expect(dp.getByRole("figure", { name: /Facsimile/ }).first()).toBeVisible();
    await expectAccessible(dp);
    expect((await doctor.request.post(`/api/v1/medico/appuntamenti/${id}`, { data: { kind: "confirm", scheduledAt: when, videoUrl: "https://meet.esempio.it/cura-privata-demo" } })).status()).toBe(200);

    await page.reload();
    await expect(page.getByRole("link", { name: "Entra nel videoconsulto" })).toHaveAttribute("href", "https://meet.esempio.it/cura-privata-demo");
    expect((await doctor.request.post(`/api/v1/medico/appuntamenti/${id}`, { data: { kind: "complete", summary: "Riepilogo dimostrativo: abbiamo letto insieme i valori e preparato le domande per il medico curante.", confirmResponsibility: true } })).status()).toBe(200);
    await page.reload();
    await expect(page.getByRole("heading", { name: "Riepilogo del medico" })).toBeVisible();
    await expect(page.getByText(/Firmato da Medico dimostrativo/)).toBeVisible();

    // Un altro utente non vede l'appuntamento
    const other = await browser.newContext();
    await signup(other.request, `c-altro-${Date.now()}@test.invalid`);
    expect((await other.request.get(`/api/v1/area/appuntamenti/${id}`)).status()).toBe(404);
    await patient.close();
    await doctor.close();
    await other.close();
  });

  test("C: date non valide, troppe fasce e documenti di altri vengono rifiutati", async ({ browser }) => {
    const ctx = await browser.newContext();
    await signup(ctx.request, `c-val-${Date.now()}@test.invalid`);
    const base = { specialty: "Medicina interna (simulazione)", reason: "Un dubbio da chiarire.", documentIds: [], acknowledgeSimulation: true, consentToShare: true };
    const today = new Date().toISOString().slice(0, 10);
    const far = new Date(Date.now() + 60 * 86_400_000).toISOString().slice(0, 10);
    expect((await ctx.request.post("/api/v1/area/appuntamenti", { data: { ...base, slots: [{ day: today, window: "mattina" }] } })).status()).toBe(400);
    expect((await ctx.request.post("/api/v1/area/appuntamenti", { data: { ...base, slots: [{ day: far, window: "mattina" }] } })).status()).toBe(400);
    const d = new Date(Date.now() + 2 * 86_400_000).toISOString().slice(0, 10);
    expect((await ctx.request.post("/api/v1/area/appuntamenti", { data: { ...base, slots: [1, 2, 3, 4].map(() => ({ day: d, window: "sera" })) } })).status()).toBe(400);
    expect((await ctx.request.post("/api/v1/area/appuntamenti", { data: { ...base, slots: [{ day: d, window: "sera" }], documentIds: ["00000000-0000-4000-8000-000000000000"] } })).status()).toBe(404);
    expect((await ctx.request.post("/api/v1/area/appuntamenti", { data: { ...base, slots: [{ day: d, window: "sera" }], acknowledgeSimulation: false } })).status()).toBe(400);
    await ctx.close();
  });

  test("D: area personale con documenti, pareri, appuntamenti e pagamenti", async ({ browser, isMobile }) => {
    const ctx = await browser.newContext(isMobile ? { viewport: { width: 390, height: 844 } } : {});
    await signup(ctx.request, `d-${Date.now()}@test.invalid`);
    await verifiedDocument(ctx.request);
    const page = await ctx.newPage();
    await page.setViewportSize(isMobile ? { width: 390, height: 844 } : { width: 1440, height: 900 });
    await page.goto("/area-personale");
    const nav = page.getByRole("navigation", { name: "Area personale" }).last();
    for (const label of isMobile ? ["Referti", "Numeri", "Famiglia", "Medico"] : ["I miei documenti e report", "Nel tempo", "La famiglia", "Promemoria", "Visite e videoconsulti", "I miei pareri"]) await expect(nav.getByRole("link", { name: label })).toBeVisible();
    for (const [path, h] of [["/area-personale/secondo-parere", "I miei pareri"], ["/area-personale/appuntamenti", "I miei appuntamenti"], ["/area-personale/ordini", "Pagamenti"]] as const) {
      await page.goto(path);
      await expect(page.getByRole("heading", { name: h, level: 1 })).toBeVisible({ timeout: 15_000 });
    }
    await ctx.close();
  });
});
