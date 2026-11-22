import { test, expect, type BrowserContext } from "@playwright/test";
import { expectAccessible } from "./_lib/a11y";

/**
 * Sezione sonno (22/11/2026): porte per problema, pagine tecniche, autovalutazioni scritte da noi, percorso di due
 * settimane fino al foglio per il medico con efficienza e autovalutazioni.
 */

async function entra(ctx: BrowserContext, tag: string) {
  const email = `sonno-${tag}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}@test.invalid`;
  const r = await (await ctx.request.post("/api/v1/auth/magic-link", { data: { email, consents: ["terms", "privacy", "health-data"] } })).json();
  expect((await ctx.request.get(r.link, { maxRedirects: 0 })).status()).toBe(303);
}

const senzaScorrimentoLaterale = async (page: import("@playwright/test").Page) =>
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0);

const TUTTE = [
  "non-mi-addormento",
  "mi-sveglio-di-notte",
  "russo-e-sono-stanco",
  "lavoro-a-turni",
  "gambe-senza-riposo",
  "percorso-due-settimane",
  "come-funziona-il-sonno",
  "terapia-cognitivo-comportamentale",
  "farmaci-e-melatonina",
  "apnee-notturne",
  "esame-del-sonno",
  "quando-andare-dal-medico",
  "autovalutazione-insonnia",
  "autovalutazione-sonnolenza",
  "autovalutazione-apnee",
  "autovalutazione-gambe",
];

test("la pagina dell'insonnia apre la sezione: cinque porte, il percorso, le pagine per capire", async ({ page }) => {
  await page.goto("/prenditi-cura-di-te/sonno");
  await expect(page.locator("#sonno-porte .sn-porta")).toHaveCount(5);
  await expect(page.getByTestId("porta-percorso")).toBeVisible();
  await senzaScorrimentoLaterale(page);
  await expectAccessible(page);
  await page.getByTestId("porta-russo-e-sono-stanco").click();
  await expect(page).toHaveURL(/\/prenditi-cura-di-te\/sonno\/russo-e-sono-stanco$/);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Russo e sono stanco");
});

test("tutte le sedici pagine si aprono, in bozza, senza scorrimento laterale; le altre aree non hanno figlie", async ({ page }) => {
  for (const s of TUTTE) {
    const r = await page.goto(`/prenditi-cura-di-te/sonno/${s}`);
    expect(r?.status(), s).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    await expect(page.locator('[data-bozza="medico"]')).toBeVisible();
    await senzaScorrimentoLaterale(page);
  }
  // Con lo streaming la pagina figlia sbagliata può rispondere 200: conta che mostri «non esiste» e resti fuori da Google.
  for (const u of ["/malattie/diabete/esame-del-sonno", "/prenditi-cura-di-te/sonno/non-esiste", "/malattie/non-esiste"]) {
    await page.goto(u);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Questa pagina non esiste.");
    expect(await page.locator('meta[name="robots"]').first().getAttribute("content")).toContain("noindex");
  }
});

test("pagina tecnica: disegni, tabella del referto, 112, accessibile", async ({ page }) => {
  await page.goto("/prenditi-cura-di-te/sonno/come-funziona-il-sonno");
  await expect(page.locator('[data-disegno="ipnogramma"] svg')).toBeVisible();
  await expect(page.locator('[data-disegno="due-processi"] svg')).toBeVisible();
  await expectAccessible(page);
  await page.goto("/prenditi-cura-di-te/sonno/esame-del-sonno");
  await expect(page.locator("#referto table")).toContainText("ODI");
  await expect(page.locator('#referto a[href="/lettura-referti"]')).toBeVisible();
  await expectAccessible(page);
  await page.goto("/prenditi-cura-di-te/sonno/quando-andare-dal-medico");
  await expect(page.locator('a[href="tel:112"]').first()).toBeVisible();
});

test("autovalutazione: manca una risposta, poi il risultato, l'avviso della guida e il salvataggio sul dispositivo", async ({ page }) => {
  await page.goto("/prenditi-cura-di-te/sonno/autovalutazione-sonnolenza");
  await expect(page.getByText("Domande scritte da noi")).toBeVisible();
  await page.getByTestId("vedi-risultato").click();
  await expect(page.getByText("Manca questa risposta.")).toBeVisible();
  for (const id of ["riunione", "attesa", "film"]) await page.locator(`#sn-q-${id}`).getByText("Spesso").click();
  for (const id of ["telefono", "pranzo", "lavoro"]) await page.locator(`#sn-q-${id}`).getByText("Qualche volta").click();
  await page.locator("#sn-q-guida").getByText("Sì", { exact: true }).click();
  await page.getByTestId("vedi-risultato").click();
  await expect(page.getByTestId("esito")).toContainText("Molta sonnolenza di giorno");
  await expect(page.getByTestId("esito")).toContainText("9 su 12");
  await expect(page.getByTestId("esito").getByRole("alert")).toContainText("Colpi di sonno alla guida");
  await page.getByTestId("salva-esito").click();
  await expect(page.getByTestId("salva-esito")).toHaveText("Aggiunto al foglio per il medico");
  const salvati = await page.evaluate(() => JSON.parse(localStorage.getItem("cp-sonno-autovalutazioni") ?? "{}"));
  expect(Object.keys(salvati)).toEqual(["autovalutazione-sonnolenza"]);
  await senzaScorrimentoLaterale(page);
  await expectAccessible(page);
});

test("percorso: diario con minuti svegli e risveglio, efficienza, foglio con l'autovalutazione", async ({ page, context }) => {
  await entra(context, "p");
  await page.goto("/prenditi-cura-di-te/sonno/autovalutazione-gambe");
  for (const id of ["bisogno", "fermo", "movimento", "sera", "sonno"]) await page.locator(`#sn-q-${id}`).getByText("Sì", { exact: true }).click();
  await page.getByTestId("vedi-risultato").click();
  await expect(page.getByTestId("esito")).toContainText("I quattro segni tipici ci sono tutti");
  await page.getByTestId("salva-esito").click();

  await page.goto("/area-personale/diari/sonno");
  await expect(page.getByTestId("riepilogo")).toBeVisible();
  await page.getByTestId("a-letto").fill("23:00");
  await page.getByTestId("in-piedi").fill("07:00");
  await page.getByTestId("addormentarsi").fill("30");
  await page.getByTestId("svegli-min").fill("30");
  await page.getByTestId("sveglia").fill("06:00");
  await page.getByTestId("q-cosi").click();
  await page.getByTestId("salva-voce").click();
  await expect(page.getByTestId("voce-salvata")).toContainText("8 h");
  await expect(page.getByTestId("riepilogo")).toContainText("Efficienza del sonno");
  await expect(page.getByTestId("riepilogo")).toContainText("75%");
  await expect(page.getByTestId("riepilogo")).toContainText("6 h");
  await expect(page.getByTestId("autov-salvate")).toContainText("Gambe senza riposo");
  const dl = page.waitForEvent("download");
  await page.getByTestId("foglio-medico").click();
  expect((await dl).suggestedFilename()).toMatch(/^foglio-per-il-medico-sonno-/);
  await senzaScorrimentoLaterale(page);
});

test("la ricerca porta alle pagine del sonno", async ({ page }) => {
  await page.goto("/prenditi-cura-di-te/sonno");
  await page.getByRole("button", { name: /cerca/i }).first().click();
  await page.getByRole("dialog").locator("input[type=search]").fill("polisonnografia");
  await expect(page.getByRole("dialog").getByRole("link").first()).toHaveAttribute("href", "/prenditi-cura-di-te/sonno/esame-del-sonno");
});
