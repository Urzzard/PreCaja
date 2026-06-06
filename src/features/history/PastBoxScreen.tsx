import { useEffect, useMemo, useState } from 'react'
import type { Box } from '../../types'
import { useBoxItems } from '../../hooks/useBoxItems'
import { compareTotals, formatDate, formatPEN } from '../../utils'

/**
 * Detalle de una caja pasada: aproximado vs. real con su diferencia, la lista de
 * productos (tocar uno abre su historial de precios), la foto de boleta si la hay,
 * y "Volver a comprar" para reutilizarla como lista (ver docs/UI.md, Fase 6).
 */
export function PastBoxScreen({
  box,
  onBack,
  onSelectProduct,
  onRebuy,
  rebuying,
}: {
  box: Box
  onBack: () => void
  onSelectProduct: (productCode: string, name: string) => void
  onRebuy: () => void
  /** `true` mientras se crea la caja nueva, para deshabilitar el botón. */
  rebuying: boolean
}) {
  const items = useBoxItems(box.id)
  const real = box.realTotal ?? 0
  const comparison = compareTotals(box.approxTotal, real)

  const photoUrl = useMemo(
    () => (box.receiptPhoto ? URL.createObjectURL(box.receiptPhoto) : null),
    [box.receiptPhoto],
  )
  useEffect(() => {
    return () => {
      if (photoUrl) URL.revokeObjectURL(photoUrl)
    }
  }, [photoUrl])

  const [showPhoto, setShowPhoto] = useState(false)

  const toneClass = comparison.notable
    ? 'border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-700/60 dark:bg-amber-950/40 dark:text-amber-200'
    : 'border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-700/60 dark:bg-emerald-950/40 dark:text-emerald-200'

  return (
    <div className="flex min-h-full flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <header className="flex items-center gap-3 border-b border-slate-100 px-4 pb-3 pt-4 dark:border-slate-800">
        <button
          type="button"
          onClick={onBack}
          aria-label="Volver al historial"
          className="rounded-xl px-2 py-1 text-2xl leading-none text-slate-500 active:bg-slate-100 dark:text-slate-400 dark:active:bg-slate-800"
        >
          ←
        </button>
        <div className="min-w-0">
          <h1 className="truncate text-xl font-bold tracking-tight">{box.name}</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {formatDate(box.createdAt)} · {items.length}{' '}
            {items.length === 1 ? 'producto' : 'productos'}
          </p>
        </div>
      </header>

      <main className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
        {/* Aproximado vs. real */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Aproximado
            </p>
            <p className="mt-1 text-2xl font-bold tabular-nums">
              {formatPEN(box.approxTotal)}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Boleta real
            </p>
            <p className="mt-1 text-2xl font-bold tabular-nums">
              {formatPEN(real)}
            </p>
          </div>
        </div>

        {/* Diferencia */}
        <div className={`rounded-2xl border p-4 ${toneClass}`}>
          <div className="flex items-baseline justify-between">
            <span className="text-sm font-medium opacity-80">Diferencia</span>
            <span className="text-2xl font-bold tabular-nums">
              {comparison.diff > 0 ? '+' : comparison.diff < 0 ? '−' : ''}
              {formatPEN(Math.abs(comparison.diff))}
              {box.approxTotal > 0 && (
                <span className="ml-2 text-base font-semibold opacity-70">
                  {comparison.percent > 0 ? '+' : ''}
                  {comparison.percent}%
                </span>
              )}
            </span>
          </div>
          <p className="mt-2 text-sm leading-snug">{comparison.message}</p>
        </div>

        {/* Foto de boleta */}
        {photoUrl && (
          <button
            type="button"
            onClick={() => setShowPhoto((v) => !v)}
            className="w-full text-left"
          >
            {showPhoto ? (
              <img
                src={photoUrl}
                alt="Boleta"
                className="max-h-80 w-full rounded-2xl border border-slate-200 object-contain dark:border-slate-800"
              />
            ) : (
              <span className="block rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
                🧾 Ver foto de la boleta
              </span>
            )}
          </button>
        )}

        {/* Lista de productos */}
        <div>
          <p className="mb-1 px-1 text-sm font-medium text-slate-500 dark:text-slate-400">
            Productos
          </p>
          <ul className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
            {items.map((item) => (
              <li
                key={item.id}
                className="border-b border-slate-100 last:border-b-0 dark:border-slate-800"
              >
                <button
                  type="button"
                  onClick={() => onSelectProduct(item.productCode, item.name)}
                  className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left active:bg-slate-50 dark:active:bg-slate-950"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium">{item.name}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {item.quantity} × {formatPEN(item.price)}
                    </p>
                  </div>
                  <span className="shrink-0 font-semibold tabular-nums">
                    {formatPEN(item.subtotal)}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </main>

      <footer className="border-t border-slate-200 bg-white px-5 pb-8 pt-4 dark:border-slate-800 dark:bg-slate-900">
        <button
          type="button"
          onClick={onRebuy}
          disabled={rebuying || items.length === 0}
          className="w-full rounded-2xl bg-emerald-600 py-4 text-lg font-semibold text-white shadow-sm transition active:bg-emerald-700 disabled:opacity-40 dark:bg-emerald-500 dark:active:bg-emerald-600"
        >
          🛒 Volver a comprar
        </button>
      </footer>
    </div>
  )
}
