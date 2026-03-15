"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createEmptyContent } from "@/lib/blog/content";
import { requireRole } from "@/lib/auth/session";
import { prisma } from "@/lib/db";
import { blogContentSchema, postInputSchema } from "@/lib/validations/blog";

type PostStatusValue = "DRAFT" | "PUBLISHED";

function normalizeOptional(value: string) {
  return value.trim() || null;
}

function getPublishedAt(status: PostStatusValue, rawPublishedAt: string) {
  if (status !== "PUBLISHED") return null;
  if (!rawPublishedAt) return new Date();
  return new Date(rawPublishedAt);
}

export async function createPostAction() {
  const session = await requireRole(["ADMIN", "EDITOR"]);

  const post = await prisma.post.create({
    data: {
      title: "Untitled draft",
      slug: `draft-${Date.now()}`,
      content: createEmptyContent(),
      status: "DRAFT",
      authorId: session.userId,
    },
  });

  redirect(`/admin/posts/${post.id}/edit`);
}

export async function savePostAction(formData: FormData) {
  const session = await requireRole(["ADMIN", "EDITOR"]);
  const postId = String(formData.get("postId") || "");

  const parsed = postInputSchema.parse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    excerpt: formData.get("excerpt"),
    featuredImage: formData.get("featuredImage"),
    featuredImageAlt: formData.get("featuredImageAlt"),
    featuredImageSize: formData.get("featuredImageSize"),
    seoTitle: formData.get("seoTitle"),
    seoDescription: formData.get("seoDescription"),
    status: formData.get("status"),
    publishedAt: formData.get("publishedAt"),
    content: formData.get("content"),
  });

  const rawFeaturedImageSize = String(formData.get("featuredImageSize") || "medium");
  const featuredImageSize =
    rawFeaturedImageSize === "small" ||
    rawFeaturedImageSize === "large" ||
    rawFeaturedImageSize === "xlarge" ||
    rawFeaturedImageSize === "medium"
      ? rawFeaturedImageSize
      : "small";

  const parsedContent = blogContentSchema.parse({
    ...JSON.parse(parsed.content),
    featuredImageSize,
  });
  const status: PostStatusValue = parsed.status === "PUBLISHED" ? "PUBLISHED" : "DRAFT";

  const payload = {
    title: parsed.title,
    slug: parsed.slug,
    excerpt: normalizeOptional(parsed.excerpt),
    featuredImage: normalizeOptional(parsed.featuredImage),
    featuredImageAlt: normalizeOptional(parsed.featuredImageAlt),
    seoTitle: normalizeOptional(parsed.seoTitle),
    seoDescription: normalizeOptional(parsed.seoDescription),
    status,
    publishedAt: getPublishedAt(status, parsed.publishedAt),
    content: parsedContent,
    authorId: session.userId,
  };

  if (postId) {
    await prisma.post.update({
      where: { id: postId },
      data: payload,
    });
  } else {
    await prisma.post.create({ data: payload });
  }

  revalidatePath("/blog");
  revalidatePath("/admin/posts");

  if (postId) {
    revalidatePath(`/blog/${parsed.slug}`);
    redirect(`/admin/posts/${postId}/edit?saved=1`);
  }

  redirect("/admin/posts");
}

export async function deletePostAction(formData: FormData) {
  await requireRole(["ADMIN", "EDITOR"]);
  const id = String(formData.get("id") || "");

  if (!id) {
    redirect("/admin/posts");
  }

  await prisma.post.delete({
    where: { id },
  });

  revalidatePath("/blog");
  revalidatePath("/admin/posts");
  redirect("/admin/posts");
}

export async function togglePostStatusAction(formData: FormData) {
  await requireRole(["ADMIN", "EDITOR"]);
  const id = String(formData.get("id") || "");
  const nextStatus = String(formData.get("nextStatus") || "DRAFT");

  const status: PostStatusValue = nextStatus === "PUBLISHED" ? "PUBLISHED" : "DRAFT";

  await prisma.post.update({
    where: { id },
    data: {
      status,
      publishedAt: status === "PUBLISHED" ? new Date() : null,
    },
  });

  revalidatePath("/blog");
  revalidatePath("/admin/posts");
  redirect("/admin/posts");
}
