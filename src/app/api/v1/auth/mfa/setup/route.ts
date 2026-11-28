import { requireUser } from "@/lib/auth/guard";
import { beginMfaSetup } from "@/lib/auth/mfa";
import { readFlags } from "@/lib/feature-flags";
import { json } from "@/lib/api";
import { totpCode } from "@/lib/auth/totp";

/** Avvia la configurazione della 2FA: restituisce il segreto da inserire nell'app di autenticazione. */
export async function POST() {
  const g = await requireUser();
  if ("response" in g) return g.response;
  if (g.user.role === "user") return json({ error: "forbidden", message: "La 2FA è prevista per medici e amministratori." }, { status: 403 });
  try {
    const s = await beginMfaSetup(g.user.id, g.user.email);
    // Solo per gli account dimostrativi in demo: il codice corrente, per provare il flusso senza un'app.
    const demoCode = readFlags().demoMode && g.user.isDemo ? totpCode(s.secret) : undefined;
    return json({ secret: s.secret, uri: s.uri, demoCode });
  } catch (e) {
    if (e instanceof Error && e.message === "mfa-already-enabled") return json({ error: "mfa-already-enabled", message: "La 2FA è già attiva: inserisci il codice." }, { status: 409 });
    throw e;
  }
}
