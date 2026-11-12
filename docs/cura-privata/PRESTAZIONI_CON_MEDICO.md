# Prestazioni con un medico: domicilio, videoconsulto, secondo parere

Intervento del 12/11/2026 (prompt «Medico a domicilio» del titolare). Base: PR #5 (cicli 1–3).

## Che cosa c'è

| Prestazione | Prezzo | Dove si definisce |
| --- | ---: | --- |
| Visita a domicilio con medico generalista | 149 € | `src/domain/prestazioni/listino.ts` (`PRICE_DOMICILIO_CENTS`) |
| Videoconsulto con medico generalista | 69 € | `src/domain/offerta.ts` (`PRICE_VIDEOCONSULTO_CENTS`) |
| Secondo parere specialistico | 149 € fisso | `src/domain/offerta.ts` (`PRICE_SECONDO_PARERE_CENTS`) |

Un solo listino: schede, pagine, riepiloghi e richieste leggono da lì. L'importo di una richiesta si registra alla
conferma e non cambia se poi cambia il listino.

- **Pagine pubbliche**: nuova `/servizi/visita-a-domicilio` (verifica comune e CAP, 112 e 116117, domande frequenti);
  `/servizi`, `/prezzi` e la home mostrano le tre prestazioni con lo stato reale; in home, in cima alla prima
  schermata, la prestazione davvero disponibile (il domicilio quando ha copertura, poi video o secondo parere, altrimenti
  nulla). Menu: «A domicilio», «Videoconsulto», «Secondo parere».
- **Prova a tre ruoli** (`/prova`, mai indicizzata): paziente, medico e amministrazione seguono la stessa richiesta.
  Stato nel browser (localStorage), resta al ricaricamento, «Ricomincia la prova» lo ripristina. Le pagine servizio
  portano qui.
- **Regole** in `src/domain/prestazioni/engine.ts` (funzioni pure, 29 test in `tests/unit/prestazioni.test.ts`):
  disponibilità condivise domicilio/video con 30 minuti di tragitto prima e dopo il domicilio; preavviso minimo
  (2 h domicilio, 1 h video) per mostrare «oggi»; conferma che riverifica servizio, medico, fascia e scadenza;
  doppia conferma idempotente; pagamento simulato fallito senza duplicati; integrazione documenti sulla stessa
  richiesta; rifiuto del secondo parere senza addebito; viste separate per ruolo (l'amministrazione non vede motivo,
  quesito, documenti, sintesi, via, telefono; il medico vede solo le richieste assegnate, via e telefono dopo la conferma).
- **Prove nel browser**: `tests/e2e/prestazioni.spec.ts` (8 casi × desktop e telefono) dai normali punti d'accesso.

## Ciclo 4 (12/11/2026, sera)

- Il paziente chiede la prestazione da `/richiedi/…` e la segue in `/richieste/…`, senza la barra dei ruoli; nella prova il medico risponde con un comando dichiarato come simulazione. La prova a tre ruoli resta in `/prova`.
- Domicilio e video si chiudono con un riepilogo scritto e un prossimo passo; per il domicilio il medico può indicare di aver lasciato una prescrizione su ricetta bianca.
- Annullamento (`CANCEL_FREE_MINUTES` in `engine.ts`): rimborso intero fino a 2 ore prima del domicilio e 1 ora prima del video; oltre, nessun rimborso; se annulla il medico, rimborso sempre. **Regola proposta: da confermare con un legale** insieme alla ricetta bianca (punto 6 qui sotto).
- Lista d'attesa `domicilio` con CAP; in Admin → Vetrina le richieste per CAP.

## Differenze rispetto al servizio reale

- Lo stato della prova vive nel browser: niente database, niente API, niente RLS per queste richieste. Il motore è
  già separato dall'interfaccia per andare dietro alle API con persistenza (tabelle per medici, fasce, richieste,
  con le stesse viste per ruolo come policy).
- Il vecchio flusso server dei videoconsulti e dei pareri (`/area-personale/appuntamenti`, `/secondo-parere`, portale
  `/medico` con 2FA) resta in funzione e testato, ma i pulsanti delle pagine servizio portano al nuovo percorso del paziente (`/richiedi/…`).
- Accesso ai ruoli nella prova senza autenticazione; nel sito vero il portale medico e l'amministrazione restano
  dietro 2FA.
- Video, pagamenti, calendari, notifiche e documenti sono simulati; nessun collegamento esterno è attivo.

## Verifiche prima dell'apertura reale

1. **Albo**: iscrizione di ogni medico all'Albo (ricerca [FNOMCeO](https://albounico.fnomceo.it/)), con data di verifica.
2. **Specialità**: titolo di specializzazione per ogni specialista del secondo parere.
3. **Assicurazione**: polizza di responsabilità professionale del medico e della struttura, per domicilio e telemedicina.
4. **Disponibilità**: fasce garantite per l'area pilota (Brescia città) prima di mostrare «oggi».
5. **Soggetto erogatore**: chi eroga la prestazione (medico libero professionista o struttura autorizzata) e che
   ruolo ha Cura Privata (intermediario, organizzatore); eventuali autorizzazioni sanitarie regionali.
6. **Responsabilità cliniche**: idoneità del caso a distanza, rifiuto, percorso in presenza, conservazione della sintesi.
7. **Telemedicina**: requisiti delle [indicazioni nazionali](https://www.statoregioni.it/it/conferenza-stato-regioni/sedute-2020/seduta-del-17122020/atti/repertorio-atto-n-215csr/) (identificazione, consenso, piattaforma).
8. **Fatturazione**: chi fattura al paziente, IVA o esenzione per prestazioni sanitarie, compenso al medico.
9. **Privacy**: ruoli (titolare, responsabile), informativa, consenso al trattamento e alla condivisione, indicazioni
   del [Garante sulle piattaforme sanitarie](https://garanteprivacy.it/web/guest/home/docweb/-/docweb-display/docweb/9997624).
10. **Numeri utili**: testi con 112 e 116117 verificati sulla [pagina di Regione Lombardia](https://www.regione.lombardia.it/sanita/prenotazioni-e-tempi-d-attesa/numero-europeo-armonizzato-116-117).

## Costi per prestazione da confermare

| Voce | Domicilio 149 € | Video 69 € | Secondo parere 149 € |
| --- | --- | --- | --- |
| Compenso del medico | da concordare | da concordare | da concordare (revisione documenti, video, stesura sintesi) |
| Tragitto | tempo e costo nell'area pilota (≈ 1 h a visita con andata e ritorno) | — | — |
| Pagamento | commissioni Stripe | commissioni Stripe | commissioni Stripe |
| Piattaforma video | — | costo per minuto o abbonamento | costo per minuto o abbonamento |
| Assicurazione | quota per prestazione | quota per prestazione | quota per prestazione |
| Fatturazione e IVA | da verificare con il commercialista | idem | idem |
