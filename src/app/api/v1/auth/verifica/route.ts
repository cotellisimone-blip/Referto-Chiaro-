import { cookies } from "next/headers";
import { consumeMagicLink } from "@/lib/auth/service";
import { sessionCookie } from "@/lib/auth/session";
import { safeAreaNext } from "@/lib/auth/next-path";

/** Consuma il link monouso e apre la sessione. In caso di errore rimanda alla pagina di accesso. */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const token = url.searchParams.get("token") ?? "";
  const r = await consumeMagicLink(token);
  if (!r.ok) return Response.redirect(new URL("/accedi?errore=link", url), 303);
  (await cookies()).set(sessionCookie(r.sessionToken));
  return Response.redirect(new URL(safeAreaNext(url.searchParams.get("next")), url), 303);
}
