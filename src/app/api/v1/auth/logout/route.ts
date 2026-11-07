import { cookies } from "next/headers";
import { revokeSession } from "@/lib/auth/service";
import { clearedSessionCookie } from "@/lib/auth/session";
import { SESSION_COOKIE } from "@/lib/auth/tokens";
import { json } from "@/lib/api";

export async function POST() {
  const jar = await cookies();
  await revokeSession(jar.get(SESSION_COOKIE)?.value);
  jar.set(clearedSessionCookie());
  return json({ ok: true });
}
