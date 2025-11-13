import { NextResponse } from "next/server";

// Lee el Group ID y API Key desde las env vars
const GROUP_ID = process.env.MAILERLITE_GROUP_ID_WHIPTHEDOGS;
const API_KEY = process.env.MAILERLITE_API_KEY;

// 👉 Endpoint correcto para crear/actualizar suscriptores
const API_URL = "https://connect.mailerlite.com/api/subscribers";

export async function POST(req: Request) {
  try {
    // Recibimos email, bookId y hp (honeypot)
    const { email, bookId, hp } = await req.json();

    // Honeypot: si hp viene relleno, probablemente es bot
    if (hp) return NextResponse.json({ ok: true }, { status: 200 });

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
