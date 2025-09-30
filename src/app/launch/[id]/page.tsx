// src/app/launch/[id]/page.tsx
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { books } from "@/data/books";
import { withBasePath } from "@/lib/paths";

type Params = { id: string };

export function generateStaticParams() {
  // Solo generamos páginas de prelaunch para libros "upcoming"
  return books
    .filter((b) => b.availability === "upcoming")
    .map((b) => ({ id: b.id }));
}

// En Next 15, params llega como Promise
export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { id } = await params;
  const book = books.find((b) => b.id === id && b.availability === "upcoming");
  if (!book) return { title: "Pre-launch not found" };

  const datePretty = book.releaseDate
    ? new Date(book.releaseDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
      })
    : undefined;

  return {
    title: `${book.title} — Pre-launch`,
    description:
      book.subtitle ??
      book.description ??
      `Pre-launch page for ${book.title}${
        datePretty ? ` — Coming ${datePretty}` : ""
      }.`,
    openGraph: {
      title: `${book.title} — Pre-launch`,
      images: [{ url: withBasePath(book.coverSrc) }],
    },
  };
}

export default async function PrelaunchPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { id } = await params;
  const book = books.find((b) => b.id === id && b.availability === "upcoming");
  if (!book) notFound();

  const datePretty = book.releaseDate
    ? new Date(book.releaseDate).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: undefined,
      })
    : null;

  return (
    <main className="relative font-sans">
      {/* Banda superior con color de marca */}
      <div
        className="absolute left-1/2 -translate-x-1/2 w-[104vw] inset-y-0 -z-10 bg-[var(--brand)]"
        style={{ clipPath: "polygon(0 0,100% 0,100% 90%,50% 100%,0 90%)" }}
        aria-hidden="true"
      />

      <section className="container mx-auto px-6 md:px-10 pt-28 pb-20 text-white">
        <div className="grid md:grid-cols-[320px,1fr] gap-10 items-start">
          {/* Cover */}
          <div className="mx-auto md:mx-0 w-[260px] md:w-[320px]">
            <Image
              src={withBasePath(book.coverSrc)}
              alt={`${book.title} cover`}
              width={640}
              height={960}
              className="w-full h-auto rounded-lg shadow-2xl object-contain"
              priority
            />
          </div>

          {/* Info */}
          <div>
            <h1 className="text-4xl md:text-5xl font-bold">{book.title}</h1>
            {book.subtitle ? (
              <p className="mt-2 text-xl opacity-90">{book.subtitle}</p>
            ) : null}

            <div className="mt-6 p-4 rounded-xl bg-white/10 backdrop-blur">
              <p className="text-lg">
                <span className="font-semibold">Status:</span> Pre-launch (WIP)
              </p>
              {datePretty && (
                <p className="text-lg">
                  <span className="font-semibold">Release:</span> {datePretty}
                </p>
              )}
              <p className="mt-2 opacity-90">
                We’re putting the final touches on the launch materials. Join
                the mailing list and be the first to know when pre-orders open.
              </p>
            </div>

            {/* CTA principal: Mailing List */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                href={withBasePath("/mailing-list")}
                className="inline-flex items-center gap-2 rounded-lg bg-black/80 text-white px-5 py-3 font-semibold hover:opacity-90 hover:[text-decoration:none] transition-transform duration-200 hover:scale-105"
              >
                Join the mailing list
              </Link>

              {/* Botón disabled de compra para dejar claro que no hay #buy aquí */}
              <button
                disabled
                className="inline-flex items-center gap-2 rounded-lg bg-white/20 text-white/80 px-5 py-3 font-semibold cursor-not-allowed"
                title="Purchasing will be available at launch"
              >
                Purchasing soon
              </button>
            </div>

            {/* Nota: sin #buy, sin retailers, sin Amazon directo */}
            <p className="mt-4 text-sm opacity-80">
              Note: Purchase links will be enabled on launch day.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
