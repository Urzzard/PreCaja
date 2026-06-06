import { useState } from 'react'
import { useActiveBox } from '../hooks/useActiveBox'
import { NewBoxScreen } from '../features/boxes/NewBoxScreen'
import { ActiveBoxScreen } from '../features/cart/ActiveBoxScreen'
import { CloseBoxScreen } from '../features/checkout/CloseBoxScreen'

/**
 * Decide qué mostrar: si no hay caja abierta, la pantalla para crear una;
 * si la hay, la caja activa o, al cerrarla, la pantalla de contraste.
 * Al archivar la caja, deja de estar abierta y volvemos a la vista inicial.
 */
export function ActiveBoxPage({ onShowHistory }: { onShowHistory: () => void }) {
  const box = useActiveBox()
  const [view, setView] = useState<'cart' | 'close'>('cart')

  if (!box) return <NewBoxScreen onShowHistory={onShowHistory} />

  if (view === 'close') {
    return (
      <CloseBoxScreen
        box={box}
        onBack={() => setView('cart')}
        onClosed={() => setView('cart')}
      />
    )
  }

  return <ActiveBoxScreen box={box} onClose={() => setView('close')} />
}
