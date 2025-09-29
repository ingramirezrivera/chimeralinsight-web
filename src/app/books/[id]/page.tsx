// src/app/books/[id]/page.tsx
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { books } from "@/data/books";
import BuyRetailerModalButton from "@/components/BuyRetailerModalButton";
import { withBasePath } from "@/lib/paths";

type Book = (typeof books)[number];
type Retailer = { id: string; label: string; url: string };
type Extras = {
  about?: string;
  retailers?: Retailer[];
  amazonUrl?: string;
};

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
  const book = books.find((b) => b.id === id);
  if (!book) return { title: "Book not found" };

  const desc =
    book.subtitle ?? book.description?.slice(0, 160) ?? "Book details";

  return {
    title: `${book.title} | Chimeralinsight`,
    description: desc,
    alternates: { canonical: `/books/${book.id}` },
  };
}

export default async function BookPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const book = books.find((b) => b.id === id) as Book | undefined;
  if (!book) notFound();

  // Campos opcionales que algunos libros pueden traer
  const extras = book as unknown as Extras;

  const content: string = extras.about ?? book.description ?? "";
  const retailers: Retailer[] | undefined = Array.isArray(extras.retailers)
    ? extras.retailers
    : undefined;

  return (
    <main className="font-sans">
      {/* Cabecera simple */}
      <header className="bg-[var(--brand)] bg-white">
        <div className="container mx-auto px-6 py-6 flex items-center justify-between">
          <Link href="/" className="no-underline hover:no-underline">
            <span className="text-lg font-semibold hover:opacity-90">
              ← Back to Home
            </span>
          </Link>
          <Link href="/#books" className="underline hover:opacity-90">
            All Books
          </Link>
        </div>
      </header>

      {/* Cuerpo */}
      <section className="relative py-16 bg-white">
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

              <div className="mt-5 space-y-4 text-[#494949] leading-relaxed">
                {(content ?? "")
                  .split(/\n\s*\n/)
                  .map((para: string, i: number) => (
                    <p key={i}>{para}</p>
                  ))}
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-3">
                {/* Abre modal si hay retailers; si no, usa href */}
                <BuyRetailerModalButton
                  title={book.title}
                  retailers={retailers}
                  href={extras.amazonUrl}
                  ariaLabel={`Buy ${book.title} on Amazon`}
                  className="rounded-lg bg-cyan-400 hover:bg-cyan-300 text-teal-900
                             font-semibold px-6 py-3 text-lg transition-colors no-underline"
                >
                  Buy on Amazon
                </BuyRetailerModalButton>

                <Link
                  href="/#books"
                  className="rounded-lg bg-gray-700 hover:bg-gray-600 text-white
                             font-semibold px-6 py-3 text-lg transition-colors no-underline"
                >
                  Back to Books
                </Link>
              </div>
            </div>
          </div>

          {/* Logo Amazon opcional */}
          <div className="text-center mt-10 pb-10 flex flex-col items-center">
            <p className="text-2xl mb-4 text-neutral-700">Available on:</p>
            <a
              href="https://www.amazon.com"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-64 md:w-96"
            >
              <Image
                src={withBasePath("/images/amazon-logo.png")}
                alt="Amazon Logo"
                width={384}
                height={96}
                className="object-contain w-full h-auto"
              />
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
