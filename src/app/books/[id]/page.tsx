// src/app/books/[id]/page.tsx
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { books } from "@/data/books";
import BuyRetailerModalButton from "@/components/BuyRetailerModalButton";
import { withBasePath } from "@/lib/paths";

type Retailer = { id: string; label: string; url: string };
type BookData = {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  about?: string;
  coverSrc: string;
  amazonUrl?: string;
  retailers?: Retailer[];
  availability?: "upcoming" | "available";
  releaseDate?: string; // ISO YYYY-MM-DD
};

// ⬇️ fuerza export estático y limita a params generados (GH Pages-friendly)
export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return books.map((b) => ({ id: b.id }));
}

// En Next 15, params llega como Promise
export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const book = books.find((b) => b.id === id) as BookData | undefined;
  if (!book) return { title: "Book not found" };

  const desc =
    book.subtitle ?? book.description?.slice(0, 160) ?? "Book details";

  return {
    title: `${book.title} | Chimeralinsight`,
    description: desc,
    // 👇 slash final para export/GitHub Pages
    alternates: { canonical: withBasePath(`/books/${book.id}/`) },
  };
}

/* ===== Helpers mínimos para pre-lanzamiento (sin any) ===== */
function isUpcoming(book: BookData): boolean {
  return book.availability === "upcoming";
}

function formatRelease(dateISO?: string): string {
  if (!dateISO) return "Soon";
  const [y, m, d] = dateISO.split("-").map(Number);
  const date = new Date(Date.UTC(y, (m ?? 1) - 1, d ?? 1));
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    timeZone: "UTC",
  });
}

export default async function BookPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const book = books.find((b) => b.id === id) as BookData | undefined;
  if (!book) notFound();

  const content: string = book.about ?? book.description ?? "";
  const retailers: Retailer[] | undefined = Array.isArray(book.retailers)
    ? book.retailers
    : undefined;

  const upcoming = isUpcoming(book);

  return (
    <main className="font-sans">
      {/* Cabecera simple */}
      <header className="bg-[var(--brand)] bg-white">
        <div className="container mx-auto px-6 py-6 flex items-center justify-between">
          <Link
            href={withBasePath("/")}
            className="no-underline hover:no-underline"
          >
            <span className="text-lg font-semibold hover:opacity-90">
              ← Back to Home
            </span>
          </Link>
          <Link
            href={withBasePath("/#books")}
            className="underline hover:opacity-90"
          >
            All Books
          </Link>
        </div>
      </header>

      {/* Cuerpo */}
      <section className="relative py-2 md:py-1 bg-white">
        <div className="container mx-auto px-4 md:max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 p-2 md:p-10 items-start rounded-2xl ">
            {/* Portada (completa, sin recortar) */}
            <div className="md:col-span-4">
              <div className="relative aspect-[3/4] w-full max-w-[360px] md:max-w-none mx-auto overflow-hidden">
                <Image
                  src={withBasePath(book.coverSrc)}
                  alt={`${book.title} cover`}
                  fill
                  className="object-contain"
                  sizes="(min-width: 768px) 420px, 320px"
                  placeholder="empty"
                  priority
                />
              </div>
            </div>

            {/* Texto */}
            <div className="md:col-span-8">
              <p className="text-[#494949] font-large tracking-wide">Book</p>
              <h1 className="text-4xl md:text-5xl font-extrabold text-[#494949] leading-tight mt-1">
                {book.title}
              </h1>

              {book.subtitle && (
                <p className="mt-2 text-xl text-[#494949]">{book.subtitle}</p>
              )}

              <div clas
