// next.config.ts
const isProd = process.env.NODE_ENV === "production";
const repo = "chimeralinsight-web";
const base = isProd ? `/${repo}` : "";

const nextConfig = {
  output: "export",
  trailingSlash: true, // genera /ruta/index.html
  images: { unoptimized: true },
  basePath: base, // prefija rutas internas en GH Pages
  env: {
    NEXT_PUBLIC_BASE_PATH: base, // para tu helper withBasePath
  },
};

export default nextConfig;
