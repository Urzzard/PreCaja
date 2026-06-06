import { useEffect, useMemo, useRef, useState } from 'react'
import type { Box } from '../../types'
import { useBoxItems } from '../../hooks/useBoxItems'
import { closeBox } from '../../db'
import {
  compareTotals,
  compressImage,
  formatDate,
  formatPEN,
  roundMoney,
} from '../../utils'
import { Button } from '../../components/Button'

/**
 * Pantalla de cierre de caja: contrasta el total aproximado con el de la boleta
 * real, deja adjuntar la foto de la boleta (comprimida) y archiva la caja en el
 * historial (ver docs/UI.md). Cerrar la caja la marca como `closed`, con lo que
 * deja de ser la compra en curso.
 *
 * "Volver a comprar" se especifica aquí en UI.md pero pertenece a la Fase 6
 * (historial), así que aún no se incluye.
 */
export function CloseBoxScreen({
  box,
  onBack,
  onClosed,
}: {
  box: Box
  /** Volver a la caja activa sin cerrarla. */
  onBack: () => void
  /** Aviso tras archivar la caja, para que el padre vuelva a la vista inicial. */
  onClosed: () => void
}) {
  const items = useBoxItems(box.id)
  const [realText, setRealText] = useState('')
  const [photo, setPhoto] = useState<Blob | null>(null)
  const [busy, setBusy] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const realNum = roundMoney(parseFloat(realText.replace(',', '.')) || 0)
  const hasReal = realNum > 0
  const comparison = useMemo(
    () => (hasReal ? compareTotals(box.approxTotal, realNum) : null),
    [hasReal, box.approxTotal, realNum],
  )

  /** Vista previa de la foto adjunta; se libera el objeto URL al cambiar/desmontar. */
  const photoUrl = useMemo(
    () => (photo ? URL.createObjectURL(photo) : null),
    [photo],
  )
  useEffect(() => {
    return () => {
      if (photoUrl) URL.revokeObjectURL(photoUrl)
    }
  }, [photoUrl])

  async function handlePickPhoto(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = '' // permite volver a elegir el mismo archivo
    if (!file) return
    setPhoto(await compressImage(file))
  }

  async function handleSave() {
    if (!hasReal || busy) return
    setBusy(true)
    await closeBox(box.id, {
      realTotal: realNum,
      receiptPhoto: photo ?? undefined,
    })
    onClosed()
  }

  const toneClass = !comparison
    ? ''
    : comparison.notable
      ? 'border-amber-300 bg-amber-50 text-amber-900 dark:border-amber-700/60 dark:bg-amber-950/40 dark:text-amber-200'
      : 'border-emerald-300 bg-emerald-50 text-emerald-900 dark:border-emerald-700/60 dark:bg-emerald-950/40 dark:text-emerald-200'

  return (
    <div className="flex min-h-full flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      {/* Cabecera */}
      <header className="flex items-center gap-3 border-b border-slate-100 px-4 pb-3 pt-4 dark:border-slate-800">
        <button
          type="button"
          onClick={onBack}
          aria-label="Volver a la caja"
          className="rounded-xl px-2 py-1 text-2xl leading-none text-slate-500 active:bg-slate-100 dark:text-slate-400 dark:active:bg-slate-800"
        >
          ←
        </button>
        <div className="min-w-0">
          <h1 className="truncate text-xl font-bold tracking-tight">
            Cerrar caja · {box.name}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {formatDate(box.createdAt)} ·{' '}
            {items.length} {items.length === 1 ? 'producto' : 'productos'}
          </p>
        </div>
      </header>

      <main className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
        {/* Dos tarjetas: aproximado vs. boleta real */}
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
            <div className="relative mt-1">
              <span className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 text-2xl font-bold text-slate-400">
                S/
              </span>
              <input
                type="text"
                inputMode="decimal"
                value={realText}
                onChange={(e) => setRealText(e.target.value)}
                placeholder="0.00"
                autoFocus
                className="w-full bg-transparent pl-9 text-2xl font-bold tabular-nums outline-none placeholder:text-slate-300 dark:placeholder:text-slate-600"
              />
            </div>
          </div>
        </div>

        {/* Diferencia destacada */}
        {comparison && (
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
        )}

        {/* Foto de la boleta */}
        <div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handlePickPhoto}
            className="hidden"
          />
          {photoUrl ? (
            <div className="space-y-2">
              <img
                src={photoUrl}
                alt="Boleta"
                className="max-h-64 w-full rounded-2xl border border-slate-200 object-contain dark:border-slate-800"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="flex-1 rounded-xl border border-slate-300 py-2 text-sm font-medium text-slate-600 active:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:active:bg-slate-800"
                >
                  Cambiar foto
                </button>
                <button
                  type="button"
                  onClick={() => setPhoto(null)}
                  className="flex-1 rounded-xl border border-slate-300 py-2 text-sm font-medium text-slate-600 active:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:active:bg-slate-800"
                >
                  Quitar
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="w-full rounded-2xl border border-dashed border-slate-300 py-4 text-base font-medium text-slate-600 active:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:active:bg-slate-800"
            >
              📷 Tomar foto de la boleta
            </button>
          )}
        </div>
      </main>

      {/* Acción final */}
      <footer className="border-t border-slate-200 bg-white px-5 pb-8 pt-4 dark:border-slate-800 dark:bg-slate-900">
        <Button onClick={handleSave} disabled={!hasReal || busy}>
          Guardar al historial
        </Button>
      </footer>
    </div>
  )
}
