import { db } from './db'
import type { Item } from '../types'
import { roundMoney } from '../utils/currency'

/** Datos necesarios para agregar un item; los derivados (id, subtotal, fecha) se calculan aquí. */
export interface NewItem {
  boxId: string
  productCode: string
  name: string
  price: number
  quantity: number
}

/**
 * Recalcula el total aproximado de una caja sumando los subtotales de sus items
 * y lo guarda. El total nunca se confía al valor previo: se deriva de los items.
 * Pensado para ejecutarse dentro de una transacción de escritura.
 */
export async function recalcApproxTotal(boxId: string): Promise<number> {
  const items = await db.items.where('boxId').equals(boxId).toArray()
  const total = roundMoney(
    items.reduce((sum, item) => sum + item.price * item.quantity, 0),
  )
  await db.boxes.update(boxId, { approxTotal: total })
  return total
}

/** Agrega un item a una caja y recalcula su total aproximado, de forma atómica. */
export async function addItem(input: NewItem): Promise<Item> {
  const item: Item = {
    id: crypto.randomUUID(),
    boxId: input.boxId,
    productCode: input.productCode,
    name: input.name,
    price: input.price,
    quantity: input.quantity,
    subtotal: roundMoney(input.price * input.quantity),
    createdAt: Date.now(),
  }
  await db.transaction('rw', db.items, db.boxes, async () => {
    await db.items.add(item)
    await recalcApproxTotal(input.boxId)
  })
  return item
}

/** Items de una caja, en orden de registro. */
export function getItemsByBox(boxId: string): Promise<Item[]> {
  return db.items.where('boxId').equals(boxId).sortBy('createdAt')
}

/** Historial de precios de un producto: sus items a lo largo del tiempo, ordenados por fecha. */
export function getPriceHistory(productCode: string): Promise<Item[]> {
  return db.items.where('productCode').equals(productCode).sortBy('createdAt')
}

/** Cambia la cantidad de un item, recalcula su subtotal y el total de la caja. */
export async function updateItemQuantity(
  id: string,
  quantity: number,
): Promise<void> {
  await db.transaction('rw', db.items, db.boxes, async () => {
    const item = await db.items.get(id)
    if (!item) return
    await db.items.update(id, {
      quantity,
      subtotal: roundMoney(item.price * quantity),
    })
    await recalcApproxTotal(item.boxId)
  })
}

/** Elimina un item de una caja y recalcula su total aproximado. */
export async function deleteItem(id: string): Promise<void> {
  await db.transaction('rw', db.items, db.boxes, async () => {
    const item = await db.items.get(id)
    if (!item) return
    await db.items.delete(id)
    await recalcApproxTotal(item.boxId)
  })
}
