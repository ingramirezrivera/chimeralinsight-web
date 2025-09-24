// src/components/BooksSection.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { books } from "@/data/books"; // única fuente de datos

// ✅ Componente CTA centralizado
function CTA({
  href,
  children,
  variant = "primary",
  ariaLabel,
  className = "",
  fullWidth = false,
  isDisabled = false,
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "custom";
  ariaLabel?: string;
  className?: string;
  fullWidth?: boolean;
  isDisabled?: boolean; // simulado para <a>
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
      : ""; // 'custom' -> sin colores por defecto; dejará pasar tus clases

  const disabledClasses = isDisabled
    ? "pointer-events-none opacity-60 cursor-not-allowed"
    : "";

  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      aria-disabled={isDisabled || undefined}
      tabIndex={isDisabled ? -1 : 0}
      className={`${base} ${display} ${variants} ${disabledClasses} ${className}`}
    >
      {children}
    </Link>
  );
}

export default function BooksSection() {
  return (
    <section id="books" className="w-full bg-teal-800/70 font-sans">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <h2 className="text-4xl md:text-5xl font-medium text-white tracking-wide mb-8 md:mb-12">
          Books
        </h2>

        <div className="space-y-12 md:space-y-16">
          {books.map((b) => (
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
                    {/* Buy (rojo) */}
                    <CTA
                      href={b.amazonUrl}
                      ariaLabel={`Buy ${b.title} on Amazon`}
                      variant="custom" // ← sin estilos por defecto
                      fullWidth // ← ahora sí respeta w-full
                      className="rounded-lg bg-cyan-400 hover:bg-cyan-300 text-teal-900 font-semibold px-8 py-4 text-lg transition-colors text-center mt-4 md:mt-0 md:w-auto"
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
          ))}
        </div>
      </div>
    </section>
  );
}
