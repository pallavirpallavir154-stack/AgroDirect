import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Sprout } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import Input from '../../components/ui/Input'
import Button from '../../components/ui/Button'
import Card from '../../components/ui/Card'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [formError, setFormError] = useState('')
  const [loading, setLoading] = useState(false)

  function validate() {
    const errors = {}
    if (!email.trim()) errors.email = 'Email is required.'
    else if (!/^\S+@\S+\.\S+$/.test(email)) errors.email = 'Enter a valid email address.'
    if (!password) errors.password = 'Password is required.'
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setFormError('')
    if (!validate()) return

    setLoading(true)
    try {
      await login(email, password)
      const redirectTo = location.state?.from?.pathname ?? '/'
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setFormError(err.message || 'Unable to sign in. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-canopy-950 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex flex-col items-center text-center">
          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-harvest-500">
            <Sprout className="h-5 w-5 text-canopy-950" />
          </div>
          <h1 className="font-display text-2xl font-semibold text-white">AgroDirect Admin</h1>
          <p className="mt-1 text-sm text-canopy-500">Sign in to manage the marketplace</p>
        </div>

        <Card className="bg-white">
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {formError && (
              <div role="alert" className="rounded-md bg-signal-danger/10 px-3 py-2 text-sm text-signal-danger">
                {formError}
              </div>
            )}

            <Input
              id="email"
              type="email"
              label="Email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={fieldErrors.email}
              placeholder="admin@agrodirect.dev"
              autoComplete="username"
            />
            <Input
              id="password"
              type="password"
              label="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={fieldErrors.password}
              placeholder="••••••••"
              autoComplete="current-password"
            />

            <Button type="submit" className="w-full" loading={loading}>
              Sign in
            </Button>

            <p className="text-center text-xs text-soil-500">
              Demo credentials: admin@agrodirect.dev / Admin@123
            </p>
          </form>
        </Card>
      </div>
    </div>
  )
}
