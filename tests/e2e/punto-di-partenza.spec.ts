import { expect, test, type Page } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

/** Punto di Partenza (V3): percorso completo, privacy, accessibilità, funnel. */

async function axe(page: Page) {
  const r = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"]).analyze();
  expect(r.violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target.join(" ")).join(", ")}`)).toEqual([]);
}

async function noOverflow(page: Page) {
  expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBeLessThanOrEqual(0);
}

test("home: doppio ingresso, gratis e primo referto, senza rompere la V2", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("h1")).toHaveCount(1);
  const entries = page.getByRole("region", { name: "Da dove vuoi iniziare" });
  await expect(entries.getByRole("link", { name: /Parti dalla tua salute/ })).toHaveAttribute("href", "/punto-di-partenza");
  await expect(entries.getByRole("link", { name: /Rendilo chiaro/ })).toContainText("2,90");
  await expect(page.getByRole("heading", { name: "Parti gratis. Poi scegli tu fin dove arrivare." })).toBeVisible();
  await expect(page.locator("footer").getByRole("link", { name: "Punto di Partenza" })).toBeVisible();
  await noOverflow(page);
});

test("percorso completo: 5 passi, indietro senza perdere le risposte, scheda PDF, nessuna risposta al server", async ({ page }) => {
  const sent: string[] = [];
  const events: string[] = [];
  // Ogni richiesta non-GET passa di qui: il contatore anonimo viene letto e lasciato proseguire.
  await page.route("**/*", async (route) => {
    const r = route.request();
    if (r.method() !== "GET") {
      const body = r.postDataBuffer()?.toString("utf8") ?? "";
      sent.push(`${r.url()} ${body}`);
      if (r.url().includes("/api/v1/public/evento")) events.push((JSON.parse(body) as { event: string }).event);
    }
    await route.continue();
  });
  await page.goto("/punto-di-partenza");
  await expect(page.locator("h1")).toHaveCount(1);
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Conosci meglio la tua salute.");
  await expect(page.getByText("Informativo, non diagnostico. Nessun esame viene prescritto automaticamente.")).toBeVisible();

  await page.getByLabel("Prepararmi a parlarne con il medico").check();
  await page.getByRole("button", { name: "Avanti" }).click();
  await expect(page.locator('[aria-current="step"]')).toContainText("Cosa hai già");
  await page.getByLabel("Esami del sangue recenti").check();
  await page.getByLabel("Una misurazione recente della pressione").check();
  // Indietro e avanti: le risposte restano.
  await page.getByRole("button", { name: "Indietro" }).click();
  await expect(page.getByLabel("Prepararmi a parlarne con il medico")).toBeChecked();
  await page.getByRole("button", { name: "Avanti" }).click();
  await expect(page.getByLabel("Esami del sangue recenti")).toBeChecked();
  await page.getByRole("button", { name: "Avanti" }).click();

  await page.getByRole("group", { name: "Fascia d'età" }).getByLabel("50–64").check();
  await page.getByRole("group", { name: "Fumi?" }).getByLabel("Sì", { exact: true }).check();
  await page.getByRole("button", { name: "Avanti" }).click();

  await expect(page.getByRole("heading", { name: "Le 10 aree da conoscere" })).toBeVisible();
  const toggles = page.getByRole("button", { name: "Ho già informazioni recenti" });
  await expect(toggles).toHaveCount(10);
  await expect(toggles.first()).toHaveAttribute("aria-pressed", "true"); // pressione, da «Cosa hai già»
  await toggles.nth(2).focus();
  await page.keyboard.press("Enter");
  await expect(toggles.nth(2)).toHaveAttribute("aria-pressed", "true");
  if (test.info().project.name === "desktop") await axe(page);
  await page.getByRole("button", { name: "Crea la mia scheda" }).click();

  await expect(page.getByRole("heading", { name: "Il tuo Punto di Partenza è pronto." })).toBeVisible();
  await expect(page.getByText(/Completezza delle informazioni: \d+%/).first()).toBeVisible();
  await expect(page.getByText("Misura quanto è completa la mappa che hai costruito, non il tuo stato di salute.").first()).toBeVisible();
  await expect(page.getByText(/punteggio di salute|età biologica|sei a rischio|devi fare/i)).toHaveCount(0);
  await expect(page.getByRole("link", { name: /Rendi chiaro il primo referto — 2,90/ })).toBeVisible();
  await expect(page.getByRole("link", { name: /Parla con un medico — 69/ })).toBeVisible();
  await noOverflow(page);
  await axe(page);

  await page.getByLabel(/Note per te/).fill("Domanda sul colesterolo");
  const [dl] = await Promise.all([page.waitForEvent("download"), page.getByRole("button", { name: /Scarica la scheda/ }).click()]);
  expect(dl.suggestedFilename()).toBe("punto-di-partenza-cura-privata.pdf");

  // Privacy: al server arrivano solo nomi di passi; mai risposte, note o URL con dati.
  expect(page.url()).not.toMatch(/\?/);
  await page.waitForTimeout(300);
  for (const s of sent) {
    expect(s).toMatch(/\/api\/v1\/public\/evento/);
    expect(s).not.toMatch(/colesterolo|50–64|sangue|fumo/i);
  }
  for (const e of ["pdp-start", "pdp-step-2", "pdp-complete", "pdp-download"]) expect(events).toContain(e);
});

test("landing: nessun overflow a 390 px, accessibile, anche in tema scuro", async ({ page }) => {
  await page.goto("/punto-di-partenza");
  await noOverflow(page);
  await axe(page);
  await page.emulateMedia({ colorScheme: "dark" });
  await page.reload();
  await axe(page);
});

test("fase 3: la guida sta subito sotto la hero e la barra «Avanti» non copre mai la domanda", async ({ page }) => {
  await page.goto("/punto-di-partenza");
  const vh = page.viewportSize()?.height ?? 900;
  const top = await page.locator("#guida").evaluate((el) => el.getBoundingClientRect().top + window.scrollY);
  expect(top, "inizio della guida").toBeLessThan(vh * 1.25);
  // Le spiegazioni restano, sotto la guida.
  for (const h of ["Tre passaggi, una scheda.", "Dieci aree, una sola scheda.", "Più esami non significa più prevenzione."]) {
    const y = await page.getByRole("heading", { name: h }).evaluate((el) => el.getBoundingClientRect().top + window.scrollY);
    expect(y, h).toBeGreaterThan(top);
  }
  const hint = page.getByText("Una sola scelta: serve a dare un ordine alla scheda.");
  const next = page.getByRole("button", { name: "Avanti" });
  for (const offset of [0.95, 0.8, 0.6, 0.4, 0.15]) {
    await hint.evaluate((el, o) => window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - window.innerHeight * o), offset);
    const [a, b] = [await hint.boundingBox(), await next.boundingBox()];
    expect(b!.y, `pulsante sotto la domanda (offset ${offset})`).toBeGreaterThanOrEqual(a!.y + a!.height);
  }
});

test("ricerca interna: «check-up» trova Punto di Partenza", async ({ request }) => {
  const r = await request.get("/api/v1/public/ricerca");
  const { items } = (await r.json()) as { items: { href: string; aliases: string[] }[] };
  const pdp = items.find((i) => i.href === "/punto-di-partenza");
  expect(pdp?.aliases).toContain("check-up");
});
