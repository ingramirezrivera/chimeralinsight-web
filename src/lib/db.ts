import path from "node:path";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@prisma/client";

export function getDatabaseUrl() {
  return process.env.DATABASE_URL || "file:./prisma/dev.db";
}

export function toSqliteFilePath(databaseUrl: string) {
  if (databaseUrl === ":memory:" || databaseUrl === "file::memory:") {
    return ":memory:";
  }

  const normalized = databaseUrl.startsWith("file:")
    ? databaseUrl.slice("file:".length)
    : databaseUrl;

  return path.isAbsolute(normalized)
    ? normalized
    : path.resolve(process.cwd(), normalized);
}

export function describeDatabaseTarget() {
  const databaseUrl = getDatabaseUrl();

  return {
    databaseUrl,
    sqliteFilePath: toSqliteFilePath(databaseUrl),
  };
}

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter: new PrismaBetterSqlite3({
      url: toSqliteFilePath(getDatabaseUrl()),
    }),
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
