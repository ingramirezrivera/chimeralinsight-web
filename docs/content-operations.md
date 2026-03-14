# Operación Editorial

## Usuarios internos

- Robin: `EDITOR`
- Administrador técnico: `ADMIN`

No se prevé soporte multiusuario abierto en esta fase.

## Flujo editorial esperado

1. Entrar a `/admin/login`.
2. Ir a `/admin/posts`.
3. Crear nuevo artículo.
4. Completar título, slug, excerpt, SEO y contenido.
5. Subir imagen destacada y, si aplica, imágenes internas.
6. Guardar en borrador.
7. Revisar vista previa si se habilita.
8. Publicar.
9. Editar o despublicar cuando sea necesario.

## Campos mínimos por post

- Título
- Slug
- Excerpt
- Imagen destacada
- Alt text de imagen destacada
- Contenido
- SEO title
- SEO description
- Estado
- Fecha de publicación

## Reglas editoriales recomendadas

- Usar títulos claros y no excesivamente largos.
- Mantener slugs limpios, cortos y estables.
- Escribir un excerpt útil para listados y metadescripción.
- Añadir `alt` descriptivo a cada imagen importante.
- Evitar publicar sin SEO title y SEO description revisados.

## Reglas de media

- Preferir `webp`, `jpg` o `png` según el caso.
- Mantener imágenes comprimidas antes de subir.
- No reutilizar nombres manuales; el sistema debe generarlos.
- Revisar que toda imagen tenga contexto editorial real.

## Buenas prácticas SEO editoriales

- Un solo `h1` por artículo.
- Subtítulos jerárquicos.
- Enlaces internos cuando aporten valor.
- Imágenes con sentido y texto alternativo.
- Contenido legible en bloques cortos.

## Operación técnica mínima

- Revisar backups de base de datos y uploads.
- Verificar que sitemap y metadata reflejen nuevos posts publicados.
- Comprobar después de publicar que el post carga correctamente en mobile y desktop.
