import { test, expect } from "@playwright/test";
import { expectAccessible } from "./a11y";

/**
 * 14/11/2026: il sito ha due stati, senza medici (quello di lancio, tests/e2e) e con i medici accesi (tests/e2e-medici).
 * Qui l'elenco delle pagine pubbliche di ognuno e i controlli che valgono per tutte: nessun errore, nessuno scorrimento
 * laterale, accessibilità, link interni, testi vietati.
 */
const PAGINE_COMUNI = ["/", "/referti", "/famiglia", "/servizi/prevenzione", "/referti/esempio", "/prezzi", "/strumenti/preparati-alla-visita", "/come-funziona", "/servizi", "/domande-frequenti", "/per-le-strutture", "/guide", "/glossario", "/strumenti/domande-per-il-medico", "/inizia", "/chi-siamo", "/stato-del-progetto", "/contatti", "/sicurezza-e-privacy", "/accessibilita", "/privacy-policy", "/termini", "/cookie-policy"] as const;
/** Senza medici: in più c'è solo «Presto anche con un medico», dove portano tutte le loro pagine. */
export const PAGINE_LANCIO: readonly string[] = [...PAGINE_COMUNI, "/con-un-medico"];
/** Con i medici accesi tornano le pagine dei tre servizi e quella per i medici. */
export const PAGINE_DEI_MEDICI = ["/servizi/visita-a-domicilio", "/servizi/parla-con-un-medico", "/servizi/secondo-parere", "/per-i-medici"] as const;
export const PAGINE_CON_MEDICI: readonly string[] = [...PAGINE_COMUNI, ...PAGINE_DEI_MEDICI];

/** Parole e promesse che il sito non usa mai. «in pochi minuti» è ammesso solo come «di norma in pochi minuti». */
export const VIETATE = ["lorem ipsum", "certificato gdpr", "conforme mdr", "24/7", "approvato da medici", "100%", "garantit", "conforme al gdpr", "gdpr compliant", "in totale sicurezza", "medici qualificati", "nella norma", "in pochi minuti", "referto chiaro"] as const;

/** Testo della pagina pronto per il controllo: minuscolo, senza la sola forma ammessa di «in pochi minuti». */
export function testoPerVietate(text: string): string {
  return text.toLowerCase().replaceAll("di norma in pochi minuti", "");
}

export function provePagine(pages: readonly string[]) {
  for (const path of pages) {
    test(`pagina ${path}: nessun errore, nessun overflow, accessibilità`, async ({ page }) => {
      const errors: string[] = [];
      page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
      page.on("pageerror", (e) => errors.push(e.message));
      const res = await page.goto(path);
      expect(res?.status()).toBe(200);
      // La pagina è proprio quella chiesta: un rimando ad altro indirizzo qui sarebbe un difetto.
      expect(new URL(page.url()).pathname, "nessun rimando").toBe(path);
      await expect(page.locator("h1")).toHaveCount(1);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow, "scroll orizzontale involontario").toBeLessThanOrEqual(0);
      await expectAccessible(page);
      expect(errors).toEqual([]);
    });
  }

  test("nessun link interno rotto", async ({ page, request }) => {
    const seen = new Set<string>();
    for (const path of pages) {
      await page.goto(path);
      const hrefs = await page.$$eval("a[href^='/']", (as) => as.map((a) => (a as HTMLAnchorElement).getAttribute("href")!.split("#")[0]));
      hrefs.forEach((h) => seen.add(h || "/"));
    }
    for (const href of seen) {
      const res = await request.get(href);
      expect(res.status(), href).toBe(200);
    }
  });

  test("nessun testo vietato o promessa non verificabile", async ({ page }) => {
    for (const path of pages) {
      await page.goto(path);
      const text = testoPerVietate(await page.locator("body").innerText());
      for (const banned of VIETATE) {
        if (banned === "referto chiaro" && path === "/chi-siamo") continue; // nota storica dichiarata
        expect(text, `${path} contiene "${banned}"`).not.toContain(banned);
      }
    }
  });
}
