// src/components/BookCard.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { withBasePath } from "@/lib/paths";

type Availability = "upcoming" | "available";

interface BookCardProps {
  title: string;
  imageUrl: string; // ej: "/images/cover.png"
  bookHref?: string; // ej: "/books/tao" o "/books/tao/" (puede venir con o sin basePath)
  sectionId?: string; // ej: "buy"
  priority?: boolean;
  loading?: "eager" | "lazy";
  blurDataURL?: string;
  availability?: Availability; // solo para la etiqueta del botón
  releaseDate?: string;
  amazonUrl?: string; // compat con otros componentes (no se usa en la CTA)
}

/* ===== Helpers SOLO de rutas (sin tocar estilos) ===== */

// basePath público que Next inyecta en build (cadena, ej: "/chimeralinsight-web" o "")
const BASE = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

// Quita el basePath si ya viene en la ruta (evita duplicarlo)
function stripBasePath(href: string): string {
  if (!BASE) return href;
  if (href.startsWith(BASE + "/")) return href.slice(BASE.length);
  if (href === BASE) return "/";
  return href;
}

// Asegura "/" inicial y "/" final (compat con trailingSlash: true)
function normalizeInternal(href: string): string {
  let h = href.startsWith("/") ? href : `/${href}`;
  if (!h.endsWith("/")) h += "/";
  return h;
}

function isUpcoming(av?: Availability): boolean {
  return av === "upcoming";
}
function formatMonthYearAbbrev(dateISO?: string): string {
  if (!dateISO) return "Soon";
  const [y, m, d] = dateISO.split("-").map(Number);
  const dt = new Date(Date.UTC(y, (m ?? 1) - 1, d ?? 1));
  return dt.toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}

export default function BookCard({
  title,
  imageUrl,
  bookHref,
  sectionId = "buy",
  priority = false,
  loading,
  blurDataURL,
  availability,
  releaseDate,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  amazonUrl,
}: BookCardProps) {
  const resolvedLoading: "eager" | "lazy" =
    loading ?? (priority ? "eager" : "lazy");

  // 1) Quitar basePath si ya viene en bookHref
  const raw = bookHref ?? "/"; // fallback
  const noBase = stripBasePath(raw); // "/books/tao/" (sin /chimeralinsight-web)
  // 2) Normalizar para export estático
  const basePage = normalizeInternal(noBase); // asegura "/" inicial y final
  // 3) Anchor opcional
  const href = sectionId ? `${basePage}#${sectionId}` : basePage;
  // 👉 Pasamos href SIN basePath a <Link>; Next añadirá el basePath en el HTML final.

  const ctaLabel = isUpcoming(availability)
    ? formatMonthYearAbbrev(releaseDate)
    : "Buy";
  const aria = isUpcoming(availability)
    ? `Releases ${ctaLabel}`
    : `Buy ${title}`;

  return (
    <div className="flex flex-col items-center justify-center shrink-0 md:shrink font-sans">
      <div
        className="w-64 h-auto flex flex-col rounded-2xl bg-surface
                   shadow-[0_20px_50px_-12px_rgba(0,0,0,0.35)]
                   hover:shadow-[0_32px_80px_-20px_rgba(0,0,0,0.45)]
                   transition-shadow duration-300 bg-black/70 backdrop-blur-lg"
      >
        {/* Imagen (sin cambios de estilo) */}
        <div className="w-full h-96 relative rounded-2xl bg-white/10">
          <Image
            src={withBasePath(imageUrl)} // mantener como lo tienes
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

          {/* CTA: SIEMPRE interna con <Link>, SIN basePath en href */}
          <Link
            href={href}
            aria-label={aria}
            className="w-full rounded-lg bg-cyan-400 hover:bg-cyan-300 text-teal-900
                       font-semibold px-6 py-3 text-lg transition-colors
                       text-center mt-4 hover:[text-decoration:none]"
          >
            {ctaLabel}
          </Link>
        </div>
      </div>
    </div>
  );
}
