import { defineConfig, devices } from "@playwright/test";

/**
 * 14/11/2026: e2e con i servizi con un medico ACCESI (ENABLE_MEDICI=true, vedi src/lib/medici.ts).
 * Il sito parte senza medici: le prove in tests/e2e descrivono quello stato. Qui restano provati domicilio,
 * videoconsulto, secondo parere e portale medico, così il giorno in cui si riaccendono si sa già che funzionano.
 * Le pagine statiche leggono l'interruttore alla build, quindi questo stato ha una build sua in .next-medici.
 * Avvio: `npm run test:e2e:medici` (compila e poi prova).
 */
const PORT = 3102;
const ENV = { ENABLE_MEDICI: "true", DEMO_MODE: "true", NEXT_DIST_DIR: ".next-medici" };

export default defineConfig({
  testDir: "tests/e2e-medici",
  timeout: 30_000,
  fullyParallel: true,
  reporter: [["list"]],
  use: { baseURL: `http://localhost:${PORT}`, trace: "off" },
  webServer: {
    command: `rm -rf .data/e2e-medici && npx next build && npx next start -p ${PORT}`,
    env: { ...ENV, PGLITE_DATA_DIR: ".data/e2e-medici", COOKIE_INSECURE: "true", AUTH_RATE_LIMIT_PER_10MIN: "1000", WAITLIST_RATE_LIMIT_PER_10MIN: "1000", FUNNEL_COUNT_HEADLESS: "true" },
    url: `http://localhost:${PORT}`,
    reuseExistingServer: false,
    timeout: 400_000,
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
    { name: "mobile", use: { ...devices["Desktop Chrome"], viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 } },
  ],
});
