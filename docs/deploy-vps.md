# Despliegue en VPS

## Objetivo

Desplegar `chimeralinsight.com` y su blog/admin con control total sobre aplicación, base de datos y media editorial, sin depender de plataformas externas de pago.

## Stack de infraestructura

- VPS Linux
- Node.js LTS
- PM2 para gestionar el proceso
- Nginx como reverse proxy
- Certificados SSL
- SQLite en disco local durante la fase inicial
- Carpeta persistente para media editorial
- Google Sign-In con allowlist cerrada para el admin

## Estructura recomendada en servidor

```text
/var/www/chimeralinsight/
  releases/
    2026-03-16_001/
  current
  shared/
    env/.env.production
    storage/
      media/
        originals/
        derivatives/
        temp/
    db/
    logs/
```

## Variables de entorno sugeridas

```bash
NODE_ENV=production
PORT=3000
APP_URL=https://chimeralinsight.com
DATABASE_URL=file:/var/www/chimeralinsight/shared/db/chimeral.db
AUTH_SECRET=replace-with-long-random-secret
MEDIA_ROOT_DIR=/var/www/chimeralinsight/shared/storage/media
MAX_UPLOAD_BYTES=5242880
GOOGLE_CLIENT_ID=replace-with-google-web-client-id
ADMIN_ALLOWED_EMAILS=admin1@example.com
EDITOR_ALLOWED_EMAILS=editor1@example.com
MAILERLITE_API_KEY=
MAILERLITE_GROUP_ID_BLOG=
MAILERLITE_GROUP_ID_WHIPTHEDOGS=
RECAPTCHA_SECRET_KEY=
NEXT_PUBLIC_RECAPTCHA_SITE_KEY=
```

Guardar este archivo fuera del repo, por ejemplo en:

```bash
/var/www/chimeralinsight/shared/env/.env.production
```

## Flujo de despliegue recomendado

1. Instalar dependencias.
2. Cargar o actualizar `/var/www/chimeralinsight/shared/env/.env.production`.
3. Ejecutar `ENV_FILE_PATH=/var/www/chimeralinsight/shared/env/.env.production npm run env:check:production`.
4. Ejecutar `ENV_FILE_PATH=/var/www/chimeralinsight/shared/env/.env.production npm run prisma:deploy`.
5. Generar build de Next.js.
6. Arrancar con PM2 usando `npm run start:production`.
7. Poner Nginx delante con SSL, rate limiting y cabeceras seguras.
8. Hacer el primer acceso al admin con una de las cuentas Google permitidas para que el usuario quede creado/actualizado automáticamente.

## PM2

Ejemplo conceptual:

```bash
ENV_FILE_PATH=/var/www/chimeralinsight/shared/env/.env.production pm2 start npm --name chimeralinsight-web -- run start:production
pm2 save
pm2 startup
```

Esto permite que los despliegues cambien código en `releases/` o `current`, pero no toquen las claves reales guardadas en `shared/env`.

## Nginx

Recomendaciones:

- Proxy a `127.0.0.1:3000`
- Redirección `www` -> dominio canónico o viceversa
- `client_max_body_size` alineado con el límite de uploads
- cabeceras de seguridad
- compresión y caché de assets estáticos
- rate limiting fuerte en login y uploads

## Backups

Respaldar como mínimo:

- base de datos SQLite
- carpeta `shared/storage/media`
- variables de entorno seguras fuera del repo

Frecuencia recomendada:

- diario para base de datos
- diario o incremental para media
- previo a cada despliegue importante

## Consideraciones operativas

- No almacenar uploads editoriales efímeros en `public/`.
- Asegurar permisos correctos de escritura para `shared/storage/media`.
- Vigilar tamaño del disco y rotación de logs.
- Preparar script simple de restauración de base de datos y media.
- Mantener la ruta `current` como symlink al release activo para facilitar rollback.
