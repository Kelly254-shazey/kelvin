import { AnimatePresence, motion as Motion } from 'framer-motion'
import { useEffect, useState } from 'react'

const links = [
  { label: 'Home', href: '#home', active: true },
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Work', href: '#work' },
  { label: 'Skills', href: '#skills' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'Videos', href: '#videos' },
  { label: 'Blog', href: '#blog' },
  { label: 'Contact', href: '#contact' },
]

const THEME_KEY = 'kellyflo_theme'

function applyTheme(theme) {
  if (typeof document === 'undefined') return
  document.body.classList.remove('theme-dark', 'theme-slate')
  document.body.classList.add(theme === 'slate' ? 'theme-slate' : 'theme-dark')
}

export default function Navbar({ brandName = 'KELLYFLO', hireCtaText = 'Hire Me' }) {
  const [theme, setTheme] = useState(() => {
    if (typeof localStorage === 'undefined') return 'dark'
    const savedTheme = localStorage.getItem(THEME_KEY)
    return savedTheme === 'slate' ? 'slate' : 'dark'
  })
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'slate' : 'dark'
    setTheme(nextTheme)
    localStorage.setItem(THEME_KEY, nextTheme)
    applyTheme(nextTheme)
  }

  const isDark = theme === 'dark'
  const navShellClass = isDark
    ? 'border-white/10 bg-[#050B18]/68 shadow-[0_4px_30px_rgba(0,0,0,0.1)]'
    : 'border-slate-300/35 bg-slate-800/84 shadow-[0_10px_28px_rgba(15,23,42,0.34)]'
  const themeButtonClass = isDark
    ? 'border-slate-300/35 bg-slate-700/85 text-slate-100'
    : 'border-slate-300/40 bg-slate-700/85 text-slate-100'
  const ctaClass = isDark
    ? 'border-[#00F5D4]/50 bg-[#00F5D4]/10 text-slate-100 hover:bg-[#00F5D4]/22 hover:text-white'
    : 'border-slate-200/45 bg-slate-100/10 text-slate-100 hover:bg-slate-100/20 hover:text-white'
  const hamburgerClass = isDark
    ? 'border-gray-300/30 hover:bg-gray-800/50'
    : 'border-slate-300/35 hover:bg-slate-700/40'
  const mobileShellClass = isDark ? 'border-white/10 bg-[#050B18]/90' : 'border-slate-300/35 bg-slate-900/94'
  const mobileLinkClass = 'text-white font-medium hover:text-[#00F5D4] hover:bg-white/10 bg-transparent drop-shadow-[0_1px_6px_rgba(255,255,255,0.3)]'

  return (
    <header className="fixed inset-x-0 top-0 z-[9999] px-4 py-4 md:px-8">
      <nav
        className={`mx-auto flex w-full max-w-[1240px] items-center justify-between rounded-[24px] border px-6 py-3 backdrop-blur-xl transition-all duration-300 ${navShellClass}`}
      >
        <a href="#home" className="text-2xl font-black tracking-tight text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.55)] md:text-3xl">
          {brandName}
        </a>

        {/* Desktop Menu */}
        <ul className="hidden items-center gap-6 xl:flex">
          {links.map((item) => (
            <li key={item.href} className="relative">
              <a
                href={item.href}
                className={`text-sm font-bold transition-all duration-300 md:text-base ${
                  item.active ? 'text-[#00F5D4] drop-shadow-[0_2px_12px_rgba(0,245,212,0.6)]' : 'text-white drop-shadow-[0_1px_8px_rgba(255,255,255,0.4)] hover:text-[#00F5D4] hover:drop-shadow-[0_2px_12px_rgba(0,245,212,0.5)]'
                }`}
              >
                {item.label}
              </a>
              {item.active ? (
                <span className="absolute -bottom-1 left-0 h-[2px] w-full rounded-full bg-[#00F5D4] shadow-[0_0_10px_rgba(0,245,212,0.5)]" />
              ) : null}
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2 md:gap-3">
          <button
            type="button"
            onClick={toggleTheme}
            className={`rounded-full border px-3 py-2 text-xs font-semibold ${themeButtonClass}`}
          >
            {isDark ? 'Dark' : 'Slate'}
          </button>

          <Motion.a
            whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(0, 245, 212, 0.4)' }}
            whileTap={{ scale: 0.95 }}
            href="#contact"
            className={`hidden sm:block rounded-full border px-6 py-2.5 text-sm font-bold transition-all ${ctaClass}`}
          >
            {hireCtaText}
          </Motion.a>

          {/* Hamburger Menu - Mobile */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`xl:hidden rounded-lg border p-2 transition ${hamburgerClass}`}
          >
            <Motion.div
              animate={mobileMenuOpen ? 'open' : 'closed'}
              className="w-6 h-5 flex flex-col justify-between"
            >
              <Motion.span
                variants={{
                  closed: { rotate: 0, y: 0 },
                  open: { rotate: 45, y: 8 },
                }}
                className="w-full h-0.5 bg-white rounded"
              />
              <Motion.span
                variants={{
                  closed: { opacity: 1 },
                  open: { opacity: 0 },
                }}
                className="w-full h-0.5 bg-white rounded"
              />
              <Motion.span
                variants={{
                  closed: { rotate: 0, y: 0 },
                  open: { rotate: -45, y: -8 },
                }}
                className="w-full h-0.5 bg-white rounded"
              />
            </Motion.div>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <Motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`absolute inset-x-0 top-24 mx-4 rounded-[24px] border px-6 py-6 backdrop-blur-2xl shadow-2xl ${mobileShellClass}`}
          >
            <ul className="flex flex-col gap-3">
              {links.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block px-4 py-3 rounded-xl text-base font-medium transition-colors ${
                      item.active ? 'bg-[#00F5D4]/10 text-[#00F5D4]' : mobileLinkClass
                    }`}
                  >
                    {item.label}
                  </a>
                </li>
              ))}
              <Motion.a
                whileHover={{ y: -2 }}
                href="#contact"
                onClick={() => setMobileMenuOpen(false)}
                className={`mt-4 block text-center rounded-full border px-4 py-3 text-sm font-bold ${ctaClass}`}
              >
                {hireCtaText}
              </Motion.a>
            </ul>
          </Motion.div>
        )}
      </AnimatePresence>

    </header>
  )
}
