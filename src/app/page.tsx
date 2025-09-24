import Hero from "../components/Hero";
import BooksCarousel from "../components/BooksCarousel";
import AboutAuthor from "@/components/AboutAuthor";
import BooksSection from "@/components/BooksSection";
import MailingListSection from "@/components/MailingListSection";

export default function Home() {
  return (
    <main>
      <Hero
        imageUrl="/images/ChimInsightBanner.png"
        altText="Imagen de fondo de un desierto con elementos de ciencia ficción y mitología"
        sealLogoUrl="/images/seal-chimeralInsight.png"
        sealLogoAltText="ChimeralInsight Seal Logo"
        mainLogoUrl="/images/logo.png"
        mainLogoAltText="Chimeralinsight Logo"
      />
      <BooksCarousel />
      <AboutAuthor
        photoUrl="/images/author-robin.png"
        siteUrl="https://chimeralinsight.com"
      />
      <BooksSection /> {/* ✅ sin props */}
      <MailingListSection subscribeUrl="/api/subscribe" />
    </main>
  );
}
