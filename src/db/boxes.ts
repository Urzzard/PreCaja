import { db } from './db'
import type { Box } from '../types'
import { roundMoney } from '../utils/currency'

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

/** Lista las cajas cerradas (el historial), de la más reciente a la más antigua. */
export async function listClosedBoxes(): Promise<Box[]> {
  const boxes = await db.boxes.where('status').equals('closed').sortBy('createdAt')
  return boxes.reverse()
}

/** Actualiza campos arbitrarios de una caja (nombre, estado, totales, foto). */
export async function updateBox(
  id: string,
  changes: Partial<Omit<Box, 'id' | 'createdAt'>>,
): Promise<void> {
  await db.boxes.update(id, changes)
}

/**
 * "Volver a comprar": crea una caja nueva, abierta, copiando los items de una
 * caja pasada como lista de partida (mismo nombre, precio y cantidad). El usuario
 * va confirmando o corrigiendo precios mientras compra. Atómico.
 *
 * Solo se invoca cuando no hay otra caja abierta (el flujo de la app garantiza
 * una caja abierta a la vez), así que no comprueba ese estado aquí.
 */
export async function rebuyFromBox(sourceBoxId: string, name: string): Promise<Box> {
  const now = Date.now()
  const newBox: Box = {
    id: crypto.randomUUID(),
    name,
    createdAt: now,
    status: 'open',
    approxTotal: 0,
  }
  await db.transaction('rw', db.boxes, db.items, async () => {
    const sourceItems = await db.items
      .where('boxId')
      .equals(sourceBoxId)
      .sortBy('createdAt')
    await db.boxes.add(newBox)
    let total = 0
    for (const src of sourceItems) {
      const subtotal = roundMoney(src.price * src.quantity)
      total += subtotal
      await db.items.add({
        id: crypto.randomUUID(),
        boxId: newBox.id,
        productCode: src.productCode,
        name: src.name,
        price: src.price,
        quantity: src.quantity,
        subtotal,
        createdAt: Date.now(),
      })
    }
    newBox.approxTotal = roundMoney(total)
    await db.boxes.update(newBox.id, { approxTotal: newBox.approxTotal })
  })
  return newBox
}

/**
 * Cierra una caja: registra el total real (y la foto de boleta, si hay) y la
 * marca como `closed`, archivándola en el historial. El aproximado ya vive en
 * la caja, calculado a partir de sus items.
 */
export async function closeBox(
  id: string,
  data: { realTotal: number; receiptPhoto?: Blob },
): Promise<void> {
  await updateBox(id, {
    status: 'closed',
    realTotal: data.realTotal,
    receiptPhoto: data.receiptPhoto,
  })
}

/** Elimina una caja y todos sus items, de forma atómica. */
export async function deleteBox(id: string): Promise<void> {
  await db.transaction('rw', db.boxes, db.items, async () => {
    await db.items.where('boxId').equals(id).delete()
    await db.boxes.delete(id)
  })
}
