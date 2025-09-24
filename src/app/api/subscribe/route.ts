import { NextResponse } from "next/server";

// --- 👇 código de rate limit (puede ir arriba del handler)
const hits = new Map<string, { count: number; ts: number }>();
const WINDOW_MS = 60_000; // 1 minuto
const LIMIT = 20; // máximo 20 solicitudes por minuto

function tooMany(req: Request) {
  const ip = (req.headers.get("x-forwarded-for") || "local")
    .split(",")[0]
    .trim();
  const now = Date.now();
  const rec = hits.get(ip) ?? { count: 0, ts: now };

  if (now - rec.ts > WINDOW_MS) {
    rec.count = 0;
    rec.ts = now;
  }

  rec.count++;
  hits.set(ip, rec);
  return rec.count > LIMIT;
}

// --- 👇 handler principal
export async function POST(req: Request) {
  // ✅ coloca aquí la verificación ANTES de cualquier otra lógica
  if (tooMany(req)) {
    return NextResponse.json(
      { ok: false, error: "Rate limit" },
      { status: 429 }
    );
  }

  // …el resto de tu código para validar email y llamar a MailerLite…
}
