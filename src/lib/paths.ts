// src/lib/paths.ts
export function withBasePath(path: string): string {
  if (!path) return ""; // ⬅️ siempre string vacío si no hay path

  // No tocar URLs absolutas, anchors o queries
  if (
    /^https?:\/\//i.test(path) ||
    path.startsWith("#") ||
    path.startsWith("?")
  ) {
    return path;
  }

  const rawBase = process.env.NEXT_PUBLIC_BASE_PATH || ""; // ej: "/chimeralinsight-web" o ""
  // Normaliza: asegura "/" inicial y SIN "/" final
  const base = rawBase ? `/${rawBase.replace(/^\/+|\/+$/g, "")}` : "";

  // Asegura que el path empieza con "/"
  const p = path.startsWith("/") ? path : `/${path}`;

  // Une y colapsa dobles barras (no aplica a http:// porque ya lo filtramos arriba)
  return `${base}${p}`.replace(/\/{2,}/g, "/");
}
