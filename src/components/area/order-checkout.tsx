"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { ArrowLeft, CheckCircle2, Loader2, RotateCcw } from "lucide-react";
import { OrdineProvaAvvisami } from "@/components/site/prova-avvisami";
import { api, ApiError, formatDateTime, formatEuro } from "./api";
import { StatusChip } from "./status-chip";
import { SERVICE_NAME } from "./orders-list";

interface Order {
  id: string;
  service: "essenziale" | "completo" | "secondo-parere" | "videoconsulto";
  documentId: string | null;
  refId: string | null;
  amountCents: number;
  status: "pending" | "paid" | "failed" | "cancelled" | "refunded";
  provider: "simulated" | "stripe-test" | "stripe-live";
  createdAt: string;
}

function backHref(o: Pick<Order, "service" | "refId" | "documentId">): string {
  if (o.refId && o.service === "secondo-parere") return `/area-personale/secondo-parere/${o.refId}`;
  if (o.refId && o.service === "videoconsulto") return `/area-personale/appuntamenti/${o.refId}`;
  return o.documentId ? `/area-personale/documenti/${o.documentId}` : "/area-personale/ordini";
}

/** Ciclo 5, fase 2: per «Capisci» dopo il pagamento si va dritti al report, senza una pagina di passaggio. */
function reportHref(o: Pick<Order, "service" | "documentId" | "provider">): string | null {
  if ((o.service !== "essenziale" && o.service !== "completo") || !o.documentId) return null;
  return `/area-personale/documenti/${o.documentId}?pagato=1${o.provider === "simulated" ? "&prova=1" : ""}`;
}

const POLL_MS = 1500;
const POLL_MAX = 40;

export function OrderCheckout({ orderId }: { orderId: string }) {
  const router = useRouter();
  const esito = useSearchParams().get("esito");
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [busy, setBusy] = useState(false);
  const [polling, setPolling] = useState(false);

  const load = useCallback(async () => {
    try {
      const r = await api<{ order: Order }>(`/api/v1/area/orders/${orderId}`);
      setOrder(r.order);
      return r.order;
    } catch (e) {
      if (e instanceof ApiError && e.status === 404) setNotFound(true);
      else setError(e instanceof Error ? e.message : "Errore imprevisto.");
      return null;
    }
  }, [orderId]);

  // Caricamento iniziale. Con Stripe l'esito lo scrive il webhook: si ricontrolla finché l'ordine non cambia stato.
  useEffect(() => {
    let alive = true;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const tick = async (n: number) => {
      const o = await load();
      if (!alive || !o) return;
      // Ritorno dal fornitore di pagamento con esito positivo: appena l'ordine risulta pagato si apre il report.
      const direct = o.status === "paid" && esito === "ok" ? reportHref(o) : null;
      if (direct) {
        router.replace(direct);
        return;
      }
      if (o.provider !== "simulated" && o.status === "pending" && esito === "ok" && n < POLL_MAX) {
        setPolling(true);
        timer = setTimeout(() => void tick(n + 1), POLL_MS);
      } else setPolling(false);
    };
    void tick(0);
    return () => {
      alive = false;
      if (timer) clearTimeout(timer);
    };
  }, [load, esito, router]);

  async function simulate(outcome: "pagato" | "fallito" | "annullato") {
    setBusy(true);
    setError(null);
    try {
      const r = await api<{ order: Order }>(`/api/v1/area/orders/${orderId}/simula`, { method: "POST", body: { esito: outcome } });
      const direct = outcome === "pagato" && r.order.status === "paid" ? reportHref(r.order) : null;
      if (direct) {
        router.push(direct);
        return; // il comando resta occupato finché non si apre il report
      }
      setOrder(r.order);
      if (outcome === "annullato" && order) router.push(backHref(order));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Errore imprevisto.");
    } finally {
      setBusy(false);
    }
  }

  async function retry() {
    if (!order) return;
    if (order.refId) {
      router.push(backHref(order));
      return;
    }
    if (!order.documentId) return;
    setBusy(true);
    setError(null);
    try {
      const r = await api<{ id: string; checkoutUrl: string }>("/api/v1/area/orders", { method: "POST", body: { service: order.service, documentId: order.documentId } });
      if (r.checkoutUrl.startsWith("/")) router.push(r.checkoutUrl);
      else window.location.assign(r.checkoutUrl);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Errore imprevisto.");
      setBusy(false);
    }
  }

  const waiting = polling && order?.status === "pending";

  if (notFound) {
    return (
      <div role="alert" className="max-w-xl">
        <h1 className="area-title">Ordine non trovato.</h1>
        <p className="area-lead">Questo ordine non esiste o non è tuo.</p>
        <Link href="/area-personale/ordini" className="btn btn-secondary mt-5">
          Vai ai tuoi ordini
        </Link>
      </div>
    );
  }
  if (error && !order) return <p role="alert" className="text-danger">{error}</p>;
  if (!order) return <div className="h-64 animate-pulse rounded-2xl bg-mist" aria-busy="true" />;

  const back = backHref(order);
  const backLabel = order.service === "secondo-parere" ? "Vai alla richiesta" : order.service === "videoconsulto" ? "Vai all'appuntamento" : "Torna al referto";
  const paidText =
    order.service === "secondo-parere"
      ? "La richiesta è stata inviata al medico: trovi lo stato e il parere nella pagina della richiesta."
      : order.service === "videoconsulto"
        ? "La richiesta è stata inviata al medico: riceverai la conferma di data e collegamento nella pagina dell'appuntamento."
        : "Stiamo preparando il tuo report: lo trovi nella pagina del referto.";

  return (
    <div className="max-w-2xl">
      <Link href="/area-personale/ordini" className="back-link">
        <ArrowLeft aria-hidden /> Tutti gli ordini
      </Link>
      <h1 className="area-title mt-3">Il tuo ordine.</h1>
      {error ? (
        <p role="alert" className="field-error mt-4">
          {error}
        </p>
      ) : null}

      {order.status === "pending" && order.provider === "simulated" ? (
        <section aria-labelledby="sim-titolo" className="mt-6 rounded-[var(--radius-lg)] border border-warn/40 bg-cream p-5 sm:p-7">
          <h2 id="sim-titolo" className="area-h2">
            Pagamento simulato — nessun addebito
          </h2>
          <p className="mt-2 text-[1.1875rem] font-extrabold leading-snug text-ink">
            {SERVICE_NAME[order.service]} · <span className="tabular">{formatEuro(order.amountCents)}</span>
          </p>
          <p className="mt-1.5 text-[1.0625rem] text-ink">È una dimostrazione: non serve una carta e non viene addebitato nulla.{reportHref(order) ? " Dopo la conferma si apre il report." : ""}</p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <button type="button" className="btn btn-primary btn-lg max-sm:px-4" disabled={busy} onClick={() => simulate("pagato")}>
              {busy ? <Loader2 aria-hidden className="h-5 w-5 animate-spin" /> : null}
              Conferma il pagamento di prova
            </button>
            <button type="button" className="btn btn-secondary" disabled={busy} onClick={() => simulate("fallito")}>
              Simula un pagamento fallito
            </button>
            <button type="button" className="btn btn-ghost" disabled={busy} onClick={() => simulate("annullato")}>
              Annulla
            </button>
          </div>
        </section>
      ) : null}

      {order.status === "pending" && order.provider !== "simulated" ? (
        <section className="mt-6 rounded-[var(--radius-lg)] border border-line bg-paper p-5 text-[1.0625rem] text-ink-soft sm:p-7" role="status">
          {waiting ? (
            <p className="flex items-center gap-2.5 font-semibold text-ink">
              <Loader2 aria-hidden className="h-5 w-5 shrink-0 animate-spin text-teal" /> Stiamo confermando il pagamento…
            </p>
          ) : esito === "annullato" ? (
            <p>Hai annullato il pagamento: nessun addebito. Puoi tornare al referto e riprovare quando vuoi.</p>
          ) : (
            <p>Il pagamento non risulta ancora confermato. Se hai completato il pagamento, ricarica questa pagina tra qualche istante.</p>
          )}
          {order.provider === "stripe-test" ? <p className="meta mt-2">Modalità di prova del fornitore: nessun addebito reale.</p> : null}
          {!waiting ? (
            <Link href={back} className="btn btn-secondary mt-4">
              {backLabel}
            </Link>
          ) : null}
        </section>
      ) : null}

      {order.status === "paid" ? (
        <section className="form-card form-card-accent mt-6" role="status">
          <p className="form-card-title flex items-center gap-2.5">
            <CheckCircle2 aria-hidden className="h-7 w-7 shrink-0 text-sage-deep" /> Pagamento registrato
          </p>
          <p className="form-card-text">{paidText}{order.provider === "simulated" ? " (Pagamento simulato: nessun addebito.)" : ""}</p>
          <Link href={back} className="btn btn-primary btn-lg mt-5 w-full sm:w-auto">
            {backLabel}
          </Link>
        </section>
      ) : null}
      {order.status === "paid" ? <OrdineProvaAvvisami orderService={order.service} /> : null}

      {order.status === "failed" ? (
        <section className="mt-6 rounded-[var(--radius-lg)] border border-danger/30 bg-paper p-5 sm:p-7" role="alert">
          <p className="text-xl font-extrabold text-danger">Il pagamento non è andato a buon fine.</p>
          <p className="mt-2 text-[1.0625rem] text-ink-soft">Non è stato addebitato nulla. Puoi riprovare con un nuovo ordine.</p>
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {order.documentId || order.refId ? (
              <button type="button" className="btn btn-primary" onClick={retry} disabled={busy}>
                <RotateCcw aria-hidden className="h-5 w-5" /> Riprova
              </button>
            ) : null}
            <Link href={back} className="btn btn-secondary">
              {backLabel}
            </Link>
          </div>
        </section>
      ) : null}

      {order.status === "cancelled" || order.status === "refunded" ? (
        <section className="mt-6 rounded-[var(--radius-lg)] border border-line bg-paper p-5 text-[1.0625rem] text-ink-soft sm:p-7" role="status">
          <p>{order.status === "cancelled" ? "Ordine annullato: nessun addebito." : "Ordine rimborsato."}</p>
          <Link href={back} className="btn btn-secondary mt-4">
            {backLabel}
          </Link>
        </section>
      ) : null}

      <h2 className="sr-only">Dettagli dell&apos;ordine</h2>
      <dl className="kv card mt-6 p-5 sm:grid-cols-2 sm:p-7">
        <div>
          <dt>Servizio</dt>
          <dd className="text-[1.375rem] font-extrabold leading-tight tracking-tight">{SERVICE_NAME[order.service]}</dd>
        </div>
        <div>
          <dt>Importo</dt>
          <dd className="tabular text-[1.375rem] font-extrabold leading-tight tracking-tight">{formatEuro(order.amountCents)}</dd>
        </div>
        <div>
          <dt>Stato</dt>
          <dd className="mt-1.5">
            <StatusChip status={order.status} kind="order" />
          </dd>
        </div>
        <div>
          <dt>Creato il</dt>
          <dd>{formatDateTime(order.createdAt)}</dd>
        </div>
      </dl>

    </div>
  );
}
