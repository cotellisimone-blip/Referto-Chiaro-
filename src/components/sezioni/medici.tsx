"use client";

import Link from "next/link";
import { Home, MapPin, Stethoscope, Video } from "lucide-react";
import { SERVIZIO_LABEL } from "@/content/medici-prova";
import { MEDICI, datiMancanti, inizialiMedico, nomeMedico } from "@/content/medici";
import { domicilioEnabled } from "@/lib/medici";

const ICON = { domicilio: Home, video: Video, parere: Stethoscope } as const;

/**
 * 19/11/2026: i medici veri (Sara, Elena e Riccardo, medici di medicina generale a Brescia). Si mostra solo quello che
 * Simone ha detto; quello che manca è scritto «da completare» (data-segnaposto), come per i dati del titolare.
 * Niente fasce libere qui: le fasce della versione dimostrativa sono inventate e non vanno accanto a un nome vero.
 */
export function MediciRete({ book = true }: { book?: boolean }) {
  // 27/11/2026 (fase 1): quello che manca si dice UNA volta sopra le schede, non tre volte (una per medico).
  const manca = [...new Set(MEDICI.flatMap((m) => datiMancanti(m)))];
  return (
    <>
    {manca.length ? (
      <p className="ds-doc-todo ds-todo" data-segnaposto="medici">
        Da completare prima di andare online: {manca.join(", ")}.
      </p>
    ) : null}
    <ul className="ds-docs" id="i-medici">
      {MEDICI.map((m) => {
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
          </li>
        );
      })}
    </ul>
    {/* 27/11/2026 (fase 4): un pulsante per scheda faceva pensare di scegliere quel medico, ma nella prova risponde un
        profilo dimostrativo. Ora un solo pulsante, con la regola detta chiara. */}
    {book ? (
      <div className="ds-docs-book" data-testid="medici-prenota">
        <Link href="/richiedi/videoconsulto" className="ds-doc-btn" data-track="medico-video">
          Prenota un videoconsulto
        </Link>
        {domicilioEnabled() ? (
          <Link href="/richiedi/domicilio" className="ds-doc-btn ds-doc-btn-2" data-track="medico-casa">
            Una visita a casa
          </Link>
        ) : null}
        <p>Ti risponde il primo di loro libero nel giorno e nell’ora che scegli. In questa versione di prova risponde un medico dimostrativo, con un nome di prova.</p>
      </div>
    ) : null}
    </>
  );
}
