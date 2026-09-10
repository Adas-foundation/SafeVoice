import { useNavigate, useLocation, Outlet } from 'react-router-dom'
import AdminSidebar from '../components/AdminSidebar'

export default function SettingsLayout() {
  const navigate = useNavigate()
  const location = useLocation()

  function isActive(path) {
    return location.pathname === path || location.pathname.startsWith(path + '/')
  }

  return (
    <div className="flex">
      <AdminSidebar />
      <main className="lg:ml-64 min-h-screen flex-1 bg-background text-on-surface font-body-md pt-16 lg:pt-0">
        <header className="sticky top-16 lg:top-0 bg-surface-container-lowest/80 backdrop-blur-md z-30 px-margin-mobile lg:px-margin-desktop py-4 flex justify-between items-center shadow-sm">
          <div>
            <h2 className="font-headline-md text-headline-md font-semibold text-primary">System Settings</h2>
            <nav className="flex items-center gap-2 text-label-md text-on-surface-variant mt-1" aria-label="breadcrumb">
              <span>Admin Portal</span>
              <span className="material-symbols-outlined text-[14px]">chevron_right</span>
              <span className="text-primary font-semibold">Settings</span>
            </nav>
          </div>
        </header>

        <div className="p-margin-mobile lg:p-margin-desktop grid grid-cols-12 gap-gutter max-w-container-max mx-auto w-full">
          <div className="col-span-12 lg:col-span-3 space-y-4">
            <div className="bg-surface-container-lowest rounded-xl p-4 shadow-[0_4px_12px_rgba(30,58,138,0.05)] sticky top-32">
              <h3 className="text-label-sm uppercase tracking-wider text-outline mb-4 px-2">Configuration</h3>
              <ul className="space-y-1">
                <li>
                  <button
                    className={`w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg ${isActive('/settings/general') ? 'bg-surface-container text-primary font-semibold' : 'hover:bg-surface-container-low text-on-surface-variant'}`}
                    onClick={() => navigate('/settings/general')}
                  >
                    <span className="material-symbols-outlined">tune</span>
                    <span>General Settings</span>
                  </button>
                </li>
                <li>
                  <button
                    className={`w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg ${isActive('/settings/security') ? 'bg-surface-container text-primary font-semibold' : 'hover:bg-surface-container-low text-on-surface-variant'}`}
                    onClick={() => navigate('/settings/security')}
                  >
                    <span className="material-symbols-outlined">security</span>
                    <span>Security &amp; Access</span>
                  </button>
                </li>
                <li>
                  <button
                    className={`w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg ${isActive('/settings/privacy') ? 'bg-surface-container text-primary font-semibold' : 'hover:bg-surface-container-low text-on-surface-variant'}`}
                    onClick={() => navigate('/settings/privacy')}
                  >
                    <span className="material-symbols-outlined">policy</span>
                    <span>Privacy &amp; Compliance</span>
                  </button>
                </li>
                <li>
                  <button
                    className={`w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg ${isActive('/settings/backup') ? 'bg-surface-container text-primary font-semibold' : 'hover:bg-surface-container-low text-on-surface-variant'}`}
                    onClick={() => navigate('/settings/backup')}
                  >
                    <span className="material-symbols-outlined">backup</span>
                    <span>System Backup</span>
                  </button>
                </li>
                <li>
                  <button
                    className={`w-full text-left flex items-center gap-3 px-3 py-2 rounded-lg ${isActive('/settings/integrations') ? 'bg-surface-container text-primary font-semibold' : 'hover:bg-surface-container-low text-on-surface-variant'}`}
                    onClick={() => navigate('/settings/integrations')}
                  >
                    <span className="material-symbols-outlined">hub</span>
                    <span>Integrations</span>
                  </button>
                </li>
              </ul>

              <div className="mt-8 pt-6 border-t border-outline-variant">
                <button
                  onClick={() => navigate('/settings/audit-logs')}
                  className="w-full flex items-center justify-between p-3 rounded-lg bg-surface-container-high text-primary hover:bg-primary-container hover:text-on-primary-container transition-all group"
                >
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined">history</span>
                    <span className="font-semibold">Audit Logs</span>
                  </div>
                  <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-9 space-y-gutter pb-24">
            <Outlet />
          </div>
        </div>
      </main>
    </div>
  )
}
