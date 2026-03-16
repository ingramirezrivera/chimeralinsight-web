import { createRemoteJWKSet, jwtVerify } from "jose";
import type { SessionRole } from "@/lib/auth/session";

const GOOGLE_ISSUERS = ["https://accounts.google.com", "accounts.google.com"];
const googleJwks = createRemoteJWKSet(new URL("https://www.googleapis.com/oauth2/v3/certs"));

function getGoogleClientId() {
  return process.env.GOOGLE_CLIENT_ID?.trim() || null;
}

function parseAllowedEmails(value: string | undefined) {
  return new Set(
    (value || "")
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean)
  );
}

export function isGoogleAuthConfigured() {
  const clientId = getGoogleClientId();
  const adminEmails = parseAllowedEmails(process.env.ADMIN_ALLOWED_EMAILS);
  const editorEmails = parseAllowedEmails(process.env.EDITOR_ALLOWED_EMAILS);

  return Boolean(clientId && (adminEmails.size > 0 || editorEmails.size > 0));
}

export function getGoogleRoleForEmail(email: string): SessionRole | null {
  const normalizedEmail = email.trim().toLowerCase();

  if (parseAllowedEmails(process.env.ADMIN_ALLOWED_EMAILS).has(normalizedEmail)) {
    return "ADMIN";
  }

  if (parseAllowedEmails(process.env.EDITOR_ALLOWED_EMAILS).has(normalizedEmail)) {
    return "EDITOR";
  }

  return null;
}

export async function verifyGoogleIdToken(idToken: string) {
  const clientId = getGoogleClientId();

  if (!clientId) {
    throw new Error("GOOGLE_CLIENT_ID is required");
  }

  const { payload } = await jwtVerify(idToken, googleJwks, {
    issuer: GOOGLE_ISSUERS,
    audience: clientId,
  });

  const email = typeof payload.email === "string" ? payload.email.trim().toLowerCase() : "";

  if (!email || payload.email_verified !== true) {
    throw new Error("Google account email is missing or not verified");
  }

  return {
    email,
    subject: typeof payload.sub === "string" ? payload.sub : "",
  };
}
