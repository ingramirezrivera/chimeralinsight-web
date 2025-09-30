"use client";

import { useState } from "react";
// Ruta relativa desde src/app/launch/[id]/ hasta src/lib/paths
import { withBasePath } from "../../../lib/paths";

export interface RegisterProps {
  bookId: string;
  bookTitle: string;
}

export default function RegisterForLaunchForm({
  bookId,
  bookTitle,
}: RegisterProps) {
  const [email, setEmail] = useState<string>("");
  const [status, setStatus] = useState<"idle" | "ok" | "error" | "loading">(
    "idle"
  );

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch(withBasePath("/api/notify"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, bookId }),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("ok");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={onSubmit} className="mt-6 max-w-xl space-y-3">
      <label className="block text-sm font-medium text-neutral-700">
        Get notified about <span className="font-semibold">{bookTitle}</span>
      </label>
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
          disabled={status === "loading"}
          className="rounded-md bg-gray-900 text-white px-4 py-2 font-semibold hover:opacity-90 disabled:opacity-60"
        >
          {status === "loading" ? "Sending…" : "Notify Me"}
        </button>
      </div>
      {status === "ok" && (
        <p className="text-sm text-green-700">
          Thanks! We’ll notify you at launch.
        </p>
      )}
      {status === "error" && (
        <p className="text-sm text-red-700">
          Something went wrong. Please try again.
        </p>
      )}
    </form>
  );
}
