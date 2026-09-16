import { useState } from 'react'
import { createSosAlert } from '../services/sosApi'
import { useLanguage } from '../i18n/useLanguage'

const Emergency = () => {
  const { t } = useLanguage()
  const [sosActive, setSosActive] = useState(false)
  const [pressTimer, setPressTimer] = useState(/** @type {ReturnType<typeof setTimeout> | null} */ (null))
  const [sendingSilent, setSendingSilent] = useState(false)
  const [sendingSos, setSendingSos] = useState(false)
  const [sosError, setSosError] = useState('')
  const [sosMessage, setSosMessage] = useState('')

  // Local emergency contacts; each is either a tel: or sms: target.
  const [contacts, setContacts] = useState([
    { id: 1, name: 'Mary Kalua', phone: '+265 888 123 456' },
  ])

  const addContact = () => {
    const name = window.prompt(t('emergency.contactNamePrompt'))
    const phone = window.prompt(t('emergency.contactPhonePrompt'))
    if (name && phone) {
      setContacts((prev) => [...prev, { id: Date.now(), name, phone }])
    } else {
      window.alert(t('emergency.contactInvalid'))
    }
  }

  const removeContact = (id) => {
    setContacts((prev) => prev.filter((c) => c.id !== id))
  }

  const getCurrentPosition = () => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) {
        resolve(null)
        return
      }
      navigator.geolocation.getCurrentPosition(
        (position) => resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        }),
        () => resolve(null),
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      )
    })
  }

  const sendSosAlert = async (source) => {
    const coords = await getCurrentPosition()
    const storedUser = JSON.parse(localStorage.getItem('safereport_user') || 'null')
    return createSosAlert({
      ...(coords || {}),
      timestamp: new Date().toISOString(),
      userId: storedUser?.id || null,
      message: sosMessage.trim() || undefined,
      deviceInfo: `${navigator.platform || 'unknown'}; ${navigator.userAgent}`,
      source,
    })
  }

  const triggerSOS = async () => {
    setSosError('')
    setSosMessage('')
    setSendingSos(true)
    try {
      await sendSosAlert('sos')
      setSosMessage(t('emergency.sosSentText'))
      setSosActive(true)
    } catch (err) {
      console.error('Failed to send SOS', err)
      setSosError(err.message || t('emergency.sosError'))
    } finally {
      setSendingSos(false)
    }
  }

  const cancelSOS = () => {
    setSosActive(false)
  }

  const silentSOS = async () => {
    setSosError('')
    setSosMessage('')
    setSendingSilent(true)
    try {
      await sendSosAlert('silent')
      setSosMessage(t('emergency.silentSent'))
      setTimeout(() => setSosMessage(''), 6000)
    } catch (err) {
      console.error('Failed to send silent SOS', err)
      setSosError(err.message || t('emergency.silentError'))
    } finally {
      setSendingSilent(false)
    }
  }

  const handleMouseDown = () => {
    setPressTimer(setTimeout(() => {
      triggerSOS()
    }, 3000))
  }

  const handleMouseUp = () => {
    if (pressTimer) {
      clearTimeout(pressTimer)
      setPressTimer(null)
    }
  }

  const handleTouchStart = (e) => {
    e.preventDefault()
    handleMouseDown()
  }

  const handleTouchEnd = () => {
    handleMouseUp()
  }

  return (
    <main className="flex-grow">
      {/* Hero Section: Emergency Action */}
      <section className="relative py-8 px-4 md:px-10 bg-[#eff4ff] overflow-hidden">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* SOS Trigger Area */}
          <div className="lg:col-span-7 flex flex-col items-center text-center py-4">
            <h2 className="text-[34px] leading-[42px] sm:text-[42px] sm:leading-[50px] lg:text-[48px] lg:leading-[56px] mb-4 text-[#00236f] font-[700] font-['Poppins']">{t('emergency.heroTitle')}</h2>
            <p className="text-[18px] text-gray-600 max-w-xl mb-8 font-['Inter']">{t('emergency.heroSubtitle')}</p>
            <div className="relative group">
              <div className="sos-pulse absolute inset-0 bg-[#ba1a1a]/20 rounded-full animate-pulse"></div>
              <button 
                type="button"
                disabled={sendingSos}
                className="relative w-64 h-64 md:w-80 md:h-80 bg-[#ba1a1a] rounded-full shadow-2xl flex flex-col items-center justify-center text-white hover:bg-[#ba1a1a]/90 active:scale-95 transition-all border-8 border-white/10"
                onMouseDown={handleMouseDown}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                <span className="material-symbols-outlined text-7xl md:text-8xl mb-2" style={{ fontVariationSettings: "'FILL' 1" }}>{sendingSos ? 'sync' : 'emergency_share'}</span>
                <span className="text-[24px] font-[600] font-['Poppins']">{sendingSos ? t('emergency.sendingSos') : t('emergency.activateSos')}</span>
                <span className="text-[14px] mt-2 opacity-80 uppercase tracking-widest font-['Inter']">{sendingSos ? t('emergency.transmitting') : t('emergency.hold')}</span>
              </button>
            </div>
            <label className="w-full max-w-md text-left text-sm font-semibold text-gray-700" htmlFor="sos-message">
              Add a short message (optional)
              <textarea
                id="sos-message"
                value={sosMessage}
                onChange={(event) => setSosMessage(event.target.value)}
                maxLength={240}
                rows={2}
                placeholder="Tell responders what is happening"
                className="mt-2 w-full rounded-xl border border-gray-300 bg-white p-3 font-normal focus:outline-none focus:ring-2 focus:ring-[#00236f]/20"
              />
            </label>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <button 
                className="flex items-center gap-2 px-8 py-4 bg-[#d9e3f6] border border-gray-300 rounded-xl font-bold text-gray-800 hover:bg-gray-200 transition-colors font-['Inter'] disabled:opacity-60 disabled:cursor-not-allowed"
                onClick={silentSOS}
                disabled={sendingSilent}
              >
                <span className="material-symbols-outlined">{sendingSilent ? 'sync' : 'visibility_off'}</span>
                {sendingSilent ? t('emergency.sending') : t('emergency.silent')}
              </button>
            </div>
            {sosError && (
              <div className="mt-4 max-w-md w-full rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 flex items-start gap-2">
                <span className="material-symbols-outlined">error</span>
                <span>{sosError}</span>
              </div>
            )}
            {sosMessage && (
              <div className="mt-4 max-w-md w-full rounded-xl border border-teal-200 bg-teal-50 p-4 text-sm text-teal-700 flex items-start gap-2">
                <span className="material-symbols-outlined">check_circle</span>
                <span>{sosMessage}</span>
              </div>
            )}
          </div>

          {/* Status & Location Bento Area */}
          <div className="lg:col-span-5 space-y-6">
            {/* Live Location Card */}
            <div className="bg-white p-4 rounded-xl shadow-md border border-gray-300">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#00236f]">location_on</span>
                  <span className="text-[20px] font-[500] font-['Poppins']">{t('emergency.liveLocation')}</span>
                </div>
                <div className="flex items-center gap-1 text-green-600 font-bold text-sm">
                  <span className="w-2 h-2 bg-green-600 rounded-full animate-ping"></span>
                  {t('emergency.broadcasting')}
                </div>
              </div>
              <div className="w-full h-48 rounded-lg overflow-hidden relative border border-gray-300">
                <img 
                  className="w-full h-full object-cover opacity-60 grayscale hover:grayscale-0 transition-all" 
                  alt="Map of Lilongwe, Malawi" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAe9TDlH_ceMaoGflsb9Yjx-zSGP4l0aqerbgxtJE9R8SrRccsgjydbiOZyRfEL2xYIS7jscKGWcOHinFyqEz-67IcpUxrIoCp4MR-QdmB7z9SpymIrIJHMIrAk9iSb2E8AvjR85CEfUoWslsHFji1WY0twoLzmvAkMi6D2hhj4_3YXk-CGMIfRYtlPECSsi9g4vUAnpM15wrmHsHCSzJeL73ABRbFWUqp75mCrqM4sLJtBKld5awL-HS735mPtdyXXsPuD7tS9zQ"
                />
                <div className="absolute bottom-2 left-2 bg-white/90 px-3 py-1 rounded text-xs font-semibold text-gray-600 shadow-sm">
                  GPS Accuracy: ±5 meters
                </div>
              </div>
              <p className="mt-3 text-sm text-gray-600 font-['Inter']">{t('emergency.lastUpdated')}</p>
            </div>

            {/* Emergency Contacts Quick View */}
            <div className="bg-white p-4 rounded-xl shadow-md border border-gray-300">
              <h3 className="text-[20px] font-[500] mb-4 flex items-center gap-2 font-['Poppins']">
                <span className="material-symbols-outlined text-[#00236f]">contacts</span>
                {t('emergency.contacts')}
              </h3>
              <div className="space-y-3">
                {contacts.map((contact) => (
                  <div key={contact.id} className="flex items-center justify-between p-3 bg-[#eff4ff] rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-[#1e3a8a] text-white rounded-full flex items-center justify-center font-bold">
                        {contact.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold">{contact.name}</p>
                        <p className="text-xs text-gray-600 font-['Inter']">{t('emergency.crew')} • {contact.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <a href={`tel:${contact.phone.replace(/\D/g, '')}`} className="flex items-center gap-1 text-[#006a63] text-sm font-semibold hover:underline font-['Inter']">
                        <span className="material-symbols-outlined text-[16px]">call</span>
                      </a>
                      <button
                        onClick={() => removeContact(contact.id)}
                        className="text-[#ba1a1a] hover:underline text-sm font-['Inter']"
                        aria-label={`Remove ${contact.name}`}
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  </div>
                ))}
                <button
                  onClick={addContact}
                  className="w-full py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 font-['Inter']"
                >
                  <span className="material-symbols-outlined">add</span>
                  {t('emergency.addContact')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links Grid */}
      <section className="py-8 px-4 md:px-10 max-w-[1280px] mx-auto">
        <h3 className="text-[24px] font-[600] mb-4 text-center md:text-left font-['Poppins']">{t('emergency.servicesTitle')}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Call Police */}
          <a className="bg-white p-6 rounded-xl shadow-md border border-gray-300 hover:border-[#00236f] transition-all group" href="tel:997">
            <div className="w-12 h-12 bg-[#00236f]/10 rounded-full flex items-center justify-center mb-4 text-[#00236f] group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined">local_police</span>
            </div>
            <h4 className="text-[20px] font-bold font-['Poppins']">{t('emergency.callPolice')}</h4>
            <p className="text-gray-600 text-sm mb-4 font-['Inter']">{t('emergency.callPoliceText')}</p>
            <span className="text-[#00236f] font-bold text-lg font-['Poppins']">997</span>
          </a>
          {/* Call Ambulance */}
          <a className="bg-white p-6 rounded-xl shadow-md border border-gray-300 hover:border-[#00236f] transition-all group" href="tel:998">
            <div className="w-12 h-12 bg-[#ba1a1a]/10 rounded-full flex items-center justify-center mb-4 text-[#ba1a1a] group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined">medical_services</span>
            </div>
            <h4 className="text-[20px] font-bold font-['Poppins']">{t('emergency.callAmbulance')}</h4>
            <p className="text-gray-600 text-sm mb-4 font-['Inter']">{t('emergency.callAmbulanceText')}</p>
            <span className="text-[#ba1a1a] font-bold text-lg font-['Poppins']">998</span>
          </a>
          {/* Nearest Safe House */}
          <a href="https://www.google.com/maps/search/?api=1&query=emergency+shelter+Malawi" target="_blank" rel="noopener noreferrer" className="bg-white p-6 rounded-xl shadow-md border border-gray-300 hover:border-[#00236f] transition-all group block">
            <div className="w-12 h-12 bg-[#006a63]/10 rounded-full flex items-center justify-center mb-4 text-[#006a63] group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined">roofing</span>
            </div>
            <h4 className="text-[20px] font-bold font-['Poppins']">{t('emergency.safeHouse')}</h4>
            <p className="text-gray-600 text-sm mb-4 font-['Inter']">{t('emergency.safeHouseText')}</p>
            <span className="text-[#006a63] font-bold text-sm underline font-['Inter']">{t('emergency.findOnMap')}</span>
          </a>
          {/* Nearest Hospital */}
          <a href="https://www.google.com/maps/search/?api=1&query=hospital+Malawi" target="_blank" rel="noopener noreferrer" className="bg-white p-6 rounded-xl shadow-md border border-gray-300 hover:border-[#00236f] transition-all group block">
            <div className="w-12 h-12 bg-[#533c00]/20 rounded-full flex items-center justify-center mb-4 text-[#261a00] group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined">hospital</span>
            </div>
            <h4 className="text-[20px] font-bold font-['Poppins']">{t('emergency.hospital')}</h4>
            <p className="text-gray-600 text-sm mb-4 font-['Inter']">{t('emergency.hospitalText')}</p>
            <span className="text-[#261a00] font-bold text-sm underline font-['Inter']">{t('emergency.findOnMap')}</span>
          </a>
        </div>
      </section>

      {/* Safety Tips Bento Section */}
      <section className="py-8 bg-[#d9e3f6]">
        <div className="max-w-[1280px] mx-auto px-4 md:px-10">
          <div className="flex items-end justify-between mb-4">
            <div>
              <h3 className="text-[24px] font-[600] font-['Poppins']">{t('emergency.tipsTitle')}</h3>
              <p className="text-gray-600 font-['Inter']">{t('emergency.tipsSubtitle')}</p>
            </div>
            <a href="/resources" className="hidden md:block text-[#00236f] font-bold hover:underline font-['Inter']">View All Safety Guides</a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Tip 1 */}
            <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-[#00236f]">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-8 h-8 rounded-full bg-[#00236f] text-white flex items-center justify-center font-bold">1</span>
                <h4 className="font-bold font-['Poppins']">{t('emergency.tip1Title')}</h4>
              </div>
              <p className="text-gray-600 text-sm font-['Inter']">{t('emergency.tip1Text')}</p>
            </div>
            {/* Tip 2 */}
            <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-[#006a63]">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-8 h-8 rounded-full bg-[#006a63] text-white flex items-center justify-center font-bold">2</span>
                <h4 className="font-bold font-['Poppins']">{t('emergency.tip2Title')}</h4>
              </div>
              <p className="text-gray-600 text-sm font-['Inter']">{t('emergency.tip2Text')}</p>
            </div>
            {/* Tip 3 */}
            <div className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-[#f6be39]">
              <div className="flex items-center gap-3 mb-3">
                <span className="w-8 h-8 rounded-full bg-[#f6be39] text-[#261a00] flex items-center justify-center font-bold">3</span>
                <h4 className="font-bold font-['Poppins']">{t('emergency.tip3Title')}</h4>
              </div>
              <p className="text-gray-600 text-sm font-['Inter']">{t('emergency.tip3Text')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Overlay Alerts */}
      {sosActive && (
        <div className="fixed inset-0 bg-[#ba1a1a]/90 z-[110] flex items-center justify-center p-6 text-center text-white animate-pulse">
          <div className="max-w-md">
            <span className="material-symbols-outlined text-9xl mb-6">emergency</span>
            <h2 className="text-4xl font-bold mb-4 font-['Poppins']">{t('emergency.sosSentTitle')}</h2>
            <p className="text-xl mb-8 font-['Inter']">{t('emergency.sosSentText')}</p>
            <button 
              className="px-8 py-3 bg-white text-[#ba1a1a] font-bold rounded-full hover:bg-gray-100 transition-all font-['Inter']"
              onClick={cancelSOS}
            >
              {t('emergency.cancelSos')}
            </button>
          </div>
        </div>
      )}
    </main>
  )
}

export default Emergency
