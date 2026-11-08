# Cura Privata

Marchio ombrello per servizi di salute digitali. Il primo servizio, **«Comprendi i tuoi referti»**, rende comprensibili i referti di laboratorio: valori riportati fedelmente, spiegazioni in linguaggio comune, domande da portare al medico. **Uno strumento informativo, non una diagnosi.** Secondo parere medico, archivio salute, visite e prevenzione sono pagine «In preparazione» con lista d'attesa.

> Nato come «Referto Chiaro»: il rebrand dell'8/11/2026 è documentato in [`docs/cura-privata/`](docs/cura-privata/) (audit, matrice vecchio→nuovo, stato delle funzioni, blocchi legali e clinici, design system, test, confronto con i mockup).

> **Stato:** online parte in **modalità demo** (solo referti inventati). Il codice per i servizi reali c'è ed è testato — caricamento cifrato, lettura di PDF e foto, spiegazioni con Claude, email, Stripe live — ma resta spento dietro i gate finché non sono chiusi i requisiti di [`docs/PRODUCTION_GATES.md`](docs/PRODUCTION_GATES.md). Messa online passo per passo: [`docs/DEPLOY.md`](docs/DEPLOY.md). Qualità e sicurezza dell'AI: [`docs/AI_VALUTAZIONE.md`](docs/AI_VALUTAZIONE.md).

## Avvio locale

Requisiti: Node.js 22+.

```bash
npm install
cp .env.example .env.local   # facoltativo: i default sono già sicuri
npm run dev                   # http://localhost:3000
```

Nessuna chiave API o servizio esterno è necessario: senza `DATABASE_URL` il database è PGlite (PostgreSQL embedded) nella cartella `.data/`. L'area personale si prova con il pulsante «Entra con l'account demo» in `/accedi`; il portale medico (`/medico`) e l'admin (`/admin`) con gli account dimostrativi e la 2FA (in demo il codice è mostrato a schermo). Senza chiavi Stripe il pagamento è simulato; con `STRIPE_SECRET_KEY=sk_test_...` e `STRIPE_WEBHOOK_SECRET` si usa Stripe Checkout in test. Le 90 guide agli esami (`/guide`, di laboratorio e strumentali) e il glossario (`/glossario`) sono bozze in attesa di revisione medica: l'indicizzazione resta spenta finché non si imposta `ENABLE_INDEXING=true` insieme a `PUBLIC_BASE_URL`.

## Comandi

| Comando | Cosa fa |
|---|---|
| `npm run setup` | Configurazione in un comando (dipendenze, `.env.local` con chiavi, migrazione, test) |
| `npm run dev` | Server di sviluppo |
| `npm run db:migrate` | Migra il PostgreSQL di `DATABASE_URL` (eseguito anche a ogni deploy Vercel) |
| `npm run keys` | Genera le chiavi segrete |
| `npm run eval:ai` | Valutazione della pipeline AI → `docs/AI_VALUTAZIONE.md` (`EVAL_LIVE=1` per il modello vero) |
| `npm run build` / `npm start` | Build e avvio di produzione |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript strict |
| `npm test` | Test unitari (Vitest): parsing numeri, coerenza valori, feature gate, PDF, isolamento DB, dossier |
| `npm run test:e2e -- --trace off` | Test end-to-end (Playwright) desktop 1440×900 e mobile 390×844, con axe-core |
| `npm run screenshots` | Rigenera gli screenshot in `docs/screenshots/` |

I test E2E avviano da soli `npm run start` sulla porta 3100: eseguire prima `npm run build`.

## Struttura

```
src/
  app/                      pagine (App Router) e API in app/api/v1
  components/brand          logo SVG
  components/site           header, footer, banner demo
  components/ui             componenti del design system
  components/demo           demo interattiva (hero e percorso completo)
  components/area           area personale (accesso, archivio, percorso referto, dossier, impostazioni)
  components/report         facsimile, lista di verifica, spiegazione, stepper (condivisi fra demo e area)
  db                        schema PostgreSQL con RLS e client (pg / PGlite)
  domain/pipeline           repository e job (lettura, report, dossier)
  domain/dossier            confronto fra referti
  lib/auth                  link di accesso, sessioni, consensi, export, eliminazione, TOTP (2FA), ruoli
  lib/payments              provider di pagamento (simulato, Stripe test/live con gate)
  domain/orders             ordini e eventi di pagamento (idempotenti)
  domain/cases              casi di secondo parere (paziente, medico, admin)
  components/portale        gate dei portali riservati (ruolo + 2FA)
  components/medico, admin  portale medico e pannello admin
  domain/extraction         schema estrazione, parsing numeri e intervalli
  domain/reporting          glossario, schema spiegazione, controllo coerenza, PDF
  providers/ai              Claude: client, spiegazione con controlli, modello finto per test
  providers/ocr             lettura PDF (testo), foto (Claude vision), strutturazione ancorata, dati personali nascosti
  providers/upload          validazione file e archivio cifrato
  domain/safety             filtro del linguaggio diagnostico/prescrittivo
  lib/email                 email transazionali (Resend, Postmark, casella di sviluppo)
  fixtures/synthetic        unici documenti accettati dalla demo
  lib                       feature gate, rate limit, helper API
public/brand                varianti del logo (colore, mono, scura, favicon)
tests/unit, tests/e2e       test
tests/ai-eval               valutazione AI: referti sintetici, golden, corpus avversario
docs/                       decisioni, stato, gate, test, costi, screenshot
```

## Come funziona la demo

1. `/esempio` mostra il facsimile del referto sintetico (`src/fixtures/synthetic/referto-lab-001.json`).
2. L'utente conferma i valori estratti; quello illeggibile (riga 8) non è confermabile.
3. `POST /api/v1/demo/report` genera la spiegazione con il provider deterministico e la passa al **controllo di coerenza** (`src/domain/reporting/consistency.ts`): valori, unità, intervalli e citazioni devono coincidere con il documento, e nel testo libero non possono comparire numeri assenti. Se il controllo fallisce, nessun report.
4. `POST /api/v1/demo/report/pdf` produce il PDF A4 con filigrana *DEMO – DATI SINTETICI*.

## Documentazione

- [`docs/STATUS_IMPLEMENTAZIONE.md`](docs/STATUS_IMPLEMENTAZIONE.md) — cosa funziona davvero e cosa manca
- [`docs/DECISION_LOG.md`](docs/DECISION_LOG.md) — decisioni prese e perché
- [`docs/PRODUCTION_GATES.md`](docs/PRODUCTION_GATES.md) — cosa impedisce l'uso con pazienti reali
- [`docs/TEST_REPORT.md`](docs/TEST_REPORT.md) — test eseguiti e risultati
- [`docs/AUDIT_ESTERNO.md`](docs/AUDIT_ESTERNO.md) — audit sicurezza/GDPR/codice e correzioni
- [`docs/COSTI_OPERATIVI.md`](docs/COSTI_OPERATIVI.md) — costi noti e da stimare
