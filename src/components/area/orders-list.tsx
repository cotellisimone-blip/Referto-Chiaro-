"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api, formatDateTime, formatEuro } from "./api";
import { StatusChip } from "./status-chip";

interface Order {
  id: string;
  service: "essenziale" | "completo" | "secondo-parere" | "videoconsulto";
  amountCents: number;
  status: string;
  provider: string;
  createdAt: string;
}

export const SERVICE_NAME: Record<Order["service"], string> = { essenziale: "Capisci il tuo referto", completo: "Capisci più referti", "secondo-parere": "Secondo parere specialistico", videoconsulto: "Videoconsulto con medico generalista" };

export function OrdersList() {
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api<{ orders: Order[] }>("/api/v1/area/orders")
      .then((r) => setOrders(r.orders))
      .catch((e) => setError(e instanceof Error ? e.message : "Errore imprevisto."));
  }, []);

  return (
    <div className="max-w-3xl">
      <h1 className="area-title">Pagamenti</h1>
      <p className="area-lead">Lo storico dei tuoi acquisti. In questa versione dimostrativa i pagamenti sono simulati e non viene addebitato nulla.</p>
      {error ? (
        <p role="alert" className="field-error mt-6">
          {error}
        </p>
      ) : null}
      {!orders && !error ? <div className="mt-8 h-40 animate-pulse rounded-2xl bg-mist" aria-busy="true" /> : null}
      {orders && orders.length === 0 ? <p className="mt-8 rounded-[var(--radius-lg)] border border-dashed border-muted/40 bg-paper p-6 text-[1.0625rem] text-ink-soft">Non hai ancora ordini.</p> : null}
      {orders && orders.length > 0 ? (
        <ul className="mt-8 space-y-3" aria-label="Elenco ordini">
          {orders.map((o) => (
            <li key={o.id} className="card flex flex-wrap items-center justify-between gap-x-4 gap-y-3 p-5 sm:p-6">
              <div className="min-w-0">
                <p className="area-h3 text-xl">Servizio {SERVICE_NAME[o.service]}</p>
                <p className="meta mt-1">
                  {formatDateTime(o.createdAt)} · <span className="tabular">{formatEuro(o.amountCents)}</span>
                  {o.provider === "simulated" ? " · pagamento simulato" : ""}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <StatusChip status={o.status} kind="order" />
                <Link href={`/area-personale/ordini/${o.id}`} className="btn btn-secondary btn-sm">
                  Dettagli<span className="sr-only"> dell&apos;ordine {SERVICE_NAME[o.service]} del {formatDateTime(o.createdAt)}</span>
                </Link>
              </div>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
