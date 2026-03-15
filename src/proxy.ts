import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "https://chimeralinsight.com",
  "https://www.chimeralinsight.com",
  "https://staging.chimeralinsight.com",
];

export function proxy(req: NextRequest) {
  if (req.nextUrl.pathname.startsWith("/api/subscribe")) {
    const origin = req.headers.get("origin") || "";

    if (origin && !ALLOWED_ORIGINS.includes(origin)) {
      return new NextResponse("Forbidden", { status: 403 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/subscribe"],
};
