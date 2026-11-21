import { test, expect, type Page } from "@playwright/test";
import { gotoReady } from "./_lib/ready";

/**
 * 18/11/2026, secondo giro di «20 interventi»: le cose che si vedono solo nel browser. Il resto sta in
 * tests/e2e/sito-intero.spec.ts (tutte le pagine) e tests/unit/secondo-giro.test.ts.
 */

async function demo(page: Page) {
  await gotoReady(page, "/accedi");
  await page.getByRole("button", { name: "Entra con l'account demo" }).click();
  await page.waitForURL(/area-personale/);
}

test("punto 1 · la ricerca capisce «glicemia alta» e un errore di battitura, e lo dice", async ({ page, isMobile }) => {
  await gotoReady(page, "/");
  await page.getByRole("button", { name: isMobile ? "Cerca nel sito" : "Apri la ricerca" }).first().click();
  const campo = page.getByRole("dialog").locator("input[type=search]");
  await campo.fill("glicemia alta");
  await expect(page.getByTestId("search-hint")).toBeVisible();
  await expect(page.locator('a[data-result][href="/guide/glicemia"]').first()).toBeVisible();
  await campo.fill("emocrmo");
  await expect(page.locator('a[data-result][href^="/guide/emocromo"]').first()).toBeVisible();
  await expect(page.getByTestId("search-hint")).toContainText("emocromo");
  // Una ricerca fuori tema non trova risultati a caso: propone le tre sezioni.
  await campo.fill("dolore al ginocchio");
  await expect(page.getByTestId("search-sezioni")).toBeVisible();
  // 21/11/2026: «mal di testa» ora porta ai diari della salute.
  await campo.fill("mal di testa");
  await expect(page.locator('a[data-result][href="/diari"]').first()).toBeVisible();
});

test("punto 2 · chi arriva all'accesso da «Carica un referto» legge perché è lì", async ({ page }) => {
  await gotoReady(page, "/accedi?next=/area-personale/nuovo");
  await expect(page.getByRole("heading", { level: 1 })).toHaveText(/Per caricare il referto, entra/);
  await gotoReady(page, "/accedi");
  await expect(page.getByRole("heading", { level: 1 })).not.toHaveText(/Per caricare il referto/);
});

test("punto 3 · su telefono nessun testo sotto i 14 px in home e nelle tre sezioni", async ({ page, isMobile }) => {
  test.skip(!isMobile, "misura su telefono");
  for (const path of ["/", "/prevenzione", "/lettura-referti", "/medici", "/prezzi", "/guide/emocromo", "/glossario/ferritina"]) {
    await gotoReady(page, path);
    const piccoli = await page.evaluate(() => {
      const out: string[] = [];
      const tw = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      while (tw.nextNode()) {
        const t = (tw.currentNode.textContent ?? "").trim();
        const el = tw.currentNode.parentElement;
        if (!t || !el || el.closest('[aria-hidden="true"],.sr-only,script,style,noscript')) continue;
        if (el.closest("details:not([open])") && !el.closest("summary")) continue;
        const cs = getComputedStyle(el);
        const r = el.getBoundingClientRect();
        if (r.width < 2 || r.height < 2 || cs.visibility === "hidden" || cs.display === "none") continue;
        if (parseFloat(cs.fontSize) < 13.95) out.push(`${cs.fontSize} «${t.slice(0, 30)}»`);
      }
      return out;
    });
    expect(piccoli, path).toEqual([]);
  }
});

test("punto 3 · i collegamenti di testo delle sezioni sono alti almeno 44 px", async ({ page, isMobile }) => {
  test.skip(!isMobile, "misura su telefono");
  for (const path of ["/", "/prevenzione", "/lettura-referti"]) {
    await gotoReady(page, path);
    const bassi = await page.locator("main a.tm-tlink, main a.ds-crumb").evaluateAll((els) => els.filter((e) => e.getBoundingClientRect().height > 0 && e.getBoundingClientRect().height < 43.5).map((e) => `${Math.round(e.getBoundingClientRect().height)} «${e.textContent?.trim().slice(0, 30)}»`));
    expect(bassi, path).toEqual([]);
  }
});

test("punto 4 · area personale da telefono: una barra sola in alto, le voci dell'area nel menu, piè di pagina corto", async ({ page, isMobile }) => {
  test.skip(!isMobile, "misura su telefono");
  await demo(page);
  await gotoReady(page, "/area-personale");
  // In cima c'è solo la testata del sito (con la fascia «versione dimostrativa»): niente seconda e terza barra.
  const h1 = (await page.getByRole("heading", { level: 1 }).boundingBox())!;
  expect(h1.y).toBeLessThan(200);
  await expect(page.locator('nav[aria-label="Area personale"]:visible')).toHaveCount(1);
  await page.getByRole("button", { name: /menu/i }).first().click();
  const area = page.getByTestId("menu-area");
  await expect(area).toBeVisible();
  await expect(area.getByRole("link", { name: /Impostazioni/ })).toBeVisible();
  await expect(area.getByRole("button", { name: "Esci" })).toBeVisible();
  await page.keyboard.press("Escape");
  const footer = (await page.locator("footer.site-footer").boundingBox())!;
  expect(footer.height, "piè di pagina dell'area").toBeLessThan(420);
});

test("punto 5 · le fotografie si scaricano solo dove si vedono", async ({ page, request }) => {
  const foto: string[] = [];
  page.on("request", (r) => { if (/\/media\/.*\.(avif|webp|jpe?g)/.test(r.url()) || /_next\/image/.test(r.url())) foto.push(r.url()); });
  await page.goto("/prezzi", { waitUntil: "networkidle" });
  await page.waitForTimeout(600);
  expect(foto, "fotografie scaricate dalla pagina Prezzi").toEqual([]);
  // I dati che il browser scarica in anticipo per home e sezioni non chiedono più di precaricare le foto.
  for (const path of ["/", "/prevenzione", "/lettura-referti"]) {
    const rsc = await (await request.get(path, { headers: { RSC: "1", "Next-Router-Prefetch": "1" } })).text();
    expect(/:HL\[\\?"\/media\//.test(rsc), `${path}: precaricamento di una foto nei dati anticipati`).toBe(false);
  }
});

test("punto 9 · piè di pagina su telefono: meno di una schermata, con le colonne che si aprono al tocco", async ({ page, isMobile }) => {
  test.skip(!isMobile, "misura su telefono");
  await gotoReady(page, "/glossario/ferritina");
  const footer = page.locator("footer.site-footer");
  expect((await footer.boundingBox())!.height).toBeLessThan(844 * 0.9);
  const gratis = footer.locator("details", { hasText: "Gratis" });
  await gratis.locator("summary").click();
  await expect(gratis.getByRole("link", { name: "Tutti gli strumenti gratuiti" })).toBeVisible();
});

test("punto 10 · Punto di Partenza e voci di glossario portano la barra 1 → 2 → 3 della loro sezione", async ({ page }) => {
  await page.goto("/punto-di-partenza");
  await expect(page.locator(".ds-path [aria-current]").first()).toContainText("Prevenzione");
  await expect(page.locator(".ds-sec-tag").first()).toContainText("Prevenzione");
  await page.goto("/glossario/ferritina");
  await expect(page.locator(".ds-path [aria-current]").first()).toContainText("Lettura referti");
});

test("punti 11 e 13 · Prevenzione e glossario più corti su telefono", async ({ page, isMobile }) => {
  test.skip(!isMobile, "misura su telefono");
  await gotoReady(page, "/prevenzione");
  expect(await page.evaluate(() => document.documentElement.scrollHeight / innerHeight), "schermate di Prevenzione").toBeLessThan(8);
  await gotoReady(page, "/glossario");
  expect(await page.evaluate(() => document.documentElement.scrollHeight / innerHeight), "schermate del glossario").toBeLessThan(12);
  // Una lettera si apre al tocco e mostra le sue parole.
  const lettera = page.locator(".gl-head-btn").nth(3);
  await lettera.scrollIntoViewIfNeeded();
  if ((await lettera.getAttribute("aria-expanded")) !== "true") await lettera.click();
  await expect(lettera).toHaveAttribute("aria-expanded", "true");
});

test("punto 12 · nel «prima e dopo» da telefono «Trascinami» non copre le righe del foglio", async ({ page, isMobile }) => {
  test.skip(!isMobile, "misura su telefono");
  await gotoReady(page, "/lettura-referti");
  const frame = page.locator(".ba-frame");
  await frame.scrollIntoViewIfNeeded();
  const riga = (await frame.getByText("Colesterolo LDL").last().boundingBox())!;
  const scritta = await page.locator(".ba-grip").evaluate((g) => {
    const tip = [...g.querySelectorAll("*")].find((e) => /Trascina/i.test(e.textContent ?? "") && e.children.length === 0) ?? g;
    const r = tip.getBoundingClientRect();
    return { top: r.top, bottom: r.bottom };
  });
  expect(scritta.bottom <= riga.y + 1 || scritta.top >= riga.y + riga.height - 1, "la scritta non sta sulla riga del Colesterolo LDL").toBe(true);
});

test("punto 14 · la guida stampata è solo la guida: niente menu, niente pulsanti, con indirizzo e data in fondo", async ({ page, isMobile, browserName }) => {
  test.skip(isMobile || browserName !== "chromium", "stampa provata su computer");
  await gotoReady(page, "/guide/emocromo");
  await page.emulateMedia({ media: "print" });
  await expect(page.locator("header").first()).toBeHidden();
  await expect(page.locator("footer.site-footer")).toBeHidden();
  await expect(page.locator(".article-body aside").first()).toBeHidden();
  await expect(page.locator(".print-foot")).toBeVisible();
  const pdf = await page.pdf({ format: "A4" });
  const pagine = (pdf.toString("latin1").match(/\/Type\s*\/Page[^s]/g) ?? []).length;
  expect(pagine, "pagine A4 della guida").toBeLessThanOrEqual(3);
});

test("punto 15 · «Strumenti gratuiti» si raggiunge dal menu del telefono, dal piè di pagina e dalla Prevenzione", async ({ page, isMobile }) => {
  await gotoReady(page, "/prevenzione");
  await expect(page.locator('main a[href="/strumenti"]').first()).toBeVisible();
  await expect(page.locator('footer.site-footer a[href="/strumenti"]').first()).toBeAttached();
  if (isMobile) {
    await page.getByRole("button", { name: /menu/i }).first().click();
    await page.getByRole("navigation", { name: "Menu mobile" }).getByRole("link", { name: "Strumenti gratuiti" }).click();
    await expect(page).toHaveURL(/\/strumenti$/);
  }
});

test("punto 16 · guide, glossario e integratori hanno la loro immagine di condivisione", async ({ page, request }) => {
  for (const path of ["/guide/emocromo", "/glossario/ferritina", "/integratori/vitamina-d", "/guide/fotografare-un-referto"]) {
    await page.goto(path);
    const og = await page.locator('meta[property="og:image"]').first().getAttribute("content");
    expect(og, path).toBeTruthy();
    const res = await request.get(new URL(og!).pathname + new URL(og!).search);
    expect(res.status(), og!).toBe(200);
    expect(res.headers()["content-type"]).toContain("image/png");
  }
});

test("punto 17 · dati strutturati: prezzi veri in Prezzi, domande in Domande frequenti, sito in home", async ({ request }) => {
  const ld = async (path: string) => {
    const html = await (await request.get(path)).text();
    return [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].flatMap((m) => JSON.parse(m[1]) as unknown[]).flat() as Record<string, unknown>[];
  };
  expect((await ld("/")).some((d) => d["@type"] === "WebSite")).toBe(true);
  const prezzi = await ld("/prezzi");
  const svc = prezzi.find((d) => d["@type"] === "Service") as { offers: { price: string; priceCurrency: string }[] } | undefined;
  expect(svc?.offers.map((o) => o.price)).toEqual(["2.90", "7.90"]);
  expect(svc?.offers.every((o) => o.priceCurrency === "EUR")).toBe(true);
  const faq = (await ld("/domande-frequenti")).find((d) => d["@type"] === "FAQPage") as { mainEntity: unknown[] } | undefined;
  expect(faq?.mainEntity.length).toBeGreaterThan(5);
  // Nessuna recensione e nessun voto dichiarati ai motori.
  for (const path of ["/", "/prezzi", "/lettura-referti"]) expect(JSON.stringify(await ld(path))).not.toMatch(/aggregateRating|"review"/i);
});

test("punto 18 · le cinque guide pratiche hanno titoli loro e l'avviso da guida pratica", async ({ page }) => {
  for (const slug of ["copia-della-cartella-clinica", "referti-online-e-per-email", "fotografare-un-referto", "conservare-i-referti", "leggere-la-ricetta-classi-di-priorita"]) {
    await page.goto(`/guide/${slug}`);
    await expect(page.getByRole("heading", { level: 2, name: "Come si fa" })).toBeVisible();
    await expect(page.getByText("Guida pratica, senza indicazioni mediche")).toBeVisible();
    await expect(page.getByText("Bozza in attesa di revisione medica")).toHaveCount(0);
  }
});

test("punto 19 · il sito si può aggiungere alla schermata Home di Android", async ({ page, request }) => {
  await page.goto("/");
  const href = await page.locator('link[rel="manifest"]').getAttribute("href");
  expect(href).toBeTruthy();
  const m = (await (await request.get(href!)).json()) as { name: string; display: string; start_url: string; icons: { src: string; sizes: string; purpose?: string }[] };
  expect(m.name).toBe("Cura Privata");
  expect(m.display).toBe("standalone");
  expect(m.icons.some((i) => i.sizes === "512x512" && i.purpose === "maskable")).toBe(true);
  for (const i of m.icons) expect((await request.get(i.src)).status(), i.src).toBe(200);
});
