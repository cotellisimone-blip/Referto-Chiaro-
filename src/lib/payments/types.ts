export type ProviderKind = "simulated" | "stripe-test" | "stripe-live";

export interface CheckoutOrder {
  id: string;
  service: "essenziale" | "completo" | "secondo-parere";
  amountCents: number;
  currency: string;
}

export interface PaymentProvider {
  kind: ProviderKind;
  createCheckout(order: CheckoutOrder, urls: { successUrl: string; cancelUrl: string }): Promise<{ checkoutUrl: string; providerRef: string }>;
}
