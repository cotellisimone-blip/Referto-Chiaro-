# Audit del codice esistente — Referto Chiaro → Cura Privata
*8 novembre 2026 · base: commit `29fb66e` (bundle in `/codice/`), ramo `feat/demo-vertical-slice`*

Il kit Cura Privata dice di non inventare un audit se il codice non è presente. Qui il codice c'è: questo documento è fatto leggendo il repository reale.

## 1. Stack e comandi
| Voce | Valore |
|---|---|
| Framework | Next.js 16.4.5 (App Router), React 19.3, TypeScript 5, Tailwind 4 |
| Database | PostgreSQL (Neon in produzione) con Row Level Security; PGlite embedded in sviluppo/demo |
| Font | DM Sans (testo) + Fraunces (titoli), via @fontsource (licenza OFL) |
| Pagamenti | Stripe 23 (checkout + webhook firmati e idempotenti) |
| AI | @anthropic-ai/sdk (Claude): lettura foto/scansioni e spiegazioni; PDF digitali letti senza AI (unpdf) |
| PDF | pdf-lib + fontkit |
| Test | Vitest (139 unit), Playwright + axe-core (144 e2e) |
| Deploy previsto | Vercel + Neon (`docs/DEPLOY.md`); Cloudflare **non** verificato |
| Comandi | `npm run dev` · `build` · `test` · `test:e2e` · `typecheck` · `lint` · `db:migrate` · `keys` · `eval:ai` |
| Dimensione | 402 file versionati, 235 in `src/` |

## 2. Mappa pagine (41)
**Pubbliche:** `/`, `/come-funziona`, `/esempio`, `/inizia`, `/servizi-prezzi`, `/secondo-parere`, `/per-le-strutture`, `/sicurezza`, `/faq`, `/chi-siamo`, `/contatti`, `/guide` + 90 guide agli esami, `/glossario` + 139 voci, `/privacy`, `/cookie`, `/termini`, `/accessibilita`, `/accedi`.
**Area personale:** `/area`, documenti, nuovo referto, dossier, ordini, secondo parere, impostazioni.
**Medico:** `/medico`, casi. **Admin:** panoramica, casi, medici, ordini, lista d'attesa, registro, configurazione.

## 3. API (49 rotte, `/api/v1/…`)
Autenticazione (magic link, 2FA TOTP, ruoli demo), area (documenti, upload, verifica, report, PDF, dossier, ordini, casi, consensi, export, cancellazione account), medico, admin, pagamenti (webhook), demo, lista d'attesa, config pubblica, cron.

## 4. Database (19 tabelle)
users, magic_links, sessions, consents, documents, document_files (cifrati AES-256-GCM), reports, dossiers, jobs, audit_log (append-only), orders, payment_events, waitlist, physicians, cases, case_events, ai_runs (senza contenuti), rate_limits, schema_migrations.

## 5. Feature flag (già come chiede il kit)
`src/lib/feature-flags.ts`, fail-closed: solo la stringa esatta `"true"` accende qualcosa.
`DEMO_MODE`, `PRODUCTION_COMPLIANCE_APPROVED`, `ENABLE_REAL_UPLOADS`, `ENABLE_AI_PROCESSING`, `ENABLE_LIVE_PAYMENTS`, `ENABLE_MEDICAL_SECOND_OPINION`, `ENABLE_PUBLIC_SIGNUP`, `ENABLE_INDEXING`. Caricamenti, AI, pagamenti live e secondo parere richiedono anche `PRODUCTION_COMPLIANCE_APPROVED=true` e demo spenta. `.env.example` non contiene valori segreti.

## 6. Stato funzioni
| Funzione | Stato | Perché |
|---|---|---|
| Sito pubblico, guide, glossario | OPERATIVO (contenuti in bozza) | Guide e glossario marcati «da revisione clinica»; indicizzazione spenta |
| Demo su dati sintetici (`/esempio`, area demo) | DEMO | Funziona, rifiuta file personali |
| Login con link via email | OPERATIVO nel codice | Serve account email (Resend/Postmark) |
| Caricamento cifrato + lettura PDF/foto | BLOCCATO (implementato) | Gate legali: DPIA, MDR/IVDR, DPA; manca antivirus |
| Spiegazione AI con controlli | BLOCCATO (implementato) | Valutazione dal vivo e revisione medica mancanti |
| Pagamenti Stripe | DEMO (test) / BLOCCATO (live) | Mancano P.IVA, prezzi approvati, termini |
| Secondo parere + portale medico 2FA | DEMO | Nessun medico contrattualizzato, firma qualificata e verifica albo da fare |
| Admin, registro audit | OPERATIVO nel codice | — |
| Export / cancellazione account / revoca consenso | OPERATIVO nel codice | — |
| Deploy | BLOCCATO | Push GitHub sospeso, account e chiavi mancanti |

## 7. Occorrenze del vecchio nome
78 occorrenze di «Referto Chiaro» in 39 file. Gruppi:
- **Interfaccia e SEO:** `layout.tsx`, `seo.ts`, `opengraph-image.tsx`, `site-footer.tsx`, `chi-siamo`, `termini`, `guide/[slug]`, componenti demo/area, `illustrations.tsx`, `globals.css`.
- **Logo:** 6 SVG in `public/brand/`.
- **Testi esterni:** email (`lib/email/*`), descrizione Stripe, PDF (`domain/reporting/pdf.ts`), export dati, emittente 2FA (`totp.ts`: cambiarlo rompe le app di autenticazione già associate, va gestito).
- **Backend/infrastruttura:** `schema.sql` (commenti), nome pacchetto, `.env.example`, prompt AI (`claude-explanation.ts`).
- **Documenti e test:** README, `docs/*`, 2 test e2e.

## 8. Cosa riusare e cosa cambia
- **Si riusa tutto il motore:** sicurezza, flag, DB e RLS, auth, pipeline documenti, controlli AI, test, guide e glossario.
- **Cambia la superficie:** marchio, logo, palette (oggi grafica «evidenziatore» blu/giallo; diventa petrolio/turchese), font (Fraunces → sans tipo Manrope come chiede il kit), home ombrello, sitemap con `/referti` e `/servizi/*`, pagine «In preparazione» per archivio, visite, prevenzione.
- **Da togliere per la regola del kit:** i prezzi indicativi oggi visibili su `/servizi-prezzi` (9,90 € / 24,90 € / da 99 €) finché non scegli un listino.

## 9. Dipendenze e rischi
- Nessuna dipendenza abbandonata; versioni fissate nel lockfile.
- CSP con `'unsafe-inline'` per gli script (limite noto, in `PRODUCTION_GATES.md`).
- Antivirus sui caricamenti mancante.
- Cloudflare: Next 16 con PGlite e pdf-lib non è garantito su Workers; il deploy documentato e testato è Vercel.
- GitHub sospeso: il kit propone GitLab. Il codice è salvato come bundle e zip nel progetto.
