import type { Box } from '../../types'
import { useClosedBoxes } from '../../hooks/useClosedBoxes'
import { compareTotals, formatDate, formatPEN } from '../../utils'

/**
 * Lista de cajas cerradas (el historial). Cada fila muestra el nombre, la fecha,
 * el total real y una insignia con la diferencia vs. el aproximado. Tocar una
 * caja abre su detalle (ver docs/UI.md, Fase 6).
 */
export function HistoryListScreen({
  onBack,
  onSelect,
}: {
  onBack: () => void
  onSelect: (box: Box) => void
}) {
  const boxes = useClosedBoxes()

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
        <h1 className="text-xl font-bold tracking-tight">Historial</h1>
      </header>

      <main className="flex-1 overflow-y-auto">
        {boxes.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 px-6 py-16 text-center text-slate-400 dark:text-slate-500">
            <span className="text-4xl" aria-hidden="true">
              📋
            </span>
            <p>Aún no hay compras guardadas.</p>
            <p className="text-sm">
              Cuando cierres una caja, aparecerá aquí.
            </p>
          </div>
        ) : (
          <ul>
            {boxes.map((box) => (
              <BoxListRow key={box.id} box={box} onSelect={() => onSelect(box)} />
            ))}
          </ul>
        )}
      </main>
    </div>
  )
}

/** Una fila del historial: nombre, fecha, total real y diferencia. */
function BoxListRow({ box, onSelect }: { box: Box; onSelect: () => void }) {
  const real = box.realTotal ?? 0
  const comparison = compareTotals(box.approxTotal, real)

  const badgeClass = comparison.notable
    ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
    : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'

  return (
    <li className="border-b border-slate-100 dark:border-slate-800">
      <button
        type="button"
        onClick={onSelect}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left active:bg-slate-50 dark:active:bg-slate-900"
      >
        <div className="min-w-0">
          <p className="truncate font-medium">{box.name}</p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {formatDate(box.createdAt)}
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          <span className="font-semibold tabular-nums">{formatPEN(real)}</span>
          <span
            className={`rounded-full px-2 py-0.5 text-xs font-medium tabular-nums ${badgeClass}`}
          >
            {comparison.diff > 0 ? '+' : comparison.diff < 0 ? '−' : '='}
            {formatPEN(Math.abs(comparison.diff))}
          </span>
        </div>
      </button>
    </li>
  )
}
