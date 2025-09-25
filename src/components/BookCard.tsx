// src/components/BookCard.tsx
"use client";

import Image from "next/image";
import Link from "next/link";

interface BookCardProps {
  title: string;
  imageUrl: string;
  /** URL externa a Amazon (opcional) */
  amazonUrl?: string;
  /** Ruta interna a la página del libro, ej: /books/tao (opcional) */
  bookHref?: string;
  /** Sección a la que quieres saltar, ej: "buy" (por defecto) */
  sectionId?: string;
  priority?: boolean;
  loading?: "eager" | "lazy";
  blurDataURL?: string;
}

const BookCard = ({
  title,
  imageUrl,
  amazonUrl,
  bookHref,
  sectionId = "buy",
  priority = false,
  loading,
  blurDataURL,
}: BookCardProps) => {
  const resolvedLoading: "eager" | "lazy" =
    loading ?? (priority ? "eager" : "lazy");

  const hasBookPage = typeof bookHref === "string" && bookHref.length > 0;
  const hasAmazon = typeof amazonUrl === "string" && amazonUrl.length > 0;

  // Si hay bookHref, construye /books/[id]#buy; si no, usa amazonUrl; si no hay nada, "#"
  const href: string = hasBookPage
    ? `${bookHref!}${sectionId ? `#${sectionId}` : ""}`
    : hasAmazon
    ? amazonUrl!
    : "#";

  // externo solo si vamos a Amazon (cuando no hay page interna)
  const isExternal = !hasBookPage && hasAmazon;

  return (
    <div className="flex flex-col items-center justify-center shrink-0 md:shrink font-sans">
      <div
        className="w-64 h-auto flex flex-col rounded-2xl bg-surface
                   shadow-[0_20px_50px_-12px_rgba(0,0,0,0.35)]
                   hover:shadow-[0_32px_80px_-20px_rgba(0,0,0,0.45)]
                   transition-shadow duration-300 bg-black/70 backdrop-blur-lg"
      >
        {/* Contenedor estable para la imagen */}
        <div className="w-full h-96 relative rounded-2xl bg-white/10">
          <Image
            src={imageUrl}
            alt={`${title} cover`}
            fill
            className="object-contain"
            sizes="256px"
            placeholder="blur"
            blurDataURL={
              blurDataURL ?? "data:image/gif;base64,R0lGODlhAQABAAAAACw="
            }
            priority={priority}
            loading={resolvedLoading}
          />
        </div>

        <div className="p-4 flex flex-col items-center flex-grow">
          <div className="h-16 flex items-center justify-center flex-grow">
            <h3 className="text-lg font-bold text-fg text-center line-clamp-2">
              {title}
            </h3>
          </div>

          <Link
            href={href}
            {...(isExternal
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
            aria-label={`Buy ${title}${isExternal ? " on Amazon" : ""}`}
            className="w-full rounded-lg bg-cyan-400 hover:bg-cyan-300 text-teal-900
                       font-semibold px-6 py-3 text-lg transition-colors
                       text-center mt-4 hover:[text-decoration:none]"
          >
            Available Oct 1st
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
