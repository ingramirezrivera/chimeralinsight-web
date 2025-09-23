// src/components/BookCard.tsx
"use client";

import Image from "next/image";
import Link from "next/link";

interface BookCardProps {
  title: string;
  imageUrl: string;
  amazonUrl: string;
}

const BookCard = ({ title, imageUrl, amazonUrl }: BookCardProps) => {
  return (
    <div className="flex flex-col items-center justify-center shrink-0 md:shrink">
      <div
        className="w-64 h-auto flex flex-col rounded-2xl bg-surface
            shadow-[0_20px_50px_-12px_rgba(0,0,0,0.35)]
            hover:shadow-[0_32px_80px_-20px_rgba(0,0,0,0.45)]
            transition-shadow duration-300 bg-black/70 backdrop-blur-lg"
      >
        {/* Usar relative y una altura fija para el contenedor de la imagen */}
        <div className="w-full h-96 relative">
          {/* Aquí está el cambio clave: usamos object-contain */}
          <Image src={imageUrl} alt={title} fill className="object-contain" />
        </div>

        <div className="p-4 flex flex-col items-center flex-grow">
          <div className="h-16 flex items-center justify-center flex-grow">
            <h3 className="text-lg font-bold text-fg text-center line-clamp-2">
              {title}
            </h3>
          </div>
          <Link
            href={amazonUrl}
            className="bg-[#bd0000] text-white font-bold py-3 px-6 rounded-lg hover:bg-[#a00000] transition-colors duration-300 w-full text-center hover:scale-105 hover:[text-decoration:none]"
          >
            Buy Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
