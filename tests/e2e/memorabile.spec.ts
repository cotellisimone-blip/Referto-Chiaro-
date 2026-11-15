import { test, expect, type APIRequestContext } from "@playwright/test";
import { expectAccessible } from "./_lib/a11y";

/**
 * Pacchetto «Memorabile» nello stato di lancio, senza medici (src/lib/medici.ts): «Capisci il tuo referto», il selettore,
 * «Preparati alla visita», le proposte nelle guide, i percorsi A e D. Le stesse prove con i medici accesi (pagine dei
 * servizi con un medico, percorso C) stanno in tests/e2e-medici.
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

test.describe("il servizio e i percorsi pubblici", () => {
  test("la pagina del servizio: una frase, tempi, prezzo, un'azione principale; 0 violazioni axe", async ({ page }) => {
    for (const [path, name, cta] of [
      ["/referti", "Il tuo referto, finalmente leggibile.", "Rendi chiaro il mio referto"],
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
    // Senza medici le risposte sono due: il referto da capire e la visita da preparare.
    await expect(page.getByRole("radio")).toHaveCount(2);
    await page.getByLabel("Ho un referto che non capisco").check();
    await expect(page.getByRole("link", { name: "Scopri il servizio" })).toHaveAttribute("href", "/referti");
    await page.getByLabel("Ho una visita e voglio arrivare preparato").check();
    await expect(page.getByRole("link", { name: /Inizia, è gratis/ })).toHaveAttribute("href", "/strumenti/preparati-alla-visita");
    await expect(page.locator("main textarea, main input[type=text]")).toHaveCount(0);
    await expectAccessible(page);
  });

  test("Preparati alla visita: 3 passi, lista stampabile, stato solo nell'URL", async ({ page }) => {
    await page.goto("/strumenti/preparati-alla-visita");
    await page.getByLabel("Una visita specialistica").check();
    await expect(page).toHaveURL(/tipo=specialistica/);
    await page.getByRole("button", { name: "Avanti" }).click();
    await page.getByLabel(/Farmaci o integratori/).check();
    await page.getByRole("button", { name: "Avanti" }).click();
    await page.getByLabel(/I farmaci: orari/).check();
    await page.getByRole("button", { name: "Crea la mia lista" }).click();
    await expect(page.getByRole("heading", { name: "Pronto per la visita." })).toBeVisible();
    await expect(page.getByText(/impegnativa/i).first()).toBeVisible();
    await expect(page.getByText(/Come e quando devo prendere questo farmaco/)).toBeVisible();
    await expect(page.getByRole("button", { name: "Stampa" })).toBeVisible();
    await expectAccessible(page);
    // Con lo stesso link la lista è la stessa; valori estranei vengono ignorati
    await page.goto("/strumenti/preparati-alla-visita?tipo=specialistica&ho=farmaci,<x>&temi=farmaci");
    await expect(page.getByRole("heading", { name: "Pronto per la visita." })).toBeVisible();
  });

  test("guide e glossario: risposta, poi una proposta pertinente e non invadente", async ({ page }) => {
    await page.goto("/guide/tsh");
    await expect(page.getByText(/Hai già il tuo referto\? Rendilo chiaro per 7,90/)).toBeVisible();
    await expect(page.getByRole("link", { name: /Preferisci parlarne/ })).toHaveCount(0);
    // Per gli esami che «Capisci» non legge, senza medici la proposta è lo strumento gratuito, già aperto su quell'esame.
    await page.goto("/guide/risonanza-magnetica");
    const next = page.getByRole("complementary", { name: "Se ti serve un passo in più" });
    await expect(next).toContainText("Hai fatto questo esame? Prepara le domande per il tuo medico.");
    await expect(next.getByRole("link", { name: /Domande per il medico/ })).toHaveAttribute("href", "/strumenti/domande-per-il-medico?esami=risonanza-magnetica");
    await expect(page.getByText(/secondo parere/i)).toHaveCount(0);
  });

  test("mobile: nessuno scorrimento orizzontale sulle pagine nuove (320–430 px)", async ({ page, isMobile }) => {
    test.skip(!isMobile, "solo mobile");
    for (const width of [320, 375, 390, 430]) {
      await page.setViewportSize({ width, height: 800 });
      for (const path of ["/", "/prezzi", "/servizi", "/con-un-medico", "/inizia", "/strumenti/preparati-alla-visita"]) {
        await page.goto(path);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
        expect(overflow, `${path} @${width}`).toBeLessThanOrEqual(0);
      }
    }
  });
});

test.describe("home «I tre momenti»", () => {
  test("apertura con due azioni, il referto che si tocca, i tre momenti; corta e senza dati inventati", async ({ page, isMobile }) => {
    await page.goto("/");
    const main = page.locator("main");
    // Apertura: una primaria (con il prezzo del primo referto, dal codice) e una secondaria
    const hero = main.locator(".tm-hero");
    await expect(hero.getByRole("link", { name: /Carica un referto/ })).toHaveAttribute("href", "/referti");
    await expect(hero.getByRole("link", { name: /Carica un referto/ })).toContainText("il primo 2,90 €");
    await expect(hero.getByRole("link", { name: "Guarda un esempio" })).toHaveAttribute("href", "/referti/esempio");
    // Da così a così: ogni riga del foglio è un pulsante, la spiegazione accanto cambia
    await expect(page.getByRole("heading", { name: /Lo stesso referto,\s*da così a così\./ })).toBeVisible();
    const xpl = page.locator("#tm-xpl");
    await expect(xpl.getByRole("heading", { level: 3 })).toHaveText("Colesterolo LDL");
    await expect(xpl).toContainText("Sopra l’intervallo stampato");
    await page.getByRole("button", { name: /^GLICEMIA 92 mg\/dL/ }).click();
    await expect(xpl.getByRole("heading", { level: 3 })).toHaveText("Glicemia");
    await expect(xpl).toContainText("Dentro l’intervallo stampato");
    await expect(page.getByRole("button", { name: /^GLICEMIA/ })).toHaveAttribute("aria-pressed", "true");
    // I tre momenti: si paga solo «Capisci», con il prezzo in HTML; il resto è gratis
    await expect(page.getByRole("heading", { name: /Oggi, prima della visita,\s*negli anni\./ })).toBeVisible();
    const paid = main.locator(".tm-paid");
    await expect(paid).toContainText("2,90 €");
    await expect(paid).toContainText("poi 7,90 € per referto");
    await expect(paid).toContainText("È automatico: nessun medico lo rivede.");
    await expect(main.locator(".tm-mom")).toContainText("piano in arrivo");
    // Senza medici: nessun link ai servizi con un medico, solo «Presto anche con un medico», senza prezzi.
    await expect(page.locator('main a[href^="/servizi/"]')).toHaveCount(0);
    await expect(main.getByRole("link", { name: /Avvisami quando parte/ })).toHaveAttribute("href", "/con-un-medico");
    await expect(main.locator(".tm-presto")).not.toContainText("€");
    await expect(page.getByRole("link", { name: /Sei un medico/ })).toHaveCount(0);
    await expect(page.getByRole("heading", { name: /Non facciamo diagnosi\.\s*Facciamo chiarezza\./ })).toBeVisible();
    // Mai un medico che rivede «Capisci», mai conti alla rovescia
    const text = (await main.innerText()).toLowerCase();
    expect((text.match(/medic/g) ?? []).length, "menzioni di «medico»").toBeLessThanOrEqual(16);
    for (const bad of ["rivisto da un medico", "revisione medica", "solo oggi", "ultimi posti", "scade tra", "nella norma"]) expect(text).not.toContain(bad);
    // Barra d'aiuto mobile: nascosta sull'apertura, visibile scorrendo
    if (isMobile) {
      const bar = page.getByRole("navigation", { name: "Azioni rapide" });
      await page.evaluate(() => window.scrollTo(0, 0));
      await expect(bar).toBeHidden();
      await page.evaluate(() => window.scrollTo(0, window.innerHeight * 2));
      await expect(bar).toBeVisible();
    }
    // Sei blocchi più la striscia dei fatti.
    expect(await main.locator("section").count()).toBeLessThanOrEqual(8);
    const h = await page.evaluate(() => document.documentElement.scrollHeight / window.innerHeight);
    // 15/11/2026, «I tre momenti»: limiti invariati, 7 schermate su computer e 9,9 su telefono (oggi 6,95 e 9,7).
    expect(h, "schermate").toBeLessThan(isMobile ? 9.9 : 7);
    const words = (await main.innerText()).split(/\s+/).length;
    // V3: il doppio ingresso porta circa 55 parole, in parte compensate togliendo le rassicurazioni del blocco referto.
    // 13/11/2026: il blocco Famiglia porta circa 85 parole su desktop (metà sono numeri e date del grafico di esempio).
    // 15/11/2026: la home racconta tre momenti e risponde a sei domande; su telefono le risposte sono chiuse.
    expect(words).toBeLessThan(isMobile ? 900 : 1150);
    await expectAccessible(page);
  });

  test("cinque compiti dalla home, in pochi clic", async ({ page }) => {
    await page.goto("/");
    // 1. Quanto costa capire un referto? Visibile in home.
    await expect(page.locator("main")).toContainText("2,90 €");
    // 2. Capire un referto: un clic porta al servizio
    await page.locator("main .tm-hero").getByRole("link", { name: /Carica un referto/ }).click();
    await expect(page).toHaveURL(/\/referti$/);
    // 3. Emergenza: il 112 è in home
    await page.goto("/");
    await expect(page.locator("main")).toContainText("112");
    // 4. Vorrei un medico: un clic porta alla lista d'attesa, senza prezzi
    await page.locator("main").getByRole("link", { name: /Avvisami quando parte/ }).click();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Presto anche con un medico.");
    // 5. Prepararsi alla visita: un clic, dal secondo momento
    await page.goto("/");
    await page.locator("main").getByRole("link", { name: /Preparati alla visita/ }).click();
    await expect(page).toHaveURL(/preparati-alla-visita/);
  });
});

test.describe("percorsi A e D", () => {
  test("A: visitatore → Capisci → pagamento → documento → report", async ({ browser }) => {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await page.goto("/");
    await page.getByRole("link", { name: "Capisci il tuo referto" }).first().click();
    await expect(page).toHaveURL(/\/referti$/);
    await signup(ctx.request, `a-${Date.now()}@test.invalid`);
    const doc = await verifiedDocument(ctx.request);
    const o = await (await ctx.request.post("/api/v1/area/orders", { data: { service: "essenziale", documentId: doc } })).json();
    expect(o.checkoutUrl).toBeTruthy();
    await page.goto(o.checkoutUrl);
    await page.getByRole("button", { name: "Conferma il pagamento di prova" }).click();
    await expect(page).toHaveURL(new RegExp(`/area-personale/documenti/${doc}`));
    await ctx.close();
  });

  test("D: area personale con documenti, numeri nel tempo, famiglia, promemoria e pagamenti; niente voci dei medici", async ({ browser, isMobile }) => {
    const ctx = await browser.newContext(isMobile ? { viewport: { width: 390, height: 844 } } : {});
    await signup(ctx.request, `d-${Date.now()}@test.invalid`);
    await verifiedDocument(ctx.request);
    const page = await ctx.newPage();
    await page.setViewportSize(isMobile ? { width: 390, height: 844 } : { width: 1440, height: 900 });
    await page.goto("/area-personale");
    const nav = page.getByRole("navigation", { name: "Area personale" }).last();
    for (const label of isMobile ? ["Referti", "Numeri", "Famiglia", "Agenda"] : ["I miei documenti e report", "Nel tempo", "La famiglia", "Promemoria", "Dossier", "Pagamenti"]) await expect(nav.getByRole("link", { name: label })).toBeVisible();
    for (const label of ["Medico", "Pareri", "Visite e videoconsulti", "I miei pareri"]) await expect(page.getByRole("link", { name: label, exact: true })).toHaveCount(0);
    for (const [path, h] of [["/area-personale/promemoria", /Le prossime cose da fare/], ["/area-personale/ordini", "Pagamenti"]] as const) {
      await page.goto(path);
      await expect(page.getByRole("heading", { name: h, level: 1 })).toBeVisible({ timeout: 15_000 });
    }
    // Le pagine dei servizi con un medico, anche dentro l'area, portano a «Presto anche con un medico».
    for (const path of ["/area-personale/secondo-parere", "/area-personale/appuntamenti"]) {
      await page.goto(path);
      await expect(page).toHaveURL(/\/con-un-medico$/);
    }
    await ctx.close();
  });
});
