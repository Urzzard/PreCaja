# VISION.md — Visión de escalado a largo plazo

> Este documento **no es un plan comprometido** ni parte del `ROADMAP.md` actual.
> Es un registro de hacia dónde *podría* crecer PreCaja, para no perder las ideas y
> para que, si algún día se decide escalar, se parta de un pensamiento ya hecho.
> El producto actual funciona y tiene valor completo **sin nada de esto**.

---

## 1. La tesis central

El valor de un proyecto como PreCaja **no está en el código** (escáner, base local, PWA son
relativamente fáciles de replicar). Está en la **densidad de datos frescos, locales y confiables**:
muchos usuarios registrando precios por establecimiento, de forma frecuente.

Eso genera **efectos de red**: más usuarios → mejores datos → más útil → más usuarios. Ese ciclo
es el verdadero foso defensivo, y es difícil de copiar. Todo lo demás se construye sobre esa base.

---

## 2. Direcciones de escalado (ideas)

Ordenadas de menor a mayor ambición. Todas son **aditivas y opcionales**: la app sigue
funcionando 100% local para quien no quiera participar.

### 2.1. Sincronización opt-in de catálogo y precios
Que un usuario pueda respaldar y sincronizar su catálogo (`código → nombre → precios`) entre
dispositivos, y opcionalmente **aportar** sus puntos de precio a un agregado común.

### 2.2. Comparación de precios por establecimiento
Con datos de varias tiendas, ayudar al comprador a **elegir dónde comprar más barato** (o según
su criterio: cercanía, conveniencia). Requiere modelar el **establecimiento/sucursal** como entidad.

### 2.3. Históricos y alertas de ofertas
Aprovechar el historial de precios (que ya se acumula localmente) para detectar **bajadas reales**
y avisar cuando algo está en oferta respecto de su precio habitual.

### 2.4. Agregación y datos generales
Vistas agregadas: evolución de precios de un producto en una zona, canasta básica, tendencias.
Potencial bien público (transparencia de precios, pro-consumidor).

---

## 3. Los desafíos reales (no son técnicos)

- **Arranque en frío (cold start).** La comparación entre tiendas no sirve hasta que hay datos de
  muchas tiendas; y nadie aporta si todavía no sirve. Romper ese huevo-gallina es el desafío #1.
  Estrategia típica: arrancar **hiper-local** (una ciudad, pocas cadenas) y densificar antes de expandir.
- **Los datos se pudren.** Un precio es verdad *hoy y en esa sucursal*. Mostrar precios viejos puede
  **engañar**. Hace falta frescura, fecha visible y manejo explícito de caducidad.
- **Normalización — aquí pesan las excepciones de los códigos de barras.** Para comparar "el mismo
  producto entre tiendas" el código debe identificar lo mismo. Pero:
  - Los **códigos internos de tienda** (granel, peso variable; prefijos `2`/`02`) **no son comparables**.
  - Un mismo GTIN puede venir en **presentaciones distintas**.
  - Productos locales/artesanales pueden no estar registrados en GS1.
  La calidad del agregado depende de resolver esto bien.
- **El salto local → backend es un cambio de proyecto, no una fase más.** Hoy PreCaja es "privado por
  defecto, sin servidor". Sincronizar trae cuentas, backend, costos y **responsabilidad sobre datos de
  usuarios**. Es un umbral grande; se evalúa aparte.

---

## 4. Consideraciones legales y éticas (requisitos, no detalles)

> No es asesoría legal. Antes de escalar o monetizar, revisar con un profesional.

- **Los precios exhibidos en una tienda son públicos**, no secretos: se muestran a todos los que
  entran. Y el usuario registra **sus propias compras** (su boleta, su dinero). Eso es distinto de
  espiar información confidencial. Encuadre correcto: el usuario **no es un recolector en
  establecimiento ajeno**, es alguien anotando lo que él pagó; el agregado se vuelve transparencia
  de precios pro-consumidor (como apps de precios de combustible, o Open Food Facts).
- **Matices a cuidar:**
  - Algunas tiendas prohíben **fotografiar góndolas** (política interna). La **boleta sí es del usuario**.
  - Los "hechos" sueltos (este producto costó X aquí hoy) en general **no son propiedad intelectual**;
    pero recopilar y **republicar masivamente** puede rozar derechos sobre bases de datos y, si hay
    monetización, temas de competencia/consumidor (en Perú, **INDECOPI**).
- **El gran cambio es la privacidad.** Hoy no hay obligaciones porque los datos no salen del teléfono.
  Al sincronizar, PreCaja pasa a ser **responsable de datos personales**:
  - En Perú aplica la **Ley N.° 29733 (Protección de Datos Personales)**; GDPR si hay usuarios europeos.
  - Requiere **Términos y Condiciones, consentimiento informado, minimización de datos y derecho a borrado**.
  - Diseño recomendado: sync **opt-in**, **anonimizar** los puntos de precio, separar lo identificable.
- **Principios éticos:**
  - **Transparencia:** que el usuario sepa exactamente qué se comparte y **se beneficie** del agregado.
  - **Honestidad:** nunca mostrar precios caducos como vigentes.
  - **Reciprocidad:** quien aporta datos, recibe valor a cambio.

---

## 5. Por qué la base actual ya está bien parada

Nada de esta visión choca con lo construido; al contrario, lo deja listo para crecer:

- El modelo de datos ya guarda **precio + fecha por producto y por caja** — exactamente el insumo
  que una agregación necesita. Buena previsión.
- La sincronización sería **aditiva y opcional**: la app sigue funcionando local; quien quiera, comparte.
- Mantener el núcleo **offline-first** es un **diferencial de privacidad** frente a competidores.

El único modelado nuevo importante para escalar: la entidad **establecimiento/sucursal**, para poder
atar cada punto de precio a un lugar.

---

## 6. Posibles opciones complementarias

- **Autocompletado de nombre vía Open Food Facts** *(posible opción, secundaria)*: en el primer
  escaneo de un código nuevo y **con internet**, sugerir el nombre para ahorrar tipeo; sin señal o
  sin coincidencia, caer a entrada manual. El **precio siempre lo pone el usuario**. Respeta el
  offline-first como degradación elegante. Es un "lindo de tener", no un eje del producto: la base
  propia alimentada por los usuarios sigue siendo la fuente de verdad.

---

## 7. Cierre

PreCaja puede empezar humilde (lo que es hoy) y seguir siendo útil tal cual. Pero si alguna vez se
quiere escalar, el camino pasa por **datos densos, frescos y bien normalizados**, una capa de sync
**opt-in y respetuosa de la privacidad**, y un marco **legal/ético** tratado como requisito desde el
día uno — no como un parche posterior.
