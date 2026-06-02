/** Control compacto de cantidad: − [n] +. Reutilizado al agregar y al editar items. */
export function QuantityStepper({
  value,
  onChange,
  min = 1,
}: {
  value: number
  onChange: (next: number) => void
  min?: number
}) {
  return (
    <div className="inline-flex items-center rounded-xl border border-slate-300 dark:border-slate-700">
      <button
        type="button"
        aria-label="Restar"
        onClick={() => onChange(Math.max(min, value - 1))}
        className="px-4 py-2 text-xl font-semibold text-slate-600 active:text-emerald-600 disabled:opacity-30 dark:text-slate-300"
        disabled={value <= min}
      >
        −
      </button>
      <span className="w-8 text-center text-lg font-semibold tabular-nums">
        {value}
      </span>
      <button
        type="button"
        aria-label="Sumar"
        onClick={() => onChange(value + 1)}
        className="px-4 py-2 text-xl font-semibold text-slate-600 active:text-emerald-600 dark:text-slate-300"
      >
        +
      </button>
    </div>
  )
}
