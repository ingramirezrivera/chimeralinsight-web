import AdminShell from "@/components/admin/AdminShell";
import LogoutButton from "@/app/admin/LogoutButton";
import { requireSession } from "@/lib/auth/session";
import { prisma } from "@/lib/db";

export default async function AdminDashboardPage() {
  const session = await requireSession();

  const [postCount, publishedCount, draftCount, recentPosts] = await Promise.all([
    prisma.post.count(),
    prisma.post.count({ where: { status: "PUBLISHED" } }),
    prisma.post.count({ where: { status: "DRAFT" } }),
    prisma.post.findMany({
      orderBy: { updatedAt: "desc" },
      take: 5,
    }),
  ]);

  return (
    <AdminShell user={session} pathname="/admin/dashboard" actions={<LogoutButton />} theme="light">
      <section className="grid gap-5 md:grid-cols-3">
        {[
          { label: "Total posts", value: postCount },
          { label: "Published", value: publishedCount },
          { label: "Drafts", value: draftCount },
        ].map((item) => (
          <div
            key={item.label}
            className="rounded-[28px] border border-[rgba(47,129,133,0.12)] bg-[linear-gradient(180deg,rgba(255,255,255,0.96),rgba(240,246,244,0.92))] p-6 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.38)]"
          >
            <p className="text-sm uppercase tracking-[0.16em] text-[var(--brand)]">{item.label}</p>
            <p className="mt-4 text-4xl font-semibold tracking-tight text-slate-950">{item.value}</p>
          </div>
        ))}
      </section>

      <section className="rounded-[28px] border border-[rgba(47,129,133,0.12)] bg-[linear-gradient(180deg,rgba(255,255,255,0.97),rgba(241,247,245,0.94))] p-6 shadow-[0_24px_60px_-40px_rgba(15,23,42,0.38)]">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-[var(--brand)]">Recent updates</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">Latest activity</h2>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          {recentPosts.length === 0 ? (
            <p className="text-slate-600">No posts yet. Start your first draft from the posts area.</p>
          ) : (
            recentPosts.map((post: (typeof recentPosts)[number]) => (
              <div
                key={post.id}
                className="rounded-2xl border border-[rgba(47,129,133,0.1)] bg-white/82 px-4 py-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-slate-900">{post.title}</p>
                    <p className="text-sm text-slate-500">{post.slug}</p>
                  </div>
                  <span className="rounded-full bg-[rgba(47,129,133,0.12)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--brand)]">
                    {post.status.toLowerCase()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </AdminShell>
  );
}
