import Link from "next/link";
import AdminShell from "@/components/admin/AdminShell";
import LogoutButton from "@/app/admin/LogoutButton";
import {
  createPostAction,
  deletePostAction,
  togglePostStatusAction,
} from "@/app/admin/posts/actions";
import { requireRole } from "@/lib/auth/session";
import { getAllPostsForAdmin } from "@/lib/blog/queries";
import { formatDate } from "@/lib/utils";

export default async function AdminPostsPage() {
  const session = await requireRole(["ADMIN", "EDITOR"]);
  const posts = await getAllPostsForAdmin();

  return (
    <AdminShell user={session} pathname="/admin/posts" actions={<LogoutButton />} theme="light">
      <section className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-[var(--brand)]">Editorial content</p>
          <h2 className="mt-1 text-3xl font-semibold tracking-tight text-slate-950">Posts</h2>
        </div>

        <form action={createPostAction}>
          <button
            type="submit"
            className="rounded-full bg-[var(--brand)] px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-[#276d71]"
          >
            New post
          </button>
        </form>
      </section>

      <section className="rounded-[28px] border border-[rgba(47,129,133,0.12)] bg-[linear-gradient(180deg,rgba(255,255,255,0.97),rgba(241,247,245,0.94))] p-6 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.38)]">
        <div className="space-y-4">
          {posts.length === 0 ? (
            <p className="text-slate-600">No posts yet. Create your first article.</p>
          ) : (
            posts.map((post: (typeof posts)[number]) => (
              <article
                key={post.id}
                className="rounded-[24px] border border-[rgba(47,129,133,0.1)] bg-white/82 p-5"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-xl font-semibold text-slate-950">{post.title}</h3>
                      <span className="rounded-full bg-[rgba(47,129,133,0.12)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--brand)]">
                        {post.status.toLowerCase()}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500">/{post.slug}</p>
                    <p className="text-sm text-slate-500">
                      Updated {formatDate(post.updatedAt)}
                      {post.publishedAt ? ` / Published ${formatDate(post.publishedAt)}` : ""}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Link
                      href={`/admin/posts/${post.id}/edit`}
                      className="rounded-full bg-[var(--brand)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-white"
                    >
                      Edit
                    </Link>
                    <form action={togglePostStatusAction}>
                      <input type="hidden" name="id" value={post.id} />
                      <input
                        type="hidden"
                        name="nextStatus"
                        value={post.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED"}
                      />
                      <button
                        type="submit"
                        className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-white"
                      >
                        {post.status === "PUBLISHED" ? "Unpublish" : "Publish"}
                      </button>
                    </form>
                    <form action={deletePostAction}>
                      <input type="hidden" name="id" value={post.id} />
                      <button
                        type="submit"
                        className="rounded-full bg-red-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-red-700 ring-1 ring-red-200"
                      >
                        Delete
                      </button>
                    </form>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </AdminShell>
  );
}
