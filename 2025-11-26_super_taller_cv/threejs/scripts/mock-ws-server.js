#!/usr/bin/env node
// Servidor WebSocket mock para pruebas locales (puerto 8765)
const WebSocket = require('ws')

const PORT = process.env.MOCK_WS_PORT || 8765
const wss = new WebSocket.Server({ port: PORT })

console.log(`Mock WebSocket server listening on ws://localhost:${PORT}`)

function broadcastSampleMessages(ws) {
  // Enviar mensajes de ejemplo periódicamente
  const sendDetection = () => {
    const detections = [
      { class: 'person', confidence: Math.random(), x: Math.random() * 4, y: 1, z: Math.random() * 4 }
    ]
    ws.send(JSON.stringify({ type: 'detection', payload: detections }))
  }

  const sendGesture = () => {
    const gestures = ['thumbs_up', 'peace', 'none']
    const g = gestures[Math.floor(Math.random() * gestures.length)]
    ws.send(JSON.stringify({ type: 'gesture', payload: { type: g } }))
  }

  const sendVoice = () => {
    const cmds = ['Turn red', 'Make it blue', 'bright', 'dark', 'spin']
    const cmd = cmds[Math.floor(Math.random() * cmds.length)]
    ws.send(JSON.stringify({ type: 'voice', payload: cmd }))
  }

  const timers = []
  timers.push(setInterval(sendDetection, 3000))
  timers.push(setInterval(sendGesture, 4500))
  timers.push(setInterval(sendVoice, 7000))

  return () => timers.forEach(t => clearInterval(t))
}

wss.on('connection', (ws) => {
  console.log('Client connected')
  ws.send(JSON.stringify({ type: 'info', payload: 'Connected to mock WS server' }))

  const stopTimers = broadcastSampleMessages(ws)

  ws.on('message', (msg) => {
    console.log('Received from client:', msg.toString())
  })

  ws.on('close', () => {
    console.log('Client disconnected')
    stopTimers()
  })
})

wss.on('listening', () => {})

wss.on('error', (err) => {
  console.error('Mock WS Server error:', err)
  process.exit(1)
})
