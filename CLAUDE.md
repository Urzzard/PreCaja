# CLAUDE.md

> Este archivo es leído automáticamente por Claude Code al iniciar en este repositorio.
> Contiene el contexto permanente del proyecto: qué construimos, con qué, y bajo qué reglas.
> El código se escribe en **inglés**. La documentación está en **español**.

---

## 1. Qué es este proyecto

**PreCaja** es una aplicación web instalable (PWA) para uso personal en el celular durante las compras.
El usuario escanea o registra productos mientras llena el carrito físico, y la app va sumando un
**total aproximado en vivo**, para evitar la sorpresa al pagar en caja y poder descartar gastos
innecesarios antes de llegar.

Funciona **completamente offline** y **sin servidor**. Todos los datos viven en el teléfono del usuario.

Las cuatro capacidades centrales:
1. **Registro rápido de productos** mediante escaneo de código de barras (o entrada manual).
2. **Base de datos local propia**: la primera vez se registra `código → nombre → precio`; las siguientes,
   el producto aparece con su nombre y último precio para confirmar o corregir. Esto genera un historial de precios.
3. **Cajas** (sesiones de compra): cada visita es una caja con su propio total aproximado, fecha y productos.
4. **Contraste aproximado vs. real**: al cerrar la caja, el usuario fotografía la boleta y registra el total real;
   la app muestra la diferencia. Las cajas guardadas forman un historial reutilizable como lista de compras.

---

## 2. Stack tecnológico (decidido, no reabrir sin justificación)

| Capa | Tecnología | Notas |
|------|-----------|-------|
| Build | **Vite** | Rápido, ligero, ideal para PWA |
| UI | **React** + **TypeScript** | Componentes funcionales con Hooks |
| PWA | **vite-plugin-pwa** | Genera service worker y manifest |
| Estilos | **Tailwind CSS** | Utility-first, móvil primero |
| Base de datos | **Dexie.js** sobre **IndexedDB** | Persistencia local en el dispositivo |
| Escaneo | **BarcodeDetector API** (nativa) | Con respaldo **@zxing/browser** para Safari/iOS |

**No usar:** Next.js u otros frameworks con servidor (el proyecto no tiene backend),
ni librerías de estado pesadas (Redux, etc.) en fases tempranas. El estado de React basta.

### Empaquetado futuro (no ahora)
La misma base PWA se empaquetará después para tiendas: **TWA/Bubblewrap** para Google Play
y **Capacitor** para App Store. No introducir dependencias nativas hasta llegar a esa fase.

---

## 3. Principios de diseño y producto

- **La rapidez del registro es la prioridad número uno.** Cada decisión de UI se evalúa por
  cuántos toques/segundos cuesta agregar un producto. La meta es ~3 segundos por producto.
- **Móvil primero, una mano.** Botones grandes, zona de acción en la parte inferior (alcanzable con el pulgar).
- **Offline siempre.** Ninguna función central puede depender de la red.
- **Privado por defecto.** Los datos no salen del dispositivo. No hay analítica ni telemetría.
- **Degradación elegante.** Si el escaneo falla o el navegador no soporta `BarcodeDetector`,
  la entrada manual debe estar siempre disponible como alternativa.

---

## 4. Estructura de carpetas (objetivo)

```
src/
  components/      Componentes de UI reutilizables (botones, tarjetas, listas)
  features/        Lógica por funcionalidad (scanner, cart, boxes, history)
  db/              Configuración de Dexie, esquema y consultas
  hooks/           Custom hooks de React
  pages/           Pantallas principales (vistas de ruta)
  utils/           Funciones puras de apoyo (formato de moneda, fechas, etc.)
  types/           Tipos e interfaces de TypeScript compartidos
  App.tsx
  main.tsx
docs/              Documentación del proyecto (en español)
public/            Manifest, íconos, recursos estáticos
```

---

## 5. Convenciones de código

- **Idioma del código:** inglés. Nombres de variables, funciones, comentarios y commits en inglés.
- **Idioma de la interfaz visible al usuario:** español (textos de pantalla, etiquetas, mensajes).
- **TypeScript estricto:** sin `any` salvo justificación. Tipar el esquema de la base de datos.
- **Componentes:** funcionales, un componente por archivo, nombrados en `PascalCase`.
- **Funciones de moneda:** centralizar el formato (ej. `formatPEN`) en `utils/`. Nunca formatear inline.
- **Redondeo:** todo número mostrado al usuario pasa por redondeo controlado; nunca exponer floats crudos.
- **Commits:** estilo Conventional Commits en inglés (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`).
- **Sin claves ni secretos en el repo.** El proyecto no los necesita en esta etapa.

---

## 6. Cómo trabajar en este repo

- **Sigue el `docs/ROADMAP.md` en orden.** No saltes fases. Cada fase deja una base funcional y probable.
- Antes de empezar una fase, lee `docs/ARCHITECTURE.md` (modelo de datos) y `docs/UI.md` (pantallas).
- Al terminar una unidad de trabajo, deja el proyecto en estado ejecutable (`npm run dev` debe funcionar)
  y haz un commit atómico con mensaje descriptivo.
- Si una decisión no está cubierta por estos documentos, elige la opción más simple que respete
  los principios de la sección 3, y déjala anotada en el commit o en un comentario.
- No agregues dependencias fuera del stack de la sección 2 sin que aporten valor claro a la fase actual.

---

## 7. Referencias cruzadas

- `docs/PROJECT.md` — visión completa del producto y recorrido del usuario.
- `docs/ARCHITECTURE.md` — modelo de datos, esquema de Dexie y decisiones técnicas.
- `docs/ROADMAP.md` — fases de desarrollo en orden de ejecución.
- `docs/UI.md` — especificación de las pantallas principales.
