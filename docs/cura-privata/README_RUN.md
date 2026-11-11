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
`DEMO_MODE`, `PRODUCTION_COMPLIANCE_APPROVED`, `ENABLE_REAL_UPLOADS`, `ENABLE_AI_PROCESSING`, `ENABLE_LIVE_PAYMENTS`, `ENABLE_MEDICAL_SECOND_OPINION`, `ENABLE_PUBLIC_SIGNUP`, `ENABLE_INDEXING`, `ENABLE_MEDICAL_VIDEO_CONSULT`, `ENABLE_PUBLIC_PRICES` (prezzi visibili di default, `false` li nasconde), `ENABLE_PUNTO_DI_PARTENZA` (acceso di default), `SITE_PROFILE=vetrina` (vedi `LANCIO_VETRINA.md`), `PRICE_CAPISCI_CENTS` / `PRICE_SECONDO_PARERE_CENTS` / `PRICE_VIDEOCONSULTO_CENTS`, `UPGRADE_CREDIT`. Vedi `MEMORABILE.md`.

## Pubblicazione
Il percorso testato è Vercel + Neon (`docs/DEPLOY.md`). Il kit propone anche Cloudflare: **non verificato**. PGlite, pdf-lib e Node crypto non sono garantiti sul runtime Workers; servirebbe una prova reale prima di sceglierlo. Il codice è su GitHub (`cotellisimone-blip/referto-chiaro-`), ramo principale `main`.

Rollback: ogni versione è un commit; i vecchi indirizzi di Referto Chiaro rimandano ai nuovi con redirect permanenti (`next.config.ts`), quindi tornare indietro è un `git revert` del rebrand.
