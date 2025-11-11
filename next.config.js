// next.config.js (Corrección de Base Path para Staging)

const isProd = process.env.NODE_ENV === "production";
const repo = "chimeralinsight-web";
// Usa una variable de entorno específica para forzar el path en la producción final
const repoPath = process.env.CI_REPO_PATH || "";

/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: false,
  images: { unoptimized: true },

  // APLICA BASEPATH SÓLO SI ESTÁ DEFINIDO EN LAS VARIABLES DE ENTORNO DEL VPS
  basePath: repoPath,

  env: {
    NEXT_PUBLIC_BASE_PATH: repoPath,
  },
  // Tu código original no tenía 'module.exports', pero Next.js lo requiere
  // Asegúrate de que esta línea esté al final:
  // (Dependiendo de si es .js o .mjs, la exportación puede variar, pero asumiremos .js)
  // module.exports = nextConfig;
};

// Si usas export default, debe ser la única exportación.
export default nextConfig;
