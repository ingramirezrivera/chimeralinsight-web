"use client";

import { useEffect, useRef } from "react";

// Si ya tienes este tipo en tu data, puedes borrar esta línea y usar el de ahí.
export type Retailer = { id: string; label: string; url: string };

export default function RetailerModal({
  open,
  onClose,
  title,
  retailers,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  retailers: Retailer[];
}) {
  const firstBtnRef = useRef<HTMLAnchorElement | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.documentElement.classList.add("overflow-hidden");
    return () => {
      document.removeEventListener("keydown", onKey);
      document.documentElement.classList.remove("overflow-hidden");
    };
  }, [open, onClose]);

  useEffect(() => {
    if (open && firstBtnRef.current) firstBtnRef.current.focus();
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="retailer-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="mx-auto mt-24 w-[92%] max-w-3xl rounded-lg bg-[var(--brand)] text-white shadow-2xl">
        <div className="flex items-start justify-between p-6">
          <h2
            id="retailer-title"
            className="text-2xl md:text-3xl font-extrabold"
          >
            Choose Your Retailer
          </h2>
          <button
            aria-label="Close"
            onClick={onClose}
            className="rounded p-2 hover:bg-teal-700/60"
          >
            ✕
          </button>
        </div>

        {title && (
          <p className="px-6 -mt-3 mb-4 text-white/80">
            for <strong>{title}</strong>
          </p>
        )}

        <div className="px-6 pb-6 flex flex-wrap items-center justify-center gap-4">
          {retailers.map((r, i) => (
            <a
              key={r.id}
              href={r.url}
              ref={i === 0 ? firstBtnRef : undefined}
              target="_blank"
              rel="noopener noreferrer"
              className="w-48 inline-flex items-center justify-center rounded-md bg-cyan-400 hover:bg-cyan-300 text-teal-900 font-semibold px-6 py-3 text-lg transition no-underline"
            >
              {r.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
