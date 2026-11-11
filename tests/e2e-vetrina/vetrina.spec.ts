import { test, expect } from "@playwright/test";

/**
 * Ciclo 2, fase 1: la vetrina va online prima della conformità.
 * Nessun account personale, nessun consenso sanitario raccolto, le azioni principali portano alla lista d'attesa.
 */

test("nessuno crea un account con un'email vera, nemmeno quella di un altro", async ({ request }) => {
  const r = await request.post("/api/v1/auth/magic-link", { data: { email: "mario.rossi@gmail.com", consents: ["terms", "privacy", "health-data", "subject-declaration"] } });
  expect(r.status()).toBe(403);
  const body = await r.json();
  expect(body.error).toBe("signup-closed");
  expect(body.link).toBeUndefined();
});

test("la pagina di accesso offre solo l'account demo e la lista d'attesa, senza consensi sanitari", async ({ page }) => {
  await page.goto("/accedi");
  await expect(page.getByRole("button", { name: "Entra con l'account demo" })).toBeVisible();
  await expect(page.getByTestId("vetrina-accesso")).toBeVisible();
  await expect(page.getByRole("button", { name: "Inviami il link" })).toHaveCount(0);
  await expect(page.getByText(/dati relativi alla salute/)).toHaveCount(0);
});

test("l'account demo ha davvero un referto inventato già caricato", async ({ page }) => {
  await page.goto("/accedi");
  await page.getByRole("button", { name: "Entra con l'account demo" }).click();
  await expect(page).toHaveURL(/\/area-personale$/);
  await expect(page.getByText("Nessun referto, per ora.")).toHaveCount(0, { timeout: 15_000 });
  await expect(page.getByText(/Referto di laboratorio/).first()).toBeVisible({ timeout: 15_000 });
});

for (const s of [
  { path: "/referti", interest: "Capisci", tryHref: "/referti/esempio" },
  { path: "/servizi/parla-con-un-medico", interest: "Parla", tryHref: "/accedi?next=/area-personale/appuntamenti" },
  { path: "/servizi/secondo-parere", interest: "Secondo parere", tryHref: "/accedi?next=/area-personale/secondo-parere" },
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

test("prezzi e «Ti aiutiamo a scegliere» non portano all'area personale", async ({ page }) => {
  for (const path of ["/prezzi", "/inizia"]) {
    await page.goto(path);
    const hrefs = await page.locator("main a[href]").evaluateAll((as) => as.map((a) => a.getAttribute("href") ?? ""));
    expect(hrefs.filter((h) => h.startsWith("/area-personale")), path).toEqual([]);
  }
});

test("nessun caricamento reale né pagamento reale", async ({ request }) => {
  const cfg = await (await request.get("/api/v1/public/config")).json();
  expect(cfg.profile).toBe("vetrina");
  expect(Object.values(cfg.capabilities).every((v) => v === false)).toBe(true);
});
