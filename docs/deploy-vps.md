# Despliegue en VPS

## Objetivo

Desplegar `chimeralinsight.com` y su futuro blog/admin con control total sobre aplicación, base de datos y uploads, sin dependencia de plataformas externas de pago.

## Stack de infraestructura

- VPS Linux
- Node.js LTS
- PM2 para gestionar el proceso
- Nginx como reverse proxy
- Certificados SSL
- SQLite en disco local
- Carpeta persistente para uploads

## Estructura recomendada en servidor

```text
/var/www/chimeralinsight/
  app/current
  app/shared/storage/uploads/blog
  app/shared/db
  logs
```

## Variables de entorno sugeridas

```bash
NODE_ENV=production
PORT=3000
APP_URL=https://chimeralinsight.com
DATABASE_URL=file:/var/www/chimeralinsight/app/shared/db/chimeral.db
AUTH_SECRET=replace-with-long-random-secret
AUTH_TRUST_HOST=true
UPLOAD_DIR=/var/www/chimeralinsight/app/shared/storage/uploads/blog
MAX_UPLOAD_BYTES=5242880
```

## Flujo de despliegue recomendado

1. Instalar dependencias.
2. Ejecutar migraciones Prisma.
3. Generar build de Next.js.
4. Arrancar con PM2 usando `next start`.
5. Poner Nginx delante con SSL y cabeceras seguras.

## PM2

Ejemplo conceptual:

```bash
pm2 start npm --name chimeralinsight-web -- start
pm2 save
pm2 startup
```

## Nginx

Recomendaciones:

- Proxy a `127.0.0.1:3000`
- Redirección `www` -> dominio canónico o viceversa
- `client_max_body_size` alineado con límite de uploads
- cabeceras de seguridad
- compresión y caché de assets estáticos

## Backups

Respaldar como mínimo:

- base de datos SQLite
- carpeta de uploads
- variables de entorno seguras fuera del repo

Frecuencia recomendada:

- diario para base de datos
- diario o incremental para uploads
- previo a cada despliegue importante

## Consideraciones operativas

- No almacenar uploads editoriales efímeros en `public/`.
- Asegurar permisos correctos de escritura para la carpeta de storage.
- Vigilar tamaño del disco y rotación de logs.
- Preparar script simple de restauración de base de datos y media.
