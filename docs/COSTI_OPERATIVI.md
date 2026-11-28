# Costi operativi

*Aggiornato l'11/11/2026 (ciclo 1, fase 5). Numeri calcolati da `src/domain/costi-ai.ts`, coperti da `tests/unit/costi-ai.test.ts`.*

**Attenzione:** i token per referto sono **stime**, non misure. La valutazione dal vivo non è mai stata eseguita perché manca una chiave Anthropic. Appena c'è la chiave:

```bash
ANTHROPIC_API_KEY=... EVAL_LIVE=1 npm run eval:ai                         # modello predefinito (Opus 5.5)
ANTHROPIC_API_KEY=... EVAL_LIVE=1 AI_MODEL=claude-sonnet-5-5 npm run eval:ai
ANTHROPIC_API_KEY=... EVAL_LIVE=1 AI_MODEL=claude-haiku-5-5 npm run eval:ai
```

Ogni esecuzione scrive in `docs/AI_VALUTAZIONE.md` qualità, violazioni e costo reale per referto. Spesa prevista per le tre esecuzioni: meno di 10 $. In produzione il costo reale si legge in **Admin → Panoramica → Costo AI** (somma dei token registrati in `ai_runs`, account demo esclusi).

## Tariffe usate

| Voce | Valore | Fonte |
|---|---|---|
| Claude Opus 5.5 | 4 $ / 20 $ per milione di token (ingresso / uscita) | Listino Anthropic, novembre 2026 |
| Claude Sonnet 5.5 | 2 $ / 10 $ | idem |
| Claude Haiku 5.5 | 0,10 $ / 0,50 $ | idem |
| Stripe, carte standard SEE | 1,5% + 0,25 € | stripe.com/it/pricing, verificata l'11/11/2026 (carte UK 2,5% + 0,25 €, extra SEE 3,15% + 0,25 €) |
| Cambio | 1 $ = 0,90 € | **ipotesi** |
| IVA sul prezzo al pubblico | 22% | **ipotesi**: Capisci è un servizio digitale senza medico; da confermare con il commercialista |

## Token stimati per referto (tre passi: trascrizione, struttura, spiegazione)

| Scenario | Ingresso | Uscita |
|---|---|---|
| PDF con testo, 1 pagina, ~25 esami (niente trascrizione) | 3.600 | 9.000 |
| Foto di 1 pagina, ~25 esami | 5.600 | 11.500 |
| Foto di 3 pagine, ~60 esami, un nuovo tentativo | 15.000 | 35.000 |

L'uscita pesa più dell'ingresso perché l'AI scrive una spiegazione per ogni esame e ragiona prima di rispondere (effort `medium`). I prompt di sistema sono corti (circa 2.000, 600 e 1.100 caratteri).

## Costo AI per referto

| Scenario | Opus 5.5 | Sonnet 5.5 | Haiku 5.5 |
|---|---|---|---|
| PDF con testo | 0,19 $ (0,17 €) | 0,10 $ (0,09 €) | 0,005 $ |
| Foto, 1 pagina | 0,25 $ (0,23 €) | 0,13 $ (0,11 €) | 0,006 $ |
| Foto, 3 pagine | 0,76 $ (0,68 €) | 0,38 $ (0,34 €) | 0,02 $ |

## Margine lordo per referto venduto

Prezzo al netto IVA − commissione Stripe − costo AI. Esclusi hosting, email, storage, assistenza e marketing.

| Prezzo | Netto IVA | Stripe | AI (Opus, foto 1 pagina) | **Margine** | Caso peggiore (Opus, 3 pagine) |
|---|---|---|---|---|---|
| 2,90 € (primo referto) | 2,38 € | 0,29 € | 0,23 € | **1,86 €** | 1,41 € |
| 7,90 € | 6,48 € | 0,37 € | 0,23 € | **5,88 €** | 5,43 € |

Con 2,90 € la voce più pesante è la quota fissa di Stripe (0,25 €), non l'AI.

## Scelta del modello

Il modello predefinito resta **Opus 5.5** (`AI_MODEL` in `src/providers/ai/config.ts`). Passare a Sonnet farebbe risparmiare circa 0,12 € a referto (il 5% del netto a 2,90 €). Non conviene cambiare finché la valutazione dal vivo non dimostra che Sonnet o Haiku danno la stessa qualità, con zero violazioni di linguaggio e zero valori alterati. Haiku costerebbe quasi zero, ma la sua qualità su questi referti non è mai stata misurata.

## Altre voci (non misurate)

| Voce | Stato |
|---|---|
| Hosting Vercel (Pro, uso commerciale) e database Neon | Dipende dal piano scelto; vedi `docs/DEPLOY.md` |
| Email Resend/Postmark | Piani d'ingresso sufficienti per il lancio |
| Storage cifrato e backup | Dipende da volumi e tempi di conservazione |
| Antivirus sui caricamenti | Da scegliere (debito tecnico, obbligatorio prima dei referti veri) |

Lo scenario del kit iniziale (costo variabile 1,80 € per ordine, CAC 6 €) resta un'ipotesi non verificata; con queste stime il costo variabile per referto è di circa 0,50 € (Stripe + AI).
