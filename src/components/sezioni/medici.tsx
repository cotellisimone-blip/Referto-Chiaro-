"use client";

import Link from "next/link";
import { CalendarClock, Home, MapPin, Stethoscope, Video } from "lucide-react";
import { doctorFreeSlots } from "@/domain/prestazioni/engine";
import { MEDICI_PROVA, SERVIZIO_LABEL, type MedicoProva } from "@/content/medici-prova";
import { usePrestazioni } from "@/components/prestazioni/store";
import { formatSlot } from "@/components/prestazioni/format";

const ICON = { domicilio: Home, video: Video, parere: Stethoscope } as const;

/** Prima fascia libera del medico, dalla stessa prova che usa la richiesta. Prima dell'idratazione: niente orario. */
function NextSlot({ m }: { m: MedicoProva }) {
  const s = usePrestazioni();
  if (!s)
    return (
      <span className="ds-doc-next">
        <CalendarClock aria-hidden className="tm-ic" />
        <span>
          <small>Prima fascia libera</small>
          <b>questa settimana</b>
        </span>
      </span>
    );
  const now = new Date();
  const kind = m.services[0];
  const first = doctorFreeSlots(s, m.id, kind, now)[0];
  return (
    <span className="ds-doc-next">
      <CalendarClock aria-hidden className="tm-ic" />
      <span>
        <small>Prima fascia libera</small>
        <b>{first ? formatSlot(first, now) : "nei prossimi giorni"}</b>
      </span>
    </span>
  );
}

/**
 * Le schede dei medici di prova (persone inventate, solo iniziali). `compact` per la home, intera per la pagina della
 * sezione. Con `bookHref` il pulsante porta alla richiesta.
 */
export function MediciProva({ compact = false, book = true }: { compact?: boolean; book?: boolean }) {
  return (
    <ul className={`ds-docs${compact ? " ds-docs-c" : ""}`}>
      {MEDICI_PROVA.map((m) => {
        const main = m.services[0];
        const href = main === "parere" ? "/richiedi/secondo-parere" : "/richiedi/domicilio";
        return (
          <li key={m.id} className="ds-doc" data-medico={m.id}>
            <span className="ds-prova">Profilo di prova · persona inventata</span>
            <div className="ds-doc-top">
              <span aria-hidden className={`ds-av ds-av-${m.tone}`}>
                {m.initials}
                <i className="ds-av-on" />
              </span>
              <div className="ds-doc-id">
                <p className="ds-doc-name">{m.name}</p>
                <p className="ds-doc-role">{m.role}</p>
              </div>
            </div>
            <ul className="ds-doc-svc" aria-label="Che cosa fa">
              {m.services.map((k) => {
                const I = ICON[k];
                return (
                  <li key={k}>
                    <I aria-hidden className="tm-ic" />
                    {SERVIZIO_LABEL[k]}
                  </li>
                );
              })}
            </ul>
            {compact ? null : <p className="ds-doc-note">«{m.note}»</p>}
            <dl className="ds-doc-dl">
              <div>
                <dt>
                  <MapPin aria-hidden className="tm-ic" />
                  <span className="sr-only">Zona</span>
                </dt>
                <dd>{m.zone}</dd>
              </div>
              {compact ? null : (
                <div>
                  <dt>Iscrizione</dt>
                  <dd>{m.ordine}</dd>
                </div>
              )}
              {compact ? null : (
                <div>
                  <dt>Lingue</dt>
                  <dd>{m.languages}</dd>
                </div>
              )}
            </dl>
            <div className="ds-doc-foot">
              <NextSlot m={m} />
              {book ? (
                <Link href={href} className="ds-doc-btn" data-track="medico-prova">
                  {main === "parere" ? "Chiedi un parere" : "Prenota"}
                  <span className="sr-only"> con {m.name}</span>
                </Link>
              ) : null}
            </div>
          </li>
        );
      })}
    </ul>
  );
}
