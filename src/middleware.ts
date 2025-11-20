// src/middleware.ts (bloquea orígenes extraños)
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Dominios permitidos para el form de /api/subscribe
const ALLOWED_ORIGINS = [
  "http://localhost:3000", // desarrollo local
  "https://chimeralinsight.com", // producción
  "https://www.chimeralinsight.com", // producción con www
  "https://staging.chimeralinsight.com", // staging
];

export function middleware(req: NextRequest) {
  // Solo aplicamos la validación a esta ruta
  if (req.nextUrl.pathname.startsWith("/api/subscribe")) {
    const origin = req.headers.get("origin") || "";

    // Si viene con Origin y no está en la lista, bloqueamos
    if (origin && !ALLOWED_ORIGINS.includes(origin)) {
      return new NextResponse("Forbidden", { status: 403 });
    }
  }

  return NextResponse.next();
}

// El matcher indica a qué paths se aplica este middleware
export const config = {
  matcher: ["/api/subscribe"],
};
