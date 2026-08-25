import { forwardRef } from 'react'
import { Loader2 } from 'lucide-react'

const VARIANTS = {
  primary: 'bg-canopy-800 text-white hover:bg-canopy-900 disabled:bg-canopy-800/50',
  secondary: 'bg-soil-100 text-soil-800 hover:bg-soil-200 disabled:opacity-50',
  danger: 'bg-signal-danger text-white hover:bg-[#962F20] disabled:opacity-50',
  ghost: 'bg-transparent text-soil-700 hover:bg-soil-100 disabled:opacity-50',
}

const SIZES = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-11 px-5 text-base',
}

/**
 * Button — reusable primitive (Master Prompt §14).
 * loading: disables the button and shows a spinner, preventing
 * duplicate submissions during async actions (Master Prompt §17).
 */
const Button = forwardRef(function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  type = 'button',
  className = '',
  ...props
}, ref) {
  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading}
      className={`inline-flex items-center justify-center gap-2 rounded-md font-medium
        transition-colors disabled:cursor-not-allowed
        ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
      {children}
    </button>
  )
})

export default Button
