import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import BroadcastModal from '../components/BroadcastModal'
import { API_URL, authHeaders } from '../services/api'
import AdminSidebar from '../components/AdminSidebar'
import { getReports, getReportsDashboard } from '../services/reportsApi'
import { parseReportDescription, statusLabel, formatDateTime } from '../utils/parseReport'

const Dashboard = () => {
  const [stats, setStats] = useState(/** @type {any} */ (null))
  const [reports, setReports] = useState(/** @type {any[]} */ ([]))
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const user = JSON.parse(localStorage.getItem('safereport_user') || '{}')
  const firstName = user.name ? user.name.split(' ')[0] : 'Officer'

  useEffect(() => {
    let cancelled = false

    Promise.all([getReportsDashboard(), getReports()])
      .then(([statsData, reportsData]) => {
        if (cancelled) return
        setStats(statsData)
        setReports(Array.isArray(reportsData) ? reportsData : [])
      })
      .catch((err) => {
        console.error('Failed to load dashboard data', err)
        if (!cancelled) setError(err.message || 'Failed to load dashboard data.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const emergencyCount = useMemo(
    () => reports.filter((r) => parseReportDescription(r.description).needsEmergencyHelp).length,
    [reports]
  )

  const categoryCounts = useMemo(() => {
    const counts = {}
    reports.forEach((r) => {
      const type = parseReportDescription(r.description).incidentType || 'General Report'
      counts[type] = (counts[type] || 0) + 1
    })
    const total = reports.length || 1
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count, pct: Math.round((count / total) * 100) }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 4)
  }, [reports])

  const districtCounts = useMemo(() => {
    const counts = {}
    reports.forEach((r) => {
      const name = r.district?.name || 'Unassigned'
      counts[name] = (counts[name] || 0) + 1
    })
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
  }, [reports])

  const recentReports = useMemo(
    () =>
      [...reports]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 3),
    [reports]
  )

  const totalCases = stats?.totalCases ?? reports.length
  const activeCases = (stats?.assigned || 0) + (stats?.underReview || 0)
  const resolved = stats?.resolved || 0
  const pendingReviews = stats?.submitted || 0

  const topDistricts = districtCounts.slice(0, 3)
  const totalForPct = totalCases || 1

  const navigate = useNavigate()
  const [broadcastOpen, setBroadcastOpen] = useState(false)

  function openRoute(path) {
    navigate(path)
  }

  async function handleExportCsv() {
    try {
      const res = await fetch(`${API_URL}/reports/export`, {
        method: 'GET',
        headers: authHeaders(),
      })
      if (!res.ok) {
        const errText = await res.text().catch(() => res.statusText)
        throw new Error(errText || `Export failed (${res.status})`)
      }
      const blob = await res.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `safereport-export-${new Date().toISOString().slice(0,19)}.csv`
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Export CSV failed', err)
      alert(err.message || 'Failed to export CSV.')
    }
  }

  function handleOpenBroadcast() {
    setBroadcastOpen(true)
  }

  function handleCloseBroadcast() {
    setBroadcastOpen(false)
  }

  return (
    <div className="flex">
      <AdminSidebar />
      <main className="lg:ml-64 flex-1 max-w-7xl mx-auto px-4 pt-24 pb-8 md:px-8 lg:pt-8 text-slate-900">
        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}
        {loading ? (
          <div className="flex items-center justify-center py-32 text-slate-500">
            <span className="material-symbols-outlined animate-spin mr-2">sync</span>
            Loading dashboard...
          </div>
        ) : (
          <section className="space-y-8">
            <header className="bg-white p-6 rounded-[28px] shadow-sm flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-slate-500 font-medium">Admin Portal</p>
                <h1 className="mt-3 text-3xl md:text-4xl font-semibold text-[#00236f]">Welcome back, {firstName}</h1>
                <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
                  Here is an overview of the current response status in Malawi. Review the latest reports, alerts, and district activity in one place.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="text-right sm:text-left">
                  <p className="font-semibold text-slate-900">{user.name || 'Command Center'}</p>
                  <p className="text-sm text-slate-500">Central Region, Malawi</p>
                </div>
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#1e3a8a] flex items-center justify-center bg-[#eff6ff] text-[#1e3a8a] font-bold">
                  {(user.name || 'A').slice(0, 2).toUpperCase()}
                </div>
              </div>
            </header>

            <section aria-labelledby="dashboard-summary" className="grid gap-5 grid-cols-1 md:grid-cols-3 xl:grid-cols-5">
              <article className="bg-white rounded-[28px] shadow-sm p-6 border border-slate-200">
                <p className="text-sm font-medium uppercase text-slate-500">Total Reports</p>
                <div className="mt-4 flex items-end justify-between gap-4">
                  <p className="text-3xl font-semibold text-[#00236f]">{totalCases}</p>
                  <span className="text-sm font-semibold text-emerald-600">Live</span>
                </div>
              </article>

              <article className="bg-white rounded-[28px] shadow-sm p-6 border border-slate-200">
                <p className="text-sm font-medium uppercase text-slate-500">Active Cases</p>
                <div className="mt-4 flex items-end justify-between gap-4">
                  <p className="text-3xl font-semibold text-[#00236f]">{activeCases}</p>
                  <span className="text-sm font-semibold text-amber-700">Ongoing</span>
                </div>
              </article>

              <article className="rounded-[28px] bg-[#fee2e2] shadow-sm p-6 border border-[#fecaca]">
                <p className="text-sm font-bold uppercase text-[#991b1b]">Emergency Alerts</p>
                <div className="mt-4 flex items-end justify-between gap-4">
                  <p className="text-3xl font-semibold text-[#991b1b]">{emergencyCount}</p>
                  <span className="h-2 w-2 rounded-full bg-[#991b1b] animate-pulse self-end" aria-hidden="true" />
                </div>
              </article>

              <article className="bg-white rounded-[28px] shadow-sm p-6 border border-slate-200">
                <p className="text-sm font-medium uppercase text-slate-500">Resolved Cases</p>
                <div className="mt-4 flex items-end justify-between gap-4">
                  <p className="text-3xl font-semibold text-[#006a63]">{resolved}</p>
                  <span className="material-symbols-outlined text-[#006a63]">check_circle</span>
                </div>
              </article>

              <article className="bg-white rounded-[28px] shadow-sm p-6 border border-slate-200">
                <p className="text-sm font-medium uppercase text-slate-500">Pending Reviews</p>
                <div className="mt-4 flex items-end justify-between gap-4">
                  <p className="text-3xl font-semibold text-[#8b5cf6]">{pendingReviews}</p>
                  <span className="rounded-full bg-[#fde68a] px-3 py-1 text-[11px] font-semibold text-[#78350f]">QUEUED</span>
                </div>
              </article>
            </section>

            <section className="grid gap-5 xl:grid-cols-[5fr_7fr]">
              <article className="bg-white rounded-[28px] shadow-sm p-6 flex flex-col">
                <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 id="regional-distribution" className="text-2xl font-semibold text-[#00236f]">Regional Distribution</h2>
                    <p className="mt-2 text-sm text-slate-500">Malawi alert heatmap and risk distribution.</p>
                  </div>
                  <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-700">
                    LIVE
                  </span>
                </div>

                <div className="relative flex-1 overflow-hidden rounded-3xl bg-slate-100 p-4 flex items-center justify-center">
                  <img
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuD3Ph7mwSBQ5FnUghwLqzj2MmBHBjgWgpC-pwbELm4yJ3lPFobpcNgFA8yuusSX_KE2vw9fPejXjSGWPj3faDitJygRuSjAGulRtI6MniwnYDNEP7y0-uJGitozFJyn34t1flFkpYGGEHWLK4Kw_tK-PB4JIxAb2sBS6iC8PJh-YbvXvrJ86a31u7nqMD8umooiuaa_xtr2aX1aBgOhIll3TAvXuZ5gO4I0A9X1v9jhHOGNdsm5igvr6oJhR7wPli82soCnrf-OIA"
                    alt="Heatmap of Malawi with alert hotspots highlighted"
                    className="max-h-full opacity-40 mix-blend-multiply"
                  />
                  <div className="pointer-events-none absolute inset-0">
                    <span className="absolute top-1/4 left-1/2 h-12 w-12 -translate-x-1/2 rounded-full bg-[#b91c1c]/30 blur-xl animate-pulse" aria-hidden="true" />
                    <span className="absolute top-1/2 left-1/3 h-8 w-8 rounded-full bg-[#b91c1c]/20 blur-xl animate-pulse delay-75" aria-hidden="true" />
                    <span className="absolute bottom-1/4 right-1/4 h-10 w-10 rounded-full bg-[#b91c1c]/25 blur-xl animate-pulse delay-150" aria-hidden="true" />
                  </div>
                  <div className="absolute bottom-4 left-4 rounded-2xl bg-white/85 backdrop-blur p-3 text-[11px] shadow-sm">
                    <p className="font-semibold text-slate-900 border-b border-slate-200 pb-2 mb-2">Top District</p>
                    <div className="flex items-center gap-2 text-slate-600">
                      <span className="h-2 w-2 rounded-full bg-[#991b1b]" />
                      {topDistricts[0]?.name || 'N/A'}
                    </div>
                  </div>
                </div>
              </article>

              <div className="grid gap-5">
                <article className="bg-white rounded-[28px] shadow-sm p-6">
                  <h2 className="text-xl font-semibold text-[#00236f] mb-4">Cases by Category</h2>
                  <div className="space-y-4">
                    {categoryCounts.length === 0 && (
                      <p className="text-sm text-slate-500">No case categories yet.</p>
                    )}
                    {categoryCounts.map((cat) => (
                      <div key={cat.name}>
                        <div className="mb-2 flex justify-between text-xs font-semibold text-slate-600">
                          <span>{cat.name}</span>
                          <span>{cat.pct}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                          <div className="h-full rounded-full bg-[#00236f]" style={{ width: `${cat.pct}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </article>

                <div className="grid gap-5 md:grid-cols-2">
                  <article className="bg-white rounded-[28px] shadow-sm p-6 flex flex-col items-center text-center">
                    <h3 className="text-sm uppercase tracking-[0.16em] text-slate-500 font-semibold mb-4">District Share</h3>
                    <div className="relative flex h-24 w-24 items-center justify-center rounded-full border-[12px] border-[#00236f] border-r-slate-100 border-b-[#0ea5e9]">
                      <span className="absolute text-[10px] font-bold text-slate-700">TOP 3</span>
                    </div>
                    <div className="mt-4 space-y-2 text-xs text-slate-700">
                      {topDistricts.map((d, i) => (
                        <div key={d.name} className="flex items-center gap-2 justify-center">
                          <span className={`h-2 w-2 rounded-full ${i === 0 ? 'bg-[#00236f]' : i === 1 ? 'bg-[#006a63]' : 'bg-[#0ea5e9]'}`} />
                          {d.name} ({Math.round((d.count / totalForPct) * 100)}%)
                        </div>
                      ))}
                      {topDistricts.length === 0 && <p className="text-slate-400">No data</p>}
                    </div>
                  </article>

                  <article className="bg-[#1e3a8a] text-white rounded-[28px] shadow-sm p-6">
                    <p className="text-[11px] uppercase tracking-[0.24em] text-slate-200 opacity-90 mb-4">Quick Actions</p>
                    <div className="grid grid-cols-2 gap-3">
                      <button onClick={handleExportCsv} type="button" className="flex flex-col items-center justify-center gap-2 rounded-3xl bg-white/10 px-3 py-4 text-sm font-semibold hover:bg-white/20 transition">
                        <span className="material-symbols-outlined">download</span>
                        <span>Export CSV</span>
                      </button>
                      <button onClick={handleOpenBroadcast} type="button" className="flex flex-col items-center justify-center gap-2 rounded-3xl bg-white/10 px-3 py-4 text-sm font-semibold hover:bg-white/20 transition">
                        <span className="material-symbols-outlined">send</span>
                        <span>Broadcast</span>
                      </button>
                      <button type="button" onClick={() => openRoute('/user-management')} className="flex flex-col items-center justify-center gap-2 rounded-3xl bg-white/10 px-3 py-4 text-sm font-semibold hover:bg-white/20 transition">
                        <span className="material-symbols-outlined">person_add</span>
                        <span>Add Staff</span>
                      </button>
                      <button type="button" onClick={() => openRoute('/settings')} className="flex flex-col items-center justify-center gap-2 rounded-3xl bg-white/10 px-3 py-4 text-sm font-semibold hover:bg-white/20 transition">
                        <span className="material-symbols-outlined">settings</span>
                        <span>System</span>
                      </button>
                    </div>
                  </article>
                  {broadcastOpen && (
                    <BroadcastModal isOpen={broadcastOpen} onClose={handleCloseBroadcast} onSent={() => alert('Broadcast sent')} />
                  )}
                </div>
              </div>
            </section>

            <section className="grid gap-5 xl:grid-cols-[2.4fr_1fr]">
              <article className="bg-white rounded-[28px] shadow-sm p-6">
                <div className="mb-6 flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-semibold text-[#00236f]">Recent Activity</h2>
                    <p className="text-sm text-slate-500">Latest case updates and alert activity.</p>
                  </div>
                  <button type="button" onClick={() => openRoute('/case-management')} className="text-[#00236f] text-sm font-semibold hover:underline">View All</button>
                </div>

                <div className="space-y-4">
                  {recentReports.length === 0 && (
                    <p className="text-sm text-slate-500">No recent reports.</p>
                  )}
                  {recentReports.map((report) => (
                    <div key={report.id} className="group flex items-center gap-4 rounded-[24px] border border-slate-200 p-4 hover:bg-slate-50 transition">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-full ${report.status?.toUpperCase?.() === 'RESOLVED' ? 'bg-[#d1fae5] text-[#047857]' : 'bg-[#fee2e2] text-[#991b1b]'}`}>
                        <span className="material-symbols-outlined" aria-hidden="true" style={{ fontVariationSettings: "'FILL' 1" }}>{report.status?.toUpperCase?.() === 'RESOLVED' ? 'check_circle' : 'priority_high'}</span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-slate-900">{report.referenceNumber} · {statusLabel(report.status)}</p>
                        <p className="text-sm text-slate-500 truncate">{parseReportDescription(report.description).incidentType} — {report.district?.name || 'Unassigned'}</p>
                      </div>
                      <span className="text-[11px] text-slate-500 group-hover:text-[#00236f]">{formatDateTime(report.createdAt)}</span>
                    </div>
                  ))}
                </div>
              </article>

              <aside className="bg-white rounded-[28px] shadow-sm p-6">
                <div className="mb-6">
                  <h2 className="text-2xl font-semibold text-[#00236f]">District Status</h2>
                  <p className="text-sm text-slate-500">Live status across the most active districts.</p>
                </div>

                <div className="space-y-4">
                  {districtCounts.slice(0, 5).map((d, i) => (
                    <div key={d.name} className="flex items-center justify-between rounded-[20px] bg-slate-50 p-4">
                      <div className="flex items-center gap-3">
                        <span className={`h-2 w-2 rounded-full ${i === 0 ? 'bg-[#006a63]' : 'bg-[#fde68a]'}`} aria-hidden="true" />
                        <span className="font-medium text-slate-900">{d.name}</span>
                      </div>
                      <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-[#00236f]">{d.count}</span>
                    </div>
                  ))}
                  {districtCounts.length === 0 && (
                    <p className="text-sm text-slate-500">No district data yet.</p>
                  )}
                </div>

                <div className="mt-6 rounded-[24px] border border-[#bbf7d0] bg-[#f0fdf4] p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#065f46]">Government Compliance</p>
                  <p className="mt-2 text-sm leading-6 text-[#065f46]">System performing within Malawi government security protocols.</p>
                </div>
              </aside>
            </section>
          </section>
        )}

        <div className="fixed bottom-6 right-6 z-50">
          <button
            type="button"
            onClick={() => openRoute('/case-management')}
            className="group relative inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#ba1a1a] text-white shadow-lg transition-transform duration-200 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-[#fca5a5]/40"
            aria-label="Immediate Critical Monitoring"
          >
            <span className="material-symbols-outlined text-3xl animate-pulse" aria-hidden="true">emergency</span>
            <span className="pointer-events-none absolute -right-36 top-1/2 hidden -translate-y-1/2 rounded-2xl bg-[#ba1a1a] px-3 py-2 text-xs font-semibold text-white shadow-lg group-hover:block">
              Immediate Critical Monitoring
            </span>
          </button>
        </div>
      </main>
    </div>
  )
}

export default Dashboard;
