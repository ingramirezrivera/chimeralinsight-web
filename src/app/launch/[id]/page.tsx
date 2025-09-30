// src/app/launch/[id]/page.tsx
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation"; // ⬅️ añadimos redirect
import { books } from "@/data/books";
import { withBasePath } from "@/lib/paths";
import RegisterForLaunchForm from "./RegisterForLaunchForm.client";

// Fuerza generación estática y que solo existan los params generados
export const dynamic = "force-static";
export const dynamicParams = false;

// Tipos mínimos (sin any)
interface BookData {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  coverSrc: string;
  availability?: "upcoming" | "available";
  releaseDate?: string; // ISO YYYY-MM-DD
}

function findBook(id: string): BookData | undefined {
  return books.find((b) => b.id === id) as BookData | undefined;
}

function formatRelease(dateISO?: string): string {
  if (!dateISO) return "Soon";
  const [y, m, d] = dateISO.split("-").map(Number);
  const date = new Date(Date.UTC(y, (m ?? 1) - 1, d ?? 1));
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

// ✅ Generamos TODAS las rutas para que existan los HTML en GH Pages
export function generateStaticParams() {
  return books.map((b) => ({ id: b.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const book = findBook(id);
  if (!book) return { title: "Launch | Book not found" };

  return {
    title: `Launch — ${book.title} | Chimeralinsight`,
    description:
      book.subtitle ?? book.description?.slice(0, 160) ?? "Book pre-launch",
    alternates: { canonical: withBasePath(`/launch/${book.id}/`) }, // ↩︎ slash final
  };
}

export default async function LaunchPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params; // 👈 importante
  const book = findBook(id);
  if (!book) notFound();

  // ⬅️ Si no está en prelaunch, redirige a la página normal del libro
  if (book.availability !== "upcoming") {
    redirect(withBasePath(`/books/${id}/`));
  }

  const releaseDate = book.releaseDate;
  const availability = book.availability;

  return (
    <main className="font-sans">
      <header className="bg-white">
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

      <section className="py-8 md:py-14 bg-white">
        <div className="container mx-auto px-4 md:max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Cover */}
            <div className="md:col-span-5">
              <div className="relative aspect-[3/4] w-full max-w-[420px] mx-auto overflow-hidden rounded-2xl shadow">
                <Image
                  src={withBasePath(book.coverSrc)}
                  alt={`${book.title} cover`}
                  fill
                  className="object-contain"
                  sizes="(min-width: 768px) 480px, 320px"
                  priority
                />
              </div>
            </div>

            {/* Copy + Form */}
            <div className="md:col-span-7">
              <p className="text-[#494949] tracking-wide">Pre-Launch</p>
              <h1 className="text-4xl md:text-5xl font-extrabold text-[#494949] leading-tight mt-1">
                {book.title}
              </h1>
              {book.subtitle && (
                <p className="mt-2 text-xl text-[#494949]">{book.subtitle}</p>
              )}

              <div className="mt-4">
                {(availability === "upcoming" || releaseDate) && (
                  <span className="inline-flex items-center rounded-md bg-yellow-500 text-white px-3 py-1 text-md font-semibold">
                    Coming Soon
                    {releaseDate ? ` — ${formatRelease(releaseDate)}` : ""}
                  </span>
                )}
              </div>

              <div className="mt-5 space-y-4 text-[#494949] leading-relaxed">
                <p>
                  Sign up to be notified the moment this title launches. We’ll
                  email you a direct link when it’s available.
                </p>
                {book.description && (
                  <p className="text-[15px] text-neutral-700">
                    {book.description}
                  </p>
                )}
              </div>

              <RegisterForLaunchForm bookId={book.id} bookTitle={book.title} />
            </div>
          </div>

          {/* Navegación secundaria */}
          <div className="mt-10 flex justify-center gap-3">
            <Link
              href={withBasePath(`/books/${book.id}/`)} // ↩︎ slash final
              className="rounded-lg bg-gray-800 text-white px-5 py-3 font-semibold hover:opacity-90 no-underline"
            >
              View Book Page
            </Link>
            <Link
              href={withBasePath("/#books")}
              className="rounded-lg bg-gray-700/70 text-white px-5 py-3 font-semibold hover:bg-gray-600 no-underline"
            >
              Back to Books
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
