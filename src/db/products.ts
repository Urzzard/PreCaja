import { db } from './db'
import type { Product } from '../types'

/** Busca un producto por su código de barras (acceso directo por clave primaria). */
export function getProduct(code: string): Promise<Product | undefined> {
  return db.products.get(code)
}

/** Lista todos los productos, del más recientemente usado al más antiguo. */
export function listProducts(): Promise<Product[]> {
  return db.products.orderBy('updatedAt').reverse().toArray()
}

/**
 * Registra el paso de un producto a un precio dado. Crea el producto si es nuevo;
 * si ya existe, actualiza su nombre, último precio y `updatedAt`. Esta es la
 * operación principal al registrar un item (genera el historial de precios).
 */
export async function saveProductPrice(
  code: string,
  name: string,
  price: number,
): Promise<Product> {
  const now = Date.now()
  const existing = await db.products.get(code)
  const product: Product = existing
    ? { ...existing, name, lastPrice: price, updatedAt: now }
    : { code, name, lastPrice: price, createdAt: now, updatedAt: now }
  await db.products.put(product)
  return product
}

/** Actualiza campos arbitrarios de un producto (ej. renombrar, foto). Refresca `updatedAt`. */
export async function updateProduct(
  code: string,
  changes: Partial<Omit<Product, 'code' | 'createdAt'>>,
): Promise<void> {
  await db.products.update(code, { ...changes, updatedAt: Date.now() })
}

/** Elimina un producto del catálogo. No toca los items históricos que lo referencian. */
export function deleteProduct(code: string): Promise<void> {
  return db.products.delete(code)
}
