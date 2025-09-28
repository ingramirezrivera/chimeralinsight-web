// src/app/presskit/page.tsx
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { books } from "@/data/books";
import { withBasePath } from "@/lib/paths"; // ✅ IMPORTANTE

export const metadata: Metadata = {
  title: "Press Kit | Chimeralinsight",
  description:
    "Official press kit: author bio and books. Download covers and view details.",
  alternates: { canonical: "/presskit" },
};

type BookItem = {
  id: string;
  title: string;
  coverSrc: string;
  subtitle?: string;
  description?: string;
  amazonUrl?: string;
};

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl bg-white shadow-sm ring-1 ring-black/5 p-6 md:p-8">
      <h2 className="text-2xl md:text-3xl font-extrabold text-[#494949]">
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

export default function PresskitPage() {
  const booksList = books as unknown as BookItem[];

  const bioParagraphs: string[] = [
    "Robin C. Rickards es un autor enfocado en thrillers e ideas de alto impacto, combinando investigación rigurosa con narrativa ágil.",
    "Su trabajo explora la tensión entre ciencia, ética y poder, con especial atención a cómo la tecnología transforma la seguridad, la salud pública y la libertad individual.",
    "Actualmente desarrolla nuevos proyectos ambientados en escenarios contemporáneos, con personajes complejos y tramas que invitan a la reflexión.",
  ];

  return (
    <main className="font-sans">
      {/* Header compacto */}
      <header className="bg-[var(--brand,#0f766e)] text-white shadow">
        <div className="container mx-auto px-6 py-6 flex items-center justify-between">
          <Link href="/" className="no-underline hover:no-underline">
            <span className="text-lg font-semibold hover:opacity-90">
              ← Back to Home
            </span>
          </Link>
          <Link href="/#books" className="underline hover:opacity-90">
            Books
          </Link>
        </div>
      </header>

      {/* Body */}
      <div className="bg-teal-50">
        <div className="container mx-auto px-4 md:px-6 py-10 md:py-16 max-w-6xl">
          {/* Hero */}
          <div className="mb-8 md:mb-12 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#494949]">
              Press Kit
            </h1>
            <p className="mt-3 text-neutral-700">Author bio & selected books</p>
          </div>

          {/* === Cuadro centrado: BIO + BOOKS === */}
          <div className="flex justify-center">
            <div className="w-full max-w-3xl space-y-6 md:space-y-8">
              {/* BIO */}
              <Section title="Biography">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-8 items-start">
                  {/* Headshot */}
                  <div className="md:col-span-2">
                    <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-white ring-1 ring-black/5">
                      <Image
                        src={withBasePath("/images/author-robin.png")} // ✅
                        alt="Author headshot"
                        fill
                        className="object-contain"
                        sizes="(min-width: 768px) 40vw, 100vw"
                        priority={false}
                      />
                    </div>
                  </div>

                  {/* Texto bio */}
                  <div className="md:col-span-3">
                    <h3 className="text-xl md:text-2xl font-bold text-[#494949]">
                      Robin C. Rickards
                    </h3>
                    <p className="text-neutral-600 mt-1">
                      Author & Storyteller
                    </p>
                    <div className="mt-4 space-y-3 text-neutral-700 leading-relaxed">
                      {bioParagraphs.map((para: string, i: number) => (
                        <p key={i}>{para}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </Section>

              {/* BOOKS */}
              <Section title="Books">
                {booksList.length === 0 ? (
                  <p className="text-neutral-700">No books available.</p>
                ) : (
                  <div className="space-y-8">
                    {booksList.map((b: BookItem) => (
                      <article
                        key={b.id}
                        className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-8 items-start rounded-xl bg-white"
                      >
                        {/* Cover */}
                        <div className="md:col-span-2">
                          <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden shadow-sm ring-1 ring-black/5 bg-white">
                            <Image
                              src={withBasePath(b.coverSrc)} // ✅
                              alt={`${b.title} cover`}
                              fill
                              className="object-contain"
                              sizes="(min-width: 768px) 40vw, 100vw"
                              priority={false}
                            />
                          </div>
                        </div>

                        {/* Copy */}
                        <div className="md:col-span-3">
                          <h3 className="text-2xl font-bold text-[#494949]">
                            {b.title}
                          </h3>
                          {b.subtitle && (
                            <p className="mt-1 text-lg text-neutral-600">
                              {b.subtitle}
                            </p>
                          )}
                          {b.description && (
                            <p className="mt-3 text-neutral-700 leading-relaxed">
                              {b.description}
                            </p>
                          )}

                          <div className="mt-5 flex flex-wrap items-center gap-3">
                            <Link
                              href={`/books/${b.id}`}
                              className="rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-semibold px-5 py-3 text-base transition-colors no-underline"
                              aria-label={`Learn more about ${b.title}`}
                            >
                              Learn More
                            </Link>

                            {b.amazonUrl && (
                              <a
                                href={b.amazonUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-lg bg-cyan-400 hover:bg-cyan-300 text-teal-900 font-semibold px-5 py-3 text-base transition-colors no-underline"
                                aria-label={`Buy ${b.title} on Amazon`}
                              >
                                Buy on Amazon
                              </a>
                            )}
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </Section>
            </div>
          </div>
          {/* === /Cuadro centrado === */}
        </div>
      </div>
    </main>
  );
}
