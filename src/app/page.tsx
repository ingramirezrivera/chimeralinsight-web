import Link from "next/link";
import Hero from "../components/Hero";

export default function Home() {
  return (
    <main>
      <Hero
        imageUrl="/images/ChimInsightBanner.png"
        altText="Imagen de fondo de un desierto con elementos de ciencia ficción y mitología"
        sealLogoUrl="/images/seal-chimeralInsight.png"
        sealLogoAltText="ChimeralInsight Seal Logo"
        mainLogoUrl="/images/logo.png" // Asegúrate de que esta sea la ruta correcta
        mainLogoAltText="Chimeralinsight Logo"
      />
      {/* El resto de tu contenido */}
      <section className="container mx-auto p-8 text-center">
        <h2 className="text-4xl font-extrabold text-gray-800 mt-16 mb-4 dark:text-white">
          Bienvenido a chimeralinsight
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Tu página de inicio está lista para ser construida.
        </p>
      </section>
    </main>
  );
}
