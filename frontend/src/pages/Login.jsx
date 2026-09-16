import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.message || 'Invalid email or password')
      }

      const data = await response.json()
      const token = data.access_token || data.accessToken
      const user = data.user || {}

      localStorage.setItem('safereport_token', token)
      localStorage.setItem('safereport_user', JSON.stringify(user))

      const roleName = typeof user.role === 'string' ? user.role : user.role?.roleName || ''
      const isStaff =
        roleName === 'admin' ||
        roleName === 'platform_admin' ||
        roleName === 'tenant_admin' ||
        roleName === 'officer' ||
        roleName === 'case_manager'

      navigate(isStaff ? '/dashboard' : '/')
    } catch (err) {
      console.error('Authentication error', err)
      setError(err.message || 'Login failed. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#f6f7fb] px-6 py-12">
      <div className="w-full max-w-[400px]">
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="h-8 w-8 rounded-md bg-[#00236f] flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-white text-[17px]">verified_user</span>
          </div>
          <span className="font-['Inter'] text-[13px] font-medium tracking-[0.04em] text-gray-500">
            SafeReport Admin
          </span>
        </div>

        <div className="relative rounded-2xl bg-white border border-gray-100 shadow-[0_1px_2px_rgba(16,24,40,0.04),0_20px_45px_-15px_rgba(16,24,40,0.14)] p-9 sm:p-10">
          <div
            className="absolute inset-x-0 top-0 h-1 rounded-t-2xl bg-gradient-to-r from-[#00236f] via-[#1e3a8a] to-[#90a8ff]"
            aria-hidden="true"
          />

          <div className="mb-8">
            <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-[#00236f]/[0.06] border border-[#00236f]/10">
              <span className="material-symbols-outlined text-[#00236f] text-[22px]">lock</span>
            </div>
            <h1 className="font-['Poppins'] text-[22px] leading-[28px] font-[600] text-gray-900 text-center mb-1.5">
              Sign in
            </h1>
            <p className="font-['Inter'] text-[14px] text-gray-500 text-center">
              Access the centralised case dashboard.
            </p>
          </div>

          {error && (
            <div role="alert" className="mb-6 flex items-start gap-2.5 px-4 py-3 rounded-lg bg-[#ffdad6] border border-[#ba1a1a]/30 text-[#93000a] text-[14px] font-['Inter']">
              <span className="material-symbols-outlined text-lg mt-0.5 shrink-0">error</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 font-['Inter']" aria-label="Admin login form">
            <div>
              <label htmlFor="email" className="block text-[13px] font-medium text-gray-700 mb-1.5">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="username"
                required
                placeholder="name@adasfoundation.mw"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 bg-white text-[15px] text-gray-900 placeholder:text-gray-400 focus:border-[#00236f] focus:ring-[3px] focus:ring-[#00236f]/12 outline-none transition-all"
              />
            </div>

            <div>
              <div className="flex justify-between items-baseline mb-1.5">
                <label htmlFor="password" className="block text-[13px] font-medium text-gray-700">
                  Password
                </label>
                <a href="#" className="text-[13px] font-medium text-[#00236f] hover:text-[#1e3a8a] transition-colors">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 pr-10 rounded-lg border border-gray-300 bg-white text-[15px] text-gray-900 placeholder:text-gray-400 focus:border-[#00236f] focus:ring-[3px] focus:ring-[#00236f]/12 outline-none transition-all"
                />
                <button
                  type="button"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors"
                >
                  <span className="material-symbols-outlined text-[19px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
                </button>
              </div>
            </div>

            <label htmlFor="remember" className="flex items-center gap-2.5 cursor-pointer select-none pt-1">
              <input
                id="remember"
                name="remember"
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-[#00236f] focus:ring-[#00236f]/20 focus:ring-offset-0 cursor-pointer"
              />
              <span className="text-[14px] text-gray-600">Remember this device for 30 days</span>
            </label>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-[#00236f] text-white py-2.5 rounded-lg font-['Poppins'] font-[600] text-[15px] hover:bg-[#1e3a8a] active:bg-[#001a54] transition-all shadow-md shadow-[#00236f]/20 flex items-center justify-center gap-2 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <span className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />
                  <span>Signing in…</span>
                </>
              ) : (
                'Sign in'
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
            <p className="font-['Inter'] text-[13px] text-gray-500">
              Need help?{' '}
              <a href="#" className="font-medium text-[#00236f] hover:text-[#1e3a8a] transition-colors">
                Contact IT support
              </a>
            </p>
            <span className="flex items-center gap-1.5 text-[12px] text-gray-400 font-['Inter']">
              <span className="material-symbols-outlined text-[14px]">lock</span>
              Encrypted
            </span>
          </div>
        </div>

      
      </div>
    </main>
  )
}