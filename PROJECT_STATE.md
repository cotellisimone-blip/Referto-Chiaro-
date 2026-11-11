# Stato del progetto — Cura Privata

*Aggiornato: 11/11/2026, ciclo 1. Fonte di verità è il codice: se questo file e il codice non coincidono, vince il codice e questo file va corretto.*

## Obiettivo e pubblico
Servizio digitale italiano che rende comprensibili i referti e, se serve, porta a un medico vero.
Pubblico: adulti italiani con un referto in mano, molti sopra i 55 anni (testo grande, pochi passaggi); i medici devono trovarlo serio.

| Servizio | Prezzo (unica fonte: `src/domain/offerta.ts`) | Chi | Stato nel codice |
|---|---|---|---|
| Punto di Partenza | Gratis | Regole fisse, tutto nel browser | Attivo (`ENABLE_PUNTO_DI_PARTENZA`) |
| Guide (90), glossario (139), Preparati alla visita | Gratis | Contenuti in bozza, da revisionare | Attivi, `noindex` |
| Capisci il tuo referto | Primo 2,90 €, poi 7,90 € | Automatico, nessun medico | Demo; il motore reale è spento dai gate |
| Parla con un medico | 79 € | Medico di medicina generale/internista, video 20–25 min | Demo |
| Chiedi un secondo parere | da 149 € | Specialista | Demo |
| Archivio salute, Prevenzione | — | — | Pagine «In preparazione» con lista d'attesa (solo email) |

Percorso commerciale: Punto di Partenza (gratis) → Capisci → Parla con un medico → Secondo parere.

## Architettura
Next.js 16 (App Router, pagine statiche dove possibile) · React 19 · Tailwind 4 · PostgreSQL con RLS (PGlite in locale, Neon in produzione) · Stripe · Claude (lettura foto e spiegazioni) · email Resend/Postmark · deploy previsto su Vercel (regione Francoforte, `docs/DEPLOY.md`).
- Interruttori lato server, fail-closed: `src/lib/feature-flags.ts`. Tutto ciò che tocca dati sanitari reali, soldi o medici richiede anche `PRODUCTION_COMPLIANCE_APPROVED` e `DEMO_MODE` spento.
- L'AI non riceve mai i valori: solo i nomi degli esami; ogni campo è ancorato alla riga del documento; filtro sul linguaggio diagnostico (`src/domain/safety/language.ts`).
- File cifrati AES-256-GCM, audit append-only, 2FA per medici e admin, funnel anonimo per giorno senza cookie (`funnel_daily`).
- Profilo vetrina (ciclo 1): `SITE_PROFILE=vetrina` forza spenti caricamenti, AI, pagamenti veri e servizi medici, e lascia aperte solo le pagine informative e le liste d'attesa.

## Identità grafica approvata
Palette petrolio `#0C3340`, turchese testo `#00756F`, menta `#7BE0D2` solo come segno, canvas `#F5FAF8`; Manrope ovunque; logo «C» aperta con punto di menta; colori per servizio (menta Capisci, caldo Parla, blu Secondo parere). Dettagli: `docs/cura-privata/DESIGN_SYSTEM.md`.
Foto: solo pazienti, sempre con «Immagine illustrativa»; **mai foto di medici**.

## Decisioni consolidate (non riaprire senza motivo)
- Sotto il titolo resta «medici abilitati e identificabili» (Simone, 11/11). Vietati dai test: «conforme GDPR», «medici qualificati», «professionisti qualificati», «nella norma», «in pochi minuti» (ammesso solo «di norma in pochi minuti» per Capisci).
- Capisci è automatico, senza medico. L'utente non sceglie la specialità per Parla con un medico.
- Home corta (6 blocchi più il doppio ingresso); limite di parole verificato da test.
- Nessun medico, testimonianza, statistica o certificazione inventati. Blocchi «Chi c'è dietro» e profili dei medici compaiono solo con dati veri in configurazione.
- Ordine dei servizi ovunque: Capisci → Parla con un medico → Secondo parere (prezzi crescenti).

## Problemi noti
- Nulla è online: mancano titolare, P.IVA, dominio, informativa rivista, account (Neon, Vercel, Resend, Stripe, Anthropic). Vedi `docs/PRODUCTION_GATES.md`.
- Guide, glossario e Punto di Partenza non hanno revisione medica.
- Nessun medico contrattualizzato.
- Valutazione AI dal vivo mai eseguita: costo e qualità per referto non misurati (serve una chiave Anthropic).
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
