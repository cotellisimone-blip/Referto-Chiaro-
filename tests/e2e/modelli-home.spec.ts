import { test, expect } from "@playwright/test";
import { expectAccessible } from "./_lib/a11y";

/** Modelli di home da approvare (13/11/2026): tutta l'offerta, accessibili, senza scroll di lato, non indicizzati. */
for (const m of ["a", "b", "c"]) {
  test(`modello di home ${m.toUpperCase()}: tutta l'offerta, accessibile, nessun overflow`, async ({ page }) => {
    await page.goto(`/modelli-home/${m}`);
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.getByRole("navigation", { name: "Modelli di home" }).getByRole("link", { name: new RegExp(`^${m.toUpperCase()} ·`) })).toHaveAttribute("aria-current", "page");
    for (const href of ["/referti", "/servizi/visita-a-domicilio", "/servizi/parla-con-un-medico", "/servizi/secondo-parere", "/punto-di-partenza", "/famiglia"])
      await expect(page.locator(`main a[href="${href}"]`).first()).toBeAttached();
    // Il piano Famiglia non è in primo piano: nessun prezzo del piano nei modelli.
    await expect(page.locator("main")).not.toContainText("l'anno");
    await expect(page.locator("main")).toContainText("112");
    expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    await expectAccessible(page);
  });
}
