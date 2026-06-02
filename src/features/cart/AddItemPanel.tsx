import { useMemo, useRef, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { addItem, listProducts, saveProductPrice } from '../../db'
import type { Product } from '../../types'
import { formatPEN, roundMoney } from '../../utils'
import { QuantityStepper } from '../../components/QuantityStepper'

/** Referencia estable para cuando la query aún no devolvió datos. */
const NO_PRODUCTS: Product[] = []

/**
 * Panel para agregar un producto a mano. Aparece entre la lista y el total,
 * así el total se ve crecer en vivo. Tras añadir, se resetea y vuelve el foco
 * al nombre, para registrar rápido varios productos seguidos (~3s c/u).
 *
 * Autocompletar: si el nombre coincide con un producto ya conocido, reusa su
 * código y precarga su último precio (que el usuario puede corregir).
 */
export function AddItemPanel({ boxId }: { boxId: string }) {
  const products = useLiveQuery(() => listProducts(), []) ?? NO_PRODUCTS
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [quantity, setQuantity] = useState(1)
  const nameRef = useRef<HTMLInputElement>(null)

  /** Producto conocido que coincide por nombre (sin distinguir mayúsculas). */
  const match = useMemo(() => {
    const needle = name.trim().toLowerCase()
    if (!needle) return undefined
    return products.find((p) => p.name.trim().toLowerCase() === needle)
  }, [name, products])

  /** Al escribir el nombre, si coincide con un conocido, precargar su último precio. */
  function handleNameChange(value: string) {
    setName(value)
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
    const code = match ? match.code : `manual:${crypto.randomUUID()}`
    await saveProductPrice(code, trimmedName, priceNum)
    await addItem({
      boxId,
      productCode: code,
      name: trimmedName,
      price: priceNum,
      quantity,
    })
    // Reset para el siguiente producto.
    setName('')
    setPrice('')
    setQuantity(1)
    nameRef.current?.focus()
  }

  return (
    <section className="space-y-3 border-t border-slate-200 bg-white px-5 py-4 dark:border-slate-800 dark:bg-slate-900">
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

      {match && (
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
