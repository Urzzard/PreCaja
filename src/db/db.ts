import Dexie, { type EntityTable } from 'dexie'
import type { Product, Box, Item } from '../types'

/**
 * Base de datos local de PreCaja sobre IndexedDB (vía Dexie).
 * Cliente puro: sin backend ni red. Ver docs/ARCHITECTURE.md.
 *
 * En el string del esquema solo se listan los campos indexados
 * (clave primaria + aquellos por los que se consulta u ordena),
 * no todos los campos del objeto.
 */
export class PreCajaDB extends Dexie {
  products!: EntityTable<Product, 'code'>
  boxes!: EntityTable<Box, 'id'>
  items!: EntityTable<Item, 'id'>

  constructor() {
    super('precaja')
    this.version(1).stores({
      products: 'code, name, updatedAt',
      boxes: 'id, status, createdAt',
      items: 'id, boxId, productCode, createdAt',
    })
  }
}

/** Instancia única compartida por toda la app. */
export const db = new PreCajaDB()
