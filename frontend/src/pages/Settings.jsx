import { useEffect, useRef, useState } from 'react'
import AdminSidebar from '../components/AdminSidebar'
import { getSettings, updateSettings } from '../services/settingsApi'

function formatRelative(iso) {
  if (!iso) return 'Never'
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins} minute${mins === 1 ? '' : 's'} ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`
  const days = Math.floor(hours / 24)
  return `${days} day${days === 1 ? '' : 's'} ago`
}

export default function Settings() {
  const [platformName, setPlatformName] = useState('SafeReport Malawi')
  const [timezone, setTimezone] = useState('Central Africa Time (CAT) - UTC+2')
  const [language, setLanguage] = useState('English (UK)')
  const [contactEmail, setContactEmail] = useState('support@gender.gov.mw')

  const [twoFA, setTwoFA] = useState(true)
  const [sessionTimeout, setSessionTimeout] = useState(30)
  const [passwordExpiry, setPasswordExpiry] = useState(90)
  const [ipWhitelist, setIpWhitelist] = useState('')

  const [retention, setRetention] = useState('7 Years (Default Legal Requirement)')
  const [lastBackup, setLastBackup] = useState(/** @type {string | null} */ (null))

  const [saving, setSaving] = useState(false)
  const [backingUp, setBackingUp] = useState(false)
  const [saveError, setSaveError] = useState('')

  const toastRef = useRef(/** @type {HTMLDivElement | null} */ (null))

  useEffect(() => {
    let active = true
    getSettings()
      .then((s) => {
        if (!active || !s) return
        setPlatformName(s.platform_name || 'SafeReport Malawi')
        setTimezone(s.timezone || 'Central Africa Time (CAT) - UTC+2')
        setLanguage(s.language || 'English (UK)')
        setContactEmail(s.contact_email || 'support@gender.gov.mw')
        setTwoFA(s.two_fa !== 'false')
        setSessionTimeout(s.session_timeout != null ? Number(s.session_timeout) : 30)
        setPasswordExpiry(s.password_expiry != null ? Number(s.password_expiry) : 90)
        setIpWhitelist(s.ip_whitelist || '')
        setRetention(s.retention || '7 Years (Default Legal Requirement)')
        setLastBackup(s.last_backup || null)
      })
      .catch((err) => console.error('Failed to load settings', err))
    return () => { active = false }
  }, [])

  function scrollToSection(id) {
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function showToast() {
    if (toastRef.current) {
      toastRef.current.classList.remove('translate-y-24', 'opacity-0')
      toastRef.current.classList.add('translate-y-0', 'opacity-100')
      setTimeout(() => {
        if (toastRef.current) {
          toastRef.current.classList.add('translate-y-24', 'opacity-0')
          toastRef.current.classList.remove('translate-y-0', 'opacity-100')
        }
      }, 3000)
    }
  }

  async function handleSave() {
    setSaveError('')
    setSaving(true)
    try {
      await updateSettings({
        platform_name: platformName,
        timezone,
        language,
        contact_email: contactEmail,
        two_fa: twoFA,
        session_timeout: Number(sessionTimeout),
        password_expiry: Number(passwordExpiry),
        ip_whitelist: ipWhitelist,
        retention,
      })
      showToast()
    } catch (err) {
      console.error('Failed to save settings', err)
      setSaveError(err.message || 'Failed to save settings.')
    } finally {
      setSaving(false)
    }
  }

  async function handleTriggerBackup() {
    setSaveError('')
    setBackingUp(true)
    try {
      const now = new Date().toISOString()
      await updateSettings({ last_backup: now })
      setLastBackup(now)
    } catch (err) {
      console.error('Failed to trigger backup', err)
      setSaveError(err.message || 'Failed to trigger backup.')
    } finally {
      setBackingUp(false)
    }
  }

  return (
    <div className="flex">
      <AdminSidebar />
      <main className="lg:ml-64 min-h-screen flex-1 bg-background text-on-surface font-body-md pt-16 lg:pt-0">
        <header className="sticky top-16 lg:top-0 bg-surface-container-lowest/80 backdrop-blur-md z-30 px-margin-mobile lg:px-margin-desktop py-4 flex flex-wrap justify-between items-center gap-3 shadow-sm">
          <div>
            <h2 className="font-headline-md text-headline-md font-semibold text-primary">System Settings</h2>
            <nav className="flex items-center gap-2 text-label-md text-on-surface-variant mt-1" aria-label="breadcrumb">
              <span>Admin Portal</span>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              <span className="text-primary font-semibold">Settings</span>
            </nav>
          </div>
          <div className="flex gap-stack-sm">
            <button
              type="button"
              className="px-6 py-2 rounded-lg border-1.5 border-secondary text-secondary font-semibold hover:bg-secondary/5 transition-colors"
              onClick={() => window.location.reload()}
            >
              Cancel
            </button>
            <button
              type="button"
              className="px-6 py-2 rounded-lg bg-primary text-on-primary font-semibold shadow-md hover:opacity-90 transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </header>

        <div className="p-margin-mobile lg:p-margin-desktop grid grid-cols-12 gap-gutter max-w-container-max mx-auto w-full">
          {saveError && (
            <div className="col-span-12 rounded-xl border border-error/30 bg-error-container/20 p-4 text-error flex items-center gap-3">
              <span className="material-symbols-outlined">error</span>
              <span>{saveError}</span>
            </div>
          )}
          <div className="col-span-12 lg:col-span-3 space-y-4">
            <div className="bg-surface-container-lowest rounded-xl p-4 shadow-[0_4px_12px_rgba(30,58,138,0.05)] sticky top-32">
              <h3 className="text-label-sm uppercase tracking-wider text-outline mb-4 px-2">Configuration</h3>
              <ul className="space-y-1">
                <li>
                  <button className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg bg-surface-container text-primary font-semibold" onClick={() => scrollToSection('general')}>
                    <span className="material-symbols-outlined">tune</span>
                    <span>General Settings</span>
                  </button>
                </li>
                <li>
                  <button className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-surface-container-low text-on-surface-variant transition-colors" onClick={() => scrollToSection('security')}>
                    <span className="material-symbols-outlined">security</span>
                    <span>Security &amp; Access</span>
                  </button>
                </li>
                <li>
                  <button className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-surface-container-low text-on-surface-variant transition-colors" onClick={() => scrollToSection('privacy')}>
                    <span className="material-symbols-outlined">policy</span>
                    <span>Privacy &amp; Compliance</span>
                  </button>
                </li>
                <li>
                  <button className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-surface-container-low text-on-surface-variant transition-colors" onClick={() => scrollToSection('backup')}>
                    <span className="material-symbols-outlined">backup</span>
                    <span>System Backup</span>
                  </button>
                </li>
                <li>
                  <button className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-surface-container-low text-on-surface-variant transition-colors" onClick={() => scrollToSection('integrations')}>
                    <span className="material-symbols-outlined">hub</span>
                    <span>Integrations</span>
                  </button>
                </li>
              </ul>
              <div className="mt-8 pt-6 border-t border-outline-variant">
                <a className="flex items-center justify-between p-3 rounded-lg bg-surface-container-high text-primary hover:bg-primary-container hover:text-on-primary-container transition-all group" href="#" onClick={(e) => e.preventDefault()}>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined">history</span>
                    <span className="font-semibold">Audit Logs</span>
                  </div>
                  <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </a>
              </div>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-9 space-y-gutter pb-24">
            <section id="general" className="bg-surface-container-lowest rounded-xl p-8 shadow-[0_4px_12px_rgba(30,58,138,0.05)] border border-transparent hover:border-primary/10 transition-all">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-lg bg-primary-container/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-3xl">tune</span>
                </div>
                <div>
                  <h3 className="font-headline-md text-headline-md">General Settings</h3>
                  <p className="text-on-surface-variant">Configure core platform identity and regional defaults.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="font-label-md text-on-surface">Platform Name</label>
                  <input className="rounded-lg border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white transition-all py-3" type="text" value={platformName} onChange={(e) => setPlatformName(e.target.value)} />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-label-md text-on-surface">System Timezone</label>
                  <select className="rounded-lg border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white transition-all py-3" value={timezone} onChange={(e) => setTimezone(e.target.value)}>
                    <option>Central Africa Time (CAT) - UTC+2</option>
                    <option>Greenwich Mean Time (GMT)</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-label-md text-on-surface">Default System Language</label>
                  <select className="rounded-lg border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white transition-all py-3" value={language} onChange={(e) => setLanguage(e.target.value)}>
                    <option>English (UK)</option>
                    <option>Chichewa</option>
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-label-md text-on-surface">Contact Support Email</label>
                  <input className="rounded-lg border-outline-variant focus:border-primary focus:ring-2 focus:ring-primary/20 bg-white transition-all py-3" placeholder="support@gender.gov.mw" type="email" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} />
                </div>
              </div>
            </section>

            <section id="security" className="bg-surface-container-lowest rounded-xl p-8 shadow-[0_4px_12px_rgba(30,58,138,0.05)] border border-transparent hover:border-primary/10 transition-all">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-lg bg-error-container/10 flex items-center justify-center text-error">
                  <span className="material-symbols-outlined text-3xl">security</span>
                </div>
                <div>
                  <h3 className="font-headline-md text-headline-md">Security &amp; Access</h3>
                  <p className="text-on-surface-variant">Manage authentication protocols and network restrictions.</p>
                </div>
              </div>
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-lg bg-surface-container-low">
                  <div>
                    <h4 className="font-semibold text-on-surface">Two-Factor Authentication (2FA)</h4>
                    <p className="text-label-md text-on-surface-variant">Enforce MFA for all administrative accounts.</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input checked={twoFA} onChange={(e) => setTwoFA(e.target.checked)} className="sr-only peer" type="checkbox" aria-label="Enable two-factor authentication" />
                    <div className="w-11 h-6 bg-outline-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="font-label-md text-on-surface">Session Timeout (Minutes)</label>
                    <input className="rounded-lg border-outline-variant focus:border-primary bg-white py-3" type="number" value={sessionTimeout} onChange={(e) => setSessionTimeout(Number(e.target.value))} />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="font-label-md text-on-surface">Password Expiry (Days)</label>
                    <input className="rounded-lg border-outline-variant focus:border-primary bg-white py-3" type="number" value={passwordExpiry} onChange={(e) => setPasswordExpiry(Number(e.target.value))} />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="font-label-md text-on-surface">IP Whitelisting (Government Network Only)</label>
                  <textarea className="rounded-lg border-outline-variant focus:border-primary bg-white py-3" placeholder="e.g. 192.168.1.1, 10.0.0.0/24" rows={3} value={ipWhitelist} onChange={(e) => setIpWhitelist(e.target.value)} />
                  <p className="text-label-sm text-on-surface-variant">Separate multiple IP addresses or ranges with commas.</p>
                </div>
              </div>
            </section>

            <section id="privacy" className="bg-surface-container-lowest rounded-xl p-8 shadow-[0_4px_12px_rgba(30,58,138,0.05)] border border-transparent hover:border-primary/10 transition-all">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-lg bg-secondary-container/20 flex items-center justify-center text-secondary">
                  <span className="material-symbols-outlined text-3xl">policy</span>
                </div>
                <div>
                  <h3 className="font-headline-md text-headline-md">Privacy &amp; Compliance</h3>
                  <p className="text-on-surface-variant">Data governance and legal compliance settings.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-6 rounded-xl border border-outline-variant/30 bg-surface">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="material-symbols-outlined text-primary">verified_user</span>
                    <h4 className="font-semibold">Encryption Status</h4>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-on-surface-variant">Database Storage</span>
                    <span className="px-2 py-1 rounded bg-secondary/10 text-secondary text-label-sm font-bold">AES-256 ACTIVE</span>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-on-surface-variant">Transfer Protocol</span>
                    <span className="px-2 py-1 rounded bg-secondary/10 text-secondary text-label-sm font-bold">TLS 1.3 ACTIVE</span>
                  </div>
                </div>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="font-label-md text-on-surface">Case Data Retention (Years)</label>
                    <select className="rounded-lg border-outline-variant focus:border-primary bg-white py-3" value={retention} onChange={(e) => setRetention(e.target.value)}>
                      <option>7 Years (Default Legal Requirement)</option>
                      <option>10 Years</option>
                      <option>Permanent</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2 text-label-sm text-on-surface-variant italic">
                    <span className="material-symbols-outlined text-[16px]">info</span>
                    <span>Compliant with Malawi Data Protection Act (2023)</span>
                  </div>
                </div>
              </div>
            </section>

            <section id="backup" className="bg-surface-container-lowest rounded-xl p-8 shadow-[0_4px_12px_rgba(30,58,138,0.05)] border border-transparent hover:border-primary/10 transition-all">
              <div className="flex justify-between items-start mb-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-tertiary-container/10 flex items-center justify-center text-tertiary">
                    <span className="material-symbols-outlined text-3xl">backup</span>
                  </div>
                  <div>
                    <h3 className="font-headline-md text-headline-md">System Backup</h3>
                    <p className="text-on-surface-variant">Disaster recovery and automated backup scheduling.</p>
                  </div>
                </div>
                <button onClick={handleTriggerBackup} disabled={backingUp} className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg font-semibold shadow-sm hover:opacity-90 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed">
                  <span className="material-symbols-outlined">{backingUp ? 'progress_activity' : 'rocket_launch'}</span>
                  {backingUp ? 'Backing Up...' : 'Trigger Manual Backup'}
                </button>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="bg-surface p-4 rounded-xl flex flex-col items-center text-center">
                  <span className="text-label-sm text-on-surface-variant mb-1">Last Backup</span>
                  <span className="font-bold text-primary">{formatRelative(lastBackup)}</span>
                  <span className="text-label-sm mt-2">{lastBackup ? 'Successful' : 'No backup on record'}</span>
                </div>
                <div className="bg-surface p-4 rounded-xl flex flex-col items-center text-center border-l-4 border-primary">
                  <span className="text-label-sm text-on-surface-variant mb-1">Schedule</span>
                  <span className="font-bold text-primary">Every 12 Hours</span>
                  <span className="text-label-sm mt-2">Next: 22:00 CAT</span>
                </div>
                <div className="bg-surface p-4 rounded-xl flex flex-col items-center text-center">
                  <span className="text-label-sm text-on-surface-variant mb-1">Restore Points</span>
                  <span className="font-bold text-primary">14 Available</span>
                  <button className="text-primary font-bold text-label-sm mt-2 underline" onClick={() => scrollToSection('backup')}>Manage Points</button>
                </div>
              </div>
            </section>

            <section id="integrations" className="bg-surface-container-lowest rounded-xl p-8 shadow-[0_4px_12px_rgba(30,58,138,0.05)] border border-transparent hover:border-primary/10 transition-all">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-lg bg-primary-container/10 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined text-3xl">hub</span>
                </div>
                <div>
                  <h3 className="font-headline-md text-headline-md">Integrations</h3>
                  <p className="text-on-surface-variant">Connect with external government and emergency services.</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-6 border border-outline-variant rounded-xl hover:border-primary transition-colors flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-surface flex items-center justify-center rounded-full border border-outline-variant">
                      <span className="material-symbols-outlined text-on-surface-variant">local_police</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-on-surface">Malawi Police Service</h4>
                      <p className="text-label-sm text-secondary">Connected • API v2.4</p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary" onClick={() => scrollToSection('integrations')}>settings</span>
                </div>
                <div className="p-6 border border-outline-variant rounded-xl hover:border-primary transition-colors flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-surface flex items-center justify-center rounded-full border border-outline-variant">
                      <span className="material-symbols-outlined text-on-surface-variant">medical_services</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-on-surface">Ministry of Health</h4>
                      <p className="text-label-sm text-secondary">Connected • API v1.1</p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary" onClick={() => scrollToSection('integrations')}>settings</span>
                </div>
                <button className="col-span-1 md:col-span-2 p-4 border-2 border-dashed border-outline-variant rounded-xl text-on-surface-variant hover:text-primary hover:border-primary hover:bg-primary/5 transition-all flex items-center justify-center gap-2" onClick={() => window.alert('Integration marketplace is under development. Please contact IT Support for custom integrations.')}>
                  <span className="material-symbols-outlined">add_circle</span>
                  <span className="font-semibold">Connect New Integration</span>
                </button>
              </div>
            </section>
          </div>
        </div>

        <footer className="mt-auto bg-primary text-on-primary p-gutter">
          <div className="max-w-container-max mx-auto flex flex-col md:flex-row justify-between items-center gap-base">
            <p className="font-body-md text-on-primary/80">© 2024 Adas Foundation, Community Development and Social Welfare - Government of Malawi</p>
            <div className="flex gap-gutter">
              <a className="hover:text-on-primary transition-colors" href="/resources">Privacy Policy</a>
              <a className="hover:text-on-primary transition-colors" href="/contact">Help Desk</a>
              <a className="hover:text-on-primary transition-colors" href="/contact">Contact Us</a>
            </div>
          </div>
        </footer>

        <div ref={toastRef} className="fixed bottom-8 right-8 bg-on-secondary-container text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 translate-y-24 opacity-0 transition-all duration-500 z-50">
          <span className="material-symbols-outlined bg-white/20 p-1 rounded-full">check</span>
          <div>
            <p className="font-bold">Settings Saved</p>
            <p className="text-sm opacity-90">All changes have been successfully applied to the system.</p>
          </div>
        </div>
      </main>
    </div>
  )
}
