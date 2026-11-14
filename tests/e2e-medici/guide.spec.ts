import { test, expect } from "@playwright/test";
import { gotoReady } from "../e2e/_lib/ready";

/** Con i medici accesi il menu ha sette voci e la home apre con l'annuncio della prestazione in evidenza: devono stare nello schermo. */
test.describe("testata e annuncio con i medici accesi", () => {
  test("navigazione: i tre servizi nel menu, header senza a capo né overflow a 1024/1280/1440, anche con testo grande", async ({ page, isMobile }) => {
    test.skip(isMobile, "solo desktop");
    for (const width of [1024, 1280, 1440]) {
      await page.setViewportSize({ width, height: 800 });
      await gotoReady(page, "/");
      await expect(page.getByRole("navigation", { name: /principale/i }).getByRole("link", { name: "Capisci il referto" })).toBeVisible();
      for (const large of [false, true]) {
        if (large) await page.getByRole("button", { name: "Testo più grande" }).click();
        const box = await page.locator("header").first().boundingBox();
        expect(box?.height ?? 0, `${width}px ${large ? "testo grande" : ""}`).toBeLessThan(100);
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
        expect(overflow, `${width}px ${large ? "testo grande" : ""}`).toBeLessThanOrEqual(0);
      }
      await page.getByRole("button", { name: "Testo più grande" }).click();
    }
  });

  test("telefono con testo grande: testata e annuncio dentro lo schermo a 320/360/375/390, «aA» nel menu con la sua etichetta", async ({ page, isMobile }) => {
    test.skip(!isMobile, "solo telefono");
    await page.addInitScript(() => {
      try {
        localStorage.setItem("rc-size", "large");
      } catch {}
    });
    for (const width of [320, 360, 375, 390]) {
      await page.setViewportSize({ width, height: 800 });
      await gotoReady(page, "/");
      await expect(page.locator("html")).toHaveAttribute("data-size", "large");
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow, `${width}px: niente scorre di lato`).toBeLessThanOrEqual(0);
      // L'annuncio in testa alla home: titolo intero, su una o due righe, dentro il margine.
      const title = await page.locator("[data-in-evidenza] .announce-title").boundingBox();
      expect((title?.x ?? 0) + (title?.width ?? width), `${width}px: titolo dell'annuncio dentro lo schermo`).toBeLessThanOrEqual(width - 16);
      expect(title?.height ?? 999, `${width}px: titolo dell'annuncio su una o due righe`).toBeLessThan(70);
      // Il pulsante del menu resta dentro il margine, e nel menu «Testo più grande» è acceso e si legge.
      const menu = page.getByRole("button", { name: "Apri il menu" });
      const box = await menu.boundingBox();
      expect((box?.x ?? 0) + (box?.width ?? width), `${width}px: pulsante del menu dentro il margine`).toBeLessThanOrEqual(width - 12);
      await menu.click();
      const nav = page.getByRole("navigation", { name: "Menu mobile" });
      const size = nav.getByRole("button", { name: "Testo più grande" });
      await expect(size).toBeVisible();
      await expect(size).toHaveAttribute("aria-pressed", "true");
      await expect(nav.getByText("Testo più grande", { exact: true }).last()).toBeVisible();
    }
  });
});
