import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ ok: true, method: "GET alive" }, { status: 200 });
}

export async function POST(req: Request) {
  try {
    const { email, hp } = await req.json();
    if (hp) return NextResponse.json({ ok: true }, { status: 200 });
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Email inválido" }, { status: 400 });
    }
    const mlRes = await fetch(
      "https://connect.mailerlite.com/api/subscribers",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.MAILERLITE_API_KEY}`,
        },
        body: JSON.stringify({ email }),
      }
    );
    if (!mlRes.ok) {
      const text = await mlRes.text();
      return NextResponse.json(
        { error: text || "Error en MailerLite" },
        { status: mlRes.status }
      );
    }
    const data = await mlRes.json();
    return NextResponse.json({ ok: true, data }, { status: 200 });
  } catch (e) {
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
