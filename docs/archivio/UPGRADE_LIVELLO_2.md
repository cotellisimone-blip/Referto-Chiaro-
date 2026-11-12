# Cura Privata — upgrade «di livello» (8 novembre 2026)

Richiesta: «Porta il sito ad un altro livello, grafica e funzionalità.» Tutto resta dentro le regole del kit: nessun dato sanitario raccolto fuori dai gate, nessuna frase vietata, nessun prezzo, nessuna foto o testimonianza inventata.

## Funzionalità nuove

| Che cosa | Dove | Note |
| --- | --- | --- |
| Ricerca del sito (⌘K / Ctrl+K, icona in testata, campo nella home) | `src/components/search/site-search.tsx`, `src/lib/search-index.ts`, `GET /api/v1/public/ricerca` | Indice compatto (guide + glossario + pagine, ~250 voci, < 80 KB), scaricato alla prima apertura. Ultime ricerche solo in localStorage. `<dialog>` nativo, ↑↓ spostano il fuoco tra link veri, Esc chiude. |
| Strumento «Domande per il medico» | `/strumenti/domande-per-il-medico`, `src/components/tools/questions-builder.tsx` | Scegli gli esami → lista deduplicata delle `questionsForDoctor` delle guide + 3 domande sempre utili. Stato nell'URL (`?esami=tsh,emocromo`), spunte locali, stampa, copia testo, copia link. Nessun valore, nessun dato personale. Collegato da home, hub guide, ogni guida (esame preselezionato) e footer. |
| Hub guide con filtro dal vivo e categorie a chip | `src/components/content/guide-finder.tsx` | Stessi link di prima senza JavaScript o senza query. |
| Glossario con filtro dal vivo | `src/components/content/glossary-finder.tsx` | Barra alfabetica quando non si filtra. |
| Guida: indice «In questa pagina», barra di lettura, «Stampa la guida» | `src/components/content/reading-tools.tsx` | Indice solo desktop; la barra è decorativa. |
| Cruscotto area personale | `src/components/area/documents-dashboard.tsx` | Tessere (referti, report pronti, da controllare, dossier), «Prossimo passo» calcolato dagli stati, avanzamento a 4 tacche per referto, anteprima dossier. Solo dati già esposti dalle API esistenti. |
| «Torna su» | `src/components/site/back-to-top.tsx` | Compare dopo 1,5 schermi; non è nel DOM finché non serve. |

## Grafica

- Home: campo di ricerca nell'hero, fascia «numeri veri» (conteggi reali di guide/termini/categorie, «0 diagnosi»), raccordi curvi tra sezioni (`CurveDivider`, ripresa della curva del simbolo), tessere delle 13 categorie con icone, card dello strumento.
- Nuove illustrazioni originali: `IllustrationSearch`, `IllustrationQuestions` (stesso linguaggio: carta, righe, bolle).
- Nuove utility CSS: `.card-glow` (traccia di menta in alto al passaggio), `.stat-tile`, `.ticks`, `.toc-link`, `.reading-bar`, `.search-*`, `.kbd`, `.check-row/.check-box`, stampa della lista.
- Testata: ricerca compatta da 1280px (etichetta da 1536px), icona nel menu mobile; con testo grande il menu compatto arriva fino a 1535px.

## Test

- 148 unit (nuovo `tests/unit/search-index.test.ts`) e 179 e2e (nuovo `tests/e2e/upgrade.spec.ts`: ricerca, strumento, filtri, indice, torna su).
- Helper condiviso `tests/e2e/_lib/a11y.ts`: aspetta la fine delle animazioni finite prima di axe (la dissolvenza di pagina falsava la misura del contrasto su mobile: era la causa del test «flaky» del glossario).
- Screenshot nuovi: `cp-16-glossario`, `cp-17-domande-per-il-medico`.

## Limiti dichiarati

- Lo strumento delle domande usa testi di guide ancora in revisione medica: lo dice in pagina.
- La ricerca non copre il contenuto delle guide (solo nomi, sinonimi, categorie): voluto, per tenere l'indice leggero.
- Il link dello strumento contiene i nomi degli esami scelti: non è un dato sanitario, ma lo diciamo accanto al pulsante «Copia il link».
