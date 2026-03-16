import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export type SessionRole = "ADMIN" | "EDITOR";

export type SessionUser = {
  userId: string;
  email: string;
  role: SessionRole;
  exp: number;
};

export const SESSION_COOKIE = "ci_admin_session";
const SESSION_TTL_SECONDS = 60 * 60 * 12;

function getAuthSecretValue() {
  const secret = process.env.AUTH_SECRET?.trim();

  return secret || null;
}

function getAuthSecret() {
  const secret = getAuthSecretValue();

  if (!secret) {
    throw new Error("AUTH_SECRET is required");
  }

  return secret;
}

function encodePayload(payload: SessionUser) {
  return Buffer.from(JSON.stringify(payload)).toString("base64url");
}

function signPayload(encodedPayload: string, secret: string = getAuthSecret()) {
  return createHmac("sha256", secret)
    .update(encodedPayload)
    .digest("base64url");
}

export function isAuthConfigured() {
  return Boolean(getAuthSecretValue());
}

export function createSessionToken(payload: Omit<SessionUser, "exp">) {
  const fullPayload: SessionUser = {
    ...payload,
    exp: Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS,
  };

  const encodedPayload = encodePayload(fullPayload);
  const signature = signPayload(encodedPayload);

  return `${encodedPayload}.${signature}`;
}

export function createSessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
  };
}

export function parseSessionToken(token: string | undefined) {
  if (!token) return null;

  const secret = getAuthSecretValue();
  if (!secret) return null;

  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature) return null;

  const expectedSignature = signPayload(encodedPayload, secret);
  const signatureBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (
    signatureBuffer.length !== expectedBuffer.length ||
    !timingSafeEqual(signatureBuffer, expectedBuffer)
  ) {
    return null;
  }

  try {
    const payload = JSON.parse(
      Buffer.from(encodedPayload, "base64url").toString("utf8")
    ) as SessionUser;

    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export async function setSessionCookie(payload: Omit<SessionUser, "exp">) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, createSessionToken(payload), createSessionCookieOptions());
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, "", {
    ...createSessionCookieOptions(),
    maxAge: 0,
  });
}

export async function getSession() {
  const cookieStore = await cookies();
  return parseSessionToken(cookieStore.get(SESSION_COOKIE)?.value);
}

export async function requireSession() {
  const session = await getSession();

  if (!session) {
    redirect("/admin/login");
  }

  return session;
}

export async function requireRole(roles: SessionRole[]) {
  const session = await requireSession();

  if (!roles.includes(session.role)) {
    redirect("/admin/dashboard");
  }

  return session;
}
