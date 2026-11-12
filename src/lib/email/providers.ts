import type { EmailMessage, EmailProvider } from "./types";

type FetchLike = typeof fetch;

/** Resend (https://resend.com): API REST, server UE disponibili. */
export function resendProvider(apiKey: string, f: FetchLike = fetch): EmailProvider {
  return {
    id: "resend",
    async send(msg, from) {
      const r = await f("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({ from, to: [msg.to], subject: msg.subject, text: msg.text, html: msg.html, tags: [{ name: "tipo", value: msg.tag }] }),
      });
      if (!r.ok) throw new Error(`Resend ha risposto ${r.status}`);
      const body = (await r.json()) as { id?: string };
      return { id: body.id ?? "resend" };
    },
  };
}

/** Postmark (https://postmarkapp.com): stream transazionale «outbound». */
export function postmarkProvider(serverToken: string, f: FetchLike = fetch): EmailProvider {
  return {
    id: "postmark",
    async send(msg, from) {
      const r = await f("https://api.postmarkapp.com/email", {
        method: "POST",
        headers: { "X-Postmark-Server-Token": serverToken, "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ From: from, To: msg.to, Subject: msg.subject, TextBody: msg.text, HtmlBody: msg.html, Tag: msg.tag, MessageStream: "outbound", TrackOpens: false, TrackLinks: "None" }),
      });
      if (!r.ok) throw new Error(`Postmark ha risposto ${r.status}`);
      const body = (await r.json()) as { MessageID?: string };
      return { id: body.MessageID ?? "postmark" };
    },
  };
}

/**
 * Casella di sviluppo: nessun invio reale. I messaggi restano in memoria (per i test) e
 * nel log del server compare solo destinatario mascherato e tipo, mai il link.
 */
const G = globalThis as unknown as { __rcOutbox?: EmailMessage[] };
export function devOutbox(): EmailMessage[] {
  if (!G.__rcOutbox) G.__rcOutbox = [];
  return G.__rcOutbox;
}

export const devOutboxProvider: EmailProvider = {
  id: "dev-outbox",
  async send(msg) {
    const box = devOutbox();
    box.push(msg);
    if (box.length > 50) box.shift();
    console.info(`[email:dev] ${msg.tag} → ${maskEmail(msg.to)} (non inviata: nessun fornitore configurato)`);
    return { id: `dev-${box.length}` };
  },
};

export function maskEmail(e: string): string {
  const [u, d] = e.split("@");
  return `${(u ?? "").slice(0, 2)}***@${d ?? ""}`;
}
