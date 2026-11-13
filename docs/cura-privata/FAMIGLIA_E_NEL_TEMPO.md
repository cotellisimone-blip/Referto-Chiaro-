# Famiglia e salute nel tempo — Cura Privata
*13 novembre 2026. Risposta a «Non è abbastanza audace. Cosa spinge una persona a entrare e stare?»*

## La promessa
**«Tutta la salute della tua famiglia, finalmente chiara, in un posto solo.»**
Il referto e la visita a domicilio restano la porta d'ingresso. Quello che fa restare è la storia: ogni referto si aggiunge ai precedenti, per sé e per chi si segue, e prima di ogni visita le domande sono già pronte.

## Che cosa c'è nel codice
| Pezzo | Dove | Note |
|---|---|---|
| Numeri nel tempo | `/area-personale/nel-tempo` | Un grafico per ogni esame presente in almeno due referti, con l'intervallo stampato dal laboratorio. Prima gli esami con l'ultimo numero fuori dall'intervallo. Le frasi descrivono soltanto («da 0,84 a 0,97 mg/dL»), mai una valutazione. |
| Domande nate dai numeri | stessa pagina | Una domanda per ogni esame con l'ultimo numero fuori intervallo, da aggiungere alla prossima visita o a una visita nuova. |
| Famiglia | `/area-personale/famiglia` | Fino a 5 familiari. Per aggiungerne uno servono la base (consenso dell'interessato, genitore di un minore, tutela) e la dichiarazione di poterne gestire i dati. Ogni referto appartiene a una persona; i dossier non mescolano persone. Eliminare un familiare elimina anche i suoi referti e promemoria. |
| Promemoria | `/area-personale/promemoria` | Visita, controllo da ripetere, altro. Le date le mette la persona: non suggeriamo mai quando ripetere un esame. File .ics per il calendario. Email 3 giorni prima, una volta, senza titolo né dettagli sanitari. |
| Foglio per la visita | `/area-personale/promemoria/[id]` | Domande (proprie e nate dai numeri) e ultimi numeri della persona, da stampare. |
| Storico di esempio | pulsante nell'area, solo con `DEMO_MODE` | Tre controlli annuali per il titolare, «Lucia (esempio)» con quattro esami del sangue, due promemoria. Tutto inventato. |
| Pagina pubblica | `/famiglia` (sostituisce `/servizi/archivio`, con redirect) | Pezzi veri di prodotto su dati inventati, il piano come proposta, lista d'attesa «famiglia». |
| Home | blocco «Famiglia e salute nel tempo» | Titolo della hero: «Tutta la salute della tua famiglia, finalmente chiara.» Blocco compatto: su telefono senza grafico. |

## Il piano Famiglia: una PROPOSTA
Da decidere con il titolare. Oggi `PIANO_FAMIGLIA_STATO = "proposta"`: le pagine lo scrivono accanto al prezzo, l'unica azione è «Avvisami quando parte», nessun pagamento ricorrente è attivo.
- Spazio personale gratuito (archivio, numeri nel tempo, promemoria per sé): è ciò che fa tornare.
- Famiglia: **39 € l'anno** (circa 3,25 € al mese), modificabile con `PRICE_FAMIGLIA_YEAR_CENTS`.
  - fino a 5 familiari; numeri nel tempo e promemoria per tutti;
  - «Capisci il tuo referto» incluso fino a 24 referti l'anno (conviene dal 5° referto rispetto a 7,90 € l'uno);
  - foglio per ogni visita;
  - 10 € in meno su visita a domicilio e videoconsulto.
- Da verificare prima di attivarlo: costo reale per referto (AI + controlli), quanti referti fa davvero una famiglia, IVA, rinnovo e recesso.

## Punti aperti per l'avvocato (non risolti dal codice)
- **Base giuridica per i dati sanitari dei familiari** (art. 9 GDPR): chi carica i referti di un genitore adulto tratta dati di un terzo. Oggi chiediamo una dichiarazione e registriamo il consenso `family-delegation` con versione `bozza-2026-11`: va validato il testo e capito se serve un consenso raccolto dal familiare stesso.
- **Minori**: età, prova della responsabilità genitoriale, cosa succede a 14 e a 18 anni.
- **Tutela, amministrazione di sostegno, procura**: quali documenti chiedere, se chiederli.
- **Uso domestico** (art. 2 GDPR): se e quando si applica a chi gestisce i referti di un familiare, e che ruolo ha Cura Privata.
- **Diritti del familiare**: accesso, cancellazione, opposizione da parte della persona di cui sono i dati, se non è l'intestatario dell'account.
- **Email di promemoria**: oggi non contengono dettagli sanitari; il file .ics contiene il titolo scritto dalla persona (l'interfaccia lo avverte).

## Cosa NON c'è ancora
- Accesso condiviso (due figli che seguono lo stesso genitore, ognuno con il suo account).
- Notifiche push o SMS.
- Suggerimenti automatici su quando ripetere un esame (non li faremo senza un parere medico e regolatorio).
- Farmaci, prenotazioni, prevenzione: rimandati.
- Limite documenti: resta quello dell'account (30), non per persona.
