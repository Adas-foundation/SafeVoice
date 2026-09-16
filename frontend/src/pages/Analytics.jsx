import { useEffect, useMemo, useState } from 'react'
import AdminSidebar from '../components/AdminSidebar'
import Heatmap from '../components/Heatmap'
import { getReportsDashboard, getReports } from '../services/reportsApi'

const CATEGORY_LABELS = {
  domestic: 'Domestic Violence',
  sexual: 'Sexual Assault',
  child: 'Child Protection',
  harassment: 'Harassment',
  other: 'Other',
}

const CATEGORY_COLORS = {
  domestic: 'bg-[#00236f]',
  sexual: 'bg-[#006a63]',
  child: 'bg-[#d97706]',
  harassment: 'bg-[#ba1a1a]',
  other: 'bg-slate-400',
}

function parseField(description, field) {
  const match = String(description || '').match(new RegExp(`${field}:\\s*(.+)`))
  return match ? match[1].trim() : ''
}

function categoryKey(description) {
  const type = parseField(description, 'Incident Type').toLowerCase()
  return CATEGORY_LABELS[type] ? type : 'other'
}

const Analytics = () => {
  const [stats, setStats] = useState(/** @type {any} */ (null))
  const [reports, setReports] = useState(/** @type {any[]} */ ([]))
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    Promise.all([getReportsDashboard(), getReports()])
      .then(([statsData, reportsData]) => {
        if (cancelled) return
        setStats(statsData)
        setReports(Array.isArray(reportsData) ? reportsData : [])
      })
      .catch((err) => {
        if (cancelled) return
        console.error('Failed to load analytics data', err)
        setError(err.message || 'Could not load analytics data.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const totalCases = stats?.totalCases ?? reports.length ?? 0

  const categories = useMemo(() => {
    const counts = { domestic: 0, sexual: 0, child: 0, harassment: 0, other: 0 }
    reports.forEach((report) => {
      counts[categoryKey(report.description)] += 1
    })
    return Object.entries(counts).map(([key, count]) => ({
      key,
      label: CATEGORY_LABELS[key],
      count,
      percent: totalCases ? Math.round((count / totalCases) * 100) : 0,
      color: CATEGORY_COLORS[key],
    }))
  }, [reports, totalCases])

  const districtIntensity = useMemo(() => {
    const counts = new Map()
    reports.forEach((report) => {
      const name = report.district?.name || 'Unknown'
      counts.set(name, (counts.get(name) || 0) + 1)
    })
    return Array.from(counts.entries())
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
  }, [reports])

  const topOfficers = useMemo(() => {
    const counts = new Map()
    reports.forEach((report) => {
      const name = report.assignedUser?.name
      if (!name) return
      counts.set(name, (counts.get(name) || 0) + 1)
    })
    return Array.from(counts.entries())
      .map(([name, solved]) => ({ name, solved }))
      .sort((a, b) => b.solved - a.solved)
      .slice(0, 3)
  }, [reports])

  const maxDistrict = Math.max(1, ...districtIntensity.map((d) => d.count))

  return (
    <div className="flex">
      <AdminSidebar />
      <main className="lg:ml-64 min-h-screen bg-[#f8f9ff] text-slate-900">
      <div className="max-w-[1280px] mx-auto px-4 pt-24 pb-8 md:px-8 lg:pt-8">
        <header className="mb-8 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Admin Portal</p>
              <h1 className="text-3xl md:text-4xl font-semibold text-[#00236f]">Analytics Dashboard</h1>
              <p className="max-w-2xl text-base leading-7 text-slate-600">
                Real-time surveillance, social monitoring, and incident data across Malawi.
              </p>
              {loading && <p className="text-sm text-slate-500">Loading analytics data...</p>}
              {error && !loading && <p className="text-sm text-red-600">{error}</p>}
            </div>

            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#1e3a8a] text-white font-semibold">
                AM
              </div>
            </div>
          </div>
        </header>

        <section aria-labelledby="analytics-kpis" className="grid gap-5 md:grid-cols-4 mb-8">
          <article className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eff6ff] text-[#1e3a8a]">
                <span className="material-symbols-outlined">description</span>
              </span>
            </div>
            <p className="text-sm uppercase tracking-[0.18em] text-slate-500">Total Reports</p>
            <p className="mt-3 text-3xl font-semibold text-[#00236f]">{totalCases}</p>
          </article>

          <article className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fef3c7] text-[#a16207]">
                <span className="material-symbols-outlined">pending_actions</span>
              </span>
            </div>
            <p className="text-sm uppercase tracking-[0.18em] text-slate-500">Under Review</p>
            <p className="mt-3 text-3xl font-semibold text-[#00236f]">{stats?.underReview ?? 0}</p>
          </article>

          <article className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#ecfdf5] text-[#047857]">
                <span className="material-symbols-outlined">fiber_new</span>
              </span>
            </div>
            <p className="text-sm uppercase tracking-[0.18em] text-slate-500">New (Submitted)</p>
            <p className="mt-3 text-3xl font-semibold text-[#00236f]">{stats?.submitted ?? 0}</p>
          </article>

          <article className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#dbeafe] text-[#1e3a8a]">
                <span className="material-symbols-outlined">check_circle</span>
              </span>
            </div>
            <p className="text-sm uppercase tracking-[0.18em] text-slate-500">Resolved</p>
            <p className="mt-3 text-3xl font-semibold text-[#00236f]">{stats?.resolved ?? 0}</p>
          </article>
        </section>

        <section className="grid gap-5 xl:grid-cols-[8fr_4fr] mb-8">
          <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-[#00236f]">Case Categories</h2>
                <p className="text-sm text-slate-500">Breakdown of reported cases by incident type.</p>
              </div>
            </div>
            <div className="space-y-5">
              {categories.map((cat) => (
                <div key={cat.key} className="space-y-2">
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>{cat.label}</span>
                    <span className="font-semibold text-[#00236f]">{cat.count} ({cat.percent}%)</span>
                  </div>
                  <div className="h-8 overflow-hidden rounded-full bg-slate-200">
                    <div className={`h-full ${cat.color}`} style={{ width: `${cat.percent}%` }} />
                  </div>
                </div>
              ))}
              {!loading && totalCases === 0 && (
                <p className="text-sm text-slate-500">No reports yet.</p>
              )}
            </div>
          </article>

          <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-[#00236f]">District Intensity</h2>
              <p className="text-sm text-slate-500">Report distribution across districts.</p>
            </div>
            {districtIntensity.length === 0 ? (
              <p className="text-sm text-slate-500">No district data available.</p>
            ) : (
              <div className="space-y-4">
                {districtIntensity.map((district, i) => (
                  <div key={district.name}>
                    <div className="flex justify-between text-sm text-slate-500">
                      <span>{district.name}</span>
                      <span className="font-semibold text-[#00236f]">{district.count} cases</span>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200">
                      <div
                        className={`h-full ${i === 0 ? 'bg-[#ba1a1a]' : 'bg-[#00236f]'}`}
                        style={{ width: `${Math.max(8, (district.count / maxDistrict) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </article>
        </section>

        {/* Dedicated Malawi heatmap — district/ward-level aggregation with
            minimum-count suppression applied before anything renders. */}
        <section className="mb-8">
          <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <Heatmap reports={reports} />
          </article>
        </section>

        <section className="grid gap-5 lg:grid-cols-2 mb-8">
          <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-[#00236f]">Report Status Distribution</h2>
              <span className="material-symbols-outlined text-slate-400">more_horiz</span>
            </div>
            <div className="space-y-5">
              {[
                { label: 'New (Submitted)', value: stats?.submitted ?? 0, color: 'bg-[#00236f]' },
                { label: 'Under Review', value: stats?.underReview ?? 0, color: 'bg-[#006a63]' },
                { label: 'Assigned', value: stats?.assigned ?? 0, color: 'bg-[#d97706]' },
                { label: 'Resolved', value: stats?.resolved ?? 0, color: 'bg-[#ba1a1a]' },
              ].map((item) => (
                <div key={item.label} className="space-y-2">
                  <div className="flex justify-between text-sm text-slate-600">
                    <span>{item.label}</span>
                    <span className="font-semibold text-[#00236f]">{item.value} ({totalCases ? Math.round((item.value / totalCases) * 100) : 0}%)</span>
                  </div>
                  <div className="h-8 overflow-hidden rounded-full bg-slate-200">
                    <div
                      className={`h-full ${item.color}`}
                      style={{ width: `${totalCases ? Math.max(2, (item.value / totalCases) * 100) : 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-[#00236f]">Top Performing Officers</h2>
            </div>
            {topOfficers.length === 0 ? (
              <p className="text-sm text-slate-500">No cases assigned yet.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500">
                      <th className="py-4 font-semibold">Officer Name</th>
                      <th className="py-4 font-semibold">Solved</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {topOfficers.map((officer, i) => (
                      <tr key={officer.name} className="hover:bg-slate-50 transition-colors">
                        <td className="py-4 flex items-center gap-3">
                          <span className={`inline-flex h-8 w-8 items-center justify-center rounded-full font-semibold ${
                            i === 0 ? 'bg-[#d9f8f0] text-[#047857]' : 'bg-[#dbeafe] text-[#1e3a8a]'
                          }`}>
                            {officer.name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase()}
                          </span>
                          <span className="font-medium text-slate-900">{officer.name}</span>
                        </td>
                        <td className="py-4 font-semibold text-[#00236f]">{officer.solved}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </article>
        </section>
      </div>
    </main>
    </div>
  )
}

export default Analytics
