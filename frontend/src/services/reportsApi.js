import { API_URL, authHeaders, handleResponse } from './api'

// GET /reports
export async function getReports(params = {}) {
  const query = new URLSearchParams(params).toString()
  const response = await fetch(`${API_URL}/reports${query ? `?${query}` : ''}`, {
    headers: authHeaders(),
  })
  return handleResponse(response)
}

// GET /reports/:id
export async function getReportById(id) {
  const response = await fetch(`${API_URL}/reports/${id}`, {
    headers: authHeaders(),
  })
  return handleResponse(response)
}

// GET /reports/by-reference/:referenceNumber
export async function getReportByReference(referenceNumber) {
  const response = await fetch(`${API_URL}/reports/by-reference/${encodeURIComponent(referenceNumber)}`, {
    headers: authHeaders(),
  })
  return handleResponse(response)
}

// POST /reports — matches CreateReportDto: description, districtId
export async function createReport(formData) {
  const payload = {
    description: buildDescription(formData),
    districtId: formData.districtId,
  }

  const response = await fetch(`${API_URL}/reports`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload),
  })

  return handleResponse(response)
}

// PATCH /reports/:id
export async function updateReport(id, updates) {
  const response = await fetch(`${API_URL}/reports/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(updates),
  })
  return handleResponse(response)
}

// DELETE /reports/:id
export async function deleteReport(id) {
  const response = await fetch(`${API_URL}/reports/${id}`, {
    method: 'DELETE',
    headers: authHeaders(),
  })
  return handleResponse(response)
}

// GET /reports/dashboard
export async function getReportsDashboard() {
  const response = await fetch(`${API_URL}/reports/dashboard`, {
    headers: authHeaders(),
  })
  return handleResponse(response)
}

// GET /reports/stats — public, used by the public landing page
export async function getReportsStats() {
  const response = await fetch(`${API_URL}/reports/stats`)
  return handleResponse(response)
}

// GET /case-status-history/report/:reportId
export async function getCaseStatusHistory(reportId) {
  const response = await fetch(`${API_URL}/case-status-history/report/${reportId}`, {
    headers: authHeaders(),
  })
  return handleResponse(response)
}

// POST /evidence/upload — backend expects multipart form field 'report_id'
// (see CreateEvidenceDto) plus the file under the field name 'file'.
export async function uploadEvidence(reportId, file) {
  const body = new FormData()
  body.append('report_id', reportId)
  body.append('file', file)

  const response = await fetch(`${API_URL}/evidence/upload`, {
    method: 'POST',
    headers: authHeaders(), // no Content-Type — browser sets multipart boundary
    body,
  })

  return handleResponse(response)
}

// Uploads all evidence files for a report sequentially, after the
// report itself has been created and we have its id.
export async function uploadAllEvidence(reportId, files) {
  const results = []
  for (const file of files) {
    // sequential (not Promise.all) so one failure doesn't cancel the rest mid-flight
    const result = await uploadEvidence(reportId, file).catch((err) => {
      console.error(`Failed to upload evidence file "${file.name}"`, err)
      return { error: true, fileName: file.name, message: err.message }
    })
    results.push(result)
  }
  return results
}

// Builds a single description string carrying the fields your
// CreateReportDto/Report entity don't currently have columns for
// (incident type, victim details, anonymity, emergency/threat flags,
// landmark, and lat/lng — since incidentLocation isn't in the DTO).
export function buildDescription(formData) {
  const lines = []

  if (formData.incidentType) lines.push(`Incident Type: ${formData.incidentType}`)
  lines.push(`Anonymous Report: ${formData.isAnonymous ? 'Yes' : 'No'}`)

  if (!formData.isAnonymous) {
    lines.push(`Victim Name: ${formData.victimName || 'N/A'}`)
    lines.push(`Victim Age Range: ${formData.victimAgeRange || 'N/A'}`)
    lines.push(`Victim Gender: ${formData.victimGender || 'N/A'}`)
    lines.push(`Victim Phone: ${formData.victimPhone || 'N/A'}`)
  }

  lines.push(`Needs Emergency Assistance: ${formData.needsEmergencyHelp ? 'Yes' : 'No'}`)
  lines.push(`Incident Date/Time: ${formData.incidentDate || 'N/A'} ${formData.incidentTime || ''}`.trim())
  lines.push(`Immediate Threat Remaining: ${formData.immediateThreat || 'Not specified'}`)
  lines.push(`Landmark: ${formData.landmark || 'N/A'}`)

  if (formData.latitude != null && formData.longitude != null) {
    lines.push(`Coordinates: ${formData.latitude}, ${formData.longitude}`)
  }

  lines.push('')
  lines.push('Description:')
  lines.push(formData.whatHappened || '(none provided)')

  return lines.join('\n')
}
