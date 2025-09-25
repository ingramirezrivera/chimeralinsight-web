// src/lib/paths.ts
export function withBasePath(p: string): string {
  const bp = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
  if (!p) return p;
  if (/^https?:\/\//i.test(p)) return p; // URLs absolutas no cambian
  if (p.startsWith(bp)) return p; // ya incluye el basePath
  return `${bp}${p.startsWith("/") ? p : `/${p}`}`; // asegura el prefijo
}
