<div align="center">
  <img src="https://res.cloudinary.com/du94mex28/image/upload/c_pad,w_380,h_380,b_rgb:050505/f_png/v1789125279/4k/assets/capsule-corp-seeklogo_tcwhkt.png" alt="Capsule Corp" width="190">
  <h1>Capsule Corp Store</h1>
  <p>Catálogo responsive inspirado en el universo Dragon Ball, construido con React, TypeScript y Vite.</p>
</div>

## Demo

El acceso es una experiencia demo: introduce cualquier nombre de al menos dos caracteres. No se solicita contraseña ni se envían datos de autenticación a la API.

El recorrido principal incluye:

- catálogo de ropa y objetos;
- selección de productos más buscados;
- ficha de producto con galería;
- wishlist y carrito persistentes;
- checkout responsive con validación;
- estados de carga, error y contenido vacío.

## Screenshots

### Home · desktop

![Capsule Corp home desktop](docs/screenshots/home-desktop.png)

### Home · mobile

<img src="docs/screenshots/home-mobile.png" alt="Capsule Corp home mobile" width="390">

### Catálogo · hover desktop

![Capsule Corp catalog hover](docs/screenshots/catalog-hover-desktop.png)

### Login

![Capsule Corp login](docs/screenshots/login-desktop.png)

## Stack

- React 19.3
- TypeScript 6.0
- Vite 8.3
- React Router 7.18
- React Hook Form 7.86
- Swiper 14.2
- React Hot Toast 2.6
- CSS responsive sin framework visual

## Requisitos

- Node.js 24 LTS (versión fijada en `.nvmrc`)
- pnpm 10 o superior
- API de Capsule Corp disponible en local o desplegada

## Ejecución local

La API y el frontend viven en repositorios separados. Con ambos directorios al mismo nivel:

```text
Capsule-Corp/
Capsule-Corp-Api/
```

El único catálogo es `Capsule-Corp-Api/db.json`. Este frontend obtiene los productos de la API en tiempo de ejecución: no mantiene un JSON duplicado ni incluye datos de productos en el build. Los cambios de catálogo se hacen y despliegan únicamente en el repositorio de la API.

Inicia primero la API:

```bash
cd ../Capsule-Corp-Api
npm install
npm start
```

La API quedará disponible en `http://localhost:3000`.

Después inicia el frontend:

```bash
cd ../Capsule-Corp
pnpm install
pnpm dev
```

Vite abrirá la aplicación en `http://localhost:5173` o en el siguiente puerto libre.

## Variables de entorno

Copia `.env.example` como `.env.local` para desarrollo:

```env
VITE_API_BASE_URL=http://localhost:3000
```

También se mantienen los endpoints específicos por compatibilidad:

```env
VITE_API_BASE_URL_CLOTHES=http://localhost:3000/clothes
VITE_API_BASE_URL_ITEMS=http://localhost:3000/items
```

`VITE_API_BASE_URL` es la opción recomendada. Sin variables, desarrollo usa `http://localhost:3000` y el build de producción usa `https://capsule-corp-api.vercel.app`. Los endpoints específicos tienen prioridad sobre la URL base: elimina overrides antiguos si cambias de API.

En Vercel configura `VITE_API_BASE_URL=https://capsule-corp-api.vercel.app` en Production y la API que quieras probar en Preview. Estas variables son públicas y Vite las incorpora durante el build; cambiarlas requiere un nuevo despliegue del frontend. No añadas claves privadas. Una `.env.local` con localhost también afecta a builds locales, por lo que debes ajustar esa variable al generar un build que vayas a publicar. [Variables de Vite](https://vite.dev/guide/env-and-mode).

## API

| Método | Endpoint | Descripción |
| --- | --- | --- |
| GET | `/health` | Estado y número total de productos |
| GET | `/clothes` | Colección de ropa |
| GET | `/items` | Colección de objetos |
| GET | `/clothes/:id` | Prenda por ID |
| GET | `/items/:id` | Objeto por ID |
| GET | `/api/clothes` | Alias preparado para despliegue |
| GET | `/api/items` | Alias preparado para despliegue |

Las colecciones aceptan `q`, `_page` y `_limit`.

## Calidad

```bash
pnpm run lint
pnpm run build
pnpm run preview
```

La API se valida con:

```bash
npm run check
npm audit
```

## Despliegue en Vercel

### API

1. En el proyecto de la API, comprueba que Git está conectado a `antonyoandrei/Capsule-Corp-Api`, directorio raíz del repositorio y rama de producción `main`.
2. La función es `api/server.js`; su `vercel.json` incluye `db.json` en el paquete y dirige las rutas hacia `/api/server`. No necesita copiar datos del frontend.
3. Publica primero los cambios de la API y espera a que el despliegue termine. Comprueba `https://capsule-corp-api.vercel.app/clothes/49`, `/clothes/50` y que `/items/39` y `/items/43` devuelven 404. `/health` debe indicar 48 productos; ese número solo no distingue el catálogo nuevo del anterior.

### Frontend

1. En el proyecto del frontend, comprueba que Git está conectado a `antonyoandrei/Capsule-Corp`, directorio raíz del repositorio y rama de producción `master`.
2. Confirma `VITE_API_BASE_URL` en el entorno de destino y Node.js 24 LTS.
3. Usa `pnpm run build` y `dist` como directorio de salida. `vercel.json` ya configura ambos valores y conserva las rutas de React Router al abrir una URL directa.
4. Publica los cambios del frontend y comprueba `https://capsulecorp.vercel.app/product-page/49`. El HTML se revalida; los archivos con hash de `/assets/` tienen caché inmutable.

Son dos repositorios y dos despliegues independientes. Un push de la API actualiza el catálogo; un push del frontend actualiza la interfaz. Para una entrega que modifica ambos, hace falta publicar ambos repositorios. La integración Git de Vercel genera producción desde la rama configurada y previews desde las demás; un `vercel.json` local no conecta por sí solo un repositorio. [Despliegues desde Git](https://vercel.com/docs/git).

La consulta de GitHub del 11 de septiembre de 2026 mostró despliegues Production completados por `vercel[bot]` para ambos repositorios el 24 de agosto. No hay workflows de GitHub Actions. Las variables y la rama configurada en el panel de Vercel deben comprobarse allí antes de publicar.

## Persistencia

La sesión demo, la wishlist y el carrito se guardan en `localStorage`. La API es pública y de solo lectura; el checkout simula una orden y no procesa pagos ni almacena datos personales.

El catálogo guardado se muestra inmediatamente al abrir la app, mientras se revalida con la API. Cada carga completa consulta ambas colecciones, aunque la copia tenga menos de cinco minutos: un despliegue de datos no requiere reconstruir el frontend ni esperar a ese plazo. Dentro de la misma carga se comparte la caché y se deduplican peticiones; no hay polling. Una pestaña que permanece abierta ve un nuevo despliegue al recargar. Si falla la API, se conserva la última copia válida.
