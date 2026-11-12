# Stato del progetto — Cura Privata

*Aggiornato: 12/11/2026, ciclo 4. Fonte di verità è il codice: se questo file e il codice non coincidono, vince il codice e questo file va corretto.*

## Obiettivo e pubblico
Servizio digitale italiano che rende comprensibili i referti e, se serve, porta a un medico vero.
Pubblico: adulti italiani con un referto in mano, molti sopra i 55 anni (testo grande, pochi passaggi); i medici devono trovarlo serio.

| Servizio | Prezzo (unica fonte: `src/domain/offerta.ts`) | Chi | Stato nel codice |
|---|---|---|---|
| Punto di Partenza | Gratis | Regole fisse, tutto nel browser | Attivo (`ENABLE_PUNTO_DI_PARTENZA`) |
| Guide (91), glossario (139), Preparati alla visita | Gratis | Contenuti in bozza, da revisionare | Attivi, `noindex` |
| Capisci il tuo referto | Primo 2,90 €, poi 7,90 € | Automatico, nessun medico | Demo; il motore reale è spento dai gate |
| Visita a domicilio con medico generalista | 149 € (`src/domain/prestazioni/listino.ts`) | Medico di medicina generale, a casa, Brescia città (area pilota) | Demo nel browser |
| Videoconsulto con medico generalista | 69 € | Medico di medicina generale/internista, video 20–25 min | Demo nel browser (più il vecchio flusso server) |
| Secondo parere specialistico | 149 € fisso | Specialista: documenti, video, sintesi scritta | Demo nel browser (più il vecchio flusso server) |
| Archivio salute, Prevenzione | — | — | Pagine «In preparazione» con lista d'attesa (solo email) |

Percorso commerciale: Punto di Partenza (gratis) → Capisci → con un medico (a domicilio, in video, secondo parere).
L'elenco dei quattro servizi, nell'ordine del menu, è in `src/domain/prestazioni/offerta-completa.ts`: Servizi, Prezzi e la scelta guidata leggono da lì.

## Architettura
Next.js 16 (App Router, pagine statiche dove possibile) · React 19 · Tailwind 4 · PostgreSQL con RLS (PGlite in locale, Neon in produzione) · Stripe · Claude (lettura foto e spiegazioni) · email Resend/Postmark · deploy previsto su Vercel (regione Francoforte, `docs/DEPLOY.md`).
- Interruttori lato server, fail-closed: `src/lib/feature-flags.ts`. Tutto ciò che tocca dati sanitari reali, soldi o medici richiede anche `PRODUCTION_COMPLIANCE_APPROVED` e `DEMO_MODE` spento.
- L'AI non riceve mai i valori: solo i nomi degli esami; ogni campo è ancorato alla riga del documento; filtro sul linguaggio diagnostico (`src/domain/safety/language.ts`).
- File cifrati AES-256-GCM, audit append-only, 2FA per medici e admin, funnel anonimo per giorno senza cookie (`funnel_daily`).
- Profilo vetrina (ciclo 1): `SITE_PROFILE=vetrina` forza spenti caricamenti, AI, pagamenti veri e servizi medici, e lascia aperte solo le pagine informative e le liste d'attesa. Dal ciclo 2 chiude anche gli account personali (solo account demo condiviso) e porta le azioni dei servizi alla lista d'attesa; ha i suoi e2e (`npm run test:e2e:vetrina`).
- Misura (ciclo 2): contatori anonimi per giorno e per sorgente (`funnel_daily`, `funnel_source_daily`), sezione «Vetrina» in Admin. Nessun cookie.
- Ciclo 3: una visita per scheda (ricariche e ritorni esclusi), robot e anteprime dei link esclusi (`src/domain/metrics/bots.ts`); in vetrina ogni prova finisce con «Avvisami» (`src/components/site/prova-avvisami.tsx`) e Admin mostra «Dopo la prova»; dopo l'accesso si torna alla pagina richiesta (`src/lib/auth/next-path.ts`); un'immagine di condivisione per pagina principale (`src/lib/og.tsx`).

- Prestazioni con un medico (12/11): regole in `src/domain/prestazioni/engine.ts` (funzioni pure), stato nel browser. Il paziente passa da `/richiedi/…` e `/richieste/…` (senza ruoli); la prova a tre ruoli è in `/prova`. Lista d'attesa con CAP per il domicilio; Admin → Vetrina mostra le richieste per CAP (ciclo 4).

## Identità grafica approvata
Palette petrolio `#0C3340`, turchese testo `#00756F`, menta `#7BE0D2` solo come segno, canvas `#F5FAF8`; Manrope ovunque; logo «C» aperta con punto di menta; colori per servizio (menta Capisci, caldo Parla, blu Secondo parere). Dettagli: `docs/cura-privata/DESIGN_SYSTEM.md`.
Foto: solo pazienti, sempre con «Immagine illustrativa»; **mai foto di medici**.

## Decisioni consolidate (non riaprire senza motivo)
- Sotto il titolo resta «medici abilitati e identificabili» (Simone, 11/11). Vietati dai test: «conforme GDPR», «medici qualificati», «professionisti qualificati», «nella norma», «in pochi minuti» (ammesso solo «di norma in pochi minuti» per Capisci).
- Capisci è automatico, senza medico. L'utente non sceglie la specialità per Parla con un medico.
- Home corta (6 blocchi più il doppio ingresso); limite di parole verificato da test.
- Nessun medico, testimonianza, statistica o certificazione inventati. Blocchi «Chi c'è dietro» e profili dei medici compaiono solo con dati veri in configurazione.
- Ordine dei servizi ovunque: Capisci → Parla con un medico → Secondo parere (prezzi crescenti), anche nel payoff «Capisci. Parla con un medico. Chiedi un secondo parere.» (Simone, ciclo 2).
- In vetrina nessuno crea un account personale: si prova solo con l'account demo condiviso (Simone, ciclo 2).
- Comandi toccabili di almeno 44 px su telefono (verificato da `tests/e2e/tocco.spec.ts`).
- Pagine dei tre servizi sotto le 7,3 schermate su telefono; la scheda della home e il «prima e dopo» usano i valori del referto di esempio (ciclo 3, `tests/e2e/pagine-servizio.spec.ts`).
- Ogni servizio compare una volta sola in Servizi e in Prezzi (ciclo 4, `tests/e2e/ciclo4.spec.ts`). Il paziente non vede mai la barra dei ruoli.
- Domicilio e video si chiudono con un riepilogo scritto e un prossimo passo. Annullamento: rimborso intero fino a 2 ore prima (domicilio) o 1 ora prima (video); regola proposta, da confermare con un legale.
- La pagina del domicilio dice che il medico può, se lo ritiene, lasciare una prescrizione su ricetta bianca (approvato il 12/11).
- Prima di ogni PR: `npm run controlli` (stessi passi del workflow GitHub).

## Problemi noti
- Nulla è online: mancano titolare, P.IVA, dominio, informativa rivista, account (Neon, Vercel, Resend, Stripe, Anthropic). Vedi `docs/PRODUCTION_GATES.md`.
- Guide, glossario e Punto di Partenza non hanno revisione medica.
- Nessun medico contrattualizzato.
- Le richieste delle prestazioni con un medico vivono nel browser, non nell'account; videoconsulto e secondo parere hanno due implementazioni (fase 5 del ciclo 4, non approvata).
- Valutazione AI dal vivo mai eseguita: costo e qualità per referto solo stimati in `docs/COSTI_OPERATIVI.md` (serve una chiave Anthropic per misurarli).
- Antivirus sui caricamenti assente; CSP con `script-src 'unsafe-inline'`; nessun penetration test.
- Circa 700 KB di JavaScript (non compresso) anche su pagine quasi statiche.

## Dove guardare
| Cosa | File |
|---|---|
| Cosa impedisce il lancio | `docs/PRODUCTION_GATES.md`, `docs/cura-privata/RISCHI_RESIDUI.md` |
| Stato di ogni funzione | `docs/cura-privata/STATO_FUNZIONI.md` |
| Storia dei cicli | `EVOLUTION_LOG.md` |
| Priorità future | `PRODUCT_ROADMAP.md` |
| Messa online | `docs/DEPLOY.md`, `docs/cura-privata/LANCIO_VETRINA.md` |
| Documenti superati | `docs/archivio/` (solo storico) |
