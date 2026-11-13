# Design system — Cura Privata
*8 novembre 2026 · token in `src/app/globals.css`*

> **Aggiornamento del 13 novembre 2026.** Grafica, misure e componenti sono stati rifatti con il sistema «Luce»: la descrizione valida è in [`GRAFICA_LUCE.md`](GRAFICA_LUCE.md). Di questa pagina restano attuali il simbolo, i nomi dei colori e la distinzione tra demo e produzione; valori dei colori, raggi, carattere dei titoli e componenti sono quelli del documento nuovo.

## Idea
«Calma editoriale + affidabilità da banca digitale + chiarezza da portale sanitario» (kit, `02_DESIGN_SYSTEM`). Superfici carta e bianche, petrolio per le aree forti, turchese per le azioni, menta come segno di marca.

## Simbolo
Disegnato per questo progetto (`src/components/brand/logo.tsx`, `public/brand/*.svg`): una **C aperta** in petrolio (chi si prende cura) che accoglie una **curva rivolta all'interno** in turchese (lo spazio riservato) attorno a un **punto di menta** (la persona). Niente cuori o croci generiche, come chiede il kit. La parola «Privata» è in turchese.
File: `logo-mark.svg`, `logo-mark-mono.svg`, `logo-mark-inverse.svg`, `logo-horizontal.svg` (testo convertito in tracciati), `logo-horizontal-dark.svg`, `logo-horizontal-mono.svg`, favicon `src/app/icon.svg`, icona Apple, immagine social 1200×630.
Prima di un deposito serve una verifica grafica (vedi `BLOCCHI_LEGALI_CLINICI.md`).

## Colori
| Token | Chiaro | Scuro | Uso |
|---|---|---|---|
| brand / strong | `#0C3340` petrolio | `#E8F1F2` / `#0F3A47` | logo, fasce forti |
| ink | `#15313C` | `#E8F1F2` | testo (13:1) |
| teal | `#00756F` | `#5FD3C4` | link, testo d'accento, pulsante primario (bianco 5,6:1) |
| sage | `#008F87` turchese di marca | `#3FB5A9` | **solo** decorazione, icone, testo ≥ 24px (3,8:1) |
| marker | `#7BE0D2` menta | `#1F5A55` | traccia sotto i titoli, mai come colore del testo |
| marker-soft | `#CFF3EC` | `#173F3D` | chip di stato, sfondi d'evidenza |
| canvas / paper | `#F5FAF8` / `#FFFFFF` | `#0B1E26` / `#102A33` | sfondi |
| muted | `#4F676E` | `#9AB4BA` | testo secondario (5,7:1) |
| success / warn / danger | `#287E67` / `#8A5A1F` / `#B5454C` | — | **solo** esiti di operazioni, mai «salute nella norma» |

Scostamento motivato dal kit: il turchese `#008F87` su carta ha contrasto 3,8:1, sotto il minimo AA per il testo normale. Per testo e pulsanti si usa `#00756F` (5,3:1); `#008F87` resta il colore di marca per simbolo e decorazioni.

## Carattere
**Manrope** (licenza SIL OFL, file locali, nessuna chiamata a Google). Un solo carattere: titoli 700–780 con tracking negativo, testo 18px, interlinea 1,65. Sostituisce Fraunces + DM Sans di Referto Chiaro. PDF e immagine social usano Manrope statico (400/600/700) in `src/domain/reporting/fonts/`.
H1 home: `clamp(38px, 3.6vw + 17.6px, 72px)`; H2 `clamp(34px, …, 56px)`; mai testo interattivo sotto 14px.

## Forme e movimento
Griglia max 1240px, spaziatura multipla di 8, card con raggio 22px e bordo sottile, pulsanti con raggio 14px (alti 52–60px). Animazioni 160–260ms, solo trasformazioni sul testo, tutte disattivate con `prefers-reduced-motion`. Tema scuro completo e pulsante «Aa» per il testo grande restano.

## Componenti nuovi
- `EcosystemCards`: servizi con stato scritto in parole («Prova la demo», «Gratis, per tutti», «In preparazione»), unica fonte `src/domain/ecosystem.ts`.
- `ComingSoonPage`: pagina di servizio in preparazione (come sarà, prerequisiti, lista d'attesa senza campi liberi).
- `AreaNav`: colonna laterale su desktop con orientamento e servizi in arrivo; barra in basso su mobile (5 voci etichettate, target ≥ 44px).

## DEMO vs PRODUZIONE
Il nastro in alto «Versione dimostrativa» compare in tutte le pagine finché `DEMO_MODE=true`; ogni referto di prova porta «Esempio inventato / sintetico»; il PDF di prova ha la filigrana DEMO.

## Asset e diritti
Nessuna foto: le immagini dei mockup sono render generati e il kit vieta di usare persone finte come medici o testimonial. Illustrazioni SVG originali del progetto. Icone Lucide (ISC).
