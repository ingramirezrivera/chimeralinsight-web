"use client";

import { useRef, useEffect, useLayoutEffect, useState } from "react";
import Image from "next/image";
import BookCard from "./BookCard";
import { books } from "@/data/books";
import { withBasePath } from "@/lib/paths";

export default function BooksCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);

  // ready = ya calculamos padding + centrado
  const [ready, setReady] = useState(false);
  // Mantiene altura mientras está oculto para evitar salto de página
  const [trackHeight, setTrackHeight] = useState<number | null>(null);

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
    el.style.setProperty("--side-pad", `${sidePad}px`);
  };

  // --- Centrado inicial ANTES del primer render visible
  useLayoutEffect(() => {
    const el = trackRef.current;
    if (!el || books.length === 0) return;

    // Guardamos altura estimada para reservar espacio y evitar “salto”
    // Si aún no hay hijos, usa un fallback razonable
    const firstChild = el.children.item(0) as HTMLElement | null;
    const estimated = firstChild?.offsetHeight ?? 420;
    setTrackHeight(estimated + 56 /* padding inferior pb-14 aprox */);

    // Desactiva cualquier suavizado SOLO para el ajuste inicial
    const prevBehavior = (el.style as any).scrollBehavior;
    (el.style as any).scrollBehavior = "auto";

    computeEdgePadding();
    centerMiddle();

    // Restaurar comportamiento previo
    (el.style as any).scrollBehavior = prevBehavior || "";

    // Habilitar render visible en el siguiente frame (ya centrado)
    requestAnimationFrame(() => setReady(true));
  }, []);

  // --- Recalcular al cargar imágenes y al hacer resize
  useEffect(() => {
    const el = trackRef.current;
    if (!el || books.length === 0) return;

    const handleAfterLayout = () => {
      computeEdgePadding();
      centerMiddle();
      // Actualiza altura reservada (por si cambia con imágenes)
      const firstChild = el.children.item(0) as HTMLElement | null;
      if (firstChild) setTrackHeight(firstChild.offsetHeight + 56);
    };

    handleAfterLayout();

    const imgs = Array.from(el.querySelectorAll("img"));
    const pending = imgs.filter((img) => !img.complete);

    const onImgLoad = () => {
      handleAfterLayout();
    };

    pending.forEach((img) => {
      img.addEventListener("load", onImgLoad);
      img.addEventListener("error", onImgLoad);
    });

    const onResize = () => {
      handleAfterLayout();
    };
    window.addEventListener("resize", onResize);

    return () => {
      pending.forEach((img) => {
        img.removeEventListener("load", onImgLoad);
        img.removeEventListener("error", onImgLoad);
      });
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // --- Scroll con botones laterales (solo mobile)
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

        {/* Placeholder / Skeleton mientras no está listo (opcional, no cambia diseño final) */}
        {!ready && (
          <div
            className="relative z-20 -translate-y-12 md:-translate-y-16 px-16 md:px-32"
            style={{ minHeight: trackHeight ?? 420 }}
            aria-hidden="true"
          >
            <div className="mx-auto max-w-5xl">
              <div className="grid grid-flow-col auto-cols-[minmax(180px,220px)] gap-8 md:gap-16 justify-center">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-xl ring-1 ring-white/10 bg-white/10 animate-pulse"
                    style={{ aspectRatio: "3/4" }}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Carrusel */}
        <div
          ref={trackRef}
          className={[
            "relative z-30",
            "-translate-y-12 md:-translate-y-16",
            "flex flex-nowrap",
            "justify-start",
            "gap-8 md:gap-16",
            "overflow-x-auto overflow-y-visible",
            // snap y smooth sólo visibles cuando ya está centrado
            ready ? "snap-x snap-mandatory snap-always scroll-smooth" : "",
            "pb-14",
            "scroll-p-4",
            "[-webkit-overflow-scrolling:touch]",
            "no-scrollbar",
            // Oculto hasta que esté centrado (sin “brinco”); mantiene el layout con height reservado
            ready
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none",
            "transition-opacity duration-200",
          ].join(" ")}
          style={{
            paddingLeft: "var(--side-pad, 4rem)",
            paddingRight: "var(--side-pad, 4rem)",
            minHeight: ready ? undefined : trackHeight ?? 420,
            // Forzamos behavior inicial a 'auto' aunque haya estilos globales
            scrollBehavior: ready ? undefined : "auto",
          }}
          aria-busy={!ready}
        >
          {books.map((book, i) => {
            const isPriority = isPriorityIndex(i);
            const imgLoading = isPriority ? "eager" : "lazy";

            const isUpcoming = book.availability === "upcoming";
            const cardHref = isUpcoming
              ? withBasePath(`/launch/${book.id}/`)
              : withBasePath(`/books/${book.id}/`);
            const section = isUpcoming ? "" : "buy";

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
