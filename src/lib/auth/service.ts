import "server-only";
import { randomUUID } from "node:crypto";
import { audit, withSystem, withUser } from "@/db/client";
import { readFlags } from "@/lib/feature-flags";
import { getEmailProvider, emailFrom, magicLinkEmail, publicUrl, maskEmail } from "@/lib/email";
import { MAGIC_LINK_TTL_MS, hashToken, newToken, sessionTtlMs } from "./tokens";

export type Role = "user" | "physician" | "admin";

export interface User {
  id: string;
  email: string;
  displayName: string | null;
  isDemo: boolean;
  role: Role;
  /** 2FA (TOTP) attiva sull'account: obbligatoria per medici e admin. */
  mfaEnabled: boolean;
  /** La sessione corrente ha superato la verifica 2FA. */
  mfaVerified: boolean;
  createdAt: string;
}

export const CONSENT_VERSIONS = { terms: "bozza-2026-11", privacy: "bozza-2026-11", "health-data": "bozza-2026-11", "subject-declaration": "bozza-2026-11" } as const;
/** Consensi necessari per creare un account. La dichiarazione di essere l'interessato è registrata quando fornita. */
export const REQUIRED_CONSENTS: ConsentKind[] = ["terms", "privacy", "health-data"];

/** Domini riservati ai test (RFC 2606/6761): nessuna casella reale può riceverli. */
const TEST_EMAIL = /@([^@]+\.)?(invalid|test|example|localhost)$|@example\.(com|net|org)$/;
export type ConsentKind = keyof typeof CONSENT_VERSIONS;

export const DEMO_ACCOUNT_EMAIL = "demo@esempio.cura-privata.invalid";

const EMAIL = /^[^\s@]{1,64}@[^\s@]{1,255}\.[^\s@]{2,}$/;

export function normalizeEmail(raw: string): string | null {
  const e = raw.trim().toLowerCase();
  return EMAIL.test(e) && e.length <= 254 ? e : null;
}

function rowToUser(r: Record<string, unknown>): User {
  return {
    id: String(r.id),
    email: String(r.email),
    displayName: (r.display_name as string | null) ?? null,
    isDemo: Boolean(r.is_demo),
    role: (["user", "physician", "admin"].includes(String(r.role)) ? String(r.role) : "user") as Role,
    mfaEnabled: Boolean(r.mfa_enabled_at),
    mfaVerified: Boolean(r.mfa_verified_at),
    createdAt: new Date(r.created_at as string).toISOString(),
  };
}

/**
 * Richiesta di accesso con link sicuro. Crea l'utente se non esiste (registrazione).
 * In demo il link non viene inviato per email (nessun servizio di posta): viene restituito al chiamante,
 * che lo mostra sullo schermo. Fuori dalla demo serve il gate publicSignup e un adattatore email.
 */
export type MagicLinkDelivery = "on-screen" | "email" | "unavailable" | "email-failed";

export async function requestMagicLink(args: { email: string; consents: ConsentKind[] }): Promise<
  { ok: true; delivery: MagicLinkDelivery; link?: string } | { ok: false; code: "invalid-email" | "signup-closed" | "consent-required" }
> {
  const email = normalizeEmail(args.email);
  if (!email) return { ok: false, code: "invalid-email" };
  const flags = readFlags();
  // Ciclo 2, fase 1: la vetrina è online prima della conformità. Nessuno crea o apre un account personale con la
  // propria email (né con quella di un altro): si prova solo con l'account demo condiviso. Restano ammessi gli
  // indirizzi di domini riservati ai test, che non appartengono a nessuno.
  if (flags.vetrina && !TEST_EMAIL.test(email)) return { ok: false, code: "signup-closed" };
  const required = REQUIRED_CONSENTS;
  const token = newToken();
  const out = await withSystem(async (tx) => {
    // Pulizia periodica: link scaduti, sessioni scadute da oltre 30 giorni, lista d'attesa oltre 12 mesi.
    await tx.query("DELETE FROM magic_links WHERE expires_at < now() - interval '1 day'");
    await tx.query("DELETE FROM sessions WHERE expires_at < now() - interval '30 days'");
    await tx.query("DELETE FROM waitlist WHERE created_at < now() - interval '12 months'");
    await tx.query("DELETE FROM rate_limits WHERE window_start < now() - interval '1 day'");
    const existing = await tx.query("SELECT * FROM users WHERE email = $1 AND deleted_at IS NULL", [email]);
    let userId: string;
    let isNew = false;
    if (existing.rows[0]) userId = String(existing.rows[0].id);
    else {
      if (!flags.demoMode && !flags.publicSignup) return { ok: false as const, code: "signup-closed" as const };
      if (!required.every((k) => args.consents.includes(k))) return { ok: false as const, code: "consent-required" as const };
      userId = randomUUID();
      await tx.query("INSERT INTO users(id, email, is_demo) VALUES ($1, $2, $3)", [userId, email, flags.demoMode]);
      const recorded = new Set<ConsentKind>([...required, ...args.consents.filter((k) => k in CONSENT_VERSIONS)]);
      for (const k of recorded) {
        await tx.query("INSERT INTO consents(id, user_id, kind, version, granted) VALUES (gen_random_uuid(), $1, $2, $3, true)", [userId, k, CONSENT_VERSIONS[k]]);
      }
      isNew = true;
      await audit(tx, { userId, actor: "user", action: "signup" });
    }
    await tx.query("INSERT INTO magic_links(id, user_id, token_hash, purpose, expires_at) VALUES ($1, $2, $3, $4, $5)", [
      randomUUID(),
      userId,
      hashToken(token),
      isNew ? "signup" : "login",
      new Date(Date.now() + MAGIC_LINK_TTL_MS).toISOString(),
    ]);
    await audit(tx, { userId, actor: "user", action: "magic-link-requested" });
    if (!flags.demoMode) return { ok: true as const, delivery: "email" as const };
    // In demo il link si mostra a schermo solo quando nessun altro potrebbe rivendicare quell'account:
    // account appena creato, oppure indirizzo di un dominio riservato ai test. Altrimenti niente link.
    const onScreen = isNew || TEST_EMAIL.test(email) || email === DEMO_ACCOUNT_EMAIL;
    if (!onScreen) return { ok: true as const, delivery: "unavailable" as const };
    return { ok: true as const, delivery: "on-screen" as const, link: `/api/v1/auth/verifica?token=${token}` };
  });
  // Fuori dalla demo il link parte per email, dopo il commit (mai dentro la transazione).
  if (out.ok && out.delivery === "email") {
    try {
      await getEmailProvider().send(magicLinkEmail(email, publicUrl(`/api/v1/auth/verifica?token=${token}`)), emailFrom());
    } catch (e) {
      console.error(`[auth] invio link a ${maskEmail(email)} non riuscito: ${e instanceof Error ? e.message : "errore"}`);
      return { ok: true, delivery: "email-failed" };
    }
  }
  return out;
}

/** Consuma il link (monouso, scade in 15 minuti) e apre una sessione. Restituisce il token di sessione da mettere nel cookie. */
export async function consumeMagicLink(token: string): Promise<{ ok: true; sessionToken: string; user: User } | { ok: false }> {
  if (!token || token.length > 128) return { ok: false };
  return withSystem(async (tx) => {
    // Consumo atomico: due richieste simultanee con lo stesso token non possono aprire due sessioni.
    const r = await tx.query("UPDATE magic_links SET used_at = now() WHERE token_hash = $1 AND used_at IS NULL AND expires_at > now() RETURNING id, user_id", [hashToken(token)]);
    const link = r.rows[0];
    if (!link) return { ok: false as const };
    const session = await openSession(tx, String(link.user_id));
    const u = await tx.query("SELECT * FROM users WHERE id = $1 AND deleted_at IS NULL", [link.user_id]);
    if (!u.rows[0]) return { ok: false as const };
    return { ok: true as const, sessionToken: session, user: rowToUser(u.rows[0]) };
  });
}

async function openSession(tx: Parameters<Parameters<typeof withSystem>[0]>[0], userId: string): Promise<string> {
  const token = newToken();
  const role = await tx.query("SELECT role FROM users WHERE id = $1", [userId]);
  await tx.query("INSERT INTO sessions(id, user_id, token_hash, expires_at) VALUES ($1, $2, $3, $4)", [
    randomUUID(),
    userId,
    hashToken(token),
    new Date(Date.now() + sessionTtlMs(String(role.rows[0]?.role ?? "user"))).toISOString(),
  ]);
  await tx.query("UPDATE users SET last_login_at = now() WHERE id = $1", [userId]);
  await audit(tx, { userId, actor: "user", action: "login" });
  return token;
}

/** Accesso immediato all'account dimostrativo (solo in DEMO_MODE). I suoi documenti sono referti inventati. */
export async function loginDemoAccount(): Promise<{ ok: true; sessionToken: string; user: User } | { ok: false }> {
  if (!readFlags().demoMode) return { ok: false };
  return withSystem(async (tx) => {
    let u = await tx.query("SELECT * FROM users WHERE email = $1", [DEMO_ACCOUNT_EMAIL]);
    if (!u.rows[0]) {
      const id = randomUUID();
      await tx.query("INSERT INTO users(id, email, display_name, is_demo) VALUES ($1, $2, 'Account demo', true)", [id, DEMO_ACCOUNT_EMAIL]);
      for (const k of Object.keys(CONSENT_VERSIONS) as ConsentKind[]) {
        await tx.query("INSERT INTO consents(id, user_id, kind, version, granted) VALUES (gen_random_uuid(), $1, $2, $3, true)", [id, k, CONSENT_VERSIONS[k]]);
      }
      u = await tx.query("SELECT * FROM users WHERE id = $1", [id]);
    }
    const sessionToken = await openSession(tx, String(u.rows[0].id));
    return { ok: true as const, sessionToken, user: rowToUser(u.rows[0]) };
  });
}

export const DEMO_PHYSICIAN_EMAIL = "medico-demo@esempio.cura-privata.invalid";
export const DEMO_ADMIN_EMAIL = "admin-demo@esempio.cura-privata.invalid";

/**
 * Account di servizio dimostrativi (solo DEMO_MODE): un «medico» e un «admin» con 2FA.
 * Il medico dimostrativo NON è un medico reale e il suo nome lo dice.
 */
export async function loginDemoRole(role: "physician" | "admin"): Promise<{ ok: true; sessionToken: string; user: User } | { ok: false }> {
  if (!readFlags().demoMode) return { ok: false };
  const email = role === "physician" ? DEMO_PHYSICIAN_EMAIL : DEMO_ADMIN_EMAIL;
  return withSystem(async (tx) => {
    let u = await tx.query("SELECT * FROM users WHERE email = $1", [email]);
    if (!u.rows[0]) {
      const id = randomUUID();
      const name = role === "physician" ? "Medico dimostrativo (nessun medico reale)" : "Amministratore dimostrativo";
      await tx.query("INSERT INTO users(id, email, display_name, is_demo, role) VALUES ($1, $2, $3, true, $4)", [id, email, name, role]);
      for (const k of Object.keys(CONSENT_VERSIONS) as ConsentKind[]) {
        await tx.query("INSERT INTO consents(id, user_id, kind, version, granted) VALUES (gen_random_uuid(), $1, $2, $3, true)", [id, k, CONSENT_VERSIONS[k]]);
      }
      if (role === "physician") {
        await tx.query(
          "INSERT INTO physicians(id, user_id, full_name, specialty, registration_ref, status, verified_at) VALUES ($1, $2, $3, 'Medicina interna (simulazione)', 'ACCOUNT DIMOSTRATIVO', 'verified', now())",
          [randomUUID(), id, name],
        );
      }
      await audit(tx, { userId: id, actor: "system", action: "demo-service-account-created", target: role });
      u = await tx.query("SELECT * FROM users WHERE id = $1", [id]);
    }
    const sessionToken = await openSession(tx, String(u.rows[0].id));
    return { ok: true as const, sessionToken, user: rowToUser(u.rows[0]) };
  });
}

export async function getUserBySession(sessionToken: string | undefined): Promise<User | null> {
  if (!sessionToken || sessionToken.length > 128) return null;
  return withSystem(async (tx) => {
    const r = await tx.query(
      `SELECT u.*, s.id AS session_id, s.mfa_verified_at FROM sessions s JOIN users u ON u.id = s.user_id
       WHERE s.token_hash = $1 AND s.revoked_at IS NULL AND s.expires_at > now() AND u.deleted_at IS NULL`,
      [hashToken(sessionToken)],
    );
    if (!r.rows[0]) return null;
    await tx.query("UPDATE sessions SET last_seen_at = now() WHERE id = $1", [r.rows[0].session_id]);
    return rowToUser(r.rows[0]);
  });
}

export async function revokeSession(sessionToken: string | undefined): Promise<void> {
  if (!sessionToken) return;
  await withSystem((tx) => tx.query("UPDATE sessions SET revoked_at = now() WHERE token_hash = $1", [hashToken(sessionToken)]));
}

/** Esportazione dei propri dati (GDPR art. 20): tutto in un JSON, senza token né hash. */
export async function exportUserData(userId: string) {
  return withUser(userId, async (tx) => {
    // In sequenza: una transazione usa una sola connessione, le query non vanno sovrapposte.
    const q = (sql: string) => tx.query(sql);
    const user = await q("SELECT id, email, display_name, is_demo, role, created_at, last_login_at FROM users");
    const consents = await q("SELECT kind, version, granted, recorded_at FROM consents ORDER BY recorded_at");
    const documents = await q("SELECT id, title, source_kind, source_ref, status, extracted, verification, created_at, updated_at FROM documents ORDER BY created_at");
    const reports = await q("SELECT id, document_id, service, status, explanation, policy_version, created_at, generated_at FROM reports ORDER BY created_at");
    const dossiers = await q("SELECT id, title, document_ids, status, content, created_at, generated_at FROM dossiers ORDER BY created_at");
    const orders = await q("SELECT id, service, amount_cents, currency, status, provider, created_at, paid_at FROM orders ORDER BY created_at");
    const cases = await q("SELECT id, document_id, specialty, question, status, answer, decline_reason, is_simulated, created_at, answered_at FROM cases ORDER BY created_at");
    const appointments = await q("SELECT id, specialty, reason, preferred_slots, document_ids, status, scheduled_at, summary, decline_reason, is_simulated, created_at, completed_at FROM appointments ORDER BY created_at");
    const auditRows = await q("SELECT action, target, created_at FROM audit_log ORDER BY created_at");
    const files = await q("SELECT document_id, mime_type, size_bytes, sha256, created_at FROM document_files ORDER BY created_at");
    const aiRuns = await q("SELECT target_id, step, model, prompt_version, outcome, input_tokens, output_tokens, created_at FROM ai_runs ORDER BY created_at");
    await audit(tx, { userId, actor: "user", action: "export-data" });
    return {
      exportedAt: new Date().toISOString(),
      user: user.rows[0],
      consents: consents.rows,
      documents: documents.rows,
      reports: reports.rows,
      uploadedFiles: files.rows,
      aiProcessing: aiRuns.rows,
      dossiers: dossiers.rows,
      orders: orders.rows,
      secondOpinionCases: cases.rows,
      videoConsultations: appointments.rows,
      activityLog: auditRows.rows,
    };
  });
}

/** Cancella tutti i contenuti sanitari dell'utente (documenti, report, dossier, lavorazioni, casi). */
async function purgeHealthData(tx: Parameters<Parameters<typeof withSystem>[0]>[0], userId: string) {
  await tx.query("DELETE FROM jobs WHERE user_id = $1", [userId]);
  await tx.query("DELETE FROM case_events WHERE case_id IN (SELECT id FROM cases WHERE user_id = $1)", [userId]);
  await tx.query("DELETE FROM cases WHERE user_id = $1", [userId]);
  await tx.query("DELETE FROM appointments WHERE user_id = $1", [userId]);
  await tx.query("DELETE FROM dossiers WHERE user_id = $1", [userId]);
  await tx.query("DELETE FROM reports WHERE user_id = $1", [userId]);
  await tx.query("DELETE FROM document_files WHERE user_id = $1", [userId]);
  await tx.query("DELETE FROM ai_runs WHERE user_id = $1", [userId]);
  await tx.query("DELETE FROM documents WHERE user_id = $1", [userId]);
}

/**
 * Eliminazione dell'account (GDPR art. 17): cancellazione fisica di tutto ciò che è personale o sanitario.
 * Restano solo la riga utente anonimizzata, gli ordini (obblighi contabili, senza contenuti) e il registro.
 */
export async function deleteAccount(userId: string): Promise<void> {
  await withSystem(async (tx) => {
    const u = await tx.query("SELECT email FROM users WHERE id = $1 AND deleted_at IS NULL", [userId]);
    if (!u.rows[0]) return;
    await purgeHealthData(tx, userId);
    await tx.query("DELETE FROM consents WHERE user_id = $1", [userId]);
    await tx.query("DELETE FROM magic_links WHERE user_id = $1", [userId]);
    await tx.query("DELETE FROM waitlist WHERE email = $1", [String(u.rows[0].email)]);
    await tx.query("UPDATE sessions SET revoked_at = now() WHERE user_id = $1 AND revoked_at IS NULL", [userId]);
    await tx.query("UPDATE users SET email = $1, display_name = NULL, mfa_secret = NULL, mfa_enabled_at = NULL, mfa_last_step = NULL, deleted_at = now() WHERE id = $2", [`deleted-${userId}@anon.invalid`, userId]);
    await audit(tx, { userId, actor: "user", action: "delete-account" });
  });
}

export async function listConsents(userId: string) {
  return withUser(userId, async (tx) => (await tx.query("SELECT kind, version, granted, recorded_at FROM consents ORDER BY recorded_at DESC")).rows);
}

/** L'ultimo consenso registrato per i dati sanitari è ancora valido? */
export async function hasHealthDataConsent(userId: string): Promise<boolean> {
  return withUser(userId, async (tx) => {
    const r = await tx.query("SELECT granted FROM consents WHERE kind = 'health-data' ORDER BY recorded_at DESC LIMIT 1");
    return Boolean(r.rows[0]?.granted);
  });
}

export async function recordConsent(userId: string, kind: ConsentKind | "marketing", granted: boolean) {
  await withUser(userId, async (tx) => {
    const version = kind === "marketing" ? "bozza-2026-11" : CONSENT_VERSIONS[kind];
    await tx.query("INSERT INTO consents(id, user_id, kind, version, granted) VALUES (gen_random_uuid(), $1, $2, $3, $4)", [userId, kind, version, granted]);
    await audit(tx, { userId, actor: "user", action: granted ? "consent-granted" : "consent-withdrawn", target: kind });
  });
}

/** Revoca del consenso ai dati sanitari (art. 9): i contenuti sanitari vengono cancellati subito, l'account resta. */
export async function withdrawHealthDataConsent(userId: string): Promise<void> {
  await withSystem(async (tx) => {
    await purgeHealthData(tx, userId);
    await tx.query("INSERT INTO consents(id, user_id, kind, version, granted) VALUES (gen_random_uuid(), $1, 'health-data', $2, false)", [userId, CONSENT_VERSIONS["health-data"]]);
    await audit(tx, { userId, actor: "user", action: "consent-withdrawn", target: "health-data" });
  });
}
