# Stato dell'implementazione

Aggiornato: 7 novembre 2026 · Fasi 1–2 del kit (design system, homepage, demo verticale) + **Fase 1 grafica** del piano di evoluzione (vedi `AUDIT_VISIVO_FASE1.md`).

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

## Non ancora implementato (fasi successive)

- **Fase 3:** account, autenticazione, database PostgreSQL, ownership/RLS, area utente (`/area/...`), consensi, eliminazione dati.
- **Fase 4:** pipeline reale di upload (firma file, antivirus, storage cifrato), OCR/estrazione, provider AI reale, coda job, checkout Stripe sandbox e webhook.
- **Fase 5:** workflow secondo parere, portale medico con 2FA, pannello admin, audit append-only.
- **Fase 6:** CSP e header di sicurezza completi, rifinitura visiva, revisione accessibilità manuale.
- Dossier multi-referto (servizio Completo): descritto nel sito come «in preparazione», non implementato.

## Note sincere

- Le spiegazioni della demo sono **testi fissi** del glossario (`src/domain/reporting/glossary.ts`), non generati da un modello. Sono bozze editoriali da sottoporre a revisione clinica.
- I prezzi sono ipotesi da validare; nessun pagamento è possibile.
- Il rate limit è in memoria: adatto a una singola istanza demo, non alla produzione.
- I contatti reali del titolare non sono pubblicati: vanno aggiunti prima di qualsiasi apertura.

## Come riprendere

```bash
npm install && npm run build && npm test && npm run test:e2e -- --trace off
```
Poi proseguire dalla fase 2 del piano di evoluzione (account e area personale) (vedi `DECISION_LOG.md` per le scelte già fatte).
