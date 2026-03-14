import Image from "next/image";
import Link from "next/link";
import type { Post, User } from "@prisma/client";
import type { BookData } from "@/data/books";
import { siteConfig } from "@/lib/site";
import { withBasePath } from "@/lib/paths";
import { formatDate } from "@/lib/utils";

type BlogListPost = Post & {
  author: User | null;
};

export default function BlogCard({
  post,
  relatedBook,
}: {
  post: BlogListPost;
  relatedBook?: BookData | null;
}) {
  return (
    <article className="group overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-[0_24px_80px_-48px_rgba(15,23,42,0.45)] transition-transform duration-300 hover:-translate-y-1">
      {post.featuredImage ? (
        <div className="overflow-hidden bg-slate-100">
          <Image
            src={post.featuredImage}
            alt={post.featuredImageAlt || post.title}
            width={1200}
            height={675}
            className="h-64 w-full object-cover transition duration-500 group-hover:scale-[1.03]"
          />
        </div>
      ) : null}

      <div className="space-y-5 p-7">
        {relatedBook ? (
          <div className="flex items-center gap-4 rounded-[22px] border border-[rgba(47,129,133,0.12)] bg-[rgba(47,129,133,0.04)] p-3">
            <div className="relative h-20 w-14 shrink-0 overflow-hidden rounded-lg border border-black/5 bg-white">
              <Image
                src={withBasePath(relatedBook.coverSrc)}
                alt={`${relatedBook.title} cover`}
                fill
                className="object-cover"
              />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] uppercase tracking-[0.18em] text-[var(--brand)]">
                Related book
              </p>
              <p className="mt-1 line-clamp-2 text-sm font-semibold text-slate-950">
                {relatedBook.title}
              </p>
            </div>
          </div>
        ) : null}

        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
            {formatDate(post.publishedAt || post.createdAt)}
            {post.author ? `  /  ${siteConfig.publicAuthorName}` : ""}
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-slate-950">
            <Link href={`/blog/${post.slug}`} className="text-inherit">
              {post.title}
            </Link>
          </h2>
        </div>

        {post.excerpt ? (
          <p className="text-base leading-7 text-slate-600">{post.excerpt}</p>
        ) : null}

        <Link
          href={`/blog/${post.slug}`}
          className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.16em] text-[var(--brand)]"
        >
          Read article
          <span aria-hidden="true">-&gt;</span>
        </Link>
      </div>
    </article>
  );
}
