import { PostStatus } from "@prisma/client";
import { prisma } from "@/lib/db";
import { isMissingTableError } from "@/lib/db-errors";

export async function getPublishedPosts() {
  try {
    return await prisma.post.findMany({
      where: {
        status: PostStatus.PUBLISHED,
        publishedAt: { lte: new Date() },
      },
      include: {
        author: true,
      },
      orderBy: {
        publishedAt: "desc",
      },
    });
  } catch (error) {
    if (isMissingTableError(error)) {
      return [];
    }

    throw error;
  }
}

export async function getPublishedPostBySlug(slug: string) {
  try {
    return await prisma.post.findFirst({
      where: {
        slug,
        status: PostStatus.PUBLISHED,
        publishedAt: { lte: new Date() },
      },
      include: {
        author: true,
      },
    });
  } catch (error) {
    if (isMissingTableError(error)) {
      return null;
    }

    throw error;
  }
}

export async function getAllPostsForAdmin() {
  try {
    return await prisma.post.findMany({
      include: {
        author: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
  } catch (error) {
    if (isMissingTableError(error)) {
      return [];
    }

    throw error;
  }
}

export async function getPostById(id: string) {
  try {
    return await prisma.post.findUnique({
      where: { id },
      include: {
        author: true,
      },
    });
  } catch (error) {
    if (isMissingTableError(error)) {
      return null;
    }

    throw error;
  }
}
