# Hostinger Env Strategy

## Objetivo

Mantener las claves reales fuera de GitHub y fuera de cada release del código, para que los pushes a `main` no sobrescriban secretos ni obliguen a revisarlos en cada despliegue.

## Regla principal

- GitHub guarda solo plantillas como `.env.example`.
- El VPS guarda las variables reales en `shared/env/.env.production`.
- Los procesos de producción arrancan leyendo ese archivo externo mediante `ENV_FILE_PATH`.

## Ruta recomendada

```text
/var/www/chimeralinsight/shared/env/.env.production
```

## Flujo recomendado

1. Actualizar el código en `releases/` o en `current`.
2. No copiar ningún `.env` desde el repo.
3. Mantener el archivo real solo en `shared/env/.env.production`.
4. Validar variables con:
   - `ENV_FILE_PATH=/var/www/chimeralinsight/shared/env/.env.production npm run env:check:production`
5. Arrancar la app con:
   - `ENV_FILE_PATH=/var/www/chimeralinsight/shared/env/.env.production npm run start:production`

## Cuándo rotar claves

- Si un secreto real estuvo en un commit o en GitHub.
- Si el VPS o una cuenta de acceso fue comprometida.
- Si compartiste el archivo real por canales inseguros.
- Si cambió una persona con acceso operativo.

## Cuándo no hace falta rotar

- Si la clave ha vivido solo en el VPS o en tu máquina local y nunca fue subida al repositorio.
- Si hiciste deploys normales sin exponer el archivo real.

## Variables mínimas para blog/admin

- `APP_URL`
- `AUTH_SECRET`
- `DATABASE_URL`
- `MEDIA_ROOT_DIR`
- `GOOGLE_CLIENT_ID`
- `ADMIN_ALLOWED_EMAILS`
- `EDITOR_ALLOWED_EMAILS`

## Variables de features externas

- `MAILERLITE_API_KEY`
- `MAILERLITE_GROUP_ID_BLOG`
- `MAILERLITE_GROUP_ID_WHIPTHEDOGS`
- `RECAPTCHA_SECRET_KEY`
- `NEXT_PUBLIC_RECAPTCHA_SITE_KEY`
