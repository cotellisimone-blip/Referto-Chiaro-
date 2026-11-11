import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { expectAccessible } from "./_lib/a11y";

const PAGES = ["/", "/referti", "/servizi/archivio", "/servizi/parla-con-un-medico", "/servizi/prevenzione", "/referti/esempio", "/prezzi", "/strumenti/preparati-alla-visita", "/come-funziona", "/servizi", "/domande-frequenti", "/servizi/secondo-parere", "/per-le-strutture", "/guide", "/glossario", "/strumenti/domande-per-il-medico", "/inizia", "/chi-siamo", "/per-i-medici", "/stato-del-progetto", "/contatti", "/sicurezza-e-privacy", "/accessibilita", "/privacy-policy", "/termini", "/cookie-policy"];

for (const path of PAGES) {
  test(`pagina ${path}: nessun errore, nessun overflow, accessibilità`, async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
    page.on("pageerror", (e) => errors.push(e.message));
    const res = await page.goto(path);
    expect(res?.status()).toBe(200);
    await expect(page.locator("h1")).toHaveCount(1);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow, "scroll orizzontale involontario").toBeLessThanOrEqual(0);
    await expectAccessible(page);
    expect(errors).toEqual([]);
  });
}

test("nessun link interno rotto", async ({ page, request }) => {
  const seen = new Set<string>();
  for (const path of PAGES) {
    await page.goto(path);
    const hrefs = await page.$$eval("a[href^='/']", (as) => as.map((a) => (a as HTMLAnchorElement).getAttribute("href")!.split("#")[0]));
    hrefs.forEach((h) => seen.add(h || "/"));
  }
  for (const href of seen) {
    const res = await request.get(href);
    expect(res.status(), href).toBe(200);
  }
});

test("pagina inesistente mostra un 404 curato", async ({ page }) => {
  const res = await page.goto("/pagina-che-non-esiste");
  expect(res?.status()).toBe(404);
  await expect(page.getByRole("heading", { name: "Questa pagina non esiste." })).toBeVisible();
});

test("nessun testo vietato o promessa non verificabile", async ({ page }) => {
  for (const path of PAGES) {
    await page.goto(path);
    // «in pochi minuti» è ammesso solo come «di norma in pochi minuti» (tempi indicativi di Capisci)
    const text = (await page.locator("body").innerText()).toLowerCase().replaceAll("di norma in pochi minuti", "");
    for (const banned of ["lorem ipsum", "certificato gdpr", "conforme mdr", "24/7", "approvato da medici", "100%", "garantit", "conforme al gdpr", "gdpr compliant", "in totale sicurezza", "medici qualificati", "nella norma", "in pochi minuti", "referto chiaro"]) {
      if (banned === "in pochi minuti") {
        // Ammesso solo come «di norma in pochi minuti», per il servizio automatico «Capisci».
        expect(text.replaceAll("di norma in pochi minuti", ""), `${path} contiene "${banned}"`).not.toContain(banned);
        continue;
      }
      if (banned === "referto chiaro" && path === "/chi-siamo") continue; // nota storica dichiarata
      expect(text, `${path} contiene "${banned}"`).not.toContain(banned);
    }
  }
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

test("il selettore del tema forza il tema scuro e lo ricorda", async ({ page }) => {
  await page.goto("/");
  const toggle = page.getByRole("button", { name: /cambia tema/ }).first();
  await toggle.click(); // auto -> chiaro
  await toggle.click(); // chiaro -> scuro
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});

test("menu mobile: si apre, intrappola il fuoco e si chiude con Esc", async ({ page, isMobile }) => {
  test.skip(!isMobile, "solo mobile");
  await page.goto("/");
  await page.getByRole("button", { name: "Apri il menu" }).click();
  const menu = page.locator("#menu-mobile");
  await expect(menu).toBeVisible();
  await expect(menu.getByRole("link", { name: "Scegli il servizio per te" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(menu).toBeHidden();
});

test.describe("Cura Privata: mappa, stati e prezzi", () => {
  test("i vecchi indirizzi rimandano in modo permanente alla nuova mappa", async ({ request }) => {
    for (const [from, to] of [["/esempio", "/referti/esempio"], ["/secondo-parere", "/servizi/secondo-parere"], ["/servizi-prezzi", "/servizi"], ["/faq", "/domande-frequenti"], ["/sicurezza", "/sicurezza-e-privacy"], ["/privacy", "/privacy-policy"], ["/cookie", "/cookie-policy"], ["/area", "/area-personale"], ["/area/dossier", "/area-personale/dossier"], ["/servizi/visite-e-consulti", "/servizi/parla-con-un-medico"]]) {
      const res = await request.get(from, { maxRedirects: 0 });
      expect(res.status(), from).toBe(308);
      expect(res.headers()["location"], from).toBe(to);
    }
  });

  test("listino di riferimento: gli stessi prezzi ovunque, con la nota, da un'unica fonte", async ({ page }) => {
    for (const [path, expected] of [["/", ["2,90", "7,90", "149", "79"]], ["/prezzi", ["2,90", "7,90", "149", "79"]], ["/referti", ["2,90", "7,90"]], ["/servizi/secondo-parere", ["149"]], ["/servizi/parla-con-un-medico", ["79"]]] as const) {
      await page.goto(path);
      const txt = (await page.locator("main").innerText()).replace(/\s/g, " ");
      for (const n of expected) expect(txt, path).toContain(`${n} €`);
      for (const old of ["49 €", "89 €"]) expect(txt.replace(/1(49|89) €/g, ""), path).not.toContain(old);
      expect(txt, path).toContain("Prezzi di riferimento");
    }
  });

  test("i servizi in preparazione lo dicono e non offrono caricamenti, prenotazioni o pagamenti", async ({ page }) => {
    for (const path of ["/servizi/archivio", "/servizi/prevenzione"]) {
      await page.goto(path);
      await expect(page.getByText("Servizio in preparazione", { exact: false }).first()).toBeVisible();
      await expect(page.locator("main input[type=file]")).toHaveCount(0);
      const actions = (await page.locator("main a, main button").allInnerTexts()).join(" ").toLowerCase();
      for (const word of ["prenota", "carica", "paga", "acquista"]) expect(actions, `${path}: ${word}`).not.toContain(word);
      await expect(page.locator("main textarea")).toHaveCount(0);
    }
  });

  test("la home dice in 5 secondi che cosa offre: il payoff è il titolo, i tre servizi subito sotto", async ({ page, isMobile }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(/Capisci\.\s*Chiedi un secondo parere\.\s*Parla con un medico\./);
    for (const name of ["Capisci il tuo referto", "Chiedi un secondo parere", "Parla con un medico"]) await expect(page.getByRole("link", { name }).first()).toBeAttached();
    // Above the fold: almeno una porta d'ingresso ai servizi è visibile senza scorrere (mobile: le tre tessere)
    const first = page.locator("main").getByRole("link", { name: "Ho un referto" });
    const box = await first.boundingBox();
    expect((box?.y ?? 9999) + (box?.height ?? 0)).toBeLessThan(isMobile ? 844 : 900);
    await expect(page.getByText("Versione dimostrativa", { exact: false }).first()).toBeVisible();
  });

  test("nessun medico, recensione o metrica inventata nelle pagine dei servizi", async ({ page }) => {
    for (const path of ["/", "/prezzi", "/servizi/secondo-parere", "/servizi/parla-con-un-medico", "/referti"]) {
      await page.goto(path);
      const txt = (await page.locator("main").innerText()).toLowerCase();
      for (const bad of ["dott. ", "dr. ", "iscrizione albo: ", "recensioni", "stelle", "pazienti soddisfatti", "professionisti qualificati", "medici qualificati"]) expect(txt, `${path}: ${bad}`).not.toContain(bad);
    }
  });
});
