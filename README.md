# Referto Chiaro

Piattaforma per rendere comprensibili i referti di laboratorio: valori riportati fedelmente, spiegazioni in linguaggio comune, domande da portare al medico. **Uno strumento di comprensione, non una diagnosi.**

> **Stato:** versione dimostrativa. Funziona solo con un referto **inventato** incluso nel codice. Non accetta documenti reali, non elabora dati sanitari, non vende nulla. Vedi [`docs/PRODUCTION_GATES.md`](docs/PRODUCTION_GATES.md).

## Avvio locale

Requisiti: Node.js 22+.

```bash
npm install
cp .env.example .env.local   # facoltativo: i default sono già sicuri
npm run dev                   # http://localhost:3000
```

Nessuna chiave API o servizio esterno è necessario: senza `DATABASE_URL` il database è PGlite (PostgreSQL embedded) nella cartella `.data/`. L'area personale si prova con il pulsante «Entra con l'account demo» in `/accedi`.

## Comandi

| Comando | Cosa fa |
|---|---|
| `npm run dev` | Server di sviluppo |
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
  lib/auth                  link di accesso, sessioni, consensi, export, eliminazione
  domain/extraction         schema estrazione, parsing numeri e intervalli
  domain/reporting          glossario, schema spiegazione, controllo coerenza, PDF
  providers/                adapter spiegazione (deterministico), upload/OCR/AI (spenti dai gate)
  fixtures/synthetic        unici documenti accettati dalla demo
  lib                       feature gate, rate limit, helper API
public/brand                varianti del logo (colore, mono, scura, favicon)
tests/unit, tests/e2e       test
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
- [`docs/COSTI_OPERATIVI.md`](docs/COSTI_OPERATIVI.md) — costi noti e da stimare
