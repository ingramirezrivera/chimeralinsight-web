// next.config.ts
const isProd = process.env.NODE_ENV === "production";
const repo = "chimeralinsight-web";
const base = isProd ? `/${repo}` : "";

const nextConfig = {
  output: "export",
  trailingSlash: true, // ✅ GH Pages sirve /ruta/ -> index.html
  images: { unoptimized: true },
  // ⚠️ No uses basePath/assetPrefix si ya usas withBasePath() en el código
  env: {
    NEXT_PUBLIC_BASE_PATH: base, // usado por withBasePath()
  },
};

export default nextConfig;
