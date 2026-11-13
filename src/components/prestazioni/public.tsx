"use client";

import { useState } from "react";
import Link from "next/link";
import { clsx } from "clsx";
import { ArrowRight, CircleCheck, Home, MapPin, Stethoscope, Video } from "lucide-react";
import { availability, checkCoverage, featuredKind, type PrestazioniState } from "@/domain/prestazioni/engine";
import { PRESTAZIONI, type PrestazioneKind } from "@/domain/prestazioni/listino";
import { usePrestazioni } from "./store";
import { Price, ZoneWaitlist, formatSlot } from "./ui";

/**
 * Parte pubblica delle prestazioni con un medico. Lo stato di apertura viene dalla prova (browser);
 * prima dell'idratazione si mostra lo stato iniziale, così la pagina non salta.
 */

const ACTION_LABEL: Record<PrestazioneKind, string> = { domicilio: "Richiedi la visita", video: "Prenota il videoconsulto", parere: "Richiedi il secondo parere" };

/**
 * Disponibilità reale e richiesta diretta, dentro la scheda del servizio (pagina Servizi). Prima dell'idratazione
 * mostra lo stato iniziale, così la scheda non salta. Sta sopra il collegamento che copre l'intera scheda.
 */
export function PrestazioneAction({ kind }: { kind: PrestazioneKind }) {
  const s = usePrestazioni();
  const now = s ? new Date() : null;
  const info = PRESTAZIONI[kind];
  const av = s && now ? availability(s, kind, now) : null;
  const open = !av || av.state === "aperto";
  return (
    <div className="relative z-10 mt-auto pt-5" data-disponibilita={av?.state ?? "aperto"}>
      <p className="flex flex-wrap items-center gap-2 text-[0.9375rem] text-ink-soft">
        <span className={open ? "chip bg-marker-soft text-teal-deep" : "chip bg-cream text-warn"}>{open ? (av?.today ? "Disponibile oggi" : "Disponibile") : av!.state === "sospeso" ? "Sospesa" : av!.state === "esaurito" ? "Fasce esaurite" : "Non disponibile"}</span>
        {av?.next && now ? <span>prima fascia {formatSlot(av.next, now)}</span> : null}
      </p>
      {!open ? <p className="mt-2 text-[0.9375rem] text-ink-soft">{av!.message}</p> : null}
      <Link href={open ? info.startHref : av!.action.href} className={open ? "btn btn-primary mt-3 w-full" : "btn btn-secondary mt-3 w-full"}>
        {open ? ACTION_LABEL[kind] : av!.action.label} <ArrowRight aria-hidden className="h-4 w-4" />
      </Link>
    </div>
  );
}

const FEATURE_COPY: Record<PrestazioneKind, { eyebrow: (s: PrestazioniState) => string; title: string; cta: string; icon: typeof Home }> = {
  domicilio: { eyebrow: (s) => `Novità · ${s.coverage.comune} città`, title: "Il medico a casa tua", cta: "Richiedi la visita", icon: Home },
  video: { eyebrow: () => "Disponibile ora", title: "Un medico, in video", cta: "Prenota il videoconsulto", icon: Video },
  parere: { eyebrow: () => "Disponibile ora", title: "Un secondo parere specialistico", cta: "Richiedi il secondo parere", icon: Stethoscope },
};

/**
 * In home: il domicilio quando ha copertura; se no, un'altra prestazione davvero disponibile; se nessuna è aperta,
 * niente (la home dà già la precedenza agli strumenti gratuiti e a «Capisci»).
 * Grafica «Luce»: un annuncio di vetro sopra il titolo, con il punto vivo, il prezzo e le due azioni.
 */
export function FeaturedPrestazione({ vetrina = false }: { vetrina?: boolean }) {
  const s = usePrestazioni();
  const now = s ? new Date() : null;
  const kind: PrestazioneKind | null = s && now ? featuredKind(s, now) : "domicilio";
  if (!kind) return null;
  const info = PRESTAZIONI[kind];
  const copy = FEATURE_COPY[kind];
  const Icon = copy.icon;
  return (
    <div className="announce" data-in-evidenza={kind}>
      <span aria-hidden className="tile-ico tile-ico-sm">
        <Icon />
      </span>
      <p className="announce-kicker">
        <span aria-hidden className="live-dot" />
        {s ? copy.eyebrow(s) : "Novità · Brescia città"}
      </p>
      <p className="announce-title">
        {copy.title} · <Price kind={kind} />
      </p>
      <p className="announce-actions">
        <Link href={info.startHref} data-track={`cta-${kind}`} className="announce-cta">
          {vetrina ? "Provala nella demo" : copy.cta} <ArrowRight aria-hidden className="h-4 w-4" />
        </Link>
        <Link href={info.href} className="announce-more">
          Come funziona
        </Link>
      </p>
    </div>
  );
}

/** Verifica di comune e CAP sulla pagina del domicilio, con la prossima azione per ogni esito. */
export function CoverageCheck() {
  const s = usePrestazioni();
  const [comune, setComune] = useState("Brescia");
  const [cap, setCap] = useState("");
  const [res, setRes] = useState<null | { ok: boolean; text: string; href: string; cta: string; waitCap?: string }>(null);
  return (
    <form
      className="form-card space-y-5"
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
            waitCap: c.reason === "fuori-zona" && /^\d{5}$/.test(cap.trim()) ? cap.trim() : undefined,
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
      <div className="form-card-head">
        <span aria-hidden className="tile-ico tile-ico-sm tile-ico-tone">
          <MapPin />
        </span>
        <p className="form-card-title">Arriviamo da te?</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-[2fr_1fr_auto] sm:items-end">
        <label className="field-label">
          Comune
          <input value={comune} onChange={(e) => setComune(e.target.value)} required autoComplete="address-level2" className="field-input" />
        </label>
        <label className="field-label">
          CAP
          <input value={cap} onChange={(e) => setCap(e.target.value)} required inputMode="numeric" autoComplete="postal-code" maxLength={6} placeholder="25122" className="field-input" />
        </label>
        <button type="submit" className="btn btn-secondary min-h-[3.5rem]">
          Verifica
        </button>
      </div>
      <div aria-live="polite">
        {res ? (
          <div className={res.ok ? "field-ok" : "rounded-[1.25rem] bg-cream px-5 py-[1.125rem]"}>
            <p className="flex items-start gap-2.5 text-[1.0625rem] font-semibold text-ink">
              {res.ok ? <CircleCheck aria-hidden className="mt-0.5 h-5 w-5 shrink-0 text-teal" /> : null} {res.text}
            </p>
            <Link href={res.href} className={clsx("btn btn-wrap mt-4 max-sm:w-full max-sm:px-4", res.waitCap ? "btn-secondary" : "btn-primary")}>
              {res.cta} <ArrowRight aria-hidden className="btn-arrow h-5 w-5 shrink-0" />
            </Link>
            {res.waitCap ? <ZoneWaitlist cap={res.waitCap} /> : null}
          </div>
        ) : null}
      </div>
    </form>
  );
}
