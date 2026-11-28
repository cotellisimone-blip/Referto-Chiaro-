# Audit «da esterni»: sicurezza, GDPR, codice

Eseguito il 7 novembre 2026 sul codice al commit precedente (`0fc242c`), con tre revisioni indipendenti
(sicurezza applicativa, protezione dei dati, qualità del codice) e correzioni applicate nello stesso giorno.
Non sostituisce un penetration test né una consulenza legale: è una revisione interna condotta con il metodo di un revisore esterno.

## Risultato in breve

- **Sicurezza**: nessuna vulnerabilità critica. Un problema medio (iniezione di formule nel CSV dell'admin) e alcuni punti di robustezza, tutti corretti.
- **GDPR**: l'architettura era corretta (isolamento per utente nel database, minimizzazione, export e cancellazione), ma consensi, cancellazione e informativa erano incompleti. Corretti nel codice; l'informativa resta una bozza da far verificare a un professionista.
- **Codice**: nessun difetto bloccante; corretti una transazione spezzata, un ripiego silenzioso sui pagamenti, un limite non applicato ai tentativi dei job, due controlli di autorizzazione troppo larghi.

## Che cosa è stato corretto

| Area | Problema | Correzione |
|---|---|---|
| Sicurezza | CSV della lista d'attesa: una nota che inizia con `=` diventava una formula in Excel | Celle che iniziano con `= + - @ tab CR` precedute da apostrofo |
| Sicurezza | `DEMO_MODE` acceso per default anche in produzione se la variabile mancava | Default acceso solo fuori da `NODE_ENV=production`; in produzione va dichiarato |
| Sicurezza | Senza chiavi Stripe il checkout era «simulato» anche fuori demo | Fuori demo senza chiavi: errore esplicito (`PaymentsMisconfiguredError`), nessun ripiego |
| Sicurezza | Codice TOTP riutilizzabile entro la finestra di 90 secondi | Si registra l'ultimo passo accettato (`mfa_last_step`); lo stesso codice non vale due volte. Esenti solo gli account dimostrativi condivisi |
| Sicurezza | Segreti TOTP in chiaro nel database | Cifratura AES-256-GCM con `MFA_SECRET_KEY`; fuori demo senza chiave la 2FA non si attiva |
| Sicurezza | Limite di tentativi 2FA per indirizzo IP, aggirabile | Limite per utente |
| Sicurezza | `X-Forwarded-For` creduto sempre: limiti aggirabili con un header | Creduto solo con `TRUST_PROXY=true`; altrimenti tutti i client contano come uno |
| Sicurezza | Link di accesso: due richieste simultanee potevano aprire due sessioni | Consumo atomico (`UPDATE … WHERE used_at IS NULL RETURNING`) |
| Sicurezza | In demo chiunque poteva ottenere a schermo il link di accesso di un account altrui | Link a schermo solo per account appena creati, domini di prova (`.invalid`, `.test`, `example`) e account demo; la risposta non dice se l'indirizzo esiste |
| Sicurezza | Il ruolo applicativo poteva aggiornare qualsiasi colonna di `users` (ruolo, 2FA) | `GRANT UPDATE` limitato a email, nome, cancellazione, ultimo accesso |
| Sicurezza | `audit_log` senza RLS: ogni utente poteva leggere il registro di tutti | RLS: ognuno legge solo le proprie voci; inserimento sempre consentito; mai modifica |
| Sicurezza | Il medico poteva leggere il documento anche dopo la chiusura del caso | Lettura solo con caso `submitted` o `accepted` |
| Sicurezza | Sessioni di 30 giorni anche per medici e admin | 14 giorni per gli utenti, 12 ore per medici e admin |
| GDPR | Un solo checkbox per termini, privacy e dati sanitari | Quattro consensi separati: termini, privacy, dati sanitari (esplicito, art. 9), dichiarazione di maggiore età e di caricare solo referti propri |
| GDPR | Il consenso ai dati sanitari non si poteva revocare senza eliminare l'account | Revoca dalle impostazioni: cancella subito referti, report, dossier e richieste; blocca nuovi referti; l'account resta |
| GDPR | Nessun consenso specifico alla condivisione con il medico | Checkbox dedicato nella richiesta di secondo parere, registrato per caso; domanda limitata a 500 caratteri |
| GDPR | L'eliminazione lasciava consensi, casi, link, segreto 2FA e lista d'attesa | Cancellazione completa; restano solo la riga anonimizzata, gli ordini senza contenuti e il registro |
| GDPR | L'esportazione non includeva ordini, casi e registro | Inclusi |
| GDPR | Nessuna pulizia dei dati scaduti | Link scaduti, sessioni scadute da 30 giorni e lista d'attesa oltre 12 mesi cancellati periodicamente |
| GDPR | Informativa, cookie e termini generici | Tabella dati/scopo/conservazione, basi giuridiche, destinatari, diritti; cookie e memoria del browser descritti; termini con requisiti (maggiorenni, referti propri) e condizioni del secondo parere. Sempre «BOZZA — DA REVISIONARE» |
| Codice | Creazione del report fuori dalla transazione del pagamento | Stessa transazione (`createReportIn`) |
| Codice | Job falliti riaccodati all'infinito, un errore faceva saltare la transazione | Massimo 3 tentativi con `SAVEPOINT`; stato `failed` dopo il terzo |
| Codice | Limitatore in memoria senza pulizia | Pulizia oltre 10 000 chiavi |
| Codice | «inferiore a» interpretato come limite inclusivo | Stretto, come `<`; inclusivo solo con `<=`/`≤` |
| Codice | Driver del database restava in cache dopo un errore di connessione | Cache azzerata al fallimento; avviso se PGlite è usato in produzione |
| Codice | I flag di ambiente letti al build finivano nelle pagine statiche | Pagina di accesso legge i flag a ogni richiesta (`connection()`) |

## Che cosa resta fuori dal codice

- Nomina del titolare, del contatto privacy e dell'eventuale DPO; verifica legale di informativa, cookie e termini (restano bozze).
- Valutazione d'impatto (DPIA) prima di trattare dati sanitari reali; registro dei trattamenti; contratti con i fornitori (hosting, email, pagamenti).
- Penetration test esterno prima dell'apertura; rotazione della chiave `MFA_SECRET_KEY` da pianificare.
- CSP con `'unsafe-inline'` per gli script (limite delle pagine statiche, vedi decisione 33).
- Il limitatore di richieste è in memoria: con più istanze serve uno condiviso.
