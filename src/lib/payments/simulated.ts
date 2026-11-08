import type { PaymentProvider } from "./types";

/** Pagamento simulato: nessun fornitore esterno, nessun addebito. Il "checkout" è una pagina interna. */
export const simulatedProvider: PaymentProvider = {
  kind: "simulated",
  async createCheckout(order) {
    return { checkoutUrl: `/area-personale/ordini/${order.id}`, providerRef: `sim_${order.id}` };
  },
};
