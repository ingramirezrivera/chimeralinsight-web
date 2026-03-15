# Checklist de Seguridad

## Autenticación

- Usar credenciales internas solo para `admin` y `editor`.
- Hashear contraseñas con `argon2id`.
- No registrar contraseñas ni hashes en logs.
- Añadir rate limiting en login por IP y por email.
- Mensajes de error genéricos en login.

## Sesiones

- Cookies `httpOnly`.
- Cookies `secure` en producción.
- `sameSite` apropiado.
- Rotación de secreto en procedimiento controlado.
- Expiración de sesión razonable para panel interno.

## Autorización

- Verificar sesión en middleware o layouts privados.
- Verificar rol en servidor, no solo en UI.
- Aplicar principio de mínimo privilegio.
- `editor` y `admin` deben tener permisos explícitos.

## Validación de entradas

- Validar formularios con esquema server-side.
- No confiar en datos del cliente.
- Limitar longitud de campos como título, excerpt, alt y slug.
- Sanitizar o renderizar de forma segura el contenido enriquecido.

## Uploads

- Aceptar solo tipos permitidos.
- Verificar MIME real del archivo.
- Limitar tamaño máximo.
- Renombrar archivos en servidor.
- Evitar rutas construidas desde input del usuario.
- Guardar metadatos del archivo en base de datos.

## SEO y exposición

- Marcar admin como `noindex, nofollow`.
- No listar rutas privadas en sitemap.
- No exponer secretos en cliente.
- Revisar metadata para evitar indexación accidental.

## Infraestructura

- SSL obligatorio.
- Mantener Node y dependencias actualizadas.
- Rotar logs y evitar datos sensibles.
- Restringir permisos de escritura de uploads y base de datos.
- Preparar backups verificables.

## QA antes de producción

- Probar login inválido y rate limiting.
- Probar permisos por rol.
- Probar carga de archivo inválido.
- Probar acceso directo a rutas privadas sin sesión.
- Probar que `robots.txt` no habilita admin.
