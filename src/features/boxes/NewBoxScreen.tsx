import { useState } from 'react'
import { createBox } from '../../db'
import { Button } from '../../components/Button'

/**
 * Pantalla inicial cuando no hay caja abierta: pedir un nombre y crear la caja.
 * Al crearla, la query reactiva de la caja abierta cambia sola a la pantalla activa.
 */
export function NewBoxScreen() {
  const [name, setName] = useState('')
  const [busy, setBusy] = useState(false)

  async function handleCreate() {
    setBusy(true)
    await createBox(name.trim() || 'Compra')
    // No reseteamos busy: la pantalla se reemplaza al aparecer la caja abierta.
  }

  return (
    <div className="flex min-h-full flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <main className="flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
        <span className="text-5xl" aria-hidden="true">
          🛒
        </span>
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight">Nueva caja</h1>
          <p className="text-slate-500 dark:text-slate-400">
            Ponle un nombre a esta compra.
          </p>
        </div>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ej. Súper sábado"
          autoFocus
          className="w-full max-w-xs rounded-2xl border border-slate-300 bg-white px-4 py-3 text-center text-lg outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-900"
        />
      </main>

      <footer className="px-5 pb-8 pt-4">
        <Button onClick={handleCreate} disabled={busy}>
          Crear caja
        </Button>
      </footer>
    </div>
  )
}
