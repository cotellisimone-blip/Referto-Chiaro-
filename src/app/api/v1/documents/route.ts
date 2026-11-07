import { CapabilityDisabledError, requireCapability } from "@/lib/feature-flags";
import { capabilityError, json } from "@/lib/api";

/**
 * Upload di referti reali. Fail-closed: il gate è verificato PRIMA di leggere il body,
 * così nessun contenuto sanitario viene mai ricevuto finché i prerequisiti non sono soddisfatti.
 * La pipeline completa (firma file, antivirus, storage cifrato) arriva nella fase 4.
 */
export async function POST() {
  try {
    requireCapability("realUploads");
  } catch (e) {
    if (e instanceof CapabilityDisabledError) return capabilityError(e);
    throw e;
  }
  return json({ error: "not-implemented", message: "Pipeline di upload non ancora disponibile." }, { status: 501 });
}
