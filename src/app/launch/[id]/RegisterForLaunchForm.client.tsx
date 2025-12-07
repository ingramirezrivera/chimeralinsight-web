"use client";

import { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha"; // 👈 1. Importar librería

export interface RegisterProps {
  bookId: string;
  bookTitle: string;
}

export default function RegisterForLaunchForm({
  bookId,
  bookTitle,
}: RegisterProps) {
  const [email, setEmail] = useState<string>("");
  // 👈 2. Estado para el token
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);

  const [status, setStatus] = useState<"idle" | "ok" | "error" | "loading">(
    "idle"
  );
  const [errorMsg, setErrorMsg] = useState<string>("");

  const isValid = (val: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim());

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrorMsg("");

    if (!isValid(email)) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    // 👈 3. Validar que marcaron el captcha antes de enviar
    if (!captchaToken) {
      setErrorMsg("Please confirm that you are not a robot.");
      return;
    }

    setStatus("loading");

    try {
      // Nota: Asegúrate de que tu ruta /api/notify también espere el token
      const res = await fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          bookId,
          hp: "",
          recaptchaToken: captchaToken, // 👈 4. Enviamos el token
        }),
      });

      if (!res.ok) {
        let msg = "Something went wrong. Please try again.";
        try {
          const j = await res.json();
          msg = j?.error || j?.message || msg;
        } catch {}

        setStatus("error");
        setErrorMsg(msg);
        return;
      }

      setStatus("ok");
      setEmail("");
      setCaptchaToken(null); // Limpiamos el token
      setErrorMsg("");
    } catch (e) {
      console.error("Fetch Error:", e);
      setStatus("error");
      setErrorMsg("A network error occurred. Check your connection.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 max-w-xl space-y-3">
      <label className="block text-sm font-medium text-neutral-700">
        Get notified about <span className="font-semibold">{bookTitle}</span>
      </label>

      {/* Grupo Input + Botón */}
      <div className="flex gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="min-w-0 flex-1 rounded-md border px-3 py-2 outline-none focus:ring-2"
          aria-label="Email"
        />
        <button
          type="submit"
          // 👈 5. Botón deshabilitado si no hay captcha
          disabled={status === "loading" || !isValid(email) || !captchaToken}
          className="rounded-md bg-gray-900 text-white px-4 py-2 font-semibold hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {status === "loading" ? "Sending…" : "Notify Me"}
        </button>
      </div>

      {/* 👈 6. El Captcha visual (debajo del input para que se vea bien) */}
      <div className="mt-2">
        <ReCAPTCHA
          sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
          onChange={(token) => setCaptchaToken(token)}
        />
      </div>

      {status === "ok" && (
        <p className="text-sm text-green-700">
          Thanks! We’ll notify you at launch.
        </p>
      )}
      {status === "error" && (
        <p className="text-sm text-red-700">
          {errorMsg || "Something went wrong. Please try again."}
        </p>
      )}
    </form>
  );
}
