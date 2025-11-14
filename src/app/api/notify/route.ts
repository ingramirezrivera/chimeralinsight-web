// app/api/notify/route.ts
import { NextResponse } from "next/server";

// Lee el Group ID y API Key desde las env vars
const GROUP_ID = process.env.MAILERLITE_GROUP_ID_WHIPTHEDOGS;
const API_KEY = process.env.MAILERLITE_API_KEY;

// 👉 Endpoint correcto para crear/actualizar suscriptores
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
  // Intentamos leer IP real desde los headers típicos detrás de proxy/nginx
  const xfwd = req.headers.get("x-forwarded-for");
  if (xfwd) {
    // Puede venir "ip1, ip2, ip3" → nos quedamos con la primera
    return xfwd.split(",")[0].trim();
  }
  const xreal = req.headers.get("x-real-ip");
  if (xreal) return xreal.trim();
  // Fallback: no tenemos acceso directo al socket en este contexto,
  // así que usamos un identificador genérico.
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

  // Filtrar para quedarnos solo con timestamps dentro de la ventana
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
    // Recibimos email, bookId y hp (honeypot)
    const { email, bookId, hp } = await req.json();

    // Honeypot: si hp viene relleno, probablemente es bot → salimos silenciosamente
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
        "MailerLite API Key or Group ID is missing in environment variables."
      );
    }

    // Validación básica de email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address" },
        { status: 400 }
      );
    }

    // Llamada a MailerLite: crea / actualiza suscriptor y lo mete al grupo
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
        groups: [GROUP_ID], // 👈 aquí asignas al grupo Launch
        fields: {
          book_id: bookId,
          source: "Whip the Dogs Launch",
        },
      }),
    });

    if (!mlRes.ok) {
      const text = await mlRes.text();

      // Por si MailerLite devuelve 409 (ya suscrito)
      if (mlRes.status === 409) {
        return NextResponse.json(
          { ok: true, message: "Already subscribed." },
          { status: 200 }
        );
      }

      console.error("MailerLite API Error:", mlRes.status, text);
      return NextResponse.json(
        { error: text || "MailerLite error occurred" },
        { status: mlRes.status }
      );
    }

    const data = await mlRes.json();
    return NextResponse.json({ ok: true, data }, { status: 200 });
  } catch (e) {
    console.error("Internal Server Error during subscription:", e);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
