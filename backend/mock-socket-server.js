const http = require('http')
const { Server } = require('socket.io')

const PORT = Number(process.env.MOCK_SOCKET_PORT || 4000)
const corsOrigin = process.env.MOCK_SOCKET_CORS_ORIGIN || 'http://localhost:5173'

const httpServer = http.createServer((request, response) => {
  if (request.method === 'POST' && request.url === '/trigger-sos') {
    emitSosAlert()
    response.writeHead(202, { 'Content-Type': 'application/json' })
    response.end(JSON.stringify({ message: 'SOS alert emitted' }))
    return
  }

  response.writeHead(404, { 'Content-Type': 'application/json' })
  response.end(JSON.stringify({ message: 'Use POST /trigger-sos' }))
})

const io = new Server(httpServer, { cors: { origin: corsOrigin } })

io.on('connection', (socket) => {
  console.log(`Dashboard connected: ${socket.id}`)
})

function emitSosAlert() {
  const payload = {
    reportId: `mock-${Date.now()}`,
    location: 'Lilongwe',
    timestamp: new Date().toISOString(),
  }
  io.emit('sos-alert', payload)
  console.log('Emitted sos-alert:', payload)
}

setInterval(emitSosAlert, 10_000)
httpServer.listen(PORT, () => {
  console.log(`Mock Socket.io server listening on http://localhost:${PORT}`)
  console.log(`Manual trigger: POST http://localhost:${PORT}/trigger-sos`)
})