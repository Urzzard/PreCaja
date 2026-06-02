import { useEffect, useRef, useState } from 'react'

export type ScannerStatus =
  | 'idle'
  | 'starting'
  | 'scanning'
  | 'denied'
  | 'unsupported'
  | 'error'

export type ScannerEngine = 'native' | 'zxing'

/** Formatos típicos de productos de supermercado. */
const BARCODE_FORMATS = [
  'ean_13',
  'ean_8',
  'upc_a',
  'upc_e',
  'code_128',
  'code_39',
  'itf',
  'codabar',
]

/** Ignora lecturas repetidas del mismo código dentro de esta ventana. */
const REPEAT_COOLDOWN_MS = 2000

interface UseScannerOptions {
  /** Si el escaneo debe estar corriendo (cámara encendida). */
  active: boolean
  /** Se llama una vez por código detectado (con anti-rebote para repeticiones). */
  onDetected: (code: string) => void
}

/**
 * Abstrae el escaneo de códigos de barras detrás de una interfaz única:
 * usa `BarcodeDetector` nativo si existe; si no, carga `@zxing/browser` de
 * forma diferida. El resto de la app no sabe cuál motor está activo.
 * Ver docs/ARCHITECTURE.md (compatibilidad de escaneo).
 */
export function useScanner({ active, onDetected }: UseScannerOptions) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [status, setStatus] = useState<ScannerStatus>('idle')
  const [engine, setEngine] = useState<ScannerEngine | null>(null)

  // Mantener la última callback sin reiniciar el efecto en cada render.
  const onDetectedRef = useRef(onDetected)
  useEffect(() => {
    onDetectedRef.current = onDetected
  })

  useEffect(() => {
    if (!active) return

    let cancelled = false
    let stream: MediaStream | null = null
    let intervalId: number | undefined
    let zxingControls: { stop: () => void } | null = null
    let videoEl: HTMLVideoElement | null = null
    const last = { code: '', at: 0 }

    function emit(code: string) {
      const now = Date.now()
      if (code === last.code && now - last.at < REPEAT_COOLDOWN_MS) return
      last.code = code
      last.at = now
      onDetectedRef.current(code)
    }

    async function start() {
      if (!navigator.mediaDevices?.getUserMedia) {
        setStatus('unsupported')
        return
      }
      setStatus('starting')
      try {
        if ('BarcodeDetector' in window) {
          // Camino nativo (Chromium en Android/ChromeOS/macOS).
          const detector = new BarcodeDetector({ formats: BARCODE_FORMATS })
          stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'environment' },
          })
          if (cancelled) return
          const video = videoRef.current
          if (!video) return
          videoEl = video
          video.srcObject = stream
          await video.play()
          setEngine('native')
          setStatus('scanning')
          intervalId = window.setInterval(async () => {
            const video = videoRef.current
            if (cancelled || !video || video.readyState < 2) return
            try {
              const codes = await detector.detect(video)
              if (codes.length > 0 && codes[0]) emit(codes[0].rawValue)
            } catch {
              // Fallo transitorio de un frame: ignorar y seguir.
            }
          }, 250)
        } else {
          // Respaldo: @zxing/browser (Safari/iOS, Chrome en Windows, etc.).
          const { BrowserMultiFormatReader } = await import('@zxing/browser')
          if (cancelled) return
          const video = videoRef.current
          if (!video) return
          videoEl = video
          const reader = new BrowserMultiFormatReader()
          zxingControls = await reader.decodeFromConstraints(
            { video: { facingMode: 'environment' } },
            video,
            (result) => {
              if (result) emit(result.getText())
            },
          )
          setEngine('zxing')
          setStatus('scanning')
        }
      } catch (err) {
        if (cancelled) return
        const name = (err as { name?: string }).name
        setStatus(
          name === 'NotAllowedError' || name === 'SecurityError'
            ? 'denied'
            : 'error',
        )
      }
    }

    void start()

    return () => {
      cancelled = true
      if (intervalId) clearInterval(intervalId)
      zxingControls?.stop()
      stream?.getTracks().forEach((track) => track.stop())
      if (videoEl) videoEl.srcObject = null
      setStatus('idle')
      setEngine(null)
    }
  }, [active])

  return { videoRef, status, engine }
}
