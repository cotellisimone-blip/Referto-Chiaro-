"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api, formatDateTime, formatEuro } from "./api";
import { StatusChip } from "./status-chip";

interface Order {
  id: string;
  service: "essenziale" | "completo" | "secondo-parere";
  amountCents: number;
  status: string;
  provider: string;
  createdAt: string;
}

export const SERVICE_NAME: Record<Order["service"], string> = { essenziale: "Essenziale", completo: "Completo", "secondo-parere": "Secondo parere" };

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
      <h1 className="display text-[2rem] sm:text-[2.5rem]">Ordini</h1>
      <p className="mt-3 text-muted">Lo storico dei tuoi acquisti. In questa versione dimostrativa i pagamenti sono simulati e non viene addebitato nulla.</p>
      {error ? (
        <p role="alert" className="mt-6 text-danger">
          {error}
        </p>
      ) : null}
      {!orders && !error ? <div className="mt-8 h-40 animate-pulse rounded-2xl bg-mist" aria-busy="true" /> : null}
      {orders && orders.length === 0 ? <p className="mt-8 rounded-2xl border border-line bg-paper p-6 text-muted">Non hai ancora ordini.</p> : null}
      {orders && orders.length > 0 ? (
        <ul className="mt-8 space-y-3" aria-label="Elenco ordini">
          {orders.map((o) => (
            <li key={o.id} className="card flex flex-wrap items-center justify-between gap-3 p-4 sm:p-5">
              <div className="min-w-0">
                <p className="font-serif text-xl">Servizio {SERVICE_NAME[o.service]}</p>
                <p className="mt-1 text-sm text-muted">
                  {formatDateTime(o.createdAt)} · <span className="tabular">{formatEuro(o.amountCents)}</span>
                  {o.provider === "simulated" ? " · pagamento simulato" : ""}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <StatusChip status={o.status} kind="order" />
                <Link href={`/area/ordini/${o.id}`} className="inline-flex min-h-11 items-center rounded-full px-3 text-sm font-semibold text-teal hover:bg-mist">
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
