import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../i18n/useLanguage'

const About = () => {
  const { t } = useLanguage()
  const partnersRef = useRef(/** @type {HTMLDivElement | null} */ (null))

  const scrollPartners = (dir) => {
    const el = partnersRef.current
    if (el) el.scrollBy({ left: dir * (el.clientWidth * 0.85), behavior: 'smooth' })
  }

  return (
    <main className="w-full">
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden">
        <div className="max-w-[1280px] mx-auto px-4 md:px-10">
          <div className="flex flex-col md:flex-row items-center gap-16">
            <div className="flex-1">
              <span className="text-[#006a63] font-bold tracking-widest uppercase text-[12px] mb-4 block font-['Inter']">{t('about.official')}</span>
              <h2 className="text-[34px] leading-[42px] sm:text-[40px] sm:leading-[48px] lg:text-[48px] lg:leading-[56px] font-[700] text-[#00236f] mb-6 font-['Poppins']">{t('about.heroTitle')}</h2>
              <p className="text-[18px] leading-[28px] text-gray-600 mb-8 max-w-2xl font-['Inter']">{t('about.heroSubtitle')}</p>
              <div className="flex flex-wrap gap-4">
                <Link to="/report" className="bg-[#00236f] text-white px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all font-['Poppins']">{t('about.reportCase')}</Link>
                <a href="https://www.youtube.com" target="_blank" rel="noopener noreferrer" className="border-2 border-[#006a63] text-[#006a63] px-8 py-4 rounded-xl font-semibold hover:bg-[#006a63]/5 transition-all font-['Poppins'] inline-flex items-center gap-2">
                  <span className="material-symbols-outlined">play_circle</span>
                  {t('about.watchIntro')}
                </a>
              </div>
            </div>
            <div className="flex-1 w-full relative">
              <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl relative">
                <img 
                  className="w-full h-full object-cover" 
                  alt="A professional Malawian female official in formal attire sitting in a modern office" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBg658S58QqyQpUkknbOaKTiz_sX10FEdbd353mTYM0uY6TOfxc3PzzmTieJhXdaJRSnVd8TdN-lR3SBzUZgPWA1bI6DY-WpZ4BlJFy2vf6g25ddiMt31KzvuOfh_812Zb3mbHRpod_vnI5ulelo0nHBpRsPr4GYs32FgfDtae77TQu70q5CxQS-2fq5Qaej_MKVGu5J3CapBb3hW4wQ4YSZB6zi9HJxIyLzj5ZsQd3UQAIhvovB2rfP_37BV6JaNF8aHQEb_dn0A"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#00236f]/60 to-transparent"></div>
                <div className="absolute bottom-8 left-8 right-8 text-white">
                  <p className="text-[20px] font-[500] mb-2 font-['Poppins']">{t('about.imagineCaption')}</p>
                  <p className="text-[16px] opacity-90 font-['Inter']">{t('about.imagineText')}</p>
                </div>
              </div>
              {/* Floating Badge */}
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl border border-gray-300 flex items-center gap-4 max-w-xs">
                <div className="bg-[#99efe5] p-3 rounded-full">
                  <span className="material-symbols-outlined text-[#006f67]" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
                </div>
                <div>
                  <p className="font-bold text-[#00236f]">{t('about.secureEncryption')}</p>
                  <p className="text-[12px] text-gray-600 font-['Inter']">{t('about.secureText')}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Purpose Section (Bento Grid) */}
      <section className="py-24 bg-[#eff4ff]">
        <div className="max-w-[1280px] mx-auto px-4 md:px-10">
          <div className="text-center mb-16">
            <h3 className="text-[32px] leading-[40px] font-[600] text-[#00236f] mb-4 font-['Poppins']">{t('about.mandateTitle')}</h3>
            <div className="w-24 h-1 bg-[#006a63] mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Mission Card */}
            <div className="col-span-12 md:col-span-8 bg-white p-10 rounded-[32px] shadow-sm border border-gray-300 flex flex-col justify-center">
              <span className="material-symbols-outlined text-[#00236f] text-5xl mb-6" style={{ fontVariationSettings: "'FILL' 1" }}>account_balance</span>
              <h4 className="text-[24px] font-[600] text-[#00236f] mb-4 font-['Poppins']">{t('about.missionTitle')}</h4>
              <p className="text-[18px] leading-[28px] text-gray-600 font-['Inter'] leading-relaxed">
                {t('about.missionText')}
              </p>
            </div>
            {/* Purpose Card */}
            <div className="col-span-12 md:col-span-4 bg-[#00236f] text-white p-10 rounded-[32px] shadow-lg flex flex-col justify-between">
              <h4 className="text-[24px] font-[600] mb-4 font-['Poppins']">{t('about.digitalPurpose')}</h4>
              <p className="text-[16px] opacity-80 mb-6 font-['Inter']">
                {t('about.digitalText')}
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#b6c4ff]">check_circle</span>
                  <span className="text-[14px] font-['Inter']">{t('about.alertRouting')}</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[#b6c4ff]">check_circle</span>
                  <span className="text-[14px] font-['Inter']">{t('about.caseTracking')}</span>
                </li>
              </ul>
            </div>
            {/* Tech Feature 1 */}
            <div className="col-span-12 md:col-span-4 bg-white/80 backdrop-blur-sm p-8 rounded-[32px] border border-gray-300">
              <div className="bg-[#533c00] w-12 h-12 rounded-2xl flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-[#261a00]">security</span>
              </div>
              <h5 className="text-[20px] font-[500] text-[#00236f] mb-2 font-['Poppins']">{t('about.protectionFirst')}</h5>
              <p className="text-gray-600 text-[16px] font-['Inter']">{t('about.protectionText')}</p>
            </div>
            {/* Tech Feature 2 */}
            <div className="col-span-12 md:col-span-4 bg-white/80 backdrop-blur-sm p-8 rounded-[32px] border border-gray-300">
              <div className="bg-[#99efe5] w-12 h-12 rounded-2xl flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-[#006f67]">folder_shared</span>
              </div>
              <h5 className="text-[20px] font-[500] text-[#00236f] mb-2 font-['Poppins']">{t('about.caseMgmt')}</h5>
              <p className="text-gray-600 text-[16px] font-['Inter']">{t('about.caseMgmtText')}</p>
            </div>
            {/* Tech Feature 3 */}
            <div className="col-span-12 md:col-span-4 bg-white/80 backdrop-blur-sm p-8 rounded-[32px] border border-gray-300">
              <div className="bg-[#1e3a8a] w-12 h-12 rounded-2xl flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-[#90a8ff]">insights</span>
              </div>
              <h5 className="text-[20px] font-[500] text-[#00236f] mb-2 font-['Poppins']">{t('about.analytics')}</h5>
              <p className="text-gray-600 text-[16px] font-['Inter']">{t('about.analyticsText')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Statistics Section */}
      <section className="py-24 relative">
        <div className="max-w-[1280px] mx-auto px-4 md:px-10">
          <div className="bg-[#1e3a8a] rounded-[48px] p-12 md:p-20 text-[#90a8ff] overflow-hidden relative">
            <div className="absolute top-0 right-0 w-1/3 h-full opacity-10 pointer-events-none">
              <img 
                className="w-full h-full object-cover" 
                alt="Traditional Malawian textile pattern" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBIwqCdejBBfql0Eskx6pH6NHPLNbQDvK74igxicg0wh2QyG1iRKSJnWV-24Net1IxZiKN2-1HJSbpgzYeMZInF4rn59Bv66MB9J5_EyCtf_Cs8n9HTUxI8YZI3QuVfO7yXr0Ud8bi32irnNg7cfL7DktALa0PZckbGWzTp0gfCzisnOTHjf6_V_LqP7REYufQ37EQYmlNQ6vI8AAcNbQ9PM7dzIjVNn0EnZmHyE8wW7VkUadzlfZsRdDsNQSz-qOI_KADxwgcZ8w"
              />
            </div>
            <div className="relative z-10">
              <h3 className="text-[32px] leading-[40px] mb-12 font-['Poppins']">{t('about.impactTitle')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                <div className="text-center md:text-left">
                  <p className="text-5xl font-bold mb-2">12k+</p>
                  <p className="text-[14px] uppercase tracking-widest opacity-70 font-['Inter']">{t('about.reportsResolved')}</p>
                  <div className="mt-4 h-1 w-full bg-[#90a8ff]/20 rounded-full overflow-hidden">
                    <div className="bg-[#b6c4ff] h-full w-[85%]"></div>
                  </div>
                </div>
                <div className="text-center md:text-left">
                  <p className="text-5xl font-bold mb-2">24h</p>
                  <p className="text-[14px] uppercase tracking-widest opacity-70 font-['Inter']">{t('about.avgResponse')}</p>
                  <div className="mt-4 h-1 w-full bg-[#90a8ff]/20 rounded-full overflow-hidden">
                    <div className="bg-[#b6c4ff] h-full w-[95%]"></div>
                  </div>
                </div>
                <div className="text-center md:text-left">
                  <p className="text-5xl font-bold mb-2">28</p>
                  <p className="text-[14px] uppercase tracking-widest opacity-70 font-['Inter']">{t('about.districtsCovered')}</p>
                  <div className="mt-4 h-1 w-full bg-[#90a8ff]/20 rounded-full overflow-hidden">
                    <div className="bg-[#b6c4ff] h-full w-full"></div>
                  </div>
                </div>
                <div className="text-center md:text-left">
                  <p className="text-5xl font-bold mb-2">100%</p>
                  <p className="text-[14px] uppercase tracking-widest opacity-70 font-['Inter']">{t('about.confidentiality')}</p>
                  <div className="mt-4 h-1 w-full bg-[#90a8ff]/20 rounded-full overflow-hidden">
                    <div className="bg-[#b6c4ff] h-full w-full"></div>
                  </div>
                </div>
              </div>
              <div className="mt-16 pt-12 border-t border-[#90a8ff]/10 flex flex-col md:flex-row gap-8 items-center justify-between">
                <p className="text-[18px] italic max-w-xl font-['Inter']">{t('about.quoteText')}</p>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full border-2 border-[#b6c4ff] overflow-hidden">
                    <img 
                      className="w-full h-full object-cover" 
                      alt="Hon. Minister Jean Sendeza" 
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuDCTAKBssRPxwn31BPGWaNA50osF2Rvl5xCVVNZMevM77Mi5RTTzxTgW67QZfsA1JG4sE564mPhIfkusGvH5QWJCzVZ1R78f3jfkYmklUt2ijc-JhWOIm4XkBoRUugFWzDBS_NrmxaDBXqFaOFpVfALihVybZpBnC4V90R5X2EwNgS9-xjRVLIDR_6Y-U_GCaSsFqZzKA-4ovvYik2KysGm5Uowoh5ZmoI40cgBXmVugHu8tEa2rp8TFvvGXbN4tGyLp_DtYYzN3Q"
                    />
                  </div>
                  <div>
                    <p className="font-bold">{t('about.ministerName')}</p>
                    <p className="text-[12px] opacity-70 font-['Inter']">{t('about.ministerRole')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Partners & Stakeholders Section */}
      <section className="py-24">
        <div className="max-w-[1280px] mx-auto px-4 md:px-10">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <h3 className="text-[32px] leading-[40px] text-[#00236f] mb-4 font-['Poppins']">{t('about.partnersTitle')}</h3>
              <p className="text-[18px] text-gray-600 font-['Inter']">{t('about.partnersText')}</p>
            </div>
            <div className="flex gap-2">
              <button className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors" onClick={() => scrollPartners(-1)} aria-label="Scroll partners left">
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button className="w-12 h-12 rounded-full bg-[#00236f] text-white flex items-center justify-center hover:opacity-90 transition-all" onClick={() => scrollPartners(1)} aria-label="Scroll partners right">
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>
          <div ref={partnersRef} className="grid grid-cols-1 md:grid-cols-3 gap-8 overflow-x-auto snap-x snap-mandatory">
            {/* Malawi Police Service */}
            <div className="bg-white p-8 rounded-3xl border border-gray-300 hover:shadow-lg transition-shadow">
              <div className="mb-6 flex items-center justify-between">
                <div className="w-16 h-16 bg-[#eff4ff] flex items-center justify-center rounded-2xl">
                  <span className="material-symbols-outlined text-[#00236f] text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>local_police</span>
                </div>
                <span className="bg-[#006a63]/10 text-[#006a63] px-3 py-1 rounded-full text-[12px]">{t('about.primaryPartner')}</span>
              </div>
              <h4 className="text-[20px] font-[500] text-[#00236f] mb-3 font-['Poppins']">{t('about.policeTitle')}</h4>
              <p className="text-[16px] text-gray-600 mb-6 font-['Inter']">{t('about.policeText')}</p>
              <a className="text-[#00236f] font-bold inline-flex items-center gap-2 hover:underline font-['Inter']" href="https://www.police.gov.mw" target="_blank" rel="noopener noreferrer">
                {t('about.viewProtocol')} <span className="material-symbols-outlined">arrow_forward</span>
              </a>
            </div>
            {/* Adas Foundation Health Team */}
            <div className="bg-white p-8 rounded-3xl border border-gray-300 hover:shadow-lg transition-shadow">
              <div className="mb-6 flex items-center justify-between">
                <div className="w-16 h-16 bg-[#eff4ff] flex items-center justify-center rounded-2xl">
                  <span className="material-symbols-outlined text-[#00236f] text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>health_and_safety</span>
                </div>
                <span className="bg-[#006a63]/10 text-[#006a63] px-3 py-1 rounded-full text-[12px]">{t('about.healthLiaison')}</span>
              </div>
              <h4 className="text-[20px] font-[500] text-[#00236f] mb-3 font-['Poppins']">{t('about.healthTitle')}</h4>
              <p className="text-[16px] text-gray-600 mb-6 font-['Inter']">{t('about.healthText')}</p>
              <a className="text-[#00236f] font-bold inline-flex items-center gap-2 hover:underline font-['Inter']" href="https://www.health.gov.mw" target="_blank" rel="noopener noreferrer">
                {t('about.serviceDir')} <span className="material-symbols-outlined">arrow_forward</span>
              </a>
            </div>
            {/* Legal Aid Bureau */}
            <div className="bg-white p-8 rounded-3xl border border-gray-300 hover:shadow-lg transition-shadow">
              <div className="mb-6 flex items-center justify-between">
                <div className="w-16 h-16 bg-[#eff4ff] flex items-center justify-center rounded-2xl">
                  <span className="material-symbols-outlined text-[#00236f] text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>gavel</span>
                </div>
                <span className="bg-[#006a63]/10 text-[#006a63] px-3 py-1 rounded-full text-[12px]">{t('about.legalSupport')}</span>
              </div>
              <h4 className="text-[20px] font-[500] text-[#00236f] mb-3 font-['Poppins']">{t('about.legalTitle')}</h4>
              <p className="text-[16px] text-gray-600 mb-6 font-['Inter']">{t('about.legalText')}</p>
              <a className="text-[#00236f] font-bold inline-flex items-center gap-2 hover:underline font-['Inter']" href="https://www.judiciary.mw" target="_blank" rel="noopener noreferrer">
                {t('about.getCounsel')} <span className="material-symbols-outlined">arrow_forward</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-[#00236f] overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,#00236f_0%,rgba(15,118,110,0.3)_100%)] opacity-50"></div>
        <div className="max-w-[1280px] mx-auto px-4 md:px-10 text-center relative z-10">
          <h3 className="text-[32px] leading-[40px] sm:text-[40px] sm:leading-[48px] lg:text-[48px] lg:leading-[56px] text-white mb-8 max-w-3xl mx-auto font-['Poppins']">{t('about.ctaTitle')}</h3>
          <p className="text-[18px] text-white/80 mb-12 max-w-2xl mx-auto font-['Inter']">{t('about.ctaText')}</p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link to="/report" className="bg-[#006a63] text-white px-10 py-5 rounded-2xl font-bold text-lg shadow-xl hover:scale-105 transition-transform font-['Poppins']">{t('about.getStarted')}</Link>
            <Link to="/resources" className="bg-transparent border-2 border-white text-white px-10 py-5 rounded-2xl font-bold text-lg hover:bg-white/10 transition-colors font-['Poppins']">{t('about.downloadForm')}</Link>
          </div>
        </div>
      </section>
    </main>
  )
}

export default About