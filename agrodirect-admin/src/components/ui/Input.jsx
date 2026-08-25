/**
 * Input — reusable form primitive with built-in label + error rendering
 * so every form gets consistent validation UX (Master Prompt §16, §28).
 */
export default function Input({
  id,
  label,
  error,
  hint,
  required = false,
  className = '',
  ...props
}) {
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined

  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-soil-700">
          {label}
          {required && <span className="ml-0.5 text-signal-danger">*</span>}
        </label>
      )}
      <input
        id={id}
        aria-invalid={!!error}
        aria-describedby={describedBy}
        className={`h-10 w-full rounded-md border bg-white px-3 text-sm text-soil-900
          placeholder:text-soil-300 transition-colors
          ${error ? 'border-signal-danger focus-visible:outline-signal-danger' : 'border-soil-200 focus-visible:outline-canopy-700'}
          disabled:bg-soil-100 disabled:text-soil-600`}
        {...props}
      />
      {error && (
        <p id={`${id}-error`} className="mt-1 text-xs text-signal-danger">{error}</p>
      )}
      {!error && hint && (
        <p id={`${id}-hint`} className="mt-1 text-xs text-soil-600">{hint}</p>
      )}
    </div>
  )
}
