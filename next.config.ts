// next.config.ts
const isProd = process.env.NODE_ENV === "production";
const repo = "chimeralinsight-web";
const base = isProd ? `/${repo}` : "";

const nextConfig = {
  output: "export",
  trailingSlash: true, // /ruta/ -> index.html (recomendado en GH Pages)
  images: { unoptimized: true },
  basePath: base, // ✅ Next prefija rutas internas y assets
  // ❌ NO pongas assetPrefix (rompe rutas en Pages)
  env: {
    NEXT_PUBLIC_BASE_PATH: base, // tu helper withBasePath seguirá funcionando
  },
};

export default nextConfig;
