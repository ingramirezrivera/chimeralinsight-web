"use client";

import { useState } from "react";
import Image from "next/image";

interface Props {
  title?: string;
  blurbTop?: string;
  blurbBottom?: string;
  ctaText?: string;
  subscribeUrl?: string; // ← si la pasas, hace POST ahí
}

export default function MailingListSection({
  title = "Get Free Bonus Content!",
  blurbTop = "Join my mailing list to receive bonus content from my book,",
  blurbBottom = "Vaccine: A Terrorism Thriller, for free!",
  ctaText = "Get My Free Bonus Content",
  subscribeUrl,
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
      if (subscribeUrl) {
        await fetch(subscribeUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
      } else {
        // Simulación si aún no conectas la API:
        await new Promise((r) => setTimeout(r, 800));
      }
      setStatus("ok");
      setEmail("");
    } catch {
      setStatus("error");
      setErrorMsg("Something went wrong. Please try again.");
    }
  }

  return (
    <section className="w-full bg-teal-800/80">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-[1fr_2fr] gap-8 md:gap-12 items-start">
          <div className="flex justify-center md:justify-start">
            <Image
              src="/images/paperplane.png"
              alt="Paper plane doodle"
              width={240} // tamaño base para calcular el aspect ratio
              height={160}
              className="w-40 md:w-76 h-auto pointer-events-none select-none opacity-95"
              priority
              sizes="(min-width: 768px) 15rem, 10rem"
            />
          </div>

          {/* Texto + Card */}
          <div>
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
                <form onSubmit={handleSubmit} className="space-y-4">
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
                    placeholder="example@example.com"
                    className="w-full rounded-md bg-white text-gray-900 placeholder:text-gray-400 px-4 py-3 outline-none ring-2 ring-transparent focus:ring-cyan-300"
                    aria-invalid={!!errorMsg}
                    aria-describedby={errorMsg ? "ml-email-error" : undefined}
                  />

                  {errorMsg && (
                    <p id="ml-email-error" className="text-rose-200 text-sm">
                      {errorMsg}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={status === "loading"}
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
