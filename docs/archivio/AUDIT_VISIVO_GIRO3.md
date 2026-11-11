# Audit visivo — Giro 3 (grafica, copy, marketing)

Data: 2026-11-07. Base: commit 40324b7 (giro 2). Obiettivo dichiarato: grafica «da 6 a 10 e lode», copy e marketing più forti, senza toccare le scelte di accessibilità del giro 2 (18 px, pulsanti grandi, «Aa», poco testo, animazioni discrete) né i vincoli di sicurezza (nessun linguaggio diagnostico, indicizzazione spenta).

Screenshot prima/dopo in `/mnt/project-files/screenshots/giro3-grafica/` (prima/, dopo/) e in `docs/screenshots/`.

## L'idea: l'evidenziatore

Il prodotto fa una cosa sola davanti agli occhi di chi lo usa: evidenzia una riga del referto e la spiega. L'evidenziatore giallo (`--color-marker`) diventa la firma visiva: sul titolo della home («chiaro»), nella sezione prima/dopo, sulla copertina del PDF. Sta solo dietro testo scuro (ink su marker ≈ 11:1), non è mai un colore di testo, in tema scuro diventa ambra scura.

## Interventi

| # | Prima | Dopo |
|---|---|---|
| 1 | Palette tutta fredda, sfondi piatti. | Nuovi token `marker`, `marker-soft`, `amber`, `glow`; grana di carta (`.grain`, rumore SVG inline al 4,5%), griglia di punti (`.dots`), aloni morbidi (`.glow-teal/.glow-cream`). |
| 2 | Titolo hero 72 px con «finalmente» in teal. | `.display-xl` con clamp fino a 92 px, ottica 144 del Fraunces, evidenziatore animato su «chiaro» (solo sfondo, mai opacità sul testo). `.display-lg` per tutti i titoli di sezione. |
| 3 | Eyebrow semplice. | Eyebrow con filetto a sinistra (`.eyebrow::before`), variante `eyebrow-plain` per il footer. |
| 4 | Card uguali ovunque. | `.card-lift` (sollevamento al passaggio), `.card-featured` (bordo sfumato teal→salvia→evidenziatore), `.sheet` (foglio con angolo piegato in CSS). |
| 5 | Pulsante primario piatto. | Gradiente leggero, riflesso interno, sollevamento di 1 px al passaggio. |
| 6 | Home: hero, 3 passi, prima/dopo, promesse, servizi, CTA. | Hero con foglio impilato dietro; fascia «fatti, non promesse» con numeri veri (90 guide, 139 termini, 0 numeri cambiati, 1 regola); passi numerati 01–03 con illustrazioni; prima/dopo su `.sheet` con riga evidenziata; nuova sezione «Un foglio da portare in visita» (anatomia del report in HTML, etichette fluttuanti); promesse; servizi; nuova sezione guide con 8 esami cercati; manifesto scuro «Non facciamo diagnosi. Facciamo chiarezza.» con CTA. |
| 7 | Intestazioni di pagina piatte. | `PageHeader` con punti, grana, alone dietro l'illustrazione, titolo `display-lg`. |
| 8 | Come funziona: card alternate semplici. | Linea tratteggiata verticale, numeri 01–04 grandi, etichetta di rassicurazione per passo, «Può / Non può, per scelta» con testate colorate. |
| 9 | Card servizi: prezzo 40 px. | Prezzo in `.stat-num` 48 px, «da» separato, spunte in cerchio, card centrale con bordo sfumato. |
| 10 | Stepper con barre sottili. | Numeri in cerchio (fatto = salvia con spunta, attuale = inchiostro), barre più spesse. |
| 11 | Report: card tutte uguali. | «In breve» in Fraunces su nebbia con grana; ogni valore numerato 01, 02… con filetto sfumato a sinistra e valore in pillola; domande numerate in serif. |
| 12 | Area personale: titolo e lista. | Eyebrow «Il tuo archivio», contatore referti/report, card con filetto (sfumato se il report è pronto), sollevamento. |
| 13 | PDF: titolo bianco su copertina scura. | «in parole semplici» su banda evidenziatore (testo inchiostro su giallo), stessa firma del sito. |
| 14 | Footer: payoff in piccolo. | Payoff in Fraunces 24 px, 112 in cifra grande, voci con sottolineatura che cresce. |
| 15 | Copy di intestazioni generico. | Accedi «Il tuo archivio, visibile solo a te.», Sicurezza «I tuoi referti restano tuoi.», Guide «Gli esami, spiegati uno per uno.», hero «Sigle, numeri, asterischi…», chi siamo con manifesto. |
| 16 | FAQ compatte. | Domande 18 px, risposte 18 px in `ink-soft`, icona «+» in cerchio. |

## Vincoli rispettati

- Testo base 18 px, pulsanti ≥ 52 px, toggle «Aa» e tema invariati; nessuna animazione sull'opacità del testo; `prefers-reduced-motion` rispettato.
- Nessuna testimonianza, numero di utenti, medico con nome; gli unici numeri in home sono fatti verificabili (conteggio guide e glossario letto dal codice).
- Nessun linguaggio diagnostico: i test di linguaggio (unit) passano; le intestazioni usate dagli E2E sono invariate tranne `Gli esami, spiegati uno per uno.` (test aggiornato).
- Contrasto: il numerale piccolo «01» nelle card del report usa `sage-deep` (5,6:1); axe verde su home, prezzi, esempio, guide, area.

## Verifiche

- `npm run typecheck`, `npm test` (88), `npx playwright test` (138 + 44 screenshot): tutti verdi.
- Overflow orizzontale su mobile controllato con uno script Playwright (scrollWidth = 390).
- Anteprima statica ricostruita (v9) e verificata offline con React UMD locale.

## Non fatto (per scelta)

- Nessuna foto, nessun volto, nessuna icona medica da stock.
- Nessuna animazione sui numeri del referto.
- Il PDF cambia solo la copertina: il corpo era già ridisegnato nella fase 1.
