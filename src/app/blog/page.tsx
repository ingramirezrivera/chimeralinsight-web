import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { books, getBookById } from "@/data/books";
import BlogCard from "@/components/blog/BlogCard";
import type { BlogContent } from "@/lib/blog/types";
import { getPublishedPosts } from "@/lib/blog/queries";
import { withBasePath } from "@/lib/paths";
import { getSiteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "In-depth essays exploring biological warfare, global risks, and the systems shaping humanity's next era.",
  alternates: {
    canonical: `${getSiteUrl()}/blog`,
  },
  openGraph: {
    title: "Chimeral Insight Blog",
    description:
      "In-depth essays exploring biological warfare, global risks, and the systems shaping humanity's next era.",
    url: `${getSiteUrl()}/blog`,
    type: "website",
  },
};

export default async function BlogIndexPage({
  searchParams,
}: {
  searchParams?: Promise<{ book?: string }>;
}) {
  const posts = await getPublishedPosts();
  const params = searchParams ? await searchParams : undefined;
  const selectedBookId = params?.book || "";
  const selectedBook = getBookById(selectedBookId);

  const postsWithBooks = posts.map((post: (typeof posts)[number]) => {
    const relatedBookId = ((post.content as BlogContent | null)?.relatedBookId || "").trim();
    return {
      post,
      relatedBookId,
      relatedBook: getBookById(relatedBookId),
    };
  });

  type PostWithBook = (typeof postsWithBooks)[number];

  const filteredPosts = selectedBookId
    ? postsWithBooks.filter((item: PostWithBook) => item.relatedBookId === selectedBookId)
    : postsWithBooks;

  return (
    <main className="bg-[#f6f1e8] pt-[var(--nav-h,80px)] text-slate-950">
      <section className="overflow-hidden border-b border-black/5 bg-[radial-gradient(circle_at_top_left,_rgba(47,129,133,0.18),_transparent_32%),linear-gradient(180deg,#fbfaf8_0%,#f3ede3_100%)]">
        <div className="container py-20 lg:py-28">
          <div className="max-w-4xl space-y-6">
            <p className="text-xs uppercase tracking-[0.22em] text-slate-500">
              Chimeral Insight Journal
            </p>
            <h1 className="text-5xl font-semibold leading-tight tracking-tight lg:text-7xl">
              Where biology, power, and the future converge.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-600">
              In-depth essays exploring biological warfare, global risks, and
              the systems shaping humanity&apos;s next era.
            </p>
            {selectedBook ? (
              <div className="inline-flex items-center gap-3 rounded-full border border-[rgba(47,129,133,0.12)] bg-white/80 px-5 py-3 text-sm text-slate-700 shadow-[0_18px_40px_-32px_rgba(15,23,42,0.28)]">
                <span className="font-semibold text-[var(--brand)]">Filtered by book:</span>
                <span>{selectedBook.title}</span>
                <Link href="/blog" className="font-semibold text-[var(--brand)]">
                  Clear filter
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section className="container py-14 lg:py-20">
        <div className="mb-10 space-y-5">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">
                Browse by book
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight">
                Articles connected to Robin&apos;s books
              </h2>
            </div>
            <Link
              href="/blog"
              className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--brand)]"
            >
              View all articles
            </Link>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {books.map((book: (typeof books)[number]) => {
              const relatedCount = postsWithBooks.filter(
                (item: PostWithBook) => item.relatedBookId === book.id
              ).length;

              return (
                <Link
                  key={book.id}
                  href={`/blog?book=${book.id}`}
                  className="group flex items-center gap-4 rounded-[26px] border border-[rgba(47,129,133,0.12)] bg-white/80 p-4 shadow-[0_18px_55px_-36px_rgba(15,23,42,0.26)] transition hover:-translate-y-1 hover:bg-white"
                >
                  <div className="relative h-28 w-20 shrink-0 overflow-hidden rounded-xl border border-black/5 bg-white">
                    <Image
                      src={withBasePath(book.coverSrc)}
                      alt={`${book.title} cover`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--brand)]">
                      {relatedCount} article{relatedCount === 1 ? "" : "s"}
                    </p>
                    <h3 className="mt-2 line-clamp-2 text-xl font-semibold tracking-tight text-slate-950">
                      {book.title}
                    </h3>
                    {book.subtitle ? (
                      <p className="mt-1 line-clamp-2 text-sm text-slate-600">
                        {book.subtitle}
                      </p>
                    ) : null}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {filteredPosts.length === 0 ? (
          <div className="rounded-[28px] border border-dashed border-slate-300 bg-white/70 px-8 py-16 text-center">
            <p className="text-slate-500">
              {selectedBook
                ? "No articles have been published for this book yet."
                : "The first Chimeral Insight article is being prepared."}
            </p>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-2">
            {filteredPosts.map(({ post, relatedBook }: PostWithBook) => (
              <BlogCard key={post.id} post={post} relatedBook={relatedBook} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
