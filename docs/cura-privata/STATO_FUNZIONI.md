# Stato delle funzioni — Cura Privata
*Aggiornato il 12/11/2026 (ciclo 4) · ramo `main`*

**OPERATIVO** = funziona e può stare online così com'è. **DEMO** = funziona solo su dati inventati. **BLOCCATO** = il codice c'è ed è testato, ma resta spento da un interruttore lato server finché mancano requisiti esterni. **IN PREPARAZIONE** = solo pagina descrittiva + lista d'attesa.

| Funzione | Stato | Perché / cosa manca | Interruttore |
|---|---|---|---|
| Sito pubblico (home, referti, servizi, prezzi, come funziona, sicurezza, FAQ, chi siamo, per i medici, contatti, accessibilità) | OPERATIVO | Mancano titolare, P.IVA e contatti reali; il blocco «Chi c'è dietro» compare solo quando sono configurati | `PUBLIC_OWNER_*` |
| Prezzi pubblici (2,90/7,90 · domicilio 149 · video 69 · secondo parere 149 €) | OPERATIVO | Listino del 12/11 | `ENABLE_PUBLIC_PRICES` (`false` li nasconde) |
| Punto di Partenza (gratis, tutto nel browser, PDF) | OPERATIVO, bozza | Revisione medica delle 10 aree | `ENABLE_PUNTO_DI_PARTENZA` |
| Guide agli esami (91) e glossario (139) | OPERATIVO, bozza | Revisione medica; indicizzazione spenta | `ENABLE_INDEXING` |
| Preparati alla visita, Domande per il medico | OPERATIVO | Nessun dato sanitario raccolto | — |
| Prova su referto inventato (`/referti/esempio`) | DEMO | Rifiuta qualsiasi documento diverso dalla fixture | `DEMO_MODE` |
| Area personale (archivio, report, appuntamenti, pareri, impostazioni) | DEMO | Account demo condiviso; registrazione pubblica spenta | `ENABLE_PUBLIC_SIGNUP` |
| Accesso con link via email | OPERATIVO nel codice | Serve un account Resend/Postmark e un dominio mittente | chiavi email |
| Caricamento cifrato di referti veri + lettura PDF/foto | BLOCCATO | DPIA, MDR/IVDR, DPA fornitori, antivirus | `ENABLE_REAL_UPLOADS` + `PRODUCTION_COMPLIANCE_APPROVED` |
| Spiegazione con AI (Claude) con controlli | BLOCCATO | Valutazione dal vivo e revisione medica di un campione | `ENABLE_AI_PROCESSING` + compliance |
| Pagamenti (Stripe) | DEMO / BLOCCATO live | P.IVA, termini e rimborsi; costo per referto da misurare | `ENABLE_LIVE_PAYMENTS` + compliance |
| Visita a domicilio, videoconsulto e secondo parere: richiesta del paziente (`/richiedi`, `/richieste`) e prova a tre ruoli (`/prova`) | DEMO nel browser | Nessun medico contrattualizzato; richieste non salvate nell'account; annullamento e ricetta bianca da confermare | — |
| Lista d'attesa per zona (email e CAP) | OPERATIVO nel codice | — | — |
| Famiglia, numeri nel tempo, promemoria, foglio per la visita (13/11) | DEMO | Come l'area personale; storico di esempio solo in demo; base giuridica per i familiari da validare | `DEMO_MODE` (storico di esempio) |
| Piano Famiglia | IN PREPARAZIONE (proposta) | Prezzo da decidere; nessun pagamento ricorrente | `PIANO_FAMIGLIA_STATO`, `PRICE_FAMIGLIA_YEAR_CENTS` |
| Email di promemoria (3 giorni prima, senza dettagli sanitari) | OPERATIVO nel codice | Servono le chiavi email; parte dal cron | chiavi email |
| Parla con un medico, vecchio flusso server (prenotazione, pagamento, conferma, riepilogo firmato) | DEMO | Nessun medico contrattualizzato; piattaforma video e rimborsi da decidere | `ENABLE_MEDICAL_VIDEO_CONSULT` + compliance |
| Secondo parere (richiesta, portale medico con 2FA, parere firmato) | DEMO | Nessun medico; firma qualificata e verifica Albo da fare | `ENABLE_MEDICAL_SECOND_OPINION` + compliance |
| Profili dei medici (nome, Albo, specialità; mai foto) | PRONTO, vuoto | Compaiono solo con medici veri in `PUBLIC_PROFESSIONALS` | — |
| Archivio salute, Prevenzione | IN PREPARAZIONE | Pagina + lista d'attesa (solo email) | — |
| Admin, registro audit, funnel anonimo, export dati, cancellazione account, revoca consensi | OPERATIVO nel codice | — | — |
| Profilo vetrina | PRONTO | Spegne tutto ciò che tocca dati reali o soldi, anche se un interruttore fosse acceso per errore | `SITE_PROFILE=vetrina` |
| Deploy | BLOCCATO | Account Vercel/Neon, dominio, dati del titolare | — |
