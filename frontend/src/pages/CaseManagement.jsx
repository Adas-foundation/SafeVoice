import { useState, useEffect, useMemo } from 'react'
import AdminSidebar from '../components/AdminSidebar'
import { getReports, updateReport, deleteReport, getCaseStatusHistory } from '../services/reportsApi'
import { getDistricts } from '../services/districtsApi'
import { parseReportDescription, victimLabel, statusLabel, statusVariant, formatDate, formatDateTime } from '../utils/parseReport'

const STATUS_OPTIONS = ['submitted', 'under_review', 'assigned', 'resolved']

export default function CaseManagement() {
  const [reports, setReports] = useState(/** @type {any[]} */ ([]))
  const [districts, setDistricts] = useState(/** @type {any[]} */ ([]))
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionMsg, setActionMsg] = useState('')

  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All Statuses')
  const [districtFilter, setDistrictFilter] = useState('All Districts')
  const [page, setPage] = useState(1)
  const pageSize = 8

  const [selectedReport, setSelectedReport] = useState(/** @type {any} */ (null))
  const [statusHistory, setStatusHistory] = useState(/** @type {any[]} */ ([]))
  const [updatingId, setUpdatingId] = useState(null)

  const loadReports = () => {
    setLoading(true)
    getReports()
      .then((data) => {
        setReports(Array.isArray(data) ? data : [])
        setError('')
      })
      .catch((err) => {
        console.error('Failed to load reports', err)
        setError(err.message || 'Failed to load reports.')
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    let cancelled = false

    getReports()
      .then((data) => {
        if (!cancelled) {
          setReports(Array.isArray(data) ? data : [])
          setError('')
        }
      })
      .catch((err) => {
        if (!cancelled) {
          console.error('Failed to load reports', err)
          setError(err.message || 'Failed to load reports.')
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    getDistricts()
      .then((data) => {
        if (!cancelled) setDistricts(Array.isArray(data) ? data : [])
      })
      .catch((err) => console.error('Failed to load districts', err))

    return () => {
      cancelled = true
    }
  }, [])

  const filtered = useMemo(() => {
    return reports.filter((c) => {
      const status = String(c.status || '').toUpperCase()
      if (statusFilter !== 'All Statuses' && status !== statusFilter.toUpperCase()) return false
      if (districtFilter !== 'All Districts' && (c.district?.name || '') !== districtFilter) return false
      if (query) {
        const parsed = parseReportDescription(c.description)
        const hay = `${c.referenceNumber} ${c.district?.name || ''} ${parsed.incidentType} ${victimLabel(c)}`
          .toLowerCase()
        if (!hay.includes(query.toLowerCase())) return false
      }
      return true
    })
  }, [reports, query, statusFilter, districtFilter])

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, pageCount)
  const pageItems = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize)

  const notify = (msg) => {
    setActionMsg(msg)
    setTimeout(() => setActionMsg(''), 3000)
  }

  const handleStatusChange = async (reportId, newStatus) => {
    setUpdatingId(reportId)
    try {
      await updateReport(reportId, { status: newStatus })
      notify('Case status updated.')
      loadReports()
    } catch (err) {
      console.error(err)
      notify(err.message || 'Failed to update status.')
    } finally {
      setUpdatingId(null)
    }
  }

  const handleDelete = async (reportId) => {
    if (!window.confirm('Are you sure you want to permanently delete this report?')) return
    try {
      await deleteReport(reportId)
      notify('Report deleted.')
      if (selectedReport?.id === reportId) setSelectedReport(null)
      loadReports()
    } catch (err) {
      console.error(err)
      notify(err.message || 'Failed to delete report.')
    }
  }

  const handleViewDetails = async (report) => {
    setSelectedReport(report)
    try {
      const history = await getCaseStatusHistory(report.id)
      setStatusHistory(Array.isArray(history) ? history : [])
    } catch (err) {
      console.error('Failed to load status history', err)
      setStatusHistory([])
    }
  }

  const handleExportCSV = () => {
    const header = ['Reference Number', 'Status', 'District', 'Victim', 'Type', 'Assigned Officer', 'Date Created']
    const rows = filtered.map((c) => [
      c.referenceNumber,
      statusLabel(c.status),
      c.district?.name || '',
      victimLabel(c),
      parseReportDescription(c.description).incidentType,
      c.assignedUser?.name || '',
      c.createdAt,
    ])
    const csv = [header, ...rows]
      .map((r) => r.map((v) => `"${String(v ?? '').replace(/"/g, '""')}"`).join(','))
      .join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'safe-report-cases.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  const parsedSelected = selectedReport ? parseReportDescription(selectedReport.description) : null

  return (
    <div className="flex">
      <AdminSidebar />
      <main className="lg:ml-64 flex-1 min-h-screen bg-background text-on-surface font-body-md pt-16 lg:pt-0">
        <header className="sticky top-16 lg:top-0 bg-surface-container-lowest z-40 border-b border-outline-variant px-margin-mobile lg:px-margin-desktop py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="font-headline-md text-headline-md text-primary font-semibold">Case Management</h2>
              <p className="text-on-surface-variant text-sm">Managing all active incident reports across Malawi districts</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                className="flex items-center gap-2 px-4 py-2 border border-outline text-on-surface-variant rounded-lg hover:bg-surface-container-low transition-colors font-medium"
                onClick={handleExportCSV}
              >
                <span className="material-symbols-outlined">download</span>
                Export CSV
              </button>
              <button
                className="flex items-center gap-2 px-4 py-2 border border-outline text-on-surface-variant rounded-lg hover:bg-surface-container-low transition-colors font-medium"
                onClick={() => window.print()}
              >
                <span className="material-symbols-outlined">picture_as_pdf</span>
                Print
              </button>
            </div>
          </div>

          {(error || actionMsg) && (
            <div className={`mt-4 rounded-lg p-3 text-sm ${error ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'}`}>
              {error || actionMsg}
            </div>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-4 px-0 md:px-0">
            <div className="relative flex-1 max-w-md">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">search</span>
              <input
                aria-label="Search cases"
                className="w-full pl-10 pr-4 py-2 bg-white border border-outline-variant rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                placeholder="Search Case ID, Victim Initials, or District..."
                value={query}
                onChange={(e) => { setQuery(e.target.value); setPage(1) }}
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                aria-label="Filter by status"
                className="bg-white border border-outline-variant rounded-xl px-4 py-2 text-sm text-on-surface focus:ring-primary focus:border-primary"
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setPage(1) }}
              >
                <option>All Statuses</option>
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>{statusLabel(s)}</option>
                ))}
              </select>
              <select
                aria-label="Filter by district"
                className="bg-white border border-outline-variant rounded-xl px-4 py-2 text-sm text-on-surface focus:ring-primary focus:border-primary"
                value={districtFilter}
                onChange={(e) => { setDistrictFilter(e.target.value); setPage(1) }}
              >
                <option>All Districts</option>
                {districts.map((d) => (
                  <option key={d.id} value={d.name}>{d.name}</option>
                ))}
              </select>
            </div>
          </div>
        </header>

        <div className="p-margin-mobile lg:p-margin-desktop flex-1">
          <div className="bg-white rounded-2xl shadow-sm border border-outline-variant overflow-hidden">
            {loading ? (
              <div className="flex items-center justify-center py-24 text-on-surface-variant">
                <span className="material-symbols-outlined animate-spin mr-2">sync</span>
                Loading cases...
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-surface-container-low border-b border-outline-variant">
                      <th scope="col" className="px-6 py-4 font-semibold text-on-surface-variant text-sm">Case ID</th>
                      <th scope="col" className="px-6 py-4 font-semibold text-on-surface-variant text-sm">Victim</th>
                      <th scope="col" className="px-6 py-4 font-semibold text-on-surface-variant text-sm">Type</th>
                      <th scope="col" className="px-6 py-4 font-semibold text-on-surface-variant text-sm">District</th>
                      <th scope="col" className="px-6 py-4 font-semibold text-on-surface-variant text-sm">Status</th>
                      <th scope="col" className="px-6 py-4 font-semibold text-on-surface-variant text-sm">Officer</th>
                      <th scope="col" className="px-6 py-4 font-semibold text-on-surface-variant text-sm">Date</th>
                      <th scope="col" className="px-6 py-4 font-semibold text-on-surface-variant text-sm text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant">
                    {pageItems.length === 0 && (
                      <tr>
                        <td colSpan={8} className="px-6 py-16 text-center text-on-surface-variant text-sm">No cases match your filters.</td>
                      </tr>
                    )}
                    {pageItems.map((c) => {
                      const parsed = parseReportDescription(c.description)
                      return (
                        <tr key={c.id} className="hover:bg-surface-bright transition-colors group" onClick={() => handleViewDetails(c)}>
                          <td className="px-6 py-4">
                            <span className="font-mono font-bold text-primary">{c.referenceNumber}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="font-semibold text-on-surface">{victimLabel(c)}</span>
                              {parsed.victimAgeRange && <span className="text-xs text-on-surface-variant">Age: {parsed.victimAgeRange}</span>}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-on-surface">{parsed.incidentType}</td>
                          <td className="px-6 py-4 text-sm text-on-surface">{c.district?.name || '—'}</td>
                          <td className="px-6 py-4">
                            <select
                              aria-label={`Update status for ${c.referenceNumber}`}
                              value={String(c.status || 'submitted').toLowerCase()}
                              disabled={updatingId === c.id}
                              onChange={(e) => handleStatusChange(c.id, e.target.value)}
                              onClick={(e) => e.stopPropagation()}
                              className={`px-3 py-1 rounded-full text-[12px] font-semibold border-0 ${statusVariant(c.status)} cursor-pointer`}
                            >
                              {STATUS_OPTIONS.map((s) => (
                                <option key={s} value={s}>{statusLabel(s)}</option>
                              ))}
                            </select>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              {c.assignedUser ? (
                                <>
                                  <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center text-primary font-bold text-xs border border-outline-variant">
                                    {c.assignedUser.name?.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase() || '?'}
                                  </div>
                                  <span className="text-sm">{c.assignedUser.name}</span>
                                </>
                              ) : (
                                <span className="text-sm text-on-surface-variant">Unassigned</span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-on-surface-variant">{formatDate(c.createdAt)}</td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={(e) => { e.stopPropagation(); handleViewDetails(c) }}
                              className="bg-primary-container text-on-primary-container px-4 py-1.5 rounded-lg text-sm font-semibold hover:opacity-90 active:scale-95 transition-all"
                              aria-label={`View details for ${c.referenceNumber}`}
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}

            <div className="px-6 py-4 bg-surface-container-low border-t border-outline-variant flex items-center justify-between">
              <span className="text-sm text-on-surface-variant">Showing {pageItems.length} of {filtered.length} cases</span>
              <div className="flex items-center gap-2">
                <button
                  className="p-2 border border-outline-variant rounded-lg hover:bg-white transition-colors disabled:opacity-40"
                  disabled={currentPage === 1}
                  onClick={() => setPage(currentPage - 1)}
                  aria-label="Previous page"
                >
                  <span className="material-symbols-outlined">chevron_left</span>
                </button>
                {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    className={`w-9 h-9 flex items-center justify-center rounded-lg text-sm transition-colors ${currentPage === p ? 'bg-primary text-white font-semibold' : 'hover:bg-white text-on-surface font-medium'}`}
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </button>
                ))}
                <button
                  className="p-2 border border-outline-variant rounded-lg hover:bg-white transition-colors disabled:opacity-40"
                  disabled={currentPage === pageCount}
                  onClick={() => setPage(currentPage + 1)}
                  aria-label="Next page"
                >
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <footer className="mt-auto bg-primary text-on-primary px-margin-mobile lg:px-margin-desktop py-stack-lg flex flex-col md:flex-row justify-between items-center gap-base">
          <div className="text-center md:text-left">
            <span className="font-title-lg text-title-lg font-bold block mb-1">SafeReport Malawi</span>
            <p className="font-body-md text-body-md text-on-primary/80">© 2024 Adas Foundation, Community Development and Social Welfare - Government of Malawi</p>
          </div>
          <div className="flex gap-gutter">
            <a className="hover:text-on-primary transition-colors font-body-md text-body-md text-on-primary/80" href="/resources">Privacy Policy</a>
            <a className="hover:text-on-primary transition-colors font-body-md text-body-md text-on-primary/80" href="/contact">Help Desk</a>
            <a className="hover:text-on-primary transition-colors font-body-md text-body-md text-on-primary/80" href="/contact">Contact Us</a>
          </div>
        </footer>

        <div className="fixed bottom-8 right-8 z-[100]">
          <button
            className="bg-error text-white h-14 w-14 rounded-full shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all group overflow-hidden relative"
            aria-label="Urgent Alert"
            onClick={() => {
              const urgent = reports.filter((r) => String(r.status || '').toLowerCase() === 'submitted').length
              window.alert(`You have ${urgent} submitted report(s) awaiting review. Navigate to a case to take action.`)
            }}
          >
            <span className="material-symbols-outlined text-[28px] group-hover:hidden">emergency_share</span>
            <span className="hidden group-hover:block font-bold text-xs uppercase tracking-tighter">Alert</span>
            <div className="absolute inset-0 bg-white/20 animate-ping rounded-full"></div>
          </button>
        </div>

        {selectedReport && parsedSelected && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 p-4" onClick={() => setSelectedReport(null)}>
            <div className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl bg-white shadow-2xl" onClick={(e) => e.stopPropagation()}>
              <div className="sticky top-0 bg-[#00236f] text-white px-6 py-4 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold">Case Details</h3>
                  <p className="text-sm text-white/80 font-mono">{selectedReport.referenceNumber}</p>
                </div>
                <button onClick={() => setSelectedReport(null)} className="text-white hover:bg-white/20 rounded-lg p-1" aria-label="Close details">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              <div className="p-6 space-y-5">
                <div className="flex flex-wrap gap-3">
                  <span className={`px-3 py-1 rounded-full text-[12px] font-semibold ${statusVariant(selectedReport.status)}`}>{statusLabel(selectedReport.status)}</span>
                  {parsedSelected.needsEmergencyHelp && (
                    <span className="px-3 py-1 rounded-full text-[12px] font-semibold bg-[#fee2e2] text-[#991b1b]">Emergency</span>
                  )}
                  {parsedSelected.isAnonymous && (
                    <span className="px-3 py-1 rounded-full text-[12px] font-semibold bg-slate-100 text-slate-700">Anonymous</span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                  <div><span className="text-on-surface-variant block text-xs uppercase tracking-wider">Incident Type</span><p className="font-semibold">{parsedSelected.incidentType}</p></div>
                  <div><span className="text-on-surface-variant block text-xs uppercase tracking-wider">District</span><p className="font-semibold">{selectedReport.district?.name || '—'}</p></div>
                  <div><span className="text-on-surface-variant block text-xs uppercase tracking-wider">Victim</span><p className="font-semibold">{parsedSelected.victimName || 'Anonymous'}</p></div>
                  <div><span className="text-on-surface-variant block text-xs uppercase tracking-wider">Age / Gender</span><p className="font-semibold">{parsedSelected.victimAgeRange || '—'} / {parsedSelected.victimGender || '—'}</p></div>
                  <div><span className="text-on-surface-variant block text-xs uppercase tracking-wider">Assigned Officer</span><p className="font-semibold">{selectedReport.assignedUser?.name || 'Unassigned'}</p></div>
                  <div><span className="text-on-surface-variant block text-xs uppercase tracking-wider">Reported On</span><p className="font-semibold">{formatDateTime(selectedReport.createdAt)}</p></div>
                  <div><span className="text-on-surface-variant block text-xs uppercase tracking-wider">Incident Date/Time</span><p className="font-semibold">{parsedSelected.incidentDateTime || '—'}</p></div>
                  <div><span className="text-on-surface-variant block text-xs uppercase tracking-wider">Landmark</span><p className="font-semibold">{parsedSelected.landmark || '—'}</p></div>
                </div>

                <div>
                  <span className="text-on-surface-variant block text-xs uppercase tracking-wider mb-2">Report Details</span>
                  <p className="text-sm leading-6 whitespace-pre-line bg-surface-container-low rounded-lg p-4">{parsedSelected.details || 'No additional details provided.'}</p>
                </div>

                <div>
                  <span className="text-on-surface-variant block text-xs uppercase tracking-wider mb-2">Status History</span>
                  {statusHistory.length === 0 ? (
                    <p className="text-sm text-on-surface-variant">No status changes recorded yet.</p>
                  ) : (
                    <ul className="space-y-3">
                      {statusHistory.map((h) => (
                        <li key={h.id} className="flex items-center gap-3 text-sm">
                          <span className="w-2.5 h-2.5 rounded-full bg-primary" aria-hidden="true" />
                          <span className="font-semibold">{statusLabel(h.status)}</span>
                          <span className="text-on-surface-variant">· {formatDateTime(h.changed_at)}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="flex justify-end gap-3 pt-2 border-t border-outline-variant">
                  <button
                    className="px-4 py-2 rounded-lg border border-outline text-on-surface-variant hover:bg-surface-container-low transition-colors text-sm font-semibold"
                    onClick={() => setSelectedReport(null)}
                  >
                    Close
                  </button>
                  <button
                    className="px-4 py-2 rounded-lg bg-error text-white hover:opacity-90 transition-opacity text-sm font-semibold"
                    onClick={() => handleDelete(selectedReport.id)}
                  >
                    Delete Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
