export interface EmailMessage {
  to: string;
  subject: string;
  text: string;
  html: string;
  /** Etichetta interna per i log (mai il contenuto). */
  tag: "magic-link" | "order-paid" | "report-ready" | "opinion-ready" | "reminder";
}

export interface EmailProvider {
  readonly id: "resend" | "postmark" | "dev-outbox";
  send(msg: EmailMessage, from: string): Promise<{ id: string }>;
}

export class EmailNotConfiguredError extends Error {
  constructor(message: string) {
    super(message);
  }
}
