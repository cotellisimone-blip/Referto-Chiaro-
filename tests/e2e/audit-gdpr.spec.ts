import { test, expect, type APIRequestContext } from "@playwright/test";

async function signup(request: APIRequestContext, email: string) {
  const r = await request.post("/api/v1/auth/magic-link", { data: { email, consents: ["terms", "privacy", "health-data", "subject-declaration"] } });
  expect(r.status()).toBe(200);
  const body = await r.json();
  expect(body.delivery).toBe("on-screen");
  expect(body.isNew).toBeUndefined();
  expect((await request.get(body.link, { maxRedirects: 0 })).headers().location).toContain("/area-personale");
}

test.describe("audit GDPR: consensi, revoca, cancellazione", () => {
  test("la revoca del consenso ai dati sanitari cancella i contenuti e blocca nuovi referti", async ({ browser }) => {
    const ctx = await browser.newContext();
    const email = `revoca-${Date.now()}@test.invalid`;
    await signup(ctx.request, email);
    const c = await ctx.request.post("/api/v1/area/documents", { data: { sampleId: "demo-referto-lab-001" } });
    expect(c.status()).toBe(201);
    expect((await (await ctx.request.get("/api/v1/area/documents")).json()).documents).toHaveLength(1);
    // Il consenso ai dati sanitari si può solo revocare, mai concedere da qui.
    expect((await ctx.request.post("/api/v1/area/consents", { data: { kind: "health-data", granted: true } })).status()).toBe(400);
    const w = await ctx.request.post("/api/v1/area/consents", { data: { kind: "health-data", granted: false } });
    expect(w.status()).toBe(200);
    expect((await (await ctx.request.get("/api/v1/area/documents")).json()).documents).toHaveLength(0);
    expect((await ctx.request.post("/api/v1/area/documents", { data: { sampleId: "demo-referto-lab-001" } })).status()).toBe(403);
    const consents = (await (await ctx.request.get("/api/v1/area/consents")).json()).consents as { kind: string; granted: boolean }[];
    expect(consents.find((x) => x.kind === "health-data")?.granted).toBe(false);
    expect(consents.some((x) => x.kind === "subject-declaration" && x.granted)).toBe(true);
    await ctx.close();
  });

  test("l'esportazione include ordini, richieste e registro; la cancellazione non lascia nulla", async ({ browser }) => {
    const ctx = await browser.newContext();
    const email = `cancella-${Date.now()}@test.invalid`;
    await signup(ctx.request, email);
    expect((await ctx.request.post("/api/v1/area/documents", { data: { sampleId: "demo-referto-lab-001" } })).status()).toBe(201);
    const exp = await (await ctx.request.get("/api/v1/area/export")).json();
    expect(exp).toHaveProperty("orders");
    expect(exp).toHaveProperty("secondOpinionCases");
    expect(exp.activityLog.some((a: { action: string }) => a.action === "signup")).toBe(true);
    expect(exp.user.email).toBe(email);
    expect((await ctx.request.post("/api/v1/area/delete-account", { data: { confirm: "ELIMINA" } })).status()).toBe(200);
    expect((await ctx.request.get("/api/v1/area/export")).status()).toBe(401);
    // Un nuovo link per la stessa email crea un account nuovo e vuoto: nulla del vecchio riaffiora.
    await signup(ctx.request, email);
    const again = await (await ctx.request.get("/api/v1/area/export")).json();
    expect(again.documents).toHaveLength(0);
    expect(again.activityLog.some((a: { action: string }) => a.action === "delete-account")).toBe(false);
    await ctx.close();
  });

  test("il link a schermo non viene mostrato per un account esistente con indirizzo reale", async ({ request }) => {
    const email = `persona-${Date.now()}@gmail.com`;
    const first = await (await request.post("/api/v1/auth/magic-link", { data: { email, consents: ["terms", "privacy", "health-data"] } })).json();
    expect(first.delivery).toBe("on-screen");
    const second = await (await request.post("/api/v1/auth/magic-link", { data: { email, consents: [] } })).json();
    expect(second.delivery).toBe("unavailable");
    expect(second.link).toBeUndefined();
  });

  test("le pagine legali descrivono dati, durate e diritti", async ({ page }) => {
    await page.goto("/privacy-policy");
    await expect(page.getByRole("heading", { name: "I tuoi diritti" })).toBeVisible();
    await expect(page.getByRole("table")).toContainText("Referti, valori confermati");
    await expect(page.getByText("BOZZA — DA REVISIONARE")).toBeVisible();
    await page.goto("/accedi");
    await expect(page.getByRole("checkbox")).toHaveCount(4);
  });
});
