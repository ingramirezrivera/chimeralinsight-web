const isProd = process.env.NODE_ENV === "production";
const repo = "chimeralinsight-web";

/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: false,
  images: { unoptimized: true },

  basePath: isProd ? `/${repo}` : "",

  env: {
    NEXT_PUBLIC_BASE_PATH: isProd ? `/${repo}` : "",
  },
};

export default nextConfig;
