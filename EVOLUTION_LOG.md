# Registro dell'evoluzione — Cura Privata

Un ciclo = analisi, cinque fasi proposte, approvazione di Simone, esecuzione. Il più recente sta in cima. La storia precedente al ciclo 1 è in `docs/archivio/DECISION_LOG.md`.

## Ciclo 1 · 11/11/2026

**Analisi:** documento «Analisi e cinque fasi» (artifact del thread). **Approvazione:** Simone, 11/11 alle 18:59 UTC, tutte e cinque le fasi. **Ramo:** `claude/project-thread-ut46xc` (contiene anche la v2 e il Punto di Partenza V3, quindi sostituisce la PR #2).

| Fase | Cosa è cambiato | Commit |
|---|---|---|
| 1. Un solo codice e una sola verità | `PROJECT_STATE.md`, `PRODUCT_ROADMAP.md`, questo registro; 12 documenti superati spostati in `docs/archivio/`; listino e stato aggiornati in `RISCHI_RESIDUI`, `STATO_FUNZIONI`, `README_RUN`, `README` | dfd3191 |
| 2. Messaggio nei primi 5 secondi e fiducia | Sottotitolo unico (`HERO_SUBTITLE`), prezzo e ingresso gratuito nella prima schermata; «Chi c'è dietro» e dati del titolare solo da `PUBLIC_OWNER_*`; profili dei medici senza foto con link al portale FNOMCeO; home più corta; fondo pagina compatto | a1b43f4 |
| 3. Grafica su telefono | Ordine unico dei servizi (Capisci → Parla con un medico → Secondo parere) in menu, fondo pagina, ecosistema. Su telefono: «Prima / Dopo» a schede al posto dello slider, passi dell'esempio leggibili e referto facsimile senza scorrimento orizzontale, guida del Punto di Partenza subito sotto il titolo (da 4.644 a 782 px), tre soli stili di pulsante, immagine di Preparati alla visita senza sovrapposizioni. Home: 9.272 px su telefono (era 9.615), 5.394 su desktop (era 5.765) | 935e23c e il commit «Fase 3: grafica su telefono» |
| 4. Vetrina pubblicabile e SEO di base | `SITE_PROFILE=vetrina` spegne caricamenti, AI, pagamenti veri e servizi medici anche con un interruttore acceso per errore; sitemap solo con contenuti revisionati o pratici; guida al Fascicolo Sanitario Elettronico; descrizioni di tutte le pagine; dati strutturati solo con il titolare vero; `docs/cura-privata/LANCIO_VETRINA.md` | 8cfac39 |
| 5. Conti e qualità dell'AI | `src/domain/costi-ai.ts` (tariffe, Stripe SEE verificata, margine); costo AI reale in Admin → Panoramica; `docs/COSTI_OPERATIVI.md` riscritto. Margine stimato: 1,86 € a 2,90 € e 5,88 € a 7,90 € (Opus, foto di una pagina) | c690ad8 |

**Test (11/11, a fine ciclo):** build OK, `tsc` pulito, 190 test unitari passati, 224 e2e passati e 50 saltati (desktop e telefono), 0 falliti. Nuovi e2e: passi dell'esempio su telefono, «Prima / Dopo» da tastiera, guida del Punto di Partenza in alto con «Avanti» che non copre la domanda. Limite di altezza della home stretto a 11,5 schermate su telefono e 6,5 su desktop.

**Rimandato o fuori dal codice:**
- Valutazione AI dal vivo e scelta del modello sui numeri: serve una chiave Anthropic (`EVAL_LIVE=1 npm run eval:ai`, istruzioni in `docs/COSTI_OPERATIVI.md`). Il modello resta Opus 5.5.
- Campione per il medico revisore: si prepara dall'esito della valutazione dal vivo.
- Titolare, P.IVA, dominio, informativa rivista, medico revisore: senza questi la vetrina non va online.
- La foto del Punto di Partenza ripete quella della home: in `public/media` ci sono solo due pazienti diverse, serve una foto nuova.
- IVA su Capisci (ipotesi 22%) e cambio dollaro/euro: da confermare.

**Problemi critici notati e non toccati (fuori ambito):** CSP con `unsafe-inline`, antivirus assente, circa 700 KB di JavaScript per pagina. Già in `PRODUCT_ROADMAP.md` come debito tecnico.
