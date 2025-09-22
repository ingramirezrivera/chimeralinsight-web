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
    <div className="flex flex-col items-center justify-center ">
      <div className="w-64 h-auto flex flex-col rounded-b-xl shadow-2xl overflow-hidden bg-surface">
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
            className="bg-[#bd0000] text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-[#a00000] transition-colors duration-300 w-full text-center hover:scale-105"
          >
            Buy Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BookCard;
