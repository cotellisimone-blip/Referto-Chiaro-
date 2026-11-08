# Come avviare, verificare e pubblicare Cura Privata

Requisiti: Node.js 22+. Nessuna chiave esterna serve per la demo.

```bash
npm ci
cp .env.example .env.local      # i default tengono tutto spento e in demo
npm run dev                     # http://localhost:3000
```

| Comando | A cosa serve |
|---|---|
| `npm run typecheck` · `npm run lint` | Controlli statici |
| `npm test` | Test unitari (Vitest) |
| `npx playwright test --trace off` | Test end-to-end, accessibilità (axe), sicurezza, desktop e mobile |
| `npm run screenshots` | Screenshot reali in `docs/screenshots/{desktop,mobile}` |
| `npm run build` · `npm start` | Build e avvio di produzione |

## Interruttori (tutti spenti di default; vale solo la stringa esatta `"true"`)
`DEMO_MODE`, `PRODUCTION_COMPLIANCE_APPROVED`, `ENABLE_REAL_UPLOADS`, `ENABLE_AI_PROCESSING`, `ENABLE_LIVE_PAYMENTS`, `ENABLE_MEDICAL_SECOND_OPINION`, `ENABLE_PUBLIC_SIGNUP`, `ENABLE_INDEXING`, **`ENABLE_PUBLIC_PRICES`** (nuovo: mostra i prezzi sul sito solo con listino approvato).

## Pubblicazione
Il percorso testato è Vercel + Neon (`docs/DEPLOY.md`). Il kit propone anche Cloudflare: **non verificato**. PGlite, pdf-lib e Node crypto non sono garantiti sul runtime Workers; servirebbe una prova reale prima di sceglierlo. Il repository GitHub è sospeso: il codice è nel bundle git e nello zip del progetto e si può caricare su GitLab o su un nuovo GitHub senza modifiche.

Rollback: ogni versione è un commit; i vecchi indirizzi di Referto Chiaro rimandano ai nuovi con redirect permanenti (`next.config.ts`), quindi tornare indietro è un `git revert` del rebrand.
