import { useMemo, useRef, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { addItem, listProducts, saveProductPrice } from '../../db'
import type { Product } from '../../types'
import { formatPEN, roundMoney } from '../../utils'
import { QuantityStepper } from '../../components/QuantityStepper'

/** Referencia estable para cuando la query aún no devolvió datos. */
const NO_PRODUCTS: Product[] = []

/** Semilla que deja un escaneo: el código y, si es conocido, su nombre y precio. */
export interface ScanSeed {
  /** Único por escaneo (incluso del mismo código), usado como `key` para reiniciar. */
  nonce: number
  code: string
  name: string
  price: string
}

/**
 * Panel para agregar un producto, por escaneo o a mano. Aparece entre la lista
 * y el total, así el total se ve crecer en vivo. Tras añadir, se resetea y vuelve
 * el foco al nombre, para registrar rápido varios productos seguidos (~3s c/u).
 *
 * Recibe `initialSeed` ya resuelto por el escáner. Para reaplicar una semilla
 * nueva, el padre cambia la `key` de este componente (lo remonta) — así evitamos
 * sincronizar props↔estado con efectos.
 *
 * Código del producto al guardar: si vino de un escaneo, el código real de barras;
 * si no, el de un producto conocido que coincida por nombre; si tampoco, `manual:<uuid>`.
 */
export function AddItemPanel({
  boxId,
  initialSeed,
  onAdded,
}: {
  boxId: string
  initialSeed: ScanSeed | null
  /** Aviso al padre tras añadir, para que limpie la semilla del escaneo. */
  onAdded?: () => void
}) {
  const products = useLiveQuery(() => listProducts(), []) ?? NO_PRODUCTS
  const [name, setName] = useState(initialSeed?.name ?? '')
  const [price, setPrice] = useState(initialSeed?.price ?? '')
  const [quantity, setQuantity] = useState(1)
  const [scannedCode, setScannedCode] = useState<string | null>(
    initialSeed?.code ?? null,
  )
  const nameRef = useRef<HTMLInputElement>(null)

  /** Producto conocido que coincide por nombre (para la entrada manual). */
  const match = useMemo(() => {
    const needle = name.trim().toLowerCase()
    if (!needle) return undefined
    return products.find((p) => p.name.trim().toLowerCase() === needle)
  }, [name, products])

  /** ¿El código escaneado ya existe en el catálogo? */
  const scannedKnown = useMemo(
    () => (scannedCode ? products.some((p) => p.code === scannedCode) : false),
    [scannedCode, products],
  )

  /** Al escribir el nombre (sin código escaneado), precargar precio si es conocido. */
  function handleNameChange(value: string) {
    setName(value)
    if (scannedCode) return // con código escaneado, el nombre es para registrar
    const needle = value.trim().toLowerCase()
    const known = needle
      ? products.find((p) => p.name.trim().toLowerCase() === needle)
      : undefined
    if (known) setPrice(String(known.lastPrice))
  }

  const priceNum = roundMoney(parseFloat(price.replace(',', '.')) || 0)
  const canAdd = name.trim().length > 0 && priceNum > 0 && quantity >= 1

  async function handleAdd() {
    if (!canAdd) return
    const trimmedName = name.trim()
    const code = scannedCode ?? match?.code ?? `manual:${crypto.randomUUID()}`
    await saveProductPrice(code, trimmedName, priceNum)
    await addItem({
      boxId,
      productCode: code,
      name: trimmedName,
      price: priceNum,
      quantity,
    })
    // Reset para el siguiente producto (a mano).
    setName('')
    setPrice('')
    setQuantity(1)
    setScannedCode(null)
    nameRef.current?.focus()
    onAdded?.()
  }

  return (
    <section className="space-y-3 border-t border-slate-200 bg-white px-5 py-4 dark:border-slate-800 dark:bg-slate-900">
      {scannedCode && (
        <div className="flex items-center justify-between gap-2 rounded-xl bg-slate-100 px-3 py-2 text-sm dark:bg-slate-800">
          <span className="truncate tabular-nums text-slate-600 dark:text-slate-300">
            📷 {scannedCode}
          </span>
          <span
            className={`shrink-0 font-medium ${
              scannedKnown
                ? 'text-emerald-700 dark:text-emerald-400'
                : 'text-amber-600 dark:text-amber-400'
            }`}
          >
            {scannedKnown ? 'conocido' : 'nuevo · regístralo'}
          </span>
        </div>
      )}

      <input
        ref={nameRef}
        type="text"
        list="known-products"
        value={name}
        onChange={(e) => handleNameChange(e.target.value)}
        placeholder="Nombre del producto"
        autoFocus
        className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-lg outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-950"
      />
      <datalist id="known-products">
        {products.map((p) => (
          <option key={p.code} value={p.name} />
        ))}
      </datalist>

      {!scannedCode && match && (
        <p className="text-sm text-emerald-700 dark:text-emerald-400">
          🏷️ Conocido · último {formatPEN(match.lastPrice)}
        </p>
      )}

      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
            S/
          </span>
          <input
            type="text"
            inputMode="decimal"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="0.00"
            className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-lg tabular-nums outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-950"
          />
        </div>
        <QuantityStepper value={quantity} onChange={setQuantity} />
      </div>

      <button
        type="button"
        onClick={handleAdd}
        disabled={!canAdd}
        className="w-full rounded-2xl bg-emerald-600 py-3 text-lg font-semibold text-white shadow-sm transition active:bg-emerald-700 disabled:opacity-40 dark:bg-emerald-500 dark:active:bg-emerald-600"
      >
        Añadir {canAdd ? `· ${formatPEN(priceNum * quantity)}` : ''}
      </button>
    </section>
  )
}
