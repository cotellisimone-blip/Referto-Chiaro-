import { test, expect } from "@playwright/test";
import { PAGINE_CON_MEDICI, provePagine } from "../e2e/_lib/pagine";

/** Con i medici accesi (ENABLE_MEDICI=true): tutte le pagine pubbliche, comprese quelle dei tre servizi con un medico. */

provePagine(PAGINE_CON_MEDICI);

test.describe("Cura Privata: mappa, stati e prezzi", () => {
  test("listino di riferimento: gli stessi prezzi ovunque, con la nota, da un'unica fonte", async ({ page }) => {
    // Listino 12/11/2026: videoconsulto 69 €, secondo parere 149 € fisso, domicilio 149 €.
    for (const [path, expected] of [["/", ["2,90", "7,90", "149", "69"]], ["/prezzi", ["2,90", "7,90", "149", "69"]], ["/lettura-referti", ["2,90", "7,90"]], ["/servizi/secondo-parere", ["149"]], ["/servizi/parla-con-un-medico", ["69"]], ["/servizi/visita-a-domicilio", ["149"]]] as const) {
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
    // 15/11/2026 sera: tre sezioni; il titolo le dice, le tre porte subito sotto.
    // 19/11/2026, home «chiara e scura»: il titolo è la promessa, la frase dei tre servizi resta nel piè di pagina.
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(/La tua salute,\s*tutta in una pagina\./);
    await expect(page.locator("footer").getByText("Conosciti. Capisci. Prenditi cura di te.")).toBeVisible();
    // Nessun «.it» accanto al logo finché il sito non gira su un dominio vero (PUBLIC_BASE_URL).
    await expect(page.locator("footer").getByText(".it", { exact: true })).toHaveCount(0);
    const menu = (await page.locator("header").getByRole("link").allInnerTexts()).map((t) => t.trim());
    // 22/11/2026: la testata mostra i cinque passi del percorso, in ordine.
    const voci = menu.map((t) => t.replace(/\s+/g, " "));
    const order = ["Passo 1: Inizia", "Passo 2: Esami", "Passo 3: Referti", "Passo 4: Medico", "Passo 5: Cura di te"].map((n) => voci.findIndex((v) => v.includes(n)));
    if (!isMobile) {
      expect(order.every((i) => i >= 0)).toBe(true);
      expect(order).toEqual([...order].sort((a, b) => a - b));
    }
    await expect(page.locator('main a[href="/lettura-referti"]').first()).toBeAttached();
    // Su telefono stanno nelle colonne del piè di pagina che si aprono al tocco: si controlla il collegamento, non la voce in vista.
    // 22/11/2026: nel piè di pagina il medico è il passo 4 del percorso (/medici); il secondo parere è nel riquadro del medico,
    // «Richiedi» quando è acceso (qui), «Avvisami» verso la sua pagina quando è in arrivo.
    await expect(page.locator('a[href="/medici"]').first()).toBeAttached();
    await expect(page.locator("#medico").getByRole("link", { name: "Richiedi il secondo parere" })).toHaveAttribute("href", "/richiedi/secondo-parere");
    // Above the fold: almeno una porta d'ingresso ai servizi è visibile senza scorrere. 12/11/2026: su telefono la
    // prima è la prestazione in evidenza (la visita a domicilio), poi «Ho un referto».
    const first = page.getByRole("navigation", { name: "Il percorso, in cinque passi" });
    const box = await first.boundingBox();
    expect((box?.y ?? 9999) + (box?.height ?? 0)).toBeLessThan(isMobile ? 844 : 900);
    await expect(page.getByText("Versione dimostrativa", { exact: false }).first()).toBeVisible();
  });

  test("nessun medico, recensione o metrica inventata nelle pagine dei servizi", async ({ page }) => {
    // 19/11/2026: i medici sono veri (Sara, Elena e Riccardo); finché Simone non li scrive, titolo, cognome e Ordine
    // restano «da completare», mai inventati. Nessun nome di medico dimostrativo nelle pagine pubbliche.
    await page.goto("/medici");
    for (const card of await page.locator("#i-medici > li").all()) await expect(card).toContainText("da completare");
    await expect(page.locator("main")).not.toContainText(/\b(?:Bianchi|Ferri|Conti)\b|persona inventata/);
    for (const path of ["/prezzi", "/servizi/secondo-parere", "/servizi/parla-con-un-medico", "/lettura-referti"]) {
      await page.goto(path);
      const txt = (await page.locator("main").innerText()).toLowerCase();
      for (const bad of ["dott. ", "dr. ", "iscrizione albo: ", "recensioni", "stelle", "pazienti soddisfatti", "professionisti qualificati", "medici qualificati"]) expect(txt, `${path}: ${bad}`).not.toContain(bad);
    }
  });
});
