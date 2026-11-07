import { test } from "@playwright/test";

/** Screenshot reali per revisione visiva (docs/screenshots). Eseguire con: npm run screenshots */
const SHOTS = [
  ["home", "/"],
  ["prezzi", "/servizi-prezzi"],
  ["come-funziona", "/come-funziona"],
  ["secondo-parere-inattivo", "/secondo-parere"],
  ["inizia", "/inizia"],
  ["faq", "/faq"],
  ["errore-404", "/pagina-inesistente"],
] as const;

/** Porta a termine le animazioni d'ingresso prima dello scatto. */
async function settle(page: import("@playwright/test").Page) {
  await page.evaluate(() =>
    document.getAnimations().forEach((a) => {
      if (Number.isFinite(a.effect?.getComputedTiming().endTime ?? Infinity)) a.finish();
    }),
  );
}

test.describe("screenshots", () => {
  test.skip(!process.env.SCREENSHOTS, "solo con SCREENSHOTS=1");
  for (const [name, path] of SHOTS) {
    test(name, async ({ page }, info) => {
      await page.goto(path);
      await settle(page);
      await page.screenshot({ path: `docs/screenshots/${info.project.name}/${name}.png`, fullPage: true });
    });
  }
  test("demo-flusso", async ({ page }, info) => {
    const dir = `docs/screenshots/${info.project.name}`;
    await page.goto("/esempio");
    await settle(page);
    await page.screenshot({ path: `${dir}/demo-1-documento.png`, fullPage: true });
    await page.getByRole("button", { name: "Controlla i valori estratti" }).click();
    await page.getByRole("button", { name: "Conferma tutti i valori leggibili" }).click();
    await page.screenshot({ path: `${dir}/demo-2-controllo-valori.png`, fullPage: true });
    await page.getByRole("button", { name: "Genera la spiegazione" }).click();
    await page.getByRole("list", { name: "Spiegazione dei valori" }).waitFor();
    await page.screenshot({ path: `${dir}/demo-3-report.png`, fullPage: true });
  });

  test("area-flusso", async ({ browser }, info) => {
    const dir = `docs/screenshots/${info.project.name}`;
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    await page.goto("/accedi");
    await settle(page);
    await page.screenshot({ path: `${dir}/area-1-accedi.png`, fullPage: true });
    await page.getByRole("button", { name: "Entra con l'account demo" }).click();
    await page.waitForURL(/\/area$/);
    // Due referti pronti e un dossier, così l'archivio non è vuoto
    const ready = async (sampleId: string) => {
      const { id } = await (await ctx.request.post("/api/v1/area/documents", { data: { sampleId } })).json();
      const d = await (await ctx.request.get(`/api/v1/area/documents/${id}`)).json();
      const ids = d.document.extracted.observations.filter((o: { valueRaw: string | null }) => o.valueRaw !== null).map((o: { id: string }) => o.id);
      await ctx.request.post(`/api/v1/area/documents/${id}/verification`, { data: { confirmedObservationIds: ids } });
      const rep = await (await ctx.request.post(`/api/v1/area/documents/${id}/reports`, { data: { service: "completo" } })).json();
      await ctx.request.get(`/api/v1/area/reports/${rep.id}`);
      return id as string;
    };
    const d1 = await ready("demo-referto-lab-001");
    const d2 = await ready("demo-referto-lipidico-004");
    const dossier = await (await ctx.request.post("/api/v1/area/dossiers", { data: { title: "Visita di dicembre", documentIds: [d1, d2] } })).json();
    await page.goto("/area");
    await page.getByRole("list", { name: "Elenco dei referti" }).waitFor();
    await settle(page);
    await page.screenshot({ path: `${dir}/area-2-archivio.png`, fullPage: true });
    await page.goto("/area/nuovo");
    await settle(page);
    await page.screenshot({ path: `${dir}/area-3-nuovo.png`, fullPage: true });
    await page.getByLabel(/Funzionalità tiroidea/).check();
    await page.getByRole("button", { name: /Aggiungi e leggi il documento/ }).click();
    await page.getByRole("heading", { name: "Controlla prima i valori." }).waitFor({ timeout: 15_000 });
    await settle(page);
    await page.screenshot({ path: `${dir}/area-4-valori.png`, fullPage: true });
    await page.getByRole("button", { name: "Conferma tutti i valori leggibili" }).click();
    await page.getByRole("button", { name: /Salva e scegli il servizio/ }).click();
    await page.getByRole("heading", { name: "Scegli il servizio." }).waitFor();
    await settle(page);
    await page.screenshot({ path: `${dir}/area-5-servizio.png`, fullPage: true });
    await page.getByRole("button", { name: /Genera il report/ }).click();
    await page.getByRole("heading", { name: "Il tuo referto, in parole semplici." }).waitFor({ timeout: 20_000 });
    await settle(page);
    await page.screenshot({ path: `${dir}/area-6-report.png`, fullPage: true });
    await page.goto(`/area/dossier/${dossier.id}`);
    await page.getByRole("heading", { name: "Esami confrontabili" }).waitFor({ timeout: 15_000 });
    await settle(page);
    await page.screenshot({ path: `${dir}/area-7-dossier.png`, fullPage: true });
    await page.goto("/area/impostazioni");
    await settle(page);
    await page.screenshot({ path: `${dir}/area-8-impostazioni.png`, fullPage: true });
    // Tema scuro
    await page.evaluate(() => localStorage.setItem("rc-theme", "dark"));
    await page.goto("/area");
    await page.getByRole("list", { name: "Elenco dei referti" }).waitFor();
    await settle(page);
    await page.screenshot({ path: `${dir}/scuro-area-archivio.png`, fullPage: true });
    await page.goto(`/area/dossier/${dossier.id}`);
    await page.getByRole("heading", { name: "Esami confrontabili" }).waitFor({ timeout: 15_000 });
    await settle(page);
    await page.screenshot({ path: `${dir}/scuro-area-dossier.png`, fullPage: true });
    await ctx.close();
  });
});
