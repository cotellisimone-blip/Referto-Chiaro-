# Registro delle decisioni (ADR sintetici)

| # | Data | Decisione | Motivo |
|---|---|---|---|
| 1 | 07/11/2026 | Next.js 16.4 App Router, React 19.3, TypeScript strict, Tailwind 4 | Stack indicato dal kit; versioni stabili verificate all'installazione e bloccate nel lockfile |
| 2 | 07/11/2026 | Lasciate attive Cache Components e Partial Prefetching (default di Next 16) | Pagine marketing statiche e veloci; le API dinamiche usano `connection()` o sono POST |
| 3 | 07/11/2026 | Niente shadcn/Radix in questa fase | Le fasi 1–2 non richiedono dialoghi o menu complessi; componenti propri leggeri e accessibili. Radix andrà introdotto per modali/menu dell'area utente |
| 4 | 07/11/2026 | Font Fraunces + DM Sans **self-hosted** da `@fontsource` (licenza OFL) | Nessuna chiamata a Google Fonts (privacy), resa editoriale calda + sans leggibile |
| 5 | 07/11/2026 | Palette del kit con due aggiunte: `sage-deep #3E6E59` e `muted #4A5C66` | `sage #5E967E` ha contrasto ~3.3:1, insufficiente per testo piccolo; usato solo come decorazione |
| 6 | 07/11/2026 | Nuovo logo originale: foglio con angolo piegato che diventa bolla di dialogo, con check | Il kit chiede bolla + check + luce e un segno nuovo, non la copia di uno precedente |
| 7 | 07/11/2026 | Hero: «I tuoi referti, finalmente comprensibili.» invece di «Dal referto alla tua vita quotidiana» | Più concreto e verificabile; il payoff storico «Non facciamo diagnosi: facciamo chiarezza» è nel footer |
| 8 | 07/11/2026 | Fixture con 6 voci: aggiunti Colesterolo LDL (fuori dall'intervallo stampato) e Trigliceridi illeggibile | Mostrare in demo la descrizione neutra fuori intervallo e il blocco dei dati illeggibili |
| 9 | 07/11/2026 | Posizione rispetto all'intervallo descritta solo con frasi neutre, senza colori | Il kit vieta codici rosso/giallo/verde e giudizi clinici |
| 10 | 07/11/2026 | Controllo numerico anche sul testo libero (allowlist dei numeri presenti nelle righe confermate + 112) | Impedisce che una spiegazione futura generata da AI introduca valori assenti |
| 11 | 07/11/2026 | PDF generato lato server con `pdf-lib`; dalla fase 1 grafica con i font del sito via `@pdf-lib/fontkit` (fallback ai font standard) | Nessun browser headless in produzione, output deterministico; caratteri fuori sottoinsieme sostituiti in modo esplicito |
| 12 | 07/11/2026 | Gate: flag `"true"` esatto + `PRODUCTION_COMPLIANCE_APPROVED` + fuori demo | Fail-closed; un errore di configurazione non può accendere funzioni sensibili |
| 13 | 07/11/2026 | Stato demo salvato solo in `sessionStorage` (id sintetici) | Riprendere la demo dopo un refresh senza alcun dato personale |
| 14 | 07/11/2026 | Aggiunta voce «Secondo parere» nel menu principale | È il terzo pilastro del posizionamento; mostra con chiarezza lo stato «in preparazione» |
| 15 | 07/11/2026 | `robots: noindex` su tutto il sito | Versione dimostrativa, da non indicizzare finché copy e note legali non sono approvati |
| 16 | 07/11/2026 | Tema scuro ottenuto ridefinendo i token CSS, non duplicando le utility | Ogni componente eredita; i colori letterali (`bg-ink text-white`, esadecimali) sono stati sostituiti dai token `strong/on-strong/warn` |
| 17 | 07/11/2026 | Illustrazioni originali astratte (fogli, righe, bolle, spunte), niente foto, volti o simboli medici | Coerenza con il logo, nessun materiale di stock, nessuna promessa clinica implicita |
| 18 | 07/11/2026 | Animazioni d'ingresso solo su elementi decorativi e solo in trasformazione (mai opacità sul testo) | axe misura il contrasto durante le animazioni; gli screenshot e la stampa non devono dipendere dal tempo |
| 19 | 07/11/2026 | Font del PDF come istanze statiche TTF (400/600) generate con fontTools, sottoinsieme latino (~30 KB l'una) | `pdf-lib` non gestisce gli assi variabili; file piccoli nel repo |
| 20 | 07/11/2026 | PostgreSQL con Row-Level Security; senza `DATABASE_URL` parte PGlite embedded | Isolamento per utente imposto dal database, non solo dal codice; demo e test senza servizi esterni |
| 21 | 07/11/2026 | Accesso con link via email (magic link), niente password | Meno dati da proteggere; in demo il link è mostrato a schermo perché non c'è un servizio email |
| 22 | 07/11/2026 | Job eseguiti a richiesta nelle API di lettura («tick»), nessun processo separato | Stati reali (coda → elaborazione → pronto/errore) senza infrastruttura aggiuntiva; sostituibile con una coda vera |
| 23 | 07/11/2026 | Dossier: confronto solo fra esami con stesso nome normalizzato e stessa unità, tutti confermati | Evita confronti fra esami diversi o fra metodi diversi; la differenza è riportata senza alcun giudizio |
| 24 | 07/11/2026 | Un solo driver DB per processo (`globalThis`) | Next.js impacchetta i moduli in più chunk: due istanze PGlite sulla stessa cartella vedevano dati diversi |
| 25 | 07/11/2026 | Header: «Accedi» diventa «Area personale» con una chiamata leggera a `/api/v1/auth/me` | Le pagine pubbliche restano statiche; il header non dipende dai cookie lato server |
| 26 | 07/11/2026 | Provider di pagamento scelto dal formato della chiave; senza chiave pagamento simulato in-app, chiave live solo con gate | Provare il flusso completo senza soldi veri; impossibile attivare addebiti reali per errore di configurazione |
| 27 | 07/11/2026 | Il report nasce solo da un ordine pagato (402 altrimenti), anche in demo | Il percorso di acquisto è quello reale; il pagamento simulato costa un clic |
| 28 | 07/11/2026 | TOTP implementato con `node:crypto` (RFC 6238) invece di una libreria | 60 righe testate contro i vettori RFC; nessuna dipendenza in più nel perimetro di sicurezza |
| 29 | 07/11/2026 | Portali medico/admin: gate client (`RoleGate`) + controllo vero nelle API (`requireRole` con 2FA) | Le pagine restano statiche; nessun dato riservato arriva senza ruolo e seconda verifica |
| 30 | 07/11/2026 | Il medico legge il referto tramite una lettura di sistema dopo il controllo RLS sul caso, con audit | La RLS resta «solo il proprietario»; l'accesso del medico è esplicito e tracciato |
| 31 | 07/11/2026 | Parere firmato con conferma di responsabilità e impronta SHA-256 (caso, medico, ora, testo), non modificabile | Valore probatorio minimo e verificabile; la firma qualificata arriverà con il servizio reale |
| 32 | 07/11/2026 | Secondo parere sempre `is_simulated` finché il gate `medicalSecondOpinion` è chiuso; solo referti sintetici | Nessun dato reale e nessun medico reale in demo, detto in ogni pagina |
| 33 | 07/11/2026 | CSP con `script-src 'unsafe-inline'` | Le pagine statiche (Cache Components) non possono usare nonce per richiesta; limite documentato nei gate |
| 34 | 07/11/2026 | Guide e glossario come dati tipizzati (zod) in `src/content`, non Markdown/CMS | Validazione automatica di struttura e linguaggio a ogni test; pagine statiche; nessuna dipendenza in più |
| 35 | 07/11/2026 | Lista di frasi vietate (diagnosi, «normale/anormale», terapie, promesse) applicata a tutto il testo pubblico | I contenuti spiegano che cosa misura un esame, mai che cosa significa per una persona: il limite è verificato dalla macchina, non solo dichiarato |
| 36 | 07/11/2026 | Indicizzazione dietro `ENABLE_INDEXING="true"`: noindex, robots disallow e sitemap vuota per default | Nessun contenuto non revisionato può finire nei motori per una configurazione mancante |
| 37 | 07/11/2026 | Fonti ammesse solo da domini istituzionali (ISS, Ministero, AIFA, OMS, NHS, MedlinePlus) e solo URL di indice | Nessun link inventato: la verifica puntuale delle fonti spetta alla revisione medica |
| 38 | 07/11/2026 | Glossario pubblico separato dal glossario interno dei report | I testi generati nei report restano sotto controllo di coerenza; il glossario pubblico è divulgativo e più ampio |
| 39 | 07/11/2026 | Testo base 18px, pulsanti 52–60px, pulsante «Aa» per testo più grande (ricordato nel browser) | Pubblico con età media alta: leggibilità e bersagli ampi prima dell'estetica |
| 40 | 07/11/2026 | Home ridotta a 6 sezioni con frasi brevi; tabella di confronto, «problema», «a chi serve» e FAQ spostati o tolti | Meno testo da leggere; una sola azione chiara per volta («Esplora un referto di esempio») |
| 41 | 07/11/2026 | Rivelazione allo scorrimento (`Reveal`) con sola traslazione, mai opacità sul testo; niente animazione se già visibile o con reduced-motion | Il testo resta sempre leggibile e misurabile (axe, screenshot, stampa); senza JavaScript non cambia nulla |
| 42 | 07/11/2026 | Header con soglie dipendenti dalla dimensione del testo (menu compatto fino a 1279px con testo grande; «Prova la demo» solo da 1500px) | Nessun overflow orizzontale in nessuna combinazione larghezza × dimensione testo, verificato da test |
