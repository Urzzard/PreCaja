# PreCaja

App web instalable (PWA) para sumar un total aproximado en vivo mientras haces compras,
y así evitar sorpresas en la caja. Funciona offline y guarda todo en el propio teléfono.

## Estado

En fase de arranque de desarrollo. La planificación está completa en `docs/`.

## Documentación

Leer en este orden:

1. **`CLAUDE.md`** — Contexto permanente del proyecto (lo lee Claude Code al iniciar). Stack, reglas, estructura.
2. **`docs/PROJECT.md`** — Visión del producto y recorrido del usuario.
3. **`docs/ARCHITECTURE.md`** — Modelo de datos, esquema de Dexie y decisiones técnicas.
4. **`docs/ROADMAP.md`** — Fases de desarrollo en orden de ejecución.
5. **`docs/UI.md`** — Especificación de las pantallas principales.

## Stack

Vite · React + TypeScript · Tailwind CSS · Dexie.js (IndexedDB) · vite-plugin-pwa ·
BarcodeDetector con respaldo @zxing/browser.

El código se escribe en inglés; la documentación está en español.

## Flujo de trabajo (planificación ↔ desarrollo)

- La **planificación y revisión** se hace conversando (fase de diseño y arquitectura).
- El **desarrollo** lo ejecuta Claude Code leyendo estos documentos y siguiendo el `ROADMAP.md` fase por fase.
- El **puente entre ambos lados es este repositorio (GitHub)**: Claude Code hace commits y push;
  para una revisión externa se comparte el enlace al archivo o commit de GitHub.

## Cómo empezar (cuando arranque el código)

```bash
pnpm install
pnpm dev
```

Claude Code debe seguir `docs/ROADMAP.md` empezando por la Fase 0.
