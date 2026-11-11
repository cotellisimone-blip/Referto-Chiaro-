# Referto Chiaro — pitch in una pagina

> Bozza del 7 novembre 2026. Prezzi e numeri sono ipotesi da validare; nessun dato di mercato è stato misurato da noi.

## Il problema
Milioni di persone ricevono ogni anno referti di laboratorio scritti per i medici, non per loro. Fra il ritiro del referto e la visita passano giorni di ricerche su internet, ansia e domande che poi, in studio, non vengono fatte. Il medico riceve una persona confusa; la persona esce con la sensazione di non aver capito.

## La proposta
**Referto Chiaro** trasforma un referto di laboratorio in una spiegazione in parole semplici, **senza mai alterare un numero**: ogni valore è riportato esattamente come nel documento, con la riga da cui proviene; i termini sono spiegati in italiano comune; alla fine c'è una lista di domande da portare al medico e un PDF stampabile. Più referti diventano un dossier ordinato, con confronti solo fra esami davvero confrontabili.

**Non facciamo diagnosi: facciamo chiarezza.** Nessun semaforo, nessun giudizio clinico, nessun consiglio terapeutico.

## Perché ora
- Gli strumenti di linguaggio permettono spiegazioni leggibili, ma da soli inventano e sbagliano: il nostro **controllo di coerenza deterministico** blocca qualsiasi spiegazione in cui un valore, un'unità, un intervallo o una citazione non coincidano con il documento.
- Le persone vogliono capire prima della visita; i medici vogliono pazienti che arrivino con domande giuste.
- Il quadro normativo (GDPR art. 9, MDR/IVDR, AI Act) premia chi parte con i limiti chiari: il prodotto è progettato **fail-closed**, con ogni funzione sensibile spenta finché non è approvata.

## Come si guadagna (ipotesi)
| Servizio | Prezzo ipotizzato | Stato |
|---|---|---|
| Essenziale — un referto spiegato + PDF | 9,90 € | Flusso completo, pagamento in modalità test |
| Completo — più referti, dossier con confronti | 24,90 € | Flusso completo, pagamento in modalità test |
| Secondo parere — un medico abilitato risponde a un quesito | da 99 € | Portale medico e flusso pronti, servizio da attivare con medici veri |
| Per le strutture — spiegazioni consegnate con i risultati, white-label | da definire | Pagina e lista d'attesa attive |

## Che cosa esiste già (verificabile)
- Sito pubblico, demo su referti inventati, area personale con archivio, dossier e impostazioni (export, consensi, eliminazione).
- Database PostgreSQL con isolamento per utente imposto dal database (Row-Level Security), audit append-only.
- Checkout Stripe in modalità test (o simulato), webhook firmati e idempotenti; il report nasce solo dopo il pagamento.
- Secondo parere: richiesta → medico con 2FA → parere firmato con impronta; pannello admin con 2FA; lista d'attesa.
- Oltre 180 test automatici, accessibilità WCAG 2.2 AA verificata su ogni pagina, header di sicurezza.

## Che cosa serve per vendere davvero
1. **Compliance**: inquadramento MDR/IVDR e AI Act, informative e DPIA, DPA con i fornitori — senza questo nessun referto reale entra nel sistema.
2. **Revisione clinica** del glossario e delle frasi standard da parte di un medico supervisore.
3. **Medici** per il secondo parere: abilitazione verificata, contratti, assicurazione, prezzi reali.
4. **Operatività**: PostgreSQL gestito, invio email, chiavi Stripe live, ragione sociale e fatturazione.

## La richiesta
Un partner clinico (laboratorio o poliambulatorio) per un **pilota su referti reali anonimizzati**, un medico supervisore e un budget per la compliance. In cambio: un prodotto già costruito, testato e pronto a essere acceso un gate alla volta.
