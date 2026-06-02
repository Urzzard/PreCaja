import { useLiveQuery } from 'dexie-react-hooks'
import { getItemsByBox } from '../db'
import type { Item } from '../types'

/** Items de una caja, reactivos. Devuelve `[]` mientras carga o si no hay. */
export function useBoxItems(boxId: string): Item[] {
  return useLiveQuery(() => getItemsByBox(boxId), [boxId]) ?? []
}
