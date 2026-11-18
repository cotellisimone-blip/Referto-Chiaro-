import { test, expect, type Page } from "@playwright/test";
import { gotoReady } from "./_lib/ready";

/**
 * 18/11/2026, terzo giro di interventi: le cose che si vedono solo nel browser. Il resto sta in
 * tests/unit/terzo-giro.test.ts, tests/unit/in-breve.test.ts e tests/unit/italiano.test.ts.
 */

async function caricaEsempio(page: Page) {
  await gotoReady(page, "/accedi?next=%2Farea-personale%2Fnuovo");
  await page.getByRole("button", { name: "Entra con l'account demo" }).click();
  await page.waitForURL(/nuovo/);
  await page.getByRole("button", { name: /Aggiungi e leggi il documento/ }).click();
  await page.getByRole("button", { name: "Conferma tutti i valori leggibili" }).waitFor({ timeout: 30_000 });
}

test("punto 1 · in fondo a una guida il prezzo è quello vero e il pulsante porta a caricare", async ({ page }) => {
  await gotoReady(page, "/guide/emocromo");
  await expect(page.getByText(/Hai già il tuo referto\? Rendilo chiaro: il primo 2,90\s€, poi 7,90\s€\./)).toBeVisible();
  await expect(page.getByText("Rendilo chiaro per 7,90 €")).toHaveCount(0);
});

test("punto 2 · in stampa nessun blocco resta spostato in basso", async ({ page }) => {
  await gotoReady(page, "/guide/emocromo");
  await page.emulateMedia({ media: "print" });
  const spostati = await page.locator(".reveal-prep, .reveal-in").evaluateAll((els) => els.filter((e) => getComputedStyle(e).transform !== "none").length);
  expect(spostati).toBe(0);
});

test("punti 3 e 4 · il referto ha un nome con la data, si può cambiare, e il doppione viene riconosciuto", async ({ page }) => {
  test.setTimeout(90_000);
  await caricaEsempio(page);
  // Nome scelto da noi: tipo e data del prelievo, mai il nome del file.
  await expect(page.locator(".rename-box strong")).toHaveText(/ del \d{1,2} [a-z]+ \d{4}$/);
  // Lo stesso esempio una seconda volta: avviso, con il collegamento a quello di prima.
  await gotoReady(page, "/area-personale/nuovo");
  await page.getByRole("button", { name: /Aggiungi e leggi il documento/ }).click();
  await expect(page.getByTestId("doppione")).toBeVisible({ timeout: 30_000 });
  // Cambio del nome.
  await page.getByRole("button", { name: "Cambia nome" }).click();
  await page.locator("#nome-referto").fill("Esami della mamma, novembre");
  await page.getByRole("button", { name: "Salva il nome" }).click();
  await expect(page.locator(".rename-box strong")).toHaveText("Esami della mamma, novembre");
  // Il vecchio indirizzo dell'elenco non dà più «pagina non trovata».
  await page.goto("/area-personale/documenti");
  await expect(page).toHaveURL(/\/area-personale$/);
  await expect(page.getByText("Esami della mamma, novembre").first()).toBeVisible();
});

test("punto 7 · «In breve» non ha frasi tagliate", async ({ page }) => {
  for (const slug of ["emocromo", "glicemia", "tac-con-mezzo-di-contrasto", "pap-test-e-hpv-test"]) {
    await gotoReady(page, `/guide/${slug}`);
    const righe = await page.locator("dl dd").allInnerTexts();
    expect(righe.length, slug).toBeGreaterThanOrEqual(3);
    for (const r of righe.slice(0, 2)) expect(r.trim().endsWith("…"), `${slug}: ${r}`).toBe(false);
  }
});

test("punto 8 · gli esami sono contati senza le guide pratiche e le unità hanno l'esponente", async ({ page }) => {
  await gotoReady(page, "/guide");
  await expect(page.getByText(/^95 esami spiegati/)).toBeVisible();
  await gotoReady(page, "/guide/globuli-rossi");
  const testo = await page.locator("main").innerText();
  expect(testo).toContain("10⁶/µL");
  expect(testo).not.toContain("10^");
});

test("punto 9 · nessun testo sotto i 14 px a ogni larghezza, schermate d'esempio comprese", async ({ page }) => {
  for (const path of ["/", "/prevenzione", "/lettura-referti", "/medici", "/prezzi", "/guide/emocromo", "/glossario/ferritina", "/famiglia", "/chi-siamo"]) {
    await gotoReady(page, path);
    const piccoli = await page.evaluate(() => {
      const out: string[] = [];
      const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      while (tw.nextNode()) {
        const t = (tw.currentNode.textContent ?? "").trim();
        const el = tw.currentNode.parentElement;
        // Unica eccezione: la «A» piccola del pulsante «Aa», che è un segno e non un testo.
        if (!t || !el || el.closest(".sr-only,script,style,noscript,svg,[data-aa]")) continue;
        if (el.closest("details:not([open])") && !el.closest("summary")) continue;
        const cs = getComputedStyle(el);
        const r = el.getBoundingClientRect();
        if (r.width < 2 || r.height < 2 || cs.visibility === "hidden" || cs.display === "none") continue;
        if (parseFloat(cs.fontSize) < 13.95) out.push(`${cs.fontSize} «${t.slice(0, 30)}»`);
      }
      return out;
    });
    expect(piccoli, path).toEqual([]);
  }
});

test("punti 10 e 11 · i titoli rispondono alla ricerca e sono in italiano corretto", async ({ page }) => {
  const attesi: [string, RegExp][] = [
    ["/prezzi", /^Quanto costa farsi spiegare un referto/],
    ["/come-funziona", /^Come farsi spiegare un referto/],
    ["/strumenti", /^Strumenti gratuiti per prepararsi alla visita/],
    ["/domande-frequenti", /^Referto spiegato online: le domande frequenti/],
    ["/chi-siamo", /^Chi siamo e perché spieghiamo i referti/],
    ["/glossario/trigliceridi", /^Trigliceridi: che cosa sono/],
    ["/glossario/ferritina", /^Ferritina: che cos'è/],
    ["/integratori/probiotici", /^Probiotici: che cosa sono e che cosa chiedere/],
  ];
  for (const [path, titolo] of attesi) {
    await page.goto(path);
    await expect(page, path).toHaveTitle(titolo);
  }
});

test("punto 12 · la ricerca trova le cinque guide nuove, che sono bozze dichiarate", async ({ page, isMobile }) => {
  await gotoReady(page, "/");
  await page.getByRole("button", { name: isMobile ? "Cerca nel sito" : "Apri la ricerca" }).first().click();
  const campo = page.getByRole("dialog").locator("input[type=search]");
  for (const [q, slug] of [["pap test", "pap-test-e-hpv-test"], ["sangue occulto", "sangue-occulto-nelle-feci"], ["urinocoltura", "urinocoltura"], ["beta hcg", "beta-hcg"], ["celiachia", "esami-per-la-celiachia"]]) {
    await campo.fill(q);
    await expect(page.locator(`a[data-result][href="/guide/${slug}"]`).first(), q).toBeVisible();
  }
  await gotoReady(page, "/guide/esami-per-la-celiachia");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Esami per la celiachia");
  await expect(page.getByText(/in attesa di revisione/i).first()).toBeVisible();
});
