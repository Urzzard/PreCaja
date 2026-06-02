# ROADMAP.md — Fases de desarrollo

Construcción **incremental**. Cada fase deja la app en estado ejecutable y probable antes de
pasar a la siguiente. No saltar fases. La meta es una base sólida, no velocidad.

Al final de cada fase: `npm run dev` debe funcionar, y se hace un commit con el resumen de la fase.

---

## Fase 0 — Cimientos del proyecto

**Objetivo:** un proyecto Vite + React + TypeScript que arranca, con Tailwind y la estructura de carpetas.

- Inicializar proyecto con Vite (plantilla React + TypeScript).
- Instalar y configurar Tailwind CSS (móvil primero).
- Crear la estructura de carpetas de `CLAUDE.md` sección 4.
- Configurar TypeScript en modo estricto.
- Pantalla mínima "Hola PreCaja" para verificar que todo corre.

**Entregable:** la app corre en el navegador y muestra una pantalla base.

---

## Fase 1 — Capa de datos

**Objetivo:** la base de datos local funciona, aislada de la UI.

- Instalar Dexie.js.
- Definir los tipos TypeScript de `products`, `boxes`, `items` en `types/`.
- Crear la instancia de Dexie y el esquema versión 1 en `db/` (ver `ARCHITECTURE.md`).
- Escribir las funciones de acceso a datos (crear/leer/actualizar) por tabla, tipadas.
- Centralizar utilidades: `formatPEN` para moneda y helpers de fecha en `utils/`.

**Entregable:** se puede crear/leer/actualizar productos, cajas e items por código (sin UI todavía,
verificable desde la consola del navegador o pruebas simples).

---

## Fase 2 — Caja con entrada manual y total en vivo

**Objetivo:** el flujo central funciona **sin escaneo** todavía. Esta es la base usable más simple.

- Pantalla de caja activa (ver `UI.md`): cabecera con nombre y conteo, lista de items, total fijo abajo.
- Crear una caja nueva y marcarla como abierta.
- Agregar producto manualmente: nombre, precio, cantidad → crea item y, si es nuevo, producto.
- El total aproximado se recalcula y muestra en vivo al agregar/editar/quitar items.
- Editar cantidad y eliminar items de la caja.
- Si un producto ya existe (por nombre o código), autocompletar su último precio.

**Entregable:** se puede llenar un carrito a mano y ver el total crecer. Producto conocido autocompleta.

---

## Fase 3 — Escaneo de código de barras

**Objetivo:** acelerar el registro con la cámara, sin romper la entrada manual.

- Crear el hook `useScanner` que abstrae el motor de escaneo (ver `ARCHITECTURE.md`).
- Usar `BarcodeDetector` nativo si existe; respaldo `@zxing/browser` si no.
- Integrar la vista de cámara en la pantalla de caja (zona superior, siempre lista).
- Al escanear: si el código existe en `products`, autocompletar nombre y último precio;
  si no, abrir el registro rápido (nombre + precio una vez).
- Manejar permiso de cámara denegado y navegador sin soporte: degradar a entrada manual con mensaje claro.

**Entregable:** escanear un producto conocido lo agrega casi al instante; uno nuevo se registra una vez.

---

## Fase 4 — PWA instalable y offline

**Objetivo:** la app se instala en el celular y funciona sin red.

- Integrar `vite-plugin-pwa`: manifest, íconos, service worker.
- Verificar que la app abre offline y que los datos persisten entre sesiones.
- Verificar que se puede "instalar en pantalla de inicio" en Android y iOS.

**Entregable:** PreCaja instalable, abre como app y funciona sin conexión.

---

## Fase 5 — Cierre de caja: aproximado vs. real

**Objetivo:** completar el círculo de la idea estrella.

- Pantalla de cierre de caja (ver `UI.md`): muestra aproximado y permite ingresar total real.
- Calcular y mostrar la diferencia (monto y porcentaje) con un mensaje de causa típica.
- Tomar/adjuntar foto de la boleta (comprimida antes de guardar).
- Al cerrar, marcar la caja como `closed` y guardarla en el historial.

**Entregable:** se cierra una caja, se contrasta con la boleta y queda archivada.

---

## Fase 6 — Historial y "volver a comprar"

**Objetivo:** sacar valor de los datos acumulados.

- Pantalla de historial: lista de cajas cerradas con fecha, total real y diferencia.
- Ver el detalle de una caja pasada.
- "Volver a comprar": crear una caja nueva a partir de los productos de una caja anterior (como lista).
- Historial de precios de un producto: mostrar la evolución de su precio en el tiempo.

**Entregable:** el usuario revisa compras pasadas y reutiliza una como lista de compras.

---

## Fase 7 — Pulido y fotos de producto

**Objetivo:** refinar la experiencia.

- Foto opcional por producto, para reconocerlo de un vistazo en listas e historial.
- Compresión de imágenes afinada; opción de borrar fotos antiguas para ahorrar espacio.
- Estados vacíos, mensajes de error amables, micro-detalles de rapidez (foco automático, etc.).
- Revisión de accesibilidad y tamaño de los objetivos táctiles.

**Entregable:** la app se siente rápida, clara y terminada para uso diario.

---

## Fases posteriores (fuera del alcance inicial, anotadas para no olvidar)

- **Respaldo:** exportar/importar todos los datos como archivo JSON.
- **Empaquetado a tiendas:** TWA/Bubblewrap para Google Play, Capacitor para App Store.
- **Sincronización en la nube** (solo si alguna vez se quiere multi-dispositivo): requeriría backend
  y cuentas; es un cambio de alcance grande y se evaluaría aparte.
