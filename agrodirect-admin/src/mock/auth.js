// ⚠️ MOCK DATA — isolated intentionally (Master Prompt §25).
// Replace this whole file's contents with real Firebase Authentication
// calls when Member 1's auth backend is available. Nothing outside
// AuthContext.jsx should import from here directly.

// Demo credential for the college-project demo (Section 32 of Master Prompt).
// NOT a real secret — this is mock/local-only auth, never wired to a real backend.
export const MOCK_ADMIN = {
  id: 'admin-001',
  name: 'Admin User',
  email: 'admin@agrodirect.dev',
  role: 'admin',
}

const MOCK_CREDENTIALS = {
  email: 'admin@agrodirect.dev',
  password: 'Admin@123',
}

/**
 * Simulates an async login call against a backend.
 * Returns { user } on success, throws Error(message) on failure.
 */
export function mockLogin(email, password) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (!email || !password) {
        reject(new Error('Email and password are required.'))
        return
      }
      if (email !== MOCK_CREDENTIALS.email || password !== MOCK_CREDENTIALS.password) {
        reject(new Error('Invalid email or password.'))
        return
      }
      resolve({ user: MOCK_ADMIN })
    }, 600) // simulated network latency
  })
}
