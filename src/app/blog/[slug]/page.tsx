import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBookById } from "@/data/books";
import BlogContentRenderer from "@/components/blog/BlogContentRenderer";
import type { BlogContent } from "@/lib/blog/types";
import { getPublishedPostBySlug } from "@/lib/blog/queries";
import { getSiteUrl, siteConfig } from "@/lib/site";
import { withBasePath } from "@/lib/paths";
import { formatDate } from "@/lib/utils";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);

  if (!post) {
    return {
      title: "Article not found",
    };
  }

  const title = post.seoTitle || post.title;
  const description = post.seoDescription || post.excerpt || "";
  const url = `${getSiteUrl()}/blog/${post.slug}`;

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "article",
      url,
      title,
      description,
      publishedTime: post.publishedAt?.toISOString(),
      images: post.featuredImage
        ? [
            {
              url: post.featuredImage,
              alt: post.featuredImageAlt || post.title,
            },
          ]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: post.featuredImage ? [post.featuredImage] : [],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const content = post.content as BlogContent;
  const relatedBook = getBookById(content.relatedBookId);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.seoDescription || post.excerpt || "",
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: post.author
      ? {
          "@type": "Person",
          name: siteConfig.publicAuthorName,
        }
      : undefined,
    image: post.featuredImage ? [post.featuredImage] : undefined,
    mainEntityOfPage: `${getSiteUrl()}/blog/${post.slug}`,
  };

  const featuredImageWidthClass =
    content.featuredImageSize === "small"
      ? "max-w-[30rem]"
      : content.featuredImageSize === "medium"
        ? "max-w-[32rem]"
        : content.featuredImageSize === "xlarge"
          ? "max-w-7xl"
          : content.featuredImageSize === "large"
            ? "max-w-6xl"
            : "max-w-5xl";

  return (
    <main className="bg-[#f7f2e9] pt-[var(--nav-h,80px)] text-slate-950">
      <article className="container py-14 lg:py-20">
        <header className="mx-auto max-w-4xl space-y-6">
          <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
            {formatDate(post.publishedAt || post.createdAt)}
            {post.author ? `  /  ${siteConfig.publicAuthorName}` : ""}
          </p>
          {relatedBook ? (
            <div className="flex items-center gap-4 rounded-[26px] border border-[rgba(47,129,133,0.12)] bg-white/78 px-4 py-4 shadow-[0_18px_40px_-34px_rgba(15,23,42,0.22)]">
              <div className="relative h-24 w-16 shrink-0 overflow-hidden rounded-xl border border-black/5 bg-white">
                <Image
                  src={withBasePath(relatedBook.coverSrc)}
                  alt={`${relatedBook.title} cover`}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-[0.18em] text-[var(--brand)]">
                  Related book
                </p>
                <p className="mt-1 text-lg font-semibold text-slate-950">
                  {relatedBook.title}
                </p>
                <div className="mt-2 flex flex-wrap gap-3 text-sm font-semibold">
                  <Link
                    href={`/books/${relatedBook.id}/`}
                    className="text-[var(--brand)]"
                  >
                    View book
                  </Link>
                  <Link
                    href={`/blog?book=${relatedBook.id}`}
                    className="text-[var(--brand)]"
                  >
                    More articles for this book
                  </Link>
                </div>
              </div>
            </div>
          ) : null}
          <h1 className="text-5xl font-semibold leading-tight tracking-tight lg:text-6xl">
            {post.title}
          </h1>
          {post.excerpt ? (
            <p className="max-w-3xl text-xl leading-9 text-slate-600">
              {post.excerpt}
            </p>
          ) : null}
        </header>

        {post.featuredImage ? (
          <div
            className={`mx-auto mt-10 overflow-hidden rounded-[32px] border border-black/5 bg-white shadow-[0_25px_90px_-60px_rgba(15,23,42,0.4)] ${featuredImageWidthClass}`}
          >
            <Image
              src={post.featuredImage}
              alt={post.featuredImageAlt || post.title}
              width={1600}
              height={900}
              priority
              className="h-auto w-full object-cover"
            />
          </div>
        ) : null}

        <div className="mx-auto mt-12 max-w-3xl">
          <BlogContentRenderer content={content} />
        </div>

        {relatedBook ? (
          <section className="mx-auto mt-16 max-w-5xl rounded-[32px] border border-[rgba(47,129,133,0.12)] bg-[linear-gradient(180deg,rgba(255,255,255,0.95),rgba(241,247,245,0.88))] p-6 shadow-[0_25px_90px_-60px_rgba(15,23,42,0.32)] sm:p-8">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-center">
              <div className="flex items-center gap-5">
                <div className="relative h-40 w-28 shrink-0 overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm">
                  <Image
                    src={withBasePath(relatedBook.coverSrc)}
                    alt={`${relatedBook.title} cover`}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="space-y-2">
                  <p className="text-xs uppercase tracking-[0.2em] text-[var(--brand)]">
                    Continue with the book
                  </p>
                  <h2 className="text-3xl font-semibold tracking-tight text-slate-950">
                    {relatedBook.title}
                  </h2>
                  {relatedBook.subtitle ? (
                    <p className="text-base text-slate-600">
                      {relatedBook.subtitle}
                    </p>
                  ) : null}
                  <div className="flex flex-wrap gap-3 pt-2 text-sm font-semibold">
                    <Link
                      href={`/books/${relatedBook.id}/`}
                      className="text-[var(--brand)]"
                    >
                      View book page
                    </Link>
                    <Link
                      href={`/blog?book=${relatedBook.id}`}
                      className="text-[var(--brand)]"
                    >
                      More articles for this book
                    </Link>
                  </div>
                </div>
              </div>

              <div className="flex-1">
                {relatedBook.availability === "upcoming" ? (
                  <div className="space-y-4">
                    <p className="text-sm leading-7 text-slate-600">
                      This title is currently in pre-launch. Readers can visit
                      the dedicated page for updates and early interest.
                    </p>
                    <Link
                      href={`/launch/${relatedBook.id}/`}
                      className="inline-flex rounded-full bg-[var(--brand)] px-6 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-[#276d71]"
                    >
                      Visit pre-launch page
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-sm leading-7 text-slate-600">
                      Buy this book from the retailer that works best for you.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {relatedBook.retailers.map((retailer: (typeof relatedBook.retailers)[number]) => (
                        <a
                          key={retailer.id}
                          href={retailer.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-slate-800"
                        >
                          {retailer.label}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        ) : null}
      </article>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </main>
  );
}
