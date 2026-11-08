import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const unique = () => `prova-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@esempio.test`;

test("pagina per le strutture: un H1 e nessuna violazione di accessibilità", async ({ page }) => {
  const res = await page.goto("/per-le-strutture");
  expect(res?.status()).toBe(200);
  await expect(page.locator("h1")).toHaveCount(1);
  const axe = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
  expect(axe.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`)).toEqual([]);
});

test("iscrizione con email e consenso: messaggio di conferma senza email inviata", async ({ page }) => {
  await page.goto("/per-le-strutture");
  await page.getByLabel("Indirizzo email").fill(unique());
  await page.getByLabel("Nome della struttura (facoltativo)").fill("Laboratorio di prova");
  await page.getByRole("checkbox").check();
  await page.getByRole("button", { name: /Iscrivimi/ }).click();
  const ok = page.getByRole("status").filter({ hasText: "Interesse registrato" });
  await expect(ok).toBeVisible();
  await expect(ok).toContainText("non inviamo alcuna email");
  await expect(ok).toContainText("non vincolante");
});

test("senza consenso compare un avviso", async ({ page }) => {
  await page.goto("/servizi/secondo-parere");
  await page.getByLabel("Indirizzo email").fill(unique());
  await page.getByRole("button", { name: /Iscrivimi/ }).click();
  await expect(page.getByRole("alert").filter({ hasText: "informativa privacy" })).toBeVisible();
});

test.describe("API /api/v1/waitlist", () => {
  test("rifiuta email non valida", async ({ request }) => {
    const res = await request.post("/api/v1/waitlist", { data: { email: "non-una-email", interest: "completo", consent: true } });
    expect(res.status()).toBe(400);
  });

  test("rifiuta campi extra", async ({ request }) => {
    const res = await request.post("/api/v1/waitlist", { data: { email: unique(), interest: "completo", consent: true, extra: "x" } });
    expect(res.status()).toBe(400);
  });

  test("rifiuta consenso mancante", async ({ request }) => {
    const res = await request.post("/api/v1/waitlist", { data: { email: unique(), interest: "completo" } });
    expect(res.status()).toBe(400);
  });

  test("seconda iscrizione identica: 200 con already", async ({ request }) => {
    const data = { email: unique(), interest: "secondo-parere", consent: true };
    const first = await request.post("/api/v1/waitlist", { data });
    expect(first.status()).toBe(200);
    expect(await first.json()).toMatchObject({ ok: true });
    const second = await request.post("/api/v1/waitlist", { data });
    expect(second.status()).toBe(200);
    expect(await second.json()).toMatchObject({ ok: true, already: true });
  });
});
