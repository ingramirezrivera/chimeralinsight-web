// src/lib/paths.ts
export function withBasePath(path: string): string {
  if (!path) return path;
  // No tocar URLs absolutas, anchors o queries
  if (
    /^https?:\/\//i.test(path) ||
    path.startsWith("#") ||
    path.startsWith("?")
  ) {
    return path;
  }

  const rawBase = process.env.NEXT_PUBLIC_BASE_PATH || ""; // ej: "/chimeralinsight-web" o ""
  // Asegurar "/" inicial y SIN "/" final
  const base = rawBase ? `/${rawBase.replace(/^\/+|\/+$/g, "")}` : "";

  // Asegurar que el path empieza con "/"
  const p = path.startsWith("/") ? path : `/${path}`;

  // Unir y colapsar dobles barras (pero no las de "http://", ya las filtramos arriba)
  return `${base}${p}`.replace(/\/{2,}/g, "/");
}
