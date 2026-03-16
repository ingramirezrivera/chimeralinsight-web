import Image from "next/image";
import Link from "next/link";
import AdminSessionGuard from "@/components/admin/AdminSessionGuard";
import { SessionUser } from "@/lib/auth/session";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/posts", label: "Posts" },
  { href: "/blog", label: "View blog" },
];

export default function AdminShell({
  user,
  pathname,
  children,
  actions,
  theme = "dark",
}: {
  user: SessionUser;
  pathname: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  theme?: "dark" | "light";
}) {
  const isLight = theme === "light";

  return (
    <div
      className={
        isLight
          ? "min-h-screen bg-[radial-gradient(circle_at_top,_rgba(47,129,133,0.18),_transparent_24%),linear-gradient(180deg,#edf4f2_0%,#f7f3eb_52%,#f4ecdf_100%)] text-slate-950"
          : "min-h-screen bg-[radial-gradient(circle_at_top,_rgba(47,129,133,0.18),_transparent_28%),linear-gradient(180deg,#171d20_0%,#20292d_28%,#2b3437_54%,#3b4442_100%)] text-slate-100"
      }
    >
      <AdminSessionGuard />
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0",
          isLight ? "opacity-35" : "opacity-30"
        )}
        style={{
          backgroundImage: isLight
            ? "linear-gradient(rgba(15,23,42,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.04) 1px, transparent 1px)"
            : "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
          backgroundSize: "26px 26px",
          maskImage: isLight
            ? "radial-gradient(circle at top, rgba(0,0,0,0.9), transparent 74%)"
            : "linear-gradient(180deg, rgba(0,0,0,0.75), rgba(0,0,0,0.15) 65%, transparent)",
        }}
      />
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col gap-10 px-4 py-6 sm:px-6 lg:px-8">
        <header
          className={cn(
            "rounded-[32px] px-6 py-5 backdrop-blur",
            isLight
              ? "border border-[rgba(47,129,133,0.12)] bg-[linear-gradient(180deg,rgba(255,255,255,0.94),rgba(240,246,244,0.88))] shadow-[0_24px_80px_-48px_rgba(15,23,42,0.28)]"
              : "border border-white/10 bg-[linear-gradient(180deg,rgba(21,29,33,0.88),rgba(33,42,45,0.86))] shadow-[0_24px_80px_-48px_rgba(0,0,0,0.55)]"
          )}
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <div
                className={cn(
                  "flex h-16 w-16 items-center justify-center rounded-full shadow-inner",
                  isLight
                    ? "border border-[rgba(47,129,133,0.12)] bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.98),rgba(47,129,133,0.16))]"
                    : "border border-white/10 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.16),rgba(47,129,133,0.2))]"
                )}
              >
                <Image
                  src="/images/seal-chimeralInsight.png"
                  alt="Chimeral Insight seal"
                  width={56}
                  height={56}
                  className="h-12 w-12 object-contain"
                />
              </div>
              <div>
                <p
                  className={cn(
                    "text-xs uppercase tracking-[0.22em]",
                    isLight ? "text-[var(--brand)]" : "text-slate-400"
                  )}
                >
                  Chimeral Insight Admin
                </p>
                <h1
                  className={cn(
                    "mt-1 text-3xl font-semibold tracking-tight",
                    isLight ? "text-slate-950" : "text-inherit"
                  )}
                >
                  Editorial workspace
                </h1>
                <p className={cn("mt-1 text-sm", isLight ? "text-slate-600" : "text-slate-300")}>
                  Robin Rickards Author.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div
                className={cn(
                  "rounded-full px-4 py-2 text-sm",
                  isLight
                    ? "border border-[rgba(47,129,133,0.12)] bg-white/88 text-slate-700"
                    : "border border-white/10 bg-white/8 text-slate-200"
                )}
              >
                {user.email} / {user.role.toLowerCase()}
              </div>
              {actions}
            </div>
          </div>

          <nav className="mt-5 flex flex-wrap gap-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition",
                  pathname.startsWith(item.href)
                    ? "bg-[var(--brand)] text-white shadow-[0_12px_28px_-18px_rgba(47,129,133,0.95)]"
                    : isLight
                      ? "bg-white/82 text-slate-700 hover:bg-white"
                      : "bg-white/8 text-slate-200 hover:bg-white/14"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </header>

        {children}
      </div>
    </div>
  );
}
