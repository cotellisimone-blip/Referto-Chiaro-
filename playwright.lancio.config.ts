import { defineConfig, devices } from "@playwright/test";

/**
 * 27/11/2026 (piano «livello successivo», fase 0): lo stato VERO di lancio, deciso da Simone il 19 e il 22/11.
 * Medici accesi (videoconsulto), secondo parere «In arrivo» e visita a domicilio spenta. Le altre configurazioni provano
 * il sito senza medici (playwright.config.ts) o con tutto acceso (playwright.medici.config.ts): questa combinazione
 * non era provata nel browser, ed è quella che va online. Build a parte in .next-lancio.
 * Avvio: `npm run test:e2e:lancio` (compila e poi prova).
 */
const PORT = 3104;
const ENV = { ENABLE_MEDICI: "true", ENABLE_SECONDO_PARERE: "false", ENABLE_DOMICILIO: "false", DEMO_MODE: "true", NEXT_DIST_DIR: ".next-lancio" };

export default defineConfig({
  testDir: "tests/e2e-lancio",
  timeout: 30_000,
  fullyParallel: true,
  reporter: [["list"]],
  use: { baseURL: `http://localhost:${PORT}`, trace: "off" },
  webServer: {
    command: `rm -rf .data/e2e-lancio && npx next build && npx next start -p ${PORT}`,
    env: { ...ENV, PGLITE_DATA_DIR: ".data/e2e-lancio", COOKIE_INSECURE: "true", AUTH_RATE_LIMIT_PER_10MIN: "1000", WAITLIST_RATE_LIMIT_PER_10MIN: "1000", FUNNEL_COUNT_HEADLESS: "true" },
    url: `http://localhost:${PORT}`,
    reuseExistingServer: false,
    timeout: 400_000,
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
    { name: "mobile", use: { ...devices["Desktop Chrome"], viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 } },
  ],
});
