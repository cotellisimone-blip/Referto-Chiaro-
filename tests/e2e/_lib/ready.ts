import type { Page } from "@playwright/test";

/**
 * Apre una pagina e aspetta che React abbia collegato i comandi (`html[data-ready]`, impostato da TrackClicks).
 * La testata sta in un confine di Suspense e può idratarsi dopo: si aspetta anche `header[data-hydrated]`.
 * Senza questa attesa, su GitHub (macchine più lente) un clic sulla testata poteva arrivare prima e andare perso.
 */
export async function gotoReady(page: Page, url: string) {
  await page.goto(url);
  await page.locator("html[data-ready]").waitFor({ state: "attached" });
  await page.locator("header[data-hydrated]").first().waitFor({ state: "attached" });
}
