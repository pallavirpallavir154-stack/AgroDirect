// Central status→color mapping so every status pill across Users/Products/Orders
// looks consistent. Extend this map rather than hardcoding colors elsewhere.
const TONES = {
  active: 'bg-canopy-800/10 text-canopy-800',
  approved: 'bg-canopy-800/10 text-canopy-800',
  delivered: 'bg-canopy-800/10 text-canopy-800',
  confirmed: 'bg-signal-info/10 text-signal-info',
  preparing: 'bg-signal-info/10 text-signal-info',
  'out for delivery': 'bg-signal-info/10 text-signal-info',
  pending: 'bg-harvest-500/15 text-harvest-600',
  blocked: 'bg-signal-danger/10 text-signal-danger',
  rejected: 'bg-signal-danger/10 text-signal-danger',
  cancelled: 'bg-signal-danger/10 text-signal-danger',
  default: 'bg-soil-200 text-soil-700',
}

export default function Badge({ children, tone }) {
  const key = (tone ?? String(children)).toLowerCase()
  const cls = TONES[key] ?? TONES.default
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${cls}`}>
      {children}
    </span>
  )
}
