import { useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'

// Change this one line when the real Socket.io backend is available.
const SOCKET_SERVER_URL = import.meta.env.VITE_SOCKET_SERVER_URL || 'http://localhost:4000'
const ALERT_AUDIO_URL = 'https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg'

function formatTimestamp(timestamp) {
  const date = new Date(timestamp)
  return Number.isNaN(date.getTime()) ? timestamp : date.toLocaleString()
}

export default function SosAlertListener() {
  const [alert, setAlert] = useState(null)
  const [alertsEnabled, setAlertsEnabled] = useState(() => sessionStorage.getItem('sos-alerts-enabled') === 'true')
  const [connected, setConnected] = useState(false)
  const audioRef = useRef(null)

  useEffect(() => {
    const socket = io(SOCKET_SERVER_URL)
    socket.on('connect', () => setConnected(true))
    socket.on('disconnect', () => setConnected(false))
    socket.on('sos-alert', (payload) => {
      setAlert(payload)
      const audio = audioRef.current
      if (audio && alertsEnabled) {
        audio.currentTime = 0
        audio.play().catch(() => {})
      }
    })
    return () => socket.disconnect()
  }, [alertsEnabled])

  function enableAlerts() {
    const audio = audioRef.current
    if (audio) {
      audio.volume = 0
      audio.play()
        .then(() => {
          audio.pause()
          audio.currentTime = 0
          audio.volume = 1
        })
        .catch(() => { audio.volume = 1 })
    }
    sessionStorage.setItem('sos-alerts-enabled', 'true')
    setAlertsEnabled(true)
  }

  return (
    <>
      <audio ref={audioRef} preload="auto" src={ALERT_AUDIO_URL} />
      {!alertsEnabled && (
        <section className="mb-6 flex flex-col gap-4 rounded-2xl border border-amber-300 bg-amber-50 p-5 text-amber-950 shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold">Enable emergency alert sound</p>
            <p className="mt-1 text-sm text-amber-800">Allow this dashboard to play a ringtone when an SOS alert arrives.</p>
          </div>
          <button type="button" onClick={enableAlerts} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-3 font-semibold text-white transition hover:bg-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2">
            <span className="material-symbols-outlined" aria-hidden="true">notifications_active</span>
            Enable Alerts
          </button>
        </section>
      )}
      {alert && (
        <section role="alert" aria-live="assertive" className="mb-6 rounded-2xl border-2 border-red-300 bg-red-50 p-5 shadow-lg shadow-red-100">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex gap-4">
              <span className="material-symbols-outlined mt-0.5 text-3xl text-red-700" aria-hidden="true">warning</span>
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-red-700">Emergency SOS alert</p>
                <h2 className="mt-1 text-xl font-bold text-red-950">Immediate response may be required</h2>
                <dl className="mt-4 grid gap-x-8 gap-y-2 text-sm text-red-900 sm:grid-cols-3">
                  <div><dt className="font-semibold text-red-700">Report ID</dt><dd>{alert.reportId || 'Unknown'}</dd></div>
                  <div><dt className="font-semibold text-red-700">Location</dt><dd>{alert.location || 'Unknown'}</dd></div>
                  <div><dt className="font-semibold text-red-700">Received</dt><dd>{formatTimestamp(alert.timestamp)}</dd></div>
                </dl>
              </div>
            </div>
            <button type="button" onClick={() => setAlert(null)} className="self-end rounded-lg p-2 text-red-700 hover:bg-red-100 sm:self-start" aria-label="Dismiss SOS alert" title="Dismiss alert">
              <span className="material-symbols-outlined" aria-hidden="true">close</span>
            </button>
          </div>
        </section>
      )}
      <p className="mb-4 text-right text-xs text-slate-500" aria-live="polite">
        <span className={`mr-1 inline-block h-2 w-2 rounded-full ${connected ? 'bg-emerald-500' : 'bg-slate-400'}`} aria-hidden="true" />
        {connected ? 'SOS live connection active' : 'Connecting to SOS alert service...'}
      </p>
    </>
  )
}