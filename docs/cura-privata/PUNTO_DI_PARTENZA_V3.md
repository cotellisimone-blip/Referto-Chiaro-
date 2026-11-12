# Punto di Partenza — pacchetto V3 (11/11/2026)

Ingresso gratuito per chi non ha ancora un referto: **Conosci meglio la tua salute. Gratis.**
Funnel: Punto di Partenza (gratis) → Capisci il tuo referto (primo 2,90 €, poi 7,90 €) → Parla con un medico (79 €) → Secondo parere (da 149 €).

## Che cosa c'è
- **Pagina `/punto-di-partenza`**: hero, tre passaggi, le tre nature (Base / Contestuale / Non di routine), box «Più esami non significa più prevenzione», guida.
- **Guida in 4 domande + scheda** (5 passi, circa 3–5 minuti): obiettivo → cosa hai già → contesto (età, fumo, attività, familiarità, condizioni note; sempre «preferisco non indicare») → le 10 aree (si segna «Ho già informazioni recenti») → scheda.
- **Risultato**: completezza delle informazioni (15 voci: 5 di contesto + 10 aree; «misura la mappa, non la salute»), Già documentato / Da discutere con il medico / Non di routine, 4–6 domande per il medico scelte da regole fisse, note personali, **PDF A4** generato nel browser (stessi colori, logo e font del report), stampa, ponte verso «Capisci» (CTA unica e grande) e «Parla con un medico».
- **Home**: doppio ingresso subito dopo la hero («Non hai ancora gli esami? Parti dalla tua salute» / «Hai già un referto? Rendilo chiaro»); il blocco scuro diventa «Come diventa chiaro un referto»; il Journey ha il passo 0 «Parti · Gratis»; la chiusura usa la frase ponte.
- **Navigazione**: voce nel fondo pagina (Gratis), ricerca interna (anche «check-up», «prevenzione», «controlli»), sitemap. Nessuna voce in più nell'header.
- **Funnel anonimo** (`funnel_daily`, già esistente): `cta-pdp`, `pdp-start`, `pdp-step-2`, `pdp-complete`, `pdp-download`, `pdp-to-referto`, `pdp-to-medico`; visibili nel pannello admin.
- **Feature gate**: `ENABLE_PUNTO_DI_PARTENZA` (acceso di base, `"false"` lo spegne ovunque); `ENABLE_PUNTO_DI_PARTENZA_SAVE` predisposto e bloccato dal gate di conformità.

## Privacy
Le risposte restano in memoria nella pagina: niente account, niente storage, niente URL con dati, niente invio al server. Al server arrivano solo i nomi dei passi. Il PDF non viene salvato da nessuna parte.

## Scelte da confermare con il medico revisore
- Ematologia (emocromo) classificata **Contestuale** (il pacchetto dice «contestuale/base editoriale»).
- Sesso biologico **non chiesto**: nella V1 nessun contenuto lo richiede.
- Le note di contesto citano l'informazione data («Hai indicato il fumo: è un'informazione che il medico considera…»), mai un giudizio.

## Non fatto, di proposito
Nessun motore AI, nessuno score, nessuna età biologica, nessun abbonamento, nessun laboratorio, nessun salvataggio nell'area personale. `/servizi/prevenzione` e «Preparati alla visita» restano dove sono.

## File principali
`src/content/punto-di-partenza.ts`, `src/domain/punto-di-partenza.ts`, `src/domain/punto-di-partenza-pdf.ts`, `src/domain/reporting/pdf-brand.ts`, `src/app/punto-di-partenza/page.tsx`, `src/components/punto-di-partenza/*`, `src/app/page.tsx`, `src/components/offerta/journey.tsx`, `src/lib/feature-flags.ts`, `src/domain/metrics/funnel.ts`; test `tests/unit/punto-di-partenza.test.ts`, `tests/e2e/punto-di-partenza.spec.ts`.
