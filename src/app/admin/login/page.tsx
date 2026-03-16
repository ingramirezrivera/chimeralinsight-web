import Image from "next/image";
import { redirect } from "next/navigation";
import LoginForm from "@/app/admin/login/LoginForm";
import { isGoogleAuthConfigured } from "@/lib/auth/google";
import { getSession } from "@/lib/auth/session";

const errorMessages: Record<string, string> = {
  config: "Google admin authentication is not configured on the server yet.",
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ redirectTo?: string; error?: string }>;
}) {
  const [session, params] = await Promise.all([getSession(), searchParams]);

  if (session) {
    redirect("/admin/dashboard");
  }

  const error = params.error ? errorMessages[params.error] : "";
  const googleClientId = process.env.GOOGLE_CLIENT_ID?.trim() || "";
  const authReady = isGoogleAuthConfigured();

  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(47,129,133,0.3),_transparent_30%),linear-gradient(180deg,#ece3d4_0%,#f8f5ee_48%,#f5efe3_100%)] px-4 py-10 text-slate-950">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-35"
        style={{
          backgroundImage:
            "linear-gradient(rgba(17,24,39,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(17,24,39,0.04) 1px, transparent 1px)",
          backgroundSize: "24px 24px",
          maskImage:
            "radial-gradient(circle at center, rgba(0,0,0,0.92), transparent 78%)",
        }}
      />
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-12 lg:grid-cols-[1.15fr_0.85fr]">
        <section className="relative space-y-8">
          <div className="absolute -left-10 -top-10 hidden h-40 w-40 rounded-full bg-[radial-gradient(circle,_rgba(47,129,133,0.22),transparent_70%)] blur-2xl lg:block" />
          <div className="flex items-center gap-5">
            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border border-white/60 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.98),rgba(47,129,133,0.12))] shadow-[0_18px_55px_-32px_rgba(15,23,42,0.5)]">
              <Image
                src="/images/seal-chimeralInsight.png"
                alt="Chimeral Insight seal"
                width={84}
                height={84}
                className="h-18 w-18 object-contain"
                priority
              />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                Chimeral Insight
              </p>
              <h1 className="mt-2 text-5xl font-semibold leading-tight tracking-tight">
                Private editorial desk
              </h1>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Private editorial area
            </p>
            <p className="max-w-2xl text-lg leading-8 text-slate-600">
              Robin and the technical administrator can manage posts, imagery,
              drafts, publication and SEO metadata from one protected workflow.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              "Drafts and publishing states",
              "Structured SEO metadata per article",
              "Secure local uploads on the VPS",
            ].map((item: string) => (
              <div
                key={item}
                className="rounded-[24px] border border-black/5 bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(252,249,244,0.82))] p-5 shadow-[0_18px_50px_-38px_rgba(15,23,42,0.4)]"
              >
                <p className="text-sm leading-6 text-slate-600">{item}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[36px] border border-black/5 bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(252,249,244,0.92))] p-8 shadow-[0_30px_90px_-45px_rgba(15,23,42,0.42)] sm:p-10">
          <div className="mb-6 overflow-hidden rounded-[28px] border border-black/5 bg-[linear-gradient(120deg,rgba(47,129,133,0.94),rgba(16,69,78,0.96))] px-6 py-6 text-white">
            <Image
              src="/images/logo.png"
              alt="Chimeral Insight logo"
              width={280}
              height={48}
              className="h-auto w-48"
            />
            <p className="mt-4 max-w-sm text-sm leading-6 text-white/82">
              A secure publishing space designed to feel like part of the main
              site, not a disconnected control panel.
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
              Admin login
            </p>
            <h2 className="text-3xl font-semibold tracking-tight">Welcome back</h2>
          </div>

          {error ? (
            <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <div className="mt-8">
            <LoginForm
              redirectTo={params.redirectTo || "/admin/dashboard"}
              googleClientId={googleClientId}
              authReady={authReady}
            />
          </div>
        </section>
      </div>
    </main>
  );
}
