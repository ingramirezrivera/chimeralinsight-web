"use server";

import { headers } from "next/headers";

export type ActionState = {
  ok: boolean;
  message?: string;
  errors?: Partial<
    Record<"name" | "email" | "subject" | "message" | "_global", string>
  >;
};

// --- Utils ---
function sanitize(input: string) {
  return input.replace(
    /[<>&'"]/g,
    (c) =>
      ((
        {
          "<": "&lt;",
          ">": "&gt;",
          "&": "&amp;",
          "'": "&#39;",
          '"': "&quot;",
        } as any
      )[c])
  );
}
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

// --- Rate limiting básico en memoria (nota: en serverless puede resetearse) ---
const RATE_WINDOW_MS = 60_000;
const RATE_MAX_REQS = 5;
const ipBuckets = new Map<string, { count: number; exp: number }>();

function getClientIp(): string {
  const h = headers();
  const xff = h.get("x-forwarded-for");
  if (xff) return xff.split(",")[0].trim();
  const rip = h.get("x-real-ip");
  if (rip) return rip;
  return "unknown";
}

// --- Server Action ---
export async function sendPressMessage(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  // Honeypot (campo oculto)
  const botTrap = (formData.get("company") || "").toString().trim();
  if (botTrap) return { ok: true, message: "Thanks! We’ll be in touch soon." };

  // Rate limit
  const ip = getClientIp();
  const now = Date.now();
  const bucket = ipBuckets.get(ip);
  if (!bucket || bucket.exp < now) {
    ipBuckets.set(ip, { count: 1, exp: now + RATE_WINDOW_MS });
  } else {
    bucket.count += 1;
    if (bucket.count > RATE_MAX_REQS) {
      return {
        ok: false,
        errors: { _global: "Please wait a moment and try again." },
      };
    }
  }

  // Campos
  const name = (formData.get("name") || "").toString().trim();
  const email = (formData.get("email") || "").toString().trim();
  const subject = (formData.get("subject") || "").toString().trim();
  const message = (formData.get("message") || "").toString().trim();

  // Validación
  const errors: ActionState["errors"] = {};
  if (name.length < 2 || name.length > 80)
    errors.name = "Please enter 2–80 characters.";
  if (!EMAIL_RE.test(email) || email.length > 120)
    errors.email = "Please enter a valid email.";
  if (subject.length < 4 || subject.length > 120)
    errors.subject = "Please enter 4–120 characters.";
  if (message.length < 20 || message.length > 4000)
    errors.message = "Please enter 20–4000 characters.";
  if (Object.keys(errors).length) return { ok: false, errors };

  const safe = {
    name: sanitize(name),
    email: sanitize(email),
    subject: sanitize(subject),
    message: sanitize(message),
    ip,
  };

  // TODO: Envía por tu proveedor (Resend/Nodemailer). Ejemplo (desactivado):
  /*
  if (process.env.RESEND_API_KEY && process.env.PRESS_INBOX) {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `Press Kit <press@${new URL(process.env.NEXT_PUBLIC_SITE_URL!).hostname}>`,
        to: [process.env.PRESS_INBOX],
        subject: `[Press] ${safe.subject}`,
        text: `Name: ${safe.name}\nEmail: ${safe.email}\nIP: ${safe.ip}\n\n${safe.message}`,
      }),
    });
  }
  */

  console.log("[PRESSKIT] Contact form:", safe);
  return { ok: true, message: "Thanks! Your message has been sent." };
}
