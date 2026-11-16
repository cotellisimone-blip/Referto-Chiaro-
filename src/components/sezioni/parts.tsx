import Link from "next/link";
import { CountUp } from "@/components/wow/count-up";
import { ArrowUp, Check, Home, Stethoscope, Video } from "lucide-react";
import { PRESTAZIONI, prestazionePrice, type PrestazioneKind } from "@/domain/prestazioni/listino";
import { domicilioEnabled, secondoParereEnabled } from "@/lib/medici";

/**
 * Pezzi comuni della home e delle pagine delle tre sezioni (15/11/2026 sera, divisione voluta da Simone):
 * 1 «Prevenzione» (esami da fare, guide, integratori) = carta e inchiostro; 2 «Lettura referti» = menta;
 * 3 «Medici» (video, casa, secondo parere) = petrolio e pesca. Lo stesso colore segue la sezione ovunque (porte,
 * fasce, pagine), così si riconosce a colpo d'occhio dove si è.
 */

export const PREVENZIONE_HREF = "/prevenzione";
export const REFERTI_HREF = "/lettura-referti";
export const MEDICI_HREF = "/medici";
export const CURA_HREF = "/prenditi-cura-di-te";

/** Etichetta dei medici: «Versione di prova» con i medici accesi, «In arrivo» (o «Medici in arrivo») spenti. */
export function StatoDomicilio({ attivo, dark = false, medici = false }: { attivo: boolean; dark?: boolean; medici?: boolean }) {
  // 19/11/2026: accesi, i medici sono quelli veri (Sara, Elena e Riccardo, a Brescia): non più «versione di prova».
  return attivo ? (
    <span className={`ds-state ds-state-prova${dark ? " ds-on-dark" : ""}`}>
      <i aria-hidden />
      {/* 22/11/2026 (analisi di chiarezza, punto 15): senza domicilio il medico è in video, da ovunque. */}
      {domicilioEnabled() ? (medici ? "Medici a Brescia" : "A Brescia") : medici ? "Medici in video" : "In video"}
    </span>
  ) : (
    <span className={`ds-state ds-state-arrivo${dark ? " ds-on-dark" : ""}`}>
      <i aria-hidden />
      {medici ? "Medici in arrivo" : "In arrivo"}
    </span>
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
          <span className="ds-mini-n">4</span> Un medico · in arrivo
        </p>
        <div className="ds-mini-doc">
          <span className="ds-av ds-av-teal">
            <Video className="tm-ic" />
          </span>
          <span>
            <b>Un medico, in video</b>
            <small>Medico di medicina generale</small>
          </span>
        </div>
        <p className="ds-mini-when">
          <b>Dal telefono</b>
          <span>con i referti già letti</span>
        </p>
      </div>
    );
  // 22/11/2026: con la visita a domicilio spenta, l'esempio è un videoconsulto.
  if (!domicilioEnabled())
    return (
      <div className="ds-mini ds-mini-3" aria-hidden>
        <p className="ds-mini-k">
          <span className="ds-mini-n">4</span> Videoconsulto · esempio
        </p>
        <div className="ds-mini-doc">
          <span className="ds-av ds-av-teal">MG</span>
          <span>
            <b>Il tuo medico</b>
            <small>Medico di medicina generale</small>
          </span>
        </div>
        <p className="ds-mini-when">
          <b>Domani, 18:30</b>
          <span>In video, dal telefono</span>
        </p>
        <p className="ds-mini-ok">
          <Check className="tm-ic" />
          Referti già letti dal medico
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
    <ul className={`ds-svcs${dark ? " ds-svcs-dark" : ""}${domicilioEnabled() ? "" : " ds-svcs-2"}`}>
      {(domicilioEnabled() ? (["domicilio", "video", "parere"] as const) : (["video", "parere"] as const)).map((k) => {
        const I = SVC_ICON[k];
        return (
          <li key={k} className={k === "domicilio" || (k === "video" && !domicilioEnabled()) ? "ds-svc ds-svc-main" : "ds-svc"}>
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

export type Passo = 1 | 2 | 3 | 4 | 5;
/** Il colore di ogni passo riprende quello delle tre sezioni di prima: 1–2 inchiostro e menta, 3 menta, 4 pesca, 5 menta. */
export const PASSO_TONO: Record<Passo, 1 | 2 | 3> = { 1: 1, 2: 1, 3: 2, 4: 3, 5: 1 };
export const PASSO_NOME: Record<Passo, string> = { 1: "Inizia da te", 2: "Gli esami per te", 3: "Capisci il referto", 4: "Un medico", 5: "Prenditi cura di te" };

/**
 * Proposta 16/11/2026, rifatta il 22/11/2026: il percorso in cinque passi (lo stesso del menu), in testa alle pagine
 * dei passi. Dice dove sei e che cosa viene dopo. Senza `current` non evidenzia nessun passo (pagine di servizio).
 */
export function PercorsoSezioni({ current }: { current?: Passo | null }) {
  const steps = [
    { n: 1, href: "/punto-di-partenza", t: "Inizia da te", s: "Inizia" },
    { n: 2, href: PREVENZIONE_HREF, t: "Gli esami per te", s: "Esami" },
    { n: 3, href: REFERTI_HREF, t: "Capisci il referto", s: "Referti" },
    { n: 4, href: MEDICI_HREF, t: "Un medico", s: "Medico" },
    { n: 5, href: CURA_HREF, t: "Prenditi cura di te", s: "Cura di te" },
  ] as const;
  const c = current ?? 0;
  return (
    <nav className={`ds-path ds-path5 ds-path-on-${c}`} aria-label="Il percorso in cinque passi">
      <ol>
        {steps.map((s) => (
          <li key={s.n} className={s.n === c ? "is-on" : s.n < c ? "is-done" : undefined}>
            <Link prefetch={false} href={s.href} aria-current={s.n === c ? "page" : undefined}>
              <span className="ds-path-n">{s.n}</span>
              <span>
                <b className="ds-path-l">{s.t}</b>
                <b className="ds-path-s" aria-hidden>
                  {s.s}
                </b>
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </nav>
  );
}
