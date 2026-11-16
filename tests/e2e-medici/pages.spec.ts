import { test, expect } from "@playwright/test";
import { PAGINE_CON_MEDICI, provePagine } from "../e2e/_lib/pagine";

/** Con i medici accesi (ENABLE_MEDICI=true): tutte le pagine pubbliche, comprese quelle dei tre servizi con un medico. */

provePagine(PAGINE_CON_MEDICI);

test.describe("Cura Privata: mappa, stati e prezzi", () => {
  test("listino di riferimento: gli stessi prezzi ovunque, con la nota, da un'unica fonte", async ({ page }) => {
    // Listino 12/11/2026: videoconsulto 69 €, secondo parere 149 € fisso, domicilio 149 €.
    for (const [path, expected] of [["/", ["2,90", "7,90", "149", "69"]], ["/prezzi", ["2,90", "7,90", "149", "69"]], ["/referti", ["2,90", "7,90"]], ["/servizi/secondo-parere", ["149"]], ["/servizi/parla-con-un-medico", ["69"]], ["/servizi/visita-a-domicilio", ["149"]]] as const) {
      await page.goto(path);
      const txt = (await page.locator("main").innerText()).replace(/\s/g, " ");
      for (const n of expected) expect(txt, path).toContain(`${n} €`);
      for (const old of ["49 €", "89 €", "79 €"]) expect(txt.replace(/1(49|89) €/g, ""), path).not.toContain(old);
      expect(txt, path).not.toContain("da 149 €");
      expect(txt, path).toContain("Prezzi di riferimento");
    }
  });

  test("la home dice in 5 secondi che cosa offre: la promessa è il titolo, i tre servizi subito sotto", async ({ page, isMobile }) => {
    await page.goto("/");
    // 13/11/2026: la promessa «famiglia e nel tempo» è il titolo; il payoff dei tre servizi resta subito sotto, nello stesso ordine.
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(/Tutta la salute della tua famiglia,\s*finalmente chiara\./);
    await expect(page.locator("main .payoff").first()).toHaveText(/Capisci\.\s*Parla con un medico\.\s*Chiedi un secondo parere\./);
    await expect(page.locator("footer").getByText("Capisci. Parla con un medico. Chiedi un secondo parere.")).toBeVisible();
    // Nessun «.it» accanto al logo finché il sito non gira su un dominio vero (PUBLIC_BASE_URL).
    await expect(page.locator("footer").getByText(".it", { exact: true })).toHaveCount(0);
    const menu = (await page.locator("header").getByRole("link").allInnerTexts()).map((t) => t.trim());
    const order = ["Capisci il referto", "A domicilio", "Videoconsulto", "Secondo parere"].map((n) => menu.indexOf(n));
    if (!isMobile) {
      expect(order.every((i) => i >= 0)).toBe(true);
      expect(order).toEqual([...order].sort((a, b) => a - b));
    }
    for (const name of ["Capisci il tuo referto", "Secondo parere specialistico", "Videoconsulto con medico generalista"]) await expect(page.getByRole("link", { name }).first()).toBeAttached();
    // Above the fold: almeno una porta d'ingresso ai servizi è visibile senza scorrere. 12/11/2026: su telefono la
    // prima è la prestazione in evidenza (la visita a domicilio), poi «Ho un referto».
    const first = isMobile ? page.locator("[data-in-evidenza]").getByRole("link").first() : page.locator("main").getByRole("link", { name: "Ho un referto" });
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
