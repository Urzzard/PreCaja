import { useLiveQuery } from 'dexie-react-hooks'
import { getOpenBox } from '../db'
import type { Box } from '../types'

/**
 * La caja abierta actual, reactiva: se re-renderiza sola cuando cambia
 * (ej. al recalcularse el total aproximado). `undefined` = no hay caja abierta
 * (o aún cargando, lo cual es instantáneo al ser local).
 */
export function useActiveBox(): Box | undefined {
  return useLiveQuery(() => getOpenBox(), [])
}
