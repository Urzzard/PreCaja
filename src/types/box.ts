/** Estado de una caja: abierta es la compra en curso; cerrada está archivada. */
export type BoxStatus = 'open' | 'closed'

/**
 * Una caja: cada sesión de compra (una visita al supermercado).
 * Ver docs/ARCHITECTURE.md.
 */
export interface Box {
  /** Clave primaria generada (crypto.randomUUID()). */
  id: string
  /** Nombre dado por el usuario (ej. "Súper sábado"). */
  name: string
  /** Fecha/hora de creación (epoch ms). */
  createdAt: number
  /** Estado de la caja. */
  status: BoxStatus
  /** Total aproximado: suma de los subtotales de sus items. Se recalcula. */
  approxTotal: number
  /** Total real de la boleta, ingresado al cerrar la caja. */
  realTotal?: number
  /** Foto de la boleta (comprimida), opcional. */
  receiptPhoto?: Blob
}
