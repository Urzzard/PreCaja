import { useMemo } from 'react'
import { usePriceHistory } from '../../hooks/usePriceHistory'
import { formatDate, formatPEN } from '../../utils'

/** Una entrada del historial, ya con su variación respecto a la compra anterior. */
interface PricePoint {
  id: string
  createdAt: number
  price: number
  /** Diferencia de precio vs. la compra cronológicamente anterior; `null` si es la primera. */
  delta: number | null
}

/**
 * Historial de precios de un producto: cómo evolucionó su precio a lo largo de
 * las compras. Muestra mínimo, máximo y último, y la lista de la más reciente a
 * la más antigua con la variación frente a la anterior (ver docs/UI.md, Fase 6).
 */
export function PriceHistoryScreen({
  productCode,
  productName,
  onBack,
}: {
  productCode: string
  productName: string
  onBack: () => void
}) {
  const items = usePriceHistory(productCode)

  const { points, min, max, last } = useMemo(() => {
    // items viene del más antiguo al más reciente.
    const pts: PricePoint[] = items.map((item, i) => {
      const prev = items[i - 1]
      return {
        id: item.id,
        createdAt: item.createdAt,
        price: item.price,
        delta: prev ? item.price - prev.price : null,
      }
    })
    const prices = items.map((i) => i.price)
    return {
      points: pts.slice().reverse(), // mostrar de la más reciente a la más antigua
      min: prices.length ? Math.min(...prices) : 0,
      max: prices.length ? Math.max(...prices) : 0,
      last: prices.at(-1) ?? 0,
    }
  }, [items])

  return (
    <div className="flex min-h-full flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <header className="flex items-center gap-3 border-b border-slate-100 px-4 pb-3 pt-4 dark:border-slate-800">
        <button
          type="button"
          onClick={onBack}
          aria-label="Volver"
          className="rounded-xl px-2 py-1 text-2xl leading-none text-slate-500 active:bg-slate-100 dark:text-slate-400 dark:active:bg-slate-800"
        >
          ←
        </button>
        <div className="min-w-0">
          <h1 className="truncate text-xl font-bold tracking-tight">
            {productName}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Historial de precios
          </p>
        </div>
      </header>

      <main className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
        {items.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-16 text-center text-slate-400 dark:text-slate-500">
            <span className="text-4xl" aria-hidden="true">
              🏷️
            </span>
            <p>Sin registros de precio todavía.</p>
          </div>
        ) : (
          <>
            {/* Resumen mínimo / último / máximo */}
            <div className="grid grid-cols-3 gap-3">
              <SummaryCard label="Mínimo" value={min} />
              <SummaryCard label="Último" value={last} highlight />
              <SummaryCard label="Máximo" value={max} />
            </div>

            {/* Lista cronológica (más reciente arriba) */}
            <ul className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
              {points.map((point) => (
                <li
                  key={point.id}
                  className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-3 last:border-b-0 dark:border-slate-800"
                >
                  <span className="text-sm text-slate-500 dark:text-slate-400">
                    {formatDate(point.createdAt)}
                  </span>
                  <span className="flex items-center gap-2">
                    <PriceDelta delta={point.delta} />
                    <span className="font-semibold tabular-nums">
                      {formatPEN(point.price)}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}
      </main>
    </div>
  )
}

function SummaryCard({
  label,
  value,
  highlight = false,
}: {
  label: string
  value: number
  highlight?: boolean
}) {
  return (
    <div
      className={`rounded-2xl border p-3 text-center ${
        highlight
          ? 'border-emerald-300 bg-emerald-50 dark:border-emerald-700/60 dark:bg-emerald-950/40'
          : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
      }`}
    >
      <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
        {label}
      </p>
      <p className="mt-1 font-bold tabular-nums">{formatPEN(value)}</p>
    </div>
  )
}

/** Flecha de variación de precio frente a la compra anterior. */
function PriceDelta({ delta }: { delta: number | null }) {
  if (delta === null || Math.abs(delta) < 0.005) return null
  const up = delta > 0
  return (
    <span
      className={`text-sm font-medium tabular-nums ${
        up
          ? 'text-red-600 dark:text-red-400'
          : 'text-emerald-600 dark:text-emerald-400'
      }`}
    >
      {up ? '▲' : '▼'} {formatPEN(Math.abs(delta))}
    </span>
  )
}
