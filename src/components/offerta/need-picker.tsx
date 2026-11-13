"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { ArrowRight, ClipboardList, FileText, Home, Stethoscope, Video } from "lucide-react";
import { clsx } from "clsx";

export interface PickerService {
  id: "capisci" | "domicilio" | "secondo-parere" | "parla-con-un-medico";
  name: string;
  href: string;
  startHref: string;
  startLabel: string;
  price: string | null;
  timing: string;
  need: string;
  /** Assente per la visita a domicilio, che non è un livello del percorso Capisci → Orientati → Approfondisci. */
  level?: { n: number; verb: string };
}

/** Ordine delle risposte: i tre livelli, poi lo strumento gratuito. La frase del bisogno arriva da src/domain/offerta.ts. */
const ORDER = ["capisci", "domicilio", "parla-con-un-medico", "secondo-parere"] as const;
const WHY = {
  capisci: "Il tuo referto diventa un report chiaro, con i valori controllati da te e le domande da fare al medico. È automatico: nessun medico lo rivede.",
  domicilio: "Un medico di medicina generale viene a casa, per esigenze non urgenti, e lascia un riepilogo scritto con il prossimo passo. Per ora a Brescia città.",
  "parla-con-un-medico": "Un medico di medicina generale o internista legge prima i tuoi documenti e, in video, ti aiuta a capire il prossimo passo. Non devi scegliere tu la specialità.",
  "secondo-parere": "Uno specialista della disciplina appropriata valuta i tuoi documenti e risponde per iscritto alla tua domanda.",
} as const;
const TONE = { capisci: "capisci", domicilio: "medico", "parla-con-un-medico": "medico", "secondo-parere": "parere", tool: "capisci" } as const;
const ICON = { capisci: FileText, domicilio: Home, "parla-con-un-medico": Video, "secondo-parere": Stethoscope, tool: ClipboardList } as const;
const TOOL = { label: "Ho una visita e voglio arrivare preparato", why: "Uno strumento gratuito: in 2 minuti hai la lista di cosa portare e cosa chiedere." };

type Choice = (typeof ORDER)[number] | "tool";

/**
 * «Ti aiutiamo a scegliere»: una domanda sola, cinque risposte fisse, sul BISOGNO e mai sui sintomi.
 * Non fa domande cliniche, non valuta urgenze, non è un chatbot: porta al servizio adatto, con prezzo e tempi.
 */
export function NeedPicker({ services, headingId }: { services: PickerService[]; headingId?: string }) {
  const [need, setNeed] = useState<Choice | null>(null);
  const name = useId();
  const options: { id: Choice; label: string }[] = [...ORDER.map((id) => ({ id, label: services.find((s) => s.id === id)?.need ?? "" })), { id: "tool", label: TOOL.label }];
  const service = need && need !== "tool" ? services.find((s) => s.id === need) ?? null : null;
  const Icon = need ? ICON[need] : null;

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-7 lg:grid-cols-[1.08fr_0.92fr] lg:gap-12">
      <fieldset aria-describedby={`${name}-nota`}>
        <legend className="text-[1.375rem] font-extrabold tracking-[-0.01em] text-ink" id={headingId ? `${headingId}-domanda` : undefined}>
          Che cosa ti serve oggi?
        </legend>
        <div className="mt-4 grid gap-2.5 sm:gap-3">
          {options.map((o) => {
            const OIcon = ICON[o.id];
            return (
              <label key={o.id} className={clsx("need-option", `tone-${TONE[o.id]}`)}>
                <span aria-hidden className="tile-ico tile-ico-sm tile-ico-tone">
                  <OIcon />
                </span>
                <span className="flex-1">{o.label}</span>
                <input type="radio" name={name} value={o.id} checked={need === o.id} onChange={() => setNeed(o.id)} className="h-6 w-6 shrink-0 accent-[var(--tone-accent)]" />
              </label>
            );
          })}
        </div>
        <p id={`${name}-nota`} className="mt-4 text-[1.0625rem] text-muted">
          Non ti chiediamo sintomi né dati sanitari: scegli in base a ciò che ti serve. Per un&apos;urgenza chiama il 112.
        </p>
      </fieldset>

      <div aria-live="polite" className="min-h-[1px] lg:pt-[2.875rem]">
        {need && Icon ? (
          <div key={need} className={clsx("need-result scene-pop", `tone-${TONE[need]}`)}>
            <p className="eyebrow eyebrow-plain tone-text">Ti consigliamo</p>
            <div className="mt-4 flex items-center gap-4">
              <span aria-hidden className="tile-ico tile-ico-tone">
                <Icon />
              </span>
              <p className="text-[1.5rem] font-extrabold leading-[1.15] tracking-[-0.02em] text-ink sm:text-[1.75rem]">{service ? service.name : "Preparati alla visita in 2 minuti"}</p>
            </div>
            <p className="mt-4 text-lg leading-[1.5] text-ink-soft">{service ? WHY[service.id] : TOOL.why}</p>
            <dl className="mt-5 grid gap-3 border-t border-line pt-5 text-lg sm:grid-cols-2">
              {service ? (
                <>
                  {service.price ? (
                    <div>
                      <dt className="text-[0.9375rem] font-semibold uppercase tracking-[0.06em] text-muted">Prezzo</dt>
                      <dd className="font-bold text-ink">{service.price}</dd>
                    </div>
                  ) : null}
                  <div>
                    <dt className="text-[0.9375rem] font-semibold uppercase tracking-[0.06em] text-muted">Tempi</dt>
                    <dd className="font-bold text-ink">{service.timing}</dd>
                  </div>
                </>
              ) : (
                <div>
                  <dt className="text-[0.9375rem] font-semibold uppercase tracking-[0.06em] text-muted">Prezzo</dt>
                  <dd className="font-bold text-ink">Gratis, senza registrarti</dd>
                </div>
              )}
            </dl>
            <Link href={service ? service.href : "/strumenti/preparati-alla-visita"} data-track={service ? `cta-${TONE[service.id]}` : undefined} className="btn btn-primary btn-lg mt-6 w-full sm:w-auto">
              {service ? "Scopri il servizio" : "Inizia, è gratis"} <ArrowRight aria-hidden className="btn-arrow h-5 w-5" />
            </Link>
          </div>
        ) : (
          <div className="need-empty">
            <span aria-hidden className="flex -space-x-2">
              {ORDER.map((id) => {
                const EIcon = ICON[id];
                return (
                  <span key={id} className={clsx("tile-ico tile-ico-sm tile-ico-tone", `tone-${TONE[id]}`)}>
                    <EIcon />
                  </span>
                );
              })}
            </span>
            <p className="text-xl leading-snug text-ink-soft">Scegli una risposta: ti indichiamo il servizio adatto, con prezzo e tempi.</p>
          </div>
        )}
      </div>
    </div>
  );
}
