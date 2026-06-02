import type { RefObject } from 'react'
import type { ScannerEngine, ScannerStatus } from '../../hooks/useScanner'

/** Mensaje según el estado del escáner cuando no puede mostrar cámara. */
function blockedMessage(status: ScannerStatus): string | null {
  switch (status) {
    case 'denied':
      return 'Permiso de cámara denegado. Usa la entrada manual de abajo.'
    case 'unsupported':
      return 'Tu navegador no soporta escaneo. Usa la entrada manual.'
    case 'error':
      return 'No se pudo abrir la cámara. Usa la entrada manual.'
    default:
      return null
  }
}

/**
 * Zona superior de la caja activa: la vista de cámara con marco guía.
 * Siempre acompañada de la entrada manual como alternativa (degradación elegante).
 */
export function ScannerView({
  videoRef,
  status,
  engine,
  enabled,
  onToggle,
}: {
  videoRef: RefObject<HTMLVideoElement | null>
  status: ScannerStatus
  engine: ScannerEngine | null
  enabled: boolean
  onToggle: () => void
}) {
  const message = blockedMessage(status)

  return (
    <div className="relative h-56 w-full shrink-0 overflow-hidden bg-slate-900">
      <video
        ref={videoRef}
        muted
        playsInline
        autoPlay
        className="h-full w-full object-cover"
      />

      {/* Marco guía + ayuda (solo cuando la cámara está activa y sin bloqueo) */}
      {enabled && !message && (
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-3">
          <div className="h-24 w-3/4 rounded-xl border-2 border-white/80 shadow-[0_0_0_100vmax_rgba(0,0,0,0.25)]" />
          <p className="text-sm text-white/90">Apunta al código de barras</p>
        </div>
      )}

      {/* Estado bloqueado: cámara apagada o sin permiso/soporte */}
      {(!enabled || message) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-slate-900/90 px-6 text-center">
          <span className="text-3xl" aria-hidden="true">
            {message ? '🚫' : '📷'}
          </span>
          <p className="text-sm text-slate-200">
            {message ?? 'Cámara apagada'}
          </p>
        </div>
      )}

      {/* Indicador de estado en vivo (útil para verificar que el escáner corre) */}
      {enabled && (status === 'starting' || status === 'scanning') && (
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-black/50 px-2.5 py-1 text-xs text-white/90 backdrop-blur">
          <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
          {status === 'starting'
            ? 'Iniciando cámara…'
            : `Escaneando${engine ? ` · ${engine}` : ''}`}
        </div>
      )}

      {/* Toggle encender/apagar cámara */}
      <button
        type="button"
        onClick={onToggle}
        className="absolute right-3 top-3 rounded-full bg-black/50 px-3 py-1.5 text-sm font-medium text-white backdrop-blur active:bg-black/70"
      >
        {enabled ? 'Apagar' : 'Encender'}
      </button>
    </div>
  )
}
