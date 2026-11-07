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
| 11 | 07/11/2026 | PDF generato lato server con `pdf-lib` e font standard | Nessun browser headless in produzione, output deterministico; caratteri non WinAnsi sostituiti in modo esplicito |
| 12 | 07/11/2026 | Gate: flag `"true"` esatto + `PRODUCTION_COMPLIANCE_APPROVED` + fuori demo | Fail-closed; un errore di configurazione non può accendere funzioni sensibili |
| 13 | 07/11/2026 | Stato demo salvato solo in `sessionStorage` (id sintetici) | Riprendere la demo dopo un refresh senza alcun dato personale |
| 14 | 07/11/2026 | Aggiunta voce «Secondo parere» nel menu principale | È il terzo pilastro del posizionamento; mostra con chiarezza lo stato «in preparazione» |
| 15 | 07/11/2026 | `robots: noindex` su tutto il sito | Versione dimostrativa, da non indicizzare finché copy e note legali non sono approvati |
