# Report dei test

Eseguiti il 7 novembre 2026 su Node 22, Chromium (Playwright 1.63), build di produzione.

| Controllo | Comando | Esito |
|---|---|---|
| Lint | `npm run lint` | ✅ 0 errori, 0 avvisi |
| Tipi | `npm run typecheck` | ✅ TypeScript strict senza errori |
| Unit | `npm test` | ✅ 70/70 |
| Build | `npm run build` | ✅ 74 route (pagine pubbliche statiche, area/medico/admin, 38 API) |
| E2E | `npm run test:e2e -- --trace off` | ✅ 111/111 (desktop 1440×900 e mobile 390×844; area personale, ordini e pagamento simulato, lista d'attesa, header di sicurezza, secondo parere/medico/admin con 2FA) |
| Screenshot | `npm run screenshots` | ✅ 58 immagini in `docs/screenshots/` (sito, area, pagamento, secondo parere, portale medico, admin; 15 in tema scuro) |

## Cosa copre

**Unit (Vitest)**
- Parsing numeri: `4,5` = `4.5`, migliaia `1.234,5`, separatori ambigui (`1.234`) rifiutati, OCR rovinato (`1▒8`, `l2`) rifiutato, vuoti.
- Intervalli stampati: `70 - 99`, `4,0 - 5,6`, `< 200`, `>= 40`, non standard e invertiti non interpretati; posizione dentro/sopra/sotto/non confrontabile.
- Provider demo: deterministico, valori identici al documento, valore illeggibile escluso, solo valori confermati, nessuna parola diagnostica, rifiuto di documenti non sintetici.
- Coerenza: blocca valore alterato, unità, intervallo, citazione inventata, voce inventata, duplicati, valore illeggibile introdotto, numeri estranei nel testo, output fuori schema.
- Prompt injection: istruzioni nel nome del parametro non cambiano l'output.
- Feature gate: tutto spento di default, valori ambigui (`TRUE`, `1`, `yes`) non accendono nulla, flag senza approvazione bloccato, demo blocca anche con approvazione.
- PDF valido con titolo DEMO; sostituzione dei caratteri non rappresentabili.
- Isolamento DB (PGlite reale, stesse policy di produzione): il proprietario vede il suo documento; un altro utente ne vede/modifica/elimina 0; inserimento per conto di altri rifiutato dalla RLS; senza contesto utente 0 righe; id non valido rifiutato; `audit_log` non cancellabile.
- Dossier: confronto solo fra esami comparabili, valori non confermati/illeggibili elencati a parte, differenze corrette.
- TOTP: vettori RFC 6238, base32 andata/ritorno, finestra ±1, codici malformati rifiutati.
- Pagamenti: scelta del provider (nessuna chiave → simulato; `sk_test_` → test; `sk_live_` senza gate → errore, mai ripiego); ordini: stato pending → paid una sola volta, report creato solo al pagamento; webhook idempotente per id evento, firma verificata.
- Lista d'attesa: validazione, consenso obbligatorio, idempotenza per email+interesse.

**E2E (Playwright + axe-core)**
- Percorso demo completo fino al download del PDF, su desktop e mobile, senza errori in console e senza scroll orizzontale.
- Solo i valori confermati vengono spiegati.
- 14 pagine: risposta 200, un solo H1, nessuno scroll orizzontale, **0 violazioni axe** (WCAG 2.0/2.1/2.2 A e AA), nessun errore in console.
- Nessun link interno rotto; 404 curato.
- Nessun testo vietato (lorem ipsum, «certificato GDPR», «conforme MDR», «24/7», «100%», «garantito»).
- Fail-closed: upload reale → 403; configurazione pubblica tutta spenta; demo rifiuta documenti diversi dalla fixture e campi extra; PDF demo valido.
- Ordini: pagina ordine 0 violazioni axe; pagamento fallito → riprova; annullato; webhook senza firma → 400; ordine sconosciuto → 404; utente B non vede l'ordine di A; report diretto senza ordine pagato → 402.
- Lista d'attesa e B2B: pagina con un solo H1 e 0 violazioni axe; iscrizione con consenso; senza consenso → avviso; API: email non valida, campi extra, consenso mancante → 400; duplicato → `already`.
- Header di sicurezza presenti con i valori attesi su pagine e API.
- Secondo parere: richiesta → medico dimostrativo (2FA obbligatoria: prima 403 `mfa-required`, codice errato rifiutato, codice TOTP accettato) prende in carico e firma (senza conferma di responsabilità → 400; dopo la firma → 409) → la persona legge il parere firmato e chiude; un altro utente non vede il caso (404); portale medico senza sessione chiede l'accesso, utente normale rifiutato, 2FA dall'interfaccia con il codice mostrato in demo; admin: panoramica, CSV della lista d'attesa, tabelle medici/registro/configurazione, 0 violazioni axe, un medico non è admin (403).
- Area personale: senza sessione 401 e rimando all'accesso; percorso completo con l'account demo (nuovo referto → valori → servizio → report → PDF scaricato, 0 violazioni axe, ripresa dopo ricarica); **nessuno vede i documenti di un altro** (API, pagina e export); dossier con confronto corretto e axe; link di accesso monouso; eliminazione account; upload reale 403 anche da autenticati; registrazione senza consensi rifiutata.

## Non verificato

- Revisione manuale con screen reader e navigazione completa da tastiera (fatta solo a campione).
- Browser diversi da Chromium (Safari/Firefox).
- Prestazioni sotto carico.
- Tutto ciò che riguarda fasi non ancora implementate (pagamenti, medico, upload reale).
- Il database in test è PGlite: le policy sono identiche ma un PostgreSQL gestito va provato prima della produzione.
