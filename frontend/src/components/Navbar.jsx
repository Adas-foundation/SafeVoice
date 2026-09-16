import { Link, useLocation } from 'react-router-dom'
import { useLanguage } from '../i18n/useLanguage'

const Navbar = () => {
  const location = useLocation()
  const { t } = useLanguage()

  const isActive = (path) => location.pathname === path

  return (
    <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="flex justify-between items-center px-4 md:px-8 py-3 w-full max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <img 
            alt="Malawi Government Crest" 
            className="h-10 w-auto" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDki8aAv-XLN2kUR3bF2q1pl191097fA7sC47WWQvMbrZFTdO4PucHRqySrq9LmD1dD70RZj8wrxVadguQsfclg2S_Bz5t-FyDVyVsRsD8GCegtzLLPE3jgu7nMSAl_OpodhGt7qikGuZoii-vEBFn6nOPne2XkeZwmPFy59hyvmf1Du9gbOfwGkJud5gRNfYE5mBm0sIuOKgq7NpdOIBza6mbrGK-BnKFcryNzh8iuDGcJek5vH3pUZU5kIwMMztjBhJ1xgq7Zkg"
          />
          <div className="hidden md:block">
            <span className="text-lg font-semibold text-[#00236f] block leading-tight font-['Poppins']">Adas Foundation</span>
            <span className="text-xs text-gray-600 tracking-wider font-['Inter']">SafeReport Malawi</span>
          </div>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <Link
            to="/"
            className={`${isActive('/') ? 'text-[#00236f] border-b-2 border-[#00236f] pb-1' : 'text-gray-600'} font-medium hover:text-[#00236f] transition-colors text-sm`}
          >
            {t('nav.home')}
          </Link>
          <Link
            to="/report"
            className={`${isActive('/report') ? 'text-[#00236f] border-b-2 border-[#00236f] pb-1' : 'text-gray-600'} font-medium hover:text-[#00236f] transition-colors text-sm`}
          >
            {t('nav.report')}
          </Link>
          <Link
            to="/track"
            className={`${isActive('/track') ? 'text-[#00236f] border-b-2 border-[#00236f] pb-1' : 'text-gray-600'} font-medium hover:text-[#00236f] transition-colors text-sm`}
          >
            {t('nav.track')}
          </Link>
          <Link
            to="/resources"
            className={`${isActive('/resources') ? 'text-[#00236f] border-b-2 border-[#00236f] pb-1' : 'text-gray-600'} font-medium hover:text-[#00236f] transition-colors text-sm`}
          >
            {t('nav.resources')}
          </Link>
          <Link
            to="/about"
            className={`${isActive('/about') ? 'text-[#00236f] border-b-2 border-[#00236f] pb-1' : 'text-gray-600'} font-medium hover:text-[#00236f] transition-colors text-sm`}
          >
            {t('nav.about')}
          </Link>
          <Link
            to="/contact"
            className={`${isActive('/contact') ? 'text-[#00236f] border-b-2 border-[#00236f] pb-1' : 'text-gray-600'} font-medium hover:text-[#00236f] transition-colors text-sm`}
          >
            {t('nav.contact')}
          </Link>
          <Link
            to="/login"
            className={`${isActive('/login') ? 'text-[#00236f] border-b-2 border-[#00236f] pb-1' : 'text-gray-600'} font-medium hover:text-[#00236f] transition-colors text-sm`}
          >
            {t('nav.login')}
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link 
            to="/emergency"
            className="bg-[#ba1a1a] text-white px-4 py-1.5 rounded-full font-bold shadow-md hover:opacity-90 active:scale-95 transition-all flex items-center gap-2 text-sm"
          >
            <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>emergency</span>
            {t('nav.sos')}
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Navbar
