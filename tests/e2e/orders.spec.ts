import { test, expect, type APIRequestContext } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const AXE_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

async function signup(request: APIRequestContext, email: string) {
  const r = await request.post("/api/v1/auth/magic-link", { data: { email, consents: ["terms", "privacy", "health-data"] } });
  expect(r.status()).toBe(200);
  const body = await r.json();
  const v = await request.get(body.link, { maxRedirects: 0 });
  expect(v.status()).toBe(303);
}

/** Documento verificato, pronto per essere acquistato. */
async function verifiedDocument(request: APIRequestContext) {
  const c = await request.post("/api/v1/area/documents", { data: { sampleId: "demo-referto-lab-001" } });
  expect(c.status()).toBe(201);
  const { id } = await c.json();
  const d = await (await request.get(`/api/v1/area/documents/${id}`)).json();
  const ids = d.document.extracted.observations.filter((o: { valueRaw: string | null }) => o.valueRaw !== null).map((o: { id: string }) => o.id);
  expect((await request.post(`/api/v1/area/documents/${id}/verification`, { data: { confirmedObservationIds: ids } })).status()).toBe(200);
  return id as string;
}

async function newOrder(request: APIRequestContext, documentId: string) {
  const r = await request.post("/api/v1/area/orders", { data: { service: "essenziale", documentId } });
  expect(r.status()).toBe(201);
  return (await r.json()) as { id: string; checkoutUrl: string; provider: string };
}

test.describe("ordini e pagamenti simulati", () => {
  test("pagina ordine: 0 violazioni axe e dati corretti", async ({ browser }) => {
    const ctx = await browser.newContext();
    await signup(ctx.request, `ord-axe-${Date.now()}@test.invalid`);
    const doc = await verifiedDocument(ctx.request);
    const o = await newOrder(ctx.request, doc);
    expect(o.provider).toBe("simulated");
    expect(o.checkoutUrl).toBe(`/area/ordini/${o.id}`);
    const page = await ctx.newPage();
    await page.goto(o.checkoutUrl);
    await expect(page.getByRole("heading", { name: "Il tuo ordine." })).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText("Pagamento simulato — nessun addebito")).toBeVisible();
    await expect(page.getByText("9,90")).toBeVisible();
    await expect(page.getByText("In attesa di pagamento")).toBeVisible();
    const axe = await new AxeBuilder({ page }).withTags(AXE_TAGS).analyze();
    expect(axe.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`)).toEqual([]);
    await ctx.close();
  });

  test("pagamento fallito, poi nuovo tentativo e pagamento riuscito", async ({ browser }) => {
    const ctx = await browser.newContext();
    await signup(ctx.request, `ord-fail-${Date.now()}@test.invalid`);
    const doc = await verifiedDocument(ctx.request);
    const o = await newOrder(ctx.request, doc);
    const page = await ctx.newPage();
    await page.goto(o.checkoutUrl);
    await page.getByRole("button", { name: "Simula un pagamento fallito" }).click();
    await expect(page.getByText("Il pagamento non è andato a buon fine.")).toBeVisible();
    // Nessun report generato da un pagamento fallito
    expect((await (await ctx.request.get(`/api/v1/area/documents/${doc}`)).json()).reports).toEqual([]);
    // Un ordine non più in attesa non accetta altri esiti
    expect((await ctx.request.post(`/api/v1/area/orders/${o.id}/simula`, { data: { esito: "pagato" } })).status()).toBe(409);
    await page.getByRole("button", { name: "Riprova" }).click();
    await expect(page).toHaveURL(/\/area\/ordini\/[0-9a-f-]{36}$/);
    await expect(page).not.toHaveURL(new RegExp(o.id));
    await page.getByRole("button", { name: "Conferma il pagamento di prova" }).click();
    await expect(page.getByText("Pagamento registrato")).toBeVisible();
    await page.getByRole("link", { name: "Torna al referto" }).click();
    await expect(page.getByRole("heading", { name: "Il tuo referto, in parole semplici." })).toBeVisible({ timeout: 20_000 });
    const orders = (await (await ctx.request.get("/api/v1/area/orders")).json()).orders as { status: string }[];
    expect(orders.map((x) => x.status).sort()).toEqual(["failed", "paid"]);
    await ctx.close();
  });

  test("ordine annullato: nessun report, elenco ordini aggiornato", async ({ browser }) => {
    const ctx = await browser.newContext();
    await signup(ctx.request, `ord-canc-${Date.now()}@test.invalid`);
    const doc = await verifiedDocument(ctx.request);
    const o = await newOrder(ctx.request, doc);
    const page = await ctx.newPage();
    await page.goto(o.checkoutUrl);
    await page.getByRole("button", { name: "Annulla" }).click();
    await expect(page).toHaveURL(new RegExp(`/area/documenti/${doc}`));
    const got = (await (await ctx.request.get(`/api/v1/area/orders/${o.id}`)).json()).order;
    expect(got.status).toBe("cancelled");
    expect((await (await ctx.request.get(`/api/v1/area/documents/${doc}`)).json()).reports).toEqual([]);
    await page.goto("/area/ordini");
    await expect(page.getByRole("heading", { name: "Ordini" })).toBeVisible();
    await expect(page.getByText("Annullato")).toBeVisible({ timeout: 15_000 });
    const axe = await new AxeBuilder({ page }).withTags(AXE_TAGS).analyze();
    expect(axe.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`)).toEqual([]);
    await ctx.close();
  });

  test("ordine non valido: documento non verificato → 409; servizio sconosciuto → 400", async ({ browser }) => {
    const ctx = await browser.newContext();
    await signup(ctx.request, `ord-inv-${Date.now()}@test.invalid`);
    const c = await ctx.request.post("/api/v1/area/documents", { data: { sampleId: "demo-referto-lab-001" } });
    const { id } = await c.json();
    expect((await ctx.request.post("/api/v1/area/orders", { data: { service: "essenziale", documentId: id } })).status()).toBe(409);
    expect((await ctx.request.post("/api/v1/area/orders", { data: { service: "gratis", documentId: id } })).status()).toBe(400);
    await ctx.close();
  });

  test("senza sessione le API ordini rispondono 401", async ({ request }) => {
    expect((await request.get("/api/v1/area/orders")).status()).toBe(401);
    expect((await request.post("/api/v1/area/orders", { data: {} })).status()).toBe(401);
  });

  test("webhook senza firma: 400", async ({ request }) => {
    const r = await request.post("/api/v1/payments/webhook", { data: { id: "evt_x", type: "checkout.session.completed" } });
    expect(r.status()).toBe(400);
    const r2 = await request.post("/api/v1/payments/webhook", { data: {}, headers: { "stripe-signature": "t=1,v1=abc" } });
    expect(r2.status()).toBe(400);
  });

  test("ordine sconosciuto: 404 in API e nella pagina", async ({ browser }) => {
    const ctx = await browser.newContext();
    await signup(ctx.request, `ord-404-${Date.now()}@test.invalid`);
    const unknown = "00000000-0000-4000-8000-000000000000";
    expect((await ctx.request.get(`/api/v1/area/orders/${unknown}`)).status()).toBe(404);
    expect((await ctx.request.get("/api/v1/area/orders/non-un-uuid")).status()).toBe(404);
    const page = await ctx.newPage();
    await page.goto(`/area/ordini/${unknown}`);
    await expect(page.getByRole("heading", { name: "Ordine non trovato." })).toBeVisible({ timeout: 15_000 });
    await ctx.close();
  });
});
