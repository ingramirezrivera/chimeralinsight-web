import { describeDatabaseTarget, prisma } from "@/lib/db";
import { isMissingTableError } from "@/lib/db-errors";

function logMissingBlogTable(operation: string, error: unknown) {
  const target = describeDatabaseTarget();

  console.error(
    `[blog] Missing database table while running ${operation}. DATABASE_URL=${target.databaseUrl} SQLITE_PATH=${target.sqliteFilePath}`,
    error
  );
}

export async function getPublishedPosts() {
  try {
    return await prisma.post.findMany({
      where: {
        status: "PUBLISHED",
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
      logMissingBlogTable("getPublishedPosts", error);
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
        status: "PUBLISHED",
        publishedAt: { lte: new Date() },
      },
      include: {
        author: true,
      },
    });
  } catch (error) {
    if (isMissingTableError(error)) {
      logMissingBlogTable("getPublishedPostBySlug", error);
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
      logMissingBlogTable("getAllPostsForAdmin", error);
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
      logMissingBlogTable("getPostById", error);
      return null;
    }

    throw error;
  }
}
