import { useState } from 'react'
import type { Box } from '../../types'
import { useBoxItems } from '../../hooks/useBoxItems'
import { formatPEN } from '../../utils'
import { ItemRow } from './ItemRow'
import { AddItemPanel } from './AddItemPanel'

/**
 * Pantalla principal de PreCaja: la caja activa. Tres zonas verticales
 * (ver docs/UI.md): cabecera, lista de items y barra de total fija abajo.
 * El panel de agregar aparece sobre el total, así este se ve crecer en vivo.
 */
export function ActiveBoxScreen({ box }: { box: Box }) {
  const items = useBoxItems(box.id)
  const [adding, setAdding] = useState(true)

  return (
    <div className="flex min-h-full flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      {/* Zona superior — cabecera */}
      <header className="border-b border-slate-100 px-5 pt-8 pb-4 dark:border-slate-800">
        <p className="text-sm font-medium tracking-wide text-emerald-700 dark:text-emerald-400">
          PreCaja
        </p>
        <h1 className="text-xl font-bold tracking-tight">{box.name}</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {items.length} {items.length === 1 ? 'producto' : 'productos'}
        </p>
      </header>

      {/* Zona central — lista de items */}
      <main className="flex-1 overflow-y-auto">
        {items.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 px-6 py-16 text-center text-slate-400 dark:text-slate-500">
            <span className="text-4xl" aria-hidden="true">
              🧺
            </span>
            <p>Aún no hay productos.</p>
            <p className="text-sm">Agrega el primero para empezar a sumar.</p>
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
      {adding && <AddItemPanel boxId={box.id} />}

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
