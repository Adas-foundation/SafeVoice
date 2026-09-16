import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getReportsStats } from '../services/reportsApi'
import LanguageSwitcher from '../components/LanguageSwitcher'
import { useLanguage } from '../i18n/useLanguage'

const formatCompact = (n) => {
  if (n == null) return '—'
  return new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 }).format(n)
}

const Home = () => {
  const [stats, setStats] = useState(/** @type {any} */ (null))
  const { t } = useLanguage()

  useEffect(() => {
    let active = true
    getReportsStats()
      .then((data) => { if (active) setStats(data) })
      .catch((err) => console.error('Failed to load public stats', err))
    return () => { active = false }
  }, [])

  return (
    <main>
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24 md:pt-24 md:pb-32" style={{ background: 'radial-gradient(circle at top right, #e6eeff 0%, #f8f9ff 100%)' }}>
        <div className="max-w-[1280px] mx-auto px-4 md:px-10 grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-7 space-y-8">
            {/* Language switcher — the single place to pick English / Chichewa */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1e3a8a] text-white text-[14px] font-['Inter']">
                <span className="material-symbols-outlined text-[18px]">verified_user</span>
                {t('home.official')}
              </div>
              <LanguageSwitcher />
            </div>
            <h1 className="text-[30px] leading-[38px] sm:text-[38px] sm:leading-[46px] lg:text-[48px] lg:leading-[56px] font-[700] text-[#00236f] font-['Poppins']">
              {t('home.heroTitle')}<span className="text-[#006a63]">{t('home.heroTitleAccent')}</span>
            </h1>
            <p className="text-[18px] leading-[28px] text-gray-600 max-w-2xl font-['Inter']">
              {t('home.heroSubtitle')}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link 
                to="/report"
                className="bg-[#00236f] text-white px-8 py-4 rounded-xl text-[20px] font-[500] shadow-lg hover:opacity-90 active:scale-95 transition-all flex items-center gap-3 font-['Poppins']"
              >
                <span className="material-symbols-outlined">campaign</span>
                {t('home.reportIncident')}
              </Link>
              <Link 
                to="/track"
                className="bg-[#d9e3f6] text-[#00236f] px-8 py-4 rounded-xl text-[20px] font-[500] border border-gray-300 hover:opacity-90 active:scale-95 transition-all flex items-center gap-3 font-['Poppins']"
              >
                <span className="material-symbols-outlined">search</span>
                {t('home.trackReport')}
              </Link>
            </div>
          </div>
          <div className="md:col-span-5 relative">
            <div className="rounded-3xl overflow-hidden shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500">
              <img 
                className="w-full aspect-[4/5] object-cover" 
                alt="A professional and warm illustration of a diverse group of Malawian citizens engaging with a kind social worker" 
                src="womanreport.png"
              />
            </div>
            {/* Floating Stat Card */}
            <div className="absolute -bottom-6 -left-12 bg-white/80 backdrop-blur-sm border border-white/50 p-6 rounded-2xl shadow-xl hidden lg:block">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[#99efe5] rounded-full">
                  <span className="material-symbols-outlined text-[#006f67]">done_all</span>
                </div>
                <div>
                  <p className="text-[12px] text-gray-600 uppercase tracking-tighter font-['Inter']">{t('home.resolutionRate')}</p>
                  <p className="text-[24px] font-[600] text-[#00236f] font-['Poppins']">{stats ? `${stats.resolutionRate}%` : '—'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 -mt-12 relative z-10">
        <div className="max-w-[1280px] mx-auto px-4 md:px-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white border border-gray-300 p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <span className="material-symbols-outlined text-[#00236f] text-4xl mb-4">analytics</span>
              <p className="text-[30px] leading-none sm:text-[38px] lg:text-[48px] font-[700] text-[#00236f] font-['Poppins']">{formatCompact(stats?.totalCases)}</p>
              <p className="text-[14px] text-gray-600 uppercase font-['Inter']">{t('home.casesReported')}</p>
            </div>
            <div className="bg-white border border-gray-300 p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <span className="material-symbols-outlined text-[#006a63] text-4xl mb-4">check_circle</span>
              <p className="text-[30px] leading-none sm:text-[38px] lg:text-[48px] font-[700] text-[#00236f] font-['Poppins']">{formatCompact(stats?.resolved)}</p>
              <p className="text-[14px] text-gray-600 uppercase font-['Inter']">{t('home.casesResolved')}</p>
            </div>
            <div className="bg-white border border-gray-300 p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <span className="material-symbols-outlined text-[#f6be39] text-4xl mb-4">location_on</span>
              <p className="text-[30px] leading-none sm:text-[38px] lg:text-[48px] font-[700] text-[#00236f] font-['Poppins']">{formatCompact(stats?.districtCount)}</p>
              <p className="text-[14px] text-gray-600 uppercase font-['Inter']">{t('home.districtOffices')}</p>
            </div>
            <div className="bg-white border border-gray-300 p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
              <span className="material-symbols-outlined text-[#ba1a1a] text-4xl mb-4">electric_bolt</span>
              <p className="text-[30px] leading-none sm:text-[38px] lg:text-[48px] font-[700] text-[#00236f] font-['Poppins']">24/7</p>
              <p className="text-[14px] text-gray-600 uppercase font-['Inter']">{t('home.emergencyResponse')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-[#eff4ff]">
        <div className="max-w-[1280px] mx-auto px-4 md:px-10">
          <div className="text-center mb-16">
            <h2 className="text-[32px] leading-[40px] font-[600] text-[#00236f] mb-4 font-['Poppins']">{t('home.howTitle')}</h2>
            <p className="text-gray-600 max-w-xl mx-auto font-['Inter']">{t('home.howSubtitle')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-6 relative">
            {/* Connector line for desktop */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-300 -z-10 translate-y-[-10px]"></div>
            <div className="bg-white p-8 rounded-2xl border border-gray-300 text-center space-y-4">
              <div className="w-12 h-12 bg-[#00236f] text-white rounded-full flex items-center justify-center font-bold mx-auto">1</div>
              <h3 className="text-[20px] font-[500] text-[#00236f] font-['Poppins']">{t('home.step1Title')}</h3>
              <p className="text-gray-600 text-[16px] font-['Inter']">{t('home.step1Text')}</p>
            </div>
            <div className="bg-white p-8 rounded-2xl border border-gray-300 text-center space-y-4">
              <div className="w-12 h-12 bg-[#00236f] text-white rounded-full flex items-center justify-center font-bold mx-auto">2</div>
              <h3 className="text-[20px] font-[500] text-[#00236f] font-['Poppins']">{t('home.step2Title')}</h3>
              <p className="text-gray-600 text-[16px] font-['Inter']">{t('home.step2Text')}</p>
            </div>
            <div className="bg-white p-8 rounded-2xl border border-gray-300 text-center space-y-4">
              <div className="w-12 h-12 bg-[#00236f] text-white rounded-full flex items-center justify-center font-bold mx-auto">3</div>
              <h3 className="text-[20px] font-[500] text-[#00236f] font-['Poppins']">{t('home.step3Title')}</h3>
              <p className="text-gray-600 text-[16px] font-['Inter']">{t('home.step3Text')}</p>
            </div>
            <div className="bg-white p-8 rounded-2xl border border-gray-300 text-center space-y-4">
              <div className="w-12 h-12 bg-[#00236f] text-white rounded-full flex items-center justify-center font-bold mx-auto">4</div>
              <h3 className="text-[20px] font-[500] text-[#00236f] font-['Poppins']">{t('home.step4Title')}</h3>
              <p className="text-gray-600 text-[16px] font-['Inter']">{t('home.step4Text')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Bento Grid */}
      <section className="py-24">
        <div className="max-w-[1280px] mx-auto px-4 md:px-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-[32px] leading-[40px] font-[600] text-[#00236f] mb-4 font-['Poppins']">{t('home.servicesTitle')}</h2>
              <p className="text-gray-600 font-['Inter']">{t('home.servicesSubtitle')}</p>
            </div>
            <Link to="/resources" className="text-[#00236f] font-bold flex items-center gap-2 hover:underline">
              {t('home.viewAll')}
              <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[200px]">
            {/* Anonymous Reporting */}
            <div className="md:col-span-4 md:row-span-2 bg-[#1e3a8a] text-white p-8 rounded-3xl flex flex-col justify-between shadow-lg">
              <span className="material-symbols-outlined text-5xl">person_off</span>
              <div>
                <h3 className="text-[24px] font-[600] mb-2 font-['Poppins']">{t('home.anonymousTitle')}</h3>
                <p className="opacity-90 text-[16px] font-['Inter']">{t('home.anonymousText')}</p>
              </div>
            </div>
            {/* Emergency SOS */}
            <div className="md:col-span-4 md:row-span-1 bg-[#ffdad6] text-[#93000a] p-6 rounded-3xl flex items-center gap-6">
              <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>emergency_share</span>
              <div>
                <h4 className="text-[20px] font-[500] font-bold">{t('home.sosTitle')}</h4>
                <p className="text-sm opacity-80">{t('home.sosText')}</p>
              </div>
            </div>
            {/* Case Tracking */}
            <div className="md:col-span-4 md:row-span-2 bg-white border border-gray-300 p-8 rounded-3xl flex flex-col justify-between shadow-sm">
              <span className="material-symbols-outlined text-[#006a63] text-5xl">my_location</span>
              <div>
                <h3 className="text-[24px] font-[600] text-[#00236f] mb-2 font-['Poppins']">{t('home.trackingTitle')}</h3>
                <p className="text-gray-600 font-['Inter']">{t('home.trackingText')}</p>
              </div>
            </div>
            {/* Legal Support */}
            <div className="md:col-span-4 md:row-span-1 bg-[#99efe5] text-[#006f67] p-6 rounded-3xl flex items-center gap-6">
              <span className="material-symbols-outlined text-4xl">gavel</span>
              <div>
                <h4 className="text-[20px] font-[500] font-bold">{t('home.legalTitle')}</h4>
                <p className="text-sm opacity-80">{t('home.legalText')}</p>
              </div>
            </div>
            {/* Child Protection */}
            <div className="md:col-span-3 md:row-span-1 bg-[#533c00] text-[#261a00] p-6 rounded-3xl flex flex-col justify-center gap-2">
              <span className="material-symbols-outlined">child_care</span>
              <h4 className="text-[20px] font-[500] font-bold leading-tight">{t('home.childTitle')}</h4>
            </div>
            {/* Counselling */}
            <div className="md:col-span-3 md:row-span-1 bg-white border border-gray-300 p-6 rounded-3xl flex flex-col justify-center gap-2">
              <span className="material-symbols-outlined text-[#00236f]">psychology</span>
              <h4 className="text-[20px] font-[500] font-bold leading-tight text-[#00236f]">{t('home.psychTitle')}</h4>
            </div>
            {/* Emergency Shelter */}
            <div className="md:col-span-6 md:row-span-1 bg-[#dee9fc] p-6 rounded-3xl flex flex-col sm:flex-row sm:items-center gap-4 justify-between">
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-[#00236f]">holiday_village</span>
                <h4 className="text-[20px] font-[500] font-bold text-[#00236f]">{t('home.shelterTitle')}</h4>
              </div>
              <Link to="/emergency" className="bg-[#00236f] text-white px-4 py-2 rounded-xl text-sm font-bold">{t('home.findLocation')}</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24">
        <div className="max-w-[1280px] mx-auto px-4 md:px-10">
          <div className="bg-[#00236f] rounded-[3rem] p-12 md:p-24 relative overflow-hidden text-center text-white shadow-2xl">
            {/* Background texture/pattern simulation */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
            <div className="relative z-10 space-y-8 max-w-3xl mx-auto">
              <h2 className="text-[32px] leading-[40px] sm:text-[40px] sm:leading-[48px] lg:text-[48px] lg:leading-[56px] font-[700] font-['Poppins']">{t('home.ctaTitle')}<br/>{t('home.ctaTitle2')}</h2>
              <p className="text-[18px] leading-[28px] opacity-80 font-['Inter']">{t('home.ctaText')}</p>
              <div className="flex flex-wrap justify-center gap-6 pt-4">
                <Link 
                  to="/report"
                  className="bg-white text-[#00236f] px-10 py-5 rounded-2xl text-[20px] font-[500] shadow-xl hover:opacity-90 active:scale-95 transition-all font-['Poppins']"
                >
                  {t('home.ctaButton')}
                </Link>
                <a href="tel:116" className="border-2 border-white/30 text-white px-10 py-5 rounded-2xl text-[20px] font-[500] hover:bg-white/10 active:scale-95 transition-all font-['Poppins'] inline-flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined">call</span>
                  {t('home.ctaHelpline')}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Home