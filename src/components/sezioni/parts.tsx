import Link from "next/link";
import { ArrowRight, ArrowUp, Check, Home, Laptop, Stethoscope, Video } from "lucide-react";
import { PRESTAZIONI, prestazionePrice, type PrestazioneKind } from "@/domain/prestazioni/listino";

/**
 * Pezzi comuni della home a due sezioni e delle pagine /online e /a-domicilio (15/11/2026).
 * Sezione 1 «Online» = carta chiara e menta; sezione 2 «A domicilio» = petrolio e argilla. Lo stesso colore segue la
 * sezione ovunque (porte, fasce, pagine), così si riconosce a colpo d'occhio dove si è.
 */

export const ONLINE_HREF = "/online";
export const DOMICILIO_HREF = "/a-domicilio";

/** Etichetta della sezione 2: «Versione di prova» con i medici accesi, «In arrivo» spenti. */
export function StatoDomicilio({ attivo, dark = false }: { attivo: boolean; dark?: boolean }) {
  return attivo ? (
    <span className={`ds-state ds-state-prova${dark ? " ds-on-dark" : ""}`}>
      <i aria-hidden />
      Versione di prova
    </span>
  ) : (
    <span className={`ds-state ds-state-arrivo${dark ? " ds-on-dark" : ""}`}>
      <i aria-hidden />
      In arrivo
    </span>
  );
}

/** Le due porte: la prima cosa che si vede. Ognuna dice che cosa c'è dietro, in una riga, e porta alla sua sezione. */
export function Porte({ attivo, entry, prices }: { attivo: boolean; entry: string | null; prices: boolean }) {
  return (
    <ul className="ds-doors" aria-label="Le due sezioni di Cura Privata">
      <li>
        <Link href={ONLINE_HREF} className="ds-door ds-door-1" data-track="porta-online">
          <span className="ds-door-n" aria-hidden>
            1
          </span>
          <span className="ds-door-ic" aria-hidden>
            <Laptop className="tm-ic" />
          </span>
          <span className="ds-door-k">Online, da casa</span>
          <span className="ds-door-t">Capire referti ed esami</span>
          <span className="ds-door-d">Primo controllo, referto spiegato, guide alla salute e agli integratori.</span>
          <span className="ds-door-f">
            <span>{prices && entry ? `Molto è gratis · da ${entry}` : "Molto è gratis"}</span>
            <ArrowRight aria-hidden className="tm-ic" />
          </span>
        </Link>
      </li>
      <li>
        <Link href={DOMICILIO_HREF} className="ds-door ds-door-2" data-track="porta-domicilio">
          <span className="ds-door-n" aria-hidden>
            2
          </span>
          <span className="ds-door-ic" aria-hidden>
            <Home className="tm-ic" />
          </span>
          <span className="ds-door-k">
            A domicilio <StatoDomicilio attivo={attivo} dark />
          </span>
          <span className="ds-door-t">Il medico a casa tua</span>
          <span className="ds-door-d">Un medico di medicina generale viene da te, per esigenze non urgenti.</span>
          <span className="ds-door-f">
            <span>{attivo && prices ? `${prestazionePrice("domicilio")} prezzo fisso · Brescia` : "Brescia città, per cominciare"}</span>
            <ArrowRight aria-hidden className="tm-ic" />
          </span>
        </Link>
      </li>
    </ul>
  );
}

/** La scheda del referto in miniatura (sezione 1), per l'apertura. */
export function MiniReferto() {
  return (
    <div className="ds-mini ds-mini-1" aria-hidden>
      <p className="ds-mini-k">
        <span className="ds-mini-n">1</span> Online · il tuo referto
      </p>
      <p className="ds-mini-r">
        <b>Colesterolo LDL</b>
        <span>
          <b>134</b> mg/dL
        </span>
      </p>
      <div className="tm-rb" style={{ "--b0": "0%", "--b1": "68%" } as React.CSSProperties}>
        <i style={{ left: "84%" }} />
      </div>
      <p className="ds-mini-st">
        <ArrowUp className="tm-ic" />
        Sopra l’intervallo stampato
      </p>
    </div>
  );
}

/** La conferma della visita in miniatura (sezione 2), per l'apertura. */
export function MiniVisita() {
  return (
    <div className="ds-mini ds-mini-2" aria-hidden>
      <p className="ds-mini-k">
        <span className="ds-mini-n">2</span> A domicilio · esempio
      </p>
      <div className="ds-mini-doc">
        <span className="ds-av ds-av-teal">LB</span>
        <span>
          <b>Dott.ssa Laura Bianchi</b>
          <small>Medico di medicina generale</small>
        </span>
      </div>
      <p className="ds-mini-when">
        <b>Domani, 10:00</b>
        <span>Via di Prova 1, Brescia</span>
      </p>
      <p className="ds-mini-ok">
        <Check className="tm-ic" />
        Visita confermata
      </p>
    </div>
  );
}

const SVC_ICON = { domicilio: Home, video: Video, parere: Stethoscope } as const;
const SVC_TEXT: Record<PrestazioneKind, { t: string; d: string }> = {
  domicilio: { t: "Visita a casa", d: "Circa 45 minuti, a casa tua o di un familiare. Riepilogo scritto." },
  video: { t: "Videoconsulto", d: "20–25 minuti in video, con i documenti già letti dal medico." },
  parere: { t: "Secondo parere", d: "Uno specialista esamina i documenti e scrive una sintesi." },
};

/** I tre servizi con un medico, con prezzo (se i prezzi sono pubblici) e collegamento. */
export function ServiziMedico({ prices, attivo, dark = false }: { prices: boolean; attivo: boolean; dark?: boolean }) {
  return (
    <ul className={`ds-svcs${dark ? " ds-svcs-dark" : ""}`}>
      {(["domicilio", "video", "parere"] as const).map((k) => {
        const I = SVC_ICON[k];
        return (
          <li key={k} className={k === "domicilio" ? "ds-svc ds-svc-main" : "ds-svc"}>
            <Link href={attivo ? PRESTAZIONI[k].href : DOMICILIO_HREF} className="ds-svc-a">
              <span className="ds-svc-ic" aria-hidden>
                <I className="tm-ic" />
              </span>
              <span className="ds-svc-t">{SVC_TEXT[k].t}</span>
              <span className="ds-svc-d">{SVC_TEXT[k].d}</span>
              {attivo && prices ? <span className="ds-svc-p">{prestazionePrice(k)}</span> : null}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
