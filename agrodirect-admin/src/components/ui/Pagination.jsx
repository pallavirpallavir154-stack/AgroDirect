import { ChevronLeft, ChevronRight } from 'lucide-react'
import Button from './Button'

export default function Pagination({ page, pageCount, onChange, totalItems, pageSize }) {
  if (pageCount <= 1) return null

  const start = (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, totalItems)

  return (
    <div className="flex items-center justify-between border-t border-soil-100 px-4 py-3 text-sm text-soil-600">
      <span>
        Showing <span className="font-medium text-soil-800">{start}–{end}</span> of{' '}
        <span className="font-medium text-soil-800">{totalItems}</span>
      </span>
      <div className="flex items-center gap-2">
        <Button
          variant="secondary" size="sm"
          disabled={page <= 1}
          onClick={() => onChange(page - 1)}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-xs text-soil-500">Page {page} of {pageCount}</span>
        <Button
          variant="secondary" size="sm"
          disabled={page >= pageCount}
          onClick={() => onChange(page + 1)}
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
