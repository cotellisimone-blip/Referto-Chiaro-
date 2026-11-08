# Cosa impedisce ancora l'uso con pazienti reali

Nessuno di questi punti si risolve con il codice da solo. Finché non sono chiusi, `DEMO_MODE=true` e `PRODUCTION_COMPLIANCE_APPROVED=false`.

## A. Demo pubblica con dati inventati
- [x] Indicazione visibile «versione dimostrativa / dati inventati» su ogni pagina
- [x] Nessun campo che accetti dati sanitari personali
- [x] Nessun medico, testimonianza, statistica o certificazione inventati
- [x] Test automatici di accessibilità e responsive
- [ ] Revisione professionale di copy, privacy e cookie
- [ ] Dati del titolare e contatti reali pubblicati
- [x] Header di sicurezza nell'app (CSP, HSTS, nosniff, frame-ancestors, Permissions-Policy). Limite noto: `script-src 'unsafe-inline'` perché le pagine statiche con Cache Components non possono usare nonce per richiesta — da irrigidire con hash o nonce quando il rendering diventa dinamico

## B. Elaborazione di referti reali
- [ ] Parere formale su inquadramento MDR/IVDR e destinazione d'uso
- [ ] Valutazione AI Act applicabile
- [ ] Basi giuridiche GDPR art. 6 e condizione art. 9, informative, registro trattamenti
- [ ] DPIA e misure conseguenti
- [ ] DPA con i fornitori (hosting, storage, OCR, AI) e valutazione dei trasferimenti
- [ ] Medico supervisore: revisione clinica del glossario e delle frasi standard
- [x] Pipeline upload: firma dei byte (PDF/JPEG/PNG/WEBP), blocco dei PDF con script o allegati, limite 4 MB e 10 pagine, cifratura AES-256-GCM nel database (`FILE_ENCRYPTION_KEY`), RLS, cancellazione con il documento, con la revoca del consenso e con l'account — implementata (8/11/2026)
- [ ] Scansione antivirus dei file caricati (servizio esterno, es. ClamAV gestito) — da aggiungere prima di aprire i caricamenti al pubblico
- [x] Lettura: PDF digitali senza AI; foto/scansioni con Claude (vision); ogni campo ancorato alla lettera alla riga sorgente; righe con dati anagrafici nascoste prima di salvare o strutturare; verifica utente obbligatoria — implementata
- [x] Spiegazione con Claude: al modello solo i nomi degli esami (mai valori), filtro di linguaggio con secondo tentativo e ripiego sul glossario, controllo di coerenza, registro `ai_runs` senza contenuti — implementata
- [x] Autenticazione (link via email), ownership, RLS, audit append-only — implementati; invio email reale con Resend/Postmark (8/11/2026); migrazioni verificate su PostgreSQL 16 con utente non superuser
- [x] Set automatico di integrità valori/citazioni e linguaggio: `tests/ai-eval` + `docs/AI_VALUTAZIONE.md` (13 referti sintetici, 30 testi avversari, 50 manomissioni)
- [ ] Valutazione dal vivo con il modello scelto (`EVAL_LIVE=1 npm run eval:ai`) e revisione indipendente di un campione di spiegazioni da parte di un medico
- [ ] DPA con Anthropic (AI), Neon/Supabase (database), Vercel (hosting), Resend/Postmark (email), Stripe; verifica della regione di inferenza e dei trasferimenti extra-UE
- [ ] Penetration test
- [ ] Approvazione interna registrata per l'attivazione

## C. Pagamenti
- [ ] Ragione sociale, fatturazione, trattamento IVA
- [ ] Termini, recesso, rimborsi pubblicati e approvati
- [x] Checkout Stripe con webhook firmati e idempotenti — implementato in modalità test/simulata; le chiavi live restano bloccate dal gate `livePayments`
- [x] Coerenza modalità sul webhook: con chiave di test si accettano solo eventi di test, con chiave live solo eventi live e solo a gate aperto; email di conferma del pagamento (8/11/2026)

## D. Secondo parere medico
- [ ] Medici reclutati, abilitazione e specialità verificate
- [ ] Contratti, responsabilità professionale, eventuali autorizzazioni sanitarie
- [ ] Prezzi, disponibilità e tempi reali per specialità
- [x] Portale medico con 2FA (TOTP), accesso ai documenti registrato, parere firmato con impronta — implementato come simulazione; la firma qualificata/FEA e la verifica dell'abilitazione (albo) restano da fare
- [ ] Gestione rifiuto del caso e rimborsi

## E. Contenuti pubblici e indicizzazione (guide e glossario)
- [x] Guide agli esami e glossario scritti come bozze con `reviewStatus: "draft-needs-clinical-review"`, avviso visibile su ogni pagina
- [x] Validazione automatica: schema, frasi diagnostiche/prescrittive vietate, fonti solo da domini istituzionali, riferimenti incrociati risolti
- [x] Indicizzazione spenta per default: `robots` noindex, `robots.txt` disallow, sitemap vuota finché `ENABLE_INDEXING` non è esattamente `"true"`
- [ ] Revisione clinica di ogni guida e voce da parte di un medico identificato (aggiornare `reviewStatus` e `lastUpdated`)
- [ ] Responsabile editoriale e procedura di aggiornamento periodico dichiarati
- [ ] Dominio reale e `PUBLIC_BASE_URL` impostati prima di accendere l'indicizzazione (canonical e sitemap usano quel valore)

## F. Sicurezza e protezione dei dati (dopo l'audit del 7/11/2026)

Vedi `docs/AUDIT_ESTERNO.md`. Prima di qualsiasi dato reale:

- [ ] `MFA_SECRET_KEY` impostata (64 caratteri esadecimali) e `TRUST_PROXY=true` solo dietro un reverse proxy fidato.
- [ ] `DEMO_MODE` dichiarato esplicitamente (`false` in produzione); chiavi di pagamento presenti, altrimenti il checkout si blocca.
- [ ] Titolare, contatto privacy e DPO inseriti nell'informativa; informativa, cookie e termini verificati da un professionista (oggi «BOZZA»).
- [ ] DPIA, registro dei trattamenti, contratti con i fornitori.
- [ ] Penetration test esterno.
- [x] Limitatore di richieste condiviso tra istanze (tabella PostgreSQL) per accesso, 2FA e caricamenti.

## G. Messa online (vedi `docs/DEPLOY.md`)

- [x] Configurazione Vercel (`vercel.json`, regione Francoforte, cron di ripresa dei lavori, durata funzioni), schema incluso nelle funzioni serverless
- [x] Migrazioni al deploy (`npm run db:migrate`, idempotente, con lock e verifica del ruolo RLS); `npm run setup` e `npm run keys`
- [x] Lavori lunghi (lettura, AI) eseguiti dopo la risposta (`after`) e fuori dalle transazioni; cron protetto da `CRON_SECRET`
- [ ] Repository su GitHub (account sospeso al 7/11/2026) → collegamento a Vercel
- [ ] Account e chiavi: Neon, Vercel, Resend, Stripe (test), Anthropic; dominio puntato a Vercel
