/**
 * Un item: cada línea de un carrito. Tabla puente entre cajas y productos.
 * Ver docs/ARCHITECTURE.md.
 */
export interface Item {
  /** Clave primaria generada. */
  id: string
  /** FK → Box.id. Indexado. */
  boxId: string
  /** FK → Product.code. Indexado. */
  productCode: string
  /** Copia del nombre al registrar, para que el historial no cambie al renombrar el producto. */
  name: string
  /** Precio unitario registrado en esta compra. */
  price: number
  /** Cantidad. */
  quantity: number
  /** price * quantity. Se recalcula; no se confía en el valor guardado. */
  subtotal: number
  /** Timestamp (epoch ms). */
  createdAt: number
}
