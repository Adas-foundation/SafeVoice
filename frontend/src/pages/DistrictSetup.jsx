import { useEffect, useMemo, useState } from 'react'
import AdminSidebar from '../components/AdminSidebar'
import { getDistricts, createDistrict, deleteDistrict } from '../services/districtsApi'
import { getStations } from '../services/stationsApi'
import { getReports } from '../services/reportsApi'

function districtStatus(activeCases, stations) {
  if (stations.length === 0) return { label: 'Alert', style: 'bg-error-container text-on-error-container border-error/20' }
  if (activeCases === 0) return { label: 'Standby', style: 'bg-tertiary-fixed text-on-tertiary-fixed-variant border-tertiary/20' }
  return { label: 'Operational', style: 'bg-secondary/10 text-secondary border-secondary/20' }
}

const DistrictSetup = () => {
  const [districts, setDistricts] = useState(/** @type {any[]} */ ([]))
  const [stations, setStations] = useState(/** @type {any[]} */ ([]))
  const [reports, setReports] = useState(/** @type {any[]} */ ([]))
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchText, setSearchText] = useState('')
  const [regionFilter, setRegionFilter] = useState('All Regions')
  const [selectedId, setSelectedId] = useState(null)

  const [modalOpen, setModalOpen] = useState(false)
  const [newName, setNewName] = useState('')
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')

  const loadData = async () => {
    setLoading(true)
    setError('')
    try {
      const [districtData, stationData, reportData] = await Promise.all([
        getDistricts(),
        getStations(),
        getReports(),
      ])
      setDistricts(Array.isArray(districtData) ? districtData : [])
      setStations(Array.isArray(stationData) ? stationData : [])
      setReports(Array.isArray(reportData) ? reportData : [])
      setSelectedId((prev) => prev ?? (Array.isArray(districtData) ? districtData[0]?.id : null))
    } catch (err) {
      console.error('Failed to load district data', err)
      setError(err.message || 'Could not load district data.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let cancelled = false

    Promise.all([getDistricts(), getStations(), getReports()])
      .then(([districtData, stationData, reportData]) => {
        if (cancelled) return
        const list = Array.isArray(districtData) ? districtData : []
        setDistricts(list)
        setStations(Array.isArray(stationData) ? stationData : [])
        setReports(Array.isArray(reportData) ? reportData : [])
        setSelectedId((prev) => prev ?? list[0]?.id)
      })
      .catch((err) => {
        if (cancelled) return
        console.error('Failed to load district data', err)
        setError(err.message || 'Could not load district data.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => {
      cancelled = true
    }
  }, [])

  const rows = useMemo(() => {
    return districts.map((district) => {
      const districtStations = stations.filter((s) => s.district_id === district.id)
      const activeCases = reports.filter((r) => r.district?.id === district.id).length
      return {
        ...district,
        stations: districtStations,
        activeCases,
        status: districtStatus(activeCases, districtStations),
      }
    })
  }, [districts, stations, reports])

  const filteredDistricts = useMemo(() => {
    return rows.filter((district) => {
      const matchesSearch = district.name.toLowerCase().includes(searchText.toLowerCase())
      const matchesRegion = regionFilter === 'All Regions'
      return matchesSearch && matchesRegion
    })
  }, [rows, searchText, regionFilter])

  const selectedDistrict = rows.find((d) => d.id === selectedId) || null

  const handleSearchChange = (event) => setSearchText(event.target.value)
  const handleRegionChange = (event) => setRegionFilter(event.target.value)
  const handleClearSearch = () => {
    setSearchText('')
    setRegionFilter('All Regions')
  }

  const handleAddDistrict = () => {
    setNewName('')
    setFormError('')
    setModalOpen(true)
  }

  const handleSubmitAdd = async (e) => {
    e.preventDefault()
    setFormError('')
    setSaving(true)
    try {
      const name = newName.trim()
      if (!name) throw new Error('District name is required.')
      await createDistrict({ name })
      setModalOpen(false)
      await loadData()
    } catch (err) {
      console.error('Failed to create district', err)
      setFormError(err.message || 'Could not create the district.')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteDistrict = async (district) => {
    if (!window.confirm(`Delete district "${district.name}"? This will remove the district configuration.`)) return
    try {
      await deleteDistrict(district.id)
      await loadData()
    } catch (err) {
      console.error('Failed to delete district', err)
      setError(err.message || 'Could not delete the district.')
    }
  }

  const handleExport = () => {
    const header = 'District,Active Cases,Centers,Status'
    const lines = rows.map((d) => [d.name, d.activeCases, d.stations.length, d.status.label].join(','))
    const csv = [header, ...lines].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'district-setup.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="flex">
      <AdminSidebar />
      <main className="lg:ml-64 min-h-screen bg-[#f8f9ff] text-slate-900">
      <div className="max-w-7xl mx-auto px-4 pt-24 pb-8 md:px-8 lg:pt-8">
        <header className="mb-8 rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Admin Portal</p>
              <h1 className="mt-3 text-3xl font-semibold text-[#00236f]">District Setup</h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">
                Configure regional administrative controls, staffing, and live operations across Malawi districts.
              </p>
              {loading && <p className="mt-3 text-sm text-slate-500">Loading district data...</p>}
              {error && !loading && <p className="mt-3 text-sm text-red-600">{error}</p>}
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={handleAddDistrict}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#00236f] px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-[#1e3a8a]"
              >
                <span className="material-symbols-outlined">add</span>
                Add District
              </button>
              <button
                type="button"
                onClick={handleExport}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
              >
                <span className="material-symbols-outlined">download</span>
                Export CSV
              </button>
            </div>
          </div>
        </header>

        <div className="grid gap-6 xl:grid-cols-[7fr_5fr]">
          <div className="space-y-6">
            <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <div className="relative w-full sm:w-80">
                    <label htmlFor="district-search" className="sr-only">Search districts</label>
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">search</span>
                    <input
                      id="district-search"
                      value={searchText}
                      onChange={handleSearchChange}
                      className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 focus:border-[#00236f] focus:outline-none focus:ring-2 focus:ring-[#00236f]/10"
                      placeholder="Search districts"
                      aria-label="Search districts"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <label htmlFor="region-filter" className="text-sm font-semibold text-slate-500">Region:</label>
                    <select
                      id="region-filter"
                      value={regionFilter}
                      onChange={handleRegionChange}
                      className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm focus:border-[#00236f] focus:ring-2 focus:ring-[#00236f]/10"
                    >
                      <option>All Regions</option>
                      <option>Northern Region</option>
                      <option>Central Region</option>
                      <option>Southern Region</option>
                    </select>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="text-sm font-semibold text-[#00236f] hover:underline"
                >
                  Clear Filters
                </button>
              </div>
            </section>

            <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="overflow-x-auto custom-scrollbar">
                <table className="min-w-full border-collapse text-left">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">District</th>
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Active Cases</th>
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Centers</th>
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Status</th>
                      <th className="px-6 py-4 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 text-right">View</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredDistricts.map((district) => (
                      <tr
                        key={district.id}
                        onClick={() => setSelectedId(district.id)}
                        className={`cursor-pointer transition-colors hover:bg-slate-50 ${selectedDistrict?.id === district.id ? 'bg-slate-100' : ''}`}
                      >
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-semibold text-slate-900">{district.name}</p>
                            <p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">ID: {district.id}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900">{district.activeCases}</span>
                            <div className="h-2 w-20 overflow-hidden rounded-full bg-slate-200">
                              <div className="h-full rounded-full bg-[#00236f]" style={{ width: `${Math.min(100, district.activeCases)}%` }} />
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-700">{district.stations.length} Units</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex rounded-full border px-3 py-1 text-sm font-semibold ${district.status.style}`}>
                            {district.status.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right text-slate-500">
                          <span className="material-symbols-outlined">chevron_right</span>
                        </td>
                      </tr>
                    ))}
                    {!loading && filteredDistricts.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-sm text-slate-500">No districts found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 flex flex-col gap-3 border-t border-slate-200 pt-4 text-sm text-slate-600 md:flex-row md:items-center md:justify-between">
                <span>Showing {filteredDistricts.length} of {districts.length} districts</span>
              </div>
            </section>

            <section className="grid gap-5 md:grid-cols-3">
              <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="mb-4 flex items-start justify-between">
                  <div className="rounded-2xl bg-[#eff6ff] p-3 text-[#00236f]">
                    <span className="material-symbols-outlined">location_city</span>
                  </div>
                </div>
                <p className="text-sm uppercase tracking-[0.18em] text-slate-500">Total Districts</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">{districts.length}</p>
                <p className="mt-2 text-xs text-slate-500">Configured in the system</p>
              </article>
              <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="mb-4 flex items-start justify-between">
                  <div className="rounded-2xl bg-[#ecfdf5] p-3 text-[#047857]">
                    <span className="material-symbols-outlined">local_police</span>
                  </div>
                </div>
                <p className="text-sm uppercase tracking-[0.18em] text-slate-500">Response Stations</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">{stations.length}</p>
                <p className="mt-2 text-xs text-slate-500">Across all districts</p>
              </article>
              <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="mb-4 flex items-start justify-between">
                  <div className="rounded-2xl bg-[#ffdfa0] p-3 text-[#92400e]">
                    <span className="material-symbols-outlined">description</span>
                  </div>
                </div>
                <p className="text-sm uppercase tracking-[0.18em] text-slate-500">Total Reports</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">{reports.length}</p>
                <p className="mt-2 text-xs text-slate-500">Filed across Malawi</p>
              </article>
            </section>
          </div>

          <div className="space-y-6">
            <article className="sticky top-24 rounded-[28px] border border-primary/20 bg-white shadow-sm">
              <div className="rounded-t-[28px] bg-[#00236f] p-6 text-white">
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-2xl font-semibold">{selectedDistrict ? `${selectedDistrict.name} District` : 'District Overview'}</h2>
                  <span className="rounded-full bg-white/20 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.25em] text-white">
                    Active Focus
                  </span>
                </div>
              </div>
              <div className="relative h-40 overflow-hidden bg-[#d9e3f6]">
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#00236f] text-6xl opacity-40" style={{ fontVariationSettings: "'FILL' 1" }}>map</span>
                </div>
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur rounded-full px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-[#00236f] shadow-sm">
                  <span className="inline-flex h-2 w-2 rounded-full bg-red-500 animate-pulse mr-2" aria-hidden="true" />
                  LIVE OPERATIONS
                </div>
              </div>

              {!selectedDistrict ? (
                <div className="p-6 text-sm text-slate-500">Select a district to view details.</div>
              ) : (
                <div className="space-y-6 p-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Active Cases</p>
                      <p className="mt-2 text-2xl font-bold text-slate-900">{selectedDistrict.activeCases}</p>
                    </div>
                    <div className="rounded-2xl bg-slate-50 p-4">
                      <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500">Centers</p>
                      <p className="mt-2 text-2xl font-bold text-[#006a63]">{selectedDistrict.stations.length}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-3">Response Stations</p>
                    {selectedDistrict.stations.length === 0 ? (
                      <p className="text-sm text-slate-500">No response stations configured.</p>
                    ) : (
                      <div className="space-y-2">
                        {selectedDistrict.stations.map((station) => (
                          <div key={station.id} className="flex items-center justify-between rounded-2xl bg-slate-50 p-3">
                            <div className="flex items-center gap-2">
                              <span className="material-symbols-outlined text-[#00236f] text-lg">location_on</span>
                              <span className="text-sm font-medium text-slate-900">{station.name}</span>
                            </div>
                            <span className="rounded-full bg-[#d1fae5] px-3 py-1 text-[11px] font-semibold text-[#047857]">ACTIVE</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteDistrict(selectedDistrict)}
                    className="w-full flex items-center justify-center gap-2 rounded-3xl border border-red-200 bg-white px-5 py-3 text-sm font-bold text-red-700 transition hover:bg-red-50"
                  >
                    <span className="material-symbols-outlined">delete</span>
                    Remove District
                  </button>
                </div>
              )}
            </article>
          </div>
        </div>
      </div>
      </main>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4" role="dialog" aria-modal="true">
          <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-[28px] bg-white p-8 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-[#00236f]">Add District</h2>
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

            <form onSubmit={handleSubmitAdd} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="district-name" className="text-sm font-semibold text-slate-700">District Name</label>
                <input
                  id="district-name"
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  required
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-[#00236f] focus:ring-2 focus:ring-[#00236f]/10 focus:outline-none"
                  placeholder="e.g. Ntcheu"
                />
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
                  {saving ? 'Saving...' : 'Create District'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default DistrictSetup
