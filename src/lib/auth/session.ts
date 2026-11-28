import "server-only";
import { cookies } from "next/headers";
import { connection } from "next/server";
import { SESSION_COOKIE, SESSION_TTL_MS } from "./tokens";
import { getUserBySession, type User } from "./service";

/** Legge l'utente corrente dal cookie di sessione (httpOnly). */
export async function getCurrentUser(): Promise<User | null> {
  await connection(); // dati di richiesta: mai in prerendering
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  return getUserBySession(token);
}

export function sessionCookie(token: string) {
  return {
    name: SESSION_COOKIE,
    value: token,
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production" && process.env.COOKIE_INSECURE !== "true",
    path: "/",
    maxAge: SESSION_TTL_MS / 1000,
  };
}

export function clearedSessionCookie() {
  return { ...sessionCookie(""), maxAge: 0 };
}
