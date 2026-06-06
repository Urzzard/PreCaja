/** Opciones de compresión; los valores por defecto bastan para una boleta legible. */
export interface CompressOptions {
  /** Ancho máximo en píxeles; la imagen se reescala manteniendo proporción. */
  maxWidth?: number
  /** Calidad JPEG entre 0 y 1. */
  quality?: number
}

/**
 * Comprime una imagen (foto de boleta o producto) antes de guardarla en IndexedDB.
 * Reescala a un ancho máximo razonable y la codifica como JPEG de calidad media,
 * para mantener la base ligera (ver docs/ARCHITECTURE.md).
 *
 * Degradación elegante: si el navegador no puede procesarla con canvas, devuelve
 * el original sin romper el flujo.
 */
export async function compressImage(
  source: Blob,
  { maxWidth = 1280, quality = 0.7 }: CompressOptions = {},
): Promise<Blob> {
  let bitmap: ImageBitmap
  try {
    bitmap = await createImageBitmap(source, { imageOrientation: 'from-image' })
  } catch {
    return source
  }

  const scale = Math.min(1, maxWidth / bitmap.width)
  const width = Math.round(bitmap.width * scale)
  const height = Math.round(bitmap.height * scale)

  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) {
    bitmap.close()
    return source
  }

  ctx.drawImage(bitmap, 0, 0, width, height)
  bitmap.close()

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, 'image/jpeg', quality),
  )
  return blob ?? source
}
