import {
  test,
  expect,
  type APIRequestContext,
  type BrowserContext,
} from "@playwright/test";
import { expectAccessible } from "./_lib/a11y";

/** Salute nel tempo e famiglia (13/11/2026): pagina pubblica, storico di esempio, familiari, promemoria, foglio per la visita. */

async function signup(request: APIRequestContext, email: string) {
  const r = await (
    await request.post("/api/v1/auth/magic-link", {
      data: { email, consents: ["terms", "privacy", "health-data"] },
    })
  ).json();
  expect((await request.get(r.link, { maxRedirects: 0 })).status()).toBe(303);
}

async function family(ctx: BrowserContext, tag: string) {
  await signup(
    ctx.request,
    `fam-${tag}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}@test.invalid`,
  );
  const r = await (
    await ctx.request.post("/api/v1/area/storico-esempio", { data: {} })
  ).json();
  expect(r.ok).toBe(true);
  return r.luciaId as string;
}

test("pagina pubblica: la promessa, pezzi veri di prodotto, il piano come proposta", async ({
  page,
}) => {
  await page.goto("/famiglia");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    /Tutta la salute della tua famiglia/,
  );
  await expect(page.getByTestId("serie").first()).toBeVisible();
  const plan = page.getByTestId("piano-famiglia");
  await expect(plan).toContainText("Proposta, prezzo da confermare");
  await expect(plan).toContainText("39 €");
  await expectAccessible(page);
  await page.goto("/prezzi");
  await expect(page.getByTestId("piano-famiglia")).toContainText("In proposta");
});

test("la home porta a Famiglia", async ({ page }) => {
  await page.goto("/");
  await page
    .locator("#famiglia")
    .getByRole("link", { name: "Scopri Famiglia" })
    .click();
  await expect(page).toHaveURL(/\/famiglia$/);
});

test("nel tempo: dallo storico di esempio ai grafici, alle domande, al foglio per la visita", async ({
  browser,
  isMobile,
}) => {
  const ctx = await browser.newContext(
    isMobile ? { viewport: { width: 390, height: 844 } } : {},
  );
  const luciaId = await family(ctx, "tempo");
  const page = await ctx.newPage();
  await page.goto("/area-personale/nel-tempo");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "I tuoi numeri, nel tempo.",
  );
  // Il titolare ha tre controlli annuali: sette esami in fila.
  await expect(page.getByTestId("serie")).toHaveCount(7, { timeout: 15_000 });
  await page
    .getByTestId("persona-switch")
    .getByRole("button", { name: /Lucia/ })
    .click();
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(
    "I numeri di Lucia (esempio), nel tempo.",
  );
  await expect(page.getByTestId("serie")).toHaveCount(6);
  await expect(page.getByTestId("nel-tempo-sintesi")).toContainText("3 fuori");
  // Le prime schede sono quelle con l'ultimo numero fuori dall'intervallo stampato.
  await expect(page.getByTestId("serie").first()).toContainText(
    "Ultimo numero",
  );
  const q = page.getByTestId("domande-nel-tempo");
  await expect(q.getByRole("checkbox")).toHaveCount(3);
  await expectAccessible(page);
  // La visita di esempio ha già le domande: aggiungerle di nuovo non le duplica.
  await q.getByRole("button", { name: "Aggiungi alla visita" }).click();
  await q.getByRole("link", { name: /foglio per la visita/ }).click();
  await expect(page).toHaveURL(/\/area-personale\/promemoria\/[0-9a-f-]+$/);
  await expect(page.getByTestId("foglio-domande").locator("li")).toHaveCount(3);
  await expect(
    isMobile
      ? page.getByTestId("foglio-numeri-lista").locator("li")
      : page.getByTestId("foglio-numeri").locator("tbody tr"),
  ).toHaveCount(6);
  // Una domanda propria.
  await page
    .getByLabel("Aggiungi una tua domanda")
    .fill("Devo ripetere questi esami? Quando?");
  await page.getByRole("button", { name: "Aggiungi", exact: true }).click();
  await expect(page.getByTestId("foglio-domande").locator("li")).toHaveCount(4);
  await expectAccessible(page);
  // Il calendario.
  const id = page.url().split("/").pop()!;
  const ics = await ctx.request.get(`/api/v1/area/promemoria/${id}/calendario`);
  expect(ics.headers()["content-type"]).toContain("text/calendar");
  expect(await ics.text()).toContain("BEGIN:VEVENT");
  // Un altro account non vede Lucia.
  const other = await browser.newContext();
  await signup(other.request, `fam-altro-${Date.now()}@test.invalid`);
  expect(
    (
      await other.request.get(`/api/v1/area/nel-tempo?persona=${luciaId}`)
    ).status(),
  ).toBe(404);
  expect(
    (await other.request.get(`/api/v1/area/promemoria/${id}`)).status(),
  ).toBe(404);
  await other.close();
  await ctx.close();
});

test("famiglia: aggiungere un familiare chiede la dichiarazione; eliminarlo chiede conferma", async ({
  browser,
  isMobile,
}) => {
  const ctx = await browser.newContext(
    isMobile ? { viewport: { width: 390, height: 844 } } : {},
  );
  await signup(ctx.request, `fam-nuovo-${Date.now()}@test.invalid`);
  const page = await ctx.newPage();
  await page.goto("/area-personale/famiglia");
  await expect(page.getByTestId("famiglia-persona")).toHaveCount(1, {
    timeout: 15_000,
  });
  await page.getByRole("button", { name: "Aggiungi un familiare" }).click();
  const form = page.getByTestId("nuovo-familiare");
  await form.getByLabel("Come lo chiami").fill("Papà");
  await form.getByLabel("Anno di nascita (facoltativo)").fill("1950");
  const submit = form.getByRole("button", { name: "Aggiungi", exact: true });
  await expect(submit).toBeDisabled();
  await form.getByLabel(/Me l'ha chiesto/).check();
  await expect(submit).toBeDisabled();
  await form.getByLabel(/Dichiaro di poter gestire/).check();
  await expectAccessible(page);
  await submit.click();
  await expect(page.getByTestId("famiglia-persona")).toHaveCount(2);
  await expect(page.getByTestId("famiglia-persona").nth(1)).toContainText(
    "Papà",
  );
  // Il nuovo referto si può assegnare a lui.
  await page
    .getByTestId("famiglia-persona")
    .nth(1)
    .getByRole("link", { name: "Aggiungi un referto" })
    .click();
  await expect(page.getByTestId("di-chi").getByLabel("Papà")).toBeChecked();
  await page
    .getByRole("button", { name: /Aggiungi e leggi il documento/ })
    .click();
  await expect(page).toHaveURL(/\/area-personale\/documenti\//, {
    timeout: 15_000,
  });
  const docs = await (await ctx.request.get("/api/v1/area/documents")).json();
  const pers = await (await ctx.request.get("/api/v1/area/famiglia")).json();
  const papa = pers.persone.find((p: { name: string }) => p.name === "Papà");
  expect(docs.documents[0].profileId).toBe(papa.id);
  await page.goto("/area-personale/famiglia");
  await page
    .getByTestId("famiglia-persona")
    .nth(1)
    .getByRole("button", { name: "Elimina" })
    .click();
  await page.getByRole("button", { name: "Sì, elimina tutto" }).click();
  await expect(page.getByTestId("famiglia-persona")).toHaveCount(1);
  expect(
    (await (await ctx.request.get("/api/v1/area/documents")).json()).documents,
  ).toHaveLength(0);
  await ctx.close();
});

test("promemoria: nuovo, fatto, e il cruscotto propone la visita vicina", async ({
  browser,
  isMobile,
}) => {
  const ctx = await browser.newContext(
    isMobile ? { viewport: { width: 390, height: 844 } } : {},
  );
  await family(ctx, "prom");
  const page = await ctx.newPage();
  await page.goto("/area-personale");
  await expect(page.getByTestId("prossimo-passo")).toContainText(
    "Tra 6 giorni",
    { timeout: 15_000 },
  );
  await expect(page.getByTestId("famiglia-cruscotto")).toContainText(
    "Lucia (esempio)",
  );
  await page.goto("/area-personale/promemoria");
  await expect(page.getByTestId("promemoria")).toHaveCount(2, {
    timeout: 15_000,
  });
  await page.getByRole("button", { name: "Nuovo promemoria" }).click();
  const form = page.getByTestId("nuovo-promemoria");
  await form.getByLabel("Esame o controllo da ripetere").check();
  await form.getByLabel("Titolo").fill("Ripetere gli esami del sangue");
  const d = new Date(Date.now() + 30 * 864e5).toISOString().slice(0, 10);
  await form.getByLabel("Quando").fill(d);
  await expectAccessible(page);
  await form.getByRole("button", { name: "Salva il promemoria" }).click();
  await expect(page.getByTestId("promemoria")).toHaveCount(3);
  await page
    .getByTestId("promemoria")
    .filter({ hasText: "Ripetere gli esami del sangue" })
    .getByRole("button", { name: "Fatto" })
    .click();
  await expect(
    page.getByTestId("promemoria-elenco").getByTestId("promemoria"),
  ).toHaveCount(2);
  // Date assurde: rifiutate dal server.
  expect(
    (
      await ctx.request.post("/api/v1/area/promemoria", {
        data: { kind: "altro", title: "x", dueDate: "2099-01-01" },
      })
    ).status(),
  ).toBe(400);
  await ctx.close();
});
