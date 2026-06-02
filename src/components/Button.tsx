import type { ButtonHTMLAttributes } from 'react'

type Props = ButtonHTMLAttributes<HTMLButtonElement>

/**
 * Botón de acción principal: grande, ancho completo, alcanzable con el pulgar.
 * Acepta className extra para casos puntuales.
 */
export function Button({ className = '', type = 'button', ...props }: Props) {
  return (
    <button
      type={type}
      className={`w-full rounded-2xl bg-emerald-600 py-4 text-lg font-semibold text-white shadow-sm transition active:bg-emerald-700 disabled:opacity-40 dark:bg-emerald-500 dark:active:bg-emerald-600 ${className}`}
      {...props}
    />
  )
}
