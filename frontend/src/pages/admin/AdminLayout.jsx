import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { clearAuth, getAdminUsername } from '../../lib/auth'

const navItems = [
  { label: 'Dashboard', to: '/admin' },
  { label: 'Content', to: '/admin/content' },
  { label: 'Projects', to: '/admin/projects' },
  { label: 'Services', to: '/admin/services' },
  { label: 'Skills', to: '/admin/skills' },
  { label: 'Testimonials', to: '/admin/testimonials' },
  { label: 'Videos', to: '/admin/videos' },
  { label: 'Messages', to: '/admin/messages' },
]

function NavItem({ to, label }) {
  return (
    <NavLink
      to={to}
      end={to === '/admin'}
      className={({ isActive }) =>
        `rounded-xl border px-4 py-2 text-sm font-medium transition ${
          isActive
            ? 'border-cyan-200/45 bg-cyan-300/20 text-cyan-100 shadow-glow'
            : 'border-white/15 bg-white/5 text-slate-200 hover:bg-white/10'
        }`
      }
    >
      {label}
    </NavLink>
  )
}

export default function AdminLayout() {
  const navigate = useNavigate()
  const username = getAdminUsername()

  const handleLogout = () => {
    clearAuth()
    navigate('/admin/login', { replace: true })
  }

  return (
    <div className="app-layer min-h-screen px-4 pb-8 pt-6 text-white sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 rounded-[24px] border border-white/15 bg-slate-950/55 p-4 shadow-glass backdrop-blur-2xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.22em] text-cyan-200">KELLYFLO Admin</p>
              <h1 className="text-2xl font-bold">Portfolio Control Center</h1>
            </div>
            <div className="flex items-center gap-3">
              <span className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-slate-200">
                {username || 'admin'}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-full border border-rose-300/45 bg-rose-400/20 px-4 py-2 text-xs font-semibold text-rose-100"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
          <aside className="rounded-[24px] border border-white/15 bg-white/10 p-4 shadow-glass backdrop-blur-ultra">
            <div className="grid grid-cols-2 gap-2 lg:grid-cols-1">
              {navItems.map((item) => (
                <NavItem key={item.to} to={item.to} label={item.label} />
              ))}
            </div>
          </aside>

          <section className="rounded-[24px] border border-white/15 bg-white/10 p-5 shadow-glass backdrop-blur-ultra lg:p-7">
            <Outlet />
          </section>
        </div>
      </div>
    </div>
  )
}

