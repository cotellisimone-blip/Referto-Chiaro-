import type { NextConfig } from "next";

/**
 * Intestazioni di sicurezza su tutte le rotte.
 *
 * Nota su `script-src 'unsafe-inline'`: le pagine sono statiche (Cache Components) e non possono
 * usare nonce per richiesta; Next.js inietta script inline per l'idratazione. Finché non si passa
 * a un rendering dinamico con nonce o a hash degli script, l'eccezione resta: è tracciata in
 * docs/PRODUCTION_GATES.md.
 */
const CSP = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self' data:",
  "connect-src 'self' https://api.stripe.com",
  "frame-src https://checkout.stripe.com https://js.stripe.com",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self' https://checkout.stripe.com",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const SECURITY_HEADERS = [
  { key: "Content-Security-Policy", value: CSP },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: 'camera=(), microphone=(), geolocation=(), payment=(self "https://checkout.stripe.com"), browsing-topics=()' },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  // Driver del database e PDF: restano moduli esterni, non vengono impacchettati nel bundle server.
  serverExternalPackages: ["@electric-sql/pglite", "pg", "pdf-lib", "@pdf-lib/fontkit"],
  partialPrefetching: true,
  async headers() {
    return [{ source: "/(.*)", headers: SECURITY_HEADERS }];
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
