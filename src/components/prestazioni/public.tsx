"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Home, MapPin } from "lucide-react";
import { availability, checkCoverage, featuredKind, type PrestazioniState } from "@/domain/prestazioni/engine";
import { PRESTAZIONI, PRESTAZIONI_ORDER, type PrestazioneKind } from "@/domain/prestazioni/listino";
import { usePrestazioni } from "./store";
import { PrestazioneCard } from "./patient";
import { Price, formatSlot, inputCls } from "./ui";

/**
 * Parte pubblica delle prestazioni con un medico. Lo stato di apertura viene dalla prova (browser);
 * prima dell'idratazione si mostra la versione statica, uguale allo stato iniziale, così la pagina non salta.
 */

function StaticCard({ kind }: { kind: PrestazioneKind }) {
  const info = PRESTAZIONI[kind];
  return (
    <article className="card flex h-full flex-col p-5 sm:p-6" data-prestazione={kind}>
      <h3 className="text-xl font-bold leading-snug text-ink">{info.title}</h3>
      <p className="mt-0.5 text-[0.9375rem] text-muted">{info.mode}</p>
      <p className="mt-4 text-[2rem] font-bold leading-none text-ink"><Price kind={kind} /></p>
      <p className="mt-1 text-[0.9375rem] text-muted">{info.durationLabel}, prezzo fisso</p>
      <div className="mt-auto pt-5">
        <Link href={info.href} className="btn btn-secondary w-full">Scopri di più <ArrowRight aria-hidden className="h-4 w-4" /></Link>
      </div>
    </article>
  );
}

/** Le tre prestazioni con un medico, ognuna raggiungibile direttamente (pagina Servizi, pagine servizio). */
export function PrestazioniGrid({ only }: { only?: PrestazioneKind[] }) {
  const s = usePrestazioni();
  const kinds = only ?? PRESTAZIONI_ORDER;
  // La data si legge solo nel browser (mai durante il prerender).
  const now = s ? new Date() : null;
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {kinds.map((k) => (s && now ? <PrestazioneCard key={k} s={s} kind={k} now={now} /> : <StaticCard key={k} kind={k} />))}
    </div>
  );
}

const FEATURE_COPY: Record<PrestazioneKind, { eyebrow: (s: PrestazioniState) => string; title: string; cta: string }> = {
  domicilio: { eyebrow: (s) => `Novità · ${s.coverage.comune} città`, title: "Il medico a casa tua.", cta: "Richiedi la visita" },
  video: { eyebrow: () => "Disponibile ora", title: "Parla con un medico, in video.", cta: "Prenota il videoconsulto" },
  parere: { eyebrow: () => "Disponibile ora", title: "Un secondo parere specialistico.", cta: "Richiedi il secondo parere" },
};

/**
 * In home: il domicilio quando ha copertura; se no, un'altra prestazione davvero disponibile; se nessuna è aperta,
 * niente (la home dà già la precedenza agli strumenti gratuiti e a «Capisci»).
 */
export function FeaturedPrestazione({ vetrina = false }: { vetrina?: boolean }) {
  const s = usePrestazioni();
  const now = s ? new Date() : null;
  const kind: PrestazioneKind | null = s && now ? featuredKind(s, now) : "domicilio";
  if (!kind) return null;
  const info = PRESTAZIONI[kind];
  const copy = FEATURE_COPY[kind];
  const av = s && now ? availability(s, kind, now) : null;
  return (
    <div className="featured-prestazione" data-in-evidenza={kind}>
      <p className="eyebrow">{s ? copy.eyebrow(s) : "Novità · Brescia città"}</p>
      <p className="mt-2 text-[1.625rem] font-bold leading-tight text-ink sm:text-[1.875rem]">{copy.title}</p>
      <p className="mt-1.5 text-[1.0625rem] text-ink-soft">
        {info.title} · <strong className="text-ink"><Price kind={kind} /></strong>
        {av?.next && now ? <> · prima fascia {formatSlot(av.next, now)}</> : null}
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 sm:mt-4">
        <Link href={info.startHref} data-track={`cta-${kind}`} className="btn btn-primary">
          {kind === "domicilio" ? <Home aria-hidden className="h-4 w-4" /> : null} {vetrina ? "Provala nella demo" : copy.cta} <ArrowRight aria-hidden className="btn-arrow h-4 w-4" />
        </Link>
        <Link href={info.href} className="link inline-flex min-h-11 items-center font-semibold">Come funziona</Link>
      </div>
    </div>
  );
}

/** Verifica di comune e CAP sulla pagina del domicilio, con la prossima azione per ogni esito. */
export function CoverageCheck() {
  const s = usePrestazioni();
  const [comune, setComune] = useState("Brescia");
  const [cap, setCap] = useState("");
  const [res, setRes] = useState<null | { ok: boolean; text: string; href: string; cta: string }>(null);
  return (
    <form
      className="card space-y-4 p-5 sm:p-7"
      onSubmit={(e) => {
        e.preventDefault();
        if (!s) return;
        const now = new Date();
        const c = checkCoverage(s, comune, cap);
        if (!c.ok) {
          const video = availability(s, "video", now);
          setRes({
            ok: false,
            text: c.reason === "cap-non-valido" ? "Il CAP deve avere 5 cifre." : c.reason === "zona-sospesa" ? "La zona pilota è momentaneamente sospesa." : `Non ancora: per ora andiamo a domicilio solo a ${s.coverage.label}.`,
            href: video.state === "aperto" ? PRESTAZIONI.video.href : "/punto-di-partenza",
            cta: video.state === "aperto" ? "Intanto, un videoconsulto" : "Intanto, il Punto di Partenza gratuito",
          });
          return;
        }
        const av = availability(s, "domicilio", now, { cap: c.cap });
        setRes(
          av.state === "aperto"
            ? { ok: true, text: `Sì, ${comune} ${c.cap} è coperto. ${av.today ? "Ci sono fasce libere già oggi" : "Prima fascia libera"}${av.next ? `: ${formatSlot(av.next, now)}` : ""}.`, href: PRESTAZIONI.domicilio.startHref, cta: "Richiedi la visita" }
            : { ok: false, text: av.message, href: av.action.href, cta: av.action.label },
        );
      }}
    >
      <p className="flex items-center gap-2 text-xl font-bold text-ink"><MapPin aria-hidden className="h-5 w-5 text-teal" /> Arriviamo da te?</p>
      <div className="grid gap-4 sm:grid-cols-[2fr_1fr_auto] sm:items-end">
        <label className="block text-[1.0625rem] font-semibold text-ink">Comune<input value={comune} onChange={(e) => setComune(e.target.value)} required autoComplete="address-level2" className={inputCls} /></label>
        <label className="block text-[1.0625rem] font-semibold text-ink">CAP<input value={cap} onChange={(e) => setCap(e.target.value)} required inputMode="numeric" autoComplete="postal-code" maxLength={6} placeholder="25122" className={inputCls} /></label>
        <button type="submit" className="btn btn-secondary">Verifica</button>
      </div>
      <div aria-live="polite">
        {res ? (
          <div className={res.ok ? "rounded-xl bg-marker-soft p-4" : "rounded-xl bg-cream p-4"}>
            <p className="flex items-start gap-2 text-[1.0625rem] text-ink">{res.ok ? <CheckCircle2 aria-hidden className="mt-1 h-5 w-5 shrink-0 text-teal" /> : null} {res.text}</p>
            <Link href={res.href} className="btn btn-primary mt-3">{res.cta} <ArrowRight aria-hidden className="h-4 w-4" /></Link>
          </div>
        ) : null}
      </div>
    </form>
  );
}
