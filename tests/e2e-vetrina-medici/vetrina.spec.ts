import { test, expect, type BrowserContext } from "@playwright/test";
import { totpCode } from "../../src/lib/auth/totp";

/**
 * Ciclo 2, con i medici accesi in vetrina: le pagine dei servizi con un medico portano alla lista d'attesa del loro
 * servizio, mai a una registrazione, e la misura per sorgente conta anche loro. Le prove senza medici sono in tests/e2e-vetrina.
 */

for (const s of [
  { path: "/servizi/parla-con-un-medico", interest: "Parla", tryHref: "/richiedi/videoconsulto" },
  { path: "/servizi/secondo-parere", interest: "Secondo parere", tryHref: "/richiedi/secondo-parere" },
]) {
  test(`${s.path}: l'azione principale porta alla lista d'attesa, non a una registrazione`, async ({ page }) => {
    await page.goto(s.path);
    const hero = page.locator("#servizio-titolo").locator("xpath=ancestor::section[1]");
    const cta = hero.getByRole("link", { name: /Avvisami quando parte/ });
    await expect(cta).toBeVisible();
    await expect(cta).toHaveAttribute("href", `${s.path}#avvisami`);
    await expect(hero.getByRole("link", { name: /Provalo/ })).toHaveAttribute("href", s.tryHref);
    await cta.click();
    const form = page.locator("#avvisami");
    await expect(form.getByLabel(/email/i).first()).toBeInViewport();
    await form.getByLabel(/email/i).first().fill(`vetrina-${Date.now()}-${Math.random().toString(36).slice(2, 6)}@esempio.test`);
    await form.getByRole("checkbox").first().check();
    await form.getByRole("button", { name: /Iscrivimi/ }).click();
    await expect(form.getByText("Interesse registrato.")).toBeVisible();
  });
}

/** Admin dimostrativo con 2FA (come in tests/e2e/admin.spec.ts). */
async function loginAdmin(ctx: BrowserContext) {
  const r = await (await ctx.request.post("/api/v1/auth/demo-ruolo", { data: { role: "admin" } })).json();
  expect(r.ok).toBe(true);
  if (!r.mfaEnabled) {
    const s = await (await ctx.request.post("/api/v1/auth/mfa/setup", { data: {} })).json();
    expect((await ctx.request.post("/api/v1/auth/mfa/conferma", { data: { code: totpCode(s.secret) } })).status()).toBe(200);
  } else {
    const s = await (await ctx.request.get("/api/v1/auth/mfa/verifica")).json();
    expect((await ctx.request.post("/api/v1/auth/mfa/verifica", { data: { code: totpCode(s.secret) } })).status()).toBe(200);
  }
}

test("fase 2: una visita da Facebook che chiede «Avvisami» compare in Admin, senza cookie", async ({ browser }, info) => {
  test.skip(info.project.name !== "desktop", "la 2FA dell'admin dimostrativo usa codici monouso: una sola esecuzione");
  const visitor = await browser.newContext();
  const page = await visitor.newPage();
  const beacons: Promise<unknown>[] = [];
  page.on("request", (r) => {
    if (r.url().endsWith("/api/v1/public/evento")) beacons.push(r.response());
  });
  await page.goto("/servizi/parla-con-un-medico?utm_source=facebook");
  await page.getByRole("link", { name: /Avvisami quando parte/ }).first().click();
  const form = page.locator("#avvisami");
  await form.getByLabel(/email/i).first().fill(`fb-${Date.now()}@esempio.test`);
  await form.getByRole("checkbox").first().check();
  await form.getByRole("button", { name: /Iscrivimi/ }).click();
  await expect(form.getByText("Interesse registrato.")).toBeVisible();
  await expect.poll(() => beacons.length).toBeGreaterThanOrEqual(2);
  await Promise.all(beacons);
  // Nessun cookie impostato per la misura (la vetrina non usa cookie se non per l'accesso).
  expect(await visitor.cookies()).toEqual([]);
  await visitor.close();

  const admin = await browser.newContext();
  await loginAdmin(admin);
  const data = await (await admin.request.get("/api/v1/admin/panoramica")).json();
  const fb = data.vetrina.bySource.find((r: { source: string }) => r.source === "facebook");
  expect(fb?.visits).toBeGreaterThanOrEqual(1);
  expect(fb?.signups).toBeGreaterThanOrEqual(1);
  expect(data.vetrina.byService.find((r: { service: string }) => r.service === "parla-con-un-medico").signups).toBeGreaterThanOrEqual(1);
  expect(data.vetrina.weeks).toHaveLength(8);
  expect(data.funnel.steps["visita-medico"]).toBeGreaterThanOrEqual(1);
  expect(data.funnel.steps["avvisami-medico"]).toBeGreaterThanOrEqual(1);
  const ap = await admin.newPage();
  await ap.goto("/admin");
  await expect(ap.getByTestId("admin-vetrina")).toBeVisible({ timeout: 15_000 });
  await expect(ap.getByRole("region", { name: "Vetrina per sorgente" }).getByText("Facebook")).toBeVisible();
  await admin.close();
});
