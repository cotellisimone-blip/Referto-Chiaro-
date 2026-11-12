"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { ArrowRight, ClipboardList, FileText, Stethoscope, Video } from "lucide-react";
import { clsx } from "clsx";

export interface PickerService {
  id: "capisci" | "secondo-parere" | "parla-con-un-medico";
  name: string;
  href: string;
  startHref: string;
  startLabel: string;
  price: string | null;
  timing: string;
  need: string;
  level: { n: number; verb: string };
}

/** Ordine delle risposte: i tre livelli, poi lo strumento gratuito. La frase del bisogno arriva da src/domain/offerta.ts. */
const ORDER = ["capisci", "parla-con-un-medico", "secondo-parere"] as const;
const WHY = {
  capisci: "Il tuo referto diventa un report chiaro, con i valori controllati da te e le domande da fare al medico. È automatico: nessun medico lo rivede.",
  "parla-con-un-medico": "Un medico di medicina generale o internista legge prima i tuoi documenti e, in video, ti aiuta a capire il prossimo passo. Non devi scegliere tu la specialità.",
  "secondo-parere": "Uno specialista della disciplina appropriata valuta i tuoi documenti e risponde per iscritto alla tua domanda.",
} as const;
const TONE = { capisci: "capisci", "parla-con-un-medico": "medico", "secondo-parere": "parere", tool: "capisci" } as const;
const ICON = { capisci: FileText, "parla-con-un-medico": Video, "secondo-parere": Stethoscope, tool: ClipboardList } as const;
const TOOL = { label: "Ho una visita e voglio arrivare preparato", why: "Uno strumento gratuito: in 2 minuti hai la lista di cosa portare e cosa chiedere." };

type Choice = (typeof ORDER)[number] | "tool";

/**
 * «Ti aiutiamo a scegliere»: una domanda sola, quattro risposte fisse, sul BISOGNO e mai sui sintomi.
 * Non fa domande cliniche, non valuta urgenze, non è un chatbot: porta al servizio adatto, con prezzo e tempi.
 */
export function NeedPicker({ services, headingId }: { services: PickerService[]; headingId?: string }) {
  const [need, setNeed] = useState<Choice | null>(null);
  const name = useId();
  const options: { id: Choice; label: string }[] = [...ORDER.map((id) => ({ id, label: services.find((s) => s.id === id)?.need ?? "" })), { id: "tool", label: TOOL.label }];
  const service = need && need !== "tool" ? services.find((s) => s.id === need) ?? null : null;
  const Icon = need ? ICON[need] : null;

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12">
      <fieldset aria-describedby={`${name}-nota`}>
        <legend className="text-[1.375rem] font-bold text-ink" id={headingId ? `${headingId}-domanda` : undefined}>
          Che cosa ti serve oggi?
        </legend>
        <div className="mt-5 grid gap-3">
          {options.map((o) => {
            const OIcon = ICON[o.id];
            return (
              <label key={o.id} className={clsx("need-option", `tone-${TONE[o.id]}`)}>
                <span className="tone-icon h-12 w-12 shrink-0">
                  <OIcon aria-hidden className="h-6 w-6" />
                </span>
                <span className="flex-1">{o.label}</span>
                <input type="radio" name={name} value={o.id} checked={need === o.id} onChange={() => setNeed(o.id)} className="h-6 w-6 shrink-0 accent-[var(--tone-accent)]" />
              </label>
            );
          })}
        </div>
        <p id={`${name}-nota`} className="mt-5 text-[1.0625rem] text-muted">
          Non ti chiediamo sintomi né dati sanitari: scegli in base a ciò che ti serve. Per un&apos;urgenza chiama il 112.
        </p>
      </fieldset>

      <div aria-live="polite" className="min-h-[1px] lg:pt-12">
        {need && Icon ? (
          <div key={need} className={clsx("scene-pop overflow-hidden rounded-[2rem] border border-[color-mix(in_srgb,var(--tone-accent)_25%,transparent)] bg-[linear-gradient(165deg,var(--tone-bg),var(--color-paper)_75%)] p-7 shadow-[var(--shadow-float)] sm:p-9", `tone-${TONE[need]}`)}>
            <p className="eyebrow !text-[var(--tone-accent)]">{service ? `Ti consigliamo · livello ${service.level.n}` : "Ti consigliamo"}</p>
            <div className="mt-5 flex items-center gap-4">
              <span className="tone-icon h-14 w-14 shrink-0">
                <Icon aria-hidden className="h-7 w-7" />
              </span>
              <p className="text-[1.75rem] font-extrabold leading-tight tracking-[-0.01em] text-ink">{service ? service.name : "Preparati alla visita in 2 minuti"}</p>
            </div>
            <p className="mt-5 text-lg text-ink-soft">{service ? WHY[service.id] : TOOL.why}</p>
            <dl className="mt-6 grid gap-3 border-t border-line pt-5 text-lg">
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
            <Link href={service ? service.href : "/strumenti/preparati-alla-visita"} data-track={service ? `cta-${TONE[service.id]}` : undefined} className="btn btn-primary btn-lg mt-7 w-full sm:w-auto">
              {service ? "Scopri il servizio" : "Inizia, è gratis"} <ArrowRight aria-hidden className="btn-arrow h-5 w-5" />
            </Link>
          </div>
        ) : (
          <div className="flex min-h-56 flex-col items-start justify-center gap-4 rounded-[2rem] border-2 border-dashed border-line bg-paper/60 p-8">
            <span aria-hidden className="flex gap-2">
              {ORDER.map((id) => (
                <span key={id} className={clsx("h-3 w-10 rounded-full bg-[var(--tone-accent)] opacity-70", `tone-${TONE[id]}`)} />
              ))}
            </span>
            <p className="text-xl text-ink-soft">Scegli una risposta: ti indichiamo il servizio adatto, con prezzo e tempi.</p>
          </div>
        )}
      </div>
    </div>
  );
}
