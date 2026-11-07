# Report dei test

Eseguiti il 7 novembre 2026 su Node 22, Chromium (Playwright 1.63), build di produzione.

| Controllo | Comando | Esito |
|---|---|---|
| Lint | `npm run lint` | ✅ 0 errori, 0 avvisi |
| Tipi | `npm run typecheck` | ✅ TypeScript strict senza errori |
| Unit | `npm test` | ✅ 39/39 |
| Build | `npm run build` | ✅ 14 pagine statiche + 5 API |
| E2E | `npm run test:e2e -- --trace off` | ✅ 57/57 (desktop 1440×900 e mobile 390×844; include 3 pagine in tema scuro con axe, selettore del tema, menu mobile) |
| Screenshot | `npm run screenshots` | ✅ 20 immagini in `docs/screenshots/` + 11 in tema scuro (`scuro-*.png`) |

## Cosa copre

**Unit (Vitest)**
- Parsing numeri: `4,5` = `4.5`, migliaia `1.234,5`, separatori ambigui (`1.234`) rifiutati, OCR rovinato (`1▒8`, `l2`) rifiutato, vuoti.
- Intervalli stampati: `70 - 99`, `4,0 - 5,6`, `< 200`, `>= 40`, non standard e invertiti non interpretati; posizione dentro/sopra/sotto/non confrontabile.
- Provider demo: deterministico, valori identici al documento, valore illeggibile escluso, solo valori confermati, nessuna parola diagnostica, rifiuto di documenti non sintetici.
- Coerenza: blocca valore alterato, unità, intervallo, citazione inventata, voce inventata, duplicati, valore illeggibile introdotto, numeri estranei nel testo, output fuori schema.
- Prompt injection: istruzioni nel nome del parametro non cambiano l'output.
- Feature gate: tutto spento di default, valori ambigui (`TRUE`, `1`, `yes`) non accendono nulla, flag senza approvazione bloccato, demo blocca anche con approvazione.
- PDF valido con titolo DEMO; sostituzione dei caratteri non rappresentabili.

**E2E (Playwright + axe-core)**
- Percorso demo completo fino al download del PDF, su desktop e mobile, senza errori in console e senza scroll orizzontale.
- Solo i valori confermati vengono spiegati.
- 14 pagine: risposta 200, un solo H1, nessuno scroll orizzontale, **0 violazioni axe** (WCAG 2.0/2.1/2.2 A e AA), nessun errore in console.
- Nessun link interno rotto; 404 curato.
- Nessun testo vietato (lorem ipsum, «certificato GDPR», «conforme MDR», «24/7», «100%», «garantito»).
- Fail-closed: upload reale → 403; configurazione pubblica tutta spenta; demo rifiuta documenti diversi dalla fixture e campi extra; PDF demo valido.

## Non verificato

- Revisione manuale con screen reader e navigazione completa da tastiera (fatta solo a campione).
- Browser diversi da Chromium (Safari/Firefox).
- Prestazioni sotto carico.
- Tutto ciò che riguarda fasi non ancora implementate (auth, DB, pagamenti, medico).
