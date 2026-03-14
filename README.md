# Chimeral Insight Web

Sitio principal de `chimeralinsight.com`, construido con Next.js App Router. El proyecto ya soporta la web pública del autor y queda documentado aquí para evolucionar hacia una plataforma editorial completa con blog profesional y panel privado de administración.

## Estado actual

- Web pública en Next.js con App Router.
- Páginas activas para home, libros, contacto, presskit, privacidad y términos.
- APIs internas para suscripción y notificaciones.
- Pendiente de implementación: blog público, autenticación privada, dashboard editorial, uploads y capa de datos persistente.

## Objetivo siguiente

Integrar un sistema de blog profesional dentro del mismo proyecto, sin CMS externo de pago, con estas metas:

- Blog público en `/blog` y `/blog/[slug]`.
- Panel privado para Robin y un administrador técnico.
- Editor de posts con borradores, publicación y SEO por artículo.
- Uploads de imágenes locales en VPS.
- Arquitectura mantenible, segura y preparada para migrar de SQLite a PostgreSQL.

La propuesta funcional y técnica está documentada en [`docs/blog-architecture.md`](/c:/Users/ANA/desarrollo/chimeralinsight-web/docs/blog-architecture.md).

## Stack actual

- Next.js App Router
- React
- TypeScript
- Tailwind CSS

## Stack objetivo recomendado

- Next.js App Router
- TypeScript
- Tailwind CSS
- Prisma ORM
- SQLite en fase inicial
- Auth.js con credenciales y control por roles
- TipTap como editor enriquecido mantenible
- PM2 + Nginx para despliegue en VPS

## Estructura actual

```text
src/
  app/          Rutas App Router
  components/   Componentes de UI
  data/         Datos estáticos
  lib/          Utilidades compartidas
public/         Assets públicos
tests/          Tests actuales
```

## Estructura objetivo

```text
src/
  app/
    (public)/
      blog/
      books/
      contact/
    admin/
      login/
      dashboard/
      posts/
    api/
      auth/
      admin/
      media/
  components/
    blog/
    admin/
    shared/
  lib/
    auth/
    blog/
    db/
    seo/
    security/
    validations/
prisma/
storage/
  uploads/
docs/
```

## Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Variables de entorno

El archivo `.env.example` debe ampliarse cuando se implemente la nueva arquitectura. Variables previstas:

```bash
DATABASE_URL=
AUTH_SECRET=
AUTH_TRUST_HOST=
APP_URL=
MAILERLITE_API_KEY=
MAILERLITE_GROUP_ID_BLOG=
MAILERLITE_GROUP_ID_WHIPTHEDOGS=
RECAPTCHA_SECRET_KEY=
UPLOAD_DIR=
MAX_UPLOAD_BYTES=
```

## Documentación del proyecto

- Arquitectura del blog: [`docs/blog-architecture.md`](/c:/Users/ANA/desarrollo/chimeralinsight-web/docs/blog-architecture.md)
- Despliegue en VPS: [`docs/deploy-vps.md`](/c:/Users/ANA/desarrollo/chimeralinsight-web/docs/deploy-vps.md)
- Checklist de seguridad: [`docs/security-checklist.md`](/c:/Users/ANA/desarrollo/chimeralinsight-web/docs/security-checklist.md)
- Operación editorial: [`docs/content-operations.md`](/c:/Users/ANA/desarrollo/chimeralinsight-web/docs/content-operations.md)

## Prioridades recomendadas

1. Añadir Prisma y esquema inicial.
2. Implementar autenticación privada con roles `admin` y `editor`.
3. Construir el blog público con SEO técnico completo.
4. Crear dashboard editorial.
5. Implementar uploads seguros y flujo de publicación.
6. Cerrar hardening, rendimiento, deploy y QA.

## Notas de mantenimiento

- Este proyecto está orientado a despliegue en VPS con Node, PM2 y Nginx.
- El admin no debe ser indexable.
- Los uploads del blog no deben vivir dentro de `public/` durante la edición; deben almacenarse en una ruta controlada del servidor y exponerse de forma segura.
- SQLite es válido para la fase inicial, pero la capa de acceso debe diseñarse para permitir migración futura a PostgreSQL sin rehacer el dominio.
