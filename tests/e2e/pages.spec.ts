import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { expectAccessible } from "./_lib/a11y";

const PAGES = ["/", "/referti", "/servizi/archivio", "/servizi/visite-e-consulti", "/servizi/prevenzione", "/referti/esempio", "/come-funziona", "/servizi", "/domande-frequenti", "/servizi/secondo-parere", "/per-le-strutture", "/guide", "/glossario", "/strumenti/domande-per-il-medico", "/inizia", "/chi-siamo", "/contatti", "/sicurezza-e-privacy", "/accessibilita", "/privacy-policy", "/termini", "/cookie-policy"];

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
    const text = (await page.locator("body").innerText()).toLowerCase();
    for (const banned of ["lorem ipsum", "certificato gdpr", "conforme mdr", "24/7", "approvato da medici", "100%", "garantit", "conforme al gdpr", "gdpr compliant", "in totale sicurezza", "medici qualificati", "nella norma", "in pochi minuti", "referto chiaro"]) {
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
  await expect(menu.getByRole("link", { name: "Prova la demo" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(menu).toBeHidden();
});

test.describe("Cura Privata: mappa, stati e prezzi", () => {
  test("i vecchi indirizzi rimandano in modo permanente alla nuova mappa", async ({ request }) => {
    for (const [from, to] of [["/esempio", "/referti/esempio"], ["/secondo-parere", "/servizi/secondo-parere"], ["/servizi-prezzi", "/servizi"], ["/faq", "/domande-frequenti"], ["/sicurezza", "/sicurezza-e-privacy"], ["/privacy", "/privacy-policy"], ["/cookie", "/cookie-policy"], ["/area", "/area-personale"], ["/area/dossier", "/area-personale/dossier"]]) {
      const res = await request.get(from, { maxRedirects: 0 });
      expect(res.status(), from).toBe(308);
      expect(res.headers()["location"], from).toBe(to);
    }
  });

  test("nessun prezzo pubblico finché il listino non è approvato", async ({ page }) => {
    for (const path of ["/", "/servizi", "/referti", "/servizi/secondo-parere", "/domande-frequenti"]) {
      await page.goto(path);
      expect(await page.locator("main").innerText(), path).not.toMatch(/\d\s?€|€\s?\d/);
    }
  });

  test("i servizi in preparazione lo dicono e non offrono caricamenti, prenotazioni o pagamenti", async ({ page }) => {
    for (const path of ["/servizi/archivio", "/servizi/visite-e-consulti", "/servizi/prevenzione"]) {
      await page.goto(path);
      await expect(page.getByText("Servizio in preparazione", { exact: false }).first()).toBeVisible();
      await expect(page.locator("main input[type=file]")).toHaveCount(0);
      const actions = (await page.locator("main a, main button").allInnerTexts()).join(" ").toLowerCase();
      for (const word of ["prenota", "carica", "paga", "acquista"]) expect(actions, `${path}: ${word}`).not.toContain(word);
      await expect(page.locator("main textarea")).toHaveCount(0);
    }
  });

  test("la home dice in 5 secondi che cosa fa oggi", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(/La tua salute, più chiara e accessibile\./);
    await expect(page.getByText("Oggi Cura Privata fa una cosa:")).toBeVisible();
    await expect(page.getByText("Le spiegazioni informative non sostituiscono una valutazione medica.").first()).toBeVisible();
  });
});
