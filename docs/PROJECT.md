# PROJECT.md — Visión del producto

## El problema

Al hacer compras en el supermercado, uno va llenando el carrito sin saber el total real hasta
llegar a la caja. Eso produce dos problemas: la sorpresa del monto final, y la dificultad de
decidir sobre la marcha qué gastos son innecesarios mientras todavía se puede devolver algo a la góndola.

## La solución

**PreCaja** es una "pre-caja" personal: una app que el usuario lleva en el celular y que va sumando
el costo aproximado de lo que mete al carrito, en tiempo real. Así llega a la caja sabiendo
más o menos cuánto pagará, y puede recortar antes de pagar.

No reemplaza a la caja del supermercado ni pretende ser exacta al centavo: su valor es el
**aproximado en vivo** y el aprendizaje que acumula con el uso.

## Por qué un aproximado es suficiente (y por qué es el punto)

El código de barras identifica el producto pero **no contiene el precio** (este depende de cada
tienda y promoción). Por eso la app no busca precios en una base externa: **construye la propia**.
La primera vez que se registra un producto, el usuario teclea su precio; ese precio queda asociado
al código de barras. La próxima vez, el producto aparece con su nombre y el último precio pagado,
y el usuario solo confirma o corrige. Con el uso, el registro se vuelve casi instantáneo y el
aproximado cada vez más certero.

## Las cuatro capacidades centrales

### 1. Registro rápido
Escaneo de código de barras con la cámara del celular. Si el producto ya es conocido, aparece
con nombre y precio anterior; si es nuevo, se piden nombre y precio una sola vez. Siempre existe
entrada manual como alternativa.

### 2. Historial de precios
Cada vez que un producto se registra en una caja, queda un punto de precio con su fecha. La unión
de esos puntos a lo largo del tiempo es el historial de precios de ese producto, útil para notar
si algo subió o bajó.

### 3. Cajas (sesiones de compra)
Cada visita de compra es una "caja" con nombre (ej. "Súper sábado", "Farmacia"), fecha, lista de
productos y total aproximado. Las cajas se guardan y forman el historial de compras.

### 4. Aproximado vs. real
Al cerrar una caja, el usuario fotografía la boleta y registra el total real. La app muestra la
diferencia (monto y porcentaje) y sugiere causas típicas (impuestos, redondeo, cambio de precio).
Con el tiempo el usuario conoce su margen de error habitual.

Como subproducto, una caja pasada puede reutilizarse como **lista de compras** ("Volver a comprar").

## Recorrido del usuario (flujo principal)

1. Abre la app (instalada en la pantalla de inicio como PWA).
2. Crea o abre una caja para la compra actual.
3. La cámara está lista de inmediato. Escanea el primer producto.
   - Conocido → aparece nombre y precio anterior → confirma cantidad → se suma al total.
   - Nuevo → teclea nombre y precio una vez → se suma al total y queda guardado para el futuro.
4. Repite por cada producto. El total aproximado, fijo en pantalla, crece en vivo.
5. Si el total se acerca a su límite mental, revisa la lista y quita lo prescindible.
6. En la caja del supermercado, paga. Toma foto de la boleta y registra el total real.
7. La app muestra la diferencia aproximado vs. real. La caja se guarda al historial.
8. En una compra futura, puede partir de una caja anterior como lista de compras.

## Lo que NO es (alcance excluido por ahora)

- No es un comparador de precios entre tiendas.
- No consulta precios desde internet ni desde bases de datos externas.
- No tiene cuentas de usuario, login ni sincronización en la nube (posible fase muy posterior).
- No procesa pagos.
- No requiere conexión para sus funciones centrales.
