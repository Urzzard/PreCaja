import { formatPEN, roundMoney } from './currency'

/** Sentido de la diferencia entre el total real y el aproximado. */
export type DiffDirection = 'over' | 'under' | 'equal'

/** Resultado de contrastar el total aproximado contra el de la boleta. */
export interface TotalComparison {
  /** Diferencia `real - aproximado` (redondeada). Positiva = pagaste más. */
  diff: number
  /** Diferencia porcentual relativa al aproximado; 0 si el aproximado es 0. */
  percent: number
  /** Sentido de la diferencia, para decidir el mensaje. */
  direction: DiffDirection
  /** `true` si la diferencia merece atención (color de advertencia). */
  notable: boolean
  /** Mensaje en español con la causa típica, listo para mostrar. */
  message: string
}

/** Por debajo de este monto, la diferencia se considera redondeo y no se destaca. */
const EQUAL_THRESHOLD = 0.05
/** A partir de este porcentaje, la diferencia se marca como notable. */
const NOTABLE_PERCENT = 3

/**
 * Contrasta el total aproximado con el total real de la boleta y arma el mensaje
 * de causa típica (ver docs/UI.md). No formatea colores ni layout: solo datos y texto.
 */
export function compareTotals(approx: number, real: number): TotalComparison {
  const diff = roundMoney(real - approx)
  const percent = approx > 0 ? roundMoney((diff / approx) * 100) : 0
  const abs = Math.abs(diff)

  if (abs < EQUAL_THRESHOLD) {
    return {
      diff,
      percent,
      direction: 'equal',
      notable: false,
      message: 'Prácticamente exacto. Tu cálculo dio en el blanco. 🎯',
    }
  }

  const notable = approx === 0 || Math.abs(percent) >= NOTABLE_PERCENT

  if (diff > 0) {
    return {
      diff,
      percent,
      direction: 'over',
      notable,
      message: `Pagaste ${formatPEN(abs)} más de lo aproximado. Suele ser impuestos, redondeo de caja o algo que no registraste.`,
    }
  }

  return {
    diff,
    percent,
    direction: 'under',
    notable,
    message: `Pagaste ${formatPEN(abs)} menos de lo aproximado. Quizás una oferta o un producto que no llegó a la boleta.`,
  }
}
