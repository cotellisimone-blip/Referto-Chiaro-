# Rischi residui e checklist go / no-go
*8 novembre 2026, aggiornato l'11/11/2026*

## Rischi residui
| Rischio | Livello | Mitigazione attuale | Cosa resta |
|---|---|---|---|
| Nome «Cura Privata» non registrabile o in conflitto | Alto | Nessun deposito fatto; il sito non dichiara marchi registrati | Ricerca e parere di un consulente marchi |
| Utente scambia la spiegazione per una diagnosi | Medio | Confine «informativo ≠ medico» in home, /referti, PDF, email; filtro sul linguaggio diagnostico; nessun giudizio di normalità | Revisione medica dei testi |
| Servizi futuri percepiti come attivi | Medio | Etichetta «In preparazione» in parole, nessun pulsante di prenotazione o caricamento, test automatico sugli stati | — |
| Dati sanitari scritti in una lista d'attesa | Basso | Campo «nota» rimosso dai form dei servizi sanitari; solo email | — |
| Script inline consentiti dalla CSP | Medio | Header di sicurezza attivi; limite tracciato | Nonce o hash quando il rendering diventa dinamico |
| File caricati senza antivirus | Alto (se acceso) | Caricamenti spenti; firma dei byte, limiti, blocco PDF con script | Servizio antivirus prima dell'apertura |
| Codice su più rami | Risolto (11/11) | Un solo ramo verso `main` (ciclo 1) | Merge del titolare |
| Test di accessibilità che a volte misuravano durante una transizione | Risolto (9/11) | `tests/e2e/_lib/a11y.ts` aspetta la fine delle animazioni prima di axe | — |

## Go / no-go (da firmare)
### Pubblicazione del sito come vetrina e demo (solo dati inventati)
- [ ] Titolare e contatti reali nelle pagine legali
- [ ] Informativa e cookie rivisti
- [ ] Profilo `SITE_PROFILE=vetrina` impostato (vedi `LANCIO_VETRINA.md`)
- [ ] Dominio curaprivata.it collegato, `PUBLIC_BASE_URL` impostato
- [ ] Decisione sull'indicizzazione (`ENABLE_INDEXING`)
- [x] Listino approvato dal titolare l'11/11: Capisci primo referto 2,90 € poi 7,90 €, Parla con un medico 79 €, Secondo parere da 149 € (`src/domain/offerta.ts`)
- [x] Prezzi da un'unica fonte, nessun claim vietato, nessun medico o recensione inventati, servizi futuri etichettati (test automatici)
- [x] Demo che rifiuta documenti veri (test automatici)

Firma: ____________________  Data: __________

### Accensione dei videoconsulti veri («Parla con un medico»)
- [ ] Medici contrattualizzati, iscrizione all'Albo verificata, profili e foto autorizzati in `PUBLIC_PROFESSIONALS`
- [ ] Piattaforma video scelta (link https, nessun dato sanitario nella piattaforma), informativa aggiornata
- [ ] Regole di annullamento e rimborso approvate (oggi: rimborso se annulli prima della conferma o se il medico rifiuta)
- [ ] Fatturazione della prestazione sanitaria e ruolo privacy dei medici chiariti con commercialista e avvocato
- [ ] `ENABLE_MEDICAL_VIDEO_CONSULT=true` registrato con data e responsabile

Firma: ____________________  Data: __________

### Accensione dei referti veri
- [ ] Tutti i punti 2, 3, 4 e 5 di `BLOCCHI_LEGALI_CLINICI.md`
- [ ] Antivirus, valutazione AI dal vivo, penetration test
- [ ] `PRODUCTION_COMPLIANCE_APPROVED=true` registrato con data e responsabile

Firma: ____________________  Data: __________
