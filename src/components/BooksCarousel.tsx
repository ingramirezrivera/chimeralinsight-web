"use client";

import BookCard from "./BookCard";

const booksData = [
  {
    title: "The Tao of the Thirteenth Good",
    imageUrl: "/books/the-tao-of-the-thirteenth-good.jpg",
    amazonUrl: "https://www.amazon.com/dp/XXXXXXXX",
  },
  {
    title: "Vaccine: A Terrorism Thriller",
    imageUrl: "/books/vaccine.jpg",
    amazonUrl: "https://www.amazon.com/dp/XXXXXXXX",
  },
  {
    title: "Whip the Dogs",
    imageUrl: "/books/whip-the-dogs.jpg",
    amazonUrl: "https://www.amazon.com/dp/XXXXXXXX",
  },
];

export default function BooksCarousel() {
  return (
    <div className="relative z-40 -mt-16 md:-mt-2 ">
      <div className="relative text-white">
        <div
          className="absolute inset-0 -z-10 bg-[var(--brand)]"
          style={{
            clipPath: "polygon(0 0, 100% 0, 100% 90%, 50% 100%, 0 90%)",
          }}
        />
        <div className="flex flex-wrap justify-center gap-8 z-30 ">
          <div className="flex flex-wrap justify-center gap-16 z-30 -translate-y-12 md:-translate-y-16">
            {booksData.map((book) => (
              <BookCard
                key={book.title}
                title={book.title}
                imageUrl={book.imageUrl}
                amazonUrl={book.amazonUrl}
              />
            ))}
          </div>
        </div>
        <div className="text-center mt-4 flex flex-col items-center">
          <p className="text-3xl mb-4 text-white">Available on:</p>
          <a
            href="https://www.amazon.com"
            target="_blank"
            rel="noopener noreferrer"
            className="block w-96"
          >
            <img
              src="/images/amazon-logo.png"
              alt="Amazon Logo"
              className="object-contain w-full h-auto"
            />
          </a>
        </div>
      </div>
    </div>
  );
}
