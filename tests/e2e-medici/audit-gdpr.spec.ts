import { test, expect, type APIRequestContext } from "@playwright/test";

async function signup(request: APIRequestContext, email: string) {
  const r = await request.post("/api/v1/auth/magic-link", { data: { email, consents: ["terms", "privacy", "health-data", "subject-declaration"] } });
  expect(r.status()).toBe(200);
  const body = await r.json();
  expect((await request.get(body.link, { maxRedirects: 0 })).headers().location).toContain("/area-personale");
}

/** Con i medici accesi: il consenso alla condivisione con il medico. Il resto dell'audit GDPR sta in tests/e2e. */
test.describe("audit GDPR con i medici accesi", () => {
  test("il secondo parere richiede il consenso alla condivisione e una domanda breve", async ({ browser }) => {
    const ctx = await browser.newContext();
    await signup(ctx.request, `parere-${Date.now()}@test.invalid`);
    const base = { documentId: "00000000-0000-0000-0000-000000000000", specialty: "Medicina interna (simulazione)", question: "Una domanda abbastanza lunga da passare la validazione minima.", acknowledgeSimulation: true };
    expect((await ctx.request.post("/api/v1/area/casi", { data: { ...base, consentToShare: false } })).status()).toBe(400);
    expect((await ctx.request.post("/api/v1/area/casi", { data: { ...base, consentToShare: true, question: "x".repeat(501) } })).status()).toBe(400);
    await ctx.close();
  });

});
