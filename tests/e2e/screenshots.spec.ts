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
] as const;

test.describe("screenshots", () => {
  test.skip(!process.env.SCREENSHOTS, "solo con SCREENSHOTS=1");
  for (const [name, path] of SHOTS) {
    test(name, async ({ page }, info) => {
      await page.goto(path);
      await page.screenshot({ path: `docs/screenshots/${info.project.name}/${name}.png`, fullPage: true });
    });
  }
  test("demo-flusso", async ({ page }, info) => {
    const dir = `docs/screenshots/${info.project.name}`;
    await page.goto("/esempio");
    await page.screenshot({ path: `${dir}/demo-1-documento.png`, fullPage: true });
    await page.getByRole("button", { name: "Controlla i valori estratti" }).click();
    await page.getByRole("button", { name: "Conferma tutti i valori leggibili" }).click();
    await page.screenshot({ path: `${dir}/demo-2-controllo-valori.png`, fullPage: true });
    await page.getByRole("button", { name: "Genera la spiegazione" }).click();
    await page.getByRole("list", { name: "Spiegazione dei valori" }).waitFor();
    await page.screenshot({ path: `${dir}/demo-3-report.png`, fullPage: true });
  });
});
