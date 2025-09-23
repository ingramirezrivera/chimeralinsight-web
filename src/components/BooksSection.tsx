"use client";

import Image from "next/image";
import Link from "next/link";
import { books } from "@/data/books"; // única fuente de datos

// ✅ Componente CTA con soporte para className adicional
function CTA({
  href,
  children,
  variant = "primary",
  ariaLabel,
  className = "",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  ariaLabel?: string;
  className?: string;
}) {
  const base =
    "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2 no-underline";
  const styles =
    variant === "primary"
      ? "bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-600"
      : "bg-gray-700 text-white hover:bg-gray-600 focus:ring-gray-500";

  return (
    <Link
      href={href}
      aria-label={ariaLabel}
      className={`${base} ${styles} ${className}`}
    >
      {children}
    </Link>
  );
}

export default function BooksSection() {
  return (
    <section id="books" className="w-full bg-teal-800/70">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <h2 className="text-4xl md:text-5xl font-semibold text-white tracking-wide mb-8 md:mb-12">
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
                  <div className="relative h-48 w-36 sm:h-56 md:h-60 lg:h-64 aspect-[3/4]">
                    <Image
                      src={b.coverSrc}
                      alt={`${b.title} cover`}
                      fill
                      className="rounded shadow-md object-cover"
                      sizes="(max-width: 768px) 144px, 192px"
                      priority={false}
                    />
                  </div>
                </div>

                {/* Text */}
                <div className="mt-5 md:mt-0 flex-1 text-white/95">
                  <h3 className="text-xl md:text-2xl font-medium">{b.title}</h3>

                  {b.subtitle && (
                    <p className="mt-1 text-sm text-white/70">{b.subtitle}</p>
                  )}

                  {b.description && (
                    <p className="mt-3 leading-relaxed text-white/90 md:pr-4">
                      {b.description}
                    </p>
                  )}

                  {/* Actions */}
                  <div className="mt-6 flex items-center gap-3">
                    {/* ✅ Solo este botón recibe el color rojo */}
                    <CTA
                      href={b.amazonUrl}
                      ariaLabel={`Buy ${b.title} on Amazon`}
                      className="!bg-[#bd0000] hover:!bg-[#a00000]"
                    >
                      Buy Now
                    </CTA>

                    <span className="text-white/70 text-sm">or</span>

                    {/* Learn More conserva su estilo gris */}
                    <CTA variant="secondary" href={`/books/${b.id}`}>
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
