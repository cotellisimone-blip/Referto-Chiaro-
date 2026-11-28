# Decisioni e correzioni rispetto al kit
*8 novembre 2026. Il kit chiede di scegliere e motivare, senza chiedere microestetica al titolare.*

| Tema | Kit | Scelta | Motivo |
|---|---|---|---|
| Codice | Riusare ciò che funziona | Rebrand sul codice Referto Chiaro (ramo `cura-privata`) | Motore, sicurezza e test già pronti; nessuna riscrittura |
| Turchese `#008F87` | Colore brand | Testo e pulsanti in `#00756F` | `#008F87` su carta = 3,8:1, sotto AA |
| Font | Manrope/Inter | Manrope ovunque (sito, PDF, immagine social) | OFL, leggibile, un solo carattere per coerenza |
| Simbolo dei mockup (cuore + croce) | Non usare, progettarne uno nuovo | C aperta + curva interna + punto di menta | Originale, leggibile a 16px, nessun cuore generico |
| Foto della persona nei mockup | Solo se licenziata | Nessuna foto; documento animato come prova visiva | Render generato, non licenziato; niente persone finte |
| Hero | «La tua salute, più chiara e accessibile.» | Adottato, CTA «Prova la demo» | Il motore reale è spento, quindi niente «Comprendi un referto» |
| Claim dei mockup («in totale sicurezza», «conformi al GDPR», «medici qualificati», «nella norma») | Non riportare | Assenti; test unitario + e2e li bloccano | Pubblicità sanitaria ingannevole |
| Navigazione | Home, Referti, Secondo parere, Come funziona, Servizi, Prezzi se attivi, Sicurezza, FAQ, Accedi | Uguale, senza «Prezzi»; «Guide» spostate nel footer e nella home | Prezzi non approvati |
| Prezzi | Non pubblicare | Nascosti (`ENABLE_PUBLIC_PRICES`), anche dalle FAQ | Proposte storiche in conflitto |
| Mappa | `/referti`, `/servizi/*`, `/area-personale`, `/domande-frequenti`… | Adottata, con redirect 308 dai vecchi indirizzi | Nessun link rotto |
| `/referti/invia` | Dietro flag | Non creata: il caricamento vero esiste già nell'area personale dietro `ENABLE_REAL_UPLOADS` | Evitare un secondo punto d'ingresso per dati sanitari |
| Liste d'attesa | — | Solo email per i servizi sanitari (campo note rimosso) | Il kit vieta form non protetti con dati sanitari |
| Area personale | Nav laterale + bottom nav mobile | Fatto, con blocco «In preparazione» | Orientamento immediato |
| GitHub | Non richiederlo | Bundle + zip; nessun push | Account sospeso |
| Email demo e 2FA | Rinomina | `@esempio.cura-privata.invalid`, emittente 2FA «Cura Privata» | Nessun utente reale da migrare |
