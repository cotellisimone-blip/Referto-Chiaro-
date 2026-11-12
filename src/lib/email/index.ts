import { postmarkProvider, resendProvider, devOutboxProvider } from "./providers";
import { EmailNotConfiguredError, type EmailMessage, type EmailProvider } from "./types";
import { readFlags } from "@/lib/feature-flags";

export { devOutbox, maskEmail } from "./providers";
export * from "./templates";
export { EmailNotConfiguredError, type EmailMessage } from "./types";

type Env = Record<string, string | undefined>;

/**
 * Sceglie il fornitore email.
 * - EMAIL_PROVIDER=resend + RESEND_API_KEY, oppure EMAIL_PROVIDER=postmark + POSTMARK_SERVER_TOKEN.
 * - Senza fornitore: casella di sviluppo (nessun invio) SOLO in demo o fuori produzione.
 *   In produzione senza fornitore lancia: meglio un errore chiaro che link persi in silenzio.
 */
export function getEmailProvider(env: Env = process.env): EmailProvider {
  const kind = env.EMAIL_PROVIDER?.trim().toLowerCase();
  if (kind === "resend") {
    const key = env.RESEND_API_KEY?.trim();
    if (!key) throw new EmailNotConfiguredError("EMAIL_PROVIDER=resend ma RESEND_API_KEY manca.");
    return resendProvider(key);
  }
  if (kind === "postmark") {
    const key = env.POSTMARK_SERVER_TOKEN?.trim();
    if (!key) throw new EmailNotConfiguredError("EMAIL_PROVIDER=postmark ma POSTMARK_SERVER_TOKEN manca.");
    return postmarkProvider(key);
  }
  if (kind && kind !== "dev") throw new EmailNotConfiguredError(`EMAIL_PROVIDER «${kind}» non riconosciuto.`);
  const flags = readFlags(env);
  if (flags.demoMode || env.NODE_ENV !== "production") return devOutboxProvider;
  throw new EmailNotConfiguredError("Nessun fornitore email configurato in produzione.");
}

export function emailFrom(env: Env = process.env): string {
  return env.EMAIL_FROM?.trim() || "Cura Privata <no-reply@curaprivata.it>";
}

/** URL pubblico assoluto (per i link nelle email). */
export function publicUrl(pathname: string, env: Env = process.env): string {
  const base = (env.PUBLIC_BASE_URL?.trim() || "http://localhost:3000").replace(/\/+$/, "");
  return `${base}${pathname.startsWith("/") ? "" : "/"}${pathname}`;
}

/** Invio «best effort» per le notifiche: un errore email non deve mai bloccare un pagamento o un report. */
export async function sendEmail(msg: EmailMessage, env: Env = process.env): Promise<boolean> {
  try {
    await getEmailProvider(env).send(msg, emailFrom(env));
    return true;
  } catch (e) {
    console.error(`[email] invio ${msg.tag} non riuscito: ${e instanceof Error ? e.message : "errore"}`);
    return false;
  }
}
