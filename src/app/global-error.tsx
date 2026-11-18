"use client";

/**
 * 18/11/2026 (secondo giro, punto 6): ultima rete, quando si rompe anche la cornice del sito (testata, piè di pagina).
 * Non può contare sui fogli di stile né sui componenti del sito: stili scritti qui, testo essenziale.
 */
export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="it">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif", background: "#f6f0e6", color: "#0c3340" }}>
        <main role="alert" style={{ maxWidth: "36rem", margin: "0 auto", padding: "4rem 1.25rem" }}>
          <p style={{ fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", fontSize: "0.875rem", color: "#00756f" }}>Cura Privata</p>
          <h1 style={{ fontSize: "2rem", lineHeight: 1.15, margin: "1rem 0" }}>Il sito non si è aperto.</h1>
          <p style={{ fontSize: "1.125rem", lineHeight: 1.5 }}>Non dipende da te. Riprova tra un momento: di solito basta.</p>
          <p style={{ marginTop: "1.75rem", display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
            <button type="button" onClick={reset} style={{ minHeight: "3rem", padding: "0 1.5rem", borderRadius: "999px", border: 0, background: "#0c3340", color: "#fff", fontSize: "1.0625rem", fontWeight: 700, cursor: "pointer" }}>
              Riprova
            </button>
            {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- la cornice è rotta: serve un caricamento completo */}
            <a href="/" style={{ minHeight: "3rem", display: "inline-flex", alignItems: "center", padding: "0 1.5rem", borderRadius: "999px", border: "2px solid #0c3340", color: "#0c3340", fontSize: "1.0625rem", fontWeight: 700, textDecoration: "none" }}>
              Torna alla home
            </a>
          </p>
          <p style={{ marginTop: "1.5rem", fontSize: "1rem" }}>Per un&apos;urgenza di salute chiama il 112.</p>
        </main>
      </body>
    </html>
  );
}
