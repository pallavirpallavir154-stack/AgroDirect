import { Inbox } from 'lucide-react'

/**
 * EmptyState — used whenever a list/search has zero results (Master Prompt §13, §19).
 * Never render a blank table/grid; render this instead.
 */
export default function EmptyState({
  icon: Icon = Inbox,
  title = 'Nothing here yet',
  description,
  action,
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-soil-100">
        <Icon className="h-5 w-5 text-soil-500" aria-hidden="true" />
      </div>
      <p className="font-medium text-soil-800">{title}</p>
      {description && <p className="max-w-sm text-sm text-soil-600">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  )
}
