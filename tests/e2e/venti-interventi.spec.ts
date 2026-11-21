import { test, expect } from "@playwright/test";
import { gotoReady } from "./_lib/ready";

/**
 * 17/11/2026, «20 interventi prima del lancio»: le cose che si vedono solo nel browser. Il resto sta in
 * tests/e2e/sito-intero.spec.ts (tutte le pagine) e tests/unit/venti-interventi.test.ts.
 */

test("punto 2 · «Carica un referto» porta al caricamento: dalla testata, dalla home e dalla sezione", async ({ page, isMobile }) => {
  test.skip(isMobile, "su telefono la testata sta nel menu: stessa voce, provata in tocco.spec.ts");
  for (const [path, scope] of [["/", "header"], ["/lettura-referti", "main"]] as const) {
    await gotoReady(page, path);
    await expect(page.locator(scope).getByRole("link", { name: /Carica un referto/ }).first(), `${path} ${scope}`).toHaveAttribute("href", "/area-personale/nuovo");
  }
  // 19/11/2026, home «chiara e scura»: in home è il passo 3 del percorso, «Carica il referto», come nelle immagini approvate.
  await gotoReady(page, "/");
  await expect(page.locator("main #passo-3").getByRole("link", { name: /Carica il referto/ })).toHaveAttribute("href", "/area-personale/nuovo");
});

test("punto 4 · prezzi su computer: una scheda larga con «Che cosa include» in vista", async ({ page, isMobile }) => {
  test.skip(isMobile, "misura su computer");
  await page.goto("/prezzi");
  const card = page.locator("main [data-servizio='capisci']");
  expect((await card.boundingBox())!.width).toBeGreaterThan(760);
  await expect(card.getByText("Che cosa include")).toBeVisible();
});

test("punto 5 · il «prima e dopo» da telefono parte leggibile, e le due scritte portano a un foglio o all'altro", async ({ page, isMobile }) => {
  test.skip(!isMobile, "misura su telefono");
  await gotoReady(page, "/lettura-referti");
  const slider = page.getByRole("slider", { name: /Sposta per confrontare/ });
  await slider.scrollIntoViewIfNeeded();
  await expect(slider).toHaveValue("5");
  // Il foglio spiegato è tutto in vista: nessuna riga coperta dal referto originale.
  const frame = page.locator(".ba-frame");
  const riga = frame.getByText("Colesterolo LDL").last();
  const fb = (await frame.boundingBox())!;
  const rb = (await riga.boundingBox())!;
  expect(rb.x - fb.x).toBeGreaterThan(fb.width * 0.05);
  await page.getByRole("button", { name: /il referto com/ }).click();
  await expect(slider).toHaveValue("100");
  await page.getByRole("button", { name: /spiegato/ }).click();
  await expect(slider).toHaveValue("5");
});

test("punto 7 · barra delle tre sezioni: nessuna voce tagliata o spezzata, da 320 a 412 px", async ({ page, isMobile }) => {
  test.skip(!isMobile, "misura su telefono");
  for (const width of [320, 360, 390, 412]) {
    await page.setViewportSize({ width, height: 800 });
    for (const path of ["/prevenzione", "/lettura-referti", "/medici", "/guide/emocromo"]) {
      await page.goto(path);
      const voci = await page.locator(".ds-path b").evaluateAll((els) =>
        els.map((e) => ({ t: e.textContent ?? "", righe: Math.round(e.getBoundingClientRect().height / parseFloat(getComputedStyle(e).lineHeight)), taglio: e.scrollWidth - e.clientWidth })),
      );
      expect(voci.map((v) => v.t), `${path} @${width}`).toEqual(["Prevenzione", "Lettura referti", "Medici"]);
      for (const v of voci) {
        expect(v.righe, `${path} @${width}: «${v.t}» su ${v.righe} righe`).toBeLessThanOrEqual(v.t.includes(" ") ? 2 : 1);
        expect(v.taglio, `${path} @${width}: «${v.t}» tagliata`).toBeLessThanOrEqual(0);
      }
    }
  }
});

test("punto 8 · la ricerca trova gli integratori e, se non trova, propone le tre sezioni", async ({ page, isMobile }) => {
  await gotoReady(page, "/");
  await page.getByRole("button", { name: isMobile ? "Cerca nel sito" : "Apri la ricerca" }).first().click();
  const campo = page.getByRole("dialog").locator("input[type=search]");
  await campo.fill("omega");
  await expect(page.getByRole("dialog").locator('a[href^="/integratori/"]').first()).toBeVisible();
  await campo.fill("dolore al ginocchio");
  const sezioni = page.getByTestId("search-sezioni");
  await expect(sezioni).toBeVisible();
  expect(await sezioni.locator("a").evaluateAll((as) => as.map((a) => a.getAttribute("href")))).toEqual(["/prevenzione", "/lettura-referti", "/medici"]);
});

test("punto 9 · home da telefono: sotto le 9,5 schermate, senza ripetere il percorso in fondo", async ({ page, isMobile }) => {
  test.skip(!isMobile, "misura su telefono");
  await page.goto("/");
  // Erano 10,6 schermate da 844 px. 19/11/2026, home «chiara e scura»: il percorso in quattro passi c'è una volta sola.
  expect(await page.evaluate(() => document.documentElement.scrollHeight / window.innerHeight)).toBeLessThan(9.5);
  await expect(page.getByRole("navigation", { name: "Il percorso, in quattro passi" })).toHaveCount(1);
  await expect(page.locator('main section[aria-label="Perché fidarsi"]')).toContainText("Mai diagnosi");
});

test("punto 16 · mentre si compila un modulo da telefono, i comandi fissi in basso si fanno da parte", async ({ page, isMobile }) => {
  test.skip(!isMobile, "misura su telefono");
  await gotoReady(page, "/medici");
  const email = page.locator("main").getByLabel("Indirizzo email");
  await email.scrollIntoViewIfNeeded();
  await email.focus();
  const fissi = () =>
    page.evaluate(() =>
      [...document.querySelectorAll<HTMLElement>(".back-to-top, .mobile-help-bar")].filter((e) => {
        const s = getComputedStyle(e);
        const r = e.getBoundingClientRect();
        return s.visibility !== "hidden" && s.display !== "none" && Number(s.opacity) > 0.05 && r.top < window.innerHeight && r.bottom > 0;
      }).length,
    );
  await expect.poll(fissi).toBe(0);
});
