"use client";

import Link from "next/link";
import { CalendarClock, Home, MapPin, Stethoscope, Video } from "lucide-react";
import { doctorFreeSlots } from "@/domain/prestazioni/engine";
import { MEDICI_PROVA, SERVIZIO_LABEL, type MedicoProva } from "@/content/medici-prova";
import { MEDICI, datiMancanti, inizialiMedico, nomeMedico } from "@/content/medici";
import { usePrestazioni } from "@/components/prestazioni/store";
import { formatSlot } from "@/components/prestazioni/format";
import { domicilioEnabled } from "@/lib/medici";

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

/**
 * 19/11/2026: i medici veri (Sara, Elena e Riccardo, medici di medicina generale a Brescia). Si mostra solo quello che
 * Simone ha detto; quello che manca è scritto «da completare» (data-segnaposto), come per i dati del titolare.
 * Niente fasce libere qui: le fasce della versione dimostrativa sono inventate e non vanno accanto a un nome vero.
 */
export function MediciRete({ book = true }: { book?: boolean }) {
  return (
    <ul className="ds-docs" id="i-medici">
      {MEDICI.map((m) => {
        const manca = datiMancanti(m);
        return (
          <li key={m.id} className="ds-doc" data-medico={m.id}>
            <div className="ds-doc-top">
              <span aria-hidden className={`ds-av ds-av-${m.tone}`}>
                {inizialiMedico(m)}
              </span>
              <div className="ds-doc-id">
                <p className="ds-doc-name">{nomeMedico(m)}</p>
                <p className="ds-doc-role">{m.ruolo}</p>
              </div>
            </div>
            <ul className="ds-doc-svc" aria-label="Che cosa fa">
              {m.servizi.filter((k) => k !== "domicilio" || domicilioEnabled()).map((k) => {
                const I = ICON[k];
                return (
                  <li key={k}>
                    <I aria-hidden className="tm-ic" />
                    {SERVIZIO_LABEL[k]}
                  </li>
                );
              })}
            </ul>
            <dl className="ds-doc-dl">
              <div>
                <dt>
                  <MapPin aria-hidden className="tm-ic" />
                  <span className="sr-only">Città</span>
                </dt>
                <dd>{m.zona ?? m.citta}</dd>
              </div>
              <div>
                <dt>Iscrizione</dt>
                <dd>{m.ordine ?? <span className="ds-todo" data-segnaposto="medico">da completare</span>}</dd>
              </div>
            </dl>
            {manca.length ? (
              <p className="ds-doc-todo ds-todo" data-segnaposto="medico">
                Da completare prima di andare online: {manca.join(", ")}.
              </p>
            ) : null}
            {book ? (
              <div className="ds-doc-foot">
                <Link href="/richiedi/videoconsulto" className="ds-doc-btn" data-track="medico-video">
                  Videoconsulto<span className="sr-only"> con {m.nome}</span>
                </Link>
                {domicilioEnabled() ? (
                  <Link href="/richiedi/domicilio" className="ds-doc-btn ds-doc-btn-2" data-track="medico-casa">
                    A casa<span className="sr-only"> con {m.nome}</span>
                  </Link>
                ) : null}
              </div>
            ) : null}
          </li>
        );
      })}
    </ul>
  );
}
