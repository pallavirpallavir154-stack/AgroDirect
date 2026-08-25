import { Loader2 } from 'lucide-react'

export default function LoadingSpinner({ label = 'Loading…' }) {
  return (
    <div role="status" className="flex flex-col items-center justify-center gap-2 py-16 text-soil-600">
      <Loader2 className="h-6 w-6 animate-spin text-canopy-700" aria-hidden="true" />
      <span className="text-sm">{label}</span>
    </div>
  )
}

/** Table skeleton — shown while a list is loading, instead of a blank table. */
export function TableSkeleton({ rows = 5, cols = 5 }) {
  return (
    <div className="animate-pulse divide-y divide-soil-100">
      {Array.from({ length: rows }).map((_, r) => (
        <div key={r} className="flex gap-4 px-4 py-3">
          {Array.from({ length: cols }).map((__, c) => (
            <div key={c} className="h-3.5 flex-1 rounded bg-soil-100" />
          ))}
        </div>
      ))}
    </div>
  )
}
