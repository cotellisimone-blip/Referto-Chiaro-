import { expect, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

export const AXE_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];

/** Aspetta che le animazioni d'ingresso finiscano (axe misura i colori a metà dissolvenza), poi controlla con axe. */
export async function expectAccessible(page: Page) {
  await page.evaluate(() =>
    Promise.all(
      document
        .getAnimations()
        .filter((a) => Number.isFinite(a.effect?.getComputedTiming().endTime ?? Infinity))
        // 19/11/2026: il richiamo del pulsante della luce (un alone attorno al pulsante, circa 12 s alle prime visite) non
        // cambia nessun colore che axe misura: aspettarlo rallentava ogni controllo di 12 s.
        .filter((a) => (a as CSSAnimation).animationName !== "luce-richiamo")
        .map((a) => a.finished.catch(() => undefined)),
    ),
  );
  const axe = await new AxeBuilder({ page }).withTags(AXE_TAGS).analyze();
  expect(axe.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`)).toEqual([]);
}
