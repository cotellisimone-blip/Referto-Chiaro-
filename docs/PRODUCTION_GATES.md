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
- [ ] Pipeline upload con verifica firma file, antivirus, limiti, storage cifrato, cancellazione — **da implementare (fase 4)**
- [x] Autenticazione (link via email), ownership, RLS, audit append-only — implementati; manca l'invio email reale e un PostgreSQL gestito
- [ ] Set di test di integrità valori/citazioni con revisione indipendente
- [ ] Penetration test
- [ ] Approvazione interna registrata per l'attivazione

## C. Pagamenti
- [ ] Ragione sociale, fatturazione, trattamento IVA
- [ ] Termini, recesso, rimborsi pubblicati e approvati
- [x] Checkout Stripe con webhook firmati e idempotenti — implementato in modalità test/simulata; le chiavi live restano bloccate dal gate `livePayments`

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
