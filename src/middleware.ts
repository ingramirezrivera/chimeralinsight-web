// src/middleware.ts (bloquea orígenes extraños)
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ALLOWED = ["http://localhost:3000", "https://tu-dominio.com"];

export function middleware(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith("/api/subscribe")) {
    const origin = req.headers.get("origin") || "";
    if (origin && !ALLOWED.includes(origin)) {
      return new NextResponse("Forbidden", { status: 403 });
    }
  }
  return NextResponse.next();
}

export const config = { matcher: ["/api/subscribe"] };
