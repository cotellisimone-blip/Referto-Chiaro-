# Roadmap di prodotto — Cura Privata

*Aggiornata: 12/11/2026, ciclo 3.*

## Priorità strategiche
1. **Andare online come vetrina** (profilo `vetrina`) per misurare la domanda reale: iscrizioni per servizio, click sui prezzi, uso di Punto di Partenza.
2. **Un medico vero con nome**: è il primo fattore di fiducia e di conversione, e serve sia per la revisione dei contenuti sia per Parla con un medico.
3. **Accendere Capisci con referti veri** solo dopo parere MDR, DPIA, contratti con i fornitori, valutazione AI dal vivo e antivirus.
4. **Indicizzazione** delle guide dopo la revisione medica.

## Come leggere la vetrina (ciclo 2, soglie da validare)
Ipotesi di lavoro, non dati: da rivedere dopo le prime 4 settimane online. Si leggono nella sezione «Vetrina» di Admin.
| Segnale | Soglia ipotetica | Decisione |
|---|---|---|
| Iscrizioni su visite (tre servizi) | ≥ 3% per 2 settimane con almeno 300 visite | La domanda c'è: priorità ai punti B di `PRODUCTION_GATES.md` per aprire Capisci |
| Iscrizioni su visite | < 1% con almeno 500 visite | Rivedere messaggio, prezzo o canale prima di investire in conformità |
| Iscrizioni «Parla con un medico» ≥ quelle di Capisci | 4 settimane | Anticipare il medico contrattualizzato rispetto all'AI |
| Una sorgente porta più del 50% delle iscrizioni | 4 settimane | Concentrare lì il budget |
| Iscrizioni subito dopo una prova su esempi completati (ciclo 3) | < 10% con almeno 100 esempi completati | La prova non convince: rivedere la spiegazione dell'esempio prima del messaggio della home |
| «Utile: non molto» più di un terzo delle risposte (ciclo 3) | almeno 50 risposte | Rivedere testi e ordine della spiegazione con il medico revisore |
Ogni link pubblicato deve avere `?utm_source=` (vedi `docs/cura-privata/LANCIO_VETRINA.md`).

## Dipendenze da validare (fuori dal codice, del titolare)
| Cosa | Sblocca |
|---|---|
| Titolare, sede, P.IVA, contatto privacy | Vetrina online, blocco «Chi c'è dietro» |
| Informativa e cookie rivisti da un professionista | Vetrina online |
| Dominio (es. curaprivata.it) e `PUBLIC_BASE_URL` | Vetrina, canonical, sitemap |
| Medico revisore identificato | Guide indicizzabili, Punto di Partenza «revisionato» |
| Chiave Anthropic (anche solo per la valutazione) | Costo e qualità per referto, scelta del modello |
| Parere MDR/IVDR e AI Act, DPIA, DPA fornitori | Referti veri |
| Medici contrattualizzati, piattaforma video, rimborsi, fatturazione | Parla con un medico, Secondo parere |
| Ricerca di anteriorità sul marchio «Cura Privata» | Deposito del marchio |

## Opportunità commerciali
- **Fascicolo Sanitario Elettronico 2.0**: dal 31/3/2026 tutte le strutture caricano i referti entro 5 giorni, ma solo il 27% dei cittadini lo usa (luglio 2025). Chi scarica il PDF dal FSE è il cliente ideale: guida dedicata (`/guide/fascicolo-sanitario-elettronico`), da promuovere quando l'indicizzazione sarà accesa.
- **Pacchetto famiglia o annuale** per chi segue i referti di un genitore anziano: da valutare dopo i primi dati, non prima. Kantesti vende un annuale a 39,92 € (scontato).
- **Credito referto → consulto** (`UPGRADE_CREDIT`): già predisposto, da accendere quando Parla con un medico è attivo.
- **Medici di base come canale**: pagina `/per-i-medici` già pronta; servono i primi medici.

## Da non fare (deciso)
Percentuali di precisione, chatbot libero, «monitoraggio 24/7», recensioni prima di avere clienti veri, foto di medici, nuovi servizi «in preparazione».

## Debito tecnico importante
| Tema | Quando diventa obbligatorio |
|---|---|
| Antivirus sui caricamenti | Prima di accendere i referti veri |
| CSP senza `unsafe-inline` (nonce o hash) | Prima dei referti veri |
| Penetration test esterno | Prima dei referti veri |
| Peso JavaScript (circa 700 KB non compressi per pagina) | Quando ci saranno dati reali di velocità |
| Firma qualificata dei pareri e verifica Albo automatica | Prima del Secondo parere reale |
| Chiavi del limitatore di accesso con l'indirizzo IP in chiaro (`auth:<ip>` in `rate_limits`, cancellate dopo un giorno) | Prima dei referti veri: usare un'impronta come per i contatori (ciclo 3) |

## Funzionalità future (solo dopo i dati della vetrina)
Salvataggio del Punto di Partenza nell'area personale (`ENABLE_PUNTO_DI_PARTENZA_SAVE`, già predisposto e bloccato); Archivio salute; Prevenzione.
