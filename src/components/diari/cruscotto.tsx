"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { api } from "@/components/area/api";
import { Ic } from "@/components/home-b/simboli";
import { SELF_ID } from "@/domain/famiglia/persone";
import { DIARI } from "@/domain/diari/catalogo";
import { dayOf, giornoBreve, nowAt, type VoceDiario } from "@/domain/diari/voci";
import { DiariSimboli } from "./disegni";
import "./diari.css";

/**
 * I diari nella pagina personale del paziente (22/11/2026): sei riquadri piccoli, uno per diario, con l'ultima voce
 * scritta. Un tocco porta al diario, dove si scrive la misura.
 */
export function DiariCruscotto() {
  const [voci, setVoci] = useState<VoceDiario[] | null>(null);
  useEffect(() => {
    let alive = true;
    api<{ voci: VoceDiario[] }>(`/api/v1/area/diari?persona=${encodeURIComponent(SELF_ID)}`)
      .then((r) => alive && setVoci(r.voci))
      .catch(() => alive && setVoci([]));
    return () => {
      alive = false;
    };
  }, []);
  const oggi = nowAt().slice(0, 10);
  const ultima = (slug: string) => {
    const xs = (voci ?? []).filter((v) => v.diario === slug);
    const last = xs[xs.length - 1];
    if (!last) return "Comincia";
    const d = dayOf(last.at);
    return `Ultima voce: ${d === oggi ? "oggi" : giornoBreve(d)}`;
  };
  return (
    <section aria-labelledby="diari-titolo" className="mt-10" data-testid="diari-cruscotto">
      <DiariSimboli />
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 id="diari-titolo" className="area-h2">
          I tuoi diari della salute
        </h2>
        <Link href="/area-personale/diari" className="link inline-flex min-h-11 items-center text-[1.0625rem] font-semibold">
          Tutti i diari
        </Link>
      </div>
      <ul className="dra-mini mt-4">
        {DIARI.map((d) => (
          <li key={d.slug} className="min-w-0">
            <Link href={`/area-personale/diari/${d.slug}`} className="dra-mini-item">
              <span className="dra-card-ico" aria-hidden="true">
                <Ic id={d.icona} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[1.0625rem] font-bold text-ink">{d.nome}</span>
                <span className="block truncate text-[0.9375rem] text-muted">{voci ? ultima(d.slug) : "…"}</span>
              </span>
              <ArrowRight aria-hidden className="h-5 w-5 shrink-0 text-teal" />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
