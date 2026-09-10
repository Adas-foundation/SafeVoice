import { useState } from 'react'
import { useLanguage } from '../i18n/useLanguage'

const Contact = () => {
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  })

  const [submitStatus, setSubmitStatus] = useState(/** @type {string | null} */ (null))
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Placeholder submit function - simulate API call
    setTimeout(() => {
      console.log('Form submitted:', formData)
      setSubmitStatus('success')
      setFormData({
        fullName: '',
        email: '',
        subject: 'General Inquiry',
        message: ''
      })

      // Reset success message after 3 seconds
      setTimeout(() => {
        setSubmitStatus(null)
      }, 3000)

      setIsSubmitting(false)
    }, 1500)
  }

  const districtOffices = [
    {
      id: 1,
      name: t('contact.officeLilongwe'),
      location: t('contact.officeLilongweLoc'),
      phone: '+265 1 789 322'
    },
    {
      id: 2,
      name: t('contact.officeBlantyre'),
      location: t('contact.officeBlantyreLoc'),
      phone: '+265 1 820 455'
    },
    {
      id: 3,
      name: t('contact.officeMzuzu'),
      location: t('contact.officeMzuzuLoc'),
      phone: '+265 1 311 099'
    },
    {
      id: 4,
      name: t('contact.officeZomba'),
      location: t('contact.officeZombaLoc'),
      phone: '+265 1 524 888'
    }
  ]

  return (
    <main className="w-full">
      {/* Hero Section */}
      <section className="relative py-20 px-4 md:px-10 bg-[#00236f] text-white overflow-hidden">
        <div className="max-w-[1280px] mx-auto relative z-10">
          <div className="max-w-2xl">
            <h1 className="text-[36px] leading-[44px] sm:text-[42px] sm:leading-[50px] lg:text-[48px] lg:leading-[56px] font-[700] mb-6 font-['Poppins']">
              {t('contact.heroTitle')}
            </h1>
            <p className="text-[18px] leading-[28px] text-white/80 mb-8 font-['Inter']">
              {t('contact.heroSubtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Immediate Help Section (Bento Style) */}
      <section className="px-4 md:px-10 -mt-16 relative z-20">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Helpline 1 - Child Helpline */}
          <div className="bg-white p-8 rounded-xl shadow-md border-l-4 border-l-[#ba1a1a] flex flex-col items-center text-center transition-transform hover:-translate-y-1">
            <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>call</span>
            </div>
            <h3 className="text-[20px] font-[500] text-[#00236f] mb-2 font-['Poppins']">{t('contact.childHelpline')}</h3>
            <p className="text-gray-600 mb-4 font-['Inter']">{t('contact.childHelplineText')}</p>
            <a 
              href="tel:116" 
              className="text-red-600 font-extrabold text-3xl hover:underline font-['Poppins']"
              aria-label="Call child helpline 116"
            >
              116
            </a>
          </div>

          {/* Helpline 2 - GBV Helpline */}
          <div className="bg-white p-8 rounded-xl shadow-md border-l-4 border-l-[#006a63] flex flex-col items-center text-center transition-transform hover:-translate-y-1">
            <div className="w-16 h-16 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>support_agent</span>
            </div>
            <h3 className="text-[20px] font-[500] text-[#00236f] mb-2 font-['Poppins']">{t('contact.gbvHelpline')}</h3>
            <p className="text-gray-600 mb-4 font-['Inter']">{t('contact.gbvHelplineText')}</p>
            <a 
              href="tel:555" 
              className="text-teal-700 font-extrabold text-3xl hover:underline font-['Poppins']"
              aria-label="Call GBV helpline 555"
            >
              555
            </a>
          </div>

          {/* Office Location */}
          <div className="bg-[#1e3a8a] p-8 rounded-xl shadow-md text-white flex flex-col items-center text-center transition-transform hover:-translate-y-1">
            <div className="w-16 h-16 bg-blue-700 text-white rounded-full flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-[32px]">location_on</span>
            </div>
            <h3 className="text-[20px] font-[500] mb-2 font-['Poppins']">{t('contact.hqLocationTitle')}</h3>
            <p className="text-white/80 mb-4 font-['Inter']">{t('contact.hqLocationText')}</p>
            <button 
              onClick={() => document.getElementById('map-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-white text-[#00236f] px-6 py-2 rounded-full font-semibold hover:bg-gray-100 transition-colors font-['Poppins']"
              aria-label="View map of headquarters location"
            >
              {t('contact.viewMap')}
            </button>
          </div>
        </div>
      </section>

      {/* Contact Form & Directory */}
      <section className="py-24 px-4 md:px-10">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Contact Form Column */}
          <div className="lg:col-span-7">
            <div className="bg-white p-10 rounded-xl shadow-sm border border-gray-300">
              <h2 className="text-[32px] leading-[40px] font-[600] text-[#00236f] mb-2 font-['Poppins']">
                {t('contact.formTitle')}
              </h2>
              <p className="text-gray-600 mb-8 font-['Inter']">
                {t('contact.formSubtitle')}
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name and Email Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="fullName" className="block text-[14px] font-[500] text-[#121c2a] font-['Inter']">
                      {t('contact.name')}
                    </label>
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="e.g. Kondwani Phiri"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#00236f] focus:border-[#00236f] transition-all font-['Inter']"
                      aria-label="Full name input"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-[14px] font-[500] text-[#121c2a] font-['Inter']">
                      {t('contact.emailLabel')}
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="k.phiri@example.mw"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#00236f] focus:border-[#00236f] transition-all font-['Inter']"
                      aria-label="Email address input"
                      required
                    />
                  </div>
                </div>

                {/* Subject Dropdown */}
                <div className="space-y-2">
                  <label htmlFor="subject" className="block text-[14px] font-[500] text-[#121c2a] font-['Inter']">
                    {t('contact.subject')}
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#00236f] focus:border-[#00236f] transition-all font-['Inter']"
                    aria-label="Inquiry subject dropdown"
                  >
                    <option value="General Inquiry">{t('contact.subjectGeneral')}</option>
                    <option value="Case Follow-up">{t('contact.subjectCase')}</option>
                    <option value="Technical Support">{t('contact.subjectTech')}</option>
                    <option value="Media/Press Inquiry">{t('contact.subjectMedia')}</option>
                    <option value="Report Feedback">{t('contact.subjectFeedback')}</option>
                  </select>
                </div>

                {/* Message Textarea */}
                <div className="space-y-2">
                  <label htmlFor="message" className="block text-[14px] font-[500] text-[#121c2a] font-['Inter']">
                    {t('contact.message')}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder={t('contact.messagePlaceholder')}
                    rows={5}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#00236f] focus:border-[#00236f] transition-all font-['Inter'] resize-none"
                    aria-label="Message textarea"
                    required
                  />
                </div>

                {/* Submit Button with Status */}
                <div className="space-y-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#00236f] text-white py-4 rounded-lg font-bold text-lg shadow-lg hover:opacity-90 active:scale-[0.98] transition-all flex justify-center items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed font-['Poppins']"
                    aria-label="Submit contact form"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="material-symbols-outlined animate-spin">sync</span>
                        {t('contact.sending')}
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined">send</span>
                        {t('contact.send')}
                      </>
                    )}
                  </button>

                  {/* Success Message */}
                  {submitStatus === 'success' && (
                    <div className="p-4 bg-teal-50 border border-teal-200 rounded-lg flex items-center gap-3">
                      <span className="material-symbols-outlined text-teal-700">check_circle</span>
                      <p className="text-teal-700 font-['Inter']">{t('contact.successMsg')}</p>
                    </div>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* District Directory Column */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-[#eff4ff] p-8 rounded-xl border border-gray-300">
              <h2 className="text-[20px] font-[500] text-[#00236f] mb-6 flex items-center gap-2 font-['Poppins']">
                <span className="material-symbols-outlined">map</span>
                {t('contact.officeTitle2')}
              </h2>
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                {districtOffices.map((office) => (
                  <div
                    key={office.id}
                    className="bg-white p-4 rounded-lg border border-gray-300 hover:border-[#00236f] transition-colors cursor-pointer group"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold text-[#00236f] font-['Poppins']">{office.name}</h4>
                        <p className="text-sm text-gray-600 font-['Inter']">{office.location}</p>
                      </div>
                      <span className="material-symbols-outlined text-[#00236f] opacity-0 group-hover:opacity-100 transition-opacity">
                        chevron_right
                      </span>
                    </div>
                    <div className="mt-3 flex items-center gap-2 text-sm text-teal-700 font-['Inter']">
                      <span className="material-symbols-outlined text-sm">phone</span>
                      <a href={`tel:${office.phone}`} className="hover:underline">
                        {office.phone}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>
  )
}

export default Contact
