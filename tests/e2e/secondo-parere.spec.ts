import { test, expect, type APIRequestContext, type BrowserContext } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { totpCode } from "../../src/lib/auth/totp";

const AXE = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

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

/** Entra con l'account di servizio dimostrativo e supera la 2FA (setup al primo accesso, verifica dopo). */
async function loginRole(ctx: BrowserContext, role: "physician" | "admin") {
  const r = await (await ctx.request.post("/api/v1/auth/demo-ruolo", { data: { role } })).json();
  expect(r.ok).toBe(true);
  // Prima della 2FA le API riservate rispondono 403 mfa-required
  const blocked = await ctx.request.get(role === "physician" ? "/api/v1/medico/casi" : "/api/v1/admin/panoramica");
  expect(blocked.status()).toBe(403);
  expect((await blocked.json()).error).toBe("mfa-required");
  let secret: string;
  if (!r.mfaEnabled) {
    const s = await (await ctx.request.post("/api/v1/auth/mfa/setup", { data: {} })).json();
    secret = s.secret;
    expect((await ctx.request.post("/api/v1/auth/mfa/conferma", { data: { code: "000000" } })).status()).toBe(400);
    expect((await ctx.request.post("/api/v1/auth/mfa/conferma", { data: { code: totpCode(secret) } })).status()).toBe(200);
  } else {
    const s = await (await ctx.request.get("/api/v1/auth/mfa/verifica")).json();
    secret = s.secret;
    expect((await ctx.request.post("/api/v1/auth/mfa/verifica", { data: { code: totpCode(secret) } })).status()).toBe(200);
  }
}

test.describe("secondo parere e portali riservati", () => {
  test("richiesta → medico (2FA) prende in carico e firma → la persona legge il parere", async ({ browser }) => {
    const patient = await browser.newContext();
    await signup(patient.request, `paziente-${Date.now()}@test.invalid`);
    const docId = await verifiedDocument(patient.request);
    // Il medico dimostrativo deve esistere prima dell'assegnazione automatica
    const doctor = await browser.newContext();
    await loginRole(doctor, "physician");

    // Senza conferma esplicita della simulazione: rifiuto
    expect((await patient.request.post("/api/v1/area/casi", { data: { documentId: docId, specialty: "Medicina interna (simulazione)", question: "Una domanda abbastanza lunga da passare la validazione minima.", acknowledgeSimulation: false, consentToShare: true } })).status()).toBe(400);

    const page = await patient.newPage();
    await page.goto("/area-personale/secondo-parere");
    await expect(page.getByRole("heading", { name: "I miei pareri" })).toBeVisible();
    await page.getByLabel(/La tua domanda/).fill("Alcuni valori sono fuori dall'intervallo stampato: quali approfondimenti potrei chiedere al mio medico?");
    for (const box of await page.getByRole("checkbox").all()) await box.check(); // simulazione + consenso alla condivisione
    await page.getByRole("button", { name: /Continua al pagamento/ }).click();
    // Percorso B: documentazione → pagamento (simulato) → solo dopo arriva al medico
    await expect(page.getByRole("heading", { name: "Il tuo ordine." })).toBeVisible({ timeout: 15_000 });
    await expect(page.getByRole("main").getByText("Secondo parere", { exact: true }).first()).toBeVisible();
    await page.getByRole("button", { name: "Conferma il pagamento di prova" }).click();
    await page.getByRole("link", { name: "Vai alla richiesta" }).click();
    await expect(page.getByRole("heading", { name: "Richiesta di secondo parere" })).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText("Inviata", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("Pagamento registrato", { exact: false }).first()).toBeVisible();
    const axe1 = await new AxeBuilder({ page }).withTags(AXE).analyze();
    expect(axe1.violations.map((v) => v.id)).toEqual([]);
    const caseId = page.url().split("/").pop()!;

    // Un altro utente non vede il caso
    const other = await browser.newContext();
    await signup(other.request, `altro-${Date.now()}@test.invalid`);
    expect((await other.request.get(`/api/v1/area/casi/${caseId}`)).status()).toBe(404);

    // Il medico lo vede, lo prende in carico e firma
    const dp = await doctor.newPage();
    await dp.goto("/medico");
    await expect(dp.getByRole("heading", { name: /Medico dimostrativo/ })).toBeVisible({ timeout: 15_000 });
    await expect(dp.getByRole("link", { name: "Apri il caso" }).first()).toBeVisible();
    // Il medico dimostrativo è condiviso fra i test in parallelo: si apre il proprio caso, non il primo in lista.
    await dp.goto(`/medico/casi/${caseId}`);
    await expect(dp.getByRole("heading", { name: /^Caso ·/ })).toBeVisible();
    await expect(dp.getByRole("figure", { name: /Facsimile/ })).toBeVisible();
    const axe2 = await new AxeBuilder({ page: dp }).withTags(AXE).analyze();
    expect(axe2.violations.map((v) => v.id)).toEqual([]);
    await dp.getByRole("button", { name: "Prendo in carico" }).click();
    await expect(dp.getByRole("heading", { name: "Scrivi il parere" })).toBeVisible();
    // Senza conferma di responsabilità l'API rifiuta
    expect((await doctor.request.post(`/api/v1/medico/casi/${caseId}`, { data: { kind: "answer", answer: "x".repeat(100), confirmResponsibility: false } })).status()).toBe(400);
    await dp.getByLabel("Testo del parere").fill("Parere dimostrativo: i valori riportati vanno letti con il medico curante, che conosce la storia clinica. Questa risposta è una simulazione e non ha valore clinico.");
    await dp.getByRole("checkbox").check();
    await dp.getByRole("button", { name: "Firma e invia il parere" }).click();
    await expect(dp.getByRole("heading", { name: "Parere firmato" })).toBeVisible();
    await expect(dp.getByText(/impronta/).first()).toBeVisible();
    // Dopo la firma non si può rispondere di nuovo
    expect((await doctor.request.post(`/api/v1/medico/casi/${caseId}`, { data: { kind: "answer", answer: "y".repeat(100), confirmResponsibility: true } })).status()).toBe(409);

    // La persona legge il parere e chiude
    await page.reload();
    await expect(page.getByRole("heading", { name: "Parere", exact: true })).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText(/Firmato da Medico dimostrativo/)).toBeVisible();
    await page.getByRole("button", { name: "Chiudi la richiesta" }).click();
    await expect(page.getByText("Chiusa", { exact: true }).first()).toBeVisible();
    await patient.close();
    await doctor.close();
    await other.close();
  });

  test("portale medico: senza sessione chiede l'accesso; utente normale rifiutato; 2FA via interfaccia", async ({ browser }) => {
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await page.goto("/medico");
    await expect(page.getByRole("heading", { name: "Accesso riservato." })).toBeVisible();
    const axe = await new AxeBuilder({ page }).withTags(AXE).analyze();
    expect(axe.violations.map((v) => v.id)).toEqual([]);
    // Utente normale
    await signup(ctx.request, `normale-${Date.now()}@test.invalid`);
    await page.goto("/medico");
    await expect(page.getByRole("alert").filter({ hasText: "non ha il ruolo" })).toBeVisible();
    expect((await ctx.request.get("/api/v1/medico/casi")).status()).toBe(403);
    await ctx.request.post("/api/v1/auth/logout", { data: {} });
    // Medico dimostrativo dall'interfaccia: il codice valido è mostrato a schermo solo in demo
    await page.goto("/medico");
    await page.getByRole("button", { name: /Entra come medico dimostrativo/ }).click();
    await expect(page.getByRole("heading", { name: /seconda verifica/i })).toBeVisible({ timeout: 15_000 });
    const code = (await page.getByRole("note").filter({ hasText: "codice valido adesso" }).locator("strong").textContent())!.trim();
    await page.getByLabel("Codice a 6 cifre").fill(code);
    await page.getByRole("button", { name: /Attiva e continua|Verifica/ }).click();
    await expect(page.getByText("Sessione verificata con 2FA")).toBeVisible({ timeout: 15_000 });
    await ctx.close();
  });

  test("admin: 2FA obbligatoria, panoramica, lista d'attesa con CSV, verifica medici, registro; non-admin 403", async ({ browser }) => {
    const ctx = await browser.newContext();
    await ctx.request.post("/api/v1/waitlist", { data: { email: `attesa-${Date.now()}@test.invalid`, interest: "strutture", organization: "Laboratorio di prova", consent: true } });
    await loginRole(ctx, "admin");
    const over = await (await ctx.request.get("/api/v1/admin/panoramica")).json();
    expect(over.overview.users).toBeGreaterThan(0);
    const csv = await ctx.request.get("/api/v1/admin/lista-attesa?formato=csv");
    expect(csv.headers()["content-type"]).toContain("text/csv");
    expect(await csv.text()).toContain("Laboratorio di prova");
    const page = await ctx.newPage();
    await page.goto("/admin");
    await expect(page.getByRole("heading", { name: "Panoramica" })).toBeVisible({ timeout: 15_000 });
    const axe = await new AxeBuilder({ page }).withTags(AXE).analyze();
    expect(axe.violations.map((v) => v.id)).toEqual([]);
    await page.getByRole("link", { name: "Medici", exact: true }).click();
    await expect(page.getByRole("table", { name: "Medici" })).toBeVisible({ timeout: 15_000 });
    await page.getByRole("link", { name: "Registro" }).click();
    await expect(page.getByRole("table", { name: "Registro" })).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText("overview-viewed").first()).toBeVisible();
    await page.getByRole("link", { name: "Configurazione" }).click();
    await expect(page.getByText("simulato")).toBeVisible({ timeout: 15_000 });
    // Un medico non è admin
    const doc = await browser.newContext();
    await loginRole(doc, "physician");
    expect((await doc.request.get("/api/v1/admin/panoramica")).status()).toBe(403);
    expect((await doc.request.get("/api/v1/admin/registro")).status()).toBe(403);
    await ctx.close();
    await doc.close();
  });

  test("report diretto senza ordine pagato: 402", async ({ browser }) => {
    const ctx = await browser.newContext();
    await signup(ctx.request, `nopay-${Date.now()}@test.invalid`);
    const id = await verifiedDocument(ctx.request);
    expect((await ctx.request.post(`/api/v1/area/documents/${id}/reports`, { data: { service: "essenziale" } })).status()).toBe(402);
    await ctx.close();
  });
});
