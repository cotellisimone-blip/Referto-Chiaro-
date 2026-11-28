import { describe, expect, it } from "vitest";
import { isAutomatedAgent } from "@/domain/metrics/bots";

const IPHONE = "Mozilla/5.0 (iPhone; CPU iPhone OS 18_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Mobile/15E148 Safari/604.1";
const ANDROID = "Mozilla/5.0 (Linux; Android 14; SM-A546B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36";
const FB_APP = "Mozilla/5.0 (Linux; Android 14; SM-A546B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/480.0.0.0;]";

describe("isAutomatedAgent", () => {
  it("le persone contano, anche dal browser interno di Facebook", () => {
    for (const ua of [IPHONE, ANDROID, FB_APP]) expect(isAutomatedAgent(ua)).toBe(false);
  });
  it("robot, anteprime dei link e strumenti non contano", () => {
    for (const ua of [
      "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
      "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)",
      "WhatsApp/2.24.1 A",
      "TelegramBot (like TwitterBot)",
      "Mozilla/5.0 (Linux; Android 11; moto g power (2022)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Mobile Safari/537.36 Chrome-Lighthouse",
      "curl/8.5.0",
      "python-requests/2.32",
      "",
      null,
    ]) expect(isAutomatedAgent(ua), String(ua)).toBe(true);
  });
  it("i browser automatici non contano, salvo nei test del progetto", () => {
    const ua = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/131.0.0.0 Safari/537.36";
    expect(isAutomatedAgent(ua)).toBe(true);
    expect(isAutomatedAgent(ua, { FUNNEL_COUNT_HEADLESS: "true" })).toBe(false);
  });
});
