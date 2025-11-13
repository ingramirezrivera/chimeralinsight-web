"use client";

import { useState } from "react";
// Importaciones de Next.js reemplazadas para evitar errores de resolución:
// import Image from "next/image";
// import { withBasePath } from "@/lib/paths";

// Placeholder para resolver el error de alias de ruta. Asume que la ruta es correcta.
const withBasePath = (path: string) => path;

interface Props {
  title?: string;
  blurbTop?: string;
  blurbBottom?: string;
  ctaText?: string;
  subscribeUrl?: string;
}

export default function MailingListSection({
  title = "Get Free Bonus Content!",
  blurbTop = "Join my mailing list to receive bonus content from my books, starting with",
  blurbBottom = "Vaccine: A Terrorism Thriller - all for free!",
  ctaText = "Get My Free Bonus Content",
  subscribeUrl = "/api/subscribe", // ✅ por defecto apunta a tu API interna
}: Props) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "error">(
    "idle"
  );
  const [errorMsg, setErrorMsg] = useState("");

  const isValid = (val: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");

    if (!isValid(email)) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    setStatus("loading");

    try {
      // NOTE: Using withBasePath is often unnecessary for internal relative API routes like /api/subscribe
      const res = await fetch(subscribeUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // hp is an empty honeypot to match the check in route.ts
        body: JSON.stringify({ email, hp: "" }),
      });

      if (!res.ok) {
        let msg = "Something went wrong. Please try again.";
        try {
          const j = await res.json();
          // The route.ts returns j.error for an error message
          msg = j?.error || msg;
        } catch {}
        setStatus("error");
        setErrorMsg(msg);
        return;
      }

      setStatus("ok");
      setEmail("");
    } catch {
      setStatus("error");
      setErrorMsg("Something went wrong. Please try again.");
    }
  }

  return (
    <section id="mailing-list" className="w-full bg-[#2f8185e8] font-sans ">
      <div className="mx-auto max-w-6xl px-6 sm:px-6 lg:px-8 py-2 md:pt-8 pb-12">
        {/* Grid: 1 column on mobile, 2 on md+ */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr] gap-0 md:gap-8 md:gap-12 items-start">
          {/* Image (Replaced Next.js Image component with standard <img>) */}
          <div className="order-1 md:order-none flex justify-center md:justify-start">
            <img // <img> tag used instead of Next.js <Image>
              src={withBasePath("/images/paperplane.png")}
              alt="Paper plane doodle"
              width={240}
              height={160}
              className="w-40 md:w-72 h-auto pointer-events-none select-none opacity-95"
              // Removed priority and sizes attributes as they are Next.js specific
            />
          </div>

          {/* Text + Card */}
          <div className="order-2 md:order-none">
            <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-wide">
              {title}
            </h2>

            <p className="mt-4 text-white/95 text-lg md:text-xl leading-relaxed">
              {blurbTop}
              <br />
              {blurbBottom}
            </p>

            <div className="mt-8 rounded-2xl bg-teal-900/40 border border-white/10 p-4 sm:p-6">
              {status === "ok" ? (
                <p className="text-emerald-200 text-lg">
                  Thanks! Please check your inbox to confirm your subscription.
                </p>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                  <label
                    htmlFor="ml-email"
                    className="block text-white text-lg font-semibold"
                  >
                    Email Address
                  </label>

                  <input
                    id="ml-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-md bg-white text-gray-900 placeholder:text-gray-400 px-4 py-3 outline-none ring-2 ring-transparent focus:ring-cyan-300"
                    aria-invalid={!!errorMsg}
                    aria-describedby={errorMsg ? "ml-email-error" : undefined}
                    required
                  />

                  {errorMsg && (
                    <p id="ml-email-error" className="text-rose-200 text-sm">
                      {errorMsg}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={status === "loading" || !isValid(email)}
                    className="w-full rounded-lg bg-cyan-400 hover:bg-cyan-300 text-teal-900 font-semibold px-6 py-3 text-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {status === "loading" ? "Sending…" : ctaText}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
