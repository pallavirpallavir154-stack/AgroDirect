export default function Select({ id, label, error, options, className = '', ...props }) {
  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-soil-700">
          {label}
        </label>
      )}
      <select
        id={id}
        aria-invalid={!!error}
        className={`h-10 w-full rounded-md border bg-white px-3 text-sm text-soil-900
          transition-colors
          ${error ? 'border-signal-danger' : 'border-soil-200 focus-visible:outline-canopy-700'}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <p className="mt-1 text-xs text-signal-danger">{error}</p>}
    </div>
  )
}
