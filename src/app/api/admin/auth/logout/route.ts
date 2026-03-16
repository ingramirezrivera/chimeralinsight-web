import { NextResponse } from "next/server";
import { createSessionCookieOptions, SESSION_COOKIE } from "@/lib/auth/session";

export async function POST() {
  const response = NextResponse.json({ ok: true });

  response.cookies.set(SESSION_COOKIE, "", {
    ...createSessionCookieOptions(),
    maxAge: 0,
  });

  return response;
}
