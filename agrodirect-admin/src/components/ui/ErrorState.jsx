import { AlertTriangle } from 'lucide-react'
import Button from './Button'

/**
 * ErrorState — shown when a request fails. Never exposes raw stack traces
 * to the user (Master Prompt §18); message must stay user-friendly.
 */
export default function ErrorState({
  title = 'Something went wrong while loading the data.',
  description = 'Please try again. If the problem continues, contact support.',
  onRetry,
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-signal-danger/10">
        <AlertTriangle className="h-5 w-5 text-signal-danger" aria-hidden="true" />
      </div>
      <p className="font-medium text-soil-800">{title}</p>
      <p className="max-w-sm text-sm text-soil-600">{description}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry} className="mt-2">
          Try again
        </Button>
      )}
    </div>
  )
}
