# Production Roadmap

## Objetivo

Convertir el stack actual en una plataforma editorial segura, operable y escalable para `chimeralinsight.com` sobre VPS.

## Fase 1: Base de producción

1. Configurar variables de entorno de producción.
2. Crear estructura persistente en el VPS:
   - `shared/db`
   - `shared/storage/media/originals`
   - `shared/storage/media/derivatives`
   - `shared/storage/media/temp`
   - `shared/logs`
3. Desplegar la app con releases versionados y symlink `current`.
4. Ejecutar `npm run prisma:deploy`.
5. Configurar `GOOGLE_CLIENT_ID`, `ADMIN_ALLOWED_EMAILS` y `EDITOR_ALLOWED_EMAILS`.

## Fase 2: Seguridad web

1. Publicar detrás de Nginx con HTTPS obligatorio.
2. Configurar rate limiting para login y uploads en Nginx.
3. Activar headers de seguridad en app y proxy.
4. Asegurar permisos mínimos de escritura sobre DB y media.
5. Configurar backups automáticos diarios para DB y media.

## Fase 3: Flujo editorial

1. Validar login Google-only con allowlist.
2. Validar cierre de sesión al cerrar el navegador.
3. Validar protección de rutas privadas.
4. Probar creación de draft, edición y publicación.
5. Validar subida de imágenes y render en `/blog`.

## Fase 4: Escalabilidad del dominio editorial

1. Añadir revisiones de posts.
2. Añadir publicación programada.
3. Añadir redirects para cambios de slug.
4. Añadir taxonomías editoriales (`tags`, `categories`).
5. Diseñar migración de SQLite a PostgreSQL antes de crecimiento fuerte.

## Fase 5: Observabilidad y operación

1. Integrar healthchecks y smoke tests post-deploy.
2. Vigilar uso de disco, memoria y errores 5xx.
3. Establecer rutina de rollback por release.
4. Documentar restauración completa de DB + media.

## Decisión recomendada a medio plazo

Mantener SQLite solo como fase inicial de despliegue en VPS único. Antes de abrir el flujo editorial con volumen real, migrar a PostgreSQL para reducir riesgo operativo y facilitar crecimiento futuro.
