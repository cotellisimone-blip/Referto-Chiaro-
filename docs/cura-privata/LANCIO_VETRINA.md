# Lancio come vetrina — checklist di una pagina
*Ciclo 1, 11/11/2026*

**Che cosa è.** Il sito online con il profilo `SITE_PROFILE=vetrina`: pagine informative, prezzi, Punto di Partenza, guide, «Preparati alla visita», referto di esempio e liste d'attesa (solo email). Nessun referto vero, nessuna AI, nessun pagamento (nemmeno di test), nessun medico. Serve a misurare la domanda prima della conformità.

**Che cosa garantisce il codice** (test in `tests/unit/feature-flags.test.ts`, `payments.test.ts`, `seo.test.ts`):
- il profilo forza la demo e spegne caricamenti, AI, pagamenti, servizi medici, registrazione e salvataggio del Punto di Partenza, anche se un interruttore fosse acceso per errore;
- il checkout è sempre simulato, anche con una chiave Stripe configurata;
- **nessun account personale** (ciclo 2): la richiesta di accesso con un'email vera risponde «registrazione chiusa» e non salva né l'indirizzo né i consensi; si prova solo con l'account demo condiviso, che contiene già un referto inventato. Su `/accedi` il modulo email è sostituito dalla lista d'attesa;
- l'azione principale di ogni servizio è «Avvisami quando parte» e porta alla lista d'attesa sulla pagina del servizio; accanto c'è la prova senza registrazione (referto di esempio per Capisci, account demo per gli altri due). Lo stesso vale per `/prezzi` e «Ti aiutiamo a scegliere»;
- tutto questo è verificato da `npm run test:e2e:vetrina`, che compila il profilo vetrina in `.next-vetrina` e lo prova su desktop e telefono;
- con `ENABLE_INDEXING=true` vanno negli indici solo le pagine pubbliche e le guide pratiche (oggi: Fascicolo Sanitario Elettronico); guide cliniche, glossario e Punto di Partenza restano `noindex` finché un medico non li ha revisionati;
- il blocco «Chi c'è dietro», la riga nel fondo pagina, i contatti e i dati strutturati dell'organizzazione compaiono solo con nome e P.IVA veri (`PUBLIC_OWNER_*`).

## Prima di pubblicare (titolare)
- [ ] Nome o ragione sociale e P.IVA in `PUBLIC_OWNER_NAME` e `PUBLIC_OWNER_VAT`; indirizzo ed email facoltativi (`PUBLIC_OWNER_ADDRESS`, `PUBLIC_OWNER_EMAIL`, `PUBLIC_OWNER_PEC`)
- [ ] Campi fra parentesi quadre dell'informativa privacy compilati; informativa e cookie rivisti da un professionista
- [ ] Ricerca di anteriorità sul nome «Cura Privata» (almeno una verifica di base prima di comprare pubblicità)
- [ ] Dominio acquistato e puntato a Vercel; `PUBLIC_BASE_URL=https://<dominio>`
- [ ] Database Neon creato (`DATABASE_URL`) per le liste d'attesa e il funnel anonimo
- [ ] Decisione sull'indicizzazione: consigliato `ENABLE_INDEXING=true` solo con dominio e titolare veri

## Variabili su Vercel
```
SITE_PROFILE=vetrina
DEMO_MODE=true
PUBLIC_BASE_URL=https://<dominio>
DATABASE_URL=<Neon>
PUBLIC_OWNER_NAME=<…>
PUBLIC_OWNER_VAT=<…>
ENABLE_INDEXING=true            # facoltativo, vedi sopra
MFA_SECRET_KEY=<npm run keys>   # per il pannello admin
```
Il resto segue `docs/DEPLOY.md` (passi 1–6). Nessuna chiave Stripe, Anthropic o email è necessaria per la vetrina.

## Dopo la pubblicazione
- [ ] Aprire home, `/prezzi`, `/referti`, `/punto-di-partenza`, `/stato-del-progetto` da telefono e computer
- [ ] Iscriversi a una lista d'attesa e verificarla nel pannello admin (`/admin/lista-attesa`)
- [ ] Controllare `/robots.txt` e `/sitemap.xml`
- [ ] Ogni settimana: funnel anonimo in `/admin` (visite, click su Capisci, Punto di Partenza completati, iscrizioni per servizio)

## Quando passare oltre
La vetrina non diventa un servizio vero cambiando un interruttore: per i referti reali servono i punti B di `docs/PRODUCTION_GATES.md`, per i medici i punti D e il go/no-go in `RISCHI_RESIDUI.md`.
