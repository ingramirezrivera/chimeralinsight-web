import Hero from "../components/Hero";
import BooksCarousel from "../components/BooksCarousel";
import AboutAuthor from "@/components/AboutAuthor";
import BooksSection from "@/components/BooksSection";
import MailingListSection from "@/components/MailingListSection";
import { withBasePath } from "@/lib/paths";

export default function Home() {
  return (
    <main id="top">
      <Hero
        imageUrl={withBasePath("/images/ChimInsightBanner.png")}
        altText="Imagen de fondo de un desierto con elementos de ciencia ficción y mitología"
        sealLogoUrl="/images/seal-chimeralInsight.png"
        sealLogoAltText="ChimeralInsight Seal Logo"
        mainLogoUrl="/images/logo.png"
        mainLogoAltText="Chimeralinsight Logo"
      />
      <BooksCarousel />
      <AboutAuthor photoUrl={withBasePath("/images/author-robin.png")} />
      <BooksSection id="books" title="Books" />
      <MailingListSection subscribeUrl="" />
    </main>
  );
}
