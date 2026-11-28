import Link from "next/link";
import type { ReactNode } from "react";
import { clsx } from "clsx";
import type { GuidaPersonale, GuidaTema } from "@/domain/reporting/guida-personale";
import { GuidaApribile } from "./guida-apribile";
import "./guida-personale.css";

/**
 * «La tua guida personale», dentro il report a pagamento del servizio Lettura referti (19/11/2026). Stessa veste della tessera 4 della home «chiara e
 * scura»: carta bianca bordata di menta nella luce chiara, vetro sulla notte nella scura; un gruppo per tema, con
 * l'icona a due toni del tema. I contenuti li calcola il server (src/domain/reporting/guida-personale.ts).
 */

/** Le icone a due toni della home, disegnate qui per non dipendere dal foglio di simboli della home. */
const ICONE: Record<GuidaTema | "guida", ReactNode> = {
  guida: (
    <>
      <path d="M7 7a3 3 0 0 1 3-3h15v20H10a3 3 0 0 0-3 3z" fill="currentColor" fillOpacity=".16" />
      <path d="M7 27a2 2 0 0 0 2 2h16" />
      <path d="M16 4v9l2.5-2 2.5 2V4" fill="currentColor" fillOpacity=".3" />
    </>
  ),
  integratori: (
    <>
      <rect x="5" y="11" width="22" height="10" rx="5" transform="rotate(-35 16 16)" fill="currentColor" fillOpacity=".2" />
      <path d="M12.6 11.2l6.8 9.6" />
    </>
  ),
  alimentazione: (
    <>
      <path d="M6 26C6 14 14 6 26 6c0 12-8 20-20 20z" fill="currentColor" fillOpacity=".2" />
      <path d="M6 26L18 14" />
    </>
  ),
  intestino: (
    <>
      <path d="M9 6c-3 0-4 3-4 5s2 4 5 4h12c3 0 5 2 5 4.5S25 24 22 24H12c-2 0-3 1-3 2.5" />
      <circle cx="12" cy="10.5" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="16.5" cy="10.5" r="1.1" fill="currentColor" stroke="none" />
      <circle cx="20" cy="19.5" r="1.1" fill="currentColor" stroke="none" />
    </>
  ),
  esami: (
    <>
      <path d="M9.2 19h13.6l2.7 5a3 3 0 0 1-2.6 4.5H9.1A3 3 0 0 1 6.5 24z" fill="currentColor" fillOpacity=".22" stroke="none" />
      <path d="M12 4h8M13 4v8L6.5 24a3 3 0 0 0 2.6 4.5h13.8a3 3 0 0 0 2.6-4.5L19 12V4" />
      <path d="M9.5 19h13" />
    </>
  ),
  visita: (
    <>
      <path d="M8 4h11l6 6v18H8z" fill="currentColor" fillOpacity=".16" />
      <path d="M19 4v6h6M12 16h9M12 21h6" />
    </>
  ),
};

function Icona({ tema }: { tema: GuidaTema | "guida" }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true" focusable="false" className="gp-svg">
      {ICONE[tema]}
    </svg>
  );
}

/**
 * `esempio`: la guida di esempio della pagina Lettura referti (valori inventati, senza i rimandi interni al report e senza
 * la frase d'apertura, che la pagina dice già; su telefono anche senza il titolo, che è quello della sezione). `apribile`: su telefono la guida è una scheda che si apre
 * (guida-apribile.tsx); vale nel report e, per tenere corta la pagina, anche per l'esempio di Lettura referti.
 */
export function GuidaPersonaleView({ guida, esempio = false, apribile = !esempio }: { guida: GuidaPersonale; esempio?: boolean; apribile?: boolean }) {
  // Nell'esempio fuori dal report non c'è il resto del report: via i rimandi interni alla pagina.
  const gruppi = guida.gruppi
    .map((g) => ({
      ...g,
      righe: g.righe.filter((r) => !esempio || !r.href.startsWith("#")),
    }))
    .filter((g) => g.righe.length);
  if (!gruppi.length) return null;
  return (
    <section
      id={esempio ? undefined : "guida-personale"}
      className={clsx("gp", esempio && "gp-esempio")}
      aria-labelledby={esempio ? "gp-titolo-esempio" : "gp-titolo"}
      data-testid="guida-personale"
    >
      <div className="gp-h">
        <span className="gp-ico gp-k-guida">
          <Icona tema="guida" />
        </span>
        <div className="min-w-0">
          <p className="gp-kicker">
            Dai tuoi esami
            {esempio ? <span className="gp-chip">Esempio</span> : <span className="gp-chip">Inclusa nel report</span>}
          </p>
          <h2 id={esempio ? "gp-titolo-esempio" : "gp-titolo"} className="gp-title">
            La tua guida personale
          </h2>
          {esempio ? null : (
            <p className="gp-lead">Le letture che riguardano gli esami di questo referto, in un posto solo. Per preparare il tuo piano insieme al medico o al farmacista.</p>
          )}
        </div>
      </div>
      {apribile ? (
        <GuidaApribile
          letture={gruppi.reduce((n, g) => n + g.righe.length, 0)}
          esempio={esempio}
          sommario={
            <ul className="gp-sommario" aria-label={esempio ? "I temi della guida di esempio" : "I temi della tua guida"}>
              {gruppi.map((g) => (
                <li key={g.tema} className={`gp-k-${g.tema}`}>
                  <span className="gp-si">
                    <Icona tema={g.tema} />
                  </span>
                  {g.titolo}
                </li>
              ))}
            </ul>
          }
        >
          {corpo(gruppi)}
          {esempio ? NOTA_ESEMPIO : NOTA}
        </GuidaApribile>
      ) : (
        <>
          {corpo(gruppi)}
          {esempio ? NOTA_ESEMPIO : NOTA}
        </>
      )}
    </section>
  );
}

const NOTA = (
  <p className="gp-note">
    Informazioni generali, scelte in base al nome degli esami e a dove cade il numero rispetto all’intervallo stampato: non dicono che cosa fare. Prima di cominciare un integratore
    o una dieta, parlane con il medico o con il farmacista.
  </p>
);

/** Nell'esempio la nota dice anche che i valori sono inventati; sta dentro la scheda, così su telefono si legge aprendola. */
const NOTA_ESEMPIO = (
  <p className="gp-note">
    Esempio con valori inventati. Le letture sono scelte in base al nome degli esami e a dove cade il numero rispetto all’intervallo stampato: la guida non dice che cosa fare né
    che cosa prendere, lo decidi con il medico o con il farmacista.
  </p>
);

function corpo(gruppi: GuidaPersonale["gruppi"]) {
  return (
    <div className="gp-gruppi">
      {gruppi.map((g) => (
        <div key={g.tema} className={`gp-g gp-k-${g.tema}`}>
          <h3 className="gp-g-t">
            <span className="gp-wi">
              <Icona tema={g.tema} />
            </span>
            {g.titolo}
          </h3>
          <ul className="gp-rows">
            {g.righe.map((r) => {
              const body = (
                <>
                  <span className="min-w-0">
                    <b>{r.titolo}</b>
                    <small>{r.motivo}</small>
                  </span>
                  <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false" className="gp-go">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </>
              );
              return (
                <li key={r.href + r.titolo}>
                  {r.href.startsWith("#") ? (
                    <a href={r.href} className={clsx("gp-row", r.fuori && "is-out")}>
                      {body}
                    </a>
                  ) : (
                    <Link href={r.href} className={clsx("gp-row", r.fuori && "is-out")}>
                      {body}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </div>
  );
}
