import { test, expect, type BrowserContext } from "@playwright/test";
import { expectAccessible } from "./_lib/a11y";

/** Diari della salute (21/11/2026): pagine pubbliche, PDF da stampare, inserimento rapido, riepilogo, foglio per il medico. */

async function entra(ctx: BrowserContext, tag: string) {
  const email = `diari-${tag}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}@test.invalid`;
  const r = await (await ctx.request.post("/api/v1/auth/magic-link", { data: { email, consents: ["terms", "privacy", "health-data"] } })).json();
  expect((await ctx.request.get(r.link, { maxRedirects: 0 })).status()).toBe(303);
}

const senzaScorrimentoLaterale = async (page: import("@playwright/test").Page) =>
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0);

test("pagine pubbliche: sei diari, cinque passi, il posto del video, le fonti", async ({ page }) => {
  await page.goto("/diari");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Misura bene a casa");
  for (const s of ["pressione", "glicemia", "cefalea", "sonno", "peso", "respiro"]) await expect(page.getByTestId(`diario-${s}`)).toBeVisible();
  await page.getByTestId("diario-pressione").click();
  await expect(page).toHaveURL(/\/diari\/pressione$/);
  await expect(page.locator(".dr-passo")).toHaveCount(5);
  await expect(page.getByText("Il video di 90 secondi arriverà")).toBeVisible();
  await expect(page.getByRole("link", { name: /ESH practice guidelines/ })).toBeVisible();
  await expect(page.locator("[data-bozza=medico]")).toBeVisible();
  await senzaScorrimentoLaterale(page);
  await expectAccessible(page);
});

test("il diario da stampare si scarica in PDF, senza account", async ({ page }) => {
  await page.goto("/diari/cefalea");
  const dl = page.waitForEvent("download");
  await page.getByTestId("scarica-diario").click();
  expect((await dl).suggestedFilename()).toBe("diario-cefalea-cura-privata.pdf");
});

test("«Compilalo dal telefono» senza account porta all'accesso e poi al diario", async ({ page }) => {
  await page.goto("/diari/glicemia");
  await page.getByTestId("compila-online").first().click();
  await expect(page).toHaveURL(/\/accedi\?next=%2Farea-personale%2Fdiari%2Fglicemia|\/accedi\?next=\/area-personale\/diari\/glicemia/);
});

test("pressione: due misure in pochi tocchi, medie e foglio per il medico", async ({ page, context }) => {
  await entra(context, "p");
  await page.goto("/area-personale/diari/pressione");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Pressione");
  await page.getByTestId("sys").fill("132");
  // Tre cifre nella massima: il cursore passa da solo alla minima.
  await expect(page.getByTestId("dia")).toBeFocused();
  await page.keyboard.type("84");
  await page.getByTestId("salva-voce").click();
  await expect(page.getByTestId("voce-salvata")).toContainText("132/84");
  await page.getByTestId("sys").fill("128");
  await page.getByTestId("dia").fill("80");
  await page.getByTestId("bpm").fill("70");
  await page.getByTestId("salva-voce").click();
  await expect(page.getByTestId("voci-elenco").locator("li")).toHaveCount(2);
  await expect(page.getByTestId("riepilogo")).toContainText("130/82");
  // Un errore di battitura viene fermato con un messaggio chiaro.
  await page.getByTestId("sys").fill("80");
  await page.getByTestId("dia").fill("120");
  await page.getByTestId("salva-voce").click();
  await expect(page.getByTestId("nuova-voce").getByRole("alert")).toContainText("invertite");
  const dl = page.waitForEvent("download");
  await page.getByTestId("foglio-medico").click();
  expect((await dl).suggestedFilename()).toMatch(/^foglio-per-il-medico-pressione-\d{4}-\d{2}-\d{2}\.pdf$/);
  await page.getByTestId("promemoria-diario").click();
  const ics = page.waitForEvent("download");
  await page.getByTestId("aggiungi-calendario").click();
  expect((await ics).suggestedFilename()).toBe("promemoria-diario-pressione.ics");
  await senzaScorrimentoLaterale(page);
  await expectAccessible(page);
});

test("mal di testa: «oggi niente» con un tocco, poi un episodio", async ({ page, context }) => {
  await entra(context, "c");
  await page.goto("/area-personale/diari/cefalea");
  await page.getByTestId("oggi-niente").click();
  await expect(page.getByTestId("voce-salvata")).toContainText("oggi niente");
  await expect(page.getByTestId("oggi-niente")).toBeDisabled();
  await page.getByTestId("ho-mal-di-testa").click();
  await page.getByTestId("int-media").click();
  await page.getByTestId("salva-voce").click();
  await expect(page.getByTestId("riepilogo")).toContainText("Giorni con mal di testa");
  await expect(page.getByTestId("voci-elenco").locator("li")).toHaveCount(2);
});

test("account demo: l'esempio riempie i tre diari, le schede mostrano le medie", async ({ page, context }) => {
  await entra(context, "e");
  const r = await (await context.request.post("/api/v1/area/diari/esempio", { data: {} })).json();
  expect(r.added).toBeGreaterThan(40);
  await page.goto("/area-personale/diari");
  await expect(page.getByTestId("card-pressione")).toContainText("/");
  await expect(page.getByTestId("card-cefalea")).toContainText("Giorni con mal di testa");
  await senzaScorrimentoLaterale(page);
});

test("sonno, peso e respiro: una voce ciascuno, in pochi tocchi", async ({ page, context }) => {
  await entra(context, "n");
  await page.goto("/area-personale/diari/sonno");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText("Sonno");
  // Prima che la pagina sia pronta un campo riempito può tornare al valore iniziale: si aspetta il riepilogo.
  await expect(page.getByTestId("riepilogo")).toBeVisible();
  await page.getByTestId("a-letto").fill("23:30");
  await page.getByTestId("in-piedi").fill("07:00");
  await page.getByTestId("addormentarsi").fill("20");
  await page.getByRole("group", { name: "Risvegli" }).getByRole("button", { name: "2" }).click();
  await page.getByTestId("salva-voce").click();
  await expect(page.getByTestId("nuova-voce").getByRole("alert")).toContainText("com'è andata");
  await page.getByTestId("q-bene").click();
  await page.getByTestId("salva-voce").click();
  await expect(page.getByTestId("voce-salvata")).toContainText("7 h 30 min");
  await expect(page.getByTestId("riepilogo")).toContainText("7 h 30 min");

  await page.goto("/area-personale/diari/peso");
  await expect(page.getByTestId("riepilogo")).toBeVisible();
  await page.getByTestId("kg").fill("72,4");
  await page.getByTestId("salva-voce").click();
  await expect(page.getByTestId("voce-salvata")).toContainText("72,4 kg");

  await page.goto("/area-personale/diari/respiro");
  await expect(page.getByTestId("riepilogo")).toBeVisible();
  await page.getByTestId("pef").fill("420");
  await page.getByTestId("spray").fill("1");
  await page.getByTestId("salva-voce").click();
  await expect(page.getByTestId("voce-salvata")).toContainText("420 L/min");
  await expect(page.getByTestId("riepilogo")).toContainText("Spray al bisogno");
  const dl = page.waitForEvent("download");
  await page.getByTestId("foglio-medico").click();
  expect((await dl).suggestedFilename()).toMatch(/^foglio-per-il-medico-respiro-/);
  await senzaScorrimentoLaterale(page);
  await expectAccessible(page);

  // La pagina personale mostra i sei diari, con l'ultima voce.
  await page.goto("/area-personale");
  const cr = page.getByTestId("diari-cruscotto");
  await expect(cr.getByRole("link", { name: /Sonno/ })).toContainText("Ultima voce: oggi");
  await expect(cr.getByRole("link", { name: /Glicemia/ })).toContainText("Comincia");
});
