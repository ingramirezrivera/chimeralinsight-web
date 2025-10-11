// src/app/contact/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";

const CONTACT_ENDPOINT = process.env.NEXT_PUBLIC_CONTACT_ENDPOINT || ""; // e.g. https://formspree.io/f/xxxxxx

type FormState = "idle" | "submitting" | "success" | "error";

export default function ContactPage() {
  const [state, setState] = useState<FormState>("idle");
  const [msg, setMsg] = useState<string>("");

  const onSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = Object.fromEntries(data.entries());

    // Validación simple en cliente
    if (!payload.name || !payload.email || !payload.message) {
      setMsg("Please complete all required fields.");
      setState("error");
      return;
    }

    // Si hay endpoint (Formspree / tu API), posteamos; si no, fallback a mailto
    if (CONTACT_ENDPOINT) {
      try {
        setState("submitting");
        setMsg("");
        const res = await fetch(CONTACT_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Failed");
        setState("success");
        setMsg("Thanks! Your message has been sent.");
        form.reset();
      } catch {
        setState("error");
        setMsg("Something went wrong. Please try again in a moment.");
      }
    } else {
      // mailto fallback
      const subject = encodeURIComponent(`Contact: ${payload.name}`);
      const body = encodeURIComponent(
        `Name: ${payload.name}\nEmail: ${payload.email}\n\n${payload.message}`
      );
      window.location.href = `mailto:info@chimeralinsight.com?subject=${subject}&body=${body}`;
      setState("success");
      setMsg("Opening your email client…");
    }
  };

  return (
    <main
      className="min-h-[calc(100vh-var(--nav-h,80px))] bg-white font-sans"
      style={{ scrollMarginTop: "var(--nav-h, 80px)" }}
    >
      {/* Hero */}
      <section className="relative bg-[var(--brand,#0f766e)] text-white">
        <div className="container mx-auto px-4 lg:px-10 py-20 lg:py-24">
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight">
            Contact
          </h1>
          <p className="mt-3 text-white/90 max-w-2xl">
            Send us a note — we’ll get back to you as soon as possible.
          </p>
        </div>
      </section>

      {/* Body */}
      <section className="container mx-auto px-4 lg:px-10 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Card: Form */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl bg-white shadow-xl border border-gray-100 p-6 sm:p-8">
              <h2 className="text-2xl font-semibold text-[#494949]">
                Send a message
              </h2>
              <p className="mt-2 text-gray-500">
                Fields marked with <span className="text-red-500">*</span> are
                required.
              </p>

              <form onSubmit={onSubmit} className="mt-6 space-y-5">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-[var(--brand-600,#0891b2)] focus:ring-2 focus:ring-[var(--brand-600,#0891b2)]/40"
                    placeholder="Your name"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-[var(--brand-600,#0891b2)] focus:ring-2 focus:ring-[var(--brand-600,#0891b2)]/40"
                      placeholder="you@example.com"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Subject
                    </label>
                    <input
                      id="subject"
                      name="subject"
                      type="text"
                      className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-[var(--brand-600,#0891b2)] focus:ring-2 focus:ring-[var(--brand-600,#0891b2)]/40"
                      placeholder="(optional)"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    className="mt-1 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-gray-900 shadow-sm focus:border-[var(--brand-600,#0891b2)] focus:ring-2 focus:ring-[var(--brand-600,#0891b2)]/40"
                    placeholder="How can we help?"
                  />
                </div>

                {/* estado */}
                {state !== "idle" && (
                  <p
                    className={[
                      "text-sm",
                      state === "error"
                        ? "text-red-600"
                        : "text-[var(--brand-600,#0891b2)]",
                    ].join(" ")}
                    role={state === "error" ? "alert" : undefined}
                  >
                    {msg}
                  </p>
                )}

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={state === "submitting"}
                    className={[
                      "w-full sm:w-auto inline-flex items-center justify-center rounded-lg",
                      "bg-[var(--brand,#0f766e)] text-white hover:bg-[var(--brand-600,#0891b2)]",
                      "px-6 py-3 text-base font-semibold",
                      "transition-colors disabled:opacity-60 disabled:cursor-not-allowed",
                    ].join(" ")}
                  >
                    {state === "submitting" ? "Sending…" : "Send message"}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Card: Info / Social */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl bg-[var(--brand,#0f766e)] text-white shadow-xl p-6 sm:p-8 lg:sticky lg:top-[calc(var(--nav-h,80px)+16px)]">
              <h2 className="text-2xl font-semibold">Contact details</h2>
              <p className="mt-2 text-white/90">
                Prefer email? Reach us directly and we’ll reply shortly.
              </p>

              <div className="mt-6 space-y-4 text-white/95">
                <p>
                  <span className="block text-white/80 text-sm">Email</span>
                  <a
                    href="mailto:info@chimeralinsight.com"
                    className="font-medium hover:underline text-white"
                  >
                    info@chimeralinsight.com
                  </a>
                </p>

                <div className="pt-2">
                  <span className="block text-white/80 text-sm">Follow</span>
                  <div className="mt-3 flex items-center gap-3">
                    <a
                      href="https://www.facebook.com/profile.php?id=61573030175351"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/15 hover:bg-white/25 transition"
                      aria-label="Facebook"
                      title="Facebook"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        className="h-5 w-5"
                        aria-hidden="true"
                      >
                        <path d="M22 12a10 10 0 1 0-11.5 9.9v-7H8v-3h2.5V9.5a3.5 3.5 0 0 1 3.8-3.9c1.1 0 2.2.2 2.2.2v2.4h-1.3c-1.3 0-1.7.8-1.7 1.6V12H18l-.5 3h-2.9v7A10 10 0 0 0 22 12z" />
                      </svg>
                    </a>
                  </div>
                </div>

                <div className="mt-6 text-sm text-white/80">
                  <p>
                    By submitting this form you agree to our{" "}
                    <Link href="/terms" className="underline text-white">
                      Terms
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="underline text-white">
                      Privacy Policy
                    </Link>
                    .
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* /Info */}
        </div>
      </section>
    </main>
  );
}
