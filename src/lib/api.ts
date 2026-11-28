import { randomUUID } from "node:crypto";
import { CapabilityDisabledError } from "./feature-flags";

/** Risposte JSON con correlation ID e senza cache. Mai dati sanitari nei log. */
export function json(data: unknown, init: { status?: number; headers?: Record<string, string> } = {}) {
  return Response.json(data, {
    status: init.status ?? 200,
    headers: { "Cache-Control": "no-store", "X-Correlation-Id": randomUUID(), ...init.headers },
  });
}

export function capabilityError(e: CapabilityDisabledError) {
  return json(
    { error: "capability-disabled", feature: e.feature, reason: e.reason, message: "Questo servizio non è ancora attivo." },
    { status: 403 },
  );
}
