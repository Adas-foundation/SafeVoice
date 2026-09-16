import { useEffect, useRef, useState } from 'react'
import { CircleMarker, MapContainer, Popup, TileLayer } from 'react-leaflet'
import { io } from 'socket.io-client'
import 'leaflet/dist/leaflet.css'
import { emergencyAuth, emergencyConfig } from '../config/emergencyConfig'
import { updateSosAlertStatus } from '../services/sosApi'

const ALERT_AUDIO_URL = 'https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg'

/** @typedef {{ alertId: string, latitude?: number, longitude?: number, timestamp: string | number | Date, userId?: string | null, message?: string, status?: string }} EmergencyAlert */

function formatTimestamp(timestamp) {
  const date = new Date(timestamp)
  return Number.isNaN(date.getTime()) ? String(timestamp || 'Unknown') : date.toLocaleString()
}

function normalizeAlert(payload) {
  return {
    ...payload,
    alertId: payload.alertId || payload.id || `alert-${Date.now()}`,
    latitude: Number.isFinite(Number(payload.latitude)) ? Number(payload.latitude) : undefined,
    longitude: Number.isFinite(Number(payload.longitude)) ? Number(payload.longitude) : undefined,
    status: payload.status || 'pending',
  }
}

function AlertMap({ alert }) {
  if (!Number.isFinite(alert.latitude) || !Number.isFinite(alert.longitude)) {
    return <p className="rounded-xl bg-slate-100 p-4 text-sm text-slate-600">Location coordinates were not provided.</p>
  }

  return (
    <MapContainer center={[alert.latitude, alert.longitude]} zoom={14} scrollWheelZoom={false} className="h-56 w-full rounded-xl">
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <CircleMarker center={[alert.latitude, alert.longitude]} radius={12} pathOptions={{ color: '#991b1b', fillColor: '#ef4444', fillOpacity: 0.85 }}>
        <Popup>Emergency alert location</Popup>
      </CircleMarker>
    </MapContainer>
  )
}

export default function SosAlertListener() {
  const [alerts, setAlerts] = useState(/** @type {EmergencyAlert[]} */ ([]))
  const [selectedAlertId, setSelectedAlertId] = useState(null)
  const [alertsEnabled, setAlertsEnabled] = useState(() => sessionStorage.getItem('sos-alerts-enabled') === 'true')
  const [connected, setConnected] = useState(false)
  const [statusError, setStatusError] = useState('')
  const audioRef = useRef(/** @type {HTMLAudioElement | null} */ (null))
  const alertsEnabledRef = useRef(alertsEnabled)

  useEffect(() => {
    alertsEnabledRef.current = alertsEnabled
  }, [alertsEnabled])

  useEffect(() => {
    const token = localStorage.getItem('safereport_token')
    const auth = emergencyConfig.socketAuthMode === 'query'
      ? undefined
      : { token: token || undefined, ...emergencyAuth() }
    const query = emergencyConfig.socketAuthMode === 'query' && token ? { token } : undefined
    const socket = io(emergencyConfig.socketUrl, { auth, query })

    socket.on('connect', () => {
      setConnected(true)
      // Assumption: the teammate's dashboard room uses a join-room event.
      socket.emit('join-room', emergencyConfig.socketRoom)
    })
    socket.on('disconnect', () => setConnected(false))
    socket.on(emergencyConfig.alertEvent, (payload) => {
      const nextAlert = normalizeAlert(payload)
      setAlerts((current) => [nextAlert, ...current.filter((alert) => alert.alertId !== nextAlert.alertId)])
      setSelectedAlertId(nextAlert.alertId)
      const audio = audioRef.current
      if (audio && alertsEnabledRef.current) {
        audio.currentTime = 0
        audio.play().catch(() => {})
      }
    })
    socket.on(emergencyConfig.statusEvent, (payload) => {
      const updated = normalizeAlert(payload)
      setAlerts((current) => current.map((alert) => alert.alertId === updated.alertId ? { ...alert, ...updated } : alert))
    })

    return () => socket.disconnect()
  }, [])

  const selectedAlert = alerts.find((alert) => alert.alertId === selectedAlertId) || alerts[0]

  function enableAlerts() {
    const audio = audioRef.current
    if (audio) {
      audio.volume = 0
      audio.play().then(() => {
        audio.pause()
        audio.currentTime = 0
        audio.volume = 1
      }).catch(() => { audio.volume = 1 })
    }
    sessionStorage.setItem('sos-alerts-enabled', 'true')
    setAlertsEnabled(true)
  }

  async function updateStatus(status) {
    if (!selectedAlert) return
    const previousStatus = selectedAlert.status
    setStatusError('')
    setAlerts((current) => current.map((alert) => alert.alertId === selectedAlert.alertId ? { ...alert, status } : alert))
    try {
      const updated = await updateSosAlertStatus(selectedAlert.alertId, status)
      if (updated?.status) {
        setAlerts((current) => current.map((alert) => alert.alertId === selectedAlert.alertId ? { ...alert, ...normalizeAlert(updated) } : alert))
      }
    } catch (error) {
      setAlerts((current) => current.map((alert) => alert.alertId === selectedAlert.alertId ? { ...alert, status: previousStatus } : alert))
      setStatusError(error.message || 'Unable to update alert status.')
    }
  }

  return (
    <section className="mb-6 space-y-4" aria-label="Live emergency alerts">
      <audio ref={audioRef} preload="auto" src={ALERT_AUDIO_URL} />
      {!alertsEnabled && (
        <div className="flex flex-col gap-4 rounded-2xl border border-amber-300 bg-amber-50 p-5 text-amber-950 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold">Enable emergency alert sound</p>
            <p className="mt-1 text-sm text-amber-800">Allow this dashboard to play a ringtone when an SOS alert arrives.</p>
          </div>
          <button type="button" onClick={enableAlerts} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-3 font-semibold text-white transition hover:bg-amber-600">
            <span className="material-symbols-outlined" aria-hidden="true">notifications_active</span>
            Enable Alerts
          </button>
        </div>
      )}
      <div className="flex items-center justify-end gap-2 text-xs text-slate-500" aria-live="polite">
        <span className={`inline-block h-2 w-2 rounded-full ${connected ? 'bg-emerald-500' : 'bg-slate-400'}`} aria-hidden="true" />
        {connected ? 'SOS live connection active' : 'Connecting to SOS alert service...'}
      </div>
      {selectedAlert && (
        <article className="rounded-2xl border-2 border-red-300 bg-red-50 p-5 shadow-lg shadow-red-100" role="alert" aria-live="assertive">
          <div className="flex flex-col gap-5 lg:flex-row lg:justify-between">
            <div className="min-w-0">
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-red-700">Emergency SOS alert</p>
              <h2 className="mt-1 text-xl font-bold text-red-950">Immediate response may be required</h2>
              <dl className="mt-4 grid gap-x-8 gap-y-2 text-sm text-red-900 sm:grid-cols-2">
                <div><dt className="font-semibold text-red-700">Alert ID</dt><dd className="break-all">{selectedAlert.alertId}</dd></div>
                <div><dt className="font-semibold text-red-700">Received</dt><dd>{formatTimestamp(selectedAlert.timestamp)}</dd></div>
                <div><dt className="font-semibold text-red-700">Coordinates</dt><dd>{selectedAlert.latitude ?? 'Unknown'}, {selectedAlert.longitude ?? 'Unknown'}</dd></div>
                <div><dt className="font-semibold text-red-700">Status</dt><dd className="capitalize">{selectedAlert.status}</dd></div>
              </dl>
              {selectedAlert.message && <p className="mt-4 rounded-xl bg-white/70 p-3 text-sm text-red-950">{selectedAlert.message}</p>}
            </div>
            <div className="w-full shrink-0 lg:w-[360px]"><AlertMap alert={selectedAlert} /></div>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <button type="button" onClick={() => updateStatus('acknowledged')} disabled={selectedAlert.status === 'acknowledged'} className="rounded-xl bg-amber-600 px-4 py-2 font-semibold text-white disabled:opacity-50">Acknowledge</button>
            <button type="button" onClick={() => updateStatus('resolved')} disabled={selectedAlert.status === 'resolved'} className="rounded-xl bg-emerald-700 px-4 py-2 font-semibold text-white disabled:opacity-50">Mark Resolved</button>
            {statusError && <p className="self-center text-sm text-red-700">{statusError}</p>}
          </div>
        </article>
      )}
      {alerts.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-4"><h2 className="font-semibold text-slate-900">Live emergency alerts ({alerts.length})</h2></div>
          <div className="divide-y divide-slate-100">
            {alerts.map((alert) => (
              <button type="button" key={alert.alertId} onClick={() => setSelectedAlertId(alert.alertId)} className={`flex w-full items-center justify-between gap-4 px-5 py-4 text-left hover:bg-red-50 ${alert.alertId === selectedAlert?.alertId ? 'bg-red-50' : ''}`}>
                <span className="min-w-0"><span className="block truncate font-semibold text-slate-900">{alert.message || 'Emergency SOS alert'}</span><span className="block text-xs text-slate-500">{formatTimestamp(alert.timestamp)}</span></span>
                <span className="shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold capitalize text-slate-700">{alert.status}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
