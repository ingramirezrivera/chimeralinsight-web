const isProd = process.env.NODE_ENV === "production";
const repo = "chimeralinsight-web";
const base = isProd ? `/${repo}` : "";

const nextConfig = {
  output: "export",
  trailingSlash: true, // GitHub Pages sirve /ruta/ -> index.html
  images: { unoptimized: true },
  basePath: base, // ⬅️ importante para rutas y assets
  assetPrefix: base + "/", // ⬅️ asegura <link>/<script> con subruta
  env: {
    NEXT_PUBLIC_BASE_PATH: base, // tu helper withBasePath seguirá funcionando
  },
};
export default nextConfig;
