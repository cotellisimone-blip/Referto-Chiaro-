import "server-only";
import { withSystem } from "@/db/client";
import { publicUrl, reminderEmail, sendEmail } from "@/lib/email";
import { daysBetween, needsEmail, todayIso } from "./promemoria";

/**
 * Cron: un'email per ogni promemoria che arriva entro tre giorni, una volta sola. Mai per gli account demo
 * e mai con dettagli sanitari (vedi `reminderEmail`). Restituisce quante email sono partite.
 */
export async function sendDueReminderEmails(
  today = todayIso(),
  limit = 50,
): Promise<number> {
  const due = await withSystem(async (tx) => {
    const r = await tx.query<{
      id: string;
      due_date: unknown;
      email: string;
      done_at: unknown;
      email_sent_at: unknown;
    }>(
      `SELECT r.id, r.due_date, r.done_at, r.email_sent_at, u.email FROM reminders r JOIN users u ON u.id = r.user_id
       WHERE r.done_at IS NULL AND r.email_sent_at IS NULL AND u.deleted_at IS NULL AND u.is_demo = false
         AND r.due_date BETWEEN $1::date AND ($1::date + 3) ORDER BY r.due_date LIMIT $2`,
      [today, limit],
    );
    return r.rows.map((x) => ({
      id: x.id,
      email: x.email,
      dueDate:
        x.due_date instanceof Date
          ? x.due_date.toISOString().slice(0, 10)
          : String(x.due_date).slice(0, 10),
    }));
  });
  let sent = 0;
  for (const d of due) {
    if (
      !needsEmail(
        { dueDate: d.dueDate, doneAt: null, emailSentAt: null },
        today,
      )
    )
      continue;
    const n = daysBetween(today, d.dueDate);
    const [y, m, g] = d.dueDate.split("-");
    const when =
      n === 0
        ? "oggi"
        : n === 1
          ? `domani, ${g}/${m}/${y}`
          : `tra ${n} giorni, il ${g}/${m}/${y}`;
    // Si segna prima di inviare: meglio un'email persa che due uguali.
    await withSystem((tx) =>
      tx.query(
        "UPDATE reminders SET email_sent_at = now() WHERE id = $1 AND email_sent_at IS NULL",
        [d.id],
      ),
    );
    if (
      await sendEmail(
        reminderEmail(d.email, publicUrl("/area-personale/promemoria"), when),
      )
    )
      sent++;
  }
  return sent;
}
