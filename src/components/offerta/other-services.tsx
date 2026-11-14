import Link from "next/link";
import { ArrowRight, FileSearch, Home, Stethoscope, Video, type LucideIcon } from "lucide-react";
import { coreService, priceDisplay, publicPricesEnabled } from "@/domain/offerta";
import { PRESTAZIONI, prestazionePrice } from "@/domain/prestazioni/listino";
import { mediciEnabled } from "@/lib/medici";
import { PrestoMedico } from "@/components/site/presto-medico";

export type ServiceKey = "capisci" | "domicilio" | "parla-con-un-medico" | "secondo-parere";

const ORDER: ServiceKey[] = ["capisci", "domicilio", "parla-con-un-medico", "secondo-parere"];

/** Ogni servizio in una riga: da quale bisogno si parte. Nomi, indirizzi e prezzi restano quelli del listino. */
function item(key: ServiceKey): { href: string; name: string; line: string; lead: string | null; amount: string; tone: string; icon: LucideIcon } {
  if (key === "domicilio") {
    const d = PRESTAZIONI.domicilio;
    return { href: d.href, name: d.short, line: "Ti serve una visita non urgente, per te o per un familiare, senza uscire di casa.", lead: null, amount: prestazionePrice("domicilio"), tone: "medico", icon: Home };
  }
  const s = coreService(key);
  const p = priceDisplay(key);
  const icon = key === "capisci" ? FileSearch : key === "parla-con-un-medico" ? Video : Stethoscope;
  return { href: s.href, name: s.name, line: s.forWhom, lead: p.lead, amount: p.amount, tone: s.tone, icon };
}

/**
 * «Se ti serve altro»: gli altri servizi, uno per riga su telefono (tessera, nome, prezzo) e in schede da tablet in su.
 * Ogni scheda è un link intero. Compare in fondo alle pagine dei servizi, senza la pagina in cui ci si trova.
 */
export function OtherServices({ exclude, titleId = "altri-titolo", title = "Se ti serve altro" }: { exclude: ServiceKey; titleId?: string; title?: string }) {
  const prices = publicPricesEnabled();
  // 14/11/2026: senza medici (src/lib/medici.ts) non ci sono altri servizi da proporre: resta il blocco discreto.
  if (!mediciEnabled()) {
    return (
      <section aria-label="Presto anche con un medico" className="section">
        <div className="container-rc">
          <PrestoMedico />
        </div>
      </section>
    );
  }
  const keys = ORDER.filter((k) => k !== exclude);
  return (
    <section aria-labelledby={titleId} className="section">
      <div className="container-rc">
        <h2 id={titleId} className="display-md">
          {title}
        </h2>
        <ul className="other-grid mt-5 sm:mt-8" style={{ "--others": keys.length } as React.CSSProperties}>
          {keys.map((k) => {
            const it = item(k);
            const Icon = it.icon;
            return (
              <li key={k} className={`tone-${it.tone}`}>
                <Link href={it.href} className="other-card">
                  <span aria-hidden className="tile-ico tile-ico-sm tile-ico-tone">
                    <Icon />
                  </span>
                  <span className="min-w-0">
                    <span className="other-name">{it.name}</span>
                    <span className="other-line">{it.line}</span>
                    {prices ? (
                      <span className="other-price">
                        {it.lead ? `${it.lead} ` : ""}
                        <strong>{it.amount}</strong>
                      </span>
                    ) : null}
                  </span>
                  <span className="other-go">
                    <span>Scopri</span>
                    <ArrowRight aria-hidden className="h-5 w-5" />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
