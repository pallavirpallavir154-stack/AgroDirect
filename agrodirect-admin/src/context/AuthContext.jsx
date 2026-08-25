import { createContext, useContext, useEffect, useState } from 'react'
import { mockLogin } from '../mock/auth'

const AuthContext = createContext(null)
const STORAGE_KEY = 'agrodirect_admin_session'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [initializing, setInitializing] = useState(true)

  // Restore session on refresh — Master Prompt §6: "Protected routes must
  // remain protected after page refresh." This mock uses localStorage as a
  // stand-in for a real Firebase session/token check.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setUser(JSON.parse(raw))
    } catch {
      localStorage.removeItem(STORAGE_KEY)
    } finally {
      setInitializing(false)
    }
  }, [])

  async function login(email, password) {
    const { user } = await mockLogin(email, password)
    // Role verification / admin authorization step (Master Prompt §6).
    if (user.role !== 'admin') {
      throw new Error('This account does not have admin access.')
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user))
    setUser(user)
    return user
  }

  function logout() {
    localStorage.removeItem(STORAGE_KEY)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, initializing, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
