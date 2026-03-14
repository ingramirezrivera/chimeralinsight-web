"use client";

import Link from "next/link";

export default function ContactPage() {
  return (
    <main
      className="min-h-[calc(100vh-var(--nav-h,80px))] bg-white font-sans"
      style={{ scrollMarginTop: "var(--nav-h, 80px)" }}
    >
      <section className="relative bg-[var(--brand,#0f766e)] text-white">
        <div className="container mx-auto px-4 lg:px-10 py-20 lg:py-24">
          <h1 className="text-4xl lg:text-5xl font-bold tracking-tight">Contact</h1>
          <p className="mt-3 max-w-2xl text-white/90">
            Send us a note - we&apos;ll get back to you as soon as possible.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-12 lg:px-10 lg:py-16">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="rounded-2xl bg-[var(--brand,#0f766e)] p-6 text-white shadow-xl sm:p-8 lg:sticky lg:top-[calc(var(--nav-h,80px)+16px)]">
              <h2 className="text-2xl font-semibold">Contact details</h2>
              <p className="mt-2 text-white/90">Reach us directly to:</p>

              <div className="mt-6 space-y-4 text-white/95">
                <p>
                  <span className="block text-sm text-white/80">Email</span>
                  <a
                    href="mailto:info@chimeralinsight.com"
                    className="font-medium text-white hover:underline"
                  >
                    robinrthrillers@chimeralinsight.com
                  </a>
                </p>

                <div className="pt-2">
                  <span className="block text-sm text-white/80">Follow</span>
                  <div className="mt-3 flex items-center gap-3">
                    <a
                      href="https://www.facebook.com/profile.php?id=61573030175351"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/15 transition hover:bg-white/25"
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
        </div>
      </section>
    </main>
  );
}
