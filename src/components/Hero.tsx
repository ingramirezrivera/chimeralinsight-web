"use client";

import Image from "next/image";
import { withBasePath } from "@/lib/paths";

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
  sealLogoAltText = "Seal logo",
  mainLogoUrl,
  mainLogoAltText = "Main logo",
}: HeroProps) {
  return (
    <div
      className="relative w-full h-[30rem] md:h-[800px] bg-cover bg-center flex items-center justify-center pt-16 sm:pt-2 font-sans"
      style={{ backgroundImage: `url(${withBasePath(imageUrl)})` }}
      aria-label={altText}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black via-[--brand]/20 to-transparent z-10" />

      {/* Contenedor principal para ambos logos, apilados verticalmente */}
      <div className="relative z-20 flex flex-col items-center -translate-y-24">
        {/** Sello (opcional) */}
        {sealLogoUrl && (
          <div className="p-2 rounded-full shadow-xl">
            <Image
              src={withBasePath(sealLogoUrl)}
              alt={sealLogoAltText}
              width={300}
              height={300}
              className="object-contain hover:scale-110 transition-transform duration-200 ease-in-out w-32 sm:w-72"
              unoptimized
            />
          </div>
        )}

        {/** Logo principal (opcional) */}
        {(mainLogoUrl || mainLogoAltText) && (
          <div className="mt-4">
            <Image
              src={withBasePath(mainLogoUrl ?? "/logo.png")}
              alt={mainLogoAltText}
              width={600}
              height={120}
              className="hover:scale-110 transition-transform duration-200 ease-in-out w-72 sm:w-[38rem] object-contain"
              unoptimized
            />
          </div>
        )}
      </div>
    </div>
  );
}
