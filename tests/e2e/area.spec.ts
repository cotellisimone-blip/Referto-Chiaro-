import { test, expect, type APIRequestContext } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/** Registra un utente con email e consuma il link mostrato a schermo (nessuna email in demo). */
async function signup(request: APIRequestContext, email: string) {
  const r = await request.post("/api/v1/auth/magic-link", { data: { email, consents: ["terms", "privacy", "health-data"] } });
  expect(r.status()).toBe(200);
  const body = await r.json();
  expect(body.delivery).toBe("on-screen");
  const v = await request.get(body.link, { maxRedirects: 0 });
  expect(v.status()).toBe(303);
  expect(v.headers().location).toContain("/area-personale");
}

async function createReadyDocument(request: APIRequestContext, sampleId: string) {
  const c = await request.post("/api/v1/area/documents", { data: { sampleId } });
  expect(c.status()).toBe(201);
  const { id } = await c.json();
  const d = await (await request.get(`/api/v1/area/documents/${id}`)).json();
  expect(d.document.status).toBe("needs-verification");
  const ids = d.document.extracted.observations.filter((o: { valueRaw: string | null }) => o.valueRaw !== null).map((o: { id: string }) => o.id);
  expect((await request.post(`/api/v1/area/documents/${id}/verification`, { data: { confirmedObservationIds: ids } })).status()).toBe(200);
  // Il report nasce solo dopo il pagamento: ordine → esito simulato "pagato" → generazione (avanza con il GET).
  const ord = await request.post("/api/v1/area/orders", { data: { service: "essenziale", documentId: id } });
  expect(ord.status()).toBe(201);
  const order = await ord.json();
  expect(order.provider).toBe("simulated");
  const sim = await request.post(`/api/v1/area/orders/${order.id}/simula`, { data: { esito: "pagato" } });
  expect(sim.status()).toBe(200);
  expect((await sim.json()).order.status).toBe("paid");
  const list = await (await request.get(`/api/v1/area/documents/${id}`)).json();
  expect(list.reports).toHaveLength(1);
  const reportId = list.reports[0].id as string;
  const after = await (await request.get(`/api/v1/area/reports/${reportId}`)).json();
  expect(after.report.status).toBe("ready");
  return { id, reportId, orderId: order.id as string };
}

test.describe("area personale", () => {
  test("senza sessione le API rispondono 401 e la pagina rimanda all'accesso", async ({ request, page }) => {
    expect((await request.get("/api/v1/area/documents")).status()).toBe(401);
    await page.goto("/area-personale");
    await expect(page).toHaveURL(/\/accedi/);
  });

  test("percorso completo con l'account demo: nuovo referto → valori → servizio → report → PDF", async ({ page }) => {
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
    // Senza medici (src/lib/medici.ts) il report non propone visite né consulti: quella continuità è provata in tests/e2e-medici.
    await expect(page.getByTestId("prossimo-passo")).toHaveCount(0);
    await expect(page.locator("main").getByRole("link", { name: /Parla con un medico|secondo parere/i })).toHaveCount(0);
  });

  test("nessuno vede i documenti di un altro (API e pagine)", async ({ browser }) => {
    const a = await browser.newContext();
    const b = await browser.newContext();
    const stamp = Date.now();
    await signup(a.request, `alice-${stamp}@test.invalid`);
    await signup(b.request, `bob-${stamp}@test.invalid`);
    const docA = await createReadyDocument(a.request, "demo-referto-lab-001");
    // Bob: lista vuota, 404 su documento, report, PDF e cancellazione di Alice
    const listB = await (await b.request.get("/api/v1/area/documents")).json();
    expect(listB.documents).toEqual([]);
    expect((await b.request.get(`/api/v1/area/documents/${docA.id}`)).status()).toBe(404);
    expect((await b.request.get(`/api/v1/area/reports/${docA.reportId}`)).status()).toBe(404);
    expect([404, 409]).toContain((await b.request.get(`/api/v1/area/reports/${docA.reportId}/pdf`)).status());
    expect((await b.request.delete(`/api/v1/area/documents/${docA.id}`)).status()).toBe(404);
    expect((await b.request.get(`/api/v1/area/orders/${docA.orderId}`)).status()).toBe(404);
    expect((await b.request.post(`/api/v1/area/orders/${docA.orderId}/simula`, { data: { esito: "annullato" } })).status()).toBe(404);
    expect((await b.request.post("/api/v1/area/orders", { data: { service: "essenziale", documentId: docA.id } })).status()).toBe(409);
    expect((await (await b.request.get("/api/v1/area/orders")).json()).orders).toEqual([]);
    expect((await b.request.post(`/api/v1/area/documents/${docA.id}/verification`, { data: { confirmedObservationIds: ["obs-01"] } })).status()).toBe(409);
    // Alice ha ancora tutto
    expect((await a.request.get(`/api/v1/area/documents/${docA.id}`)).status()).toBe(200);
    const pageB = await b.newPage();
    await pageB.goto(`/area-personale/documenti/${docA.id}`);
    await expect(pageB.getByRole("alert").filter({ hasText: /non trovato/i })).toBeVisible({ timeout: 15_000 });
    // L'esportazione di Bob non contiene nulla di Alice
    const exportB = await (await b.request.get("/api/v1/area/export")).json();
    expect(JSON.stringify(exportB)).not.toContain(docA.id);
    await a.close();
    await b.close();
  });

  test("dossier: due referti con report pronto, confronto solo tra esami confrontabili", async ({ browser }) => {
    const ctx = await browser.newContext();
    await signup(ctx.request, `dossier-${Date.now()}@test.invalid`);
    const d1 = await createReadyDocument(ctx.request, "demo-referto-lab-001");
    const d2 = await createReadyDocument(ctx.request, "demo-referto-lipidico-004");
    const c = await ctx.request.post("/api/v1/area/dossiers", { data: { title: "Visita di dicembre", documentIds: [d1.id, d2.id] } });
    expect(c.status()).toBe(201);
    const { id } = await c.json();
    const page = await ctx.newPage();
    await page.goto(`/area-personale/dossier/${id}`);
    await expect(page.getByRole("heading", { name: "Visita di dicembre" })).toBeVisible({ timeout: 15_000 });
    await expect(page.getByRole("heading", { name: "Esami confrontabili" })).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText("Colesterolo LDL", { exact: true })).toBeVisible();
    await expect(page.getByText(/Era 118 mg\/dL/)).toBeVisible();
    await expect(page.getByText(/Trigliceridi/)).toBeVisible();
    const axe = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
    expect(axe.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`)).toEqual([]);
    await ctx.close();
  });

  test("telefono stretto con testo grande: confronto del dossier, cruscotto e barra in basso restano dentro lo schermo", async ({ browser, isMobile }) => {
    test.skip(!isMobile, "solo telefono");
    const ctx = await browser.newContext({ viewport: { width: 320, height: 760 } });
    await ctx.addInitScript(() => {
      try {
        localStorage.setItem("rc-size", "large");
      } catch {
        // senza memoria del browser la prova non ha senso, ma non deve rompersi qui
      }
    });
    await signup(ctx.request, `stretto-${Date.now()}@test.invalid`);
    const d1 = await createReadyDocument(ctx.request, "demo-referto-lab-001");
    const d2 = await createReadyDocument(ctx.request, "demo-referto-lipidico-004");
    // Titolo lungo di proposito: nel cruscotto non va a capo e non deve allargare la pagina.
    const c = await ctx.request.post("/api/v1/area/dossiers", { data: { title: "Visita di dicembre con il cardiologo", documentIds: [d1.id, d2.id] } });
    expect(c.status()).toBe(201);
    const { id } = await c.json();
    const page = await ctx.newPage();
    const fits = async (what: string) => {
      const m = await page.evaluate(() => ({ sw: document.documentElement.scrollWidth, vw: window.innerWidth }));
      expect(m.sw, what).toBeLessThanOrEqual(m.vw);
    };
    for (const width of [320, 360, 390]) {
      await page.setViewportSize({ width, height: 760 });
      await page.goto(`/area-personale/dossier/${id}`);
      await expect(page.locator("html")).toHaveAttribute("data-size", "large");
      await expect(page.getByRole("heading", { name: "Esami confrontabili" })).toBeVisible({ timeout: 15_000 });
      await fits(`dossier a ${width} px`);
      // Nella scheda stretta ogni rilevazione va su due righe, con l'etichetta scritta; niente esce dalla scheda.
      const card = page.locator(".cmp-card").first();
      await expect(card.getByText("Intervallo stampato:").first()).toBeVisible();
      const spill = await card.evaluate((el) => {
        const inner = el.getBoundingClientRect().right - parseFloat(getComputedStyle(el).paddingRight);
        return Math.max(...[...el.querySelectorAll("td")].map((td) => td.getBoundingClientRect().right - inner));
      });
      expect(spill, `celle dentro la scheda a ${width} px`).toBeLessThanOrEqual(0.5);
      // Per i lettori di schermo resta una tabella: intestazioni e righe ci sono ancora.
      await expect(card.getByRole("table")).toHaveCount(1);
      await expect(card.getByRole("columnheader")).toHaveCount(3);
      await expect(card.getByRole("row")).toHaveCount(3);
      // Barra in basso: le cinque voci si leggono intere.
      const cut = await page.locator(".area-tabbar-label").evaluateAll((els) => els.filter((e) => e.scrollWidth > e.clientWidth + 0.5).map((e) => e.textContent));
      expect(cut, `voci troncate nella barra a ${width} px`).toEqual([]);
      await page.goto("/area-personale");
      await expect(page.getByRole("heading", { name: "I tuoi dossier" })).toBeVisible({ timeout: 15_000 });
      await expect(page.getByRole("link", { name: /Visita di dicembre con il cardiologo/ })).toBeVisible();
      await fits(`cruscotto a ${width} px`);
    }
    // Da tablet torna la tabella a tre colonne, con le intestazioni visibili e senza l'etichetta ripetuta.
    await page.setViewportSize({ width: 820, height: 900 });
    await page.goto(`/area-personale/dossier/${id}`);
    const wide = page.locator(".cmp-card").first();
    await expect(wide.getByRole("columnheader", { name: "Intervallo stampato" })).toBeVisible({ timeout: 15_000 });
    await expect(wide.getByText("Intervallo stampato:").first()).toBeHidden();
    await ctx.close();
  });

  test("eliminare un dossier o un referto: la conferma è dentro la pagina, senza finestre del browser", async ({ browser }) => {
    const ctx = await browser.newContext();
    await signup(ctx.request, `elimina-${Date.now()}@test.invalid`);
    const d1 = await createReadyDocument(ctx.request, "demo-referto-lab-001");
    const d2 = await createReadyDocument(ctx.request, "demo-referto-lipidico-004");
    const c = await ctx.request.post("/api/v1/area/dossiers", { data: { title: "Da eliminare", documentIds: [d1.id, d2.id] } });
    expect(c.status()).toBe(201);
    const dossierId = (await c.json()).id as string;
    const page = await ctx.newPage();
    // Una finestra del browser («confirm») qui sarebbe un difetto: si annota e si chiude, e a fine prova l'elenco deve essere vuoto.
    const dialogs: string[] = [];
    page.on("dialog", (d) => {
      dialogs.push(d.message());
      void d.dismiss();
    });
    const fits = () => page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);

    // Dossier. «No» ed Esc lasciano tutto com'è e riportano il fuoco sul comando; «Sì, elimina» lo toglie e i referti restano.
    await page.goto(`/area-personale/dossier/${dossierId}`);
    await expect(page.getByRole("heading", { name: "Da eliminare" })).toBeVisible({ timeout: 15_000 });
    const elimina = page.getByRole("button", { name: "Elimina", exact: true });
    await elimina.click();
    const domanda = page.getByRole("group", { name: "Eliminare il dossier? I referti restano." });
    await expect(domanda).toBeVisible();
    await expect(domanda.getByRole("button", { name: "No", exact: true })).toBeFocused();
    expect(await fits()).toBe(true);
    await domanda.getByRole("button", { name: "No", exact: true }).click();
    await expect(domanda).toBeHidden();
    await expect(elimina).toBeFocused();
    await elimina.click();
    await expect(domanda).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(domanda).toBeHidden();
    await expect(elimina).toBeFocused();
    expect((await ctx.request.get(`/api/v1/area/dossiers/${dossierId}`)).status()).toBe(200);
    await elimina.click();
    await domanda.getByRole("button", { name: "Sì, elimina" }).click();
    await expect(page).toHaveURL(/\/area-personale\/dossier$/);
    expect((await ctx.request.get(`/api/v1/area/dossiers/${dossierId}`)).status()).toBe(404);
    expect((await ctx.request.get(`/api/v1/area/documents/${d1.id}`)).status()).toBe(200);

    // Referto. La domanda dice che cosa sparisce; con la domanda aperta la pagina resta larga quanto lo schermo e accessibile.
    await page.goto(`/area-personale/documenti/${d1.id}`);
    await expect(page.getByRole("heading", { name: "Il tuo referto, in parole semplici." })).toBeVisible({ timeout: 20_000 });
    await page.getByRole("button", { name: "Elimina", exact: true }).click();
    const domandaReferto = page.getByRole("group", { name: "Eliminare il referto e i suoi report? Non si può annullare." });
    await expect(domandaReferto).toBeVisible();
    expect(await fits()).toBe(true);
    const axe = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
    expect(axe.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`)).toEqual([]);
    await domandaReferto.getByRole("button", { name: "Sì, elimina" }).click();
    await expect(page).toHaveURL(/\/area-personale$/);
    expect((await ctx.request.get(`/api/v1/area/documents/${d1.id}`)).status()).toBe(404);
    expect((await ctx.request.get(`/api/v1/area/documents/${d2.id}`)).status()).toBe(200);
    expect(dialogs).toEqual([]);
    await ctx.close();
  });

  test("link di accesso monouso e scaduto; eliminazione account; upload reale bloccato anche da autenticati", async ({ browser }) => {
    const ctx = await browser.newContext();
    const email = `once-${Date.now()}@test.invalid`;
    const r = await (await ctx.request.post("/api/v1/auth/magic-link", { data: { email, consents: ["terms", "privacy", "health-data"] } })).json();
    expect((await ctx.request.get(r.link, { maxRedirects: 0 })).headers().location).toContain("/area-personale");
    expect((await ctx.request.get(r.link, { maxRedirects: 0 })).headers().location).toContain("errore=link");
    expect((await ctx.request.post("/api/v1/documents", { data: {} })).status()).toBe(403);
    expect((await ctx.request.post("/api/v1/area/delete-account", { data: { confirm: "no" } })).status()).toBe(400);
    expect((await ctx.request.post("/api/v1/area/delete-account", { data: { confirm: "ELIMINA" } })).status()).toBe(200);
    expect((await ctx.request.get("/api/v1/area/documents")).status()).toBe(401);
    await ctx.close();
  });

  test("registrazione senza consensi rifiutata; email non valida rifiutata", async ({ request }) => {
    expect((await request.post("/api/v1/auth/magic-link", { data: { email: `noconsent-${Date.now()}@test.invalid`, consents: [] } })).status()).toBe(400);
    expect((await request.post("/api/v1/auth/magic-link", { data: { email: "non-una-email", consents: ["terms", "privacy", "health-data"] } })).status()).toBe(400);
  });
});
