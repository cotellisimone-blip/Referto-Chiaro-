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

/**
 * 19/11/2026 (home «chiara e scura»): il sito nasce chiaro, anche se il telefono preferisce lo scuro; la visione scura
 * si sceglie con il pulsante nella barra in alto, accanto alla lente, e resta ricordata (rc-theme).
 */
test.describe("visione scura", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      try {
        localStorage.setItem("rc-theme", "dark");
      } catch {}
    });
  });
  for (const path of ["/", "/lettura-referti", "/prezzi", "/referti/esempio", "/prevenzione/esami-di-base", "/scaffale"]) {
    test(`pagina ${path} nella visione scura: accessibilità`, async ({ page }) => {
      await page.goto(path);
      await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
      const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
      expect(bg).toBe("rgb(6, 26, 34)");
      const axe = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
      expect(axe.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`)).toEqual([]);
    });
  }
});

test.describe("il sito nasce chiaro", () => {
  test.use({ colorScheme: "dark" });
  test("anche con il telefono in modalità scura la prima visita è chiara", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
    expect(await page.evaluate(() => getComputedStyle(document.body).backgroundColor)).toBe("rgb(251, 250, 246)");
  });
});

test("il pulsante della luce, accanto alla lente, passa alla visione scura e la ricorda", async ({ page }) => {
  await gotoReady(page, "/");
  // Sta nella barra in alto anche su telefono: niente menu da aprire. La testata ha due file di comandi (computer e telefono):
  // si prende quello in vista.
  const luce = page.getByTestId("luce").filter({ visible: true }).first();
  await expect(luce).toBeVisible();
  await expect(luce).toHaveAccessibleName("Passa alla visione scura");
  await expect(luce).toHaveAttribute("aria-pressed", "false");
  await luce.click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expect(luce).toHaveAccessibleName("Passa alla visione chiara");
  await expect(luce).toHaveAttribute("aria-pressed", "true");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  // E si torna alla chiara.
  await page.getByTestId("luce").filter({ visible: true }).first().click();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
});

test("menu mobile: si apre, intrappola il fuoco e si chiude con Esc", async ({ page, isMobile }) => {
  test.skip(!isMobile, "solo mobile");
  await gotoReady(page, "/");
  await page.getByRole("button", { name: "Apri il menu" }).click();
  const menu = page.locator("#menu-mobile");
  await expect(menu).toBeVisible();
  await expect(menu.getByRole("link", { name: "Carica un referto" })).toBeVisible();
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
    for (const path of ["/", "/prezzi", "/lettura-referti"]) {
      await page.goto(path);
      const txt = (await page.locator("main").innerText()).replace(/\s/g, " ");
      for (const n of ["2,90", "7,90"]) expect(txt, path).toContain(`${n} €`);
      for (const old of ["49 €", "89 €", "79 €", "69 €"]) expect(txt, path).not.toContain(old);
      expect(txt, path).toContain("Prezzi di riferimento");
    }
  });

  test("la sezione in arrivo lo dice e non offre caricamenti, prenotazioni o pagamenti", async ({ page }) => {
    for (const path of ["/medici"]) {
      await page.goto(path);
      await expect(page.getByText("Non è ancora attivo", { exact: false }).first()).toBeVisible();
      await expect(page.locator("main input[type=file]")).toHaveCount(0);
      const actions = (await page.locator("main a, main button").allInnerTexts()).join(" ").toLowerCase();
      for (const word of ["prenota", "carica", "paga", "acquista"]) expect(actions, `${path}: ${word}`).not.toContain(word);
      await expect(page.locator("main textarea")).toHaveCount(0);
    }
  });

  test("la home dice in 5 secondi che cosa offre: la promessa è il titolo, che cosa si fa subito sotto", async ({ page, isMobile }) => {
    await page.goto("/");
    // 13/11/2026: la promessa «famiglia e nel tempo» è il titolo. Senza medici il payoff dice quello che c'è davvero.
    // 15/11/2026, home a due sezioni: il titolo dice le due cose che fa Cura Privata.
    // 19/11/2026, home «chiara e scura»: il titolo è la promessa, la frase dei tre servizi resta nel piè di pagina.
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(/La tua salute,\s*tutta in una pagina\./);
    await expect(page.locator("footer").getByText("Conosciti. Capisci. Prenditi cura di te.")).toBeVisible();
    // Nessun «.it» accanto al logo finché il sito non gira su un dominio vero (PUBLIC_BASE_URL).
    await expect(page.locator("footer").getByText(".it", { exact: true })).toHaveCount(0);
    const menu = (await page.locator("header").getByRole("link").allInnerTexts()).map((t) => t.trim());
    if (!isMobile) {
      // 15/11/2026 sera, tre sezioni: le tre sezioni, le guide, gli integratori, i prezzi e «Carica un referto».
      // 22/11/2026: entra «Malattie»; «Guide» resta nella testata dai 1536 px (sotto: menu, fondo pagina, ricerca, Malattie).
      // 22/11/2026: la testata mostra i cinque passi del percorso, numerati; le pagine da consultare stanno nel menu e nel fondo.
      const voci = menu.map((t) => t.replace(/\s+/g, " "));
      for (const n of ["Passo 1: Inizia", "Passo 2: Esami", "Passo 3: Referti", "Passo 4: Medico", "Passo 5: Cura di te"]) expect(voci.some((v) => v.includes(n)), n).toBe(true);
      expect(menu, "Carica un referto").toContain("Carica un referto");
      for (const n of ["Videoconsulto", "Secondo parere"]) expect(menu, n).not.toContain(n);
    }
    await expect(page.locator('main a[href="/lettura-referti"]').first()).toBeAttached();
    // Above the fold: il percorso in quattro passi è visibile senza scorrere.
    const first = page.getByRole("navigation", { name: "Il percorso, in cinque passi" });
    const box = await first.boundingBox();
    expect((box?.y ?? 9999) + (box?.height ?? 0)).toBeLessThan(isMobile ? 844 : 900);
    await expect(page.getByText("Versione dimostrativa", { exact: false }).first()).toBeVisible();
  });

  test("nessun medico, recensione o metrica inventata nelle pagine dei servizi", async ({ page }) => {
    for (const path of ["/", "/prezzi", "/medici", "/lettura-referti"]) {
      await page.goto(path);
      const txt = (await page.locator("main").innerText()).toLowerCase();
      for (const bad of ["dott. ", "dr. ", "iscrizione albo: ", "recensioni", "stelle", "pazienti soddisfatti", "professionisti qualificati", "medici qualificati"]) expect(txt, `${path}: ${bad}`).not.toContain(bad);
    }
  });
});
