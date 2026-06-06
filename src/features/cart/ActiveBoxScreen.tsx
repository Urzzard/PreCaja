import { useState } from 'react'
import type { Box } from '../../types'
import { useBoxItems } from '../../hooks/useBoxItems'
import { useScanner } from '../../hooks/useScanner'
import { getProduct } from '../../db'
import { formatPEN } from '../../utils'
import { ItemRow } from './ItemRow'
import { AddItemPanel, type ScanSeed } from './AddItemPanel'
import { ScannerView } from '../scanner/ScannerView'

/**
 * Pantalla principal de PreCaja: la caja activa. Tres zonas verticales
 * (ver docs/UI.md): cámara de escaneo, lista de items y barra de total abajo.
 * El panel de agregar aparece sobre el total, así este se ve crecer en vivo.
 *
 * Al escanear, se busca el producto por código y se siembra el panel: si es
 * conocido, con su nombre y último precio (confirmar cantidad); si es nuevo,
 * con el código asociado para registrarlo una vez.
 */
export function ActiveBoxScreen({
  box,
  onClose,
}: {
  box: Box
  /** Ir a la pantalla de cierre (contraste aproximado vs. real). */
  onClose: () => void
}) {
  const items = useBoxItems(box.id)
  const [adding, setAdding] = useState(true)
  const [cameraOn, setCameraOn] = useState(true)
  const [seed, setSeed] = useState<ScanSeed | null>(null)

  async function handleScan(code: string) {
    if (code === seed?.code) return // ya sembrado: no remontar el panel
    const product = await getProduct(code)
    setSeed({
      nonce: Date.now(),
      code,
      name: product?.name ?? '',
      price: product ? String(product.lastPrice) : '',
    })
    setAdding(true)
  }

  const { videoRef, status, engine } = useScanner({
    active: cameraOn,
    onDetected: handleScan,
  })

  return (
    <div className="flex min-h-full flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      {/* Zona superior — cámara de escaneo */}
      <ScannerView
        videoRef={videoRef}
        status={status}
        engine={engine}
        enabled={cameraOn}
        onToggle={() => setCameraOn((v) => !v)}
      />

      {/* Cabecera de la caja */}
      <header className="flex items-start justify-between gap-3 border-b border-slate-100 px-5 pt-4 pb-3 dark:border-slate-800">
        <div className="min-w-0">
          <p className="text-sm font-medium tracking-wide text-emerald-700 dark:text-emerald-400">
            PreCaja
          </p>
          <h1 className="truncate text-xl font-bold tracking-tight">{box.name}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {items.length} {items.length === 1 ? 'producto' : 'productos'}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          disabled={items.length === 0}
          className="shrink-0 self-center rounded-xl border border-slate-300 px-3 py-2 text-sm font-medium text-slate-600 transition active:bg-slate-100 disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:active:bg-slate-800"
        >
          Cerrar caja
        </button>
      </header>

      {/* Zona central — lista de items */}
      <main className="flex-1 overflow-y-auto">
        {items.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 px-6 py-16 text-center text-slate-400 dark:text-slate-500">
            <span className="text-4xl" aria-hidden="true">
              🧺
            </span>
            <p>Aún no hay productos.</p>
            <p className="text-sm">
              Escanea o agrega el primero para empezar a sumar.
            </p>
          </div>
        ) : (
          <ul>
            {items.map((item) => (
              <ItemRow key={item.id} item={item} />
            ))}
          </ul>
        )}
      </main>

      {/* Panel de agregar — sobre el total para verlo crecer en vivo */}
      {adding && (
        <AddItemPanel
          key={seed?.nonce ?? 'manual'}
          boxId={box.id}
          initialSeed={seed}
          onAdded={() => setSeed(null)}
        />
      )}

      {/* Zona inferior — total fijo y acción principal */}
      <footer className="border-t border-slate-200 bg-white px-5 pb-8 pt-4 dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-3 flex items-baseline justify-between">
          <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Total aproximado
          </span>
          <span className="text-3xl font-bold tabular-nums">
            {formatPEN(box.approxTotal)}
          </span>
        </div>
        <button
          type="button"
          onClick={() => setAdding((v) => !v)}
          className="w-full rounded-2xl border border-emerald-600 py-3 text-lg font-semibold text-emerald-700 transition active:bg-emerald-50 dark:border-emerald-500 dark:text-emerald-400 dark:active:bg-emerald-950"
        >
          {adding ? 'Listo' : 'Agregar producto'}
        </button>
      </footer>
    </div>
  )
}
