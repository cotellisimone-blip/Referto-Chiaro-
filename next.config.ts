import type { NextConfig } from "next";
import { CON_UN_MEDICO_HREF, DOCTOR_PATHS } from "./src/lib/medici";

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
  // Ciclo 2: una seconda build (profilo vetrina) può vivere accanto a quella standard, per i test e2e della vetrina.
  ...(process.env.NEXT_DIST_DIR ? { distDir: process.env.NEXT_DIST_DIR } : {}),
  cacheComponents: true,
  // Driver del database e PDF: restano moduli esterni, non vengono impacchettati nel bundle server.
  serverExternalPackages: ["@electric-sql/pglite", "pg", "pdf-lib", "@pdf-lib/fontkit", "unpdf"],
  // Lo schema SQL viene letto a runtime (migrazione idempotente): va incluso nelle funzioni serverless.
  outputFileTracingIncludes: { "/**": ["./src/db/schema.sql", "./src/domain/reporting/fonts/**"] },
  partialPrefetching: true,
  // 13/11/2026: l'interruttore dei servizi con un medico arriva anche al browser (vedi src/lib/medici.ts).
  env: { NEXT_PUBLIC_ENABLE_MEDICI: process.env.ENABLE_MEDICI === "true" ? "true" : "false" },
  /** Vecchi indirizzi di Referto Chiaro → nuova mappa del sito Cura Privata (redirect permanenti interni). */
  async redirects() {
    const moved: [string, string][] = [
      ["/esempio", "/referti/esempio"],
      ["/secondo-parere", "/servizi/secondo-parere"],
      ["/servizi-prezzi", "/servizi"],
      ["/servizi/visite-e-consulti", "/servizi/parla-con-un-medico"],
      ["/videoconsulto", "/servizi/parla-con-un-medico"],
      ["/faq", "/domande-frequenti"],
      ["/sicurezza", "/sicurezza-e-privacy"],
      ["/privacy", "/privacy-policy"],
      ["/cookie", "/cookie-policy"],
      ["/referti/come-funziona", "/come-funziona"],
      // 13/11/2026: l'archivio «in preparazione» è diventato Famiglia e salute nel tempo.
      ["/servizi/archivio", "/famiglia"],
    ];
    return [
      ...moved.map(([source, destination]) => ({ source, destination, permanent: true })),
      // 14/11/2026: i tre modelli di home del 13/11 erano bozze da scegliere; scelta fatta, portano alla home.
      { source: "/modelli-home", destination: "/", permanent: false },
      { source: "/modelli-home/:path*", destination: "/", permanent: false },
      { source: "/area", destination: "/area-personale", permanent: true },
      { source: "/area/:path*", destination: "/area-personale/:path*", permanent: true },
      // 13/11/2026: con i medici spenti (ENABLE_MEDICI diverso da "true") le loro pagine portano al blocco «Presto anche
      // con un medico». Redirect temporanei: riaccendendo l'interruttore tornano le pagine di prima.
      ...(process.env.ENABLE_MEDICI === "true"
        ? [{ source: CON_UN_MEDICO_HREF, destination: "/servizi", permanent: false }]
        : DOCTOR_PATHS.flatMap((p) => [
            { source: p, destination: CON_UN_MEDICO_HREF, permanent: false },
            { source: `${p}/:path*`, destination: CON_UN_MEDICO_HREF, permanent: false },
          ])),
    ];
  },
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
