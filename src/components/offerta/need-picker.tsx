"use client";

import { CapisciScene, MedicoScene, ParereScene } from "./scenes";
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
}

const NEEDS = [
  { id: "referto", label: "Ho ricevuto un referto e non lo capisco", target: "capisci", why: "Ti spieghiamo il referto in parole semplici, con i valori controllati da te e le domande da fare al medico." },
  { id: "diagnosi", label: "Ho già una diagnosi o una proposta di cura", target: "secondo-parere", why: "Un medico della specialità giusta valuta i tuoi documenti e risponde per iscritto alla tua domanda." },
  { id: "altra", label: "Voglio un'altra valutazione prima di decidere", target: "secondo-parere", why: "Un parere indipendente, scritto e firmato, da portare al tuo medico curante." },
  { id: "parlare", label: "Voglio parlare direttamente con un medico", target: "parla-con-un-medico", why: "Un videoconsulto con un medico che ha già letto i documenti che scegli di condividere." },
  { id: "visita", label: "Ho una visita e voglio arrivare preparato", target: "tool", why: "Uno strumento gratuito: in 2 minuti hai la lista di cosa portare e cosa chiedere." },
] as const;

const ICON = { capisci: FileText, "secondo-parere": Stethoscope, "parla-con-un-medico": Video, tool: ClipboardList } as const;

/**
 * «Ti aiutiamo a scegliere»: parte dal BISOGNO, mai dai sintomi. Non fa domande cliniche, non valuta urgenze,
 * non è un chatbot: è un selettore con 5 risposte fisse che porta al servizio adatto.
 */
export function NeedPicker({ services, headingId }: { services: PickerService[]; headingId?: string }) {
  const [need, setNeed] = useState<(typeof NEEDS)[number]["id"] | null>(null);
  const name = useId();
  const chosen = NEEDS.find((n) => n.id === need) ?? null;
  const service = chosen && chosen.target !== "tool" ? services.find((s) => s.id === chosen.target) ?? null : null;
  const Icon = chosen ? ICON[chosen.target] : null;

  return (
    <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
      <fieldset aria-describedby={`${name}-nota`}>
        <legend className="text-xl font-bold text-ink" id={headingId ? `${headingId}-domanda` : undefined}>
          Che cosa ti serve oggi?
        </legend>
        <div className="mt-4 grid gap-3">
          {NEEDS.map((n) => (
            <label
              key={n.id}
              className={clsx(
                "flex min-h-14 cursor-pointer items-center gap-4 rounded-2xl border bg-paper px-5 py-3.5 text-lg font-semibold text-ink transition-colors",
                need === n.id ? "border-teal bg-mist shadow-[var(--shadow-card)]" : "border-line hover:border-teal/50",
              )}
            >
              <input type="radio" name={name} value={n.id} checked={need === n.id} onChange={() => setNeed(n.id)} className="h-5 w-5 shrink-0 accent-[var(--color-teal)]" />
              {n.label}
            </label>
          ))}
        </div>
        <p id={`${name}-nota`} className="mt-4 text-[1.0625rem] text-muted">
          Non ti chiediamo sintomi né dati sanitari: scegli in base a ciò che ti serve. Per un&apos;urgenza chiama il 112.
        </p>
      </fieldset>

      <div aria-live="polite" className="min-h-[1px]">
        {chosen && Icon ? (
          <div className={clsx("service-card p-6 sm:p-8", service ? `tone-${service.id === "capisci" ? "capisci" : service.id === "secondo-parere" ? "parere" : "medico"}` : "tone-capisci")}>
            <p className="eyebrow">Ti consigliamo</p>
            <div className="mt-4 flex items-center gap-4">
              <span className="tone-icon h-14 w-14 shrink-0">
                <Icon aria-hidden className="h-7 w-7" />
              </span>
              <p className="text-[1.625rem] font-bold leading-tight text-ink">{service ? service.name : "Preparati alla visita in 2 minuti"}</p>
            </div>
            <p className="mt-4 text-lg text-ink-soft">{chosen.why}</p>
            <dl className="mt-5 grid gap-2 text-[1.0625rem]">
              {service ? (
                <>
                  {service.price ? (
                    <div className="flex gap-2">
                      <dt className="text-muted">Prezzo:</dt>
                      <dd className="font-semibold text-ink">{service.price}</dd>
                    </div>
                  ) : null}
                  <div className="flex gap-2">
                    <dt className="text-muted">Tempi:</dt>
                    <dd className="font-semibold text-ink">{service.timing}</dd>
                  </div>
                </>
              ) : (
                <div className="flex gap-2">
                  <dt className="text-muted">Prezzo:</dt>
                  <dd className="font-semibold text-ink">gratis, senza registrarti</dd>
                </div>
              )}
            </dl>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Link href={service ? service.href : "/strumenti/preparati-alla-visita"} className="btn btn-primary btn-lg">
                {service ? "Scopri il servizio" : "Inizia, è gratis"} <ArrowRight aria-hidden className="btn-arrow h-5 w-5" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="flex min-h-48 flex-col justify-center gap-5 rounded-[var(--radius-xl)] border border-dashed border-line bg-paper/60 p-6">
            <div aria-hidden className="grid grid-cols-3 gap-3">
              <div className="tone-capisci overflow-hidden rounded-2xl border border-line -rotate-2"><CapisciScene uid="-np" /></div>
              <div className="tone-parere overflow-hidden rounded-2xl border border-line translate-y-3"><ParereScene uid="-np" /></div>
              <div className="tone-medico overflow-hidden rounded-2xl border border-line rotate-2"><MedicoScene uid="-np" /></div>
            </div>
            <p className="pt-2 text-lg text-muted">Scegli una risposta: ti indichiamo il servizio adatto, con prezzo e tempi.</p>
          </div>
        )}
      </div>
    </div>
  );
}
