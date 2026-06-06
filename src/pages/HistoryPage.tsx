import { useState } from 'react'
import type { Box } from '../types'
import { rebuyFromBox } from '../db'
import { HistoryListScreen } from '../features/history/HistoryListScreen'
import { PastBoxScreen } from '../features/history/PastBoxScreen'
import { PriceHistoryScreen } from '../features/history/PriceHistoryScreen'

/**
 * Sección de historial: lista de cajas cerradas → detalle de una caja →
 * historial de precios de un producto. Navega entre las tres con estado local;
 * "volver a comprar" crea una caja abierta nueva y sale al inicio, donde la app
 * la muestra como caja activa.
 */
export function HistoryPage({ onExit }: { onExit: () => void }) {
  const [selectedBox, setSelectedBox] = useState<Box | null>(null)
  const [priceProduct, setPriceProduct] = useState<{
    code: string
    name: string
  } | null>(null)
  const [rebuying, setRebuying] = useState(false)

  async function handleRebuy(box: Box) {
    if (rebuying) return
    setRebuying(true)
    await rebuyFromBox(box.id, box.name)
    onExit() // la caja nueva queda abierta; el inicio la muestra como activa
  }

  // Historial de precios de un producto (sobre el detalle de la caja).
  if (priceProduct) {
    return (
      <PriceHistoryScreen
        productCode={priceProduct.code}
        productName={priceProduct.name}
        onBack={() => setPriceProduct(null)}
      />
    )
  }

  // Detalle de una caja pasada.
  if (selectedBox) {
    return (
      <PastBoxScreen
        box={selectedBox}
        onBack={() => setSelectedBox(null)}
        onSelectProduct={(code, name) => setPriceProduct({ code, name })}
        onRebuy={() => handleRebuy(selectedBox)}
        rebuying={rebuying}
      />
    )
  }

  // Lista del historial.
  return <HistoryListScreen onBack={onExit} onSelect={setSelectedBox} />
}
