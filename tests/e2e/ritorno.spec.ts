import { test, expect } from "@playwright/test";

/** Ciclo 3, fase 2: dopo l'accesso si arriva dove si voleva andare, non alla pagina iniziale dell'area. */

for (const s of [
  { from: "/servizi/parla-con-un-medico", cta: "Prenota il videoconsulto", to: "/area-personale/appuntamenti", h1: "I miei appuntamenti" },
  { from: "/servizi/secondo-parere", cta: "Richiedi un secondo parere", to: "/area-personale/secondo-parere", h1: "I miei pareri" },
]) {
  test(`${s.cta}: login con l'account demo e ritorno a ${s.to}`, async ({ page }) => {
    await page.goto(s.from);
    await page.getByRole("link", { name: s.cta }).first().click();
    await expect(page).toHaveURL(new RegExp(`/accedi\\?next=${encodeURIComponent(s.to).replace(/%/g, "%")}`));
    await page.getByRole("button", { name: "Entra con l'account demo" }).click();
    await expect(page).toHaveURL(new RegExp(`${s.to}$`), { timeout: 15_000 });
    await expect(page.getByRole("heading", { level: 1, name: s.h1 })).toBeVisible();
  });
}

test("il link di accesso via email riporta alla pagina richiesta", async ({ request, page }) => {
  const r = await (await request.post("/api/v1/auth/magic-link", { data: { email: `ritorno-${Date.now()}@esempio.test`, consents: ["terms", "privacy", "health-data", "subject-declaration"], next: "/area-personale/appuntamenti" } })).json();
  expect(r.link).toContain("next=%2Farea-personale%2Fappuntamenti");
  await page.goto(r.link);
  await expect(page).toHaveURL(/\/area-personale\/appuntamenti$/);
});

test("un next esterno non porta fuori dal sito", async ({ request, page }) => {
  const bad = await request.post("/api/v1/auth/magic-link", { data: { email: `esterno-${Date.now()}@esempio.test`, consents: ["terms", "privacy", "health-data", "subject-declaration"], next: "https://evil.example/area-personale" } });
  const r = await bad.json();
  expect(r.link).not.toContain("next=");
  await page.goto("/accedi?next=//evil.example");
  await page.getByRole("button", { name: "Entra con l'account demo" }).click();
  await expect(page).toHaveURL(/localhost:\d+\/area-personale$/, { timeout: 15_000 });
});

test("area personale su telefono: prima il prossimo passo, poi il riepilogo in una riga", async ({ page }, info) => {
  test.skip(info.project.name !== "mobile", "controllo dell'impaginazione su telefono");
  await page.goto("/accedi");
  await page.getByRole("button", { name: "Entra con l'account demo" }).click();
  await expect(page).toHaveURL(/\/area-personale$/, { timeout: 15_000 });
  const next = page.getByTestId("prossimo-passo");
  await expect(next).toBeVisible({ timeout: 15_000 });
  const nextBox = (await next.boundingBox())!;
  const sumBox = (await page.getByTestId("riepilogo").boundingBox())!;
  expect(nextBox.y).toBeLessThan(sumBox.y);
  // Il prossimo passo si vede nella prima schermata e il riepilogo non occupa più di due righe.
  expect(nextBox.y).toBeLessThan(844);
  expect(sumBox.height).toBeLessThan(110);
});
