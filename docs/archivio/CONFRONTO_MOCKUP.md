# Confronto con i 4 mockup del kit
*8 novembre 2026. Screenshot reali in `docs/screenshots/{desktop,mobile}/` (prefisso `cp-` per le pagine, `area-` per l'area personale).*

I mockup sono render generati: il kit chiede di riprenderne composizione, ritmo e atmosfera, **non** le affermazioni. Qui sotto che cosa è stato preso e che cosa è stato corretto.

## 01 · Home desktop → `cp-01-home.png`
| Nel mockup | Nel sito |
|---|---|
| Header bianco, logo a sinistra, CTA a destra | Uguale: header chiaro e sticky, «Accedi» + «Prova la demo» |
| Hero «La tua salute, più chiara e accessibile.» con sottolineatura turchese | Uguale, con la traccia di menta animata sotto «più chiara» |
| Sottotitolo che promette secondo parere, archivio, servizi | **Corretto**: il sottotitolo descrive solo ciò che esiste oggi (kit, punto 2) |
| Foto di una donna e nastro a cuore | **Sostituito**: documento interattivo inventato (prova visiva del servizio) e arco del simbolo come nastro; nessuna foto non licenziata |
| Badge «Con il supporto di medici qualificati», «Sicura e riservata» | **Rimossi**: al loro posto quattro fatti verificabili («Su referti inventati, senza registrarti»…) |
| 6 card servizi tutte cliccabili come attive | Card con stato in parole: 2 utilizzabili, 4 «In preparazione» |
| «Come funziona» in 3 passi («in totale sicurezza») | 3 passi, senza claim di sicurezza assoluta |

## 02 · Pagina Referti → `cp-02-referti.png`
| Nel mockup | Nel sito |
|---|---|
| Box «Carica il tuo referto», 20 MB | **Corretto**: niente caricamento pubblico; avviso «Versione dimostrativa» e CTA alla demo (il caricamento vero esiste ma è spento) |
| «Capisci se sono nella norma», «giudizio generale chiaro» | **Rimossi**: vietati dal kit; il sito spiega che non diamo giudizi di normalità |
| «L'IA legge e interpreta i risultati» | «Spieghiamo le parole, le conclusioni restano al medico» |
| Banda privacy «nel rispetto del GDPR», «Risultati in pochi minuti» | **Rimossi**; la sezione «Quando potrai usarlo davvero» dice che cosa manca |
| Esempio di risultato in tre blocchi | Anatomia del report (valori con riga di origine, spiegazione, domande) |

## 03 · Dashboard desktop → `area-2-archivio.png`
| Nel mockup | Nel sito |
|---|---|
| Navigazione laterale | Colonna laterale con «Il tuo spazio», 5 voci, «Nuovo referto», «Esci» |
| Servizi futuri nel menu come attivi | Riquadro tratteggiato «In preparazione» con i 3 servizi futuri |
| Ultimi documenti con «valori nella norma» | Documenti con stato di lavorazione («Verificato», «Pronto»), mai esiti clinici |

## 04 · Mobile (4 schermate) → `mobile/cp-01-home.png`, `mobile/area-*.png`
| Nel mockup | Nel sito |
|---|---|
| Barra di navigazione in basso nell'area personale | Fatto: 5 voci con etichetta, target ≥ 44px |
| Richiesta medico e archivio come funzioni pronte | Secondo parere in DEMO (medico dimostrativo dichiarato), archivio come pagina «In preparazione» |
| Testo piccolo in alcune card | Testo minimo 16–18px, pulsante «Aa» per ingrandire |

## Che cosa manca rispetto ai mockup, di proposito
- Fotografie di persone: servono foto licenziate e liberatorie (vedi `BLOCCHI_LEGALI_CLINICI.md`).
- «Registrati»: la registrazione pubblica resta spenta finché non si aprono i servizi reali.
