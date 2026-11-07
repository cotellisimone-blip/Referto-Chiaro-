# Stato dell'implementazione

Aggiornato: 7 novembre 2026 · Fasi 1–2 del kit (design system, homepage, demo verticale) + **Fase 1 grafica** (vedi `AUDIT_VISIVO_FASE1.md`) + **Fase 2 piattaforma** (account, database, area personale) + **Fase 3 vendibilità** (pagamenti test, lista d'attesa, B2B, secondo parere con portale medico 2FA, admin, header di sicurezza) + **Fase 4 SEO e contenuti** (67 guide agli esami, glossario di 139 voci, SEO tecnica con indicizzazione spenta fino alla revisione medica) del piano di evoluzione. **Il piano in 4 fasi è completo.**

## Funziona davvero (verificato da test)

| Area | Dettaglio |
|---|---|
| Sito pubblico | Home, Come funziona, Servizi & Prezzi, Secondo parere (stato «in preparazione»), FAQ, Inizia, Chi siamo, Contatti, Sicurezza, Accessibilità, 404 |
| Bozze legali | Privacy, Termini, Cookie, Accessibilità marcate «BOZZA — DA REVISIONARE» |
| Design system | Token colore/tipografia/raggi/ombre in `globals.css`, font locali (Fraunces, DM Sans), componenti Section, PageHeader, ServiceCards, FaqList, DraftNotice |
| Logo e kit | Proposta originale SVG: simbolo, orizzontale, scura, monocromatica, favicon (`public/brand`, `src/app/icon.svg`); immagine social `opengraph-image.tsx` e `apple-icon.tsx` generate dal logo |
| Illustrazioni | Sistema SVG originale (`src/components/brand/illustrations.tsx`): 6 soggetti + trama CTA + linea del metodo, colori via token |
| Leggibilità | Testo base 18px, pulsanti grandi, pulsante «Aa» nel header per testo più grande (ricordato nel browser, header che si adatta); home e «Come funziona» riscritte con poco testo, tre/quattro passi illustrati e rivelazione allo scorrimento rispettosa di `prefers-reduced-motion` |
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
| Pagamenti | Ordini per servizio (`orders`), provider scelto dalla chiave: nessuna chiave → **pagamento simulato** (pagina in-app, nessun addebito, etichettata); `sk_test_` → Stripe Checkout in test; `sk_live_` → solo con gate `livePayments` (altrimenti 503, mai ripiego silenzioso). Webhook con firma verificata e idempotenza su `payment_events`. Il report nasce solo dopo un ordine pagato (402 altrimenti) |
| Lista d'attesa | `POST /api/v1/waitlist` con consenso obbligatorio, idempotente per email+interesse, rate limit; moduli su Secondo parere, Servizi & Prezzi e Per le strutture; export CSV dall'admin. Nessuna email inviata |
| B2B | Pagina `/per-le-strutture` (laboratori, poliambulatori, farmacie, associazioni) con offerta, limiti dichiarati, pilota ipotetico e lista d'attesa |
| Secondo parere | Richiesta dall'area (referto confermato + specialità + domanda + conferma esplicita della simulazione), assegnazione al medico verificato con meno casi aperti, stati inviata → presa in carico/non accettata → parere firmato → chiusa. Finché il gate è chiuso: solo referti sintetici, `is_simulated = true`, avviso in ogni pagina |
| Portale medico | `/medico`: ruolo `physician` + **2FA TOTP obbligatoria** (RFC 6238, senza librerie esterne); casi assegnati (RLS su `app.physician_id`), lettura del referto registrata nell'audit, presa in carico/rifiuto motivato, parere con conferma di responsabilità e impronta SHA-256 (caso + medico + ora + testo) |
| Admin | `/admin`: ruolo `admin` + 2FA; panoramica, lista d'attesa con CSV, verifica/sospensione medici, assegnazione casi, ordini, registro (ultime 200 voci), configurazione dei gate in sola lettura. Ogni lettura è registrata |
| Account demo di servizio | Solo in DEMO_MODE: «Medico dimostrativo (nessun medico reale)» e «Amministratore dimostrativo»; il codice TOTP corrente è mostrato a schermo per provare la 2FA senza app |
| Guide agli esami | `/guide`: hub per 10 categorie; `/guide/[slug]`: 67 guide (che cosa misura, perché viene richiesto, come leggere il risultato, unità e intervalli, fattori, domande per il medico, FAQ, termini e guide collegate, fonti) come dati tipizzati zod in `src/content/guides`; avviso «bozza in attesa di revisione medica» su ogni pagina; validazione automatica di schema, frasi vietate, riferimenti e fonti |
| Glossario pubblico | `/glossario`: 139 voci per lettera; `/glossario/[slug]`: definizione, approfondimento, guide e termini collegati; JSON-LD DefinedTerm |
| SEO tecnica | Canonical e `metadataBase` da `PUBLIC_BASE_URL`; JSON-LD Article + FAQPage + BreadcrumbList; `sitemap.xml` e `robots.txt` generati; **indicizzazione spenta** (noindex, disallow, sitemap vuota) finché `ENABLE_INDEXING="true"`; slug sconosciuti → 404 reale via `src/proxy.ts`; «Guide» nel menu e «Guide agli esami»/«Glossario» nel footer |
| Header di sicurezza | CSP, HSTS, nosniff, Referrer-Policy, X-Frame-Options, Permissions-Policy, COOP su tutte le risposte; testati |

## Secondo giro (7 novembre 2026, pomeriggio)

- **Grafica**: testo base 18px, pulsanti grandi, pulsante «Aa», home essenziale, rivelazioni allo scorrimento, header verificato a tutte le larghezze.
- **Audit sicurezza/GDPR/codice con correzioni**: vedi `docs/AUDIT_ESTERNO.md` (consensi separati, revoca dei dati sanitari, cancellazione completa, TOTP cifrato e senza riuso, link a schermo solo per account nuovi, pagine legali complete ma ancora in bozza).
- **Guide strumentali**: 23 guide (immagini, cuore ed esami funzionali, endoscopie) con preparazione, «che cosa aspettarsi», durata e contenuto del referto; fonti specifiche per tutte le 90 guide (due senza fonte, dichiarate).

## Non ancora implementato (fasi successive)

- **Revisione medica** di guide e glossario (gate E in `PRODUCTION_GATES.md`): finché non c'è, l'indicizzazione resta spenta.
- Pipeline reale di upload (firma file, antivirus, storage cifrato), OCR, provider AI reale: gli adapter esistono ma sono spenti dai gate.
- Invio email reale dei link di accesso e delle notifiche (oggi solo a schermo in demo).
- Chiavi Stripe live, fatturazione, IVA, rimborsi: bloccati dal gate `livePayments` finché i punti C di `PRODUCTION_GATES.md` non sono chiusi.
- Firma qualificata del parere medico, verifica dell'iscrizione all'albo, contratti con i medici.

## Note sincere

- Guide e glossario sono **bozze editoriali** scritte da un modello e validate solo a macchina (struttura e linguaggio): accuratezza clinica da verificare da un medico prima di accenderne l'indicizzazione. Le fonti citate sono solo pagine indice istituzionali, non riferimenti puntuali.
- Le spiegazioni della demo sono **testi fissi** del glossario (`src/domain/reporting/glossary.ts`), non generati da un modello. Sono bozze editoriali da sottoporre a revisione clinica.
- I prezzi sono ipotesi da validare; nessun pagamento è possibile.
- Il rate limit è in memoria: adatto a una singola istanza demo, non alla produzione.
- L'account demo è **condiviso**: chi lo usa vede i referti aggiunti dagli altri. È scritto nella pagina di accesso.
- PGlite va bene per demo e test; in produzione serve `DATABASE_URL` verso un PostgreSQL gestito (schema e policy sono le stesse).
- I contatti reali del titolare non sono pubblicati: vanno aggiunti prima di qualsiasi apertura.
- Il «medico dimostrativo» non è un medico: il nome lo dice, ogni pagina lo ripete e i casi sono marcati come simulazione.
- La CSP consente `'unsafe-inline'` per gli script: limite delle pagine statiche, documentato in `PRODUCTION_GATES.md`.

## Come riprendere

```bash
npm install && npm run build && npm test && npm run test:e2e -- --trace off
```
Il piano in 4 fasi è completo: i passi successivi sono fuori dal codice (revisione medica dei contenuti, dati del titolare, dominio, chiavi) e sono elencati in `PRODUCTION_GATES.md` (vedi `DECISION_LOG.md` per le scelte già fatte).
