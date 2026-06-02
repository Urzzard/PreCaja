import { useState } from 'react'
import type { Item } from '../../types'
import { deleteItem, updateItemQuantity } from '../../db'
import { formatPEN } from '../../utils'
import { QuantityStepper } from '../../components/QuantityStepper'

/**
 * Una fila del carrito: nombre, detalle (cantidad × precio) y subtotal.
 * Al tocarla se despliegan los controles para editar la cantidad o eliminarla.
 */
export function ItemRow({ item }: { item: Item }) {
  const [open, setOpen] = useState(false)

  return (
    <li className="border-b border-slate-100 dark:border-slate-800">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-3 px-5 py-3 text-left active:bg-slate-50 dark:active:bg-slate-900"
      >
        <div className="min-w-0">
          <p className="truncate font-medium text-slate-900 dark:text-slate-100">
            {item.name}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {item.quantity} × {formatPEN(item.price)}
          </p>
        </div>
        <span className="shrink-0 font-semibold tabular-nums text-slate-900 dark:text-slate-100">
          {formatPEN(item.subtotal)}
        </span>
      </button>

      {open && (
        <div className="flex items-center justify-between gap-3 px-5 pb-3">
          <QuantityStepper
            value={item.quantity}
            onChange={(q) => updateItemQuantity(item.id, q)}
          />
          <button
            type="button"
            onClick={() => deleteItem(item.id)}
            className="rounded-xl px-4 py-2 font-medium text-red-600 active:bg-red-50 dark:text-red-400 dark:active:bg-red-950"
          >
            Eliminar
          </button>
        </div>
      )}
    </li>
  )
}
