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
      className="relative w-full h-96 md:h-[800px] bg-cover bg-center flex items-center justify-center pt-16 sm:pt-2"
      style={{ backgroundImage: `url(${imageUrl})` }}
      aria-label={altText}
    >
      <div className="absolute inset-0 bg-black opacity-20"></div>

      {/* Contenedor principal para ambos logos, apilados verticalmente */}
      <div className="relative z-10 flex flex-col items-center transform -translate-y-24">
        {sealLogoUrl && sealLogoAltText && (
          <div className="p-2 bg-none bg-opacity-10 rounded-full shadow-xl">
            <Image
              src={sealLogoUrl}
              alt={sealLogoAltText}
              width={300}
              height={300}
              className="object-contain hover:scale-110 transition-transform transition-colors duration-200 ease-in-out w-32 sm:w-76"
            />
          </div>
        )}

        {mainLogoUrl && mainLogoAltText && (
          <div className="mt-4">
            <Image
              className="hover:scale-110 transition-transform transition-colors duration-200 ease-in-out w-74 sm:w-150"
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
