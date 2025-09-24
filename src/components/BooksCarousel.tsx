"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import BookCard from "./BookCard";
import { books } from "@/data/books";

export default function BooksCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);

  // Centrar el ítem medio al montar
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;

    // Restaurar posición
    const saved = sessionStorage.getItem("booksCarouselScroll");
    if (saved) el.scrollLeft = parseInt(saved, 10) || 0;

    // Guardar mientras se usa
    const onScroll = () =>
      sessionStorage.setItem("booksCarouselScroll", String(el.scrollLeft));

    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      sessionStorage.setItem("booksCarouselScroll", String(el.scrollLeft));
    };
  }, []);

  const scrollByDir = (dir: "left" | "right") => {
    const el = trackRef.current;
    if (!el) return;

    const step = Math.max(280, Math.floor(el.clientWidth * 0.8));
    const target = dir === "left" ? el.scrollLeft - step : el.scrollLeft + step;

    if (typeof el.scrollTo === "function") {
      el.scrollTo({ left: target, behavior: "smooth" } as ScrollToOptions);
    } else {
      el.scrollLeft = target;
    }
  };

  // Calcula cuáles serán prioritarias (central y vecinas)
  const mid = Math.floor(books.length / 2);
  const isPriorityIndex = (i: number) =>
    i === mid || i === mid - 1 || i === mid + 1;

  return (
    <div className="relative z-40 -mt-16 md:-mt-2 font-sans">
      <div className="relative text-white">
        <div
          className="absolute inset-0 -z-10 bg-[var(--brand)]"
          style={{
            clipPath: "polygon(0 0, 100% 0, 100% 90%, 50% 100%, 0 90%)",
          }}
        />

        {/* Flechas (solo en mobile) */}
        <button
          aria-label="Scroll left"
          onClick={() => scrollByDir("left")}
          className="md:hidden absolute left-2 top-48 -translate-y-1/2 z-40 rounded-full bg-black/40 backdrop-blur px-3 py-4 text-white"
        >
          ‹
        </button>
        <button
          aria-label="Scroll right"
          onClick={() => scrollByDir("right")}
          className="md:hidden absolute right-2 top-48 -translate-y-1/2 z-40 rounded-full bg-black/40 backdrop-blur px-3 py-4 text-white"
        >
          ›
        </button>

        {/* Track del carrusel */}
        <div
          ref={trackRef}
          className={[
            "relative z-30",
            "-translate-y-12 md:-translate-y-16",
            "flex flex-nowrap md:flex-wrap",
            "justify-start md:justify-center",
            "gap-8 md:gap-16",
            "overflow-x-auto overflow-y-visible md:overflow-visible",
            "snap-x snap-mandatory snap-always md:snap-none",
            "px-16 md:px-0 pb-14 md:pb-4",
            "scroll-p-4",
            "scroll-smooth",
            "[-webkit-overflow-scrolling:touch]",
          ].join(" ")}
        >
          {books.map((book, i) => (
            <div key={book.id} className="snap-center shrink-0 md:shrink">
              <BookCard
                title={book.title}
                imageUrl={book.coverSrc}
                amazonUrl={book.amazonUrl}
                priority={isPriorityIndex(i)}
                loading={isPriorityIndex(i) ? "eager" : "lazy"}
                blurDataURL={book.blurDataURL} // si lo tienes en tu data
              />
            </div>
          ))}
        </div>

        <div className="text-center -mt-16 md:mt-0 pb-10 flex flex-col items-center">
          <p className="text-3xl mb-4 text-white">Availables on:</p>
          <a
            href="https://www.amazon.com"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-64 md:w-96"
          >
            <Image
              src="/images/amazon-logo.png"
              alt="Amazon Logo"
              width={384}
              height={96}
              className="object-contain w-full h-auto"
              priority={false}
            />
          </a>
        </div>
      </div>
    </div>
  );
}
