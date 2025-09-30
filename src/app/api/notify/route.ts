// src/app/api/notify/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, bookId } = await req.json();
    if (!email || !bookId) {
      return NextResponse.json(
        { ok: false, error: "Missing email or bookId" },
        { status: 400 }
      );
    }

    // TODO: integra aquí tu proveedor (Beehiiv/Mailchimp) o DB propia.
    // Ejemplo de payload que podrías enviar:
    // await fetch("https://your-provider.example/subscribe", { method: "POST", body: JSON.stringify({ email, tag: `launch:${bookId}` }) });

    // Por ahora solo log:
    console.log("[notify] launch signup:", { email, bookId });

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: "Invalid request" },
      { status: 400 }
    );
  }
}
