import { notFound } from "next/navigation";
import AdminShell from "@/components/admin/AdminShell";
import PostEditor from "@/components/admin/PostEditor";
import LogoutButton from "@/app/admin/LogoutButton";
import { savePostAction } from "@/app/admin/posts/actions";
import { createEmptyContent } from "@/lib/blog/content";
import type { BlogContent } from "@/lib/blog/types";
import { requireRole } from "@/lib/auth/session";
import { getPostById } from "@/lib/blog/queries";

function toDateTimeLocal(value: Date | null) {
  if (!value) return "";
  return new Date(value.getTime() - value.getTimezoneOffset() * 60_000)
    .toISOString()
    .slice(0, 16);
}

export default async function AdminEditPostPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ saved?: string }>;
}) {
  const session = await requireRole(["ADMIN", "EDITOR"]);
  const { id } = await params;
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const post = await getPostById(id);

  if (!post) {
    notFound();
  }

  return (
    <AdminShell user={session} pathname="/admin/posts" actions={<LogoutButton />} theme="light">
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.16em] text-[var(--brand)]">Editing post</p>
        <h2 className="text-3xl font-semibold tracking-tight text-slate-950">{post.title}</h2>
      </div>

      <PostEditor
        action={savePostAction}
        savedState={
          resolvedSearchParams?.saved === "published"
            ? "published"
            : resolvedSearchParams?.saved === "draft"
              ? "draft"
              : null
        }
        post={{
          id: post.id,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt || "",
          featuredImage: post.featuredImage || "",
          featuredImageAlt: post.featuredImageAlt || "",
          featuredImageSize:
            (post.content as BlogContent)?.featuredImageSize === "small" ||
            (post.content as BlogContent)?.featuredImageSize === "large" ||
            (post.content as BlogContent)?.featuredImageSize === "xlarge" ||
            (post.content as BlogContent)?.featuredImageSize === "medium"
              ? (post.content as BlogContent).featuredImageSize
              : "small",
          relatedBookId: (post.content as BlogContent)?.relatedBookId || "",
          seoTitle: post.seoTitle || "",
          seoDescription: post.seoDescription || "",
          status: post.status,
          publishedAt: toDateTimeLocal(post.publishedAt),
          content: (post.content as BlogContent) || createEmptyContent(),
        }}
      />
    </AdminShell>
  );
}
