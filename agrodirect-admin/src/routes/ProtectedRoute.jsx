import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import LoadingSpinner from '../components/ui/LoadingSpinner'

/**
 * ProtectedRoute — blocks unauthenticated users, farmers, and buyers from
 * reaching admin pages (Master Prompt §6). This is a FRONTEND-ONLY gate.
 *
 * ⚠️ SECURITY NOTE: per Master Prompt §27, "Never implement security only
 * through hiding UI elements" and "trust frontend role checks alone."
 * This component prevents the admin UI from rendering, but every real API
 * call the dashboard makes must ALSO be authorized on the backend
 * (Member 1's responsibility) once that backend exists. STATUS: MOCKED —
 * not a substitute for server-side authorization.
 */
export default function ProtectedRoute({ children }) {
  const { user, initializing } = useAuth()
  const location = useLocation()

  if (initializing) return <LoadingSpinner label="Checking session…" />

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}
