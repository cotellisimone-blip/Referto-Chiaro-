import { requireCapability, readFlags, type Flags } from "@/lib/feature-flags";
import { simulatedProvider } from "./simulated";
import { stripeProvider } from "./stripe";
import type { PaymentProvider } from "./types";

export type { PaymentProvider, ProviderKind, CheckoutOrder } from "./types";

export class PaymentsMisconfiguredError extends Error {
  constructor(message: string) {
    super(message);
  }
}

type Env = Record<string, string | undefined>;

/**
 * Sceglie il fornitore dalla chiave configurata. Fail-closed: mai un ripiego silenzioso sul simulato
 * quando una chiave c'è ma non è utilizzabile.
 */
export function getPaymentProvider(env: Env = process.env, flags: Flags = readFlags(env)): PaymentProvider {
  const key = env.STRIPE_SECRET_KEY?.trim();
  if (!key) return simulatedProvider;
  if (key.startsWith("sk_test_")) return stripeProvider(key, "stripe-test");
  if (key.startsWith("sk_live_")) {
    requireCapability("livePayments", flags); // lancia CapabilityDisabledError
    return stripeProvider(key, "stripe-live");
  }
  throw new PaymentsMisconfiguredError("Formato della chiave dei pagamenti non riconosciuto.");
}
