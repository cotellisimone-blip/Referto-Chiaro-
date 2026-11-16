import { defineConfig, devices } from "@playwright/test";

/**
 * 14/11/2026: il profilo vetrina con i servizi con un medico accesi (SITE_PROFILE=vetrina, ENABLE_MEDICI=true).
 * Il sito parte senza medici, anche in vetrina: le prove «di lancio» della vetrina stanno in tests/e2e-vetrina. Qui restano
 * provate, in una build a parte (.next-vetrina-medici), le pagine dei medici con la loro lista d'attesa e la prova
 * nell'account demo, pronte per quando l'interruttore si riaccende.
 * Avvio: `npm run test:e2e:vetrina:medici` (compila e poi prova).
 */
const PORT = 3103;
const ENV = { SITE_PROFILE: "vetrina", ENABLE_MEDICI: "true", DEMO_MODE: "true", NEXT_DIST_DIR: ".next-vetrina-medici" };

export default defineConfig({
  testDir: "tests/e2e-vetrina-medici",
  timeout: 30_000,
  fullyParallel: true,
  reporter: [["list"]],
  use: { baseURL: `http://localhost:${PORT}`, trace: "off" },
  webServer: {
    command: `rm -rf .data/e2e-vetrina-medici && npx next build && npx next start -p ${PORT}`,
    env: { ...ENV, PGLITE_DATA_DIR: ".data/e2e-vetrina-medici", COOKIE_INSECURE: "true", AUTH_RATE_LIMIT_PER_10MIN: "1000", WAITLIST_RATE_LIMIT_PER_10MIN: "1000", FUNNEL_COUNT_HEADLESS: "true" },
    url: `http://localhost:${PORT}`,
    reuseExistingServer: false,
    timeout: 400_000,
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
    { name: "mobile", use: { ...devices["Desktop Chrome"], viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 } },
  ],
});
