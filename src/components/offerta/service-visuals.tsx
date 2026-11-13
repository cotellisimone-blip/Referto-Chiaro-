import { Check, Clock3, FileCheck2, FileText, Home, ListChecks, PenLine, Printer, Receipt, Stethoscope, UserRound, Video } from "lucide-react";

/*
 * I «pezzi di prodotto» che aprono le pagine dei servizi con un medico. Nessun volto di medico, nessun nome,
 * nessun timbro inventato: solo i fatti del servizio, disegnati.
 */

/** Il videoconsulto come lo vede chi lo prenota. */
export function CallCard({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`glass rounded-[1.5rem] p-3.5 ${className}`}>
      <p className="flex items-center gap-3 text-[1.0625rem] font-extrabold text-ink">
        <span className="tile-ico tile-ico-sm tile-ico-tone h-10 w-10 rounded-xl">
          <Video />
        </span>
        Videoconsulto
      </p>
      <p className="mt-3 flex items-center gap-2.5 rounded-xl bg-canvas px-3 py-2.5 text-[0.9375rem] font-semibold leading-tight text-ink">
        <FileCheck2 className="h-5 w-5 shrink-0 text-[var(--tone-accent)]" />
        Documenti già letti dal medico
      </p>
    </div>
  );
}

/** La sintesi scritta del secondo parere: un foglio firmato. */
export function OpinionSheet({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`scope-light sheet p-6 ${className}`}>
      <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#24618a]">Sintesi scritta</p>
      <p className="mt-3 text-lg font-bold leading-snug text-ink">La tua domanda, e la risposta dello specialista.</p>
      <div className="mt-4 space-y-2.5">
        {[100, 94, 62].map((w, i) => (
          <span key={i} className="block h-2.5 rounded-full bg-[#dfe8ee]" style={{ width: `${w}%` }} />
        ))}
      </div>
      <div className="mt-5 flex items-end justify-between gap-4 border-t border-line pt-4">
        <span className="inline-flex items-center gap-2 text-[0.9375rem] font-semibold text-ink-soft">
          <PenLine className="h-4 w-4 text-[#24618a]" /> Firmata dallo specialista
        </span>
        <svg viewBox="0 0 120 40" className="h-9 w-28" fill="none">
          <path d="M4 30 C 14 6, 22 6, 24 22 S 34 36, 42 18 S 54 8, 58 24 S 72 30, 80 14 S 96 20, 116 12" stroke="#24618a" strokeWidth="2.4" strokeLinecap="round" />
        </svg>
      </div>
    </div>
  );
}

/** La richiesta come la vede il medico nel portale: il quesito, i documenti scelti dal paziente, la scelta. */
export function DoctorCaseVisual({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`case-visual tone-parere ${className}`}>
      <div className="glow-teal absolute -inset-8 rounded-full" />
      <div className="glass relative rounded-[1.75rem] p-5">
        <p className="flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-3 text-[1.0625rem] font-extrabold text-ink">
            <span className="tile-ico tile-ico-sm tile-ico-tone h-10 w-10 rounded-xl">
              <Stethoscope />
            </span>
            Nuova richiesta
          </span>
          <span className="rounded-full bg-mist px-2.5 py-0.5 text-sm font-bold text-ink-soft">Esempio</span>
        </p>
        <p className="mt-5 text-sm font-bold uppercase tracking-[0.12em] text-[var(--tone-accent)]">Secondo parere · il quesito</p>
        <p className="mt-1.5 text-lg font-bold leading-snug text-ink">«Ci sono alternative a quello che mi è stato proposto?»</p>
        <ul className="mt-4 grid gap-2 text-[0.9375rem] font-semibold leading-tight text-ink">
          <li className="flex items-center gap-2.5 rounded-xl bg-canvas px-3 py-2.5">
            <FileText className="h-5 w-5 shrink-0 text-[var(--tone-accent)]" />3 documenti scelti dal paziente
          </li>
          <li className="flex items-center gap-2.5 rounded-xl bg-canvas px-3 py-2.5">
            <Clock3 className="h-5 w-5 shrink-0 text-[var(--tone-accent)]" />
            Visibili finché il caso è aperto
          </li>
        </ul>
        <p className="mt-4 grid grid-cols-[1fr_auto] gap-2 text-[0.9375rem] font-bold">
          <span className="rounded-full bg-[linear-gradient(180deg,#00827b,#006c66)] px-4 py-2.5 text-center text-on-strong">Accetta il caso</span>
          <span className="rounded-full border border-[var(--line-strong)] bg-paper px-4 py-2.5 text-center text-ink">Rifiuta</span>
        </p>
      </div>
      <p className="glass case-chip">
        <PenLine className="h-5 w-5 shrink-0 text-teal" />
        Sintesi firmata, non modificabile
      </p>
    </div>
  );
}

/** La lista che esce da «Preparati alla visita»: poche voci d'esempio, prese dallo strumento. */
export function VisitListVisual({ items, className = "" }: { items: string[]; className?: string }) {
  return (
    <div aria-hidden className={`case-visual tone-capisci ${className}`}>
      <div className="glow-teal absolute -inset-8 rounded-full" />
      <div className="glass relative rounded-[1.75rem] p-5">
        <p className="flex items-center justify-between gap-3">
          <span className="inline-flex items-center gap-3 text-[1.0625rem] font-extrabold text-ink">
            <span className="tile-ico tile-ico-sm tile-ico-tone h-10 w-10 rounded-xl">
              <ListChecks />
            </span>
            La tua lista
          </span>
          <span className="rounded-full bg-mist px-2.5 py-0.5 text-sm font-bold text-ink-soft">Esempio</span>
        </p>
        <p className="mt-5 text-sm font-bold uppercase tracking-[0.12em] text-[var(--tone-accent)]">Da chiedere al medico</p>
        <ul className="mt-2.5 grid gap-2 text-[0.9375rem] font-semibold leading-snug text-ink">
          {items.map((q) => (
            <li key={q} className="flex items-start gap-2.5 rounded-xl bg-canvas px-3 py-2.5">
              <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-md bg-[linear-gradient(180deg,#00827b,#006c66)] text-on-strong">
                <Check className="h-3.5 w-3.5" strokeWidth={3} />
              </span>
              {q}
            </li>
          ))}
        </ul>
      </div>
      <p className="glass case-chip">
        <Printer className="h-5 w-5 shrink-0 text-teal" />
        Da stampare o tenere sul telefono
      </p>
    </div>
  );
}

const STEP_TILES = [
  { icon: FileText, tone: "capisci", left: "0.9%", top: "68%" },
  { icon: Home, tone: "medico", left: "28.2%", top: "45.2%" },
  { icon: Video, tone: "medico", left: "55.5%", top: "22.8%" },
  { icon: Stethoscope, tone: "parere", left: "82.7%", top: "0%" },
] as const;

/** «Un passo alla volta»: le quattro tessere dei servizi sul filo, in salita. Solo decorazione, su schermi larghi. */
export function StepsVisual({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`steps-visual ${className}`}>
      <svg viewBox="0 0 440 250" fill="none">
        <path d="M40 206C100 206 100 149 160 149S220 93 280 93S340 36 400 36" />
      </svg>
      {STEP_TILES.map(({ icon: Icon, tone, left, top }) => (
        <span key={left} className={`tile-ico tile-ico-lg tile-ico-tone tone-${tone}`} style={{ left, top }}>
          <Icon />
        </span>
      ))}
    </div>
  );
}

const BEFORE_PAYING = [
  { icon: UserRound, text: "Il nome del medico" },
  { icon: Clock3, text: "L'orario confermato" },
  { icon: Receipt, text: "Il prezzo totale" },
];

/**
 * La visita a domicilio: una mappa astratta (nessun luogo reale), il tragitto fino a casa e,
 * su vetro, che cosa si vede prima di pagare.
 */
export function HomeVisitVisual({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden className={`visit-visual ${className}`}>
      <div className="visit-map">
        <svg viewBox="0 0 420 420" preserveAspectRatio="xMidYMid slice" fill="none">
          <g transform="rotate(-8 210 210)">
            {/* Un parco e tre isolati, per dare respiro */}
            <rect x="118" y="118" width="74" height="110" rx="18" className="visit-park" />
            <rect x="330" y="186" width="62" height="44" rx="14" className="visit-block" />
            <rect x="226" y="6" width="66" height="68" rx="14" className="visit-block" />
            <rect x="118" y="272" width="74" height="58" rx="14" className="visit-block" />
            {/* Strade */}
            <g className="visit-road" strokeWidth="18" strokeLinecap="round">
              <path d="M-80 250H500" />
              <path d="M310 -80V500" />
              <path d="M-80 96H500" />
              <path d="M96 -80V500" />
            </g>
            <g className="visit-road" strokeWidth="9" strokeLinecap="round">
              <path d="M96 172H500" />
              <path d="M204 -80V96" />
              <path d="M204 250V500" />
              <path d="M-80 350H500" />
              <path d="M408 96V500" />
            </g>
            {/* Il tragitto del medico */}
            <path d="M84 250H286Q310 250 310 226V108" className="visit-route" strokeWidth="5" strokeLinecap="round" strokeDasharray="1 13" />
          </g>
          {/* Partenza e arrivo (coordinate già ruotate) */}
          <g className="visit-stop">
            <rect x="69" y="245" width="44" height="44" rx="14" />
            <Stethoscope x={80} y={256} width={22} height={22} strokeWidth={1.9} />
          </g>
          <g className="visit-home">
            <circle cx="294" cy="87" r="46" className="visit-halo" />
            <rect x="264" y="57" width="60" height="60" rx="19" />
            <Home x={280} y={73} width={28} height={28} strokeWidth={1.9} />
          </g>
        </svg>
      </div>
      <div className="visit-card glass">
        <p className="visit-card-title">Prima di pagare vedi</p>
        <ul>
          {BEFORE_PAYING.map(({ icon: Icon, text }) => (
            <li key={text}>
              <Icon />
              {text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
