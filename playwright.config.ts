import { defineConfig, devices } from "@playwright/test";

const PORT = 3100;

export default defineConfig({
  testDir: "tests/e2e",
  timeout: 30_000,
  fullyParallel: true,
  reporter: [["list"]],
  use: { baseURL: `http://localhost:${PORT}`, trace: "off" },
  webServer: {
    command: `rm -rf .data/e2e && npm run start -- -p ${PORT}`,
    env: { DEMO_MODE: "true", PGLITE_DATA_DIR: ".data/e2e", COOKIE_INSECURE: "true", AUTH_RATE_LIMIT_PER_10MIN: "1000", WAITLIST_RATE_LIMIT_PER_10MIN: "1000", FUNNEL_COUNT_HEADLESS: "true", ...(process.env.E2E_DATABASE_URL ? { DATABASE_URL: process.env.E2E_DATABASE_URL, DB_RUNTIME_MIGRATIONS: "false" } : {}) },
    url: `http://localhost:${PORT}`,
    reuseExistingServer: true,
    timeout: 60_000,
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
    { name: "mobile", use: { ...devices["Desktop Chrome"], viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 } },
  ],
});
