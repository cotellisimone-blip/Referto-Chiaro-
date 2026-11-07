# Stato dell'implementazione

Aggiornato: 7 novembre 2026 · Fasi 1–2 del kit (design system, homepage, demo verticale) + **Fase 1 grafica** (vedi `AUDIT_VISIVO_FASE1.md`) + **Fase 2 piattaforma** (account, database, area personale) del piano di evoluzione.

## Funziona davvero (verificato da test)

| Area | Dettaglio |
|---|---|
| Sito pubblico | Home, Come funziona, Servizi & Prezzi, Secondo parere (stato «in preparazione»), FAQ, Inizia, Chi siamo, Contatti, Sicurezza, Accessibilità, 404 |
| Bozze legali | Privacy, Termini, Cookie, Accessibilità marcate «BOZZA — DA REVISIONARE» |
| Design system | Token colore/tipografia/raggi/ombre in `globals.css`, font locali (Fraunces, DM Sans), componenti Section, PageHeader, ServiceCards, FaqList, DraftNotice |
| Logo e kit | Proposta originale SVG: simbolo, orizzontale, scura, monocromatica, favicon (`public/brand`, `src/app/icon.svg`); immagine social `opengraph-image.tsx` e `apple-icon.tsx` generate dal logo |
| Illustrazioni | Sistema SVG originale (`src/components/brand/illustrations.tsx`): 6 soggetti + trama CTA + linea del metodo, colori via token |
| Tema scuro | Token ridefiniti per `prefers-color-scheme` e `data-theme`; selettore auto/chiaro/scuro nel header, ricordato in `localStorage`; verificato con axe |
| Hero | Traduzione animata della riga (rotazione automatica con anello di avanzamento, pausa esplicita, rispetta `prefers-reduced-motion`) |
| PDF | Font del sito incorporati (Fraunces/DM Sans, istanze statiche in `src/domain/reporting/fonts`), copertina, sezioni numerate, glossario, domande numerate |
| Demo end-to-end | Facsimile sintetico → controllo valori con conferma → spiegazione → PDF con filigrana DEMO, da desktop e smartphone |
| Motore informativo | Parsing numeri italiani (`4,5`/`4.5`, migliaia, separatori ambigui rifiutati), intervalli stampati, posizione neutra rispetto all'intervallo |
| Integrità dei valori | Controllo deterministico origine ↔ output: valori, unità, intervalli, citazioni, duplicati, numeri estranei nel testo |
| Feature gate | `requireCapability` server-side, fail-closed; upload reale risponde 403 prima di leggere il body |
| API | `GET /api/v1/public/config`, `GET /api/v1/demo/document`, `POST /api/v1/demo/report`, `POST /api/v1/demo/report/pdf`, `POST /api/v1/documents` (bloccato) |
| Sicurezza demo | Schema stretto (campi extra rifiutati), body max 4 KB, rate limit in memoria, `Cache-Control: no-store`, correlation ID |
| Database | PostgreSQL (`src/db/schema.sql`): utenti, link di accesso, sessioni, consensi, documenti, report, dossier, job, audit append-only. **Row-Level Security** su ogni tabella personale: ogni transazione utente gira con ruolo non proprietario e `app.user_id`; senza DB esterno parte PGlite (Postgres embedded, `PGLITE_DATA_DIR`) |
| Account | Link di accesso via email (token monouso, hash SHA-256, 15 minuti) → sessione httpOnly 30 giorni; in demo il link è mostrato a schermo e la registrazione è aperta (utenti marcati demo); account demo condiviso `demo@esempio.referto-chiaro.invalid` con un referto già pronto, non eliminabile |
| Area personale | `/area`: archivio con stati; `/area/nuovo`: scelta di un referto di esempio (upload reale disattivato e dichiarato); `/area/documenti/[id]`: lettura → controllo valori → scelta servizio → elaborazione → report con PDF, ripartendo dallo stato salvato; `/area/dossier`: dossier fra più referti; `/area/impostazioni`: consensi, export JSON, eliminazione account |
| Pipeline | Job in coda (`extract-document`, `generate-report`, `generate-dossier`) eseguiti a richiesta nelle API di lettura; stati visibili (in coda → lettura/elaborazione → da verificare/pronto/errore); adapter upload/OCR/AI dietro gate fail-closed |
| Dossier | Confronto **solo** fra esami con stesso nome e stessa unità, tutti confermati e leggibili; differenza riportata senza giudizio; gli altri elencati «non confrontati» con il motivo |
| Referti sintetici | 5 fixture: laboratorio base, emocromo, tiroide (con valore illeggibile), assetto lipidico (confrontabile col primo), funzionalità epatica; glossario a 24 voci |
| Isolamento | Test automatici: un utente non vede, non modifica e non elimina i documenti di un altro (API, pagine, export); link monouso; account eliminabile |

## Non ancora implementato (fasi successive)

- **Fase 3 (vendibilità):** checkout Stripe in test, lista d'attesa, pagina B2B, secondo parere + portale medico con 2FA, pannello admin, header di sicurezza/CSP, pitch.
- **Fase 4 (SEO):** guide, glossario pubblico, SEO tecnica, revisione medica prima dell'indicizzazione.
- Pipeline reale di upload (firma file, antivirus, storage cifrato), OCR, provider AI reale: gli adapter esistono ma sono spenti dai gate.
- Invio email reale dei link di accesso (oggi solo a schermo in demo).

## Note sincere

- Le spiegazioni della demo sono **testi fissi** del glossario (`src/domain/reporting/glossary.ts`), non generati da un modello. Sono bozze editoriali da sottoporre a revisione clinica.
- I prezzi sono ipotesi da validare; nessun pagamento è possibile.
- Il rate limit è in memoria: adatto a una singola istanza demo, non alla produzione.
- L'account demo è **condiviso**: chi lo usa vede i referti aggiunti dagli altri. È scritto nella pagina di accesso.
- PGlite va bene per demo e test; in produzione serve `DATABASE_URL` verso un PostgreSQL gestito (schema e policy sono le stesse).
- I contatti reali del titolare non sono pubblicati: vanno aggiunti prima di qualsiasi apertura.

## Come riprendere

```bash
npm install && npm run build && npm test && npm run test:e2e -- --trace off
```
Poi proseguire dalla fase 3 del piano di evoluzione (vendibilità) (vedi `DECISION_LOG.md` per le scelte già fatte).
