import { emergencyAuth, emergencyConfig, emergencyResponse } from '../config/emergencyConfig'

// Assumption: POST /api/emergency/alert accepts the shared emergency alert payload.
export async function createSosAlert(payload) {
  const response = await fetch(`${emergencyConfig.apiBaseUrl}/alert`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...emergencyAuth() },
    body: JSON.stringify(payload),
  })
  return emergencyResponse(response)
}

// Assumption: PATCH /api/emergency/alert/:id/status accepts { status }.
export async function updateSosAlertStatus(alertId, status) {
  const response = await fetch(`${emergencyConfig.apiBaseUrl}/alert/${alertId}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...emergencyAuth() },
    body: JSON.stringify({ status }),
  })
  return emergencyResponse(response)
}
