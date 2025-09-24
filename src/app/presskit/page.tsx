// src/app/presskit/page.tsx
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { books } from "@/data/books";
import PressContactForm from "@/components/PressContactForm";

export const metadata: Metadata = {
  title: "Press Kit | Chimeralinsight",
  description:
    "Author bio, books, and a secure contact form for press inquiries.",
  alternates: { canonical: "/presskit" },
};

function firstParagraph(s?: string) {
  return (s ?? "").split(/\n\s*\n/)[0] || "";
}

export default function PresskitPage() {
  // 📸 Rutas de la foto (cámbialas si usas otras)
  const authorPhotoPreview = "/images/author-robin.png";
  const authorPhotoDownload = "/presskit/author-headshot-web.jpg";

  // ✍️ Bio (la que compartiste)
  const bioParas = [
    "Robin Rickards is a dual British-Canadian citizen with over 40 years of work in the medical field. He currently works part-time as an orthopedic surgeon, and lives with his beautiful Latina wife, four dogs and two cats—and sometimes a small weasel—near Vancouver, British Columbia. Robin speaks several languages but only one well (many may even dispute that!).",
    "Reading has been his passion and writing has always been his desire. Ideas for his books are derived from reality, past events and current events; all with a twist, all peppered with fact and all frighteningly believable.",
    "Robin has five completed novels—each written in the “Thriller” genre. The sixth is on its way; the seventh and eighth novels are in the oven. He is a recipient of The Literary Titans Book Award 2025 for his novel Vaccine: A Terrorism Thriller.",
    "Resurrected from the Dead: Robin has brought back to life his successful older website. Articles deal with subject matter in each of his novels and will be regularly updated. Please visit using the link below:",
  ];

  return (
    <main className="font-sans">
      {/* Hero */}
      <section className="bg-[var(--brand)] text-white">
        <div className="container mx-auto px-6 py-12 md:py-16">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
            Press Kit
          </h1>
          <p className="mt-3 text-white/90 max-w-2xl">
            Author bio, books, and a secure contact form for press inquiries.
          </p>
        </div>
      </section>

      {/* AUTHOR: Foto + Biography */}
      <section id="author" className="bg-white">
        <div className="container mx-auto px-6 py-10 md:py-12">
          <div className="grid gap-8 md:grid-cols-12">
            {/* Foto */}
            <div className="md:col-span-4">
              <h2 className="text-2xl font-bold text-white/90 sr-only">
                Author Photo
              </h2>
              <div className="relative aspect-[4/5] w-full rounded-lg overflow-hidden bg-neutral-100 shadow">
                <Image
                  src={authorPhotoPreview}
                  alt="Author headshot of Robin Rickards"
                  fill
                  className="object-cover"
                  sizes="(min-width:768px) 360px, 90vw"
                  priority
                />
              </div>
              <a
                href={authorPhotoDownload}
                download
                className="mt-3 inline-block text-teal-900 hover:underline"
              >
                Download
              </a>
            </div>

            {/* Biografía */}
            <div className="md:col-span-8">
              <h2 className="text-2xl md:text-3xl font-bold text-[#e5f4f3] sr-only">
                Biography
              </h2>
              <h3 className="text-2xl md:text-3xl font-bold text-[#494949]">
                Biography
              </h3>
              <p className="mt-3 font-semibold text-neutral-800">
                About the Author:
              </p>
              <div className="mt-2 space-y-4 text-neutral-700 leading-relaxed">
                {bioParas.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
                <p>
                  <Link
                    href="https://chimeralinsight.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-cyan-700 underline hover:no-underline"
                  >
                    https://www.chimeralinsight.com
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BOOKS */}
      <section id="books" className="bg-white">
        <div className="container mx-auto px-6 pb-14">
          <h2 className="text-2xl md:text-3xl font-bold text-[#494949]">
            Books
          </h2>

          <div className="mt-6 space-y-8">
            {books.map((b) => (
              <article
                key={b.id}
                className="rounded-2xl border border-neutral-200 p-5"
              >
                <div className="grid gap-6 md:grid-cols-12 items-start">
                  <div className="md:col-span-3">
                    <div className="relative w-full aspect-[3/4] rounded-lg overflow-hidden bg-white">
                      <Image
                        src={b.coverSrc}
                        alt={`${b.title} cover`}
                        fill
                        className="object-contain"
                        sizes="(min-width:768px) 260px, 60vw"
                      />
                    </div>
                  </div>
                  <div className="md:col-span-9">
                    <h3 className="text-xl md:text-2xl font-semibold text-[#494949]">
                      {b.title}
                    </h3>
                    {b.subtitle && (
                      <p className="text-base text-neutral-600 mt-1">
                        {b.subtitle}
                      </p>
                    )}
                    <p className="mt-3 text-neutral-700 leading-relaxed">
                      {firstParagraph((b as any).about ?? b.description)}
                    </p>
                    <div className="mt-4 flex flex-wrap gap-3">
                      <Link
                        href={`/books/${b.id}`}
                        className="rounded-lg bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 text-sm no-underline"
                      >
                        Book Page
                      </Link>
                      {Array.isArray((b as any).retailers) &&
                      (b as any).retailers.length > 0 ? (
                        <a
                          href={(b as any).retailers[0].url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-lg bg-cyan-400 hover:bg-cyan-300 text-teal-900 px-4 py-2 text-sm font-medium no-underline"
                        >
                          Buy: {(b as any).retailers[0].label}
                        </a>
                      ) : (b as any).amazonUrl ? (
                        <a
                          href={(b as any).amazonUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded-lg bg-cyan-400 hover:bg-cyan-300 text-teal-900 px-4 py-2 text-sm font-medium no-underline"
                        >
                          Buy on Amazon
                        </a>
                      ) : null}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
