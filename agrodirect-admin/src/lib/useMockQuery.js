import { useEffect, useState, useCallback } from 'react'

/**
 * useMockQuery — simulates an async API call (loading → data | error),
 * so every page exercises real loading/error/empty states even before
 * a backend exists. Swap `fetcher` for a real API call later; the
 * loading/error contract stays identical for the UI layer.
 */
export function useMockQuery(fetcher, deps = []) {
  const [state, setState] = useState({ data: null, loading: true, error: null })

  const run = useCallback(() => {
    setState({ data: null, loading: true, error: null })
    Promise.resolve()
      .then(fetcher)
      .then((data) => setState({ data, loading: false, error: null }))
      .catch((error) => setState({ data: null, loading: false, error }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  useEffect(() => { run() }, [run])

  return { ...state, refetch: run }
}

/** Wraps a value in a fake network delay, for realistic loading states. */
export function delayed(value, ms = 500) {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms))
}
