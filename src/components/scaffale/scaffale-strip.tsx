import Link from "next/link";
import { ArrowRight, ExternalLink } from "lucide-react";
import { Jar } from "@/components/wow/jar";
import { INTEGRATORI_COLORS, getIntegratore } from "@/content/integratori";
import { linkNegozio, prodottiScaffale } from "@/content/scaffale";
import "./scaffale.css";

/**
 * Lo Scaffale in fondo a una pagina (22/11/2026, analisi di chiarezza punti 27–28, sì di Simone): dopo la spiegazione,
 * mai in mezzo. Ogni prodotto porta «Pubblicità», la marca, la scheda da leggere prima e i negozi dove si compra.
 * Finché i prodotti sono esempi lo dice in chiaro. Senza prodotti da mostrare non disegna niente.
 * 27/11/2026 (fase 1): finché non c'è un accordo nessuno paga lo spazio, quindi non si scrive «Pubblicità» né «negozi
 * partner»: l'etichetta è «Esempio». E lo Scaffale non sta più sulle schede degli integratori, che si raggiungono dal
 * report: mai un prodotto a due tocchi da un valore del referto.
 */
export function ScaffaleStrip({ scheda, titolo, limit, id = "scaffale", criteri = true }: { scheda?: string; titolo?: string; limit?: number; id?: string; criteri?: boolean }) {
  const all = prodottiScaffale(scheda);
  const list = limit ? all.slice(0, limit) : all;
  if (!list.length) return null;
  const esempi = list.some((p) => p.esempio);
  const etichetta = esempi ? "Esempi, nessun accordo" : "Pubblicità";
  return (
    <aside className="scf" id={id} aria-labelledby={`${id}-t`} data-testid="scaffale">
      <div className="scf-head">
        <p className="scf-k">
          <span>Lo Scaffale</span>
          <span className="scf-adv">{etichetta}</span>
        </p>
        <h2 id={`${id}-t`} className="scf-t">
          {titolo ?? (esempi ? "Dopo aver capito: alcuni prodotti in commercio" : "Dopo aver capito: i prodotti dei negozi partner")}
        </h2>
        <p className="scf-d">
          Separati dalle spiegazioni. Prima di cominciare un integratore chiedi al medico o al farmacista, soprattutto se prendi farmaci.
          {esempi ? " Questi sono esempi: non abbiamo ancora accordi con le aziende né con i negozi." : ""}
        </p>
      </div>
      <ul className={`scf-list${list.length > 2 ? " scf-row" : ""}`}>
        {list.map((p) => {
          const i = getIntegratore(p.scheda);
          const [c, d] = INTEGRATORI_COLORS[p.scheda] ?? ["#F6B98E", "#A4471F"];
          return (
            <li key={p.id} className="scf-card" data-prodotto={p.id}>
              <div className="scf-top">
                <Jar c={c} d={d} size={44} />
                <span className="scf-tags">
                  {p.esempio ? <span className="scf-ex">Esempio</span> : <span className="scf-adv">Pubblicità</span>}
                </span>
              </div>
              <p className="scf-brand">{p.marca}</p>
              <h3 className="scf-name">{p.nome}</h3>
              <p className="scf-fmt">{p.formato}</p>
              {i ? (
                <Link prefetch={false} href={`/integratori/${p.scheda}`} className="scf-read">
                  Prima leggi: {i.name} <ArrowRight aria-hidden />
                </Link>
              ) : null}
              <p className="scf-shops-h">Prezzo e acquisto nel negozio:</p>
              <ul className="scf-shops">
                {p.negozi.map((n) => (
                  <li key={n.nome}>
                    <a href={linkNegozio(n)} target="_blank" rel="sponsored nofollow noopener noreferrer" className="scf-shop">
                      {n.nome} <ExternalLink aria-hidden />
                      <span className="sr-only"> (si apre in un&apos;altra scheda)</span>
                    </a>
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ul>
      {criteri ? (
      <p className="scf-foot">
        <Link prefetch={false} href="/scaffale">
          Come scegliamo i prodotti dello Scaffale
        </Link>
      </p>
      ) : null}
    </aside>
  );
}
