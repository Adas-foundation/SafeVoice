import { useState } from 'react'
import { sendBroadcast } from '../services/notificationsApi'

export default function BroadcastModal({ isOpen, onClose, onSent }) {
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [channels, setChannels] = useState({ email: true, sms: false })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const payload = {
        subject,
        message,
        channels: Object.keys(channels).filter((k) => channels[k]),
      }
      await sendBroadcast(payload)
      setSubject('')
      setMessage('')
      onSent?.()
      onClose()
    } catch (err) {
      console.error('Broadcast failed', err)
      setError(err.message || 'Failed to send broadcast')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-lg">
        <div className="flex items-start justify-between">
          <h3 className="text-lg font-semibold">Broadcast Message</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Subject</label>
            <input value={subject} onChange={(e) => setSubject(e.target.value)} className="mt-1 block w-full rounded-md border px-3 py-2" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Message</label>
            <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={5} className="mt-1 block w-full rounded-md border px-3 py-2" required />
          </div>

          <div className="flex items-center gap-4">
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" checked={channels.email} onChange={(e) => setChannels((c) => ({ ...c, email: e.target.checked }))} />
              <span className="text-sm">Email</span>
            </label>
            <label className="inline-flex items-center gap-2">
              <input type="checkbox" checked={channels.sms} onChange={(e) => setChannels((c) => ({ ...c, sms: e.target.checked }))} />
              <span className="text-sm">SMS</span>
            </label>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex items-center justify-end gap-3">
            <button type="button" onClick={onClose} className="rounded-md px-4 py-2 bg-slate-100">Cancel</button>
            <button type="submit" disabled={loading} className="rounded-md bg-[#1e3a8a] text-white px-4 py-2">
              {loading ? 'Sending…' : 'Send Broadcast'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
