// src/components/BooksSection.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { books } from "@/data/books"; // única fuente de datos

type Retailer = { id: string; label: string; url: string };

// ✅ Componente CTA centralizado (se añade onClick opcional)
function CTA({
  href,
  children,
  variant = "primary",
  ariaLabel,
  className = "",
  fullWidth = false,
  isDisabled = false,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "custom";
  ariaLabel?: string;
  className?: string;
  fullWidth?: boolean;
  isDisabled?: boolean; // simulado para <a>
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void; // ← NUEVO
}) {
  const base =
    "rounded-md px-4 py-2 text-sm font-medium transition " +
    "focus:outline-none focus:ring-2 focus:ring-offset-2 no-underline";

  // 👇 Para que w-full funcione, usa display:flex (no inline-flex)
  const display = fullWidth
    ? "flex w-full justify-center"
    : "inline-flex items-center justify-center";

  const variants =
    variant === "primary"
      ? "bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-600"
      : variant === "secondary"
      ? "bg-gray-700 text-white hover:bg-gray-600 focus:ring-gray-500"
      : ""; // 'custom' -> sin colores por defecto

  const disabledClasses = isDisabled
    ? "pointer-events-none opacity-60 cursor-not-allowed"
    : "";

  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      aria-disabled={isDisabled || undefined}
      tabIndex={isDisabled ? -1 : 0}
      onClick={onClick} // ← pasa el handler si viene
      className={`${base} ${display} ${variants} ${disabledClasses} ${className}`}
    >
      {children}
    </Link>
  );
}

// ✅ Modal con blur (inline para mantener todo en este archivo)
function RetailerModal({
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
      <div className="mx-auto mt-24 w-[92%] max-w-3xl rounded-lg bg-teal-800 text-white shadow-2xl">
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
              className="inline-flex items-center justify-center rounded-md bg-cyan-400 hover:bg-cyan-300 text-teal-900 font-semibold px-6 py-3 text-lg transition no-underline"
            >
              {r.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function BooksSection() {
  const [selected, setSelected] = useState<null | {
    title: string;
    retailers: Retailer[];
  }>(null);

  return (
    <section id="books" className="w-full bg-teal-800/70 font-sans">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <h2 className="text-4xl md:text-5xl font-medium text-white tracking-wide mb-8 md:mb-12">
          Books
        </h2>

        <div className="space-y-12 md:space-y-16">
          {books.map((b) => {
            const retailers = (b as any).retailers as Retailer[] | undefined;
            const hasRetailers =
              Array.isArray(retailers) && retailers.length > 0;

            return (
              <article
                key={b.id}
                className="rounded-2xl border border-white/10 bg-teal-900/30 p-4 sm:p-6"
              >
                <div className="flex flex-col md:flex-row md:items-start md:gap-8">
                  {/* Cover */}
                  <div className="mx-auto md:mx-0 shrink-0">
                    <div className="relative h-96 w-64 sm:h-64 md:h-80 lg:h-96 aspect-[3/4]">
                      <Image
                        src={b.coverSrc}
                        alt={`${b.title} cover`}
                        fill
                        className="rounded shadow-md object-cover"
                        sizes="(max-width: 768px) 256px, 384px"
                        priority={false}
                      />
                    </div>
                  </div>

                  {/* Text */}
                  <div className="mt-5 md:mt-10 font-medium flex-1 text-white/95">
                    <h3 className="text-xl md:text-2xl">{b.title}</h3>

                    {b.subtitle && (
                      <p className="mt-1 text-lg text-white/70">{b.subtitle}</p>
                    )}

                    {b.description && (
                      <p className="mt-3 leading-relaxed text-white/90 md:pr-4">
                        {b.description}
                      </p>
                    )}

                    {/* Actions */}
                    <div className="m-6 flex flex-wrap items-center justify-center md:justify-start gap-3">
                      {/* Buy abre modal si hay retailers; si no, navega normal */}
                      <CTA
                        href={b.amazonUrl ?? "#"}
                        ariaLabel={`Buy ${b.title} on Amazon`}
                        variant="custom"
                        fullWidth
                        className="rounded-lg bg-cyan-400 hover:bg-cyan-300 text-teal-900 font-semibold px-8 py-4 text-lg transition-colors text-center mt-4 md:mt-0 md:w-auto"
                        onClick={
                          hasRetailers
                            ? (e) => {
                                e.preventDefault();
                                setSelected({
                                  title: b.title,
                                  retailers: retailers!,
                                });
                              }
                            : undefined
                        }
                      >
                        Buy on Amazon
                      </CTA>

                      <span className="text-white/70 text-lg">or</span>

                      {/* Learn More (gris) */}
                      <CTA
                        href={`/books/${b.id}`}
                        ariaLabel={`Learn more about ${b.title}`}
                        variant="custom"
                        fullWidth
                        className="rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-semibold px-8 py-4 text-lg transition-colors text-center mt-4 md:mt-0 md:w-auto"
                      >
                        Learn More …
                      </CTA>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* Modal */}
      <RetailerModal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected?.title ?? ""}
        retailers={selected?.retailers ?? []}
      />
    </section>
  );
}
