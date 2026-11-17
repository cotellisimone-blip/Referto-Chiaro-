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

test("gli indirizzi dei servizi con un medico portano alla sezione Medici, «In arrivo»: niente prezzi, solo la lista d'attesa", async ({ request, page }) => {
  for (const p of [...DOCTOR_PATHS, "/richiedi/domicilio", "/medico/casi", "/prova/paziente"]) {
    const res = await request.get(p, { maxRedirects: 0 });
    expect(res.status(), p).toBe(307);
    expect(res.headers()["location"], p).toBe("/medici");
  }
  await page.goto("/servizi/secondo-parere");
  // 17/11/2026 (punto 1): la vecchia pagina «Presto anche con un medico» è confluita nella sezione Medici.
  await expect(page).toHaveURL(/\/medici$/);
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(/Un medico,\s*quando serve\./);
  const main = page.locator("main");
  for (const name of ["Visita a casa", "Videoconsulto", "Secondo parere", "Non è ancora attivo"]) await expect(main).toContainText(name);
  await expect(main).not.toContainText("€");
  await expect(main.getByLabel("Indirizzo email")).toBeVisible();
  // Senza consenso non si iscrive; con il consenso l'interesse è registrato, la conferma è in vista e riceve il focus (punto 17).
  await main.getByLabel("Indirizzo email").fill(`medico-${Date.now()}@esempio.test`);
  await main.getByRole("button", { name: /Avvisami per la mia zona/ }).click();
  await expect(main.getByRole("alert").filter({ hasText: "informativa privacy" })).toBeVisible();
  await main.getByLabel(/CAP/).fill("25122");
  await main.getByRole("checkbox").check();
  await main.getByRole("button", { name: /Avvisami per la mia zona/ }).click();
  const fatto = main.getByTestId("waitlist-done");
  await expect(fatto).toBeVisible();
  await expect(fatto).toBeInViewport();
  await expect(fatto).toBeFocused();
});

test("un'offerta sola: in Prezzi c'è «Capisci il tuo referto», i servizi con un medico solo come «presto»", async ({ page }) => {
  // 17/11/2026 (punto 1): senza medici «Servizi» non è una pagina a sé, porta alla home con le tre sezioni.
  const res = await page.request.get("/servizi", { maxRedirects: 0 });
  expect(res.status()).toBe(307);
  expect(res.headers()["location"]).toBe("/");
  await page.goto("/prezzi");
  const keys = await page.locator("main [data-servizio]").evaluateAll((els) => els.map((e) => e.getAttribute("data-servizio")));
  expect(keys).toEqual(["capisci"]);
  await expect(page.locator("main").getByRole("link", { name: /Avvisami quando parte/ })).toHaveAttribute("href", "/medici");
  await expect(page.locator("main .presto-medico")).toContainText("In arrivo");
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
