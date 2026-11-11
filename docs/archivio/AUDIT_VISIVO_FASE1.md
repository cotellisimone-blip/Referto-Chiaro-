# Audit visivo — Fase 1 (grafica)

Data: 2026-11-07. Base: commit 8a57589 (fasi 1–2 del kit). Screenshot "prima" in `docs/screenshots` a quel commit; "dopo" rigenerati con `npm run screenshots` + tema scuro.

## Criticità rilevate e intervento

| # | Criticità (prima) | Intervento (dopo) |
|---|---|---|
| 1 | Tutte le pagine interne avevano la stessa intestazione a gradiente, con la metà destra vuota su desktop. | `PageHeader` con `art`: 6 illustrazioni originali (translate, magnify, dossier, dialogue, shield, faq) a destra su desktop; variante `compact` per le note legali. |
| 2 | Nessuna illustrazione: solo icone Lucide, sito "da template". | Sistema di illustrazioni SVG originali (`src/components/brand/illustrations.tsx`) con linguaggio coerente: fogli di referto, righe, bolle di dialogo, spunte. Colori via token, quindi funzionano anche in tema scuro. |
| 3 | Hero statica: la "prova visiva" andava cliccata per capire che cosa fa il prodotto. | Momento memorabile: la riga tecnica viene evidenziata con uno "sweep" e la frase semplice appare sotto, a rotazione automatica ogni 4,2 s con anello di avanzamento; pausa/avvio esplicito; disattivato con `prefers-reduced-motion`; si ferma al primo tocco. |
| 4 | Card servizi: titolo e chip di stato affiancati, "Secondo parere medico" andava a capo schiacciato. | Chip sopra il titolo, titolo a larghezza piena, barra accento sulla card in evidenza. |
| 5 | Nota "Nessun acquisto possibile" ripetuta tre volte sotto ogni card e di nuovo nell'intestazione. | Una sola nota sotto la griglia; intestazione prezzi riformulata. |
| 6 | CTA finale con "blob" sfocati generici. | Trama di righe di referto (SVG) in trasparenza con maschera: coerente con l'identità, leggera. |
| 7 | 404 spoglia, solo testo. | Illustrazione "foglio perduto" con percorso tratteggiato che torna indietro. |
| 8 | Nessun tema scuro; colori letterali (`bg-ink text-white`, `#8a5a00`) sparsi nei componenti. | Token `strong/on-strong/on-strong-soft/warn`; tema scuro completo ridefinendo i token (`prefers-color-scheme` + `data-theme`), selettore nel header (auto/chiaro/scuro) ricordato in `localStorage`, script anti-sfarfallio, `theme-color` doppio. Contrasti verificati con axe su /, /servizi-prezzi, /esempio in tema scuro. |
| 9 | Menu mobile: pannello "a tendina" senza sfondo oscurato, pagina scrollabile sotto, fuoco libero. | Overlay con backdrop sfocato, blocco scroll, trappola del fuoco, chiusura con Esc o tocco fuori, frecce sulle voci; test E2E dedicato. |
| 10 | Nessuna transizione tra pagine; cambi bruschi. | `template.tsx` con dissolvenza 260 ms (disattivata da reduced-motion). |
| 11 | Sezione "Metodo": 4 card scollegate, numeri in sage troppo chiaro (3,3:1). | Linea tratteggiata che si disegna tra i passaggi, numeri in sage-deep (5,6:1), icone in cerchio, sollevamento al passaggio del mouse. |
| 12 | PDF in Helvetica/Times: estraneo all'identità del sito, titolo e testata piatti. | Font del sito incorporati (Fraunces 400/600, DM Sans 400/600, istanze statiche sottoinsieme latino, ~30 KB l'una) tramite `@pdf-lib/fontkit`; copertina scura con trama di righe, riquadro "In breve", sezioni numerate 01–04, tabella a righe alternate, glossario con filetto laterale, domande numerate, mini-testata sulle pagine successive. Fallback ai font standard se i file mancano. |
| 13 | Nessuna immagine social / icona iOS: anteprime vuote nelle condivisioni. | `opengraph-image.tsx` (1200×630, generata dal logo e dai font) e `apple-icon.tsx` (180×180). |
| 14 | Pulsante primario con colore hard-coded: in tema scuro sarebbe stato testo bianco su fondo chiaro. | `.btn-primary` e `.btn-on-strong` basati sui token `strong/on-strong`. |
| 15 | Intestazione pagina senza alcun dettaglio: la fascia a gradiente sembrava un placeholder. | Filetto superiore sfumato in sage, griglia a due colonne con illustrazione. |
| 16 | Pagine legali con la stessa intestazione alta delle pagine di prodotto. | Variante `compact` (termini, cookie). |
| 17 | Promesse nel footer e ribbon con `bg-ink text-white` non tematizzabili. | Token `strong`/`on-strong`. |
| 18 | Screenshot di revisione solo in tema chiaro. | Script `scuro-*.png` desktop + mobile (home, prezzi, come-funziona, esempio, 404, menu mobile). |

## Verifiche

- `npm run lint`, `npm run typecheck`, `npm test` (39), `npx playwright test` (57: +3 tema scuro con axe, +1 selettore tema, +1 menu mobile).
- Animazioni d'ingresso solo su elementi decorativi (`aria-hidden`): axe misura il contrasto durante le animazioni, perciò i testi non vengono mai animati in opacità.

## Non fatto (per scelta)

- Nessuna foto, nessun volto, nessuna icona medica da stock: le illustrazioni restano astratte (carta, righe, bolle).
- Nessuna animazione sui numeri del referto: i valori restano statici e identici al documento.
