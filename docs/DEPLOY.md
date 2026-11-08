# Mettere online Referto Chiaro (Vercel + PostgreSQL gestito)

Questa guida è scritta per Simone. Ogni passo dice **dove cliccare** e **cosa incollare**. Tempo stimato: 45 minuti per la demo online, poi i servizi reali uno alla volta.

> Il codice è pronto per il deploy. Quello che manca è fuori dal codice: account sui servizi, chiavi, e le approvazioni elencate in `docs/PRODUCTION_GATES.md`. Finché quelle non ci sono, il sito resta in **modalità demo** (dati inventati), anche online.

---

## 0. Prima di tutto: riportare il codice su GitHub

Il codice completo, con tutta la storia, è nella cartella del progetto: `codice/referto-chiaro.bundle` (e lo zip `codice/referto-chiaro-codice.zip`).

Quando GitHub ti ha sbloccato l'account (oppure con un account nuovo):

1. Su github.com crea un repository **privato** vuoto (senza README), per esempio `referto-chiaro`.
2. Sul tuo computer, nella cartella dove hai scaricato il bundle:

```bash
git clone referto-chiaro.bundle referto-chiaro
cd referto-chiaro
git remote set-url origin https://github.com/TUO-UTENTE/referto-chiaro.git
git push -u origin --all
```

(Se preferisci, dimmelo e lo faccio io dal progetto, appena il repository è collegato.)

---

## 1. Database PostgreSQL gestito (in Europa)

Consigliato: **Neon** (piano gratuito sufficiente per iniziare; regione Francoforte). Alternative equivalenti: Supabase (regione Francoforte) o Vercel Postgres (che è Neon).

1. Vai su neon.tech → Sign up → **Create project**. Region: **AWS Europe Central 1 (Frankfurt)**. Postgres 16 o 17.
2. Nella pagina del progetto, **Connection string**:
   - copia la stringa **Pooled** → sarà `DATABASE_URL`
   - togli la spunta «Pooled» e copia la stringa diretta → sarà `DATABASE_URL_UNPOOLED`
3. Non serve creare tabelle a mano: lo fa `npm run db:migrate` a ogni deploy (comando idempotente, si può ripetere). Il comando verifica anche che la Row Level Security sia applicabile; se non lo è, il deploy si ferma.

Per provare dal tuo computer:

```bash
DATABASE_URL="la-stringa-diretta" npm run db:migrate
# → [db:migrate] schema aggiornato alla versione 4; ruolo app_rls utilizzabile.
```

---

## 2. Vercel

1. vercel.com → Sign up con GitHub → **Add New… → Project** → importa il repository.
2. Framework: Next.js (rilevato). Build command e cron sono già in `vercel.json` (regione **fra1**, Francoforte).
3. **Settings → Environment Variables**: incolla le variabili del blocco «Demo online» qui sotto (ambiente *Production*). Le chiavi segrete si generano con:

```bash
npm run keys
```

### Blocco «Demo online» (nessun dato reale)

| Variabile | Valore |
|---|---|
| `DEMO_MODE` | `true` |
| `PRODUCTION_COMPLIANCE_APPROVED` | `false` |
| `DATABASE_URL` | stringa *pooled* di Neon |
| `DATABASE_URL_UNPOOLED` | stringa diretta di Neon |
| `DB_RUNTIME_MIGRATIONS` | `false` |
| `PUBLIC_BASE_URL` | `https://refertochiaro.it` (o l'indirizzo `*.vercel.app` all'inizio) |
| `TRUST_PROXY` | `true` (su Vercel l'indirizzo del client arriva da un proxy fidato) |
| `MFA_SECRET_KEY` | da `npm run keys` |
| `CRON_SECRET` | da `npm run keys` |
| `ENABLE_INDEXING` | `false` (finché le guide non sono revisionate da un medico) |

4. **Deploy**. Alla fine apri l'indirizzo: deve comparire il sito con la fascia «versione dimostrativa».
5. Dominio: **Settings → Domains → Add** `refertochiaro.it`, poi copia i record DNS indicati da Vercel nel pannello del registrar del dominio.

Nota sul cron: `vercel.json` lo esegue una volta al giorno (limite del piano gratuito). I lavori partono comunque subito dopo ogni richiesta; il cron è solo una rete di sicurezza. Con il piano Pro si può portare a ogni 5 minuti (`"*/5 * * * *"`).

---

## 3. Email (link di accesso e avvisi)

Consigliato: **Resend** (server in UE disponibili).

1. resend.com → Sign up → **Domains → Add domain** `refertochiaro.it`, regione **EU (Ireland)**. Aggiungi i record DNS (SPF, DKIM) nel pannello del dominio e attendi «Verified».
2. **API Keys → Create** (permesso «Sending access»).
3. Su Vercel aggiungi:

| Variabile | Valore |
|---|---|
| `EMAIL_PROVIDER` | `resend` |
| `RESEND_API_KEY` | `re_...` |
| `EMAIL_FROM` | `Referto Chiaro <no-reply@refertochiaro.it>` |

In alternativa Postmark: `EMAIL_PROVIDER=postmark` e `POSTMARK_SERVER_TOKEN`.

Le email non contengono mai dati sanitari: solo «il link per accedere», «pagamento ricevuto», «la spiegazione è pronta» con un link all'area personale. In demo il link di accesso resta mostrato a schermo.

---

## 4. Pagamenti (Stripe) — prima in TEST

1. dashboard.stripe.com → crea l'account. Resta in **modalità Test** (interruttore in alto).
2. **Developers → API keys** → copia la *Secret key* `sk_test_...` → `STRIPE_SECRET_KEY`.
3. **Developers → Webhooks → Add endpoint**: URL `https://TUO-DOMINIO/api/v1/payments/webhook`, eventi `checkout.session.completed`, `checkout.session.async_payment_succeeded`, `checkout.session.expired`. Copia il *Signing secret* `whsec_...` → `STRIPE_WEBHOOK_SECRET`.
4. Prova un acquisto con la carta di test `4242 4242 4242 4242`.

**Pagamenti veri** (`sk_live_...`) funzionano solo se insieme: `DEMO_MODE=false`, `PRODUCTION_COMPLIANCE_APPROVED=true`, `ENABLE_LIVE_PAYMENTS=true`, e un webhook *live* con il suo segreto. Il webhook rifiuta gli eventi di test quando la chiave è live, e viceversa. Prima servono ragione sociale, termini e recesso approvati (vedi gate C).

---

## 5. Lettura dei referti e intelligenza artificiale

Si accendono **solo dopo** i gate B (DPIA, parere MDR, DPA con i fornitori, revisione medica). Il codice è pronto:

| Variabile | Valore |
|---|---|
| `ENABLE_REAL_UPLOADS` | `true` → accetta PDF e foto (max 4 MB), cifrati nel database |
| `FILE_ENCRYPTION_KEY` | da `npm run keys` — **conservala**: senza, i file non si leggono più |
| `ENABLE_AI_PROCESSING` | `true` → foto/scansioni lette con Claude, spiegazioni scritte con Claude |
| `ANTHROPIC_API_KEY` | da console.anthropic.com → API Keys |
| `AI_MODEL` | `claude-opus-5-5` (default). Per risparmiare: `claude-sonnet-5-5`, **dopo** aver ripetuto la valutazione |
| `ENABLE_PUBLIC_SIGNUP` | `true` quando si vogliono nuove registrazioni |
| `DEMO_MODE` | `false` |
| `PRODUCTION_COMPLIANCE_APPROVED` | `true` (solo con l'approvazione registrata) |

Cosa succede con ogni combinazione:

- **Solo `ENABLE_REAL_UPLOADS`**: si leggono i PDF digitali del laboratorio, senza alcun modello AI; le spiegazioni usano il glossario interno. Foto e scansioni vengono rifiutate con un messaggio chiaro.
- **Anche `ENABLE_AI_PROCESSING`**: le foto vengono trascritte da Claude; il riconoscimento degli esami e le spiegazioni sono scritti da Claude, con i controlli descritti in `docs/AI_VALUTAZIONE.md`.

Prima di accendere l'AI, esegui la valutazione con il modello vero (costo: pochi centesimi):

```bash
ANTHROPIC_API_KEY=sk-ant-... EVAL_LIVE=1 npm run eval:ai
```

e controlla `docs/AI_VALUTAZIONE.md`: zero valori inventati, zero dati personali o istruzioni nell'output, spiegazioni tutte coerenti.

Costo indicativo: con Claude Opus 5.5 pochi centesimi di dollaro per referto (lettura + spiegazione); il numero esatto lo scrive la valutazione dal vivo in `docs/AI_VALUTAZIONE.md`. La tabella `ai_runs` registra modello, token ed esito di ogni elaborazione (mai il contenuto).

---

## 6. Controllo finale prima di aprire al pubblico

- [ ] `npm test` e `npm run test:e2e -- --trace off` verdi sull'ultima versione
- [ ] Deploy riuscito, `npm run db:migrate` nel log di build con «ruolo app_rls utilizzabile»
- [ ] Link di accesso ricevuto per email su un indirizzo vero
- [ ] Acquisto di prova Stripe in modalità test → ordine «pagato», email di conferma ricevuta
- [ ] Le pagine legali non riportano più «BOZZA» e hanno titolare e contatti reali
- [ ] Tutti i punti di `docs/PRODUCTION_GATES.md` necessari per ciò che si accende

## Comandi utili

| Comando | Cosa fa |
|---|---|
| `npm run setup` | Tutto in un comando: dipendenze, `.env.local` con chiavi generate, migrazione (se c'è `DATABASE_URL`), controlli |
| `npm run keys` | Genera `MFA_SECRET_KEY`, `FILE_ENCRYPTION_KEY`, `CRON_SECRET` |
| `npm run db:migrate` | Crea/aggiorna le tabelle sul database indicato da `DATABASE_URL` |
| `npm run eval:ai` | Valutazione della pipeline AI (con `EVAL_LIVE=1` usa il modello vero) |
| `E2E_DATABASE_URL=... npm run test:e2e` | Test end-to-end contro un PostgreSQL vero invece di PGlite |
