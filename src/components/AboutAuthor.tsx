// src/components/AboutAuthor.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { withBasePath } from "@/lib/paths";

interface AboutAuthorProps {
  name?: string;
  photoUrl?: string; // e.g. "/images/author-robin.jpg"
  sealUrl?: string;
}

export default function AboutAuthor({
  name = "Robin C. Rickards",
  photoUrl = "/images/author-robin.png",
  sealUrl = "/images/robinr-logo.png",
}: AboutAuthorProps) {
  return (
    <section id="about" className="relative py-16 bg-white font-sans">
      <div className=" md:max-w-5xl mx-auto px-4">
        <div className="relative ">
          {/* GRID: foto 4/12, texto 8/12 */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 p-6 md:p-10 items-start">
            {/* Columna: Foto + Sello */}
            <div className="md:col-span-4 row-start-2 md:row-auto">
              {/* Foto */}
              <div className="relative aspect-[3/4] w-full max-w-[320px] md:max-w-none mx-auto rounded-xl overflow-hidden shadow-lg">
                <Image
                  src={withBasePath(photoUrl)}
                  alt={`Portrait of ${name}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 320px, 420px"
                  priority
                />
              </div>

              {/* Sello redondo debajo de la foto */}
              <div className="mt-6 flex justify-center">
                <div className="relative w-40 h-40 md:w-64 md:h-64 rounded-full overflow-hidden bg-transparent shadow-xl">
                  <Image
                    src={withBasePath(sealUrl)}
                    alt={`${name} seal`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1000px) 200px, 200px"
                    priority
                  />
                </div>
              </div>
            </div>

            {/* Columna: Texto */}
            <div className="md:col-span-8 row-start-1 md:row-auto font-sans">
              <h2 className="text-neutral-500 font-medium tracking-wide">
                Author
              </h2>
              <h1 className="text-4xl md:text-5xl font-bold text-[#494949] leading-tight mt-1">
                {name}
              </h1>

              <div className="mt-5 space-y-4 text-neutral-700 leading-relaxed font-sans">
                <p>
                  Robin Rickards is a dual British-Canadian citizen with over 40
                  years of work in the medical field. He currently works
                  part-time as an orthopedic surgeon, and lives with his
                  beautiful Latina wife, four dogs and two cats—and sometimes a
                  small weasel—near Vancouver, British Columbia. Robin speaks
                  several languages but only one well (many may even dispute
                  that!).
                </p>
                <p>
                  Reading has been his passion and writing has always been his
                  desire. Ideas for his books are derived from reality, past
                  events and current events; all with a twist, all peppered with
                  fact and all frighteningly believable.
                </p>
                <p>
                  Robin has five completed novels—each written in the “Thriller”
                  genre. The sixth is on its way; the seventh and eighth novels
                  are in the oven. He is a recipient of The Literary Titans Book
                  Award 2025 for his novel{" "}
                  <em>Vaccine: A Terrorism Thriller</em>.
                </p>
                <p>
                  Resurrected from the Dead: Robin has brought back to life his
                  successful older website. Articles deal with subject matter in
                  each of his novels and will be regularly updated. Please visit
                  using the link below:
                </p>
              </div>

              <div className="mt-6">
                <Link
                  href={"/#mailing-list"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full rounded-lg text-cyan-400 hover:bg-cyan-800 bg-teal-900 font-semibold px-6 py-3 text-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed text-center mt-4 hover:[text-decoration:none]"
                >
                  chimeralinsight.com
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
