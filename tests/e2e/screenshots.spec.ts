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
  ["per-le-strutture", "/per-le-strutture"],
  ["fase4-1-guide-hub", "/guide"],
  ["fase4-2-guida-tsh", "/guide/tsh"],
  ["fase4-3-guida-emocromo", "/guide/emocromo"],
  ["fase4-4-glossario", "/glossario"],
  ["fase4-5-voce-ferritina", "/glossario/ferritina"],
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
      const ord = await (await ctx.request.post("/api/v1/area/orders", { data: { service: "completo", documentId: id } })).json();
      await ctx.request.post(`/api/v1/area/orders/${ord.id}/simula`, { data: { esito: "pagato" } });
      await ctx.request.get(`/api/v1/area/documents/${id}`);
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
    await page.getByRole("button", { name: /Procedi al pagamento/ }).click();
    await page.getByRole("button", { name: "Conferma il pagamento di prova" }).click();
    await page.getByRole("link", { name: "Torna al referto" }).first().click();
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

  test("fase3-flusso", async ({ browser }, info) => {
    const dir = `docs/screenshots/${info.project.name}`;
    const { totpCode } = await import("../../src/lib/auth/totp");
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    // Pagamento simulato
    await ctx.request.post("/api/v1/auth/demo", { data: {} });
    const { id } = await (await ctx.request.post("/api/v1/area/documents", { data: { sampleId: "demo-referto-epatico-005" } })).json();
    const d = await (await ctx.request.get(`/api/v1/area/documents/${id}`)).json();
    const ids = d.document.extracted.observations.filter((o: { valueRaw: string | null }) => o.valueRaw !== null).map((o: { id: string }) => o.id);
    await ctx.request.post(`/api/v1/area/documents/${id}/verification`, { data: { confirmedObservationIds: ids } });
    await page.goto(`/area/documenti/${id}`);
    await page.getByRole("heading", { name: "Scegli il servizio." }).waitFor({ timeout: 15_000 });
    await settle(page);
    await page.screenshot({ path: `${dir}/fase3-1-servizio-pagamento.png`, fullPage: true });
    const ord = await (await ctx.request.post("/api/v1/area/orders", { data: { service: "essenziale", documentId: id } })).json();
    await page.goto(ord.checkoutUrl);
    await page.getByRole("button", { name: "Conferma il pagamento di prova" }).waitFor({ timeout: 15_000 });
    await settle(page);
    await page.screenshot({ path: `${dir}/fase3-2-pagamento-simulato.png`, fullPage: true });
    await ctx.request.post(`/api/v1/area/orders/${ord.id}/simula`, { data: { esito: "pagato" } });
    await page.goto("/area/ordini");
    await page.getByRole("heading", { name: /ordini/i }).waitFor({ timeout: 15_000 });
    await settle(page);
    await page.screenshot({ path: `${dir}/fase3-3-ordini.png`, fullPage: true });
    // Secondo parere: il medico dimostrativo deve esistere
    const doc = await browser.newContext();
    const r = await (await doc.request.post("/api/v1/auth/demo-ruolo", { data: { role: "physician" } })).json();
    const secret = r.mfaEnabled ? (await (await doc.request.get("/api/v1/auth/mfa/verifica")).json()).secret : (await (await doc.request.post("/api/v1/auth/mfa/setup", { data: {} })).json()).secret;
    await doc.request.post(r.mfaEnabled ? "/api/v1/auth/mfa/verifica" : "/api/v1/auth/mfa/conferma", { data: { code: totpCode(secret) } });
    await page.goto("/area/secondo-parere");
    await page.getByRole("heading", { name: "Nuova richiesta" }).waitFor({ timeout: 15_000 });
    await settle(page);
    await page.screenshot({ path: `${dir}/fase3-4-secondo-parere-richiesta.png`, fullPage: true });
    const c = await (await ctx.request.post("/api/v1/area/casi", { data: { documentId: id, specialty: "Medicina interna (simulazione)", question: "Alcuni valori sono fuori dall'intervallo stampato: quali approfondimenti potrei chiedere al mio medico?", acknowledgeSimulation: true } })).json();
    const dp = await doc.newPage();
    await dp.goto(`/medico/casi/${c.id}`);
    await dp.getByRole("button", { name: "Prendo in carico" }).waitFor({ timeout: 15_000 });
    await settle(dp);
    await dp.screenshot({ path: `${dir}/fase3-5-medico-caso.png`, fullPage: true });
    await doc.request.post(`/api/v1/medico/casi/${c.id}`, { data: { kind: "accept" } });
    await doc.request.post(`/api/v1/medico/casi/${c.id}`, { data: { kind: "answer", answer: "Parere dimostrativo: i valori riportati vanno letti con il medico curante, che conosce la storia clinica. Questa risposta è una simulazione e non ha valore clinico.", confirmResponsibility: true } });
    await page.goto(`/area/secondo-parere/${c.id}`);
    await page.getByRole("heading", { name: "Parere", exact: true }).waitFor({ timeout: 15_000 });
    await settle(page);
    await page.screenshot({ path: `${dir}/fase3-6-parere-firmato.png`, fullPage: true });
    // Portale medico: accesso e 2FA
    const anon = await browser.newContext();
    const ap = await anon.newPage();
    await ap.goto("/medico");
    await ap.getByRole("heading", { name: "Accesso riservato." }).waitFor();
    await settle(ap);
    await ap.screenshot({ path: `${dir}/fase3-7-medico-accesso.png`, fullPage: true });
    await ap.getByRole("button", { name: /Entra come medico dimostrativo/ }).click();
    await ap.getByLabel("Codice a 6 cifre").waitFor({ timeout: 15_000 });
    await settle(ap);
    await ap.screenshot({ path: `${dir}/fase3-8-medico-2fa.png`, fullPage: true });
    // Admin
    const adm = await browser.newContext();
    const a = await (await adm.request.post("/api/v1/auth/demo-ruolo", { data: { role: "admin" } })).json();
    const asecret = a.mfaEnabled ? (await (await adm.request.get("/api/v1/auth/mfa/verifica")).json()).secret : (await (await adm.request.post("/api/v1/auth/mfa/setup", { data: {} })).json()).secret;
    await adm.request.post(a.mfaEnabled ? "/api/v1/auth/mfa/verifica" : "/api/v1/auth/mfa/conferma", { data: { code: totpCode(asecret) } });
    await adm.request.post("/api/v1/waitlist", { data: { email: "struttura@esempio.invalid", interest: "strutture", organization: "Laboratorio Dimostrativo", consent: true } });
    const admp = await adm.newPage();
    await admp.goto("/admin");
    await admp.getByRole("heading", { name: "Panoramica" }).waitFor({ timeout: 15_000 });
    await admp.getByText("Utenti").waitFor();
    await settle(admp);
    await admp.screenshot({ path: `${dir}/fase3-9-admin-panoramica.png`, fullPage: true });
    await admp.goto("/admin/medici");
    await admp.getByRole("table", { name: "Medici" }).waitFor({ timeout: 15_000 });
    await settle(admp);
    await admp.screenshot({ path: `${dir}/fase3-10-admin-medici.png`, fullPage: true });
    await ctx.close();
    await doc.close();
    await anon.close();
    await adm.close();
  });
});
