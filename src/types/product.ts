/**
 * Un producto del catálogo personal del usuario.
 * Una fila por código de barras conocido. Ver docs/ARCHITECTURE.md.
 */
export interface Product {
  /** Clave primaria: el código de barras, o un id generado si es manual sin código. */
  code: string
  /** Nombre del producto. */
  name: string
  /** Último precio registrado, usado para autocompletar la próxima vez. */
  lastPrice: number
  /** Foto opcional del producto (comprimida). */
  photo?: Blob
  /** Timestamp de creación (epoch ms). */
  createdAt: number
  /** Timestamp de última actualización (epoch ms). */
  updatedAt: number
}
