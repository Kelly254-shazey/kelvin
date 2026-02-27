import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { adminApi, getApiError } from '../../lib/api'
import { isAuthenticated, setAuth } from '../../lib/auth'

export default function AdminLoginPage() {
  const navigate = useNavigate()
  const location = useLocation()

  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (isAuthenticated()) {
    return <Navigate to="/admin" replace />
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    try {
      const data = await adminApi.login(form)
      setAuth(data.token, data.username)
      const destination = location.state?.from || '/admin'
      navigate(destination, { replace: true })
    } catch (apiError) {
      setError(getApiError(apiError))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app-layer flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-md rounded-[26px] border border-white/15 bg-slate-950/55 p-7 shadow-glass backdrop-blur-ultra">
        <p className="text-xs uppercase tracking-[0.22em] text-cyan-200">Admin</p>
        <h1 className="mt-2 text-3xl font-bold">KELLYFLO Login</h1>
        <p className="mt-2 text-sm text-slate-300">Manage projects, services, videos, and portfolio content.</p>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <input
            required
            value={form.username}
            onChange={(event) => setForm((prev) => ({ ...prev, username: event.target.value }))}
            placeholder="Username"
            className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm outline-none ring-cyan-300/40 transition focus:ring"
          />

          <input
            required
            type="password"
            value={form.password}
            onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
            placeholder="Password"
            className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm outline-none ring-cyan-300/40 transition focus:ring"
          />

          {error ? <p className="text-sm text-rose-300">{error}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full border border-cyan-200/45 bg-cyan-300/20 px-5 py-3 text-sm font-semibold text-cyan-50 shadow-glow disabled:opacity-60"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  )
}

