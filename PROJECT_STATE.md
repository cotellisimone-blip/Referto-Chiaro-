# Stato del progetto — Cura Privata

*Aggiornato: 18/11/2026, dopo il secondo giro di «20 interventi». Fonte di verità è il codice: se questo file e il codice non coincidono, vince il codice e questo file va corretto.*

## Obiettivo e pubblico
Servizio digitale italiano in tre sezioni: **1 Prevenzione** (che cosa conoscere prima degli esami), **2 Lettura referti** (il referto in parole semplici), **3 Medici** (una persona, quando serve). Messaggio unico: «Previeni. Capisci. Un medico, se serve.»
Pubblico: adulti italiani con un referto in mano, molti sopra i 55 anni e da telefono (testo grande, pochi passaggi); i medici devono trovarlo serio.

**Stato di lancio (decisione del titolare, 13/11): si parte senza medici.** La sezione Medici c'è, «In arrivo», al futuro e senza prezzi, con la lista d'attesa per CAP. Un solo interruttore, `ENABLE_MEDICI` (`src/lib/medici.ts`), riaccende visita a domicilio, videoconsulto, secondo parere e portale medico quando ci saranno i contratti.

| Sezione | Pagina | Che cosa contiene | Prezzo (unica fonte: `src/domain/offerta.ts`) | Stato nel codice |
|---|---|---|---|---|
| 1 Prevenzione | `/prevenzione` | Punto di Partenza, 96 guide (91 agli esami, in bozza, e 5 pratiche: ricetta, cartella clinica, referti online, fotografare, conservare), 8 guide agli integratori, glossario (139 termini), promemoria, strumenti per la visita | Gratis | Attiva; contenuti in bozza, `noindex` finché non sono revisionati |
| 2 Lettura referti | `/lettura-referti` | «Capisci il tuo referto»: caricamento, controllo dei valori, spiegazione, PDF per il medico; area personale con numeri nel tempo, famiglia, dossier | Primo referto 2,90 €, poi 7,90 € | Demo; il motore reale è spento dai gate |
| 3 Medici | `/medici` | Al lancio: «In arrivo», lista d'attesa con CAP. Con `ENABLE_MEDICI`: visita a domicilio 149 €, videoconsulto 69 €, secondo parere 149 € (`src/domain/prestazioni/listino.ts`), prova a tre ruoli in `/prova` | Nessun prezzo al lancio | Spenta; il codice resta e ha le sue prove (`tests/e2e-medici`) |

Ogni cosa ha una pagina sola. I vecchi indirizzi `/referti`, `/servizi/prevenzione` e `/con-un-medico` rimandano alle tre sezioni (`next.config.ts`); senza medici `/servizi` porta alla home e le pagine dei servizi con un medico portano a `/medici`.

## Architettura
Next.js 16 (App Router, pagine statiche dove possibile) · React 19 · Tailwind 4 · PostgreSQL con RLS (PGlite in locale, Neon in produzione) · Stripe · Claude (lettura foto e spiegazioni) · email Resend/Postmark · deploy previsto su Vercel (regione Francoforte, `docs/DEPLOY.md`).
- Interruttori lato server, fail-closed: `src/lib/feature-flags.ts`. Tutto ciò che tocca dati sanitari reali, soldi o medici richiede anche `PRODUCTION_COMPLIANCE_APPROVED` e `DEMO_MODE` spento.
- L'AI non riceve mai i valori: solo i nomi degli esami; ogni campo è ancorato alla riga del documento; filtro sul linguaggio diagnostico (`src/domain/safety/language.ts`).
- File cifrati AES-256-GCM, audit append-only, 2FA per medici e admin, funnel anonimo per giorno senza cookie (`funnel_daily`).
- Profilo vetrina (ciclo 1): `SITE_PROFILE=vetrina` forza spenti caricamenti, AI, pagamenti veri e servizi medici, e lascia aperte solo le pagine informative e le liste d'attesa. Dal ciclo 2 chiude anche gli account personali (solo account demo condiviso) e porta le azioni dei servizi alla lista d'attesa; ha i suoi e2e (`npm run test:e2e:vetrina`).
- Misura (ciclo 2): contatori anonimi per giorno e per sorgente (`funnel_daily`, `funnel_source_daily`), sezione «Vetrina» in Admin. Nessun cookie.
- Ciclo 3: una visita per scheda (ricariche e ritorni esclusi), robot e anteprime dei link esclusi (`src/domain/metrics/bots.ts`); in vetrina ogni prova finisce con «Avvisami» (`src/components/site/prova-avvisami.tsx`) e Admin mostra «Dopo la prova»; dopo l'accesso si torna alla pagina richiesta (`src/lib/auth/next-path.ts`); un'immagine di condivisione per pagina principale (`src/lib/og.tsx`).

- Tre sezioni (15–17/11): home `src/components/home/home-due-sezioni.tsx`, parti comuni in `src/components/sezioni/`, veste «Carta» (`tre-momenti.css`, `sezioni.css`, `wow.css`). Gli stili di Punto di partenza, report, prestazioni e schede dei servizi stanno in fogli propri, importati dai componenti che li usano (`pdp.css`, `report.css`, `prestazioni.css`, `offerta.css`): uno stile nuovo per una sola area va lì, non in `globals.css`.
- SEO (17/11): titoli e descrizioni passano da `pageTitle` e `metaDescription` (`src/lib/seo.ts`); ogni pagina pubblica dichiara il canonical; la sitemap elenca tre sezioni, Strumenti, Integratori e solo i contenuti revisionati. Indicizzazione spenta finché `ENABLE_INDEXING` non è «true».
- Prestazioni con un medico (12/11): regole in `src/domain/prestazioni/engine.ts` (funzioni pure), stato nel browser. Il paziente passa da `/richiedi/…` e `/richieste/…` (senza ruoli); la prova a tre ruoli è in `/prova`. Lista d'attesa con CAP per il domicilio; Admin → Vetrina mostra le richieste per CAP (ciclo 4).

## Identità grafica approvata
Palette petrolio `#0C3340`, turchese testo `#00756F`, menta `#7BE0D2` solo come segno, carta calda; Manrope per i testi, Fraunces per i titoli delle sezioni; logo «C» aperta con punto di menta; colori per servizio (menta Capisci, caldo Parla, blu Secondo parere). Dettagli: `docs/cura-privata/DESIGN_SYSTEM.md`.
Foto: solo pazienti, sempre con «Immagine illustrativa»; **mai foto di medici**, mai immagini generate presentate come persone vere. Una foto diversa per sezione (17/11).

## Decisioni consolidate (non riaprire senza motivo)
- Sotto il titolo resta «medici abilitati e identificabili» (Simone, 11/11). Vietati dai test: «conforme GDPR», «medici qualificati», «professionisti qualificati», «nella norma», «in pochi minuti» (ammesso solo «di norma in pochi minuti» per Capisci).
- Capisci è automatico, senza medico. L'utente non sceglie la specialità per Parla con un medico.
- Home: tre porte in cima, una sezione per ciascuna, domande, ricerca. Su telefono sotto le 9,5 schermate e senza porte ripetute in fondo (`tests/e2e/venti-interventi.spec.ts`); limite di parole verificato da test.
- Nessun medico, testimonianza, statistica o certificazione inventati. Blocchi «Chi c'è dietro» e profili dei medici compaiono solo con dati veri in configurazione.
- Ordine ovunque: Prevenzione → Lettura referti → Medici. Payoff unico, con e senza medici: «Previeni. Capisci. Un medico, se serve.» (17/11; sostituisce quello del ciclo 2).
- Finché i medici sono «In arrivo» il sito ne parla al futuro e senza prezzi; nessuna frase al presente (`tests/e2e/_lib/sito-intero.ts`).
- «Carica un referto» porta sempre al primo passo del caricamento (`CARICA_HREF` in `src/components/site/nav.ts`).
- Il «prima e dopo» resta un cursore da trascinare (Simone, 16/11); da telefono parte dal foglio spiegato.
- In vetrina nessuno crea un account personale: si prova solo con l'account demo condiviso (Simone, ciclo 2).
- Comandi toccabili di almeno 44 px su telefono (verificato da `tests/e2e/tocco.spec.ts`).
- Pagina di Lettura referti sotto le 9,5 schermate su telefono (riunisce due pagine); pagine dei servizi con un medico sotto le 7,3; la scheda della home e il «prima e dopo» usano i valori del referto di esempio (ciclo 3, `tests/e2e/pagine-servizio.spec.ts`).
- Ogni servizio compare una volta sola in Servizi e in Prezzi (ciclo 4, `tests/e2e/ciclo4.spec.ts`). Il paziente non vede mai la barra dei ruoli.
- Domicilio e video si chiudono con un riepilogo scritto e un prossimo passo. Annullamento: rimborso intero fino a 2 ore prima (domicilio) o 1 ora prima (video); regola proposta, da confermare con un legale.
- La pagina del domicilio dice che il medico può, se lo ritiene, lasciare una prescrizione su ricetta bianca (approvato il 12/11).
- Il report apre con «A colpo d'occhio»; la posizione rispetto all'intervallo stampato è calcolata dal codice (`src/domain/reporting/glance.ts`), mai dall'AI, e si dice solo con «dentro», «sopra», «sotto», «non confrontabile». Prima i valori fuori intervallo; report su telefono sotto le 6 schermate (ciclo 5, `tests/e2e/ciclo5.spec.ts`).
- Dal referto al report: cinque tocchi, comando del passo attaccato al fondo dello schermo su telefono, dopo il pagamento si atterra sul report (ciclo 5).
- Il PDF è «il foglio per il medico»: valori, posizione e domande in prima pagina.
- Prima di ogni PR: `npm run controlli` (stessi passi del workflow GitHub). Il controllo del sito intero (`sito-intero`) percorre tutte le pagine: se una pagina nuova non ha titolo, descrizione o canonical a misura, fallisce.
- Ogni consegna a Simone comprende un'anteprima navigabile nuova, provata a misura di telefono Android (360–412 px).
- Secondo giro (18/11): l'azione principale si chiama sempre «Carica un referto» ed è il pulsante verde petrolio pieno; su telefono nessun testo sotto i 14 px (`tests/e2e/secondo-giro.spec.ts`); il sito non vanta dati mai misurati («le più consultate»: frasi vietate in `sito-intero`); la ricerca non mostra risultati «a caso» (per somiglianza solo da 5 lettere); la foto d'apertura passa da `Photo priority`, che non la fa precaricare alle altre pagine; ogni pagina pubblica ha immagine di condivisione e dati strutturati (`PageLd`), senza voti né recensioni; la data delle pagine nella sitemap è `PAGES_UPDATED` in `src/lib/seo.ts`, da aggiornare a mano quando cambiano i testi.
- Guide pratiche (`practical: true`, `src/content/guides/categorie/pratiche.ts`): senza contenuto clinico, sono le sole indicizzabili prima della revisione medica (`NON_CLINICAL_GUIDES`). Solo fonti ufficiali lette davvero; dove la regola cambia per Regione, lo si dice.

## Problemi noti
- Nulla è online: mancano titolare, P.IVA, dominio, informativa rivista, account (Neon, Vercel, Resend, Stripe, Anthropic). Vedi `docs/PRODUCTION_GATES.md`.
- Guide, glossario e Punto di Partenza non hanno revisione medica.
- Nessun medico contrattualizzato.
- Le richieste delle prestazioni con un medico vivono nel browser, non nell'account; videoconsulto e secondo parere hanno due implementazioni (fase 5 del ciclo 4, non approvata).
- Valutazione AI dal vivo mai eseguita: costo e qualità per referto solo stimati in `docs/COSTI_OPERATIVI.md` (serve una chiave Anthropic per misurarli).
- Antivirus sui caricamenti assente; CSP con `script-src 'unsafe-inline'`; nessun penetration test.
- JavaScript: 190–240 KB trasferiti per pagina dopo il ciclo 5; il resto è React e Next, non si riduce senza cambiare architettura. CSS: 227 KB non compressi (43 compressi) su home, sezioni e guide dopo i 20 interventi (erano 325); fino a 257 sulle pagine con stili propri.
- Le guide agli integratori (8) non hanno revisione medica: fuori da sitemap e indici come le guide cliniche.
- Caratteri: Fraunces pesa 100 KB in due file; per scendere di altri 50 KB bisogna togliere la dimensione ottica (cambia la forma delle lettere): scelta grafica di Simone, non fatta (secondo giro, punto 20).
- Pagina di errore (`src/app/error.tsx`) e icona sulla schermata Home (`src/app/manifest.ts`) non sono provate su un dispositivo reale; dati strutturati e immagini di condivisione vanno provati con gli strumenti di Google e con WhatsApp quando il sito sarà online.
- Le cinque guide pratiche vanno rilette dal titolare; «Fotografare un referto» non ha fonte esterna.
- La pagina Prezzi mostra ancora la scheda «Cura Privata Famiglia, 39 €/anno, in proposta»: decisione di Simone.
- Nome, sede e partita IVA del titolare mancano: «Perché fidarsi» mostra il segnaposto finché non sono in configurazione (`PUBLIC_OWNER_*`).

## Dove guardare
| Cosa | File |
|---|---|
| Cosa impedisce il lancio | `docs/PRODUCTION_GATES.md`, `docs/cura-privata/RISCHI_RESIDUI.md` |
| Stato di ogni funzione | `docs/cura-privata/STATO_FUNZIONI.md` |
| Storia dei cicli | `EVOLUTION_LOG.md` |
| Priorità future | `PRODUCT_ROADMAP.md` |
| Messa online | `docs/DEPLOY.md`, `docs/cura-privata/LANCIO_VETRINA.md` |
| Documenti superati | `docs/archivio/` (solo storico) |
