"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import BookCard from "./BookCard";
import { books } from "@/data/books";
import { withBasePath } from "@/lib/paths";

export default function BooksCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);

  // --- util: centra el elemento del medio
  const centerMiddle = () => {
    const el = trackRef.current;
    if (!el || books.length === 0) return;

    const middleIndex = Math.floor(books.length / 2);
    const child = el.children.item(middleIndex) as HTMLElement | null;
    if (!child) return;

    const left = child.offsetLeft - (el.clientWidth - child.clientWidth) / 2;
    el.scrollLeft = Math.max(left, 0);
  };

  // --- util: calcula el padding lateral para que el 1º/último queden centrables
  const computeEdgePadding = () => {
    const el = trackRef.current;
    if (!el) return;

    const first = el.children.item(0) as HTMLElement | null;
    if (!first) return;

    const sidePad = Math.max((el.clientWidth - first.clientWidth) / 2, 0);
    // Publicamos en una CSS var del propio track
    el.style.setProperty("--side-pad", `${sidePad}px`);
  };

  // Centrar al montar y cuando cargan imágenes
  useEffect(() => {
    const el = trackRef.current;
    if (!el || books.length === 0) return;

    const handleAfterLayout = () => {
      computeEdgePadding();
      centerMiddle();
    };

    // 1) Al montar
    handleAfterLayout();

    // 2) Recalcular al cargar cada imagen dentro del carrusel (por posibles cambios de tamaño)
    const imgs = Array.from(el.querySelectorAll("img"));
    const pending = imgs.filter((img) => !img.complete);
    let loadedCount = 0;

    const onImgLoad = () => {
      loadedCount += 1;
      // Recalcular padding y recentrar cuando terminen de cargar varias
      computeEdgePadding();
      centerMiddle();
    };

    pending.forEach((img) => img.addEventListener("load", onImgLoad));
    // Por si hubo errores de carga
    pending.forEach((img) => img.addEventListener("error", onImgLoad));

    // 3) Recalcular en cada resize
    const onResize = () => {
      computeEdgePadding();
      centerMiddle();
    };
    window.addEventListener("resize", onResize);

    return () => {
      pending.forEach((img) => img.removeEventListener("load", onImgLoad));
      pending.forEach((img) => img.removeEventListener("error", onImgLoad));
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // Scroll con botones laterales (solo mobile)
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

  const mid = Math.floor(books.length / 2);
  const isPriorityIndex = (i: number) =>
    i === mid || i === mid - 1 || i === mid + 1;

  return (
    <div className="relative z-40 -mt-16 md:-mt-2 font-sans">
      <div className="relative text-white">
        {/* Fondo con clip en forma de punta */}
        <div
          className="
            absolute left-1/2 -translate-x-1/2 w-[104vw] inset-y-0
            -z-10 bg-[var(--brand)]
          "
          style={{
            clipPath: "polygon(0 0,100% 0,100% 90%,50% 100%,0 90%)",
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

        {/* Carrusel */}
        <div
          ref={trackRef}
          className={[
            "relative z-30",
            "-translate-y-12 md:-translate-y-16",
            "flex flex-nowrap", // una sola fila
            "justify-start", // el centrado real lo da el edge padding + snap-center
            "gap-8 md:gap-16",
            "overflow-x-auto overflow-y-visible",
            "snap-x snap-mandatory snap-always",
            "pb-14",
            "scroll-p-4",
            "scroll-smooth",
            "[-webkit-overflow-scrolling:touch]",
            "no-scrollbar",
          ].join(" ")}
          // ⬇️ Línea clave: padding lateral dinámico con CSS var calculada en JS
          style={{
            paddingLeft: "var(--side-pad, 4rem)",
            paddingRight: "var(--side-pad, 4rem)",
          }}
        >
          {books.map((book, i) => {
            const isPriority = isPriorityIndex(i);
            const imgLoading = isPriority ? "eager" : "lazy";

            const isUpcoming = book.availability === "upcoming";
            const cardHref = isUpcoming
              ? withBasePath(`/launch/${book.id}/`)
              : withBasePath(`/books/${book.id}/`);
            const section = isUpcoming ? "" : "buy"; // evita #buy en launch

            return (
              <div key={book.id} className="snap-center shrink-0">
                <BookCard
                  title={book.title}
                  imageUrl={book.coverSrc}
                  amazonUrl={
                    book.amazonUrl ?? withBasePath(`/books/${book.id}/#buy`)
                  }
                  bookHref={cardHref}
                  sectionId={section}
                  priority={isPriority}
                  loading={imgLoading}
                  availability={book.availability}
                  releaseDate={book.releaseDate}
                />
              </div>
            );
          })}
        </div>

        {/* Sección Amazon */}
        <div className="text-center -mt-16 md:mt-0 pb-10 flex flex-col items-center">
          <p className="text-3xl mb-4 text-white">Available on:</p>
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
    </div>
  );
}
