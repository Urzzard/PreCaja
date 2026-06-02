/**
 * Tipos mínimos de la API nativa BarcodeDetector (no incluida en lib.dom).
 * Solo declaramos lo que usamos. Ver docs/ARCHITECTURE.md (compatibilidad de escaneo).
 */
interface BarcodeDetectorOptions {
  formats?: string[]
}

interface DetectedBarcode {
  rawValue: string
  format: string
}

declare class BarcodeDetector {
  constructor(options?: BarcodeDetectorOptions)
  static getSupportedFormats(): Promise<string[]>
  detect(source: CanvasImageSource): Promise<DetectedBarcode[]>
}
