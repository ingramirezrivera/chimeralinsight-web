// src/app/page.tsx (o donde está tu Home)
import Hero from "../components/Hero";
import BooksCarousel from "../components/BooksCarousel";
import AboutAuthor from "@/components/AboutAuthor";
import BooksSection from "@/components/BooksSection";
import MailingListSection from "@/components/MailingListSection";
import { withBasePath } from "@/lib/paths";

export default function Home() {
  return (
    <main id="top">
      <section id="home">
        <Hero
          imageUrl="/images/ChimInsightBanner.jpg"
          altText="Imagen de fondo de un desierto con elementos de ciencia ficción y mitología"
          sealLogoUrl="/images/seal-chimeralInsight.png"
          sealLogoAltText="ChimeralInsight Seal Logo"
          mainLogoUrl="/images/logo.png"
          mainLogoAltText="Chimeralinsight Logo"
        />
      </section>

      <BooksCarousel />

      <section id="about">
        <AboutAuthor photoUrl="/images/author-robin.jpg" />
      </section>

      <section id="books">
        <BooksSection />
      </section>

      <section id="mailing-list">
        <MailingListSection subscribeUrl="" />
      </section>
    </main>
  );
}
