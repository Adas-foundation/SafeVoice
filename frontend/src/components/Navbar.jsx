import { useState, useEffect, useCallback, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useLanguage } from '../i18n/useLanguage'

const navLinks = [
  { to: '/', key: 'nav.home' },
  { to: '/report', key: 'nav.report' },
  { to: '/track', key: 'nav.track' },
  { to: '/about', key: 'nav.about' },
  { to: '/contact', key: 'nav.contact' },
  { to: '/login', key: 'nav.login' },
]

const Navbar = () => {
  const location = useLocation()
  const { t } = useLanguage()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef(null)

  const isActive = (path) => location.pathname === path

  const closeMenu = useCallback(() => setMenuOpen(false), [])

  useEffect(() => {
    closeMenu()
  }, [location.pathname, closeMenu])

  useEffect(() => {
    if (!menuOpen) return
    const handleEscape = (e) => {
      if (e.key === 'Escape') closeMenu()
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [menuOpen, closeMenu])

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const handleBackdropClick = (e) => {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      closeMenu()
    }
  }

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="relative z-50 flex justify-between items-center px-4 md:px-8 py-3 w-full max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <img
            alt="SafeReport Malawi"
            className="h-14 w-14 object-contain"
            src="/logo.png"
          />
        </div>
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map(({ to, key }) => (
            <Link
              key={to}
              to={to}
              className={`${isActive(to) ? 'text-[#00236f] border-b-2 border-[#00236f] pb-1' : 'text-gray-600'} font-medium hover:text-[#00236f] transition-colors text-sm`}
            >
              {t(key)}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <Link
            to="/emergency"
            className="bg-[#ba1a1a] text-white px-4 py-1.5 rounded-full font-bold shadow-md hover:opacity-90 active:scale-95 transition-all flex items-center gap-2 text-sm"
          >
            <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>emergency</span>
            {t('nav.sos')}
          </Link>
          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-[#00236f] focus:ring-offset-2 transition-colors"
            aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
          >
            <span className="material-symbols-outlined text-[28px] text-gray-700">
              {menuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      <div
        className={`fixed inset-0 bg-black/30 z-40 md:hidden transition-opacity duration-300 ease-in-out ${
          menuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={handleBackdropClick}
        aria-hidden="true"
      />

      <nav
        id="mobile-nav"
        ref={menuRef}
        aria-label="Mobile navigation"
        className={`md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg z-40 transition-all duration-300 ease-in-out ${
          menuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex flex-col px-4 py-4 gap-1">
          {navLinks.map(({ to, key }) => (
            <Link
              key={to}
              to={to}
              onClick={closeMenu}
              className={`${
                isActive(to)
                  ? 'text-[#00236f] bg-blue-50 font-semibold'
                  : 'text-gray-700 hover:bg-gray-50'
              } px-4 py-3 rounded-xl font-medium transition-colors text-sm`}
            >
              {t(key)}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  )
}

export default Navbar
