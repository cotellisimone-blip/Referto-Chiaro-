# Cura Privata — Evoluzione v2 (11/11/2026)

Pacchetto del titolare `CuraPrivata_Claude_Evoluzione_v2.zip`, applicato in modo incrementale sulla base v5 (9b4a910).

## Decisioni
- Listino: **Capisci il tuo referto** primo referto 2,90 € (una volta per persona), poi 7,90 €; digitale e automatico, **nessuna revisione umana**, «di norma in pochi minuti». **Parla con un medico** 79 €, medico di medicina generale o internista, circa 20–25 minuti, nessuna specialità da scegliere. **Chiedi un secondo parere** da 149 €, specialista.
- Sotto il titolo resta «medici abilitati e identificabili» (scelta del titolare, 11/11): «professionisti qualificati» resta vietato dai test finché non ci sono medici verificati.
- «in pochi minuti» è ammesso solo come «di norma in pochi minuti» per Capisci.

## Fasi
1. **Grafica**: home in 7 blocchi (hero con foto di paziente + UI vera, «Parti dal tuo referto» su fondo scuro, «Se una spiegazione non basta» con due blocchi diversi, tre livelli Capisci → Orientati → Approfondisci, fiducia, Preparati alla visita, chiusura «da 2,90 €»). Pagine servizio con identità propria (menta / caldo / blu scuro). Selettore in 4 risposte. Solo foto di pazienti, «Immagine illustrativa».
2. **Prezzi**: `PRICES` in `src/domain/offerta.ts` è l'unica fonte; `priceDisplay()` / `<PriceTag>`; promozione con `FIRST_REFERTO_PROMO`, `PRICE_CAPISCI_FIRST_CENTS`. Anti-abuso: tabella `promo_claims` con impronta SHA-256 dell'email normalizzata (minuscole, senza «+etichetta», Gmail senza punti), resta anche se l'account viene cancellato. Il prezzo lo decide sempre il server (`quoteCapisci`).
3. **Continuità**: dopo il report, «Vuoi parlarne con un medico?» e «Secondo parere» aprono il modulo con il documento già selezionato (`?documento=`), aggiungibili/rimuovibili. Area: documenti e report · appuntamenti · pareri. Il credito referto → consulto è predisposto e spento (`UPGRADE_CREDIT`).
4. **Report**: «In una frase», tabella dei valori con provenienza, spiegazione voce per voce, «Che cosa può influenzarlo, in generale» (fattori già scritti nelle guide, nessun testo nuovo), «Nei tuoi referti precedenti» solo con stesso esame, stessa unità e valori confermati, domande per il medico. CTA sulle guide «Rendilo chiaro per 7,90 €». Funnel: contatori anonimi per giorno (`funnel_daily`, nessun cookie) + passi calcolati dai dati, in Amministrazione → Panoramica.
5. **QA**: 171 test unitari, 210 e2e (desktop 1440 e mobile 390, axe chiaro/scuro) verdi.

## Da validare fuori dal codice
- Sostenibilità di 2,90 € con commissioni di pagamento e costo AI per referto.
- Termini della promozione (una volta per persona) nelle condizioni di vendita.
- Medici reali (medicina generale/interna e specialisti), piattaforma video, condizioni di rimborso.
