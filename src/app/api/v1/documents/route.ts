import { CapabilityDisabledError, requireCapability } from "@/lib/feature-flags";
import { capabilityError, json } from "@/lib/api";

/**
 * Upload di referti reali. Fail-closed: il gate è verificato PRIMA di leggere il body,
 * così nessun contenuto sanitario viene mai ricevuto finché i prerequisiti non sono soddisfatti.
 * Il caricamento reale vive in /api/v1/area/documents/upload (sessione, consenso, firma file, cifratura).
 */
export async function POST() {
  try {
    requireCapability("realUploads");
  } catch (e) {
    if (e instanceof CapabilityDisabledError) return capabilityError(e);
    throw e;
  }
  return json({ error: "moved", message: "Usa /api/v1/area/documents/upload (richiede l'accesso)." }, { status: 410 });
}
