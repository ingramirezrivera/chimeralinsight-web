"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { assertLoginRateLimit } from "@/lib/auth/login-rate-limit";
import { verifyPassword } from "@/lib/auth/password";
import {
  clearSessionCookie,
  isAuthConfigured,
  setSessionCookie,
} from "@/lib/auth/session";
import { isSafeRedirect } from "@/lib/utils";

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") || "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") || "");
  const redirectTo = String(formData.get("redirectTo") || "/admin/dashboard");

  if (!assertLoginRateLimit(email || "anonymous")) {
    redirect("/admin/login?error=rate-limit");
  }

  if (!isAuthConfigured()) {
    redirect("/admin/login?error=config");
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user || !(await verifyPassword(user.passwordHash, password))) {
    redirect("/admin/login?error=invalid");
  }

  await setSessionCookie({
    userId: user.id,
    email: user.email,
    role: user.role,
  });

  redirect(isSafeRedirect(redirectTo) ? redirectTo : "/admin/dashboard");
}

export async function logoutAction() {
  await clearSessionCookie();
  redirect("/admin/login");
}
