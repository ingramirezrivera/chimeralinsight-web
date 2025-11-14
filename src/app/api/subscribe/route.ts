// app/api/subscribe/route.ts
import { NextResponse } from "next/server";

// Grupo para la lista general (bonus content, etc.)
const GROUP_ID = process.env.MAILERLITE_GROUP_ID_BLOG;
const API_KEY = process.env.MAILERLITE_API_KEY;

const API_URL = "https://connect.mailerlite.com/api/subscribers";

/* ========= RATE LIMITING EN MEMORIA ========= */

// Límite por EMAIL: 3 intentos cada 60 segundos
const EMAIL_WINDOW_MS = 60_000;
const EMAIL_MAX = 3;

// Límite por IP: 10 intentos cada 5 minutos
const IP_WINDOW_MS = 5 * 60_000;
const IP_MAX = 10;

// Mapas en memoria (viven mientras el proceso de Node esté corriendo)
const emailAttempts = new Map<string, number[]>();
const ipAttempts = new Map<string, number[]>();

function getClientIp(req: Request): string {
  const xfwd = req.headers.get("x-forwarded-for");
  if (xfwd) {
    return xfwd.split(",")[0].trim();
  }
  const xreal = req.headers.get("x-real-ip");
  if (xreal) return xreal.trim();
  return "unknown";
}

function isRateLimited(
  map: Map<string, number[]>,
  key: string,
  windowMs: number,
  max: number,
  now: number
): boolean {
  const timestamps = map.get(key) || [];
  const recent = timestamps.filter((t) => now - t < windowMs);
  recent.push(now);
  map.set(key, recent);
  return recent.length > max;
}

/* ========= HANDLER POST ========= */

export async function POST(req: Request) {
  const now = Date.now();
  const ip = getClientIp(req);

  try {
    const { email, bookId = "mailing-list", hp } = await req.json();

    // Honeypot: si hp viene relleno, probablemente es bot
    if (hp) {
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    // RATE LIMIT POR EMAIL
    if (
      email &&
      isRateLimited(emailAttempts, email, EMAIL_WINDOW_MS, EMAIL_MAX, now)
    ) {
      return NextResponse.json(
        {
          error:
            "Too many attempts with this email in a short period. Please try again later.",
        },
        { status: 429 }
      );
    }

    // RATE LIMIT POR IP
    if (ip && isRateLimited(ipAttempts, ip, IP_WINDOW_MS, IP_MAX, now)) {
      return NextResponse.json(
        {
          error:
            "Too many requests from this IP. Please wait a few minutes and try again.",
        },
        { status: 429 }
      );
    }

    if (!API_KEY || !GROUP_ID) {
      throw new Error(
        "MailerLite API Key or Mailing List Group ID is missing in environment variables."
      );
    }

    // Validación básica de email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // Llamada a MailerLite: crea / actualiza suscriptor y lo mete al grupo de mailing list
    const mlRes = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        email,
        status: "active",
        groups: [GROUP_ID],
        fields: {
          book_id: bookId,
          source: "General Mailing List Form",
        },
      }),
    });

    if (!mlRes.ok) {
      const text = await mlRes.text();

      if (mlRes.status === 409) {
        return NextResponse.json(
          { ok: true, message: "Already subscribed." },
          { status: 200 }
        );
      }

      console.error("MailerLite API Error (subscribe):", mlRes.status, text);
      return NextResponse.json(
        { error: text || "MailerLite error occurred" },
        { status: mlRes.status }
      );
    }

    const data = await mlRes.json();
    return NextResponse.json({ ok: true, data }, { status: 200 });
  } catch (e) {
    console.error("Internal Server Error during subscription (subscribe):", e);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
