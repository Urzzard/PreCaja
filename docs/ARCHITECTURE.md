# ARCHITECTURE.md — Arquitectura y modelo de datos

## Principio general

La app es **cliente puro**: React corriendo en el navegador del celular, con persistencia local
en IndexedDB mediante Dexie.js. No hay backend, no hay API propia, no hay red en el camino crítico.

## Modelo de datos

Cuatro tablas (en Dexie se llaman "object stores", pero las tratamos como tablas relacionadas
por sus identificadores). Relaciones:

- Un **item** pertenece a una **caja** (`boxId`) y referencia a un **producto** (`productCode`).
- El **historial de precios** no es una tabla aparte: se deriva agregando todos los items de un
  mismo producto a lo largo de las cajas. (Si el rendimiento lo exige más adelante, se puede
  desnormalizar en una tabla `prices`, pero NO se hace en las primeras fases.)

### Tabla `products`
El catálogo personal del usuario. Una fila por código de barras conocido.

| Campo | Tipo | Notas |
|-------|------|-------|
| `code` | `string` | **Clave primaria.** El código de barras (o un id generado si es manual sin código). |
| `name` | `string` | Nombre del producto. |
| `lastPrice` | `number` | Último precio registrado, para autocompletar. |
| `photo` | `Blob \| undefined` | Foto opcional del producto (comprimida). |
| `createdAt` | `number` | Timestamp de creación. |
| `updatedAt` | `number` | Timestamp de última actualización. |

### Tabla `boxes`
Cada sesión de compra.

| Campo | Tipo | Notas |
|-------|------|-------|
| `id` | `string` | **Clave primaria.** Generado (ej. `crypto.randomUUID()`). |
| `name` | `string` | Nombre dado por el usuario (ej. "Súper sábado"). |
| `createdAt` | `number` | Fecha/hora de creación. |
| `status` | `'open' \| 'closed'` | Una caja abierta es la compra en curso. |
| `approxTotal` | `number` | Total aproximado, suma de los subtotales de sus items. |
| `realTotal` | `number \| undefined` | Total real de la boleta, ingresado al cerrar. |
| `receiptPhoto` | `Blob \| undefined` | Foto de la boleta (comprimida), opcional. |

### Tabla `items`
Cada línea de un carrito. Es la tabla puente entre cajas y productos.

| Campo | Tipo | Notas |
|-------|------|-------|
| `id` | `string` | **Clave primaria.** Generado. |
| `boxId` | `string` | **FK →** `boxes.id`. Indexado. |
| `productCode` | `string` | **FK →** `products.code`. Indexado. |
| `name` | `string` | Copia del nombre al momento de registrar (para que el historial no cambie si el producto se renombra). |
| `price` | `number` | Precio unitario registrado en esta compra. |
| `quantity` | `number` | Cantidad. |
| `subtotal` | `number` | `price * quantity`. Se recalcula, no se confía en el valor guardado. |
| `createdAt` | `number` | Timestamp. |

## Esquema de Dexie (referencia de versión 1)

> Solo se indexan los campos por los que se consulta o se ordena. No es necesario listar
> todos los campos del objeto en el string del esquema de Dexie.

```ts
// db/schema.ts (referencia conceptual)
db.version(1).stores({
  products: 'code, name, updatedAt',
  boxes: 'id, status, createdAt',
  items: 'id, boxId, productCode, createdAt',
});
```

Las consultas frecuentes y su índice de apoyo:
- Items de una caja → `items.where('boxId').equals(boxId)`.
- Historial de precios de un producto → `items.where('productCode').equals(code)` ordenado por `createdAt`.
- Caja abierta actual → `boxes.where('status').equals('open')`.
- Buscar producto al escanear → `products.get(code)` (acceso directo por clave primaria).

## Decisiones técnicas y su porqué

- **IndexedDB vía Dexie, no localStorage.** localStorage es solo texto, síncrono y limitado (~5 MB).
  IndexedDB maneja volumen, blobs (fotos) y consultas indexadas. Dexie le da una API limpia tipo promesas.
- **El historial de precios se deriva, no se almacena por separado.** Evita duplicación y mantiene
  una sola fuente de verdad (`items`). El volumen de datos es pequeño (ver estimación abajo), así que
  agregar al vuelo es barato.
- **Las fotos se comprimen antes de guardar.** Una boleta o producto no necesita alta resolución.
  Redimensionar a un ancho máximo razonable y guardar como JPEG de calidad media mantiene la base ligera.
- **El nombre del item se copia del producto al registrar.** Así, renombrar un producto no altera
  cajas pasadas; el historial refleja lo que se compró tal como era entonces.
- **`subtotal` y `approxTotal` se recalculan** a partir de precio y cantidad; nunca se confía
  ciegamente en el número guardado, para evitar desincronización.

## Estimación de almacenamiento

Una fila de texto (producto o item) pesa del orden de cientos de bytes. Una compra de ~40 productos
ronda unos pocos KB. Comprar dos veces por semana durante 5 años produce del orden de unos pocos MB
de texto en total — trivial para IndexedDB. **Lo único que pesa son las fotos**, por eso se comprimen
y, opcionalmente, se podrá ofrecer borrar fotos antiguas. El texto nunca será el cuello de botella.

## Respaldo y portabilidad (fase posterior, no inicial)

Como los datos viven en el dispositivo, borrar los datos del navegador o desinstalar los elimina.
Por eso, en una fase posterior, se añadirá **exportar/importar** (un archivo JSON que el usuario
guarda y puede restaurar). No es necesario para las primeras fases, pero el modelo de datos ya
está pensado para serializarse sin problema.

## Compatibilidad de escaneo

`BarcodeDetector` es nativo en navegadores basados en Chromium (Android/Chrome). En Safari/iOS puede
no estar disponible. La capa de escaneo debe:
1. Detectar si `window.BarcodeDetector` existe y usarlo si es así.
2. Si no, cargar el respaldo `@zxing/browser`.
3. Si ninguno funciona o se niega el permiso de cámara, ofrecer entrada manual sin fricción.

Esta lógica se aísla detrás de una interfaz única (ej. un hook `useScanner`) para que el resto de
la app no sepa cuál motor está activo.
