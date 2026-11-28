# Cura Privata «Memorabile»: che cosa è cambiato

Posizionamento: **Capisci. Chiedi un secondo parere. Parla con un medico.**
Tre servizi protagonisti, un solo spazio, un percorso che parte dal referto e arriva al medico.

Tutto resta in **versione dimostrativa**: documenti inventati, pagamento simulato, medico dimostrativo. Ogni servizio reale è dietro un interruttore che si accende solo con la compliance approvata.

## Fase 1: grafica, hero, «Cura Privata Journey»
- Home riscritta. Il titolo è il payoff su tre righe. Sotto ci sono i tre servizi con prezzo «a partire da» e tempi, il percorso Journey (5 tappe, linea che si disegna), «Ti aiutiamo a scegliere», chi si occupa del tuo caso, il video, «Preparati alla visita», le guide, le regole, le FAQ e la chiamata finale.
- Su mobile la home è pensata a parte: tre tessere grandi per andare dritti a un servizio, pulsanti a tutta larghezza, nessuno scorrimento orizzontale da 320 a 430 px.
- Le persone del mockup NON sono usate (sono generate). Al loro posto c'è una composizione HTML nativa delle tre schede servizio. Il logo resta la «C».
- Ci sono tre toni (Capisci turchese, Secondo parere azzurro, Medico corallo) con token chiaro/scuro in `globals.css`.

## Fase 2: tre servizi come prodotti
- Fonte unica: `src/domain/offerta.ts` contiene nome, frase, per chi, tempi, chi se ne occupa, cosa ricevi, cosa include, quando non è la strada giusta, tre passi e prezzo.
- `/referti`, `/servizi/secondo-parere` e il nuovo `/servizi/parla-con-un-medico` hanno lo stesso schema (`ServiceLanding`) e un solo percorso principale.
- «Parla con un medico» è nuovo e funziona in demo dall'inizio alla fine:
  - prenotazione con motivo breve, 1–3 fasce orarie e documenti scelti;
  - pagamento;
  - il medico lo vede solo dopo il pagamento e conferma data e collegamento (solo https);
  - colloquio, poi riepilogo firmato con impronta sha256.
- I rimborsi sono automatici se annulli prima della conferma o se il medico rifiuta.
- Anche il secondo parere ora passa dal pagamento prima di arrivare al medico.
- `/inizia` è la pagina «Ti aiutiamo a scegliere»: 5 bisogni portano al servizio giusto, senza domande cliniche.
- Area personale: I miei documenti, I miei pareri, I miei appuntamenti, Dossier, Pagamenti, Impostazioni. Su mobile c'è una barra in basso con 5 voci.

## Fase 3: prezzi, fiducia, upgrade
- Prezzi in centesimi da variabili d'ambiente (`PRICE_*_CENTS`), validati, con default 49 / 149 / 89 €. Un test vieta prezzi scritti a mano nei componenti.
- Pagina `/prezzi` con il confronto e «Pagamenti, senza sorprese». La nota «Prezzi di riferimento, IVA inclusa ove dovuta» compare ovunque ci sia un prezzo.
- `ENABLE_PUBLIC_PRICES=false` nasconde tutti i prezzi in un colpo.
- Fiducia solo su dati reali:
  - `PUBLIC_PROFESSIONALS` è vuoto, quindi il sito spiega che cosa vedrai (nome, specializzazione, Albo verificato, accesso solo al tuo caso) invece di mostrare profili finti;
  - nessuna recensione, stella o metrica;
  - i test bloccano «Dott.», «iscrizione albo: 123», «pazienti soddisfatti», «medici qualificati» e simili.
- Upgrade (`UPGRADE_CREDIT=true`): chi ha già pagato «Capisci» per un documento paga solo la differenza per il videoconsulto su quel documento. Oggi è spento.

## Fase 4: SEO e strumento gratuito
- Ogni guida e ogni voce del glossario finisce con una proposta pertinente e discreta, solo dopo la risposta:
  - immagini ed endoscopie portano al secondo parere;
  - gli esami di laboratorio portano a «Capisci»;
  - c'è sempre il link al videoconsulto.
- **Preparati alla visita in 2 minuti. Gratis** (`/strumenti/preparati-alla-visita`):
  - tre domande pratiche (che visita, che cosa hai, di che cosa parlare);
  - risultato: lista da portare, da preparare e domande da fare;
  - si può stampare o copiare;
  - nessun sintomo e nessun dato personale; lo stato sta nell'indirizzo con soli identificatori fissi.
- Sitemap, ricerca del sito e menu sono aggiornati. I vecchi indirizzi `/servizi/visite-e-consulti` e `/videoconsulto` rimandano alla nuova pagina.

## Fase 5: verifiche
- **163 test unitari** e **202 test end-to-end** (desktop 1440 e mobile 390) sono verdi. Lint e TypeScript sono puliti.
- I percorsi controllati:
  - **A**: visitatore → Capisci → pagamento → documento → report.
  - **B**: secondo parere → pagamento → il medico lo vede solo dopo → parere firmato. Il rifiuto genera il rimborso.
  - **C**: Parla con un medico → prenotazione → pagamento → conferma del medico → collegamento → riepilogo firmato. Link non sicuri, date passate, troppe fasce e documenti altrui vengono rifiutati. Un altro utente non vede nulla.
  - **D**: area personale con tutte le sezioni.
- Accessibilità: zero violazioni axe (WCAG 2.2 AA) su tutte le pagine nuove, anche in tema scuro.
- Mobile: nessuno scorrimento orizzontale da 320 px. Sotto i 360 px i comandi «testo grande» e «tema» passano nel menu.

## Video
`src/content/media.ts` ha quattro posti (principale e uno per servizio). Per ognuno bastano `src`, `poster` e `captions` (sottotitoli .vtt, obbligatori). Finché mancano, il sito mostra una copertina «Video in preparazione».

## Decisioni aperte (del titolare)
1. **«Capisci il tuo referto» a 49 € coinvolge un medico?** Oggi il testo lo presenta come spiegazione informativa, senza medico. Se un medico rilegge, cambiano costi, tempi e testi.
2. Listino definitivo e regole di annullamento/rimborso.
3. Medici reali: contratti, verifica Albo, foto autorizzate.
4. Piattaforma video e fatturazione della prestazione sanitaria (commercialista e avvocato).
5. Produzione dei video con sottotitoli.
