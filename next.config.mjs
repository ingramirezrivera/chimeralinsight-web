const repoPath = process.env.CI_REPO_PATH || "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: false,
  turbopack: {
    root: process.cwd(),
  },
  basePath: repoPath,
  env: {
    NEXT_PUBLIC_BASE_PATH: repoPath,
  },
};

export default nextConfig;
