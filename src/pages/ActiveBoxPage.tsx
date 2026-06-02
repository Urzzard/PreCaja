import { useActiveBox } from '../hooks/useActiveBox'
import { NewBoxScreen } from '../features/boxes/NewBoxScreen'
import { ActiveBoxScreen } from '../features/cart/ActiveBoxScreen'

/**
 * Decide qué mostrar: si hay una caja abierta, la pantalla activa;
 * si no, la pantalla para crear una caja nueva.
 */
export function ActiveBoxPage() {
  const box = useActiveBox()
  if (!box) return <NewBoxScreen />
  return <ActiveBoxScreen box={box} />
}
