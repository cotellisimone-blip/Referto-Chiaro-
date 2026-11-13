# Grafica «Luce» — sistema visivo, regole e verifica
*12–13 novembre 2026 · token e classi in `src/app/globals.css` · sostituisce la parte grafica di `DESIGN_SYSTEM.md`*

## Da dove nasce
Richiesta del titolare: portare grafica e disposizione «da 6 a 10.000», rivedere tutti i testi, poter mostrare il sito ai medici senza imbarazzo. Il lavoro ha toccato tutte le pagine: sito pubblico, strumenti gratuiti, area personale, richieste con un medico, prova a tre ruoli, portale medico e amministrazione.

Che cosa **non** è cambiato: nomi e prezzi dei servizi, regole di linguaggio (nessuna diagnosi, nessuna prescrizione, nessuna promessa clinica), palette petrolio / turchese / menta, carattere Manrope, simbolo «C», fotografie solo di pazienti e solo quelle fornite dal titolare.

## L'idea in tre righe
1. **Carta calda e luce di menta.** Fondo avorio (`#FBFAF6`), una luce morbida in alto a destra, onde al posto delle righe di separazione.
2. **Forme piene.** Schede con raggio 24–32 px, pulsanti a pillola alti 54–62 px, icone dentro tessere arrotondate.
3. **Il filo del percorso.** Lo stesso indicatore a passi in ogni percorso, la stessa cronologia a punti in ogni storico.

## Token
| Che cosa | Valore | Regola d'uso |
|---|---|---|
| `ink` / `ink-soft` / `muted` | `#10303B` / `#2E4C57` / `#4F676E` | testo; su carta 13,4:1, 9:1 e 5,7:1 |
| `teal` | `#00756F` | link, testo d'accento, pulsante primario (5,3:1 su carta) |
| `sage` | `#008F87` | turchese di marca: solo decorazione, icone, testo da 24 px in su |
| `marker` / `marker-soft` | `#7BE0D2` / `#CFF3EC` | menta: solo **dietro** testo scuro, mai come colore del testo |
| `canvas` / `paper` / `mist` | `#FBFAF6` / `#FFFFFF` / `#EAF6F2` | fondo pagina, schede, riquadri tenui |
| `strong` | `#0C3340` | petrolio: fasce forti, piè di pagina, sala d'attesa del video |
| toni dei servizi | capisci `#E2F6F0`, medico `#FCF0E4`, parere `#E6F0F8` | solo sfondi e accenti; classi `tone-capisci`, `tone-medico`, `tone-parere`, `tone-partenza` |
| raggi | 10 / 14 / 24 / 32 px | campi 16 px, schede 24–32 px, pulsanti a pillola |
| ombre | `shadow-card`, `shadow-lift`, `shadow-float` | tre livelli, tinta petrolio |
| margine laterale | 16 px sotto 360 px, 20 px sui telefoni, 32 px da tablet | variabile `--gutter` |

Tema scuro: si ridefiniscono i token, non i componenti. Attenzione: nel tema scuro `teal-deep` diventa **chiaro**; per pillole piene e selezionate si usa la sfumatura fissa `linear-gradient(180deg,#00827b,#006c66)` con testo bianco.

## Misure che valgono ovunque
- Testo di lettura 17–18 px; note e metadati mai sotto 15 px; campi dei moduli 18 px.
- Bersagli da toccare alti almeno 44 px (pulsanti normali 54 px, grandi 62 px).
- Pulsante «aA»: tutto il sito cresce del 12,5 %. Quando è acceso il pulsante è pieno e turchese. Sotto i 396 px con il testo grande (e sotto i 360 px sempre) passa nel menu, con la scritta «Testo più grande».
- Nessuna pagina scorre di lato: verificato da 320 a 1440 px, con testo normale e grande (vedi «Verifica»).

## I mattoni
| Classe | A che cosa serve |
|---|---|
| `section`, `container-rc`, `page-hero…`, onde (`Wave`) | ritmo verticale e aperture delle pagine |
| `eyebrow`, `display-lg`, `lead`, `area-title`, `area-lead`, `area-h2`, `area-h3`, `meta` | la scala dei testi |
| `btn` + `btn-primary` / `btn-secondary` / `btn-ghost` / `btn-on-strong`, `btn-lg`, `btn-sm`, `btn-wrap` | pulsanti; sotto 380 px (480 px con testo grande) le etichette lunghe vanno a capo da sole |
| `card`, `card-lift`, `glass`, `tile-ico` (`-sm`, `-lg`, `-tone`) | schede e tessere delle icone |
| `form-card` (`-accent`, `-warn`), `form-card-head`, `form-card-title`, `form-card-text`, `form-card-body` | ogni modulo e ogni scheda di stato; se accanto all'icona non c'è posto per una parola lunga, il titolo passa sotto |
| `field-label`, `field-input`, `field-hint`, `field-check`, `field-error`, `field-ok` | campi, consensi, errori ed esiti |
| `option-row`, `choice-pills` / `choice-pill`, `slot-grid` / `slot-pill`, `switch`, `tab-pills` / `tab-pill` | scelte, fasce orarie, interruttori, sezioni |
| `callout` (`-warn`, `-danger`, `-compact`), `sim-box`, `empty-state`, `empty-note` | avvisi, simulazioni dichiarate, stati vuoti |
| `Stepper` (`src/components/report/stepper.tsx`) | **l'unico** indicatore a passi: da tablet i nomi sotto i pallini, su telefono una riga «Passo 2 di 5 · nome» che va a capo senza coprire nulla |
| `timeline`, `kv`, `kv-rows`, `side-card`, `link-list`, `dot-list`, `num-list`, `check-list` | storici, coppie etichetta/valore, colonne laterali, elenchi |
| `stat-grid` / `stat-card` / `stat-sub`, `data-table-wrap` / `data-table` | numeri e tabelle dell'amministrazione (le tabelle scorrono dentro il loro riquadro) |
| `video-room…`, `announce…`, `how-card`, `svc-card…`, `pdp-…` | blocchi propri di una pagina |

## Regole di scrittura applicate ai testi
- Frasi brevi, verbo all'inizio, «tu». Una cosa per frase.
- Si dice che cosa succede e che cosa **non** succede (per esempio: «Paghi solo quando il medico conferma l'orario»).
- «In pochi minuti» solo come «di norma in pochi minuti».
- Il secondo parere è sempre: esame dei documenti, videoconsulto con lo specialista, sintesi scritta.
- «Medici abilitati e identificabili» resta la formula per i medici.
- Ogni simulazione è dichiarata accanto al comando che la attiva.
- Le pagine legali restano **bozze da far rivedere** e lo dicono in testa.

## Che cosa è cambiato, per blocchi
1. **Sistema, testata, piè di pagina, home, pagine dei servizi, prezzi** — nuova apertura con la fotografia della paziente, annuncio della visita a domicilio, i due ingressi, schede dei servizi nel loro colore, listino a righe allineate.
2. **Pagine di fiducia, guide, glossario, servizi in preparazione** — ricerca nuova, schede per argomento, articoli con testo più grande e colonna laterale.
3. **Strumenti gratuiti, Punto di Partenza, accesso, referto di esempio** — moduli a passi, facsimile che si adatta alla riga più lunga.
4. **Area personale e percorso del referto** — cruscotto con «prossimo passo», verifica dei valori, scelta del servizio, report, pagamenti.
5. **Richieste con un medico, prova a tre ruoli, portale medico, amministrazione** — stato della richiesta con cronologia, sala d'attesa, caso con il referto accanto mentre il medico scrive, numeri e tabelle leggibili.
6. **Rifinitura per testo grande e schermi piccoli** — testata, annuncio in home, titoli delle schede, righe di scelta, elenco delle dieci aree, pulsanti lunghi.

Confronto prima/dopo, pagina per pagina: cartella di progetto `cura-privata/grafica-top/` (`prima/`, `dopo/`, `confronto/`).

## Verifica
Stato al 13 novembre 2026, sull'ultimo salvataggio di questo ramo.

| Controllo | Esito |
|---|---|
| Tipi (`npx tsc --noEmit`) e stile del codice (`npx eslint .`) | puliti |
| Prove di logica (`npx vitest run`) | 238 superate, 2 saltate per scelta |
| Prove sul sito compilato, computer 1440 px e telefono 390 px (`npx playwright test`) | 342 in tutto: 280 superate, 62 saltate perché valgono per un solo formato, nessuna fallita |
| Prove della versione vetrina (`npm run test:e2e:vetrina`) | 27 superate, 1 saltata, nessuna fallita |
| Accessibilità automatica (axe, WCAG 2.2 AA) | dentro le prove sopra, tema chiaro e scuro |

Controlli fatti a mano con gli strumenti in `cura-privata/grafica-top/strumenti/` (cartella di progetto):

- **Niente scorre di lato.** 40 pagine a 320, 360, 390, 768, 1024, 1280 e 1440 px con testo normale; le stesse a 320, 340, 360, 375, 390, 412, 768, 1024, 1280 e 1440 px con testo grande. Nessun elemento fuori dallo schermo (`sweep.cjs`).
- **Percorsi interi con testo grande a 320 e 360 px.** Richiesta di visita, videoconsulto e secondo parere in tutti gli stati; prova a tre ruoli; portale medico e amministrazione; area personale; percorso del referto; referto di esempio. Ogni schermata resta larga quanto lo schermo.
- **Tema scuro su telefono.** Portali, amministrazione e richieste.
- **Lettura a occhio.** Ogni pagina guardata a 1440 e 390 px dopo ogni blocco di lavoro.

Difetti trovati in questo giro e corretti (prima del giro non erano coperti da prove):

1. Con il testo grande la testata usciva dallo schermo a 360 e 375 px (i telefoni più diffusi). Ora c'è una prova che lo controlla a 320, 360, 375 e 390 px.
2. Sotto i 360 px l'annuncio in testa alla home spezzava il titolo una parola per riga.
3. Nel Punto di Partenza, con il testo grande, l'elenco delle dieci aree e le scelte dell'obiettivo allargavano la pagina.
4. Nelle richieste, a 320 px con testo grande, le righe dei documenti uscivano dalla scheda e il nome del passo copriva i pallini.
5. Un pulsante lungo del lato medico («Proponi un altro orario») allargava la pagina a 320 px con testo grande.

## Limiti dichiarati
- **Fotografie.** Sono le immagini illustrative fornite dal titolare (solo pazienti, con la dicitura «Immagine illustrativa»). Il passo che alza ancora la qualità è un servizio fotografico vero, con liberatorie.
- **Miniature illustrative** (anteprime del report dentro le schede): contengono testo piccolo per scelta, sono disegni e non contenuto da leggere; sono nascoste ai lettori di schermo.
- **Pagine legali**: bozze, da far rivedere a un professionista prima della pubblicazione.
- **Barra in basso dell'area personale**: etichette da 14 px, sotto la misura minima del resto del sito; restano così perché cinque voci devono stare in 320 px.
