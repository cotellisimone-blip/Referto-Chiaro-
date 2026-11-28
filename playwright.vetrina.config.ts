import { defineConfig, devices } from "@playwright/test";

/**
 * Ciclo 2, fase 1: e2e sul profilo vetrina (SITE_PROFILE=vetrina), quello che va online per primo.
 * Le pagine statiche leggono gli interruttori alla build, quindi la vetrina ha una build sua in .next-vetrina.
 * Avvio: `npm run test:e2e:vetrina` (compila e poi prova).
 */
const PORT = 3101;
const ENV = { SITE_PROFILE: "vetrina", DEMO_MODE: "true", NEXT_DIST_DIR: ".next-vetrina" };

export default defineConfig({
  testDir: "tests/e2e-vetrina",
  timeout: 30_000,
  fullyParallel: true,
  reporter: [["list"]],
  use: { baseURL: `http://localhost:${PORT}`, trace: "off" },
  webServer: {
    command: `rm -rf .data/e2e-vetrina && npx next build && npx next start -p ${PORT}`,
    env: { ...ENV, PGLITE_DATA_DIR: ".data/e2e-vetrina", COOKIE_INSECURE: "true", AUTH_RATE_LIMIT_PER_10MIN: "1000", WAITLIST_RATE_LIMIT_PER_10MIN: "1000", FUNNEL_COUNT_HEADLESS: "true" },
    url: `http://localhost:${PORT}`,
    reuseExistingServer: false,
    timeout: 400_000,
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
    { name: "mobile", use: { ...devices["Desktop Chrome"], viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 } },
  ],
});
