import { test, expect } from "@playwright/test";

const EXPECTED: Record<string, string> = {
  "strict-transport-security": "max-age=63072000; includeSubDomains; preload",
  "x-content-type-options": "nosniff",
  "referrer-policy": "strict-origin-when-cross-origin",
  "x-frame-options": "DENY",
  "permissions-policy": 'camera=(), microphone=(), geolocation=(), payment=(self "https://checkout.stripe.com"), browsing-topics=()',
  "cross-origin-opener-policy": "same-origin",
};

for (const path of ["/", "/api/v1/public/config"]) {
  test(`intestazioni di sicurezza su ${path}`, async ({ request }) => {
    const res = await request.get(path);
    expect(res.status()).toBe(200);
    const h = res.headers();
    for (const [k, v] of Object.entries(EXPECTED)) expect(h[k], k).toBe(v);
    const csp = h["content-security-policy"];
    expect(csp).toBeTruthy();
    for (const d of ["default-src 'self'", "object-src 'none'", "base-uri 'self'", "frame-ancestors 'none'", "form-action 'self' https://checkout.stripe.com", "connect-src 'self' https://api.stripe.com", "frame-src https://checkout.stripe.com https://js.stripe.com", "upgrade-insecure-requests"]) {
      expect(csp, d).toContain(d);
    }
  });
}
