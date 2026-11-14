import { test, expect } from "@playwright/test";
import { gotoReady } from "./_lib/ready";
import AxeBuilder from "@axe-core/playwright";
import { PAGINE_LANCIO, provePagine } from "./_lib/pagine";

/** Stato di lancio, senza medici (src/lib/medici.ts). Le stesse prove con i medici accesi: tests/e2e-medici/pages.spec.ts. */

provePagine(PAGINE_LANCIO);

test("pagina inesistente mostra un 404 curato", async ({ page }) => {
  const res = await page.goto("/pagina-che-non-esiste");
  expect(res?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "Questa pagina non esiste." })).toBeVisible();
});

test.describe("tema scuro", () => {
  test.use({ colorScheme: "dark" });
  for (const path of ["/", "/servizi", "/referti/esempio"]) {
    test(`pagina ${path} in tema scuro: accessibilità`, async ({ page }) => {
      await page.goto(path);
      const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
      expect(bg).toBe("rgb(11, 30, 38)");
      const axe = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
      expect(axe.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`)).toEqual([]);
    });
  }
});

test("il selettore del tema forza il tema scuro e lo ricorda", async ({ page, isMobile }) => {
  await gotoReady(page, "/");
  // Su telefono il selettore del tema sta dentro il menu: prima si apre quello.
  if (isMobile) await page.getByRole("button", { name: "Apri il menu" }).click();
  const toggle = page.getByRole("button", { name: /cambia tema/ }).first();
  await toggle.click(); // auto -> chiaro
  await toggle.click(); // chiaro -> scuro
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});

test("menu mobile: si apre, intrappola il fuoco e si chiude con Esc", async ({ page, isMobile }) => {
  test.skip(!isMobile, "solo mobile");
  await gotoReady(page, "/");
  await page.getByRole("button", { name: "Apri il menu" }).click();
  const menu = page.locator("#menu-mobile");
  await expect(menu).toBeVisible();
  await expect(menu.getByRole("link", { name: "Scegli il servizio per te" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(menu).toBeHidden();
});

test.describe("Cura Privata: mappa, stati e prezzi", () => {
  test("i vecchi indirizzi rimandano in modo permanente alla nuova mappa", async ({ request }) => {
    for (const [from, to] of [["/esempio", "/referti/esempio"], ["/secondo-parere", "/servizi/secondo-parere"], ["/servizi-prezzi", "/servizi"], ["/faq", "/domande-frequenti"], ["/sicurezza", "/sicurezza-e-privacy"], ["/privacy", "/privacy-policy"], ["/cookie", "/cookie-policy"], ["/area", "/area-personale"], ["/area/dossier", "/area-personale/dossier"], ["/servizi/visite-e-consulti", "/servizi/parla-con-un-medico"], ["/servizi/archivio", "/famiglia"]]) {
      const res = await request.get(from, { maxRedirects: 0 });
      expect(res.status(), from).toBe(308);
      expect(res.headers()["location"], from).toBe(to);
    }
  });

  test("listino di riferimento: gli stessi prezzi ovunque, con la nota, da un'unica fonte", async ({ page }) => {
    // Senza medici il listino è uno solo: primo referto 2,90 €, poi 7,90 € per referto. Nessun prezzo dei servizi con un medico.
    for (const path of ["/", "/prezzi", "/referti", "/servizi"]) {
      await page.goto(path);
      const txt = (await page.locator("main").innerText()).replace(/\s/g, " ");
      for (const n of ["2,90", "7,90"]) expect(txt, path).toContain(`${n} €`);
      for (const old of ["49 €", "89 €", "79 €", "69 €"]) expect(txt, path).not.toContain(old);
      expect(txt, path).toContain("Prezzi di riferimento");
    }
  });

  test("i servizi in preparazione lo dicono e non offrono caricamenti, prenotazioni o pagamenti", async ({ page }) => {
    for (const path of ["/servizi/prevenzione"]) {
      await page.goto(path);
      await expect(page.getByText("Servizio in preparazione", { exact: false }).first()).toBeVisible();
      await expect(page.locator("main input[type=file]")).toHaveCount(0);
      const actions = (await page.locator("main a, main button").allInnerTexts()).join(" ").toLowerCase();
      for (const word of ["prenota", "carica", "paga", "acquista"]) expect(actions, `${path}: ${word}`).not.toContain(word);
      await expect(page.locator("main textarea")).toHaveCount(0);
    }
  });

  test("la home dice in 5 secondi che cosa offre: la promessa è il titolo, che cosa si fa subito sotto", async ({ page, isMobile }) => {
    await page.goto("/");
    // 13/11/2026: la promessa «famiglia e nel tempo» è il titolo. Senza medici il payoff dice quello che c'è davvero.
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(/Tutta la salute della tua famiglia,\s*finalmente chiara\./);
    await expect(page.locator("main .payoff").first()).toHaveText(/Capisci\.\s*Segui nel tempo\.\s*Arriva preparato dal medico\./);
    await expect(page.locator("footer").getByText("Capisci. Segui nel tempo. Arriva preparato dal medico.")).toBeVisible();
    // Nessun «.it» accanto al logo finché il sito non gira su un dominio vero (PUBLIC_BASE_URL).
    await expect(page.locator("footer").getByText(".it", { exact: true })).toHaveCount(0);
    const menu = (await page.locator("header").getByRole("link").allInnerTexts()).map((t) => t.trim());
    if (!isMobile) {
      for (const n of ["Capisci il referto", "Famiglia", "Prezzi", "Guide"]) expect(menu, n).toContain(n);
      for (const n of ["A domicilio", "Videoconsulto", "Secondo parere"]) expect(menu, n).not.toContain(n);
    }
    await expect(page.getByRole("link", { name: "Capisci il tuo referto" }).first()).toBeAttached();
    // Above the fold: la porta d'ingresso al servizio è visibile senza scorrere.
    const first = page.locator("main").getByRole("link", { name: "Ho un referto" });
    const box = await first.boundingBox();
    expect((box?.y ?? 9999) + (box?.height ?? 0)).toBeLessThan(isMobile ? 844 : 900);
    await expect(page.getByText("Versione dimostrativa", { exact: false }).first()).toBeVisible();
  });

  test("nessun medico, recensione o metrica inventata nelle pagine dei servizi", async ({ page }) => {
    for (const path of ["/", "/prezzi", "/servizi", "/con-un-medico", "/referti"]) {
      await page.goto(path);
      const txt = (await page.locator("main").innerText()).toLowerCase();
      for (const bad of ["dott. ", "dr. ", "iscrizione albo: ", "recensioni", "stelle", "pazienti soddisfatti", "professionisti qualificati", "medici qualificati"]) expect(txt, `${path}: ${bad}`).not.toContain(bad);
    }
  });
});
