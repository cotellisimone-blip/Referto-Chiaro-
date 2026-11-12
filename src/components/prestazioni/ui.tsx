"use client";

import { useState } from "react";
import Link from "next/link";
import { clsx } from "clsx";
import { FlaskConical, Loader2, Phone, RotateCcw, ShieldCheck, Stethoscope, UserRound } from "lucide-react";
import { STATUS_LABEL, isSameDay, type RequestStatus } from "@/domain/prestazioni/engine";
import { PRESTAZIONI, prestazionePrice, type PrestazioneKind } from "@/domain/prestazioni/listino";
import { formatEuro } from "@/domain/offerta";
import { resetDemo } from "./store";
import { WaitlistForm } from "@/components/site/waitlist-form";

const TONE: Record<RequestStatus, string> = {
  ricevuta: "bg-mist text-teal-deep",
  documenti_richiesti: "bg-cream text-warn",
  proposta: "bg-cream text-warn",
  confermata: "bg-marker-soft text-teal-deep",
  in_corso: "bg-marker-soft text-teal-deep",
  sintesi: "bg-mist text-teal-deep",
  conclusa: "bg-mist text-ink",
  indisponibile: "bg-cream text-warn",
  non_accettata: "bg-mist text-muted",
  annullata: "bg-mist text-muted",
};

export function StatusBadge({ status }: { status: RequestStatus }) {
  return <span className={clsx("chip", TONE[status])} data-stato={status}>{STATUS_LABEL[status]}</span>;
}

/** «oggi alle 15:00», «domani alle 9:00», «giovedì 14 novembre alle 16:00». */
export function formatSlot(iso: string, now = new Date()): string {
  const d = new Date(iso);
  const time = new Intl.DateTimeFormat("it-IT", { hour: "2-digit", minute: "2-digit" }).format(d);
  if (isSameDay(d, now)) return `oggi alle ${time}`;
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (isSameDay(d, tomorrow)) return `domani alle ${time}`;
  return `${new Intl.DateTimeFormat("it-IT", { weekday: "long", day: "numeric", month: "long" }).format(d)} alle ${time}`;
}

export function formatDay(iso: string, now = new Date()): string {
  const d = new Date(iso);
  if (isSameDay(d, now)) return "Oggi";
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  if (isSameDay(d, tomorrow)) return "Domani";
  const s = new Intl.DateTimeFormat("it-IT", { weekday: "long", day: "numeric", month: "long" }).format(d);
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export const formatTime = (iso: string) => new Intl.DateTimeFormat("it-IT", { hour: "2-digit", minute: "2-digit" }).format(new Date(iso));

export function Price({ kind, cents }: { kind: PrestazioneKind; cents?: number | null }) {
  return <span className="whitespace-nowrap">{cents != null ? formatEuro(cents) : prestazionePrice(kind)}</span>;
}

/** Fasce raggruppate per giorno: pulsanti grandi, uno per orario. */
export function SlotPicker({ slots, value, onChange, legend, now = new Date() }: { slots: string[]; value: string | null; onChange: (iso: string) => void; legend: string; now?: Date }) {
  const days = new Map<string, string[]>();
  for (const s of slots) {
    const k = new Date(s).toDateString();
    days.set(k, [...(days.get(k) ?? []), s]);
  }
  return (
    <fieldset>
      <legend className="text-lg font-semibold text-ink">{legend}</legend>
      <div className="mt-3 space-y-4">
        {[...days.values()].map((list) => (
          <div key={list[0]}>
            <p className="text-[0.9375rem] font-semibold text-ink-soft">{formatDay(list[0], now)}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {list.map((s) => (
                <label key={s} className={clsx("slot-pill", value === s && "slot-pill-on")}>
                  <input type="radio" name={legend} value={s} checked={value === s} onChange={() => onChange(s)} className="sr-only" />
                  {formatTime(s)}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </fieldset>
  );
}

export function DemoNotice({ children }: { children?: React.ReactNode }) {
  return (
    <div role="note" className="flex items-start gap-3 rounded-2xl border border-dashed border-warn/60 bg-cream p-4 text-[0.9375rem] text-ink-soft">
      <FlaskConical aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-warn" />
      <p>
        <strong className="text-ink">Prova dimostrativa.</strong> Medici, fasce, pagamenti, video, documenti e comunicazioni sono simulati e restano in questo browser. {children}
      </p>
    </div>
  );
}

export function EmergencyNumbers({ compact = false }: { compact?: boolean }) {
  return (
    <p className={clsx("flex items-start gap-3 rounded-2xl border border-line bg-paper text-ink", compact ? "p-3 text-[0.9375rem]" : "p-4 text-[1.0625rem]")}>
      <Phone aria-hidden className="mt-1 h-5 w-5 shrink-0 text-danger" />
      <span>
        Prestazione privata per esigenze <strong>non urgenti</strong>. Per le emergenze sanitarie chiama il <strong>112</strong>. Per la continuità assistenziale pubblica chiama il <strong>116117</strong> negli orari previsti.
      </span>
    </p>
  );
}

const ROLES = [
  { href: "/prova/paziente", label: "Paziente", icon: UserRound },
  { href: "/prova/medico", label: "Medico", icon: Stethoscope },
  { href: "/prova/amministrazione", label: "Admin", icon: ShieldCheck },
] as const;

/** Barra della prova: cambio di ruolo sempre a portata di pollice e ripristino della demo. */
export function RoleBar({ active }: { active: "paziente" | "medico" | "amministrazione" | null }) {
  return (
    <div className="border-b border-line bg-mist/70">
      <div className="container-rc flex flex-wrap items-center gap-2 py-2">
        <span className="sr-only sm:not-sr-only sm:mr-1 sm:text-sm sm:font-semibold sm:text-ink-soft">Prova come:</span>
        <nav aria-label="Prova come" className="grid flex-1 grid-cols-3 gap-1.5 sm:flex sm:flex-none sm:gap-2">
          {ROLES.map(({ href, label, icon: Icon }) => {
            const on = active && href.endsWith(active);
            return (
              <Link key={href} href={href} aria-current={on ? "page" : undefined} className={clsx("btn btn-sm min-h-11 gap-1.5 px-2 sm:px-4", on ? "btn-primary" : "btn-secondary")}>
                <Icon aria-hidden className="hidden h-4 w-4 sm:block" /> {label}
              </Link>
            );
          })}
        </nav>
        <div className="ml-auto max-sm:w-full max-sm:text-right">
          <ConfirmButton className="btn btn-ghost btn-sm min-h-11" question="Richieste, candidature e impostazioni tornano allo stato iniziale." yes="Sì, ricomincia" onConfirm={resetDemo}>
            <RotateCcw aria-hidden className="h-4 w-4" /> Ricomincia la prova
          </ConfirmButton>
        </div>
      </div>
    </div>
  );
}

/**
 * Conferma in due tocchi, nella pagina (niente finestre del browser: su telefono e nelle anteprime possono essere
 * bloccate). Il primo tocco mostra la domanda e due pulsanti grandi.
 */
export function ConfirmButton({ children, question, yes, onConfirm, className }: { children: React.ReactNode; question: string; yes: string; onConfirm: () => void; className: string }) {
  const [asking, setAsking] = useState(false);
  if (!asking) {
    return (
      <button type="button" className={className} onClick={() => setAsking(true)}>
        {children}
      </button>
    );
  }
  return (
    <span role="group" aria-label="Conferma" className="flex flex-wrap items-center gap-2 rounded-xl border border-warn/50 bg-cream px-3 py-2">
      <span className="text-[0.9375rem] text-ink">{question}</span>
      <button type="button" className="btn btn-sm min-h-11 btn-secondary" onClick={() => setAsking(false)} autoFocus>
        No
      </button>
      <button
        type="button"
        className="btn btn-sm min-h-11 btn-primary"
        onClick={() => {
          setAsking(false);
          onConfirm();
        }}
      >
        {yes}
      </button>
    </span>
  );
}

/** Fuori zona: invece di un vicolo cieco, «Avvisami quando arrivate» con il CAP già scritto (ciclo 4). */
export function ZoneWaitlist({ cap }: { cap: string }) {
  return (
    <div className="mt-4 border-t border-line pt-4" data-avvisami-zona={cap}>
      <p className="text-lg font-bold text-ink">Avvisami quando arrivate al {cap}</p>
      <div className="mt-2">
        <WaitlistForm key={cap} interest="domicilio" defaultCap={cap} compact />
      </div>
    </div>
  );
}

export function Loading() {
  return (
    <p role="status" className="flex items-center gap-2 py-10 text-lg text-muted">
      <Loader2 aria-hidden className="h-5 w-5 animate-spin" /> Preparazione della prova…
    </p>
  );
}

export function ErrorBox({ children }: { children: React.ReactNode }) {
  return (
    <p role="alert" className="rounded-xl border border-danger/40 bg-paper px-4 py-3 text-[1.0625rem] text-danger">
      {children}
    </p>
  );
}

export function KindTitle({ kind }: { kind: PrestazioneKind }) {
  return <>{PRESTAZIONI[kind].title}</>;
}

export const inputCls = "mt-2 min-h-12 w-full rounded-xl border border-line bg-paper px-4 text-[1.0625rem] text-ink";
export const areaCls = "mt-2 w-full rounded-xl border border-line bg-paper px-4 py-3 text-[1.0625rem] text-ink";
