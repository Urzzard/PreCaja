import { useLiveQuery } from 'dexie-react-hooks'
import { getPriceHistory } from '../db'
import type { Item } from '../types'

/**
 * Historial de precios de un producto: sus items a lo largo de las cajas,
 * ordenados del más antiguo al más reciente. Reactivo.
 */
export function usePriceHistory(productCode: string): Item[] {
  return useLiveQuery(() => getPriceHistory(productCode), [productCode]) ?? []
}
