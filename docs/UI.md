# UI.md — Especificación de pantallas

Principios de interfaz: **móvil primero, una mano, rapidez de registro por encima de todo.**
La zona de acción va abajo (alcanzable con el pulgar). Botones grandes. Textos visibles en español.

---

## Pantalla 1 — Caja activa (la pantalla principal)

Es donde el usuario pasa el 90% del tiempo. Tres zonas verticales:

### Zona superior — Cámara de escaneo (siempre lista)
- Ocupa la parte alta. La cámara está activa de inmediato al entrar; no hay que pulsar "escanear".
- Un marco/guía visual indica dónde apuntar el código de barras.
- Texto de ayuda corto debajo del marco: "Apunta al código de barras".
- Si no hay soporte o permiso de cámara, esta zona muestra el acceso directo a entrada manual.

### Zona central — Lista de items del carrito
- Cabecera con el nombre de la caja (ej. "Súper sábado") y el conteo de items.
- Cada item en una fila: ícono/foto pequeña, nombre, detalle (cantidad y, si aplica, "antes S/X.XX"),
  y subtotal a la derecha.
- Un producto **conocido** muestra su precio anterior como referencia.
- Un producto **nuevo** se marca con una etiqueta "nuevo" y, si falta el precio, muestra "S/—"
  hasta que el usuario lo confirme.
- Tocar una fila permite editar cantidad o eliminar el item.

### Zona inferior — Total y acción (fija, siempre visible)
- Etiqueta "Total aproximado" y el monto grande, que **crece en vivo** al agregar items.
- Botón de acción principal "Agregar" (para entrada manual o confirmar el escaneo).
- Esta barra permanece fija aunque la lista se desplace.

**Comportamiento clave de rapidez:** escanear → si es conocido, aparece nombre + precio anterior →
confirmar cantidad → sumado. Si es nuevo, pedir nombre + precio una sola vez. Meta: ~3 segundos por producto.

---

## Pantalla 2 — Cierre de caja (aproximado vs. real)

Se llega al terminar la compra, para contrastar con la boleta. Estructura de arriba a abajo:

- Cabecera: "Cerrar caja · [nombre]" con fecha y número de items.
- Dos tarjetas lado a lado:
  - "Aproximado" con el total calculado por la app.
  - "Boleta real" con el total que el usuario ingresa.
- Bloque de diferencia destacado: muestra el monto (+/-) y el porcentaje, con un mensaje de causa
  típica (ej. "suele ser impuestos o redondeo"). Usar color de advertencia si hay diferencia notable.
- Botón "Tomar foto de la boleta" (la imagen se comprime antes de guardar).
- Acciones finales:
  - "Guardar al historial" → marca la caja como cerrada y la archiva.
  - "Volver a comprar" → usa esta caja como base para una lista futura.

---

## Notas transversales de UI

- **Moneda:** formato peruano (Soles, "S/"). Centralizar en `formatPEN`. Siempre redondear lo mostrado.
- **Estados vacíos:** una caja sin items debe invitar a escanear/agregar el primero, no mostrarse vacía y muda.
- **Errores amables:** permiso de cámara denegado, sin soporte de escaneo, etc., siempre con salida
  hacia la entrada manual.
- **Objetivos táctiles** grandes y separados; pensados para usar mientras se empuja un carrito.
- **Sin dependencia de red** para ninguna interacción de estas dos pantallas.

> Referencia: estos diseños provienen de los mockups acordados en la fase de planificación.
> Las pantallas de historial y de detalle de producto se especificarán al llegar a la Fase 6.
