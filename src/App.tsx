function App() {
  return (
    <div className="flex min-h-full flex-col bg-slate-50 text-slate-900">
      {/* Zona superior — cabecera */}
      <header className="px-5 pt-8 pb-4">
        <p className="text-sm font-medium tracking-wide text-emerald-700">
          PreCaja
        </p>
      </header>

      {/* Zona central — saludo */}
      <main className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
        <span className="text-5xl" aria-hidden="true">
          🛒
        </span>
        <h1 className="text-3xl font-bold tracking-tight">Hola, PreCaja</h1>
        <p className="max-w-xs text-balance text-slate-500">
          Tu total aproximado en vivo mientras llenas el carrito. Cimientos
          listos.
        </p>
      </main>

      {/* Zona inferior — barra de acción (alcanzable con el pulgar) */}
      <footer className="px-5 pb-8 pt-4">
        <button
          type="button"
          className="w-full rounded-2xl bg-emerald-600 py-4 text-lg font-semibold text-white shadow-sm active:bg-emerald-700"
        >
          Empezar
        </button>
        <p className="mt-3 text-center text-xs text-slate-400">
          Fase 0 · cimientos del proyecto
        </p>
      </footer>
    </div>
  )
}

export default App
