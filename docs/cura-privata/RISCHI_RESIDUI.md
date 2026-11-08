# Rischi residui e checklist go / no-go
*8 novembre 2026*

## Rischi residui
| Rischio | Livello | Mitigazione attuale | Cosa resta |
|---|---|---|---|
| Nome «Cura Privata» non registrabile o in conflitto | Alto | Nessun deposito fatto; il sito non dichiara marchi registrati | Ricerca e parere di un consulente marchi |
| Utente scambia la spiegazione per una diagnosi | Medio | Confine «informativo ≠ medico» in home, /referti, PDF, email; filtro sul linguaggio diagnostico; nessun giudizio di normalità | Revisione medica dei testi |
| Servizi futuri percepiti come attivi | Medio | Etichetta «In preparazione» in parole, nessun pulsante di prenotazione o caricamento, test automatico sugli stati | — |
| Dati sanitari scritti in una lista d'attesa | Basso | Campo «nota» rimosso dai form dei servizi sanitari; solo email | — |
| Script inline consentiti dalla CSP | Medio | Header di sicurezza attivi; limite tracciato | Nonce o hash quando il rendering diventa dinamico |
| File caricati senza antivirus | Alto (se acceso) | Caricamenti spenti; firma dei byte, limiti, blocco PDF con script | Servizio antivirus prima dell'apertura |
| Repository solo in archivio locale | Medio | Bundle git e zip nel progetto | Nuovo repository (GitLab o GitHub sbloccato) |
| Test di accessibilità che a volte misurano durante una transizione | Basso | Ripetizione: 6/6 verdi | Rendere istantanea l'animazione d'ingresso nei test |

## Go / no-go (da firmare)
### Pubblicazione del sito come vetrina e demo (solo dati inventati)
- [ ] Titolare e contatti reali nelle pagine legali
- [ ] Informativa e cookie rivisti
- [ ] Dominio curaprivata.it collegato, `PUBLIC_BASE_URL` impostato
- [ ] Decisione sull'indicizzazione (`ENABLE_INDEXING`)
- [x] Nessun prezzo pubblico, nessun claim vietato, servizi futuri etichettati (test automatici)
- [x] Demo che rifiuta documenti veri (test automatici)

Firma: ____________________  Data: __________

### Accensione dei referti veri
- [ ] Tutti i punti 2, 3, 4 e 5 di `BLOCCHI_LEGALI_CLINICI.md`
- [ ] Antivirus, valutazione AI dal vivo, penetration test
- [ ] `PRODUCTION_COMPLIANCE_APPROVED=true` registrato con data e responsabile

Firma: ____________________  Data: __________
