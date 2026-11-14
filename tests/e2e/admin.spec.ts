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
async function loginRole(ctx: BrowserContext, role: "admin") {
  const r = await (await ctx.request.post("/api/v1/auth/demo-ruolo", { data: { role } })).json();
  expect(r.ok).toBe(true);
  // Prima della 2FA le API riservate rispondono 403 mfa-required
  const blocked = await ctx.request.get("/api/v1/admin/panoramica");
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

/**
 * 14/11/2026: il sito parte senza medici (src/lib/medici.ts). L'amministrazione resta raggiungibile, anche la pagina
 * dei medici: serve a prepararli prima di riaccendere i servizi. Le prove con il medico stanno in tests/e2e-medici.
 */
test.describe("amministrazione e protezioni", () => {
  test("admin: 2FA obbligatoria, panoramica, lista d'attesa con CSV, pagina dei medici, registro; non-admin 403", async ({ browser }) => {
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
    await expect(page.getByRole("heading", { name: "Medici", level: 1 })).toBeVisible({ timeout: 15_000 });
    // Senza medici dimostrativi l'elenco è vuoto e lo dice; se ce ne sono, c'è la tabella.
    await expect(page.getByRole("table", { name: "Medici" }).or(page.getByText("Nessun elemento, per ora.")).first()).toBeVisible({ timeout: 15_000 });
    await page.getByRole("link", { name: "Registro" }).click();
    await expect(page.getByRole("table", { name: "Registro" })).toBeVisible({ timeout: 15_000 });
    await expect(page.getByText("overview-viewed").first()).toBeVisible();
    await page.getByRole("link", { name: "Configurazione" }).click();
    await expect(page.getByText("simulato")).toBeVisible({ timeout: 15_000 });
    // Una persona qualunque non è admin, e senza medici l'accesso dimostrativo da medico non esiste.
    const other = await browser.newContext();
    await signup(other.request, `non-admin-${Date.now()}@test.invalid`);
    expect((await other.request.get("/api/v1/admin/panoramica")).status()).toBe(403);
    expect((await other.request.get("/api/v1/admin/registro")).status()).toBe(403);
    expect((await other.request.post("/api/v1/auth/demo-ruolo", { data: { role: "physician" } })).status()).toBe(404);
    await ctx.close();
    await other.close();
  });

  test("report diretto senza ordine pagato: 402", async ({ browser }) => {
    const ctx = await browser.newContext();
    await signup(ctx.request, `nopay-${Date.now()}@test.invalid`);
    const id = await verifiedDocument(ctx.request);
    expect((await ctx.request.post(`/api/v1/area/documents/${id}/reports`, { data: { service: "essenziale" } })).status()).toBe(402);
    await ctx.close();
  });
});
