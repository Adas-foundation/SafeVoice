import { useEffect, useMemo, useState } from 'react'
import AdminSidebar from '../components/AdminSidebar'
import { getUsers, createUser, updateUser, deleteUser } from '../services/usersApi'
import { getRoles } from '../services/rolesApi'

const PAGE_SIZE = 10

function titleCase(value) {
  return String(value || '')
    .split(/[\s_]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

const emptyForm = { name: '', email: '', password: '', roleId: '' }

const UserManagement = () => {
  const [users, setUsers] = useState(/** @type {any[]} */ ([]))
  const [roles, setRoles] = useState(/** @type {any[]} */ ([]))
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState({ role: 'All Roles', district: 'All Districts', status: 'All Status' })
  const [currentPage, setCurrentPage] = useState(1)

  const [modalOpen, setModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState(/** @type {any} */ (null))
  const [form, setForm] = useState(emptyForm)
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)

  const loadData = async () => {
    setLoading(true)
    setError('')
    try {
      const [userData, roleData] = await Promise.all([getUsers(), getRoles()])
      setUsers(Array.isArray(userData) ? userData : [])
      setRoles(Array.isArray(roleData) ? roleData : [])
    } catch (err) {
      console.error('Failed to load users', err)
      setError(err.message || 'Could not load users.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let cancelled = false

    Promise.all([getUsers(), getRoles()])
      .then(([userData, roleData]) => {
        if (cancelled) return
        setUsers(Array.isArray(userData) ? userData : [])
        setRoles(Array.isArray(roleData) ? roleData : [])
        setError('')
      })
      .catch((err) => {
        if (cancelled) return
        console.error('Failed to load users', err)
        setError(err.message || 'Could not load users.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const adminCount = users.filter((u) => /admin/i.test(u.role?.roleName || '')).length

  const filtered = useMemo(() => {
    return users.filter((user) => {
      if (filters.role !== 'All Roles' && titleCase(user.role?.roleName) !== filters.role) return false
      if (searchQuery) {
        const haystack = `${user.name || ''} ${user.email || ''}`.toLowerCase()
        if (!haystack.includes(searchQuery.toLowerCase())) return false
      }
      return true
    })
  }, [users, filters.role, searchQuery])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageUsers = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const handleSearch = (event) => {
    setSearchQuery(event.target.value)
    setCurrentPage(1)
  }

  const handleFilterChange = (event) => {
    const { name, value } = event.target
    setFilters((prev) => ({ ...prev, [name]: value }))
    setCurrentPage(1)
  }

  const handleClearFilters = () => {
    setSearchQuery('')
    setFilters({ role: 'All Roles', district: 'All Districts', status: 'All Status' })
  }

  const openAddModal = () => {
    setEditingUser(null)
    setForm(emptyForm)
    setFormError('')
    setModalOpen(true)
  }

  const openEditModal = (user) => {
    setEditingUser(user)
    setForm({
      name: user.name || '',
      email: user.email || '',
      password: '',
      roleId: user.role?.id ?? '',
    })
    setFormError('')
    setModalOpen(true)
  }

  const handleSubmitForm = async (e) => {
    e.preventDefault()
    setFormError('')
    setSaving(true)
    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        roleId: Number(form.roleId),
      }
      if (!payload.name || !payload.email) {
        throw new Error('Name and email are required.')
      }
      if (!editingUser) {
        if (!form.password) throw new Error('A password is required for new users.')
        payload.password = form.password
        await createUser(payload)
      } else {
        if (form.password) payload.password = form.password
        await updateUser(editingUser.id, payload)
      }
      setModalOpen(false)
      await loadData()
    } catch (err) {
      console.error('Failed to save user', err)
      setFormError(err.message || 'Could not save the user.')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteUser = async (user) => {
    if (!window.confirm(`Delete user "${user.name}"? This action cannot be undone.`)) return
    try {
      await deleteUser(user.id)
      await loadData()
    } catch (err) {
      console.error('Failed to delete user', err)
      setError(err.message || 'Could not delete the user.')
    }
  }

  const roleOptions = ['All Roles', ...roles.map((r) => titleCase(r.roleName))]

  return (
    <div className="flex">
      <AdminSidebar />
      <main className="lg:ml-64 min-h-screen bg-[#f8f9ff] text-slate-900">
      <div className="max-w-[1280px] mx-auto px-4 pt-24 pb-8 md:px-8 lg:pt-8">
        <header className="mb-8 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <nav className="mb-3 flex flex-wrap items-center gap-2 text-sm text-slate-500">
                <span>Admin Portal</span>
                <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                <span className="font-semibold text-slate-900">User Management</span>
              </nav>
              <h1 className="text-3xl font-semibold text-[#00236f]">Officer & Staff Directory</h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
                Manage credentials and access levels for registered government officials, social workers, and law enforcement officers.
              </p>
              {loading && <p className="mt-3 text-sm text-slate-500">Loading staff directory...</p>}
              {error && !loading && <p className="mt-3 text-sm text-red-600">{error}</p>}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative w-full sm:w-72">
                <label htmlFor="user-search" className="sr-only">Search users</label>
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                <input
                  id="user-search"
                  name="search"
                  value={searchQuery}
                  onChange={handleSearch}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 focus:border-[#00236f] focus:outline-none focus:ring-2 focus:ring-[#00236f]/10"
                  placeholder="Search by name or email..."
                  aria-label="Search users by name or email"
                />
              </div>
              <button
                type="button"
                onClick={openAddModal}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#00236f] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1e3a8a]"
              >
                <span className="material-symbols-outlined">person_add</span>
                Add New User
              </button>
            </div>
          </div>
        </header>

        <section className="grid gap-5 md:grid-cols-4 mb-8">
          <article className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eff6ff] text-[#00236f]">
                <span className="material-symbols-outlined">badge</span>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Total Staff</p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">{users.length}</p>
              </div>
            </div>
          </article>

          <article className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ecfdf5] text-[#047857]">
                <span className="material-symbols-outlined">verified_user</span>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Non-Admin Staff</p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">{users.length - adminCount}</p>
              </div>
            </div>
          </article>

          <article className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fef3c7] text-[#a16207]">
                <span className="material-symbols-outlined">admin_panel_settings</span>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Administrators</p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">{adminCount}</p>
              </div>
            </div>
          </article>

          <article className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fee2e2] text-[#b91c1c]">
                <span className="material-symbols-outlined">badge</span>
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-slate-500">Access Roles</p>
                <p className="mt-2 text-3xl font-semibold text-slate-900">{roles.length}</p>
              </div>
            </div>
          </article>
        </section>

        <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm mb-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-3">
                <label htmlFor="filter-role" className="text-sm font-semibold text-slate-500">Role:</label>
                <select
                  id="filter-role"
                  name="role"
                  value={filters.role}
                  onChange={handleFilterChange}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-[#00236f] focus:ring-2 focus:ring-[#00236f]/10"
                >
                  {roleOptions.map((role) => (
                    <option key={role}>{role}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-3">
                <label htmlFor="filter-status" className="text-sm font-semibold text-slate-500">Status:</label>
                <select
                  id="filter-status"
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-[#00236f] focus:ring-2 focus:ring-[#00236f]/10"
                >
                  <option>All Status</option>
                  <option>Active</option>
                </select>
              </div>
            </div>
            <button
              type="button"
              onClick={handleClearFilters}
              className="text-sm font-semibold text-[#00236f] hover:underline"
            >
              Clear All
            </button>
          </div>
        </section>

        <section className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto custom-scrollbar">
            <table className="min-w-full border-collapse text-left">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Name & Email</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Role</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Status</th>
                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {pageUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#eff6ff] text-[#00236f] font-bold">
                          {(user.name || '?').charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{user.name}</p>
                          <p className="text-sm text-slate-500">ID: {user.id} · {user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-slate-700">
                        <span className="material-symbols-outlined text-[18px] text-[#00236f]">psychology</span>
                        <span>{titleCase(user.role?.roleName)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700">
                        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" aria-hidden="true" />
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEditModal(user)}
                          className="inline-flex items-center gap-1 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
                        >
                          <span className="material-symbols-outlined text-[16px]">edit</span>
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteUser(user)}
                          className="inline-flex items-center gap-1 rounded-2xl border border-red-200 bg-white px-3 py-2 text-sm font-semibold text-red-700 hover:bg-red-50"
                        >
                          <span className="material-symbols-outlined text-[16px]">delete</span>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {!loading && pageUsers.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-sm text-slate-500">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="border-t border-slate-200 bg-slate-50 px-6 py-4 md:flex md:items-center md:justify-between">
            <p className="text-sm text-slate-600">Showing {filtered.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1} to {Math.min(currentPage * PAGE_SIZE, filtered.length)} of {filtered.length} staff</p>
            <div className="mt-3 flex flex-wrap items-center gap-2 md:mt-0">
              <button
                type="button"
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-40"
                disabled={currentPage === 1}
                aria-label="Previous page"
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`inline-flex h-10 min-w-[40px] items-center justify-center rounded-2xl border border-slate-200 bg-white text-sm font-semibold transition ${
                    currentPage === page ? 'bg-[#00236f] text-white' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                  aria-label={`Go to page ${page}`}
                >
                  {page}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
                disabled={currentPage === totalPages}
                aria-label="Next page"
              >
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>
        </section>
      </div>
      </main>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4" role="dialog" aria-modal="true">
          <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-[28px] bg-white p-8 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-[#00236f]">{editingUser ? 'Edit User' : 'Add New User'}</h2>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full text-slate-500 hover:bg-slate-100"
                aria-label="Close modal"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {formError && (
              <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{formError}</div>
            )}

            <form onSubmit={handleSubmitForm} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="user-name" className="text-sm font-semibold text-slate-700">Full Name</label>
                <input
                  id="user-name"
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  required
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-[#00236f] focus:ring-2 focus:ring-[#00236f]/10 focus:outline-none"
                  placeholder="e.g. Chisomo Phiri"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="user-email" className="text-sm font-semibold text-slate-700">Email Address</label>
                <input
                  id="user-email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                  required
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-[#00236f] focus:ring-2 focus:ring-[#00236f]/10 focus:outline-none"
                  placeholder="name@gender.gov.mw"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="user-password" className="text-sm font-semibold text-slate-700">
                  {editingUser ? 'New Password (optional)' : 'Password'}
                </label>
                <input
                  id="user-password"
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  required={!editingUser}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-[#00236f] focus:ring-2 focus:ring-[#00236f]/10 focus:outline-none"
                  placeholder={editingUser ? 'Leave blank to keep current password' : '••••••••'}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="user-role" className="text-sm font-semibold text-slate-700">Role</label>
                <select
                  id="user-role"
                  value={form.roleId}
                  onChange={(e) => setForm((f) => ({ ...f, roleId: e.target.value }))}
                  required
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-[#00236f] focus:ring-2 focus:ring-[#00236f]/10 focus:outline-none"
                >
                  <option value="" disabled>Select a role...</option>
                  {roles.map((role) => (
                    <option key={role.id} value={role.id}>{titleCase(role.roleName)}</option>
                  ))}
                </select>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 rounded-2xl bg-[#00236f] px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-[#1e3a8a] disabled:opacity-60"
                >
                  {saving ? 'Saving...' : editingUser ? 'Save Changes' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default UserManagement
