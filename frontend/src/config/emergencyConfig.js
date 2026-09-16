import { API_URL, authHeaders, handleResponse } from '../services/api'

// Assumption: the teammate's API is mounted at /api/emergency and Socket.IO accepts
// the same bearer token through auth. Replace these values with the agreed contract.
export const emergencyConfig = {
  apiBaseUrl: import.meta.env.VITE_EMERGENCY_API_URL || `${API_URL}/api/emergency`,
  socketUrl: import.meta.env.VITE_EMERGENCY_SOCKET_URL || 'http://localhost:4000',
  socketRoom: import.meta.env.VITE_EMERGENCY_SOCKET_ROOM || 'emergency-dashboard',
  socketAuthMode: import.meta.env.VITE_EMERGENCY_SOCKET_AUTH_MODE || 'auth',
  alertEvent: import.meta.env.VITE_EMERGENCY_ALERT_EVENT || 'new-emergency-alert',
  statusEvent: import.meta.env.VITE_EMERGENCY_STATUS_EVENT || 'emergency-alert-updated',
}

export function emergencyAuth() {
  return authHeaders()
}

export async function emergencyResponse(response) {
  return handleResponse(response)
}
