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
  expect(v.headers().location).toContain("/area");
}

async function createReadyDocument(request: APIRequestContext, sampleId: string) {
  const c = await request.post("/api/v1/area/documents", { data: { sampleId } });
  expect(c.status()).toBe(201);
  const { id } = await c.json();
  const d = await (await request.get(`/api/v1/area/documents/${id}`)).json();
  expect(d.document.status).toBe("needs-verification");
  const ids = d.document.extracted.observations.filter((o: { valueRaw: string | null }) => o.valueRaw !== null).map((o: { id: string }) => o.id);
  expect((await request.post(`/api/v1/area/documents/${id}/verification`, { data: { confirmedObservationIds: ids } })).status()).toBe(200);
  const rep = await request.post(`/api/v1/area/documents/${id}/reports`, { data: { service: "essenziale" } });
  expect(rep.status()).toBe(201);
  const reportId = (await rep.json()).id;
  const after = await (await request.get(`/api/v1/area/reports/${reportId}`)).json();
  expect(after.report.status).toBe("ready");
  return { id, reportId };
}

test.describe("area personale", () => {
  test("senza sessione le API rispondono 401 e la pagina rimanda all'accesso", async ({ request, page }) => {
    expect((await request.get("/api/v1/area/documents")).status()).toBe(401);
    await page.goto("/area");
    await expect(page).toHaveURL(/\/accedi/);
  });

  test("percorso completo con l'account demo: nuovo referto → valori → servizio → report → PDF", async ({ page }) => {
    await page.goto("/accedi");
    await page.getByRole("button", { name: "Entra con l'account demo" }).click();
    await expect(page).toHaveURL(/\/area$/);
    await page.getByRole("link", { name: "Nuovo referto" }).first().click();
    await expect(page.getByRole("heading", { name: "Scegli un referto di esempio." })).toBeVisible();
    await page.getByLabel(/Funzionalità tiroidea/).check();
    await page.getByRole("button", { name: /Aggiungi e leggi il documento/ }).click();
    await expect(page.getByRole("heading", { name: "Controlla prima i valori." })).toBeVisible({ timeout: 15_000 });
    await page.getByRole("button", { name: "Conferma tutti i valori leggibili" }).click();
    await page.getByRole("button", { name: /Salva e scegli il servizio/ }).click();
    await expect(page.getByRole("heading", { name: "Scegli il servizio." })).toBeVisible();
    await page.getByRole("button", { name: /Genera il report/ }).click();
    await expect(page.getByRole("heading", { name: "Il tuo referto, in parole semplici." })).toBeVisible({ timeout: 20_000 });
    await expect(page.getByRole("list", { name: "Spiegazione dei valori" })).toBeVisible();
    await expect(page.getByText("Anticorpi anti-TPO", { exact: false }).first()).toBeVisible();
    const axe = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
    expect(axe.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`)).toEqual([]);
    const [download] = await Promise.all([page.waitForEvent("download"), page.getByRole("button", { name: "Scarica il PDF" }).click()]);
    expect(download.suggestedFilename()).toMatch(/^referto-chiaro-DEMO-.*\.pdf$/);
    // Ricaricando, si riparte dal report (stato nel database, non nel browser)
    await page.reload();
    await expect(page.getByRole("heading", { name: "Il tuo referto, in parole semplici." })).toBeVisible({ timeout: 15_000 });
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
    expect((await b.request.post(`/api/v1/area/documents/${docA.id}/verification`, { data: { confirmedObservationIds: ["obs-01"] } })).status()).toBe(409);
    // Alice ha ancora tutto
    expect((await a.request.get(`/api/v1/area/documents/${docA.id}`)).status()).toBe(200);
    const pageB = await b.newPage();
    await pageB.goto(`/area/documenti/${docA.id}`);
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
    await page.goto(`/area/dossier/${id}`);
    await expect(page.getByRole("heading", { name: "Visita di dicembre" })).toBeVisible({ timeout: 15_000 });
    await expect(page.getByRole("heading", { name: "Esami confrontabili" })).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText("Colesterolo LDL", { exact: true })).toBeVisible();
    await expect(page.getByText(/Era 118 mg\/dL/)).toBeVisible();
    await expect(page.getByText(/Trigliceridi/)).toBeVisible();
    const axe = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
    expect(axe.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`)).toEqual([]);
    await ctx.close();
  });

  test("link di accesso monouso e scaduto; eliminazione account; upload reale bloccato anche da autenticati", async ({ browser }) => {
    const ctx = await browser.newContext();
    const email = `once-${Date.now()}@test.invalid`;
    const r = await (await ctx.request.post("/api/v1/auth/magic-link", { data: { email, consents: ["terms", "privacy", "health-data"] } })).json();
    expect((await ctx.request.get(r.link, { maxRedirects: 0 })).headers().location).toContain("/area");
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
