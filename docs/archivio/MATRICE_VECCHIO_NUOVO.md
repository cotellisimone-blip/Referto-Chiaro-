# Matrice Referto Chiaro → Cura Privata
*8 novembre 2026 · completata sul codice reale (commit `29fb66e`)*

| Oggi (Referto Chiaro) | Diventa (Cura Privata) | Lavoro | Come si verifica |
|---|---|---|---|
| Nome in 39 file / 78 punti | «Cura Privata»; «Comprendi i tuoi referti» come servizio | Rename di testi, metadati, email, PDF, Stripe | Test che cerca «Referto Chiaro» nel build (0 ammessi, salvo nota storica) |
| Logo evidenziatore (6 SVG) | Simbolo nuovo originale + wordmark, varianti chiaro/scuro/mono, favicon, OG | Disegno nuovo, niente cuore generico | Favicon, OG 1200×630, contrasto |
| Palette blu/giallo, Fraunces | Petrolio `#0C3340`, turchese `#008F87`, menta `#7BE0D2`, carta `#F5FAF8`; sans tipo Manrope | Token in `globals.css`, componenti | Contrasto AA automatico (axe) |
| Home focalizzata sul referto | Home ombrello: hero «La tua salute, più chiara e accessibile.», servizi con stato, 3 passaggi | Riscrittura home | Test 5 secondi, screenshot vs mockup 01 |
| `/come-funziona`, `/esempio`, `/inizia` | `/referti`, `/referti/come-funziona`, `/referti/esempio`, `/referti/invia` (dietro flag) | Nuove rotte + redirect 301 interni | e2e su tutte le rotte vecchie |
| `/secondo-parere` | `/servizi/secondo-parere` «In preparazione» | Spostamento, stesso flusso demo | Badge di stato visibile |
| — | `/servizi`, `/servizi/archivio`, `/servizi/visite-e-consulti`, `/servizi/prevenzione` | Pagine nuove «In preparazione», lista d'attesa | Nessuna CTA di prenotazione |
| `/servizi-prezzi` con prezzi indicativi | `/prezzi` nascosta finché non scegli | Flag prezzi | e2e: nessun «€» pubblico |
| `/faq`, `/sicurezza` | `/domande-frequenti`, `/sicurezza-e-privacy` | Rinomina + redirect | e2e |
| Area personale `/area` | `/area-personale` con nav laterale (desktop) e barra in basso (mobile) | Restyling, stesse API | Test ruoli invariati |
| Portale medico, admin | Invariati, solo marchio | Rename | Test esistenti |
| Email, PDF, export | Marchio Cura Privata | Template | Snapshot PDF |
| Emittente 2FA «Referto Chiaro» | «Cura Privata» solo per nuovi account | Lasciare il vecchio per chi è già associato | Test TOTP |
| Guide (90) e glossario (139) | Restano, sotto Cura Privata | Rename nei template | Validatore contenuti |
| Dominio | curaprivata.it (`PUBLIC_BASE_URL`) | Solo configurazione, quando decidi | Canonical e sitemap |
| Repository GitHub sospeso | GitLab o archivio sorgenti | Lo decidi tu | — |
