/**
 * Redondeo controlado a 2 decimales. Todo número mostrado al usuario pasa por
 * aquí; nunca se expone un float crudo (CLAUDE.md §5).
 */
export function roundMoney(amount: number): number {
  return Math.round((amount + Number.EPSILON) * 100) / 100
}

const penFormatter = new Intl.NumberFormat('es-PE', {
  style: 'currency',
  currency: 'PEN',
})

/** Formato de moneda peruana, ej. `S/ 12.50`. Centralizado: nunca formatear inline. */
export function formatPEN(amount: number): string {
  return penFormatter.format(roundMoney(amount))
}
