"use client";

import Image from "next/image";

interface HeroProps {
  imageUrl: string;
  altText: string;
  sealLogoUrl?: string;
  sealLogoAltText?: string;
  mainLogoUrl?: string;
  mainLogoAltText?: string;
}

export default function Hero({
  imageUrl,
  altText,
  sealLogoUrl,
  sealLogoAltText,
  mainLogoUrl,
  mainLogoAltText,
}: HeroProps) {
  return (
    <div
      className="relative w-full h-120 md:h-[800px] bg-cover bg-center flex items-center justify-center pt-16 sm:pt-2 font-sans"
      style={{ backgroundImage: `url(${imageUrl})` }}
      aria-label={altText}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black via-[--brand]/20 to-transparent z-10"></div>

      {/* Contenedor principal para ambos logos, apilados verticalmente */}
      <div className="relative z-20 flex flex-col items-center -translate-y-24">
        {sealLogoUrl && sealLogoAltText && (
          <div className="p-2 bg-none bg-opacity-10 rounded-full shadow-xl">
            <Image
              src={sealLogoUrl}
              alt={sealLogoAltText}
              width={300}
              height={300}
              className="object-contain hover:scale-110 transition-transform duration-200 ease-in-out w-32 sm:w-76"
            />
          </div>
        )}

        {mainLogoUrl && mainLogoAltText && (
          <div className="mt-4">
            <Image
              className="hover:scale-110 transition-transform duration-200 ease-in-out w-74 sm:w-150"
              src="/logo.png"
              alt="Chimeralinsight logo"
              width={600}
              height={40}
            />
          </div>
        )}
      </div>
    </div>
  );
}
