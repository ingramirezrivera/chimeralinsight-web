import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { assertLoginRateLimit } from "@/lib/auth/login-rate-limit";
import { getGoogleRoleForEmail, isGoogleAuthConfigured, verifyGoogleIdToken } from "@/lib/auth/google";
import { createSessionCookieOptions, createSessionToken, SESSION_COOKIE } from "@/lib/auth/session";
import { isSafeRedirect } from "@/lib/utils";

function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

export async function POST(request: Request) {
  if (!isGoogleAuthConfigured()) {
    return NextResponse.json(
      { error: "Google admin authentication is not configured on the server yet." },
      { status: 500 }
    );
  }

  const clientIp = getClientIp(request);

  if (!assertLoginRateLimit(`google:${clientIp}`)) {
    return NextResponse.json(
      { error: "Too many login attempts. Please wait before trying again." },
      { status: 429 }
    );
  }

  try {
    const { credential, redirectTo } = (await request.json()) as {
      credential?: string;
      redirectTo?: string;
    };

    if (!credential) {
      return NextResponse.json({ error: "Google credential is required." }, { status: 400 });
    }

    const googleUser = await verifyGoogleIdToken(credential);
    const role = getGoogleRoleForEmail(googleUser.email);

    if (!role) {
      return NextResponse.json(
        { error: "This Google account does not have permission to access the editorial desk." },
        { status: 403 }
      );
    }

    const user = await prisma.user.upsert({
      where: { email: googleUser.email },
      update: {
        role,
      },
      create: {
        email: googleUser.email,
        passwordHash: "google-oauth-only",
        role,
      },
    });

    const safeRedirect = isSafeRedirect(redirectTo || "/admin/dashboard")
      ? redirectTo || "/admin/dashboard"
      : "/admin/dashboard";

    const response = NextResponse.json({
      ok: true,
      redirectTo: safeRedirect,
    });

    response.cookies.set(
      SESSION_COOKIE,
      createSessionToken({
        userId: user.id,
        email: user.email,
        role: user.role,
      }),
      createSessionCookieOptions()
    );

    return response;
  } catch {
    return NextResponse.json(
      { error: "Unable to verify Google sign-in." },
      { status: 401 }
    );
  }
}
