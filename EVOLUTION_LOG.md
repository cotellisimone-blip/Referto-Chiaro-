# Registro dell'evoluzione — Cura Privata

Un ciclo = analisi, proposta (cinque fasi fino al ciclo 5, poi un elenco di al massimo 20 interventi), approvazione di Simone, esecuzione. Il più recente sta in cima. La storia precedente al ciclo 1 è in `docs/archivio/DECISION_LOG.md`.

## 20 interventi prima del lancio · 17/11/2026

**Base:** ramo `claude/project-thread-1m39rl` @ 1ee46c6 («effetto wow»). **Metodo:** master prompt «20 interventi» V1: un elenco breve, una sola approvazione, poi esecuzione senza altre conferme. **Proposta:** `cura-privata/20-interventi/proposta.md` nella cartella del progetto, con le immagini dei difetti. **Approvazione:** Simone, 17/11 alle 09:15 UTC, tutti e 20 («Approvo tutte»). **Ramo:** `claude/project-thread-8upgos`. **Cliente prioritario:** adulto sopra i 55 anni, da telefono, con un referto in mano.

**Risultato del ciclo:** un sito solo, coerente con le tre sezioni, leggibile da telefono e pronto per essere trovato. **Stato: 19 interventi su 20 completati e verificati, 1 parziale (il 18).**

| N. | Intervento | Modifica | File principali | Prova ed esito | Stato |
|---|---|---|---|---|---|
| 1 | [FUNZIONI / SEO] Una pagina per ogni cosa | `/referti`, `/servizi/prevenzione` e `/con-un-medico` non esistono più: rimandano in modo permanente a `/lettura-referti`, `/prevenzione` e `/medici`. Senza medici `/servizi` porta alla home. La pagina della sezione Lettura referti ha preso dalla vecchia pagina che cosa include, i limiti, le domande e la nota «Versione dimostrativa» | `next.config.ts`, `src/app/lettura-referti/page.tsx`, `src/lib/medici.ts`, `src/domain/ecosystem.ts`, `src/components/site/nav.ts` | `tests/e2e/sito-intero.spec.ts` (i tre rimandi rispondono 308; nessun collegamento interno porta a un rimando), `tests/e2e/senza-medici.spec.ts`. Passano | completato e verificato |
| 2 | [FUNZIONI] «Carica un referto» porta dove promette | Un solo indirizzo (`CARICA_HREF`): primo passo del caricamento; senza sessione, prima l'accesso e poi lì. Uguale da testata, home e sezione. In vetrina porta alla sezione, dove c'è la lista d'attesa | `src/components/site/nav.ts`, `src/domain/offerta.ts`, `src/components/home/home-due-sezioni.tsx` | `tests/e2e/venti-interventi.spec.ts` (punto 2), `tests/e2e/memorabile.spec.ts` (cinque compiti), unitaria. Passano | completato e verificato |
| 3 | [AFFIDABILITÀ] Medici al futuro finché sono «In arrivo» | Sezione Medici, home e domande parlano al futuro con l'interruttore spento («Chi verrà a casa?», «li vedrai prima di pagare»). Anche «Presto anche con un medico» e Stato del progetto dicono «In arrivo» | `src/app/medici/page.tsx`, `src/components/home/home-due-sezioni.tsx`, `src/components/site/presto-medico.tsx` | `sito-intero`: cinque frasi al presente vietate su tutte le pagine con i medici spenti. Passa | completato e verificato |
| 4 | [GRAFICA] Prezzi su computer | Con un solo servizio la scheda è larga, con «Che cosa include» accanto al prezzo; «Senza sorprese» ha il suo spazio | `src/app/prezzi/page.tsx`, `src/components/offerta/offerta.css` | `venti-interventi` (scheda oltre 760 px, elenco visibile) e schermate prima e dopo | completato e verificato |
| 5 | [GRAFICA] Il «prima e dopo» da telefono | Da telefono parte dal foglio spiegato, tutto leggibile, con il bordo del referto di carta a sinistra; le due scritte sotto sono comandi che portano a un foglio o all'altro; il referto originale su telefono è una tabella compatta. Il cursore resta | `src/components/offerta/before-after.tsx`, `src/components/wow/wow.css` | `venti-interventi` (punto 5), `demo-flow` (tastiera), schermate a 360 e 390 px | completato e verificato |
| 6 | [GRAFICA] Una foto diversa per sezione | Home: la donna, con le due schede spostate sotto il viso. Lettura referti: le mani con il foglio. Medici: la scrivania. Sempre «Immagine illustrativa» | `src/app/lettura-referti/page.tsx`, `src/app/medici/page.tsx`, `src/components/sezioni/sezioni.css` | Schermate su computer e telefono; nessuna prova automatica sul soggetto della foto | completato e verificato |
| 7 | [GRAFICA] Barra 1→2→3 | Su telefono la voce attiva non taglia più «Prevenzione»; sui telefoni da 360 px «Medici» non va più a capo; sotto i 340 px spariscono i numeri. Sulle guide è una riga a tutta larghezza | `src/components/sezioni/sezioni.css`, `src/components/guide/guide-article.tsx` | `venti-interventi` (punto 7): 4 pagine a 320, 360, 390 e 412 px, nessuna voce tagliata o spezzata | completato e verificato |
| 8 | [FUNZIONI] Ricerca | Trova le 8 schede degli integratori (gruppo «Guide agli integratori»); non porta più alle pagine unite; senza risultati propone le tre sezioni | `src/lib/search-index.ts`, `src/lib/search-core.ts`, `src/components/search/site-search.tsx` | `tests/unit/venti-interventi.test.ts` (punto 8), `venti-interventi` e2e (punto 8). Passano | completato e verificato |
| 9 | [GRAFICA] Home da telefono più corta | In fondo resta solo la ricerca (le tre porte non si ripetono); schede con «Apri» accanto all'etichetta, foto più bassa, le tre prestazioni dei medici senza descrizione (è nella frase sopra), «Perché fidarsi» su due colonne. Da 10,6 a 9,46 schermate da 844 px | `src/components/home/home-due-sezioni.tsx`, `src/components/sezioni/sezioni.css` | `venti-interventi` (punto 9): sotto 9,5 schermate, una sola serie di porte | completato e verificato |
| 10 | [GRAFICA] Un solo messaggio | «Previeni. Capisci. Un medico, se serve.» in cima, nel piè di pagina, nel titolo del sito e nell'immagine di condivisione, con e senza medici | `src/domain/offerta.ts`, `src/app/layout.tsx`, `src/app/opengraph-image.tsx` | `pages.spec.ts` nei due stati, unitaria | completato e verificato |
| 11 | [GRAFICA] Prima schermata delle guide su computer | «In breve» accanto al titolo; percorso senza doppione («Guide › Emocromo completo») | `src/components/guide/guide-article.tsx`, `src/app/globals.css` | Schermate prima e dopo; `guide.spec.ts` passa | completato e verificato |
| 12 | [SEO] Titoli e descrizioni | Regola unica (`pageTitle`, `metaDescription` in `src/lib/seo.ts`): titolo fino a 65 caratteri, descrizione fino a 160, tagliata a fine parola. Da 48 titoli e 6 descrizioni fuori misura a 0 | `src/lib/seo.ts`, pagine di guide, glossario, integratori e sezioni | `sito-intero` su tutte le pagine (anche titoli doppi), unitaria. Durante il ciclo la prova ha trovato altre 4 descrizioni lunghe, corrette | completato e verificato |
| 13 | [SEO] Canonical, dati strutturati, sitemap | Home con canonical; schede integratori con dati strutturati (articolo e percorso); sitemap con tre sezioni, Strumenti e Integratori, schede solo se revisionate | `src/app/page.tsx`, `src/app/integratori/[slug]/page.tsx`, `src/app/sitemap.ts` | `sito-intero` (canonical su ogni pagina: ne ha trovate 5 senza, corrette), unitaria sulla sitemap | completato e verificato |
| 14 | [SEO] Immagini di condivisione | Una per ciascuna delle tre sezioni | `src/app/{prevenzione,lettura-referti,medici}/opengraph-image.tsx` | `pagine-servizio.spec.ts`: l'immagine esiste ed è un PNG, per 5 pagine | completato e verificato |
| 15 | [SEO / FUNZIONI] Guide e integratori nei due sensi | La guida dell'esame mostra «Tra gli integratori» con la scheda collegata | `src/content/integratori.ts` (`integratoriForGuide`), `src/components/guide/guide-article.tsx` | Unitaria: ogni guida citata da una scheda rimanda a quella scheda | completato e verificato |
| 16 | [GRAFICA] Meno elementi fissi in basso su telefono | Barra «Ho un referto / Aiutami» e «torna su» si fanno da parte mentre si compila un modulo | `src/lib/form-in-view.ts`, `src/components/site/back-to-top.tsx`, `src/components/site/mobile-help-bar.tsx` | `venti-interventi` (punto 16) | completato e verificato |
| 17 | [FUNZIONI] Conferma della lista d'attesa in vista | Dopo l'invio la conferma scorre in vista e riceve il focus | `src/components/site/waitlist-form.tsx` | `senza-medici.spec.ts`: conferma visibile, nello schermo e con il focus | completato e verificato |
| 18 | [AFFIDABILITÀ] CSS più leggero | Tolti 5 componenti non più usati e gli stili di 165 classi morte (`scripts/css-inutilizzati.mjs`); gli stili di Punto di partenza, report, prestazioni e schede dei servizi stanno in fogli propri, caricati solo dove servono. CSS scaricato, non compresso: home, Prevenzione, Lettura referti, guide e integratori da 325 a 227 KB (−30%, obiettivo raggiunto); Medici 235 KB (−28%); Prezzi 245 (−25%); Punto di partenza e Famiglia 246–248 (−24%); referto di esempio 257 (−21%). Compresso: da circa 50 a 43 KB | `src/app/globals.css` e i quattro fogli nuovi, `src/components/home/tre-momenti.css` | Misura sui file compilati; confronto al pixel prima e dopo su 98 schermate (49 pagine, computer e telefono, area personale compresa): 92 identiche, 6 diverse solo per l'orario stampato | parziale: l'obiettivo del −30% è raggiunto sulle pagine più viste, non su quelle che hanno stili propri (−21/−28%). Scendere ancora vuol dire riscrivere `globals.css` per aree, con rischio grafico: non fatto |
| 19 | [AFFIDABILITÀ] Controllo automatico del sito intero | Una prova parte dalla home e segue ogni collegamento: risposta, un solo titolo principale, lunghezze SEO, canonical, frasi contraddittorie, rimandi. Gira con e senza medici | `tests/e2e/_lib/sito-intero.ts`, `tests/e2e/venti-interventi.spec.ts`, `tests/unit/venti-interventi.test.ts` | Passa nei due stati. Ha trovato: 5 pagine senza canonical, 4 descrizioni lunghe; le prove di pagina hanno trovato un foglio che usciva di 6 px a 320 px e un'etichetta misurata a metà dissolvenza nel tema scuro. Tutto corretto | completato e verificato |
| 20 | [AFFIDABILITÀ] Documenti di stato | Questo registro (con i giri dal 13 al 16 novembre, che mancavano) e `PROJECT_STATE.md` a tre sezioni e lancio senza medici | `EVOLUTION_LOG.md`, `PROJECT_STATE.md` | Riletti contro il codice | completato e verificato |

**Test (17/11, `npm run controlli`):** lint e tipi puliti; 282 test unitari (8 nuovi); e2e di lancio su computer e telefono 301 passati e 69 saltati; profilo vetrina 21 passati e 1 saltato; con i medici accesi 145 passati e 7 saltati; vetrina con i medici 13 passati e 1 saltato; 0 falliti. Anteprima navigabile: 38 pagine a 360, 412 e 1440 px senza errori né scorrimento laterale, e un giro al tocco a misura di telefono Android (porte, cursore, caricamento con account demo, lista d'attesa, ricerca).

**Scelte fatte eseguendo (reversibili):** senza medici `/servizi` rimanda alla home in modo temporaneo (307), perché con i medici accesi torna a essere una pagina. La pagina unica di Lettura referti è lunga 9,2 schermate su telefono: riunisce due pagine che insieme ne facevano più di 14. In home, su telefono, le tre prestazioni dei medici mostrano solo il nome.

**Limiti:** l'anteprima navigabile mostra solo la versione di lancio (Medici «In arrivo»); la versione con i medici accesi è provata dai test ma non è nell'anteprima. Il peso del JavaScript non è stato toccato. Nome, sede e partita IVA del titolare restano da inserire.

## Tra il ciclo 5 e i 20 interventi · 13–16/11/2026

Giri fatti su richiesta diretta di Simone, fuori dal metodo dei cicli. Dettagli nei commit indicati.

| Data | Che cosa | Commit |
|---|---|---|
| 13/11 | «Famiglia e salute nel tempo»: numeri nel tempo, familiari, promemoria, foglio per la visita (`docs/cura-privata/FAMIGLIA_E_NEL_TEMPO.md`) | c2a1694 |
| 13/11 | **Decisione: si parte senza medici.** Un solo interruttore, `ENABLE_MEDICI`, tiene spenti visita a domicilio, videoconsulto, secondo parere e portale medico; prove nei due stati | 3e407df, 2b5061d |
| 14–15/11 | Home «I tre momenti» in grafica Carta, pagina Strumenti gratuiti | 3cc3bb3, ce6a2ca |
| 15/11 | Home a due sezioni (Online, A domicilio), prime guide agli integratori, medici di prova | 5acb42e, 5f8177f |
| 15/11 | **Tre sezioni: Prevenzione, Lettura referti, Medici**, con tre porte in home e una pagina per sezione | 39c377f |
| 16/11 | Porte nella prima schermata del telefono, «Perché fidarsi» con segnaposto del titolare, barra 1→2→3, Medici «In arrivo» al lancio | 4d7de1e, b8e0983 |
| 16/11 | «Prima e dopo» con il cursore; 21 abbellimenti «effetto wow» | 1594127, 1ee46c6 |

## Ciclo 5 · 13/11/2026

**Base:** ramo `claude/project-thread-rkexez` @ 93bdc85 (PR #7 «Luce», sopra le PR #6 e #5, tutte aperte). **Metodo:** master prompt «Evoluzione produttiva» v3. **Analisi:** `ANALISI_CICLO_5.md` nella cartella del progetto (`cura-privata/ciclo-5/`). **Approvazione:** Simone, 13/11 alle 14:12 UTC, fasi 1–4 («Approvo tutte, impegnati molto sulla grafica»); la quinta proposta era «nessun intervento giustificato». **Ramo:** `claude/project-thread-huh54j`, PR sopra la #7.

**Ostacolo:** il report a pagamento consegnava meno di quanto la home promette: nessuna barra, nessuna posizione, e per scoprire l'unico valore fuori dall'intervallo stampato bisognava leggere cinque schede.

| Fase | Cosa è cambiato | Stato |
|---|---|---|
| 1. Il report fa vedere subito che cosa guardare | In cima «A colpo d'occhio»: quanti valori, quanti dentro, sopra e sotto l'intervallo stampato, e quali chiedere al medico (un tocco porta alla scheda). Ogni valore è una scheda con barra dell'intervallo, limiti scritti come sul referto e posizione in parole con icona (mai solo colore); prima quelli fuori, già aperti; gli altri si aprono con un tocco, «Apri tutte» per leggerli insieme. Le domande per il medico nominano l'esame. Tutto calcolato dal codice (`src/domain/reporting/glance.ts`), mai dall'AI. Report su telefono: da 9,9 a 5,9 schermate | completata e verificata |
| 2. Dal referto al report senza perdersi, da telefono | Da 7 a 5 tocchi dopo l'accesso. Ogni passo si apre dal suo inizio (prima, dopo «Salva», restava in vista il piè di pagina). Il comando del passo resta attaccato al fondo dello schermo (`.step-bar`, sticky). Prezzo e «Paga … e ricevi il report» in cima al passo del servizio. Dopo il pagamento si arriva direttamente al report, con la nota «Pagamento registrato». Nell'area personale su telefono il piè di pagina è ridotto a marchio, 112 e note legali. Stripe non è stato toccato: cambia solo dove si atterra al ritorno | completata e verificata (con testo grande il comando «Conferma tutti» esce dalla prima schermata; «Salva» e «Paga» restano in vista) |
| 3. Il PDF diventa il foglio per il medico | Prima pagina: «A colpo d'occhio», tabella dei valori con barra e posizione (prima quelli fuori, con bordo scuro, grassetto e triangolo: si leggono anche in bianco e nero), domande per il medico, righe per gli appunti se c'è spazio. Seconda pagina: termini, «In breve e limiti». Referto di esempio: da 3 a 2 pagine | completata e verificata (i referti più lunghi, come emocromo e profilo epatico, restano a 3 pagine) |
| 4. Pagine più leggere su telefoni datati | La ricerca nel browser non porta più con sé guide, glossario e validazione (`src/lib/search-core.ts`): JavaScript trasferito sulla home da 282 a 241 KB (−15%), Referti da 261 a 210, Prezzi da 251 a 197, Guide da 243 a 189 (−22%). Il tempo di blocco su CPU 4× non cambia in modo misurabile (circa 300 ms). Guadagno sotto la soglia di un quarto fissata nell'analisi: fermato qui. Il resto è il peso di React e Next | parzialmente completata |

**Decisioni prese approvando:** a report pronto l'indicatore dei cinque passi non compare (il percorso è finito e il colpo d'occhio sta nella prima schermata). Le schede dei valori dentro l'intervallo nascono chiuse. Le domande sui valori fuori intervallo hanno una forma fissa: «<Esame>: il numero è sopra l'intervallo stampato dal laboratorio. Che cosa significa nel mio caso, se significa qualcosa?» (oltre tre esami dallo stesso lato, una domanda sola senza nomi). Nessun aggettivo clinico: solo «dentro», «sopra», «sotto», «non confrontabile».

**Test (13/11, `npm run controlli`):** lint e tipi puliti, 246 test unitari, e2e desktop e telefono 289 passati e 65 saltati, e2e vetrina 27 passati e 1 saltato, 0 falliti. Aggiornati i golden della spiegazione deterministica (cambia solo la domanda sui valori fuori intervallo). Nuovi: `tests/unit/glance.test.ts`, `tests/e2e/ciclo5.spec.ts`.

**Ipotesi da verificare dopo il lancio:** che «4 dentro, 1 sopra» sia letto come utile e non allarmante (segnali: «Ti è stato utile?» e richieste di videoconsulto dal report).

**Limiti nuovi:** la barra è schematica, non in scala: mostra da che parte del limite sta il numero, non di quanto. Un intervallo stampato in una forma non riconosciuta dà «Non confrontabile» e nessuna barra.

## Ciclo 4 · 12/11/2026 (sera)

**Base:** ramo `claude/project-thread-t5hahw` @ a9306b8 (PR #6 sopra la PR #5, entrambe aperte). **Metodo:** master prompt «Evoluzione produttiva» v3. **Analisi:** `ANALISI_CICLO_4.md` nella cartella del progetto (`cura-privata/ciclo-4/`). **Approvazione:** Simone, 12/11 alle 20:30 UTC, fasi 1–4 («Tutte tranne la 5»).

**Ostacolo:** il sito vendeva quattro servizi ma ne raccontava tre (videoconsulto e secondo parere comparivano due volte in Servizi e Prezzi) e «Richiedi la visita» apriva la prova a tre ruoli.

| Fase | Cosa è cambiato | Stato |
|---|---|---|
| 1. Un'offerta sola | Un solo elenco (`src/domain/prestazioni/offerta-completa.ts`): Capisci, a domicilio, videoconsulto, secondo parere. Servizi: quattro schede illustrate (nuova scena del domicilio) con disponibilità e richiesta diretta. Prezzi: quattro schede con «Che cosa include» richiudibile; su telefono da 9,2 a 6,6 schermate. «Ti aiutiamo a scegliere», ricerca, Chi siamo e Stato del progetto conoscono il domicilio. Il payoff resta | completata e verificata |
| 2. Chiedere la visita da telefono, da paziente | Nuovo percorso `/richiedi/…` e `/richieste/…` senza barra dei ruoli (stessi componenti della prova, `src/components/prestazioni/paths.tsx`); comune e CAP sulla stessa riga, comando del primo passo nella prima schermata; «Che cosa succede ora» in cima alla richiesta; il medico dimostrativo risponde con un comando dichiarato come simulazione (`demoDoctorStep`). La prova a tre ruoli resta in `/prova` | completata e verificata |
| 3. «Avvisami nella mia zona» | Lista d'attesa `domicilio` con CAP (5 cifre, mai un indirizzo; facoltativo per il video): fuori zona, sulla pagina del servizio in vetrina, a fine prova e in Stato del progetto. Admin → Vetrina: riga del domicilio e tabella «richieste per CAP». Eventi `visita-domicilio`, `cta-domicilio`, `avvisami-domicilio` | completata e verificata (la tabella per CAP in Admin è verificata dai test unitari della lista, non nel browser) |
| 4. Che cosa ti resta dopo la visita | Domicilio e video si chiudono solo con un riepilogo scritto; il medico indica il prossimo passo (5 voci fisse) e, per il domicilio, se ha lasciato una prescrizione su ricetta bianca. Il paziente vede riepilogo, prossimo passo con un'azione, ricevuta dimostrativa, stampa. Annullamento scritto prima di pagare | completata e verificata |

**Decisioni prese approvando:** la pagina del domicilio dice che il medico, se lo ritiene dopo la visita, può lasciare una prescrizione su ricetta bianca (restano esclusi certificati di malattia e ricette del Servizio sanitario). Regola di annullamento proposta, modificabile in un punto (`CANCEL_FREE_MINUTES`): rimborso intero fino a 2 ore prima del domicilio e 1 ora prima del video; oltre, nessun rimborso; se annulla il medico, rimborso sempre.

**Test (12/11, a fine ciclo):** vedi la PR #6.

**Non approvata:** fase 5, richieste salvate nell'account (oggi restano nel browser; videoconsulto e secondo parere hanno ancora due implementazioni).

**Dipendenze future (una volta sola):** regola di annullamento e ricetta bianca da confermare con legale e medici prima dell'apertura (`docs/cura-privata/PRESTAZIONI_CON_MEDICO.md`). Confronto prezzi con le alternative non aggiornato in questo ciclo.

## Intervento «Medico a domicilio» · 12/11/2026

Fuori ciclo, da un prompt diretto del titolare: visita a domicilio 149 €, videoconsulto 69 €, secondo parere 149 € fisso, prova a tre ruoli in `/prova`. Dettagli in `docs/cura-privata/PRESTAZIONI_CON_MEDICO.md`. Commit d796626, a9306b8.

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
