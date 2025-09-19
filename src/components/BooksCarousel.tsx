"use client";

import Image from "next/image";
import Link from "next/link";

const booksData = [
  {
    title: "The Tao of the Thirteenth Good",
    imageUrl: "/books/the-tao-of-the-thirteenth-good.jpg",
    amazonUrl: "#",
  },
  {
    title: "Vaccine: A Terrorism Thriller",
    imageUrl: "/books/vaccine.jpg",
    amazonUrl: "#",
  },
  {
    title: "Whip the Dogs",
    imageUrl: "/books/whip-the-dogs.jpg",
    amazonUrl: "#",
  },
];

interface BookCardProps {
  title: string;
  imageUrl: string;
  amazonUrl: string;
}

const BookCard = ({ title, imageUrl, amazonUrl }: BookCardProps) => {
  return (
    <div className="flex flex-col items-center justify-center">
      {/* Aumentamos el tamaño de la tarjeta y la hacemos destacar con una sombra mayor */}
      <div className="w-64 h-auto rounded-lg shadow-2xl overflow-hidden bg-surface">
        <Image
          src={imageUrl}
          alt={title}
          width={256} // Tamaño más grande para la imagen
          height={384} // Tamaño más grande para la imagen
          className="w-full h-auto object-cover"
        />
        <div className="p-4 flex flex-col items-center">
          <h3 className="text-lg font-bold text-fg text-center mt-2 mb-4">
            {title}
          </h3>
          <Link href={amazonUrl} className="btn btn-primary" legacyBehavior>
            <a className="w-full text-center">Buy Now</a>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default function BooksCarousel() {
  return (
    <div className="relative">
      {/* Contenedor principal con el borde en punta y el color de fondo */}
      <div
        className="bg-[var(--brand)] py-40 text-white relative z-0"
        style={{ clipPath: "polygon(0 0, 100% 0, 100% 90%, 50% 100%, 0 90%)" }}
      >
        {/* Contenedor de las tarjetas, superpuesto con un margen negativo */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 -mt-24 md:-mt-32">
          <div className="flex flex-wrap justify-center gap-8 -mt-24 md:-mt-32">
            {booksData.map((book) => (
              <BookCard
                key={book.title}
                title={book.title}
                imageUrl={book.imageUrl}
                amazonUrl={book.amazonUrl}
              />
            ))}
          </div>

          {/* Texto y logo de Amazon */}
          <div className="text-center mt-12 flex flex-col items-center">
            <p className="text-lg mb-4 text-white">Available on:</p>
            <a
              href="https://www.amazon.com"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="w-32 h-auto">
                <img
                  src="/images/amazon-logo.png"
                  alt="Amazon Logo"
                  className="object-contain"
                />
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
