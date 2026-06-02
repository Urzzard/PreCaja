const dateFormatter = new Intl.DateTimeFormat('es-PE', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
})

const dateTimeFormatter = new Intl.DateTimeFormat('es-PE', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

/** Fecha legible, ej. `02 jun 2026`. Recibe un timestamp epoch ms. */
export function formatDate(timestamp: number): string {
  return dateFormatter.format(timestamp)
}

/** Fecha y hora, ej. `02 jun 2026, 14:30`. Recibe un timestamp epoch ms. */
export function formatDateTime(timestamp: number): string {
  return dateTimeFormatter.format(timestamp)
}
