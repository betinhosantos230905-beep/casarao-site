import { useSession, getRequestUrl } from "@tanstack/react-start/server";
import { redirect } from "@tanstack/react-router";

// Server-only module. It is loaded with await import() from inside handler
// bodies so the server package never reaches the browser bundle.

type GateSession = { unlocked?: boolean };

// Built per call: on the worker runtime env is injected per request, so a
// module-scope read of SESSION_SECRET would be undefined.
function sessionConfig() {
  return {
    password: process.env["SESSION_SECRET"]!,
    name: "casarao-admin",
    maxAge: 60 * 60 * 24 * 7, // 7 dias
    cookie: {
      httpOnly: true,
      secure: getRequestUrl().protocol === "https:",
      sameSite: "lax" as const,
      path: "/",
    },
  };
}

// Hash both sides first: a plain === leaks the position of the first wrong
// character through response time, and a raw length mismatch throws.
async function digest(text: string): Promise<Uint8Array> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return new Uint8Array(buf);
}

async function passwordMatches(input: string, expected: string): Promise<boolean> {
  const a = await digest(input);
  const b = await digest(expected);
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= (a[i] ?? 0) ^ (b[i] ?? 0);
  return diff === 0;
}

export async function isUnlocked(): Promise<boolean> {
  const session = await useSession<GateSession>(sessionConfig());
  return Boolean(session.data.unlocked);
}

// Throws before any protected work runs; the router turns it into a visit to the login page.
export async function requireUnlocked(): Promise<void> {
  if (!(await isUnlocked())) throw redirect({ to: "/admin" });
}

export async function markUnlocked(): Promise<void> {
  const session = await useSession<GateSession>(sessionConfig());
  await session.update({ unlocked: true });
}

export async function markLocked(): Promise<void> {
  const session = await useSession<GateSession>(sessionConfig());
  await session.clear();
}

export async function checkPassword(input: string): Promise<boolean> {
  const expected = process.env["SITE_PASSWORD"];
  if (!expected) throw new Error("SITE_PASSWORD não está configurado");
  return passwordMatches(input, expected);
}
