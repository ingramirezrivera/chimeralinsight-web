const isProd = process.env.NODE_ENV === "production";
const repo = "chimeralinsight-web";

export default {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  basePath: isProd ? `/${repo}` : "", // ← prefijo sólo en prod
  env: { NEXT_PUBLIC_BASE_PATH: isProd ? `/${repo}` : "" },
};
