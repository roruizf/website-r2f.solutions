# Publicar r2f.solutions en Hostinger

Guía paso a paso para reemplazar el sitio actual por el rediseño de la rama `redesign-2026`.
El sitio es estático (HTML, CSS, una imagen y un script pequeño): no necesita base de datos,
PHP ni Node en el servidor.

---

## 0. Antes de tocar nada: respaldo del sitio actual

El sitio que hoy está en línea **no está en GitHub** (la rama `main` tiene la versión de 2022).
Si no lo respaldas, se pierde.

1. Entra a **hPanel** → **Websites** → `r2f.solutions` → **Manage**.
2. **Files** → **File Manager** → abre `public_html`.
3. Selecciona todo → clic derecho → **Compress** → formato `.zip` → nombre `backup-2026-10.zip`.
4. Descarga ese `.zip` a tu computador y guárdalo en Drive.
5. En el File Manager, crea la carpeta `public_html/_old-site/` y **mueve ahí** todo lo que
   estaba en `public_html` (menos el `.zip`). Así el sitio viejo queda a mano por si hay que volver.

---

## 1. Conectar Formspree (formulario Credit Viability Read)

Hazlo antes de publicar, para que el formulario funcione desde el primer día.

1. Entra a <https://formspree.io> y crea una cuenta con `roberto@r2f.solutions`.
2. **+ New form** → nombre: `Credit Viability Read` → email de destino: `roberto@r2f.solutions`.
3. Copia el **ID del formulario** (8 caracteres, por ejemplo `xpznqkdl`).
4. En **Settings** del formulario:
   - **Restrict to domain**: `r2f.solutions` (evita que otros usen tu formulario).
   - Deja activada la protección contra spam (reCAPTCHA de Formspree o el campo oculto
     `_gotcha`, que ya está en el formulario).
5. Pásale el ID a Claude, o reemplaza tú `FORMSPREE_ID` en `index.html`. Aparece **dos veces**
   en la misma línea del `<form>`.

Mientras `FORMSPREE_ID` no se reemplace, el formulario abre el email del visitante con las
respuestas ya escritas (modo de respaldo).

El plan gratuito de Formspree tiene un límite mensual de envíos; para este uso debería alcanzar. Revisa el límite vigente en su página de precios.

---

## 2. Subir el sitio — opción A (recomendada): Git en hPanel

Con esto, cada cambio que se suba a GitHub se publica sin copiar archivos a mano.

1. Primero, fusiona `redesign-2026` en `main` en GitHub (Pull request → Merge), o usa
   directamente la rama `redesign-2026` en el paso 4.
2. hPanel → `r2f.solutions` → **Advanced** → **GIT**.
3. **Si el repositorio es privado**: en esa misma pantalla, Hostinger muestra una
   **SSH key**. Cópiala y agrégala en GitHub → repo `website-r2f.solutions` → **Settings** →
   **Deploy keys** → **Add deploy key** (solo lectura). Luego usa la URL SSH
   `git@github.com:roruizf/website-r2f.solutions.git`.
   **Si es público**: usa `https://github.com/roruizf/website-r2f.solutions.git`.
4. **Branch**: `main` (o `redesign-2026`). **Directory**: déjalo vacío (instala en `public_html`).
   `public_html` debe estar vacío salvo `_old-site/`; si Hostinger se queja, mueve
   `_old-site/` fuera de `public_html` temporalmente.
5. **Create** y luego **Deploy**.
6. Opcional: activa **Auto deployment** y pega el webhook que te da Hostinger en GitHub →
   **Settings** → **Webhooks**. Desde ahí, cada push a la rama se publica solo.

Las carpetas del repo que no son parte del sitio (`.claude/`, `docs/`, `README.md`) quedan
**bloqueadas** al público por el archivo `.htaccess`.

## 2. Subir el sitio — opción B: a mano con el File Manager

1. En GitHub → repo → selecciona la rama → **Code** → **Download ZIP**.
2. Descomprime en tu computador. Borra `.claude/`, `docs/` y `README.md`.
3. Vuelve a comprimir **el contenido** (no la carpeta) en un `.zip`.
4. File Manager → `public_html` → **Upload** → sube el `.zip` → clic derecho → **Extract**.
5. Comprueba que `index.html`, `.htaccess` y las carpetas `css/`, `img/`, `fonts/`, `js/`,
   `services/`, `cases/`, `about/`, `privacy/` quedaron directamente dentro de `public_html`.
   El `.htaccess` empieza con punto: activa **Show hidden files** para verlo.

---

## 3. Revisar que todo funciona

Abre cada dirección y confirma:

| Dirección | Qué debe pasar |
|---|---|
| `http://r2f.solutions` | Redirige a `https://r2f.solutions/` |
| `https://www.r2f.solutions` | Redirige a `https://r2f.solutions/` |
| `https://r2f.solutions/services/` | Página de servicios |
| `https://r2f.solutions/cases/east-gate/` | Caso East Gate |
| `https://r2f.solutions/about/` | Página About con tu foto |
| `https://r2f.solutions/no-existe` | Página "This page is not here." |
| `https://r2f.solutions/docs/` | **Prohibido (403)** |
| Formulario en la portada | Envía y muestra "Thank you"; llega el email |

Si el certificado SSL no está activo: hPanel → **Security** → **SSL** → instalar el gratuito.

---

## 4. Google Search Console (una sola vez)

1. Entra a <https://search.google.com/search-console> con tu cuenta de Google.
2. **Add property** → **Domain** → `r2f.solutions`.
3. Google te da un registro **TXT**. En hPanel → **Domains** → `r2f.solutions` → **DNS / Nameservers**
   → **Add record** → tipo `TXT`, nombre `@`, valor el que te dio Google. Guarda y vuelve a
   Search Console → **Verify** (puede tardar unos minutos).
4. **Sitemaps** → escribe `sitemap.xml` → **Submit**.
5. Opcional: lo mismo en Bing Webmaster Tools (permite importar desde Search Console).

---

## 5. Volver atrás si algo sale mal

- **Opción A (Git)**: en GitHub, revierte el commit problemático y vuelve a hacer **Deploy**.
- **Opción B o emergencia**: en el File Manager borra el contenido nuevo de `public_html` y mueve
  de vuelta lo que está en `_old-site/`.

---

## Cuando cambie algo del sitio

- `sitemap.xml`: actualiza la fecha `lastmod` de la página que cambió, o agrega la página nueva.
- Página nueva: copia la cabecera (`<head>`) de una página parecida para mantener título,
  descripción, `canonical`, imagen para redes y tipografía.
