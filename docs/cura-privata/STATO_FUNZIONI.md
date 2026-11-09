# Stato delle funzioni — Cura Privata
*8 novembre 2026 · ramo `cura-privata`*

**OPERATIVO** = funziona e può stare online così com'è. **DEMO** = funziona solo su dati inventati. **BLOCCATO** = il codice c'è ed è testato, ma resta spento da un interruttore lato server finché mancano requisiti esterni. **IN PREPARAZIONE** = solo pagina descrittiva + lista d'attesa.

| Funzione | Stato | Perché / cosa manca | Interruttore |
|---|---|---|---|
| Sito pubblico (home, referti, servizi, come funziona, sicurezza, FAQ, chi siamo, contatti, accessibilità) | OPERATIVO | Mancano titolare, P.IVA e contatti reali nelle pagine legali | — |
| Guide agli esami (90) e glossario (139) | OPERATIVO, bozza | Revisione medica non fatta; indicizzazione spenta | `ENABLE_INDEXING` |
| Prova su referto inventato (`/referti/esempio`) | DEMO | Rifiuta qualsiasi documento diverso dalla fixture | `DEMO_MODE` |
| Area personale (archivio, dossier, ordini, impostazioni) | DEMO | Account demo condiviso; registrazione pubblica spenta | `ENABLE_PUBLIC_SIGNUP` |
| Accesso con link via email | OPERATIVO nel codice | Serve un account Resend/Postmark e un dominio mittente | chiavi email |
| Caricamento cifrato di referti veri + lettura PDF/foto | BLOCCATO | DPIA, MDR/IVDR, DPA fornitori, antivirus | `ENABLE_REAL_UPLOADS` + `PRODUCTION_COMPLIANCE_APPROVED` |
| Spiegazione con AI (Claude) con controlli | BLOCCATO | Valutazione dal vivo e revisione medica di un campione | `ENABLE_AI_PROCESSING` + compliance |
| Pagamenti (Stripe) | DEMO / BLOCCATO live | Listino non approvato, P.IVA, termini e rimborsi | `ENABLE_LIVE_PAYMENTS` + compliance |
| Prezzi sul sito pubblico | SPENTO | Il titolare deve scegliere il listino (vedi `08_BUSINESS_E_LANCIO` del kit) | `ENABLE_PUBLIC_PRICES` |
| Secondo parere medico (richiesta, portale medico con 2FA, parere firmato) | DEMO | Nessun medico contrattualizzato; firma qualificata e verifica albo da fare | `ENABLE_MEDICAL_SECOND_OPINION` + compliance |
| Parla con un medico (prenotazione, pagamento, conferma del medico con link, riepilogo firmato) | DEMO | Nessun medico contrattualizzato; piattaforma video e regole di rimborso da decidere | `ENABLE_MEDICAL_VIDEO_CONSULT` + compliance |
| Preparati alla visita in 2 minuti | PRONTO | Nessun dato sanitario raccolto | — |
| Archivio salute | IN PREPARAZIONE | Pagina + lista d'attesa (solo email, nessun campo libero) | — |
| Visite e videoconsulti | IN PREPARAZIONE | Pagina + lista d'attesa | — |
| Prevenzione | IN PREPARAZIONE | Pagina + lista d'attesa | — |
| Admin, registro audit, export dati, cancellazione account, revoca consensi | OPERATIVO nel codice | — | — |
| Deploy | BLOCCATO | Repository (GitHub sospeso), account Vercel/Neon, dominio curaprivata.it | — |
