import { useLiveQuery } from 'dexie-react-hooks'
import { listClosedBoxes } from '../db'
import type { Box } from '../types'

/** Cajas cerradas (el historial), reactivas. `[]` mientras carga o si no hay. */
export function useClosedBoxes(): Box[] {
  return useLiveQuery(() => listClosedBoxes(), []) ?? []
}
