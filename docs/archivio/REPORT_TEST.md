# Report dei test — rebrand Cura Privata
*8 novembre 2026, eseguiti in questa sessione sul ramo `cura-privata` (risultati reali, non stimati).*

| Controllo | Risultato |
|---|---|
| TypeScript strict (`tsc --noEmit`) | 0 errori |
| ESLint | 0 errori |
| Build di produzione (`next build`) | ok, 41 pagine + 4 nuove (`/referti`, `/servizi/archivio`, `/servizi/visite-e-consulti`, `/servizi/prevenzione`) |
| Test unitari (Vitest) | **144 superati**, 2 saltati (valutazione AI dal vivo, richiede chiave) |
| Test end-to-end (Playwright, desktop 1440 + mobile 390) | **160 superati**, 0 falliti (screenshot esclusi, si lanciano a parte) |
| Screenshot reali | 36 superati → `docs/screenshots/{desktop,mobile}` |

## Nuovi test del rebrand
- **Unitari** (`tests/unit/cura-privata-brand.test.ts`): il vecchio nome compare solo nella nota storica di Chi siamo; nessun prezzo scritto a mano nelle pagine pubbliche e nelle FAQ; `ENABLE_PUBLIC_PRICES` accetta solo `"true"`; solo referti (demo) e guide (gratis) risultano utilizzabili; nessuna frase vietata dal kit nei componenti.
- **End-to-end** (`tests/e2e/pages.spec.ts`): le 4 pagine nuove passano axe WCAG 2.2 AA, un solo H1, nessuno scroll orizzontale, nessun errore in console; 9 redirect 308 dai vecchi indirizzi; nessun «€» visibile nelle pagine pubbliche; i servizi in preparazione non hanno caricamenti, prenotazioni, pagamenti né campi di testo libero; la home mostra titolo, «Oggi Cura Privata fa una cosa» e il confine informativo/medico; elenco di frasi vietate esteso a «conforme al GDPR», «in totale sicurezza», «medici qualificati», «nella norma», «in pochi minuti».

## Test esistenti modificati (e perché)
- Percorsi aggiornati alla nuova mappa (`/area` → `/area-personale`, `/esempio` → `/referti/esempio`, ecc.).
- Tema scuro: colore di sfondo atteso aggiornato alla nuova palette (`#0B1E26`).
- Menu mobile e header: «Inizia ora» è diventato «Prova la demo»; la voce di controllo è «Referti» invece di «Guide», spostate nel footer come da navigazione del kit.
- Nessun test è stato disattivato o saltato per ottenere il verde.

## Problemi trovati e corretti durante i test
- Chip di stato con contrasto insufficiente (turchese su turchese chiaro) → menta chiara + testo turchese scuro.
- Intestazione oltre la larghezza a 1024px e a 1280px con testo grande → wordmark ridotto sotto 1280px e menu compatto con testo grande fino a 1439px.

## Instabilità nota
Il test del glossario su mobile è fallito una volta su cinque esecuzioni per un contrasto misurato durante l'animazione d'ingresso della pagina; ripetuto 6 volte, sempre verde. Già noto nei giri precedenti.
