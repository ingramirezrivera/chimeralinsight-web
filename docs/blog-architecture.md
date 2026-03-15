# Arquitectura del Blog de Chimeral Insight

## Objetivo

Construir un blog profesional integrado en `chimeralinsight.com` con control editorial interno, SEO técnico serio, seguridad de producción y operación simple para Robin.

## Propuesta final recomendada

La solución recomendada es:

- `Next.js App Router` para rutas públicas y privadas.
- `Prisma` como ORM.
- `SQLite` en la fase inicial sobre el VPS.
- `Auth.js` con `Credentials Provider` y sesiones por cookie.
- `TipTap` con extensiones controladas para edición rica.
- `Route Handlers` para uploads, auth y endpoints internos.
- `Server Actions` para formularios del admin donde reduzcan complejidad.

Esta combinación mantiene el proyecto dentro del mismo stack, evita costos mensuales innecesarios y conserva control total sobre datos, SEO y despliegue.

## Decisiones técnicas y justificación

### 1. App Router

- Encaja con la base actual del proyecto.
- Permite `Server Components`, `generateMetadata`, `sitemap.ts` y `robots.ts`.
- Reduce JavaScript en páginas públicas del blog.

### 2. Prisma + SQLite

- Prisma acelera el desarrollo y deja la puerta abierta a PostgreSQL.
- SQLite simplifica la fase inicial en VPS con bajo costo operativo.
- Se recomienda evitar lógica SQL acoplada al motor para facilitar migración futura.

### 3. Auth.js con credenciales

- Solo hay dos usuarios internos, así que no hace falta OAuth.
- Facilita sesiones seguras por cookie y protección centralizada.
- Permite separar permisos `admin` y `editor`.

### 4. TipTap

- Más flexible y mantenible que un editor WYSIWYG pesado.
- Permite contenido estructurado, serialización limpia y render controlado.
- Buen equilibrio entre experiencia editorial y control técnico.

### 5. Uploads locales en VPS

- Cumple el requisito de evitar SaaS de pago.
- Simplifica backups junto con base de datos.
- Requiere una implementación cuidadosa para seguridad de archivos.

## Estructura de proyecto propuesta

```text
src/
  app/
    (site)/
      page.tsx
      blog/
        page.tsx
        [slug]/
          page.tsx
      sitemap.ts
      robots.ts
    admin/
      login/
        page.tsx
      dashboard/
        page.tsx
      posts/
        page.tsx
        new/
          page.tsx
        [id]/
          edit/
            page.tsx
    api/
      auth/
        [...nextauth]/
          route.ts
      admin/
        posts/
      media/
        upload/
          route.ts
  components/
    admin/
    blog/
    editor/
    shared/
  lib/
    auth/
    db/
    seo/
    storage/
    validations/
    security/
  types/
prisma/
  schema.prisma
storage/
  uploads/
docs/
```

## Modelo de datos inicial

```prisma
enum UserRole {
  ADMIN
  EDITOR
}

enum PostStatus {
  DRAFT
  PUBLISHED
}

model User {
  id           String    @id @default(cuid())
  email        String    @unique
  passwordHash String
  role         UserRole
  posts        Post[]
  media        Media[]   @relation("MediaUploadedBy")
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
}

model Post {
  id                String      @id @default(cuid())
  title             String
  slug              String      @unique
  excerpt           String?
  content           Json
  featuredImage     String?
  featuredImageAlt  String?
  seoTitle          String?
  seoDescription    String?
  status            PostStatus  @default(DRAFT)
  publishedAt       DateTime?
  author            User?       @relation(fields: [authorId], references: [id])
  authorId          String?
  createdAt         DateTime    @default(now())
  updatedAt         DateTime    @updatedAt
}

model Media {
  id          String    @id @default(cuid())
  filename    String
  path        String
  mimeType    String
  size        Int
  alt         String?
  uploadedBy  User?     @relation("MediaUploadedBy", fields: [uploadedById], references: [id])
  uploadedById String?
  createdAt   DateTime  @default(now())
}
```

## Rutas públicas y privadas

### Públicas

- `/blog`
- `/blog/[slug]`
- `/sitemap.xml`
- `/robots.txt`

### Privadas

- `/admin/login`
- `/admin/dashboard`
- `/admin/posts`
- `/admin/posts/new`
- `/admin/posts/[id]/edit`

## Flujo de autenticación

1. Usuario entra a `/admin/login`.
2. Envía email y contraseña.
3. El servidor valida credenciales contra `passwordHash`.
4. Si son válidas, se crea sesión segura por cookie.
5. Middleware y layouts privados verifican sesión y rol.
6. `editor` puede crear y editar posts.
7. `admin` puede administrar usuarios internos, configuración futura y acciones críticas.

## CRUD editorial

### Crear

- Título
- Slug autogenerado editable
- Excerpt
- Imagen destacada
- Contenido rico
- SEO title
- SEO description
- Alt text
- Estado inicial `DRAFT`

### Editar

- Cambios persistidos con validación server-side
- Vista previa opcional usando ruta protegida o preview token interno

### Publicar

- Cambiar `status` a `PUBLISHED`
- Registrar `publishedAt`
- Revalidar índice y detalle del blog

### Despublicar

- Volver a `DRAFT`
- Mantener contenido sin exposición pública

### Eliminar

- Borrado controlado desde admin
- Idealmente soft delete en una fase futura si el volumen crece

## Estrategia de uploads

- Carpeta recomendada: `storage/uploads/blog/`
- Nombre generado por sistema: UUID o hash + extensión permitida
- Validar:
  - extensión permitida
  - MIME real del archivo
  - tamaño máximo
  - longitud de nombre original
  - usuario autenticado
- No confiar solo en `Content-Type` enviado por el cliente
- Registrar cada archivo en tabla `Media`
- Servir imágenes con ruta controlada y `next/image` en frontend

## SEO plan

- `generateMetadata` por página y por post
- `title` y `description` por artículo
- `canonical` correcto por URL pública
- Open Graph y Twitter cards
- `sitemap.ts` con rutas del blog
- `robots.ts` permitiendo solo contenido público
- Admin con `noindex, nofollow`
- JSON-LD tipo `Article` en posts publicados
- Jerarquía semántica de headings
- Alt text obligatorio en imagen destacada y recomendable en imágenes internas

## Performance plan

- Blog público renderizado principalmente en servidor
- Componentes cliente solo donde haya interacción real
- `next/image` con tamaños adecuados
- fuentes con `next/font`, evitando `@import` remotos en CSS
- contenido del blog sin librerías pesadas en la parte pública
- revalidación por contenido publicado
- minimizar dependencias del editor al área privada

## Seguridad

- Hash de contraseñas con `argon2id`
- cookies `httpOnly`, `secure`, `sameSite=lax` o más estricto donde aplique
- validación server-side con `zod`
- autorización por rol y mínimo privilegio
- rate limiting de login y uploads
- admin no indexable
- logs útiles sin secretos ni contraseñas
- secretos solo en variables de entorno

## Fases de implementación

### Fase 1: base técnica

- Instalar Prisma
- Crear `schema.prisma`
- Configurar cliente Prisma
- Preparar estructura de carpetas

### Fase 2: auth

- Instalar Auth.js
- Login con credenciales
- Roles `ADMIN` y `EDITOR`
- Protección de rutas privadas

### Fase 3: blog público

- `/blog`
- `/blog/[slug]`
- layout editorial
- metadata dinámica

### Fase 4: dashboard/admin

- listado de posts
- creación
- edición
- borrador/publicación

### Fase 5: uploads

- endpoint de carga
- validaciones de seguridad
- integración con editor

### Fase 6: SEO/performance/security polish

- sitemap
- robots
- canonical
- JSON-LD
- hardening de auth y formularios
- revisión Core Web Vitals

### Fase 7: deploy y QA

- PM2
- Nginx
- SSL
- backups
- smoke tests

## Criterios de aceptación

- El blog público carga desde `/blog` y `/blog/[slug]`.
- Los posts publicados tienen metadata completa y URL canónica.
- El admin requiere autenticación y controla acceso por rol.
- Robin puede crear, guardar borradores, editar, publicar y despublicar.
- Las imágenes se suben al VPS con validación fuerte.
- El admin no es indexable.
- El sitio mantiene buen rendimiento en mobile.
- La solución puede migrar a PostgreSQL sin rehacer el dominio.

## Riesgos y mitigaciones

- `SQLite` puede quedarse corto si crece el tráfico o hay muchas escrituras.
  - Mitigación: mantener Prisma y evitar acoplamiento al motor.
- Uploads locales pueden crecer sin control.
  - Mitigación: límites, limpieza operativa y backups.
- El editor enriquecido puede complejizar el render.
  - Mitigación: esquema de contenido limitado y renderer propio.
- Login con credenciales exige hardening cuidadoso.
  - Mitigación: rate limiting, hashing fuerte, cookies seguras y logs controlados.
