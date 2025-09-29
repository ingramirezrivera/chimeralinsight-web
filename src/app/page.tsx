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
      <section id="home" className="scroll-mt-24">
        <Hero
          imageUrl={withBasePath("/images/ChimInsightBanner.png")}
          altText="Imagen de fondo de un desierto con elementos de ciencia ficción y mitología"
          sealLogoUrl="/images/seal-chimeralInsight.png"
          sealLogoAltText="ChimeralInsight Seal Logo"
          mainLogoUrl="/images/logo.png"
          mainLogoAltText="Chimeralinsight Logo"
        />
      </section>

      <BooksCarousel />

      {/* 👇 Ancla About */}
      <section id="about" className="scroll-mt-24">
        <AboutAuthor photoUrl={withBasePath("/images/author-robin.png")} />
      </section>

      {/* 👇 Ancla Books */}
      <section id="books" className="scroll-mt-24">
        <BooksSection />
      </section>

      {/* 👇 Ancla Mailing List */}
      <section id="mailing-list" className="scroll-mt-24">
        <MailingListSection subscribeUrl="" />
      </section>
    </main>
  );
}
