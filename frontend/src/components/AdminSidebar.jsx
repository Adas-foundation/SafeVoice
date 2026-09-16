import { useEffect, useState } from 'react'
import { NavLink, Link, useNavigate } from 'react-router-dom'

const NAV_ITEMS = [
  ['/dashboard', 'Dashboard', 'dashboard'],
  ['/case-management', 'Case Management', 'folder_shared'],
  ['/analytics', 'Analytics', 'analytics'],
  ['/user-management', 'User Management', 'group'],
  ['/district-setup', 'District Setup', 'map'],
]

function SidebarBody({ onNavigate }) {
  const navigate = useNavigate()
  const navItem = (to, label, icon) => (
    <NavLink
      key={to}
      to={to}
      onClick={onNavigate}
      className={({ isActive }) =>
        `flex items-center gap-3 px-5 py-4 rounded-2xl transition-all duration-200 ease-in-out ${
          isActive
            ? 'bg-[#0f4b8f] text-white font-semibold shadow-inner'
            : 'text-slate-300 hover:bg-[#0a3260] hover:text-white'
        }`
      }
    >
      <span className="material-symbols-outlined">{icon}</span>
      <span className="font-semibold">{label}</span>
    </NavLink>
  )

  return (
    <>
      <Link
        to="/case-management/create"
        onClick={onNavigate}
        className="mb-8 bg-[#0d4a8a] text-white py-3 px-4 rounded-2xl font-semibold flex items-center justify-center gap-2 hover:bg-[#0b3c70] transition-colors"
      >
        <span className="material-symbols-outlined text-[20px]">add_circle</span>
        Create New Case
      </Link>

      <nav className="flex-grow space-y-3 overflow-y-auto">
        {NAV_ITEMS.map(([to, label, icon]) => navItem(to, label, icon))}
      </nav>

      <div className="mt-auto pt-6 border-t border-slate-700/50">
        <NavLink
          to="/settings"
          onClick={onNavigate}
          className="flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-300 hover:bg-[#0a3260] hover:text-white transition-all duration-200 ease-in-out"
        >
          <span className="material-symbols-outlined">settings</span>
          <span className="font-semibold">Settings</span>
        </NavLink>
        <button
          type="button"
          onClick={() => {
            localStorage.removeItem('safereport_user')
            localStorage.removeItem('safereport_token')
            navigate('/login')
          }}
          className="w-full text-left flex items-center gap-3 px-4 py-3 rounded-2xl text-amber-200 hover:bg-amber-300/10 transition-all duration-200 ease-in-out"
          aria-label="Logout and return to login"
        >
          <span className="material-symbols-outlined">logout</span>
          <span className="font-semibold">Logout</span>
        </button>
      </div>
    </>
  )
}

export default function AdminSidebar() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <>
      {/* Mobile top bar */}
      <header className="fixed inset-x-0 top-0 z-50 flex h-16 items-center justify-between bg-[#041c40] px-4 text-white shadow-2xl lg:hidden">
        <div>
          <h1 className="text-lg font-bold leading-tight">Admin Portal</h1>
          <p className="text-xs text-slate-300 opacity-80">SafeReport Malawi</p>
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-xl p-2 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/60"
          aria-label="Open admin navigation"
          aria-expanded={open}
          aria-controls="admin-drawer"
        >
          <span className="material-symbols-outlined text-3xl">menu</span>
        </button>
      </header>

      {/* Overlay */}
      <div
        className={`fixed inset-0 z-50 bg-black/50 transition-opacity lg:hidden ${
          open ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile drawer */}
      <aside
        id="admin-drawer"
        aria-label="Admin navigation"
        className={`fixed top-0 left-0 z-50 flex h-full w-64 flex-col bg-[#041c40] p-6 text-slate-100 shadow-2xl transition-transform duration-200 ease-in-out lg:hidden ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Admin Portal</h1>
            <p className="text-sm text-slate-300 opacity-80">SafeReport Malawi</p>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-xl p-2 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/60"
            aria-label="Close admin navigation"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>
        <SidebarBody onNavigate={() => setOpen(false)} />
      </aside>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex h-screen w-56 fixed left-0 top-0 bg-[#041c40] text-slate-100 shadow-2xl flex-col p-6 z-40 transition-all duration-200 ease-in-out">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white">Admin Portal</h1>
          <p className="text-sm text-slate-300 opacity-80">SafeReport Malawi</p>
        </div>
        <SidebarBody onNavigate={() => {}} />
      </aside>
    </>
  )
}