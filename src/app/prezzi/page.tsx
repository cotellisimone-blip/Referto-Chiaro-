import { pageTitle } from "@/lib/seo";
import "@/components/offerta/offerta.css";
import type { Metadata } from "next";
import Link from "next/link";
import { EXAM_GUIDE_COUNT } from "@/content/guides";
import { PercorsoSezioni } from "@/components/sezioni/parts";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Gift,
  Wallet,
  Clock3,
  UserRound,
} from "lucide-react";
import { OFFER_ICON, OfferPrice } from "@/components/offerta/service-triad";
import { FaqList } from "@/components/ui/faq-list";
import { Wave } from "@/components/ui/wave";
import { publicOfferItems } from "@/domain/prestazioni/offerta-completa";
import { PARERE_HREF, mediciEnabled, secondoParereEnabled } from "@/lib/medici";
import { prestazionePrice } from "@/domain/prestazioni/listino";
import { PrestoMedico } from "@/components/site/presto-medico";
import {
  PRESTAZIONI,
  type PrestazioneKind,
} from "@/domain/prestazioni/listino";
import { cancelTerms } from "@/domain/prestazioni/engine";
import {
  PRICE_NOTE,
  firstRefertoCents,
  formatEuro,
  priceCents,
  publicPricesEnabled,
  upgradeCostCents,
  upgradeEnabled,
  serviceStart,
} from "@/domain/offerta";
import { PageLd, capisciServiceLd } from "@/components/site/page-ld";
import "@/components/sezioni/tre-momenti.css";
import "@/components/sezioni/sezioni.css";

export const metadata: Metadata = {
  title: pageTitle("Quanto costa farsi spiegare un referto"),
  description: mediciEnabled()
    ? "I servizi di Cura Privata a confronto: referto spiegato, videoconsulto e secondo parere. Che cosa includono, tempi e prezzo."
    : "Quanto costa Cura Privata: il primo referto spiegato, i successivi e che cosa è gratis. Che cosa include, tempi e prezzo, prima di pagare.",
  alternates: { canonical: "/prezzi" },
};

const START_LABEL: Record<PrestazioneKind, string> = {
  domicilio: "Richiedi la visita",
  video: "Prenota il videoconsulto",
  parere: "Richiedi il secondo parere",
};

const PAY_FAQ = [
  [
    "Perché il primo referto costa meno?",
    `Per farti provare il servizio: il primo referto che fai spiegare costa ${formatEuro(firstRefertoCents())}, una sola volta per persona. Dal secondo, ${formatEuro(priceCents("capisci"))} per referto. Nessun abbonamento.`,
  ],
  [
    "Quando pago?",
    "Solo alla fine del percorso di richiesta, dopo aver visto prezzo e tempi. Con un medico paghi solo dopo che ha confermato. Nessun abbonamento e nessun rinnovo automatico.",
  ],
  [
    "Posso annullare un videoconsulto?",
    cancelTerms("video"),
  ],
  [
    "E se il medico non può accettare il mio caso?",
    "Se il medico ritiene che la documentazione non basti o che serva una visita in presenza, il caso non viene preso in carico e il pagamento ti viene restituito. Le condizioni complete saranno pubblicate prima del lancio.",
  ],
  [
    "Posso passare da un servizio all'altro?",
    "Sì: i documenti che hai già caricato restano nella tua area personale e non li ricarichi. Se inizi con «Capisci il tuo referto» e poi vuoi parlarne con un medico, riparti da dove eri.",
  ],
  [
    "Come pago?",
    "Con carta, tramite un fornitore di pagamenti certificato: Cura Privata non vede né conserva i dati della carta.",
  ],
] as const;

/**
 * Prezzi, grafica «Luce»: i quattro servizi a confronto, righe allineate tra le schede (per chi, prezzo, tempi,
 * che cosa include, azione). Nomi, prezzi e tempi arrivano dal listino unico.
 */
export default function PrezziPage() {
  const prices = publicPricesEnabled();
  const medici = mediciEnabled();
  const upgrade = upgradeEnabled() && medici;
  const items = publicOfferItems();
  // 17/11/2026 (20 interventi, punto 4): senza medici c'è un solo servizio a pagamento. Una scheda sola non sta in una
  // griglia da quattro (restava una colonna stretta nel vuoto): diventa una scheda larga, con «Che cosa include» in vista.
  const solo = items.length === 1;
  return (
    <>
      <PageLd path="/prezzi" meta={metadata} name="Prezzi" service={capisciServiceLd()} />
      <section
        aria-labelledby="prezzi-titolo"
        className="page-hero page-hero-wave"
      >
        <div className="container-rc page-hero-inner page-hero-overlap">
          <div className="tm ds ds-bare">
            <PercorsoSezioni />
            <p className="ds-sec-tag ds-sec-tag-2">
              <span>€</span> Prezzi
            </p>
          </div>
          <h1 id="prezzi-titolo" className="page-title mt-4 max-w-[16ch]">
            Un prezzo chiaro, <em>prima di pagare.</em>
          </h1>
          <p className="lead mt-5 max-w-[40rem]">
            {medici
              ? "Molto è gratis. Paghi solo il referto spiegato e il medico. "
              : "Molto è gratis. Paghi solo il referto spiegato, valore per valore. "}
            Nessun abbonamento. In questa versione dimostrativa nessun
            pagamento è reale.
          </p>
          <p className="mt-4 text-[1.0625rem]">
            <Link href="/cura-privata-o-un-ai-gratuita" className="link font-semibold">
              Perché pagare, se un’AI gratuita legge il referto?
            </Link>
          </p>
        </div>
        <Wave className="text-canvas" />
      </section>

      <section aria-label="Confronto dei servizi" className="price-section">
        <div className="container-rc">
          {/* 22/11/2026 (analisi di chiarezza, punti 24 e 29): prima di tutto, che cosa è gratis e che cosa si paga. */}
          <div className="price-split" data-testid="gratis-pagamento">
            <section className="price-split-col price-split-free" aria-labelledby="prezzi-gratis">
              <h2 id="prezzi-gratis">
                <Gift aria-hidden /> Gratis
              </h2>
              <ul>
                <li>
                  <b>Passo 1 · Inizia da te</b>: il Punto di Partenza e la tua mappa
                </li>
                <li>
                  <b>Passo 2 · Gli esami per te</b>: esami di base e screening per età
                </li>
                <li>
                  <b>Passo 5 · Prenditi cura di te</b>: sonno, intestino, integratori spiegati
                </li>
                <li>
                  <b>Il tuo spazio</b>: referti in ordine, diari della salute, promemoria
                </li>
                <li>
                  <b>Guide e glossario</b>: {EXAM_GUIDE_COUNT} esami spiegati
                </li>
              </ul>
            </section>
            <section className="price-split-col price-split-pay" aria-labelledby="prezzi-pagamento">
              <h2 id="prezzi-pagamento">
                <Wallet aria-hidden /> A pagamento
              </h2>
              <ul>
                <li>
                  <b>Passo 3 · Capisci il referto</b>:{" "}
                  {prices && firstRefertoCents() < priceCents("capisci")
                    ? `il primo ${formatEuro(firstRefertoCents())} (una volta per persona), poi ${formatEuro(priceCents("capisci"))}, con la guida personale`
                    : prices
                      ? `${formatEuro(priceCents("capisci"))} a referto, con la guida personale`
                      : "a referto, con la guida personale"}
                </li>
                {medici ? (
                  <li>
                    <b>Passo 4 · Un medico in video</b>: {prices ? `${prestazionePrice("video")}, prezzo fisso` : "prezzo fisso"}
                    {secondoParereEnabled() ? "; secondo parere a parte" : "; il secondo parere è in arrivo"}
                  </li>
                ) : (
                  <li>
                    <b>Passo 4 · Un medico</b>: in arrivo
                  </li>
                )}
                <li>
                  <b>Integratori e probiotici</b>: non li vendiamo noi. Dallo{" "}
                  <Link href="/scaffale" className="link">
                    Scaffale
                  </Link>{" "}
                  vai al negozio partner e paghi il suo prezzo
                </li>
              </ul>
            </section>
          </div>
          <ul className="price-grid" data-solo={solo ? "true" : undefined}>
            {items.map((s) => {
              const Icon = OFFER_ICON[s.icon];
              // 22/11/2026: il secondo parere spento è «In arrivo»: niente «Richiedi», si chiede di essere avvisati.
              const inArrivo = s.kind === "parere" && !secondoParereEnabled();
              const start = inArrivo
                ? { href: PARERE_HREF, label: "Avvisami quando parte" }
                : s.kind
                  ? {
                      href: PRESTAZIONI[s.kind].startHref,
                      label: START_LABEL[s.kind],
                    }
                  : serviceStart(s.coreId!);
              return (
                <li key={s.key} className={`tone-${s.tone}`}>
                  <article
                    className="price-card"
                    aria-labelledby={`prezzo-${s.key}`}
                    data-servizio={s.key}
                  >
                    <div className="price-card-head">
                      <span aria-hidden className="tile-ico tile-ico-tone">
                        <Icon />
                      </span>
                      <h2 id={`prezzo-${s.key}`} className="price-card-name">
                        {s.name}
                      </h2>
                    </div>
                    <p className="price-card-for">{s.forWhom}</p>
                    <div className="price-card-price">
                      {prices ? <OfferPrice item={s} size="lg" /> : null}
                    </div>
                    <p className="svc-meta price-card-time">
                      <Clock3 aria-hidden />
                      {inArrivo ? "In arrivo: stiamo cercando lo specialista. Lascia l'email e ti avvisiamo." : s.timing}
                    </p>
                    {solo ? (
                      <div className="price-solo-incl">
                        <h3>Che cosa include</h3>
                        <p className="svc-meta">
                          <UserRound aria-hidden />
                          {s.who}
                        </p>
                        <ul>
                          {s.includes.map((x) => (
                            <li key={x}>
                              <Check aria-hidden />
                              {x}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <details className="price-details">
                        <summary>
                          Che cosa include{" "}
                          <ChevronDown aria-hidden className="h-5 w-5" />
                        </summary>
                        <p className="svc-meta">
                          <UserRound aria-hidden />
                          {s.who}
                        </p>
                        <ul>
                          {s.includes.map((x) => (
                            <li key={x}>
                              <Check aria-hidden />
                              {x}
                            </li>
                          ))}
                        </ul>
                      </details>
                    )}
                    <div className="price-card-foot">
                      <Link
                        href={start.href}
                        className="btn btn-primary w-full"
                      >
                        {start.label}{" "}
                        <ArrowRight aria-hidden className="btn-arrow h-5 w-5" />
                      </Link>
                      <Link
                        href={s.href}
                        className="link inline-flex min-h-11 items-center justify-center font-semibold"
                      >
                        Dettagli del servizio
                      </Link>
                    </div>
                  </article>
                </li>
              );
            })}
          </ul>
          <p className="mt-5 px-1 text-[1rem] text-muted">{PRICE_NOTE}</p>
          {medici ? null : <PrestoMedico className="mt-8" />}
          {upgrade && prices ? (
            <p className="mt-4 rounded-2xl bg-mist px-5 py-4 text-lg text-ink">
              Hai già usato «Capisci il tuo referto»? Per parlarne con un medico
              ti scaliamo quanto pagato per il referto:{" "}
              {formatEuro(upgradeCostCents("capisci", "parla-con-un-medico"))}.
            </p>
          ) : null}
        </div>
      </section>

      {/* 22/11/2026 (analisi di chiarezza, punto 25, sì di Simone): il piano Famiglia (una proposta) non sta più tra i
          prezzi, dove sembrava un abbonamento da comprare. Resta descritto in /famiglia#piano. */}

      <section aria-labelledby="pagamenti-titolo" className="section">
        <div className="container-rc grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[0.7fr_1.3fr] lg:gap-14">
          <div>
            <p className="eyebrow">Pagamenti</p>
            <h2 id="pagamenti-titolo" className="display-lg mt-3">
              Senza sorprese.
            </h2>
            <p className="lead mt-4">
              Vedi sempre prezzo e tempi prima di pagare.
              {medici ? " Con un medico, paghi solo dopo la sua conferma." : ""}
            </p>
          </div>
          <FaqList items={(medici ? PAY_FAQ : PAY_FAQ.map(([q, a]) => [q, a.replace(" Con un medico paghi solo dopo che ha confermato.", "")]).filter(([q, a]) => !/medic|visita/i.test(q + a))).map(([q, a]) => ({ q, a }))} />
        </div>
      </section>
    </>
  );
}
