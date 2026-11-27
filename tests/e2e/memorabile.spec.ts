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
      ["/lettura-referti", "Il tuo referto, in parole semplici.", "Carica un referto"],
    ] as const) {
      await page.goto(path);
      await expect(page.getByRole("heading", { level: 1 })).toHaveText(name);
      await expect(page.getByText("Di norma in pochi minuti", { exact: false }).first()).toBeVisible();
      await expect(page.getByRole("note").filter({ hasText: "Versione dimostrativa" }).first()).toBeVisible();
      await expect(page.getByRole("link", { name: "Che cosa manca per il servizio reale" })).toHaveAttribute("href", "/stato-del-progetto");
      await expect(page.locator("main").getByRole("link", { name: cta }).first()).toBeVisible();
      await expectAccessible(page);
    }
  });

  test("Ti aiutiamo a scegliere: dal bisogno al servizio, senza domande cliniche", async ({ page }) => {
    await page.goto("/inizia");
    await expect(page.getByText("Non ti chiediamo sintomi né dati sanitari", { exact: false })).toBeVisible();
    // Senza medici le risposte sono due: il referto da capire e la visita da preparare.
    await expect(page.getByRole("radio")).toHaveCount(2);
    await page.getByLabel("Ho un referto che non capisco").check();
    await expect(page.getByRole("link", { name: "Scopri il servizio" })).toHaveAttribute("href", "/lettura-referti");
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
    await expect(page.getByText(/Hai già il tuo referto\? Rendilo chiaro: il primo 2,90\s€, poi 7,90\s€\./)).toBeVisible();
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
      for (const path of ["/", "/prezzi", "/lettura-referti", "/medici", "/inizia", "/strumenti/preparati-alla-visita"]) {
        await page.goto(path);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
        expect(overflow, `${path} @${width}`).toBeLessThanOrEqual(0);
      }
    }
  });
});

/**
 * 19/11/2026: la home «chiara e scura» (Simone: «Sì a questa home»). Senza medici (lo stato di queste prove) il medico
 * è «In arrivo», senza prezzi, con la lista d'attesa. Con i medici accesi: tests/e2e-medici/memorabile.spec.ts.
 */
test.describe("home chiara e scura", () => {
  test("il percorso in quattro passi, il medico «In arrivo», i mondi da esplorare; corta e senza dati inventati", async ({ page, isMobile }) => {
    await page.goto("/");
    const main = page.locator("main");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(/La tua salute,\s*tutta in una pagina\./);
    // 22/11/2026: il percorso in cinque passi, come il menu; ognuno porta alla sua parte della home.
    const filo = main.getByRole("navigation", { name: "Il percorso, in cinque passi" });
    await expect(filo.getByRole("link")).toHaveCount(5);
    for (const [i, href] of ["#passo-1", "#passo-2", "#passo-3", "#medico", "#esplora"].entries()) await expect(filo.getByRole("link").nth(i)).toHaveAttribute("href", href);
    // 22/11/2026 (analisi di chiarezza, punto 13): gli stessi nomi brevi della testata.
    for (const t of ["Inizia", "Esami", "Referti", "Medico", "Cura di te"]) await expect(filo).toContainText(t);
    await expect(main.locator("#passo-1 a").first()).toHaveAttribute("href", "/punto-di-partenza");
    await expect(main.locator("#passo-2 a").first()).toHaveAttribute("href", "/prevenzione/esami-di-base");
    await expect(main.locator("#passo-2")).toContainText("Elenco gratis");
    // 22/11/2026 (punti 10–11): il primo pulsante è gratuito e una riga dice che cosa si paga.
    await expect(main.getByRole("link", { name: /Inizia da te, gratis/ }).first()).toHaveAttribute("href", "/punto-di-partenza");
    await expect(main.getByTestId("home-gratis-paghi")).toContainText("Paghi solo");
    await expect(main.locator("#passo-3")).toContainText("2,90 €");
    await expect(main.locator("#passo-4 a").first()).toHaveAttribute("href", "/lettura-referti#guida-personale");
    await expect(main.locator("#passo-4")).toContainText("Inclusa nel report");
    await expect(main.locator("#passo-4")).toContainText("Sonno");
    // Il medico, spento: «In arrivo», niente prezzi, la lista d'attesa
    const medico = main.locator("#medico");
    await expect(medico).toContainText("In arrivo");
    await expect(medico).not.toContainText("€");
    await expect(medico.getByRole("button", { name: "Iscrivimi alla lista d'attesa" })).toBeVisible();
    await expect(page.locator('main a[href^="/servizi/"], main a[href^="/richiedi/"]')).toHaveCount(0);
    // I mondi da esplorare, vicino a casa e nel tempo, il tuo spazio; lo Scaffale in fondo al passo 5, segnato come
    // pubblicità e, finché non ci sono affiliazioni, come esempio (22/11/2026, sì di Simone).
    for (const href of ["/integratori", "/prevenzione/intestino-e-microbiota", "/prevenzione/alimentazione", "/prenditi-cura-di-te/sonno", "/vicino-a-te", "/area-personale/nel-tempo", "/scaffale", "/accedi"]) await expect(main.locator(`a[href="${href}"]`).first()).toBeVisible();
    await expect(main.locator("#scaffale")).toContainText("nessun accordo");
    await expect(main.locator("#scaffale")).toContainText("Esempio");
    await expect(main.locator("#scaffale")).toContainText("non abbiamo ancora accordi");
    for (const a of await main.locator('#scaffale a[target="_blank"]').all()) await expect(a).toHaveAttribute("rel", /sponsored/);
    // Ogni fotografia è dichiarata
    for (const f of await main.locator("figure:has(img)").all()) await expect(f).toContainText("Immagine illustrativa");
    const text = (await main.innerText()).toLowerCase();
    // 22/11/2026: la visita a domicilio non è più in home.
    expect(text).not.toContain("a casa tua");
    await expect(main.locator("#esplora")).toContainText("Passo 5 · Prenditi cura di te");
    for (const bad of ["rivisto da un medico", "revisione medica", "solo oggi", "ultimi posti", "scade tra", "nella norma", "esami consigliati", "pulizia intestinale"]) expect(text).not.toContain(bad);
    // Barra d'aiuto mobile: nascosta sull'apertura, visibile scorrendo
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
    // 1. Quanto costa capire un referto? Visibile in home.
    await expect(page.locator("main")).toContainText("2,90 €");
    // 2. Capire un referto: la tessera 3 porta al primo passo del caricamento; senza sessione, prima all'accesso
    await page.locator("main #passo-3 a").first().click();
    await expect(page).toHaveURL(/\/accedi\?next=%2Farea-personale%2Fnuovo$/);
    // 3. Emergenza: il 112 è in home
    await page.goto("/");
    await expect(page.locator("main")).toContainText("112");
    // 4. Vorrei un medico: dal primo schermo al riquadro del medico, «In arrivo», con la lista d'attesa
    await page.locator("main .hb-docq").click();
    await expect(page).toHaveURL(/#medico$/);
    await expect(page.locator("main #medico")).toContainText("In arrivo");
    // 5. Un integratore: un clic dalla tessera
    await page.locator("main #esplora").getByRole("link", { name: /^Integratori/ }).click();
    await expect(page).toHaveURL(/\/integratori$/);
  });

  test("le pagine delle tessere: un titolo, la bozza dichiarata, i rimandi alle guide", async ({ page }) => {
    for (const [path, h1] of [
      ["/prevenzione/esami-di-base", /L’elenco degli\s*esami di base\./],
      ["/prevenzione/intestino-e-microbiota", /Equilibrio intestinale:\s*fibre, fermentati, probiotici\./],
      ["/prevenzione/alimentazione", /Mangiare bene,\s*senza mode\./],
      ["/prevenzione/screening", /Gli screening gratuiti,\s*per chi e quando\./],
      ["/vicino-a-te", /Il servizio pubblico,\s*vicino a te\./],
      ["/scaffale", /Lo Scaffale:\s*pubblicità, e lo diciamo\./],
    ] as const) {
      await page.goto(path);
      await expect(page.getByRole("heading", { level: 1 }), path).toHaveText(h1);
      await expect(page.locator("main [data-bozza]"), path).toHaveCount(1);
      await expect(page.locator("main"), path).toContainText("112");
    }
    // L'elenco degli esami di base spiega l'asterisco e porta alle guide
    await page.goto("/prevenzione/esami-di-base");
    await expect(page.locator("#senza-ricetta")).toContainText("In molti laboratori privati");
    await page.getByRole("link", { name: /Emocromo/ }).first().click();
    await expect(page).toHaveURL(/\/guide\/emocromo$/);
    // Lo Scaffale: prodotti di esempio dichiarati, nessun prezzo
    await page.goto("/scaffale");
    await expect(page.locator("main")).not.toContainText("€");
    await expect(page.locator("main [data-testid=scaffale]")).toContainText("Esempio");
  });
});

test.describe("sezioni e integratori", () => {
  test("Prevenzione, Lettura referti, Medici (spenta) e le schede degli integratori", async ({ page }) => {
    await page.goto("/prevenzione");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(/Gli esami da conoscere,\s*per la tua età\./);
    await expectAccessible(page);
    // 22/11/2026: gli integratori sono passati al passo 5, «Prenditi cura di te».
    await page.goto("/prenditi-cura-di-te");
    await expect(page.locator("main .ds-int")).toHaveCount(8);
    await expectAccessible(page);
    await page.goto("/lettura-referti");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(/Il tuo referto,\s*in parole semplici\./);
    await expect(page.getByRole("slider", { name: /Sposta per confrontare/ })).toBeVisible();
    await expectAccessible(page);
    // I vecchi indirizzi delle due sezioni portano alle nuove.
    await page.goto("/online");
    await expect(page).toHaveURL(/\/prevenzione$/);
    await page.goto("/a-domicilio");
    await expect(page).toHaveURL(/\/medici$/);
    await expect(page.locator("main")).toContainText("In arrivo");
    await expect(page.locator("main .ds-doc")).toHaveCount(0);
    await expect(page.locator("main")).not.toContainText("149");
    await expectAccessible(page);
    await page.goto("/integratori");
    await page.getByRole("link", { name: /Vitamina D/ }).first().click();
    await expect(page).toHaveURL(/\/integratori\/vitamina-d$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Vitamina D");
    await expect(page.locator("main")).toContainText("Bozza in attesa di revisione medica");
    await expect(page.getByRole("link", { name: /Guida all’esame/ })).toHaveAttribute("href", "/guide/vitamina-d");
    await expectAccessible(page);
  });
});

test.describe("percorsi A e D", () => {
  test("A: visitatore → Capisci → pagamento → documento → report", async ({ browser }) => {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await page.goto("/");
    // 19/11/2026, home «chiara e scura»: dalla tessera 4 («Ricevi la tua guida personale») alla pagina del servizio.
    await page.locator('main a[href^="/lettura-referti"]').filter({ visible: true }).first().click();
    await expect(page).toHaveURL(/\/lettura-referti(#guida-personale)?$/);
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
    // Le pagine dei servizi con un medico, anche dentro l'area, portano alla sezione Medici, «In arrivo».
    for (const path of ["/area-personale/secondo-parere", "/area-personale/appuntamenti"]) {
      await page.goto(path);
      await expect(page).toHaveURL(/\/medici$/);
    }
    await ctx.close();
  });
});
