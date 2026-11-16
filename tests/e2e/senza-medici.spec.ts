import { test, expect, type APIRequestContext } from "@playwright/test";
import { DOCTOR_API, DOCTOR_PATHS, isDoctorPath } from "../../src/lib/medici";
import { PAGINE_LANCIO } from "./_lib/pagine";

/**
 * 14/11/2026: Cura Privata parte senza medici (decisione del titolare del 13/11). Un solo interruttore, ENABLE_MEDICI
 * (src/lib/medici.ts), tiene spenti visita a domicilio, videoconsulto, secondo parere e portale medico.
 * Queste prove dicono che cosa il pubblico NON deve trovare finché è spento: né pagine, né prezzi, né acquisti, né API.
 * Con l'interruttore acceso valgono le prove in tests/e2e-medici.
 */

async function signup(request: APIRequestContext, email: string) {
  const r = await (await request.post("/api/v1/auth/magic-link", { data: { email, consents: ["terms", "privacy", "health-data"] } })).json();
  expect((await request.get(r.link, { maxRedirects: 0 })).status()).toBe(303);
}

const ALTRE = ["/guide/tsh", "/guide/risonanza-magnetica", "/glossario/ematocrito", "/punto-di-partenza", "/accedi"];

test("nessuna pagina pubblica porta ai servizi con un medico, ne mostra i prezzi o li fa comprare", async ({ page }) => {
  test.setTimeout(90_000);
  for (const path of [...PAGINE_LANCIO, ...ALTRE]) {
    await page.goto(path);
    const hrefs = await page.$$eval("a[href^='/']", (as) => as.map((a) => a.getAttribute("href")!.split(/[?#]/)[0]));
    expect(hrefs.filter((h) => isDoctorPath(h)), `${path}: link ai servizi con un medico`).toEqual([]);
    const text = (await page.locator("body").innerText()).replace(/\s+/g, " ");
    for (const price of ["149 €", "69 €"]) expect(text, `${path}: ${price}`).not.toContain(price);
    const actions = (await page.locator("main a, main button").allInnerTexts()).join(" | ");
    for (const cta of [/Prenota il videoconsulto/i, /Richiedi (la visita|il secondo parere|un secondo parere)/i, /Parla con un medico/i]) expect(actions, `${path}: ${cta}`).not.toMatch(cta);
  }
});

test("gli indirizzi dei servizi con un medico portano a «Presto anche con un medico»: niente prezzi, solo la lista d'attesa", async ({ request, page }) => {
  for (const p of [...DOCTOR_PATHS, "/richiedi/domicilio", "/medico/casi", "/prova/paziente"]) {
    const res = await request.get(p, { maxRedirects: 0 });
    expect(res.status(), p).toBe(307);
    expect(res.headers()["location"], p).toBe("/con-un-medico");
  }
  await page.goto("/servizi/secondo-parere");
  await expect(page).toHaveURL(/\/con-un-medico$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Presto anche con un medico.");
  const main = page.locator("main");
  for (const name of ["Visita a domicilio", "Videoconsulto", "Secondo parere"]) await expect(main).toContainText(name);
  await expect(main).not.toContainText("€");
  await expect(main.getByLabel("Indirizzo email")).toBeVisible();
  // Senza consenso non si iscrive; con il consenso l'interesse è registrato e non parte nessuna email.
  await main.getByLabel("Indirizzo email").fill(`medico-${Date.now()}@esempio.test`);
  await main.getByRole("button", { name: /Iscrivimi/ }).click();
  await expect(main.getByRole("alert").filter({ hasText: "informativa privacy" })).toBeVisible();
  await main.getByRole("checkbox").check();
  await main.getByRole("button", { name: /Iscrivimi/ }).click();
  await expect(main.getByRole("status").filter({ hasText: "Interesse registrato" })).toBeVisible();
});

test("un'offerta sola: in Servizi e in Prezzi c'è «Capisci il tuo referto», i servizi con un medico solo come «presto»", async ({ page }) => {
  for (const path of ["/servizi", "/prezzi"]) {
    await page.goto(path);
    const keys = await page.locator("main [data-servizio]").evaluateAll((els) => els.map((e) => e.getAttribute("data-servizio")));
    expect(keys, path).toEqual(["capisci"]);
  }
  await page.goto("/servizi");
  await expect(page.locator("main").getByRole("link", { name: /Avvisami quando parte/ })).toHaveAttribute("href", "/con-un-medico");
});

test("le API dei servizi con un medico rispondono 404, anche a chi ha fatto l'accesso", async ({ browser, request }) => {
  for (const p of DOCTOR_API) expect((await request.get(p)).status(), p).toBe(404);
  const ctx = await browser.newContext();
  await signup(ctx.request, `senza-medici-${Date.now()}@test.invalid`);
  const caso = { documentId: "00000000-0000-0000-0000-000000000000", specialty: "Medicina interna (simulazione)", question: "Una domanda abbastanza lunga da passare la validazione minima.", acknowledgeSimulation: true, consentToShare: true };
  expect((await ctx.request.post("/api/v1/area/casi", { data: caso })).status()).toBe(404);
  expect((await ctx.request.get("/api/v1/area/appuntamenti")).status()).toBe(404);
  expect((await ctx.request.get("/api/v1/medico/casi")).status()).toBe(404);
  // Niente accesso dimostrativo da medico, e il preventivo non dà i prezzi dei servizi con un medico.
  expect((await ctx.request.post("/api/v1/auth/demo-ruolo", { data: { role: "physician" } })).status()).toBe(404);
  const quote = await (await ctx.request.get("/api/v1/area/orders/preventivo")).json();
  expect(quote.amount).toMatch(/€/);
  expect(quote.medico).toBeNull();
  expect(quote.parere).toBeNull();
  await ctx.close();
});

test("la ricerca del sito e la mappa non contengono le pagine dei servizi con un medico", async ({ request }) => {
  const index = (await (await request.get("/api/v1/public/ricerca")).json()) as { items: { href: string }[] };
  expect(index.items.filter((i) => isDoctorPath(i.href.split(/[?#]/)[0])).map((i) => i.href)).toEqual([]);
  const sitemap = await (await request.get("/sitemap.xml")).text();
  for (const p of DOCTOR_PATHS) expect(sitemap, p).not.toContain(`${p}<`);
});
