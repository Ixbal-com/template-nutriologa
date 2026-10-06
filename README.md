# Plantilla Ixbal · Nutrióloga

Plantilla para nutriólogas, nutriólogos y consultorios de nutrición. Estilo **fresco y apetitoso**: verde albahaca y durazno sobre crema, formas redondeadas, títulos en Young Serif y texto en Manrope.

**Incluye:** hero con retrato y nota flotante, franja de "¿Te suena familiar?", **test de un minuto por pasos que recomienda un plan y lo manda por WhatsApp con las respuestas**, planes con precio, cómo funciona en cuatro pasos, recetas, sobre mí con credenciales, consulta presencial y en línea, resultados de pacientes, preguntas frecuentes y contacto con horario y mapa.

Ejemplo: **Nutre · Nut. Daniela Ríos**, Puebla.

## Uso

```bash
npm run dev     # servidor local en http://localhost:4321
npm run check   # valida el sitio (sin dependencias)
```

Ábrela con un servidor, no con doble clic: los navegadores no ejecutan módulos de JavaScript desde `file://`.

## Personalizar

1. **Identidad:** colores y tipografía en `assets/css/tokens.css`.
2. **Contenido:** textos, planes, preguntas del test y recetas en `index.html`, organizado por secciones.
3. **Imágenes:** 10 espacios de imagen listados en `imageSlots` de `template.json`, con fotos de ejemplo en `images/` generadas con IA (`gpt-image-2.5-sunburst`). Reemplázalas por fotos reales; ver [AGENTS.md](AGENTS.md#espacios-de-imagen).

Las reglas de arquitectura, la lista de datos que se repiten y cómo funciona el test están en [AGENTS.md](AGENTS.md).

## Módulos compartidos

Los archivos de `scripts/check.mjs` y de `assets/js/modules/` (y los CSS iniciales de los módulos) vienen de la biblioteca de plantillas Ixbal (`biblioteca/`). Esta plantilla usa `wizard` y `whatsapp-form` (ver `"modules"` en `template.json`). Para cambiarlos en todas las plantillas, edítalos en la biblioteca y corre `npm run sync` ahí.

## Publicar

Es un sitio estático: sirve la raíz del repositorio en GitHub Pages, Netlify, Vercel o AWS Amplify.

> Antes de publicar, convierte `assets/img/og-image.svg` a PNG de 1200 × 630 y usa una URL absoluta en `og:image`: WhatsApp y Facebook no muestran vistas previas en SVG.
