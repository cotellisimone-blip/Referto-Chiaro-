import type { Metadata } from "next";
import Link from "next/link";
import { CalendarioArrivo, MappaPassi } from "@/components/wow/medici-art";
import { ArrowRight, Check, CircleAlert, FileText, FlaskConical, MapPin } from "lucide-react";
import { Photo } from "@/components/ui/photo";
import { ILLUSTRATIVE_PHOTOS, SHOW_ILLUSTRATIVE_PHOTOS } from "@/content/media";
import { WaitlistForm } from "@/components/site/waitlist-form";
import { CoverageCheck } from "@/components/prestazioni/public";
import { EmergencyNumbers } from "@/components/prestazioni/ui";
import { MediciProva } from "@/components/sezioni/medici";
import { MiniVisita, REFERTI_HREF, ServiziMedico, StatoDomicilio, PercorsoSezioni } from "@/components/sezioni/parts";
import { PRESTAZIONI, prestazionePrice } from "@/domain/prestazioni/listino";
import { PRICE_NOTE, publicPricesEnabled } from "@/domain/offerta";
import { mediciEnabled } from "@/lib/medici";
import "@/components/home/tre-momenti.css";
import "@/components/sezioni/sezioni.css";

export const metadata: Metadata = {
  title: "Medici: in video, a casa o per un secondo parere",
  description: "La sezione Medici di Cura Privata: videoconsulto, visita a casa con un medico di medicina generale (Brescia città come area pilota) e secondo parere di uno specialista. Per esigenze non urgenti.",
  alternates: { canonical: "/medici" },
};

const NOT_FOR = [
  "Emergenze: chiama il 112.",
  "Continuità assistenziale pubblica (ex guardia medica): chiama il 116117 negli orari previsti.",
  "Certificati di malattia e ricette del Servizio sanitario: per quelli resta il tuo medico di famiglia.",
];

/**
 * Sezione 3 «Medici» (15/11/2026, prima «A domicilio»; Simone la sera stessa: prevenzione, lettura referti e medici
 * sono tre sezioni separate). Accesi i medici (src/lib/medici.ts): «Versione di prova» con i tre medici
 * inventati, il percorso in quattro schermate, i servizi con il prezzo, la verifica del CAP e la prova a tre ruoli.
 * Spenti: «In arrivo», niente medici né prezzi, la stessa spiegazione e la lista d'attesa.
 */
export default function MediciPage() {
  const attivo = mediciEnabled();
  const prices = publicPricesEnabled();
  const info = PRESTAZIONI.domicilio;
  return (
    <div className="tm ds">
      <section className="ds-ph ds-ph-3" aria-labelledby="dom-titolo">
        <div className="tm-wrap">
          <PercorsoSezioni current={3} />
        </div>
        <div className="tm-wrap ds-ph-g">
          <div>
            <p className="ds-sec-tag ds-sec-tag-3">
              <span>3</span> Sezione Medici <StatoDomicilio attivo={attivo} dark />
            </p>
            <h1 id="dom-titolo">
              Un medico, <em>quando serve.</em>
            </h1>
            <p className="tm-lead">
              In video, a casa tua o di un familiare, oppure un secondo parere di uno specialista. Per esigenze non urgenti; la visita a casa parte da Brescia città.
            </p>
            <div className="ds-ph-buy">
              {attivo && prices ? (
                <p className="ds-price">
                  <b>{prestazionePrice("domicilio")}</b>
                  <span>visita a casa, prezzo fisso</span>
                </p>
              ) : null}
              {attivo ? (
                <Link href={info.startHref} className="tm-btn tm-btn-mint" data-track="cta-domicilio">
                  Richiedi la visita <ArrowRight aria-hidden className="tm-ic" />
                </Link>
              ) : (
                <a href="#avvisami" className="tm-btn tm-btn-mint" data-track="cta-avvisami">
                  Avvisami quando parte <ArrowRight aria-hidden className="tm-ic" />
                </a>
              )}
            </div>
            <p className="tm-fine">Paghi solo dopo che il medico ha confermato l’orario. Per un’emergenza chiama il 112.</p>
          </div>
          <div className="ds-ph-art">
            {SHOW_ILLUSTRATIVE_PHOTOS ? (
              <figure className="ds-ph-photo">
                <Photo photo={ILLUSTRATIVE_PHOTOS.hero} sizes="(min-width: 821px) 44vw, 100vw" priority />
                <figcaption className="tm-illus">Immagine illustrativa</figcaption>
              </figure>
            ) : null}
            <MiniVisita attivo={attivo} />
          </div>
        </div>
      </section>

      {attivo ? (
        <div className="ds-provabar" role="note">
          <div className="tm-wrap">
            <FlaskConical aria-hidden className="tm-ic" />
            <p>
              <b>Versione di prova.</b> Medici, fasce, pagamenti e visite sono simulati: nessuno verrà davvero e nessun addebito parte.
            </p>
          </div>
        </div>
      ) : null}

      <section className="ds-sec-light" aria-labelledby="dom-modi">
        <div className="tm-wrap">
          <div className="tm-sec-h">
            <div>
              <p className="tm-kicker">Tre modi</p>
              <h2 id="dom-modi">
                A casa, in video <em>o con uno specialista.</em>
              </h2>
            </div>
            <p>Il medico a casa quando serve una visita di persona. Il videoconsulto quando basta parlarsi. Il secondo parere per un dubbio su esami già fatti.</p>
          </div>
          <ServiziMedico prices={prices} attivo={attivo} onSection />
          {attivo && prices ? <p className="tm-note">{PRICE_NOTE}</p> : null}
        </div>
      </section>

      <section className="ds-sec-light ds-sec-alt" aria-labelledby="dom-medici">
        <div className="tm-wrap">
          <div className="tm-sec-h">
            <div>
              <p className="tm-kicker">I medici</p>
              <h2 id="dom-medici">
                Medici con nome e cognome, <em>prima di pagare.</em>
              </h2>
            </div>
            <p>
              {attivo
                ? "Ogni medico ha la sua scheda: iscrizione all’Ordine, zona, che cosa fa e la prima fascia libera. Qui sono profili di prova, con persone inventate."
                : "Lavoreremo solo con medici iscritti all’Ordine e verificati, ciascuno con la sua scheda: nome, iscrizione, zona e che cosa fa. Li presenteremo quando avremo i contratti firmati."}
            </p>
          </div>
          {attivo ? (
            <div className="ds-light-docs">
              <MediciProva />
            </div>
          ) : null}
        </div>
      </section>

      <section className="ds-sec-light" aria-labelledby="dom-come">
        <div className="tm-wrap">
          <div className="tm-sec-h">
            <div>
              <p className="tm-kicker">La visita a casa, passo per passo</p>
              <h2 id="dom-come">
                Quattro passi, <em>e sai sempre a che punto sei.</em>
              </h2>
            </div>
            <p>Non paghi nulla quando invii la richiesta. Paghi solo quando vedi nome del medico, orario confermato, indirizzo e prezzo totale.</p>
          </div>
          <MappaPassi />
          <ol className="ds-flow">
            <li>
              <div className="ds-flow-scr" aria-hidden>
                <p className="ds-f-k">Dove si svolge la visita?</p>
                <div className="ds-f-in">
                  <i>Brescia</i>
                  <i>25122</i>
                </div>
                <p className="ds-f-ok">
                  <Check className="tm-ic" /> Arriviamo da te
                </p>
                <span className="ds-f-btn">Vedi le fasce libere</span>
              </div>
              <b className="ds-flow-t">
                <span>1</span> Scrivi comune e CAP
              </b>
              <p>Sai subito se arriviamo da te. Se no, te lo diciamo e ti proponiamo un videoconsulto.</p>
            </li>
            <li>
              <div className="ds-flow-scr" aria-hidden>
                <p className="ds-f-k">Scegli una fascia</p>
                <p className="ds-f-day">Domani</p>
                <div className="ds-f-slots">
                  <i>9:00</i>
                  <i className="on">10:00</i>
                  <i>11:00</i>
                  <i>14:00</i>
                  <i>15:00</i>
                  <i>16:00</i>
                </div>
                <p className="ds-f-day">Giovedì</p>
                <div className="ds-f-slots">
                  <i>9:00</i>
                  <i>11:00</i>
                  <i>15:00</i>
                </div>
              </div>
              <b className="ds-flow-t">
                <span>2</span> Scegli una fascia
              </b>
              <p>Vedi solo gli orari davvero liberi. È una richiesta: il medico la conferma o te ne propone un’altra.</p>
            </li>
            <li>
              <div className="ds-flow-scr" aria-hidden>
                <p className="ds-f-k">Il medico ha confermato</p>
                <div className="ds-f-doc">
                  <span className="ds-av ds-av-teal">
                    {attivo ? "LB" : "MG"}
                    <i className="ds-av-on" />
                  </span>
                  <b>{attivo ? "Dott.ssa Laura Bianchi" : "Il tuo medico"}</b>
                </div>
                <p className="ds-f-row">
                  Quando <b>Domani, 10:00</b>
                </p>
                <p className="ds-f-row">
                  Dove <b>Via di Prova 1</b>
                </p>
                <p className="ds-f-row">
                  Totale <b>{attivo && prices ? prestazionePrice("domicilio") : "prezzo fisso"}</b>
                </p>
                <span className="ds-f-btn">Conferma e paga</span>
              </div>
              <b className="ds-flow-t">
                <span>3</span> Confermi quando sai tutto
              </b>
              <p>Nome, orario, indirizzo e prezzo: li vedi prima di pagare. Puoi ancora annullare.</p>
            </li>
            <li>
              <div className="ds-flow-scr" aria-hidden>
                <p className="ds-f-k">Riepilogo della visita</p>
                <p className="ds-f-sum">«Visitato a domicilio per tosse da tre giorni, senza febbre. Indicazioni date a voce e per iscritto.»</p>
                <p className="ds-f-next">
                  <small>Prossimo passo</small>
                  Sentire il medico di famiglia se non migliora in una settimana.
                </p>
              </div>
              <b className="ds-flow-t">
                <span>4</span> Visita e riepilogo scritto
              </b>
              <p>Circa 45 minuti a casa. Poi trovi il riepilogo nella tua richiesta, da stampare o mostrare al tuo medico.</p>
            </li>
          </ol>
          <p className="tm-note">Le schermate sono un esempio, con dati inventati.</p>
        </div>
      </section>

      {attivo ? (
        <section id="copertura" className="ds-sec-light ds-sec-alt" aria-labelledby="dom-dove">
          <div className="tm-wrap ds-ph-g ds-g-even">
            <div>
              <p className="tm-kicker">
                <MapPin aria-hidden className="tm-ic" /> Area pilota
              </p>
              <h2 id="dom-dove">
                Dove arriviamo: <em>Brescia città.</em>
              </h2>
              <p className="tm-lead">Allarghiamo la zona solo quando abbiamo abbastanza medici per garantire le fasce che mostriamo.</p>
            </div>
            <div className="ds-cov">
              <CoverageCheck />
              <EmergencyNumbers />
            </div>
          </div>
        </section>
      ) : (
        <section id="avvisami" className="ds-sec-light ds-sec-alt" aria-labelledby="dom-avvisami">
          <div className="tm-wrap ds-ph-g ds-g-even">
            <div>
              <CalendarioArrivo />
              <p className="tm-kicker mt-4">Lista d’attesa</p>
              <h2 id="dom-avvisami">
                Avvisami quando parte <em>nella mia zona.</em>
              </h2>
              <p className="tm-lead">Il servizio non è ancora attivo. Lascia email e CAP: partiamo dalle zone in cui c’è più richiesta.</p>
            </div>
            <div className="ds-cov">
              <WaitlistForm interest="domicilio" />
            </div>
          </div>
        </section>
      )}

      <section className="ds-sec-light" aria-labelledby="dom-non">
        <div className="tm-wrap">
          <div className="ds-rule">
            <CircleAlert aria-hidden className="tm-ic" />
            <div>
              <h2 id="dom-non">Quando non è la strada giusta</h2>
              <ul>
                {NOT_FOR.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
            </div>
          </div>
          {attivo ? (
            <div className="ds-sec-end">
              <Link href={info.startHref} className="tm-btn tm-btn-ink" data-track="cta-domicilio">
                Richiedi la visita <ArrowRight aria-hidden className="tm-ic" />
              </Link>
              <Link href="/prova" className="tm-btn tm-btn-line">
                Prova il percorso completo
              </Link>
            </div>
          ) : null}
        </div>
      </section>

      <section className="ds-bridge" aria-labelledby="dom-ponte">
        <div className="tm-wrap">
          <Link href={REFERTI_HREF} className="ds-bridge-a ds-bridge-2">
            <span className="ds-door-ic" aria-hidden>
              <FileText className="tm-ic" />
            </span>
            <span>
              <span className="ds-sec-tag ds-sec-tag-2">
                <span>2</span> Sezione Lettura referti
              </span>
              <span id="dom-ponte" className="ds-bridge-t">
                Prima o dopo la visita: il tuo referto spiegato in parole semplici.
              </span>
            </span>
            <ArrowRight aria-hidden className="tm-ic ds-bridge-go" />
          </Link>
        </div>
      </section>
    </div>
  );
}
