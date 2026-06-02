import { db } from './db'
import type { Box } from '../types'

/** Crea una caja nueva, abierta, con total en cero. */
export async function createBox(name: string): Promise<Box> {
  const now = Date.now()
  const box: Box = {
    id: crypto.randomUUID(),
    name,
    createdAt: now,
    status: 'open',
    approxTotal: 0,
  }
  await db.boxes.add(box)
  return box
}

/** Obtiene una caja por id. */
export function getBox(id: string): Promise<Box | undefined> {
  return db.boxes.get(id)
}

/** La caja abierta actual (la compra en curso), si existe. */
export function getOpenBox(): Promise<Box | undefined> {
  return db.boxes.where('status').equals('open').first()
}

/** Lista todas las cajas, de la más reciente a la más antigua. */
export function listBoxes(): Promise<Box[]> {
  return db.boxes.orderBy('createdAt').reverse().toArray()
}

/** Actualiza campos arbitrarios de una caja (nombre, estado, totales, foto). */
export async function updateBox(
  id: string,
  changes: Partial<Omit<Box, 'id' | 'createdAt'>>,
): Promise<void> {
  await db.boxes.update(id, changes)
}

/** Elimina una caja y todos sus items, de forma atómica. */
export async function deleteBox(id: string): Promise<void> {
  await db.transaction('rw', db.boxes, db.items, async () => {
    await db.items.where('boxId').equals(id).delete()
    await db.boxes.delete(id)
  })
}
