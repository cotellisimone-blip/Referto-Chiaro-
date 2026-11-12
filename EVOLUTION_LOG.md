# Registro dell'evoluzione — Cura Privata

Un ciclo = analisi, cinque fasi proposte, approvazione di Simone, esecuzione. Il più recente sta in cima. La storia precedente al ciclo 1 è in `docs/archivio/DECISION_LOG.md`.

## Ciclo 3 · 12/11/2026

**Base:** ramo `claude/project-thread-oi7sjf` @ 17e0daa (fine ciclo 2, PR #4 impilata sulla PR #3, entrambe aperte). **Analisi:** `ANALISI_CICLO_3.md` nella cartella del progetto (`cura-privata/ciclo-3/`). **Approvazione:** Simone, 12/11 alle 08:29 UTC, tutte e cinque le fasi. **Ramo:** `claude/project-thread-2y3p3f`, una sola PR verso `main` che contiene anche i cicli 1 e 2 (sostituisce le PR #1–#4).

| Fase | Cosa è cambiato | Commit |
|---|---|---|
| 1. Dalla prova all'iscrizione | In vetrina, alla fine del referto di esempio, in fondo all'area demo e dopo il pagamento simulato compare «Avvisami quando parte» con il servizio provato già scelto (prima la prova finiva senza un modo per iscriversi). «Ti è stato utile?» ha due risposte, contate in forma anonima. Dopo l'iscrizione: Punto di Partenza e Preparati alla visita. Admin: tabella «Dopo la prova». Fuori dalla vetrina l'esempio finisce con «Rendi chiaro il mio referto» | e6824f5 |
| 2. Entrare e ritrovarsi da telefono | L'accesso riporta alla pagina richiesta (prima «Prenota il videoconsulto» portava a «I tuoi referti»), anche dal link via email; solo percorsi interni dell'area. Area personale: prima il prossimo passo, poi il riepilogo in una riga al posto di quattro tessere. Report: valore e unità sulla stessa riga su telefono | 4dc6d4c |
| 3. Pagine dei servizi più corte e coerenti | Su telefono: Capisci da 8.342 a 5.936 px, Parla con un medico da 6.420 a 5.929, Secondo parere da 6.086 a 5.567. Tolto il blocco «Un foglio chiaro» che ripeteva il «prima e dopo». La scheda della home e il «prima e dopo» usano il referto di esempio (glicemia 92, LDL 134; prima la home diceva glicemia 104). Immagine di condivisione propria per 5 pagine | 0011d98 |
| 4. Numeri della vetrina affidabili | Una visita per scheda (non contano ricariche, ritorni, stessa pagina rivista); robot, anteprime dei link e browser automatici esclusi; limite di frequenza condiviso tra istanze con l'impronta dell'indirizzo | ea1e634 |
| 5. Una sola strada verso il lancio | `npm run controlli` (stessi passi di GitHub, con riepilogo); il workflow GitHub usa lo stesso comando. PR unica del ciclo 3 verso `main`; PR #1–#4 chiuse perché contenute | questo commit |

**Test (12/11, `npm run controlli`):** lint e tipi puliti, 205 test unitari, e2e desktop e telefono 253 passati e 61 saltati, e2e vetrina 25 passati e 1 saltato, 0 falliti. Nuovi test: `tests/e2e-vetrina/prova-avvisami.spec.ts`, `tests/e2e/ritorno.spec.ts`, `tests/e2e/pagine-servizio.spec.ts`, `tests/e2e/contatori.spec.ts`, `tests/unit/next-path.test.ts`, `tests/unit/bots.test.ts`.

**Decisioni prese approvando:** una sola PR verso `main` con tutto il lavoro; PR #1–#4 chiuse (si possono riaprire). Su telefono la pagina Capisci mostra la trasformazione del referto solo nel cursore «prima e dopo».

**Controlli GitHub:** sulla PR #4 non erano partiti; sulla PR #5 partono. Le prime due esecuzioni sono fallite su test della testata su telefono (clic prima che la pagina fosse interattiva): corretto con `html[data-ready]` e `tests/e2e/_lib/ready.ts` (4858a4c), poi verde.

**Rimandato o fuori dal codice:** chiavi del limitatore di accesso con IP in chiaro (`auth:<ip>`, cancellate dopo un giorno): da passare a un'impronta prima dei referti veri. Restano quelli dei cicli 1 e 2 (titolare, P.IVA, dominio, informativa, medico revisore, chiave Anthropic, doppio opt-in).

## Ciclo 2 · 11/11/2026

**Base:** ramo `claude/project-thread-ut46xc` @ 059347a (fine ciclo 1, PR #3 ancora aperta). **Analisi:** `ANALISI_CICLO_2.md` nella cartella del progetto (`cura-privata/ciclo-2/`). **Approvazione:** Simone, 11/11 alle 21:07 UTC, tutte e cinque le fasi. **Ramo:** `claude/project-thread-oi7sjf`.

| Fase | Cosa è cambiato | Commit |
|---|---|---|
| 1. Vetrina sicura | In vetrina la richiesta di accesso con un'email vera risponde «registrazione chiusa» e non salva indirizzo né consensi (prima `DEMO_MODE` lasciava registrare qualsiasi indirizzo, con consenso sanitario e link a schermo). `/accedi` in vetrina: solo account demo e lista d'attesa. Azione principale dei tre servizi, di `/prezzi` e di «Ti aiutiamo a scegliere» = «Avvisami quando parte» sulla pagina del servizio, con la prova senza registrazione accanto. L'account demo riceve un referto inventato se è vuoto. `npm run test:e2e:vetrina` (build in `.next-vetrina`) | 08857de |
| 2. Misurare la vetrina | Sorgente della visita (utm_source o provenienza, 9 valori fissi) senza cookie né storage; eventi visita servizio, esempio completato, PDF di esempio, «Avvisami» per servizio; `funnel_source_daily` e `waitlist.source` (migrazione 8); sezione «Vetrina» in Admin → Panoramica (per settimana, per sorgente, per servizio) | 401abfe |
| 3. Messaggio unico | Payoff «Capisci. Parla con un medico. Chiedi un secondo parere.» (titolo e fondo pagina, `PAYOFF` in `offerta.ts`); scheda «Il tuo report» sulla spalla, non più sul viso; titolo che va a capo tra 1024 e 1279 px; su telefono tolte le immagini doppie e il prezzo dal doppio ingresso; home su telefono da 9.272 a 7.994 px; niente «.it» senza dominio; Punto di Partenza «3 su 10» | 295346d |
| 4. Tocchi da 44 px | L'indice A–Z e il filtro del glossario esistevano già (errore dell'analisi). Fatto: pulsanti della testata a 44 px (sotto i 390 px testo grande e tema vanno nel menu), link di percorso, termini, guide e fonti a 44 px, due righe di definizione per voce del glossario su telefono (31.944 → ~25.200 px) | 74da33f |
| 5. Controlli automatici | `npm run typecheck` funziona da clone pulito (`next typegen`); workflow `.github/workflows/controlli.yml` su PR e su main | 55a35b2 |

**Test (11/11, a fine ciclo):** lint senza errori, typecheck pulito, 200 test unitari, e2e desktop e telefono 229 passati e 51 saltati, e2e vetrina 17 passati e 1 saltato (l'unico salto: il controllo admin gira solo su desktop perché i codici 2FA sono monouso). Screenshot prima/dopo in `cura-privata/ciclo-2/screenshot-prima-dopo/`.

**Decisioni prese approvando:** in vetrina nessun account personale (solo l'account demo condiviso); il payoff segue l'ordine dei servizi.

**Rimandato o fuori dal codice:** quelli del ciclo 1 (titolare, P.IVA, dominio, informativa, medico revisore, chiave Anthropic). Doppio opt-in della lista d'attesa: serve un servizio email. Il workflow GitHub va verificato alla prima esecuzione sulla PR.

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
