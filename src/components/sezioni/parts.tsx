import Link from "next/link";
import { CountUp } from "@/components/wow/count-up";
import { ArrowRight, ArrowUp, Check, FileText, HeartPulse, Home, Stethoscope, Video } from "lucide-react";
import { PRESTAZIONI, prestazionePrice, type PrestazioneKind } from "@/domain/prestazioni/listino";
import { secondoParereEnabled } from "@/lib/medici";

/**
 * Pezzi comuni della home e delle pagine delle tre sezioni (15/11/2026 sera, divisione voluta da Simone):
 * 1 «Prevenzione» (esami da fare, guide, integratori) = carta e inchiostro; 2 «Lettura referti» = menta;
 * 3 «Medici» (video, casa, secondo parere) = petrolio e pesca. Lo stesso colore segue la sezione ovunque (porte,
 * fasce, pagine), così si riconosce a colpo d'occhio dove si è.
 */

export const PREVENZIONE_HREF = "/prevenzione";
export const REFERTI_HREF = "/lettura-referti";
export const MEDICI_HREF = "/medici";

/** Etichetta dei medici: «Versione di prova» con i medici accesi, «In arrivo» (o «Medici in arrivo») spenti. */
export function StatoDomicilio({ attivo, dark = false, medici = false }: { attivo: boolean; dark?: boolean; medici?: boolean }) {
  // 19/11/2026: accesi, i medici sono quelli veri (Sara, Elena e Riccardo, a Brescia): non più «versione di prova».
  return attivo ? (
    <span className={`ds-state ds-state-prova${dark ? " ds-on-dark" : ""}`}>
      <i aria-hidden />
      {medici ? "Medici a Brescia" : "A Brescia"}
    </span>
  ) : (
    <span className={`ds-state ds-state-arrivo${dark ? " ds-on-dark" : ""}`}>
      <i aria-hidden />
      {medici ? "Medici in arrivo" : "In arrivo"}
    </span>
  );
}

/** Le tre porte: la prima cosa che si vede. Ognuna dice che cosa c'è dietro, in una riga, e porta alla sua sezione. */
export function Porte({ attivo, entry, prices }: { attivo: boolean; entry: string | null; prices: boolean }) {
  return (
    <ul className="ds-doors ds-doors-3" aria-label="Le tre sezioni di Cura Privata">
      <li>
        <Link href={PREVENZIONE_HREF} className="ds-door ds-door-1" data-track="porta-prevenzione">
          <span className="ds-door-n" aria-hidden>
            1
          </span>
          <span className="ds-door-ic" aria-hidden>
            <HeartPulse className="tm-ic" />
          </span>
          <span className="ds-door-k">Prevenzione</span>
          <span className="ds-door-t">Gli esami giusti, al momento giusto</span>
          <span className="ds-door-d">Quali controlli conoscere, guide agli esami e agli integratori.</span>
          <span className="ds-door-f">
            <span>Gratis</span>
            <ArrowRight aria-hidden className="tm-ic" />
          </span>
        </Link>
      </li>
      <li>
        <Link href={REFERTI_HREF} className="ds-door ds-door-2" data-track="porta-referti">
          <span className="ds-door-n" aria-hidden>
            2
          </span>
          <span className="ds-door-ic" aria-hidden>
            <FileText className="tm-ic" />
          </span>
          <span className="ds-door-k">Lettura referti</span>
          <span className="ds-door-t">Il tuo referto, in parole semplici</span>
          <span className="ds-door-d">Carichi il referto, controlli i valori e lo leggi spiegato riga per riga.</span>
          <span className="ds-door-f">
            <span>{prices && entry ? `Da ${entry}` : "Senza abbonamento"}</span>
            <ArrowRight aria-hidden className="tm-ic" />
          </span>
        </Link>
      </li>
      <li>
        <Link href={MEDICI_HREF} className="ds-door ds-door-3" data-track="porta-medici">
          <span className="ds-door-n" aria-hidden>
            3
          </span>
          <span className="ds-door-ic" aria-hidden>
            <Stethoscope className="tm-ic" />
          </span>
          <span className="ds-door-k">
            Medici <StatoDomicilio attivo={attivo} dark />
          </span>
          <span className="ds-door-t">Un medico, quando serve</span>
          <span className="ds-door-d">In video, a casa tua o per un secondo parere di uno specialista.</span>
          <span className="ds-door-f">
            <span>{attivo && prices ? `Video ${prestazionePrice("video")} · casa ${prestazionePrice("domicilio")}` : "Lista d’attesa aperta"}</span>
            <ArrowRight aria-hidden className="tm-ic" />
          </span>
        </Link>
      </li>
    </ul>
  );
}

/** Il primo controllo in miniatura (sezione 1), per l'apertura: tre aree da conoscere, nessuna indicazione. */
export function MiniPrevenzione() {
  return (
    <div className="ds-mini ds-mini-1 ds-mini-pv" aria-hidden>
      <p className="ds-mini-k">
        <span className="ds-mini-n">1</span> Primo controllo
      </p>
      <ul className="ds-mini-list">
        <li>
          <Check className="tm-ic" />
          Cuore e pressione
        </li>
        <li>
          <Check className="tm-ic" />
          Zuccheri nel sangue
        </li>
        <li className="ds-mini-todo">
          <i />
          Vista
        </li>
      </ul>
      <p className="ds-mini-st ds-mini-st-ok">Una scheda da portare al medico</p>
    </div>
  );
}

/** La scheda del referto in miniatura (sezione 1), per l'apertura. */
export function MiniReferto() {
  return (
    <div className="ds-mini ds-mini-1" aria-hidden>
      <p className="ds-mini-k">
        <span className="ds-mini-n">2</span> Il tuo referto, spiegato
      </p>
      <p className="ds-mini-r">
        <b>Colesterolo LDL</b>
        <span>
          <b>
            <CountUp to={134} />
          </b>{" "}
          mg/dL
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

/**
 * La conferma della visita in miniatura (sezione 2), per l'apertura. Con i medici spenti niente nomi di medici: solo
 * che cosa arriverà.
 */
export function MiniVisita({ attivo = true }: { attivo?: boolean }) {
  if (!attivo)
    return (
      <div className="ds-mini ds-mini-3" aria-hidden>
        <p className="ds-mini-k">
          <span className="ds-mini-n">3</span> Un medico · in arrivo
        </p>
        <div className="ds-mini-doc">
          <span className="ds-av ds-av-teal">
            <Home className="tm-ic" />
          </span>
          <span>
            <b>Il medico a casa tua</b>
            <small>Medico di medicina generale</small>
          </span>
        </div>
        <p className="ds-mini-when">
          <b>Brescia città</b>
          <span>per cominciare</span>
        </p>
      </div>
    );
  return (
    <div className="ds-mini ds-mini-3" aria-hidden>
      <p className="ds-mini-k">
        <span className="ds-mini-n">3</span> Visita a casa · esempio
      </p>
      <div className="ds-mini-doc">
        <span className="ds-av ds-av-teal">MG</span>
        <span>
          <b>Il tuo medico</b>
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
export function ServiziMedico({ prices, attivo, dark = false, onSection = false }: { prices: boolean; attivo: boolean; dark?: boolean; onSection?: boolean }) {
  return (
    <ul className={`ds-svcs${dark ? " ds-svcs-dark" : ""}`}>
      {(["domicilio", "video", "parere"] as const).map((k) => {
        const I = SVC_ICON[k];
        return (
          <li key={k} className={k === "domicilio" ? "ds-svc ds-svc-main" : "ds-svc"}>
            <Link href={!attivo ? `${MEDICI_HREF}#avvisami` : k === "domicilio" ? (onSection ? PRESTAZIONI.domicilio.startHref : MEDICI_HREF) : PRESTAZIONI[k].href} className="ds-svc-a">
              <span className="ds-svc-ic" aria-hidden>
                <I className="tm-ic" />
              </span>
              <span className="ds-svc-t">{SVC_TEXT[k].t}</span>
              <span className="ds-svc-d">{SVC_TEXT[k].d}</span>
              {attivo && k === "parere" && !secondoParereEnabled() ? (
                <span className="ds-svc-p">In arrivo</span>
              ) : attivo && prices ? (
                <span className="ds-svc-p">{prestazionePrice(k)}</span>
              ) : null}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

/**
 * Proposta 16/11/2026: il percorso tra le tre sezioni, in testa a ogni pagina di sezione. Dice dove sei e che cosa
 * viene dopo: 1 Prevenzione → 2 Lettura referti → 3 Medici.
 */
export function PercorsoSezioni({ current }: { current: 1 | 2 | 3 }) {
  const steps = [
    { n: 1, href: PREVENZIONE_HREF, t: "Prevenzione", d: "prima degli esami" },
    { n: 2, href: REFERTI_HREF, t: "Lettura referti", d: "quando hai il referto" },
    { n: 3, href: MEDICI_HREF, t: "Medici", d: "se serve una persona" },
  ] as const;
  return (
    <nav className={`ds-path ds-path-on-${current}`} aria-label="Le tre sezioni">
      <ol>
        {steps.map((s) => (
          <li key={s.n} className={s.n === current ? "is-on" : s.n < current ? "is-done" : undefined}>
            <Link prefetch={false} href={s.href} aria-current={s.n === current ? "page" : undefined}>
              <span className="ds-path-n">{s.n}</span>
              <span>
                <b>{s.t}</b>
                <small>{s.d}</small>
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}
